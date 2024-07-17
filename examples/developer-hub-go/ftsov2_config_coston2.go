// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
package main

import (
	"context"
	"fmt"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

func FtsoV2Config() {
	// FastUpdatesConfiguration address (Flare Testnet Coston2)
	// See https://dev.flare.network/ftso/solidity-reference
	address := common.HexToAddress("0xE7d1D5D58cAE01a82b84989A931999Cb34A86B14")
	rpcUrl := "https://coston2-api.flare.network/ext/C/rpc"
	// Connect to an RPC node
	client, _ := ethclient.Dial(rpcUrl)
	// Set up contract instance
	ftsov2, _ := NewFastUpdatesConfiguration(address, client)
	// Fetch current feeds
	opts := &bind.CallOpts{Context: context.Background()}
	res, _ := ftsov2.GetFeedConfigurations(opts)
	// Print results
	for i := 0; i < len(res); i++ {
		fmt.Printf("feedId: %s, rewardBandValue %d, inflationShare %d\n", string(res[i].FeedId[:]), res[i].RewardBandValue, res[i].InflationShare)
	}
}
