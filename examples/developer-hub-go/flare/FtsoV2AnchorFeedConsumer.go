// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package flare

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
	_ = abi.ConvertType
)

// FtsoV2InterfaceFeedData is an auto generated low-level Go binding around an user-defined struct.
type FtsoV2InterfaceFeedData struct {
	VotingRoundId uint32
	Id            [21]byte
	Value         int32
	TurnoutBIPS   uint16
	Decimals      int8
}

// FtsoV2InterfaceFeedDataWithProof is an auto generated low-level Go binding around an user-defined struct.
type FtsoV2InterfaceFeedDataWithProof struct {
	Proof [][32]byte
	Body  FtsoV2InterfaceFeedData
}

// FtsoV2AnchorFeedConsumerMetaData contains all meta data concerning the FtsoV2AnchorFeedConsumer contract.
var FtsoV2AnchorFeedConsumerMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"uint32\",\"name\":\"\",\"type\":\"uint32\"},{\"internalType\":\"bytes21\",\"name\":\"\",\"type\":\"bytes21\"}],\"name\":\"provenFeeds\",\"outputs\":[{\"internalType\":\"uint32\",\"name\":\"votingRoundId\",\"type\":\"uint32\"},{\"internalType\":\"bytes21\",\"name\":\"id\",\"type\":\"bytes21\"},{\"internalType\":\"int32\",\"name\":\"value\",\"type\":\"int32\"},{\"internalType\":\"uint16\",\"name\":\"turnoutBIPS\",\"type\":\"uint16\"},{\"internalType\":\"int8\",\"name\":\"decimals\",\"type\":\"int8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"bytes32[]\",\"name\":\"proof\",\"type\":\"bytes32[]\"},{\"components\":[{\"internalType\":\"uint32\",\"name\":\"votingRoundId\",\"type\":\"uint32\"},{\"internalType\":\"bytes21\",\"name\":\"id\",\"type\":\"bytes21\"},{\"internalType\":\"int32\",\"name\":\"value\",\"type\":\"int32\"},{\"internalType\":\"uint16\",\"name\":\"turnoutBIPS\",\"type\":\"uint16\"},{\"internalType\":\"int8\",\"name\":\"decimals\",\"type\":\"int8\"}],\"internalType\":\"structFtsoV2Interface.FeedData\",\"name\":\"body\",\"type\":\"tuple\"}],\"internalType\":\"structFtsoV2Interface.FeedDataWithProof\",\"name\":\"data\",\"type\":\"tuple\"}],\"name\":\"savePrice\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
	Bin: "0x608060405234801561001057600080fd5b5061067a806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806387179d281461003b578063be2efe0914610050575b600080fd5b61004e6100493660046102e1565b6100f5565b005b6100ae61005e36600461034e565b6000602081815292815260408082209093529081529081205463ffffffff811691640100000000820460581b91600160c81b810460030b9161ffff600160e81b83041691600160f81b9004900b85565b6040805163ffffffff9690961686526001600160581b031994909416602086015260039290920b8484015261ffff16606084015260000b6080830152519081900360a00190f35b6100fd610218565b6001600160a01b031663ceb05472826040518263ffffffff1660e01b8152600401610128919061042e565b602060405180830381865afa158015610145573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061016991906104c0565b6101a95760405162461bcd60e51b815260206004820152600d60248201526c24b73b30b634b210383937b7b360991b604482015260640160405180910390fd5b602081016000806101bd60408501846104e2565b63ffffffff1663ffffffff16815260200190815260200160002060008360200160200160208101906101ef91906104ff565b6001600160581b03191681526020810191909152604001600020610213828261052f565b505050565b600073ad67fe66660fb8dfe9d6b1b4240d8650e30f60196001600160a01b031663159354a260405160200161026790602080825260069082015265233a39b7ab1960d11b604082015260600190565b604051602081830303815290604052805190602001206040518263ffffffff1660e01b815260040161029b91815260200190565b602060405180830381865afa1580156102b8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102dc919061061b565b905090565b6000602082840312156102f357600080fd5b813567ffffffffffffffff81111561030a57600080fd5b820160c0818503121561031c57600080fd5b9392505050565b63ffffffff8116811461033557600080fd5b50565b6001600160581b03198116811461033557600080fd5b6000806040838503121561036157600080fd5b823561036c81610323565b9150602083013561037c81610338565b809150509250929050565b8060030b811461033557600080fd5b61ffff8116811461033557600080fd5b8060000b811461033557600080fd5b80356103c081610323565b63ffffffff16825260208101356103d681610338565b6001600160581b031916602083015260408101356103f381610387565b60030b6040830152606081013561040981610396565b61ffff1660608301526080810135610420816103a6565b8060000b6080840152505050565b6020815260008235601e1984360301811261044857600080fd5b830160208101903567ffffffffffffffff81111561046557600080fd5b8060051b80360383131561047857600080fd5b60c0602086015260e085018290526101006001600160fb1b0383111561049d57600080fd5b8184828801376104b360408701602089016103b5565b9401909301949350505050565b6000602082840312156104d257600080fd5b8151801515811461031c57600080fd5b6000602082840312156104f457600080fd5b813561031c81610323565b60006020828403121561051157600080fd5b813561031c81610338565b60008135610529816103a6565b92915050565b813561053a81610323565b63ffffffff8116905081548163ffffffff198216178355602084013561055f81610338565b640100000000600160c81b0360389190911c166001600160c81b03198216831781178455604085013561059181610387565b8060c81b905063ffffffff60c81b8181168562ffffff60e81b861617841717865560608701356105c081610396565b91166001600160f81b031993909316909317171760e89190911b61ffff60e81b161781556106176105f36080840161051c565b8280546001600160f81b031660f89290921b6001600160f81b031916919091179055565b5050565b60006020828403121561062d57600080fd5b81516001600160a01b038116811461031c57600080fdfea2646970667358221220c6d40c449640248f3c1055aeb34b3f0b0c0819e9fd5474537fdebb41b0e7073864736f6c63430008130033",
}

