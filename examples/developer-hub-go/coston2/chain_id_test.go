package coston2

import (
	"math/big"
	"testing"
)

func TestChainId(t *testing.T) {
	output := ChainId()
	expected := big.NewInt(114)

	if output.Cmp(expected) != 0 {
		t.Errorf("output %s, expected %s", output.String(), expected.String())
	}

}
