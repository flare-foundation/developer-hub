package coston2

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

func MakeQuery() []common.Address {
	client, err := ethclient.Dial("https://coston2-api.flare.network/ext/C/rpc")
	if err != nil {
		panic(err)
	}
	registryAddr := common.HexToAddress("0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019")
	registry, err := NewFlareContractRegistry(registryAddr, client)
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
	return addr
}
