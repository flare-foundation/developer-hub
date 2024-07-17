package coston2

import (
	"context"
	"fmt"

	"github.com/ethereum/go-ethereum/ethclient"
)

func ChainId() {
	cl, err := ethclient.Dial("https://coston2-api.flare.network/ext/C/rpc")
	if err != nil {
		panic(err)
	}
	chainid, err := cl.ChainID(context.Background())
	if err != nil {
		panic(err)
	}
	fmt.Println("Chain ID is", chainid)
	// Chain ID is 114
}
