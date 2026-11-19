// Package app is the extension's own code: its ops, handlers and state.
//
// TODO: replace the placeholder op with your extension's ops.
package app

import (
	"github.com/flare-foundation/fce-go-scaffold/pkg/extension"
	"github.com/flare-foundation/go-flare-common/pkg/tee/op"
)

// The extension's op pairs. Each pair belongs to one channel, instructions or
// direct actions, never both; an op type may have commands on both.
const (
	// OPTypeMyExtension names the extension. TODO: rename it.
	OPTypeMyExtension op.Type = "MY_EXTENSION"
	// OPCommandMyCommand arrives as an instruction, sent through the contract.
	OPCommandMyCommand op.Command = "MY_COMMAND"
	// OPCommandMyDirectCommand arrives as a direct action, posted to the proxy.
	OPCommandMyDirectCommand op.Command = "MY_DIRECT_COMMAND"
)

// Register registers the extension's handlers on s.
func Register(s *extension.Server) {
	s.RegisterInstructionHandler(OPTypeMyExtension, OPCommandMyCommand, myCommand)
	s.RegisterDirectHandler(OPTypeMyExtension, OPCommandMyDirectCommand, myDirectCommand)
}
