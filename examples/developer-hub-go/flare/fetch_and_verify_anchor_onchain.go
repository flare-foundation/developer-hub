// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
package flare

import (
	"context"
	"crypto/ecdsa"
	"encoding/hex"
	"fmt"
	"log"
	"math/big"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

func convertToByteArray(proof []string) ([][32]byte, error) {
	var result [][32]byte

	for _, str := range proof {

		decoded, err := hex.DecodeString(str)
		if err != nil {
			return nil, fmt.Errorf("failed to decode string: %v", err)
		}

		if len(decoded) != 32 {
			return nil, fmt.Errorf("decoded string is not 32 bytes: got %d bytes", len(decoded))
		}

		var byteArray [32]byte
		copy(byteArray[:], decoded)

		result = append(result, byteArray)
	}

	return result, nil
}

func VerifyAnchorFeedsOnchain() {
	const (
		PRIVATE_KEY               = "your_private_key_here"
		RPC_URL                   = "https://coston2-api.flare.network/ext/C/rpc"
		DEPLOYED_CONTRACT_ADDRESS = "0x069227C6A947d852c55655e41C6a382868627920"
	)

	var feed_Id [21]byte
	var proof [][32]byte

	feeds, err := FetchAnchorFeeds()
	if err != nil {
		log.Fatal(err)
	}

	copy(feed_Id[:], feeds[0].Body.ID)
	votingRoundId := uint32(feeds[0].Body.VotingRoundID)
	feedBody := FtsoV2InterfaceFeedData{
		votingRoundId,
		feed_Id,
		int32(feeds[0].Body.Value),
		uint16(feeds[0].Body.TurnoutBIPS),
		int8(feeds[0].Body.Decimals),
	}
	proof, _ = convertToByteArray(feeds[0].Proof)

	var feedWithProof = FtsoV2InterfaceFeedDataWithProof{
		proof,
		feedBody,
	}

	client, err := ethclient.Dial(RPC_URL)
	if err != nil {
		log.Fatal(err)
	}

	privateKey, err := crypto.HexToECDSA(PRIVATE_KEY)
	if err != nil {
		log.Fatalf("Failed to parse private key: %v", err)
	}

	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		log.Fatal("Invalid public key type")
	}
	fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)

	nonce, err := client.PendingNonceAt(context.Background(), fromAddress)
	if err != nil {
		log.Fatalf("Failed to fetch nonce: %v", err)
	}

	gasPrice, err := client.SuggestGasPrice(context.Background())
	if err != nil {
		log.Fatalf("Failed to fetch gas price: %v", err)
	}

	chainID, err := client.NetworkID(context.Background())
	if err != nil {
		log.Fatalf("Failed to fetch chain ID: %v", err)
	}

	auth, err := bind.NewKeyedTransactorWithChainID(privateKey, chainID)
	if err != nil {
		log.Fatalf("Failed to create transactor: %v", err)
	}
	auth.Nonce = big.NewInt(int64(nonce))
	auth.Value = big.NewInt(0) //
	auth.GasLimit = uint64(3000000)
	auth.GasPrice = gasPrice
	consumerAddr := common.HexToAddress(DEPLOYED_CONTRACT_ADDRESS)
	anchorFeed, err := NewFtsoV2AnchorFeedConsumer(consumerAddr, client)
	if err != nil {
		log.Fatalf("Failed to initialize consumer contract: %v", err)
	}
	if err != nil {
		log.Fatal(err)
	}

	tx, err := anchorFeed.SavePrice(auth, feedWithProof)
	if err != nil {
		log.Fatalf("Failed to save price: %v", err)
	}
	fmt.Printf("SavePrice transaction hash: %s\n", tx.Hash().Hex())

	savedPrice, _ := anchorFeed.ProvenFeeds(&bind.CallOpts{}, votingRoundId, feed_Id)
	fmt.Printf("%+v\n", savedPrice)
}
