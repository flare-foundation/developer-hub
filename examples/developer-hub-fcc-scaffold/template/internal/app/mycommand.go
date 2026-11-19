package app

import (
	"context"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/flare-foundation/fce-go-scaffold/pkg/extension"
	"github.com/flare-foundation/fce-go-scaffold/pkg/payload"
	"github.com/flare-foundation/go-flare-common/pkg/tee/instruction"
)

// errNoMessage refuses an empty message, on both channels.
var errNoMessage = extension.PublicError("message required", nil)

// myCommandArgs is abi.encode(sender, message), as the contract builds it;
// names map to myCommandPayload's fields.
var myCommandArgs = abi.Arguments{
	{Name: "sender", Type: abiType("address")},
	{Name: "message", Type: abiType("bytes")},
}

// myCommandPayload carries the caller: tee-node doesn't pass it, so the contract encodes msg.sender.
type myCommandPayload struct {
	Sender  common.Address
	Message []byte
}

// myCommand echoes the sender and the message back, ABI-encoded.
//
// TODO: replace it with your command. tee-node doesn't remember instructions,
// so one can arrive again, or after a newer one: keep it idempotent, as this
// echo is, or refuse replays; where order matters, have the contract number
// them, as examples/direct's setAdmin does.
func myCommand(_ context.Context, i *instruction.DataFixed) ([]byte, extension.Run, error) {
	var p myCommandPayload
	if err := payload.DecodeABI(myCommandArgs, i.OriginalMessage, &p); err != nil {
		return nil, nil, extension.PublicError("invalid payload", err)
	}
	if len(p.Message) == 0 {
		return nil, nil, errNoMessage
	}

	out, err := myCommandArgs.Pack(p.Sender, p.Message)
	if err != nil {
		return nil, nil, extension.PublicError("encoding the result", err)
	}
	return out, nil, nil
}

func abiType(t string) abi.Type {
	typ, err := abi.NewType(t, "", nil)
	if err != nil {
		panic(err)
	}
	return typ
}
