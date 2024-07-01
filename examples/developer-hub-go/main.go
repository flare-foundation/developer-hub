package main

//go:generate abigen --abi Relay.abi --pkg coston2 --type Relay --out coston2/Relay.go
//go:generate abigen --abi FlareContractRegistry.abi --pkg coston2 --type FlareContractRegistry --out coston2/FlareContractRegistry.go
//go:generate abigen --abi=build/FtsoV2FeedConsumer.abi --pkg coston2 --type FtsoV2FeedConsumer --out coston2/FtsoV2FeedConsumer.go
//go:generate abigen --abi FastUpdatesIncentiveManager.abi --pkg coston2 --type FastUpdatesIncentiveManager --out coston2/FastUpdatesIncentiveManager.go
//go:generate abigen --abi FastUpdatesConfiguration.abi --pkg main --type FastUpdatesConfiguration --out FastUpdatesConfiguration.go
//go:generate abigen --abi FastUpdater.abi --pkg main --type FastUpdater --out FastUpdater.go

import (
	"developer-hub-go/coston2"
	"developer-hub-go/flare"
)

/* Note: Call `go generate` before executing these functions. */

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
	coston2.MakeVolatilityIncentive()
	coston2.SecureRandom()
}
