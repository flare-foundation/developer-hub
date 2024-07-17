// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
package main

import (
	"context"
	"fmt"

	"math/big"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

func FtsoV2Consumer() {
	// FastUpdater address (Flare Testnet Coston2)
	// See https://dev.flare.network/ftso/solidity-reference
	ftsoAddress := common.HexToAddress("0x58fb598EC6DB6901aA6F26a9A2087E9274128E59")
	rpcUrl := "https://coston2-api.flare.network/ext/C/rpc"
	// Connect to an RPC node
	client, _ := ethclient.Dial(rpcUrl)
	// Set up contract instance
	ftsov2, _ := NewFastUpdater(ftsoAddress, client)
	// Feed indexes: 0 = FLR/USD, 2 = BTC/USD, 9 = ETH/USD
	feedIndexes := []*big.Int{big.NewInt(0), big.NewInt(2), big.NewInt(9)}
	// Fetch current feeds
	opts := &bind.CallOpts{Context: context.Background()}
	res, _ := ftsov2.FetchCurrentFeeds(opts, feedIndexes)
	// Print results
	fmt.Println("Feeds:", res.Feeds)
	fmt.Println("Decimals:", res.Decimals)
	fmt.Println("Timestamp:", res.Timestamp)
}
