package songbird

import (
	"context"
	"fmt"

	"github.com/ethereum/go-ethereum/ethclient"
)

func BlockNumber() {
	cl, _ := ethclient.Dial("https://songbird-api.flare.network/ext/C/rpc")
	blockNumber, _ := cl.BlockNumber(context.Background())
	fmt.Println(blockNumber)
}
