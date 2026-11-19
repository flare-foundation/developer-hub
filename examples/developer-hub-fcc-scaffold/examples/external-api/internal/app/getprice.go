package app

import (
	"context"
	"math/big"
	"slices"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/flare-foundation/fce-go-scaffold/pkg/extension"
	"github.com/flare-foundation/fce-go-scaffold/pkg/payload"
	"github.com/flare-foundation/go-flare-common/pkg/tee/instruction"
)

var (
	// getPriceArgs is abi.encode(pair), as the contract's getPrice builds it.
	getPriceArgs = abi.Arguments{{Name: "pair", Type: abiType("string")}}
	// partialArgs is a partial result: abi.encode(source, price).
	partialArgs = abi.Arguments{{Name: "source", Type: abiType("string")}, {Name: "price", Type: abiType("uint256")}}
	// priceArgs is a price, as its signed message commits to it: abi.encode(pair, price, decimals, sources).
	priceArgs = abi.Arguments{
		{Name: "pair", Type: abiType("string")},
		{Name: "price", Type: abiType("uint256")},
		{Name: "decimals", Type: abiType("uint8")},
		{Name: "sources", Type: abiType("uint8")},
	}
	// finalArgs is the final result: abi.encode(pair, price, decimals, sources, signature),
	// what the contract's submitPrice takes.
	finalArgs = append(slices.Clone(priceArgs), abi.Argument{Name: "signature", Type: abiType("bytes")})
	// messageArgs is what the TEE signs: abi.encode(priceTag, instructionId, keccak256(price)).
	messageArgs = abi.Arguments{
		{Name: "tag", Type: abiType("bytes32")},
		{Name: "instructionId", Type: abiType("bytes32")},
		{Name: "priceHash", Type: abiType("bytes32")},
	}
)

// priceTag opens every signed price, the contract's PRICE_TAG: it keeps the
// signature from meaning anything else, such as one of tee-node's own.
var priceTag = func() (h common.Hash) {
	copy(h[:], "PRICES_PRICE_V1")
	return h
}()

// getPrice answers status 2 at once and fetches in the background: three APIs
// take longer than the node's 2 s. Each source's price is posted as a partial
// result as it arrives, then the median as the final one, ABI-encoded and
// signed for the contract. Each instruction is answered once.
func (p *prices) getPrice(_ context.Context, i *instruction.DataFixed) ([]byte, extension.Run, error) {
	var pair string
	if err := payload.DecodeABI(getPriceArgs, i.OriginalMessage, &pair); err != nil {
		return nil, nil, extension.PublicError("invalid payload", err)
	}
	if !slices.Contains(pairs, pair) {
		return nil, nil, errUnknownPair
	}
	if !p.answer(i.InstructionID) {
		return nil, nil, errAnswered
	}

	id := i.InstructionID
	return nil, func(ctx context.Context, prog *extension.Progress) ([]byte, error) {
		return p.quoteABI(ctx, id, pair, prog.Post)
	}, nil
}

// quoteABI posts each source's price through post, and returns the median,
// ABI-encoded and signed for instruction id.
func (p *prices) quoteABI(ctx context.Context, id common.Hash, pair string, post func(context.Context, []byte) error) ([]byte, error) {
	price, n, err := p.median(ctx, pair, func(src string, price *big.Int) {
		if b, err := partialArgs.Pack(src, price); err == nil {
			_ = post(ctx, b) // the library logs a dropped partial; the final still follows
		}
	})
	if err != nil {
		return nil, err
	}
	sources := uint8(n) //nolint:gosec // n is at most len(sources)

	msg, err := priceMessage(id, pair, price, sources)
	if err != nil {
		return nil, extension.PublicError("encoding the result", err)
	}
	sig, err := p.signer.SignTEE(ctx, msg)
	if err != nil {
		return nil, extension.PublicError("signing the result", err)
	}
	sig[crypto.RecoveryIDOffset] += 27 // the sign port gives V 0 or 1; ecrecover wants 27 or 28

	out, err := finalArgs.Pack(pair, price, uint8(decimals), sources, sig)
	if err != nil {
		return nil, extension.PublicError("encoding the result", err)
	}
	return out, nil
}

// priceMessage is what the TEE signs for a price: bound to the instruction
// that asked for it, which the contract accepts once.
func priceMessage(id common.Hash, pair string, price *big.Int, sources uint8) ([]byte, error) {
	b, err := priceArgs.Pack(pair, price, uint8(decimals), sources)
	if err != nil {
		return nil, err
	}
	return messageArgs.Pack(priceTag, id, crypto.Keccak256Hash(b))
}

func abiType(t string) abi.Type {
	typ, err := abi.NewType(t, "", nil)
	if err != nil {
		panic(err)
	}
	return typ
}
