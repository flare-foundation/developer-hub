package app

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/flare-foundation/fce-go-scaffold/pkg/extension"
	"github.com/flare-foundation/fce-go-scaffold/pkg/payload"
	"github.com/flare-foundation/tee-node/pkg/types"
)

var (
	errNotProvisioned = extension.PublicError("not provisioned", nil)
	errOldCounter     = extension.PublicError("counter not above the last", nil)
)

// rotateMessage is the JSON the admin posts to the proxy's /direct.
type rotateMessage struct {
	TEE        common.Address `json:"teeId"`
	Counter    uint64         `json:"counter"`
	Name       string         `json:"name"`
	Ciphertext hexutil.Bytes  `json:"ciphertext"`
	Signature  hexutil.Bytes  `json:"signature"`
}

// rotateArgs is what the admin signs for ROTATE: the keccak256 of
// abi.encode(opType, opCommand, teeId, counter, name, ciphertext), under EIP-191.
var rotateArgs = abi.Arguments{
	{Name: "opType", Type: abiType("bytes32")},
	{Name: "opCommand", Type: abiType("bytes32")},
	{Name: "teeId", Type: abiType("address")},
	{Name: "counter", Type: abiType("uint256")},
	{Name: "name", Type: abiType("string")},
	{Name: "ciphertext", Type: abiType("bytes")},
}

// rotate replaces a provisioned secret. Replayed later, an old rotation would
// set the secret back, so the admin numbers them: each counter must be above
// the last one accepted from that admin. Counters live in memory, which is
// enough: after a reboot the TEE has a new address, which old payloads don't name.
func (st *state) rotate(ctx context.Context, d *types.DirectInstruction) ([]byte, extension.Run, error) {
	var m rotateMessage
	if err := payload.DecodeJSON(d.Message, &m); err != nil {
		return nil, nil, extension.PublicError("invalid payload", err)
	}
	if !validSecret(m.Name, m.Ciphertext) {
		return nil, nil, extension.PublicError("invalid payload", errors.New("name or ciphertext out of bounds"))
	}
	digest, err := rotateDigest(m.TEE, m.Counter, m.Name, m.Ciphertext)
	if err != nil {
		return nil, nil, extension.PublicError("invalid payload", err)
	}

	st.mu.Lock()
	defer st.mu.Unlock()
	if err := st.authorize(m.TEE, digest, m.Signature); err != nil {
		return nil, nil, err
	}
	if m.Counter <= st.counters[st.admin] {
		return nil, nil, errOldCounter
	}
	if _, ok := st.secrets[m.Name]; !ok {
		return nil, nil, errNotProvisioned
	}
	value, err := st.open(ctx, m.Ciphertext)
	if err != nil {
		return nil, nil, err
	}
	st.counters[st.admin] = m.Counter
	st.secrets[m.Name] = value

	out, err := json.Marshal(secret{Name: m.Name, Counter: m.Counter})
	if err != nil {
		return nil, nil, extension.PublicError("encoding the result", err)
	}
	return out, nil, nil
}

func rotateDigest(tee common.Address, counter uint64, name string, ciphertext []byte) (common.Hash, error) {
	b, err := rotateArgs.Pack(OPTypeSecrets.Hash(), OPCommandRotate.Hash(), tee, new(big.Int).SetUint64(counter), name, ciphertext)
	if err != nil {
		return common.Hash{}, fmt.Errorf("encoding the digest: %w", err)
	}
	return crypto.Keccak256Hash(b), nil
}
