package app

import (
	"bytes"
	"context"
	"errors"

	"github.com/ethereum/go-ethereum/accounts"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/flare-foundation/fce-go-scaffold/pkg/extension"
)

// Refusals every admin action shares.
var (
	errNoAdmin  = extension.PublicError("no admin", nil)
	errWrongTEE = extension.PublicError("not for this TEE", nil)
	errNotAdmin = extension.PublicError("not signed by the admin", nil)
)

// Limits on a secret; the admin is trusted, they only keep mistakes small.
const (
	maxName       = 64
	maxValue      = 1024
	maxCiphertext = maxValue + eciesOverhead
)

// eciesOverhead is an ephemeral public key (65 bytes), an IV (16) and a MAC (32).
const eciesOverhead = 65 + 16 + 32

// authorize checks that a payload names this TEE and that the admin signed its
// digest. No caller reaches the extension with a direct action, so the
// signature is the only proof of who sent it. st.mu must be held.
func (st *state) authorize(tee common.Address, digest common.Hash, sig []byte) error {
	if st.admin == (common.Address{}) {
		return errNoAdmin
	}
	if tee != st.tee {
		return errWrongTEE
	}
	signer, err := recoverSigner(digest, sig)
	if err != nil || signer != st.admin {
		return errNotAdmin
	}
	return nil
}

// recoverSigner returns who signed digest under EIP-191, as cast wallet sign
// and eth_sign do: V is 27 or 28, or 0 or 1.
func recoverSigner(digest common.Hash, sig []byte) (common.Address, error) {
	if len(sig) != crypto.SignatureLength {
		return common.Address{}, errors.New("not a 65-byte signature")
	}
	s := bytes.Clone(sig)
	if s[crypto.RecoveryIDOffset] >= 27 {
		s[crypto.RecoveryIDOffset] -= 27
	}
	pub, err := crypto.SigToPub(accounts.TextHash(digest[:]), s)
	if err != nil {
		return common.Address{}, err
	}
	return crypto.PubkeyToAddress(*pub), nil
}

func validSecret(name string, ciphertext []byte) bool {
	return name != "" && len(name) <= maxName && len(ciphertext) <= maxCiphertext
}

// open decrypts a secret with the TEE key. Called after authorize, so only the
// admin's ciphertexts get here; the sign port is on loopback, so st.mu stays held.
func (st *state) open(ctx context.Context, ciphertext []byte) (string, error) {
	plain, err := st.key.Decrypt(ctx, ciphertext)
	if err != nil {
		return "", extension.PublicError("can't decrypt", err)
	}
	if len(plain) > maxValue {
		return "", extension.PublicError("invalid payload", errors.New("secret over the limit"))
	}
	return string(plain), nil
}
