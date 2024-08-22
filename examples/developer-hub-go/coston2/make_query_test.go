package coston2

import (
	"github.com/ethereum/go-ethereum/common"
	"testing"
)

func TestMakeQuery(t *testing.T) {
	output := MakeQuery()
	expected := common.HexToAddress("0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273")

	if len(output) == 0 {
		t.Errorf("Expected output to contain at least one address")
		return
	}

	if output[0] != expected {
		t.Errorf("Expected  Addresses to be equal")
	}

}
