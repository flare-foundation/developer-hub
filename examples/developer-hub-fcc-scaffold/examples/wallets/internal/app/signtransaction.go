package app

import (
	"context"
	"errors"
	"fmt"
	"math/big"
	"slices"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/rlp"
	"github.com/flare-foundation/fce-go-scaffold/pkg/extension"
	"github.com/flare-foundation/fce-go-scaffold/pkg/node"
	"github.com/flare-foundation/fce-go-scaffold/pkg/payload"
	"github.com/flare-foundation/go-flare-common/pkg/tee/instruction"
	"github.com/flare-foundation/go-flare-common/pkg/tee/structs/wallet"
)

// Refusals of SIGN_TRANSACTION.
var (
	errNoChainID  = extension.PublicError("chain id required", nil)
	errNoKey      = extension.PublicError("wallet key not on this TEE", nil)
	errNotEVM     = extension.PublicError("not an EVM signing key", nil)
	errCosigners  = extension.PublicError("cosigners differ from the wallet's", nil)
	errUnreadable = errors.New("unreadable public key")
	errOtherKey   = errors.New("signed by another key")
)

// The key type and signing algorithm of an EVM key that signs transactions,
// right-padded as the chain stores them.
var (
	keyTypeEVM = pad32("EVM")
	algoECDSA  = pad32("keccak256-secp256k1-ecdsa")
)

// txType is the contract's Transaction struct.
var txType = func() abi.Type {
	t, err := abi.NewType("tuple", "", []abi.ArgumentMarshaling{
		{Name: "chainId", Type: "uint256"},
		{Name: "to", Type: "address"},
		{Name: "value", Type: "uint256"},
		{Name: "data", Type: "bytes"},
		{Name: "gas", Type: "uint64"},
		{Name: "maxFeePerGas", Type: "uint256"},
		{Name: "maxPriorityFeePerGas", Type: "uint256"},
	})
	if err != nil {
		panic(err)
	}
	return t
}()

// signArgs is abi.encode(walletId, keyId, nonce, tx), as the contract builds it.
var signArgs = abi.Arguments{
	{Name: "walletId", Type: abiType("bytes32")},
	{Name: "keyId", Type: abiType("uint64")},
	{Name: "nonce", Type: abiType("uint64")},
	{Name: "tx", Type: txType},
}

type signMessage struct {
	WalletID common.Hash `abi:"walletId"`
	KeyID    uint64      `abi:"keyId"`
	Nonce    uint64      `abi:"nonce"`
	Tx       txFields    `abi:"tx"`
}

// txFields is the contract's Transaction struct; the fields keep its order.
type txFields struct {
	ChainID              *big.Int       `abi:"chainId"`
	To                   common.Address `abi:"to"`
	Value                *big.Int       `abi:"value"`
	Data                 []byte         `abi:"data"`
	Gas                  uint64         `abi:"gas"`
	MaxFeePerGas         *big.Int       `abi:"maxFeePerGas"`
	MaxPriorityFeePerGas *big.Int       `abi:"maxPriorityFeePerGas"`
}

