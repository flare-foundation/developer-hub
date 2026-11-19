package app

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/flare-foundation/fce-go-scaffold/pkg/extension"
	"github.com/flare-foundation/fce-go-scaffold/pkg/payload"
	"github.com/flare-foundation/tee-node/pkg/types"
)

var errAnotherValue = extension.PublicError("provisioned with another value", nil)

// provisionMessage is the JSON the admin posts to the proxy's /direct. The
// secret is encrypted to the TEE's public key: the payload passes the proxy.
type provisionMessage struct {
	TEE        common.Address `json:"teeId"`
	Name       string         `json:"name"`
	Ciphertext hexutil.Bytes  `json:"ciphertext"`
	Signature  hexutil.Bytes  `json:"signature"`
}

// secret is the result of PROVISION and ROTATE. Results are public, so it never holds the secret.
type secret struct {
	Name    string `json:"name"`
	Counter uint64 `json:"counter,omitempty"`
}

// provisionArgs is what the admin signs for PROVISION: the keccak256 of
// abi.encode(opType, opCommand, teeId, name, ciphertext), under EIP-191.
var provisionArgs = abi.Arguments{
	{Name: "opType", Type: abiType("bytes32")},
	{Name: "opCommand", Type: abiType("bytes32")},
	{Name: "teeId", Type: abiType("address")},
	{Name: "name", Type: abiType("string")},
	{Name: "ciphertext", Type: abiType("bytes")},
}

// provision stores a secret once: the same secret again succeeds, another is
// refused. A replay, at any later time, changes nothing, so it needs no counter.
// Encryption is randomized, so it compares the decrypted secrets.
func (st *state) provision(ctx context.Context, d *types.DirectInstruction) ([]byte, extension.Run, error) {
	var m provisionMessage
	if err := payload.DecodeJSON(d.Message, &m); err != nil {
		return nil, nil, extension.PublicError("invalid payload", err)
	}
	if !validSecret(m.Name, m.Ciphertext) {
		return nil, nil, extension.PublicError("invalid payload", errors.New("name or ciphertext out of bounds"))
	}
	digest, err := provisionDigest(m.TEE, m.Name, m.Ciphertext)
	if err != nil {
		return nil, nil, extension.PublicError("invalid payload", err)
	}

	st.mu.Lock()
	defer st.mu.Unlock()
	if err := st.authorize(m.TEE, digest, m.Signature); err != nil {
		return nil, nil, err
	}
	value, err := st.open(ctx, m.Ciphertext)
	if err != nil {
		return nil, nil, err
	}
	if v, ok := st.secrets[m.Name]; ok && v != value {
		return nil, nil, errAnotherValue
	}
	st.secrets[m.Name] = value

	out, err := json.Marshal(secret{Name: m.Name})
	if err != nil {
		return nil, nil, extension.PublicError("encoding the result", err)
	}
	return out, nil, nil
}

func provisionDigest(tee common.Address, name string, ciphertext []byte) (common.Hash, error) {
	b, err := provisionArgs.Pack(OPTypeSecrets.Hash(), OPCommandProvision.Hash(), tee, name, ciphertext)
	if err != nil {
		return common.Hash{}, fmt.Errorf("encoding the digest: %w", err)
	}
	return crypto.Keccak256Hash(b), nil
}
