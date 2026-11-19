package app

import (
	"context"

	"github.com/ethereum/go-ethereum/common"
)

// stateVersion names report's encoding: the contract's STATE_VERSION,
// right-padded as op names are.
var stateVersion = func() (h common.Hash) {
	copy(h[:], "SECRETS_STATE_V1")
	return h
}()

// report serves GET /state: abi.encode(nonce, admin), the last setAdmin
// applied, (0, 0) before any. The contract, the registered state verifier,
// checks it against what it sent this TEE. Only what came from the chain is
// reported: the chain can't check the secrets or the counters.
func (st *state) report(context.Context) (common.Hash, []byte, error) {
	st.mu.Lock()
	defer st.mu.Unlock()
	b, err := setAdminArgs.Pack(st.nonce, st.admin)
	return stateVersion, b, err
}
