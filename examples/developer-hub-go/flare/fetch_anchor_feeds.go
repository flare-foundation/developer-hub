// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
package flare

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

const (
	BaseURL = "https://flr-data-availability.flare.network/"
	ApiKey  = "<your-api-key>"
)

var FeedIds = []string{
	"0x01464c522f55534400000000000000000000000000", // FLR/USD
	"0x014254432f55534400000000000000000000000000", // BTC/USD
	"0x014554482f55534400000000000000000000000000", // ETH/USD
}
var VotingRoundId = ""

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

func FetchAnchorFeeds() ([]AnchorFeed, error) {
	url := BaseURL + "api/v0/ftso/anchor-feeds-with-proof"
	if VotingRoundId != "" {
		url += "?voting_round_id=" + VotingRoundId
	}

	payload, _ := json.Marshal(map[string]interface{}{"feed_ids": FeedIds})
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	req.Header.Set("X-API-KEY", ApiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("request failed: %v (status: %d)", err, resp.StatusCode)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	var feeds []AnchorFeed
	return feeds, json.Unmarshal(body, &feeds)
}

func main() {
	feeds, err := FetchAnchorFeeds()
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	fmt.Printf("Anchor feeds: %+v\n", feeds)
}
