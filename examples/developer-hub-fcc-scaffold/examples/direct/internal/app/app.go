// Package app is the direct example: an admin, set on-chain by the contract's
// owner, provisions secrets through direct actions it signs, each encrypted to
// the TEE's public key. The owner also runs hidden auctions in rounds: users
// bid through the contract, encrypted to the round's TEE, which names only the
// winner, signed for the contract.
//
// Anyone who saw a direct action can post it again, so each one is either
// idempotent, as PROVISION, or protected against replay, as ROTATE.
// GET /state reports the admin, which the contract checks as the state verifier.
package app

import (
	"context"
	"sync"

	"github.com/ethereum/go-ethereum/common"
	"github.com/flare-foundation/fce-go-scaffold/pkg/extension"
	"github.com/flare-foundation/go-flare-common/pkg/tee/op"
)

// The extension's op pairs. Each pair belongs to one channel, instructions or
// direct actions, never both; an op type may have commands on both.
const (
	// OPTypeSecrets names the extension.
	OPTypeSecrets op.Type = "SECRETS"
	// OPCommandSetAdmin arrives as an instruction: the contract's owner sets the admin.
	OPCommandSetAdmin op.Command = "SET_ADMIN"
	// OPCommandProvision arrives as a direct action: the admin stores a secret once.
	OPCommandProvision op.Command = "PROVISION"
	// OPCommandRotate arrives as a direct action: the admin replaces a secret.
	OPCommandRotate op.Command = "ROTATE"

	// OPTypeAuction names the auction.
	OPTypeAuction op.Type = "AUCTION"
	// OPCommandStart arrives as an instruction: the owner starts a round.
	OPCommandStart op.Command = "START"
	// OPCommandBid arrives as an instruction: a user bids, encrypted to the TEE's key.
	OPCommandBid op.Command = "BID"
	// OPCommandEnd arrives as an instruction: the owner ends a round after its deadline.
	OPCommandEnd op.Command = "END"
)

// Register registers the extension's handlers on s. tee is the TEE's address,
// which every signed payload must name; key decrypts the secrets and the bids,
// and signs each round's result.
func Register(s *extension.Server, tee common.Address, key TEEKey) {
	st := newState(tee, key)
	s.RegisterInstructionHandler(OPTypeSecrets, OPCommandSetAdmin, st.setAdmin)
	s.RegisterDirectHandler(OPTypeSecrets, OPCommandProvision, st.provision)
	s.RegisterDirectHandler(OPTypeSecrets, OPCommandRotate, st.rotate)
	s.RegisterInstructionHandler(OPTypeAuction, OPCommandStart, st.start)
	s.RegisterInstructionHandler(OPTypeAuction, OPCommandBid, st.bid)
	s.RegisterInstructionHandler(OPTypeAuction, OPCommandEnd, st.end)
	s.RegisterStateFunc(st.report)
}

// TEEKey decrypts and signs with the TEE key, as *node.Client does through the
// sign port.
type TEEKey interface {
	Decrypt(ctx context.Context, ciphertext []byte) ([]byte, error)
	SignTEE(ctx context.Context, msg []byte) ([]byte, error)
}

// state lives in memory. A reboot wipes it and gives the TEE a new address, so
// the owner sets the admin again, payloads signed before name another TEE, and
// the rounds open on it can't end.
type state struct {
	tee common.Address
	key TEEKey

	// tee-node runs instructions and direct actions concurrently
	mu       sync.Mutex
	nonce    uint64                    // the last setAdmin applied; 0: none
	admin    common.Address            // zero: none
	counters map[common.Address]uint64 // the last counter ROTATE accepted, per admin
	secrets  map[string]string
	rounds   map[uint64]*round // each start and bid pays a fee, which bounds their growth
}

func newState(tee common.Address, key TEEKey) *state {
	return &state{
		tee: tee, key: key,
		counters: map[common.Address]uint64{}, secrets: map[string]string{}, rounds: map[uint64]*round{},
	}
}
