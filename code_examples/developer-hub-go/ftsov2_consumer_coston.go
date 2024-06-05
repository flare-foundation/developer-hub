// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
package main

import (
	"context"
	"fmt"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"math/big"
)

func FtsoV2Consumer() {
	// FastUpdater address (Songbird Testnet Coston)
	ftsoAddress := common.HexToAddress("0x9B931f5d3e24fc8C9064DB35bDc8FB4bE0E862f9")
	rpcUrl := "https://rpc.ankr.com/flare_coston"
	// Connect to an RPC node
	client, _ := ethclient.Dial(rpcUrl)
	// Set up contract instance
	ftsov2, _ := NewFastUpdater(ftsoAddress, client)
	// Feed indexes: 0 = FLR/USD, 2 = BTC/USD, 9 = ETH/USD
	feedIndexes := []*big.Int{big.NewInt(0), big.NewInt(2), big.NewInt(9)}
	// Fetch current feeds
	opts := &bind.CallOpts{Context: context.Background()}
	res, _ := ftsov2.FetchCurrentFeeds(opts, feedIndexes)
	fmt.Println("Feeds:", res.Feeds)
	fmt.Println("Decimals:", res.Decimals)
	fmt.Println("Timestamp:", res.Timestamp)
}