// FtsoV2AnchorFeedConsumerABI is the input ABI used to generate the binding from.
// Deprecated: Use FtsoV2AnchorFeedConsumerMetaData.ABI instead.
var FtsoV2AnchorFeedConsumerABI = FtsoV2AnchorFeedConsumerMetaData.ABI

// FtsoV2AnchorFeedConsumerBin is the compiled bytecode used for deploying new contracts.
// Deprecated: Use FtsoV2AnchorFeedConsumerMetaData.Bin instead.
var FtsoV2AnchorFeedConsumerBin = FtsoV2AnchorFeedConsumerMetaData.Bin

// DeployFtsoV2AnchorFeedConsumer deploys a new Ethereum contract, binding an instance of FtsoV2AnchorFeedConsumer to it.
func DeployFtsoV2AnchorFeedConsumer(auth *bind.TransactOpts, backend bind.ContractBackend) (common.Address, *types.Transaction, *FtsoV2AnchorFeedConsumer, error) {
	parsed, err := FtsoV2AnchorFeedConsumerMetaData.GetAbi()
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	if parsed == nil {
		return common.Address{}, nil, nil, errors.New("GetABI returned nil")
	}

	address, tx, contract, err := bind.DeployContract(auth, *parsed, common.FromHex(FtsoV2AnchorFeedConsumerBin), backend)
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	return address, tx, &FtsoV2AnchorFeedConsumer{FtsoV2AnchorFeedConsumerCaller: FtsoV2AnchorFeedConsumerCaller{contract: contract}, FtsoV2AnchorFeedConsumerTransactor: FtsoV2AnchorFeedConsumerTransactor{contract: contract}, FtsoV2AnchorFeedConsumerFilterer: FtsoV2AnchorFeedConsumerFilterer{contract: contract}}, nil
}

// FtsoV2AnchorFeedConsumer is an auto generated Go binding around an Ethereum contract.
type FtsoV2AnchorFeedConsumer struct {
	FtsoV2AnchorFeedConsumerCaller     // Read-only binding to the contract
	FtsoV2AnchorFeedConsumerTransactor // Write-only binding to the contract
	FtsoV2AnchorFeedConsumerFilterer   // Log filterer for contract events
}

// FtsoV2AnchorFeedConsumerCaller is an auto generated read-only Go binding around an Ethereum contract.
type FtsoV2AnchorFeedConsumerCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FtsoV2AnchorFeedConsumerTransactor is an auto generated write-only Go binding around an Ethereum contract.
type FtsoV2AnchorFeedConsumerTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FtsoV2AnchorFeedConsumerFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type FtsoV2AnchorFeedConsumerFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FtsoV2AnchorFeedConsumerSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type FtsoV2AnchorFeedConsumerSession struct {
	Contract     *FtsoV2AnchorFeedConsumer // Generic contract binding to set the session for
	CallOpts     bind.CallOpts             // Call options to use throughout this session
	TransactOpts bind.TransactOpts         // Transaction auth options to use throughout this session
}

// FtsoV2AnchorFeedConsumerCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type FtsoV2AnchorFeedConsumerCallerSession struct {
	Contract *FtsoV2AnchorFeedConsumerCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts                   // Call options to use throughout this session
}

