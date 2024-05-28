package main

import (
	"context"
	"fmt"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

func MakeQueryCoston2() {
	client, err := ethclient.Dial("https://rpc.ankr.com/flare_coston2")
	if err != nil {
		panic(err)
	}
	registryAddr := common.HexToAddress("0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019")
	registry, err := NewContract(registryAddr, client)
	if err != nil {
		panic(err)
	}
	callOpts := &bind.CallOpts{Context: context.Background(), Pending: false}
	addr, err := registry.GetContractAddressesByName(callOpts, []string{"WNat"})
	if err != nil {
		panic(err)
	}
	fmt.Println("WNat contract address is", addr)
	// WNat contract address is [0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273]
}

func MakeQueryFlare() {
	client, err := ethclient.Dial("https://rpc.ankr.com/flare")
	if err != nil {
		panic(err)
	}
	registryAddr := common.HexToAddress("0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019")
	registry, err := NewContract(registryAddr, client)
	if err != nil {
		panic(err)
	}
	callOpts := &bind.CallOpts{Context: context.Background(), Pending: false}
	addr, err := registry.GetContractAddressesByName(callOpts, []string{"WNat"})
	if err != nil {
		panic(err)
	}
	fmt.Println("WNat contract address is", addr)
	// WNat contract address is [0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d]
}
