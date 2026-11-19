package app

import (
	"context"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/flare-foundation/fce-go-scaffold/pkg/extension"
	"github.com/flare-foundation/fce-go-scaffold/pkg/payload"
	"github.com/flare-foundation/go-flare-common/pkg/tee/instruction"
)

var errOldNonce = extension.PublicError("nonce not above the last", nil)

// setAdminArgs is abi.encode(nonce, admin), as the contract's setAdmin builds it.
var setAdminArgs = abi.Arguments{
	{Name: "nonce", Type: abiType("uint64")},
	{Name: "admin", Type: abiType("address")},
}

// setAdmin sets the admin; the zero address removes it. Only the contract's
// owner reaches it: the chain takes this extension's instructions only from its
// registered contract, and tee-node checks the data providers signed them.
// tee-node doesn't remember instructions, so one can arrive again, or after a
// newer one: the contract numbers them, and only a nonce above the last applies.
// It answers the payload, abi.encode(nonce, admin).
func (st *state) setAdmin(_ context.Context, i *instruction.DataFixed) ([]byte, extension.Run, error) {
	var p struct {
		Nonce uint64
		Admin common.Address
	}
	if err := payload.DecodeABI(setAdminArgs, i.OriginalMessage, &p); err != nil {
		return nil, nil, extension.PublicError("invalid payload", err)
	}

	st.mu.Lock()
	defer st.mu.Unlock()
	if p.Nonce <= st.nonce {
		return nil, nil, errOldNonce
	}
	st.nonce, st.admin = p.Nonce, p.Admin
	return i.OriginalMessage, nil, nil
}

func abiType(t string) abi.Type {
	typ, err := abi.NewType(t, "", nil)
	if err != nil {
		panic(err)
	}
	return typ
}
