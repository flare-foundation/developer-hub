package flare

import (
	"github.com/ethereum/go-ethereum/common"
	"testing"
)

func TestMakeQuery(t *testing.T) {
	output := MakeQuery()
	expected := common.HexToAddress("0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d")

	if len(output) == 0 {
		t.Errorf("Expected output to contain at least one address")
		return
	}

	if output[0] != expected {
		t.Errorf("Expected  Addresses to be equal")
	}

}
