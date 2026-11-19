// Command extension serves tee-node's calls to the extension until it is stopped.
package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/flare-foundation/fce-go-scaffold/examples/external-api/internal/app"
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

	// long-running results are posted through the sign port, and the prices signed there
	srv := extension.New(extension.WithSignPort(env.SignPort))
	app.Register(srv, node.New(env.SignPort))
	return srv.ListenAndServe(ctx, env.ExtensionPort)
}
