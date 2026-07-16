// Package types contains types that could be useful to other apps when interacting with this extension.
package types

import (
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
)

// SayHelloRequest is the JSON payload sent via the Solidity contract.
type SayHelloRequest struct {
	Name string `json:"name"`
}

// SayHelloResponse is the JSON payload returned in ActionResult.Data.
type SayHelloResponse struct {
	Greeting       string `json:"greeting"`
	GreetingNumber int    `json:"greetingNumber"`
}

// SayGoodbyeRequest is the ABI-decoded payload sent via the Solidity contract.
type SayGoodbyeRequest struct {
	Name   string `json:"name"`
	Reason string `json:"reason"`
}

// SayGoodbyeResponse is the JSON payload returned in ActionResult.Data.
type SayGoodbyeResponse struct {
	Farewell       string `json:"farewell"`
	FarewellNumber int    `json:"farewellNumber"`
}

// SayGoodbyeMessageArg describes the ABI layout of SayGoodbyeMessage from the Solidity contract.
var SayGoodbyeMessageArg abi.Argument

func init() {
	tupleTy, _ := abi.NewType("tuple", "", []abi.ArgumentMarshaling{
		{Name: "name", Type: "string"},
		{Name: "reason", Type: "string"},
	})
	SayGoodbyeMessageArg = abi.Argument{Type: tupleTy}
}

// State holds the extension's observable state, returned by GET /state.
type State struct {
	GreetingCount int    `json:"greetingCount"`
	LastGreeting  string `json:"lastGreeting"`
	FarewellCount int    `json:"farewellCount"`
	LastFarewell  string `json:"lastFarewell"`
}

// --- DO NOT MODIFY below this line. ---

// StateResponse is the envelope returned by GET /state.
type StateResponse struct {
	StateVersion common.Hash `json:"stateVersion"`
	State        State       `json:"state"`
}
