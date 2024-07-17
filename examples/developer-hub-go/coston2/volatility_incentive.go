// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
package coston2

import (
	"context"
	"fmt"
	"math/big"
	"os"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

func MakeVolatilityIncentive() {
	// Get private key from environment
	privateKey, _ := crypto.HexToECDSA(os.Getenv("ACCOUNT_PRIVATE_KEY")[2:])
	// FastUpdatesIncentiveManager address (Flare Testnet Coston2)
	// See https://dev.flare.network/ftso/solidity-reference
	incentiveAddress := common.HexToAddress("0x003e9bD18f73e0B25BED0DC8382Bde6aa999525c")
	// Connect to an RPC node
	client, _ := ethclient.Dial("https://coston2-api.flare.network/ext/C/rpc")
	// Set up contract instance
	incentive, _ := NewFastUpdatesIncentiveManager(incentiveAddress, client)
	// Get the current sample size, sample size increase price, precision, and scale
	opts := &bind.CallOpts{Context: context.Background()}
	sampleSizeIncreasePrice, _ := incentive.GetCurrentSampleSizeIncreasePrice(opts)
	expectedSampleSize, _ := incentive.GetExpectedSampleSize(opts)
	rangeVal, _ := incentive.GetRange(opts)
	scale, _ := incentive.GetScale(opts)
	fmt.Println("Sample Size Increase Price:", sampleSizeIncreasePrice)
	fmt.Println("Current Sample Size:", expectedSampleSize)
	fmt.Println("Current Range:", rangeVal)
	fmt.Println("Current Scale:", scale)

	// Offer the incentive
	offer := IFastUpdateIncentiveManagerIncentiveOffer{
		RangeIncrease: big.NewInt(0),
		RangeLimit:    big.NewInt(0),
	}
	transactor, _ := bind.NewKeyedTransactorWithChainID(privateKey, big.NewInt(114))
	transactor.Value = sampleSizeIncreasePrice
	tx, _ := incentive.OfferIncentive(transactor, offer)
	fmt.Println("Transaction hash:", tx.Hash().Hex())
	time.Sleep(3000 * time.Millisecond)

	// Get the new sample size increase price, sample size, range, and scale
	sampleSizeIncreasePrice, _ = incentive.GetCurrentSampleSizeIncreasePrice(opts)
	expectedSampleSize, _ = incentive.GetExpectedSampleSize(opts)
	rangeVal, _ = incentive.GetRange(opts)
	scale, _ = incentive.GetScale(opts)
	fmt.Println("Sample Size Increase Price:", sampleSizeIncreasePrice)
	fmt.Println("Current Sample Size:", expectedSampleSize)
	fmt.Println("Current Range:", rangeVal)
	fmt.Println("Current Scale:", scale)
}
