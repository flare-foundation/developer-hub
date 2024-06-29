package main

import (
	"developer-hub-go/coston2"
	"developer-hub-go/flare"
)

func main() {
	coston2.ChainId()
	flare.ChainId()
	coston2.MakeQuery()
	flare.MakeQuery()
	CreateAccount()
	coston2.DeployContract()
	flare.DeployContract()
	FtsoV2Consumer()
	FtsoV2Config()
}
