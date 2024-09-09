package main

import (
	"encoding/hex"
	"fmt"
	"strings"
)

func getFeedID(category, feedName string) string {
	hexFeedName := hex.EncodeToString([]byte(feedName))
	paddedHexString := category + hexFeedName
	if len(paddedHexString) < 42 {
		paddedHexString = paddedHexString + strings.Repeat("0", 42-len(paddedHexString))
	}
	feedId := "0x" + paddedHexString
	fmt.Println(feedId)
	return feedId
}
