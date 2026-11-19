// Command extension serves tee-node's calls to the extension until it is stopped.
package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/flare-foundation/fce-go-scaffold/pkg/extension"
	"github.com/flare-foundation/fce-go-scaffold/template/internal/app"
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

	// TODO: read your own variables here, and list each in the Dockerfile's
	// launch-policy label and the launcher's --env.

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGTERM, os.Interrupt)
	defer stop()

	srv := extension.New(extension.WithSignPort(env.SignPort))
	app.Register(srv)
	return srv.ListenAndServe(ctx, env.ExtensionPort)
}
