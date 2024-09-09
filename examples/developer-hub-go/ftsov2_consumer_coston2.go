// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
package main

import (
	"context"
	"encoding/hex"
	"fmt"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

func FtsoV2Consumer() {
	// FtsoV2 address (Flare Testnet Coston2)
	// See https://dev.flare.network/ftso/solidity-reference
	ftsoV2Address := common.HexToAddress("0x3d893C53D9e8056135C26C8c638B76C8b60Df726")
	rpcUrl := "https://coston2-api.flare.network/ext/C/rpc"
	// Connect to an RPC node
	client, _ := ethclient.Dial(rpcUrl)
	// Set up contract instance
	ftsov2, _ := NewFtsoV2(ftsoV2Address, client)

	feedIds := []string{
		"0x01464c522f55534400000000000000000000000000", // FLR/USD
		"0x014254432f55534400000000000000000000000000", // BTC/USD
		"0x014554482f55534400000000000000000000000000", // ETH/USD
	}

	// Convert feedIds from string to bytes
	var feedIdsBytes [][21]byte
	for _, feedHex := range feedIds {
		bytes, _ := hex.DecodeString(feedHex[2:])
		feedBytes := [21]byte{}
		copy(feedBytes[:], bytes)
		feedIdsBytes = append(feedIdsBytes, feedBytes)
	}

	// Fetch current feeds
	var res []interface{}
	opts := &bind.CallOpts{Context: context.Background()}
	ftsov2.FtsoV2Caller.contract.Call(opts, &res, "getFeedsById", feedIdsBytes)

	// Print results
	fmt.Println(res)
	fmt.Println("Feeds:", res[0])
	fmt.Println("Decimals:", res[1])
	fmt.Println("Timestamp:", res[2])
}