// FtsoV2AnchorFeedConsumerTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type FtsoV2AnchorFeedConsumerTransactorSession struct {
	Contract     *FtsoV2AnchorFeedConsumerTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts                   // Transaction auth options to use throughout this session
}

// FtsoV2AnchorFeedConsumerRaw is an auto generated low-level Go binding around an Ethereum contract.
type FtsoV2AnchorFeedConsumerRaw struct {
	Contract *FtsoV2AnchorFeedConsumer // Generic contract binding to access the raw methods on
}

// FtsoV2AnchorFeedConsumerCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type FtsoV2AnchorFeedConsumerCallerRaw struct {
	Contract *FtsoV2AnchorFeedConsumerCaller // Generic read-only contract binding to access the raw methods on
}

// FtsoV2AnchorFeedConsumerTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type FtsoV2AnchorFeedConsumerTransactorRaw struct {
	Contract *FtsoV2AnchorFeedConsumerTransactor // Generic write-only contract binding to access the raw methods on
}

// NewFtsoV2AnchorFeedConsumer creates a new instance of FtsoV2AnchorFeedConsumer, bound to a specific deployed contract.
func NewFtsoV2AnchorFeedConsumer(address common.Address, backend bind.ContractBackend) (*FtsoV2AnchorFeedConsumer, error) {
	contract, err := bindFtsoV2AnchorFeedConsumer(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &FtsoV2AnchorFeedConsumer{FtsoV2AnchorFeedConsumerCaller: FtsoV2AnchorFeedConsumerCaller{contract: contract}, FtsoV2AnchorFeedConsumerTransactor: FtsoV2AnchorFeedConsumerTransactor{contract: contract}, FtsoV2AnchorFeedConsumerFilterer: FtsoV2AnchorFeedConsumerFilterer{contract: contract}}, nil
}

// NewFtsoV2AnchorFeedConsumerCaller creates a new read-only instance of FtsoV2AnchorFeedConsumer, bound to a specific deployed contract.
func NewFtsoV2AnchorFeedConsumerCaller(address common.Address, caller bind.ContractCaller) (*FtsoV2AnchorFeedConsumerCaller, error) {
	contract, err := bindFtsoV2AnchorFeedConsumer(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &FtsoV2AnchorFeedConsumerCaller{contract: contract}, nil
}

// NewFtsoV2AnchorFeedConsumerTransactor creates a new write-only instance of FtsoV2AnchorFeedConsumer, bound to a specific deployed contract.
func NewFtsoV2AnchorFeedConsumerTransactor(address common.Address, transactor bind.ContractTransactor) (*FtsoV2AnchorFeedConsumerTransactor, error) {
	contract, err := bindFtsoV2AnchorFeedConsumer(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &FtsoV2AnchorFeedConsumerTransactor{contract: contract}, nil
}

// NewFtsoV2AnchorFeedConsumerFilterer creates a new log filterer instance of FtsoV2AnchorFeedConsumer, bound to a specific deployed contract.
func NewFtsoV2AnchorFeedConsumerFilterer(address common.Address, filterer bind.ContractFilterer) (*FtsoV2AnchorFeedConsumerFilterer, error) {
	contract, err := bindFtsoV2AnchorFeedConsumer(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &FtsoV2AnchorFeedConsumerFilterer{contract: contract}, nil
}

// bindFtsoV2AnchorFeedConsumer binds a generic wrapper to an already deployed contract.
func bindFtsoV2AnchorFeedConsumer(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := FtsoV2AnchorFeedConsumerMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FtsoV2AnchorFeedConsumer *FtsoV2AnchorFeedConsumerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FtsoV2AnchorFeedConsumer.Contract.FtsoV2AnchorFeedConsumerCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FtsoV2AnchorFeedConsumer *FtsoV2AnchorFeedConsumerRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FtsoV2AnchorFeedConsumer.Contract.FtsoV2AnchorFeedConsumerTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FtsoV2AnchorFeedConsumer *FtsoV2AnchorFeedConsumerRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FtsoV2AnchorFeedConsumer.Contract.FtsoV2AnchorFeedConsumerTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FtsoV2AnchorFeedConsumer *FtsoV2AnchorFeedConsumerCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FtsoV2AnchorFeedConsumer.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FtsoV2AnchorFeedConsumer *FtsoV2AnchorFeedConsumerTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FtsoV2AnchorFeedConsumer.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FtsoV2AnchorFeedConsumer *FtsoV2AnchorFeedConsumerTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FtsoV2AnchorFeedConsumer.Contract.contract.Transact(opts, method, params...)
}

// ProvenFeeds is a free data retrieval call binding the contract method 0xbe2efe09.
//
// Solidity: function provenFeeds(uint32 , bytes21 ) view returns(uint32 votingRoundId, bytes21 id, int32 value, uint16 turnoutBIPS, int8 decimals)
func (_FtsoV2AnchorFeedConsumer *FtsoV2AnchorFeedConsumerCaller) ProvenFeeds(opts *bind.CallOpts, arg0 uint32, arg1 [21]byte) (struct {
	VotingRoundId uint32
	Id            [21]byte
	Value         int32
	TurnoutBIPS   uint16
	Decimals      int8
}, error) {
	var out []interface{}
	err := _FtsoV2AnchorFeedConsumer.contract.Call(opts, &out, "provenFeeds", arg0, arg1)

	outstruct := new(struct {
		VotingRoundId uint32
		Id            [21]byte
		Value         int32
		TurnoutBIPS   uint16
		Decimals      int8
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.VotingRoundId = *abi.ConvertType(out[0], new(uint32)).(*uint32)
	outstruct.Id = *abi.ConvertType(out[1], new([21]byte)).(*[21]byte)
	outstruct.Value = *abi.ConvertType(out[2], new(int32)).(*int32)
	outstruct.TurnoutBIPS = *abi.ConvertType(out[3], new(uint16)).(*uint16)
	outstruct.Decimals = *abi.ConvertType(out[4], new(int8)).(*int8)

	return *outstruct, err

}

// ProvenFeeds is a free data retrieval call binding the contract method 0xbe2efe09.
//
// Solidity: function provenFeeds(uint32 , bytes21 ) view returns(uint32 votingRoundId, bytes21 id, int32 value, uint16 turnoutBIPS, int8 decimals)
func (_FtsoV2AnchorFeedConsumer *FtsoV2AnchorFeedConsumerSession) ProvenFeeds(arg0 uint32, arg1 [21]byte) (struct {
	VotingRoundId uint32
	Id            [21]byte
	Value         int32
	TurnoutBIPS   uint16
	Decimals      int8
}, error) {
	return _FtsoV2AnchorFeedConsumer.Contract.ProvenFeeds(&_FtsoV2AnchorFeedConsumer.CallOpts, arg0, arg1)
}

// ProvenFeeds is a free data retrieval call binding the contract method 0xbe2efe09.
//
// Solidity: function provenFeeds(uint32 , bytes21 ) view returns(uint32 votingRoundId, bytes21 id, int32 value, uint16 turnoutBIPS, int8 decimals)
func (_FtsoV2AnchorFeedConsumer *FtsoV2AnchorFeedConsumerCallerSession) ProvenFeeds(arg0 uint32, arg1 [21]byte) (struct {
	VotingRoundId uint32
	Id            [21]byte
	Value         int32
	TurnoutBIPS   uint16
	Decimals      int8
}, error) {
	return _FtsoV2AnchorFeedConsumer.Contract.ProvenFeeds(&_FtsoV2AnchorFeedConsumer.CallOpts, arg0, arg1)
}

// SavePrice is a paid mutator transaction binding the contract method 0x87179d28.
//
// Solidity: function savePrice((bytes32[],(uint32,bytes21,int32,uint16,int8)) data) returns()
func (_FtsoV2AnchorFeedConsumer *FtsoV2AnchorFeedConsumerTransactor) SavePrice(opts *bind.TransactOpts, data FtsoV2InterfaceFeedDataWithProof) (*types.Transaction, error) {
	return _FtsoV2AnchorFeedConsumer.contract.Transact(opts, "savePrice", data)
}

// SavePrice is a paid mutator transaction binding the contract method 0x87179d28.
//
// Solidity: function savePrice((bytes32[],(uint32,bytes21,int32,uint16,int8)) data) returns()
func (_FtsoV2AnchorFeedConsumer *FtsoV2AnchorFeedConsumerSession) SavePrice(data FtsoV2InterfaceFeedDataWithProof) (*types.Transaction, error) {
	return _FtsoV2AnchorFeedConsumer.Contract.SavePrice(&_FtsoV2AnchorFeedConsumer.TransactOpts, data)
}

// SavePrice is a paid mutator transaction binding the contract method 0x87179d28.
//
// Solidity: function savePrice((bytes32[],(uint32,bytes21,int32,uint16,int8)) data) returns()
func (_FtsoV2AnchorFeedConsumer *FtsoV2AnchorFeedConsumerTransactorSession) SavePrice(data FtsoV2InterfaceFeedDataWithProof) (*types.Transaction, error) {
	return _FtsoV2AnchorFeedConsumer.Contract.SavePrice(&_FtsoV2AnchorFeedConsumer.TransactOpts, data)
}
