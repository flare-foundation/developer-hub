// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
package flare

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/ethclient"
)

// Paste the contents of the generated keystore file here
// DO NOT USE THIS CODE IN PRODUCTION.
// NEVER COMMIT PRIVATE KEYS TO A GIT REPOSITORY.
const key = ``

func DeployContract() {
	conn, err := ethclient.Dial("https://flare-api.flare.network/ext/C/rpc")
	if err != nil {
		panic(err)
	}
	ctx := context.Background()
	chainId, err := conn.ChainID(ctx)
	if err != nil {
		panic(err)
	}
	auth, err := bind.NewTransactorWithChainID(strings.NewReader(key), "Creation password", chainId)
	if err != nil {
		panic(err)
	}
	address, tx, ftsoV2FeedConsumer, err := DeployFtsoV2FeedConsumer(auth, conn)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Contract pending deploy: 0x%x\n", address)
	fmt.Printf("Transaction waiting to be mined: 0x%x\n\n", tx.Hash())
	time.Sleep(2000 * time.Millisecond)

	feeds, err := ftsoV2FeedConsumer.GetFtsoV2CurrentFeedValues(&bind.CallOpts{Context: ctx, Pending: true})
	if err != nil {
		panic(err)
	}
	fmt.Println("Feeds values and decimals:", feeds)
}
