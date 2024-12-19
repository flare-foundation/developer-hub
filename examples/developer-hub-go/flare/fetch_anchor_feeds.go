package flare

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

const (
	BaseURL = "https://flr-data-availability.flare.network/"
	APIKey  = "api-key"
)

var FeedIDs = []string{
	"0x01464c522f55534400000000000000000000000000", // FLR/USD
	"0x014254432f55534400000000000000000000000000", // BTC/USD
	"0x014554482f55534400000000000000000000000000", // ETH/USD
}

type AnchorFeed struct {
	Body struct {
		VotingRoundID int    `json:"votingRoundId"`
		ID            string `json:"id"`
		Value         int    `json:"value"`
		TurnoutBIPS   int    `json:"turnoutBIPS"`
		Decimals      int    `json:"decimals"`
	} `json:"body"`
	Proof []string `json:"proof"`
}

func anchorFeeds(feedIds []string, votingRoundId string) ([]AnchorFeed, error) {
	url := BaseURL + "api/v0/ftso/anchor-feeds-with-proof"
	if votingRoundId != "" {
		url += "?voting_round_id=" + votingRoundId
	}

	payload, err := json.Marshal(map[string]interface{}{"feed_ids": feedIds})
	if err != nil {
		return nil, fmt.Errorf("could not marshal JSON: %w", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	if err != nil {
		return nil, fmt.Errorf("failed to create HTTP request: %w", err)
	}

	req.Header.Set("X-API-KEY", APIKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to perform HTTP request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("unexpected status code %d: %s", resp.StatusCode, string(body))
	}

	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	var feeds []AnchorFeed
	if err := json.Unmarshal(responseBody, &feeds); err != nil {
		return nil, fmt.Errorf("failed to unmarshal JSON response: %w", err)
	}

	return feeds, nil

}

func FetchAnchorFeeds() {
	feeds, err := anchorFeeds(FeedIDs, "")
	if err != nil {
		log.Fatalf("Error fetching anchor feeds: %v", err)
	}
	fmt.Printf("%+v\n", feeds)

}
