package main

import (
	"developer-hub-go/coston2"
	"developer-hub-go/flare"
)

// coston2 package ABIs
//go:generate abigen --abi RandomNumberV2.abi --pkg coston2 --type RandomNumberV2 --out coston2/Relay.go
//go:generate abigen --abi FlareContractRegistry.abi --pkg coston2 --type FlareContractRegistry --out coston2/FlareContractRegistry.go
//go:generate abigen --bin=build/FtsoV2FeedConsumer.bin --abi=build/FtsoV2FeedConsumer.abi --pkg coston2 --type FtsoV2FeedConsumer --out coston2/FtsoV2FeedConsumer.go
//go:generate abigen --abi FastUpdatesIncentiveManager.abi --pkg coston2 --type FastUpdatesIncentiveManager --out coston2/FastUpdatesIncentiveManager.go
//go:generate abigen --abi FastUpdatesConfiguration.abi --pkg main --type FastUpdatesConfiguration --out FastUpdatesConfiguration.go
//go:generate abigen --abi FtsoV2.abi --pkg main --type FtsoV2 --out FtsoV2.go
// flare package ABIs
//go:generate abigen --abi FlareContractRegistry.abi --pkg flare --type FlareContractRegistry --out flare/FlareContractRegistry.go
//go:generate abigen --bin=build/FtsoV2FeedConsumer.bin --abi=build/FtsoV2FeedConsumer.abi --pkg flare --type FtsoV2FeedConsumer --out flare/FtsoV2FeedConsumer.go
//go:generate abigen --bin=build/FtsoV2AnchorFeedConsumer.bin --abi=build/FtsoV2AnchorFeedConsumer.abi --pkg flare --type FtsoV2AnchorFeedConsumer --out flare/FtsoV2AnchorFeedConsumer.go

/* Note: Call `go generate` before executing these functions. */

func main() {
	getFeedID("01", "FLR/USD")
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
	flare.FetchAnchorFeeds()
	flare.VerifyAnchorFeedsOnchain()
}
