// Command extension serves tee-node's calls to the extension until it is stopped.
package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/flare-foundation/fce-go-scaffold/examples/direct/internal/app"
	"github.com/flare-foundation/fce-go-scaffold/pkg/extension"
	"github.com/flare-foundation/fce-go-scaffold/pkg/node"
	"github.com/flare-foundation/go-flare-common/pkg/logger"
)

func main() {
	if err := run(); err != nil {
		logger.Fatalf("%v", err)
	}
}

func run() error {
	env, err := extension.ReadEnv()
	if err != nil {
		return fmt.Errorf("reading the environment: %w", err)
	}
	logger.Set(logger.Config{Level: env.LogLevel})

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGTERM, os.Interrupt)
	defer stop()

	// signed payloads name the TEE; waits for tee-node to listen
	n := node.New(env.SignPort)
	tee, err := n.TEEAddress(ctx)
	if ctx.Err() != nil {
		return nil // stopped while waiting
	}
	if err != nil {
		return fmt.Errorf("fetching the TEE's address: %w", err)
	}

	srv := extension.New()
	app.Register(srv, tee, n)
	return srv.ListenAndServe(ctx, env.ExtensionPort)
}