// signTransaction signs an EIP-1559 transaction with the wallet key the
// contract names, and answers it raw, ready for eth_sendRawTransaction. It signs
// only with an EVM key, for an instruction whose cosigners are the wallet's, and
// a transaction with a chain id.
func (w *wallets) signTransaction(ctx context.Context, i *instruction.DataFixed) ([]byte, extension.Run, error) {
	var p signMessage
	if err := payload.DecodeABI(signArgs, i.OriginalMessage, &p); err != nil {
		return nil, nil, extension.PublicError("invalid payload", err)
	}
	if p.Tx.ChainID.Sign() == 0 {
		return nil, nil, errNoChainID
	}

	info, err := w.keys.KeyInfo(ctx, p.WalletID, p.KeyID)
	switch {
	case errors.Is(err, node.ErrNotFound):
		return nil, nil, errNoKey
	case err != nil:
		return nil, nil, extension.PublicError("can't read the wallet key", err)
	}
	if info.KeyType != keyTypeEVM || info.SigningAlgo != algoECDSA {
		return nil, nil, errNotEVM
	}
	// tee-node checks only that an instruction's own cosigners signed it
	if !sameCosigners(i, info.ConfigConstants) {
		return nil, nil, errCosigners
	}
	pub, err := crypto.UnmarshalPubkey(append([]byte{4}, info.PublicKey...))
	if err != nil {
		return nil, nil, extension.PublicError("can't read the wallet key", errUnreadable)
	}

	tx := types.NewTx(&types.DynamicFeeTx{
		ChainID:   p.Tx.ChainID,
		Nonce:     p.Nonce,
		GasTipCap: p.Tx.MaxPriorityFeePerGas,
		GasFeeCap: p.Tx.MaxFeePerGas,
		Gas:       p.Tx.Gas,
		To:        &p.Tx.To,
		Value:     p.Tx.Value,
		Data:      p.Tx.Data,
	})
	raw, err := w.sign(ctx, p.WalletID, p.KeyID, crypto.PubkeyToAddress(*pub), tx)
	if err != nil {
		return nil, nil, extension.PublicError("can't sign", err)
	}
	return raw, nil, nil
}

// sign has the wallet key sign tx, and returns it signed, as EIP-2718 bytes,
// once its sender checks out as from.
func (w *wallets) sign(ctx context.Context, walletID common.Hash, keyID uint64, from common.Address, tx *types.Transaction) ([]byte, error) {
	signer := types.NewLondonSigner(tx.ChainId())
	preimage, err := signingPreimage(tx)
	if err != nil {
		return nil, err
	}
	// the wallet key signs keccak256(preimage), which must be the hash chains check
	if crypto.Keccak256Hash(preimage) != signer.Hash(tx) {
		return nil, errors.New("preimage doesn't match the signing hash")
	}
	sig, err := w.keys.SignWallet(ctx, walletID, keyID, preimage)
	if err != nil {
		return nil, err
	}
	signed, err := tx.WithSignature(signer, sig)
	if err != nil {
		return nil, fmt.Errorf("adding the signature: %w", err)
	}
	if sender, err := types.Sender(signer, signed); err != nil || sender != from {
		return nil, errOtherKey
	}
	return signed.MarshalBinary()
}

// signingPreimage is what an EIP-1559 transaction's signature covers:
// 0x02 || rlp([chainId, nonce, tip, feeCap, gas, to, value, data, accessList]).
func signingPreimage(tx *types.Transaction) ([]byte, error) {
	b, err := rlp.EncodeToBytes([]any{
		tx.ChainId(), tx.Nonce(), tx.GasTipCap(), tx.GasFeeCap(), tx.Gas(), tx.To(), tx.Value(), tx.Data(), tx.AccessList(),
	})
	if err != nil {
		return nil, fmt.Errorf("encoding the transaction: %w", err)
	}
	return append([]byte{types.DynamicFeeTxType}, b...), nil
}

// sameCosigners reports whether the instruction carries the wallet's cosigners
// and threshold, compared as tee-node compares them for its own wallet ops.
func sameCosigners(i *instruction.DataFixed, c wallet.IWalletKeyManagerKeyConfigConstants) bool {
	if len(i.Cosigners) != len(c.Cosigners) || i.CosignersThreshold != c.CosignersThreshold {
		return false
	}
	for _, a := range c.Cosigners {
		if !slices.Contains(i.Cosigners, a) {
			return false
		}
	}
	return true
}

func abiType(t string) abi.Type {
	typ, err := abi.NewType(t, "", nil)
	if err != nil {
		panic(err)
	}
	return typ
}

func pad32(s string) (h [32]byte) {
	copy(h[:], s)
	return h
}
