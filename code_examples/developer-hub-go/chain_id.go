package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/ethclient"
)

func ChainIdCoston2() {
	cl, err := ethclient.Dial("https://rpc.ankr.com/flare_coston2")
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

func ChainIdFlare() {
	cl, err := ethclient.Dial("https://rpc.ankr.com/flare")
	if err != nil {
		panic(err)
	}
	chainid, err := cl.ChainID(context.Background())
	if err != nil {
		panic(err)
	}
	fmt.Println("Chain ID is", chainid)
	// Chain ID is 14
}
