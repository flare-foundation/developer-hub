package app

import (
	"context"
	"encoding/json"

	"github.com/flare-foundation/fce-go-scaffold/pkg/extension"
	"github.com/flare-foundation/fce-go-scaffold/pkg/payload"
	"github.com/flare-foundation/tee-node/pkg/types"
)

// myDirectCommandMessage is the JSON a client posts to the proxy's /direct, and the result.
type myDirectCommandMessage struct {
	Message string `json:"message"`
}

// myDirectCommand echoes the message back as JSON.
//
// TODO: decide who may trigger it. Anyone holding the proxy's API key can, and
// the handler can't tell who did: check an authorization the payload carries.
// Anyone who saw it can send it again, so keep it idempotent, as this echo is,
// or refuse replays, as examples/direct does.
func myDirectCommand(_ context.Context, d *types.DirectInstruction) ([]byte, extension.Run, error) {
	var m myDirectCommandMessage
	if err := payload.DecodeJSON(d.Message, &m); err != nil {
		return nil, nil, extension.PublicError("invalid payload", err)
	}
	if m.Message == "" {
		return nil, nil, errNoMessage
	}

	out, err := json.Marshal(m)
	if err != nil {
		return nil, nil, extension.PublicError("encoding the result", err)
	}
	return out, nil, nil
}
