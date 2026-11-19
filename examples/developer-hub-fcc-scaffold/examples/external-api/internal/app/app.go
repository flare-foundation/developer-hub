// Package app is the external-api example: a price, as the median of several
// public APIs, fetched over TLS in the background and posted as it arrives.
// The instruction's final answer is signed with the TEE key, for the contract.
package app

import (
	"context"
	"net/http"

	"github.com/ethereum/go-ethereum/common"
	"github.com/flare-foundation/fce-go-scaffold/pkg/extension"
	"github.com/flare-foundation/go-flare-common/pkg/tee/op"
)

// The extension's op pairs. Each pair belongs to one channel, instructions or
// direct actions, never both; an op type may have commands on both.
const (
	// OPTypePrices names the extension.
	OPTypePrices op.Type = "PRICES"
	// OPCommandGetPrice arrives as an instruction, sent through the contract; ABI in and out.
	OPCommandGetPrice op.Command = "GET_PRICE"
	// OPCommandGetPriceDirect arrives as a direct action, posted to the proxy; JSON in and out.
	OPCommandGetPriceDirect op.Command = "GET_PRICE_DIRECT"
)

// Register registers the extension's handlers on s, fetching from the sources
// below over http.DefaultTransport and signing with signer.
func Register(s *extension.Server, signer Signer) {
	p := newPrices(newClient(http.DefaultTransport), sources, signer)
	s.RegisterInstructionHandler(OPTypePrices, OPCommandGetPrice, p.getPrice)
	s.RegisterDirectHandler(OPTypePrices, OPCommandGetPriceDirect, p.getPriceDirect)
}

// Signer signs with the TEE key, as *node.Client does through the sign port.
type Signer interface {
	SignTEE(ctx context.Context, msg []byte) ([]byte, error)
}

func newPrices(client *http.Client, srcs []source, signer Signer) *prices {
	return &prices{client: client, sources: srcs, signer: signer, answered: map[common.Hash]bool{}}
}
