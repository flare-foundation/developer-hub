// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package main

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

// FtsoV2MetaData contains all meta data concerning the FtsoV2 contract.
var FtsoV2MetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_addressUpdater\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[],\"name\":\"FTSO_PROTOCOL_ID\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"fastUpdater\",\"outputs\":[{\"internalType\":\"contractIFastUpdater\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"fastUpdatesConfiguration\",\"outputs\":[{\"internalType\":\"contractIFastUpdatesConfiguration\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getAddressUpdater\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"_addressUpdater\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes21\",\"name\":\"_feedId\",\"type\":\"bytes21\"}],\"name\":\"getFeedById\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"int8\",\"name\":\"\",\"type\":\"int8\"},{\"internalType\":\"uint64\",\"name\":\"\",\"type\":\"uint64\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes21\",\"name\":\"_feedId\",\"type\":\"bytes21\"}],\"name\":\"getFeedByIdInWei\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"_value\",\"type\":\"uint256\"},{\"internalType\":\"uint64\",\"name\":\"_timestamp\",\"type\":\"uint64\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_index\",\"type\":\"uint256\"}],\"name\":\"getFeedByIndex\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"int8\",\"name\":\"\",\"type\":\"int8\"},{\"internalType\":\"uint64\",\"name\":\"\",\"type\":\"uint64\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_index\",\"type\":\"uint256\"}],\"name\":\"getFeedByIndexInWei\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"_value\",\"type\":\"uint256\"},{\"internalType\":\"uint64\",\"name\":\"_timestamp\",\"type\":\"uint64\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_index\",\"type\":\"uint256\"}],\"name\":\"getFeedId\",\"outputs\":[{\"internalType\":\"bytes21\",\"name\":\"\",\"type\":\"bytes21\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes21\",\"name\":\"_feedId\",\"type\":\"bytes21\"}],\"name\":\"getFeedIndex\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes21[]\",\"name\":\"_feedIds\",\"type\":\"bytes21[]\"}],\"name\":\"getFeedsById\",\"outputs\":[{\"internalType\":\"uint256[]\",\"name\":\"\",\"type\":\"uint256[]\"},{\"internalType\":\"int8[]\",\"name\":\"\",\"type\":\"int8[]\"},{\"internalType\":\"uint64\",\"name\":\"\",\"type\":\"uint64\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes21[]\",\"name\":\"_feedIds\",\"type\":\"bytes21[]\"}],\"name\":\"getFeedsByIdInWei\",\"outputs\":[{\"internalType\":\"uint256[]\",\"name\":\"_values\",\"type\":\"uint256[]\"},{\"internalType\":\"uint64\",\"name\":\"_timestamp\",\"type\":\"uint64\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"_indices\",\"type\":\"uint256[]\"}],\"name\":\"getFeedsByIndex\",\"outputs\":[{\"internalType\":\"uint256[]\",\"name\":\"\",\"type\":\"uint256[]\"},{\"internalType\":\"int8[]\",\"name\":\"\",\"type\":\"int8[]\"},{\"internalType\":\"uint64\",\"name\":\"\",\"type\":\"uint64\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"_indices\",\"type\":\"uint256[]\"}],\"name\":\"getFeedsByIndexInWei\",\"outputs\":[{\"internalType\":\"uint256[]\",\"name\":\"_values\",\"type\":\"uint256[]\"},{\"internalType\":\"uint64\",\"name\":\"_timestamp\",\"type\":\"uint64\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"relay\",\"outputs\":[{\"internalType\":\"contractIRelay\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"_contractNameHashes\",\"type\":\"bytes32[]\"},{\"internalType\":\"address[]\",\"name\":\"_contractAddresses\",\"type\":\"address[]\"}],\"name\":\"updateContractAddresses\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"bytes32[]\",\"name\":\"proof\",\"type\":\"bytes32[]\"},{\"components\":[{\"internalType\":\"uint32\",\"name\":\"votingRoundId\",\"type\":\"uint32\"},{\"internalType\":\"bytes21\",\"name\":\"id\",\"type\":\"bytes21\"},{\"internalType\":\"int32\",\"name\":\"value\",\"type\":\"int32\"},{\"internalType\":\"uint16\",\"name\":\"turnoutBIPS\",\"type\":\"uint16\"},{\"internalType\":\"int8\",\"name\":\"decimals\",\"type\":\"int8\"}],\"internalType\":\"structFtsoV2Interface.FeedData\",\"name\":\"body\",\"type\":\"tuple\"}],\"internalType\":\"structFtsoV2Interface.FeedDataWithProof\",\"name\":\"_feedData\",\"type\":\"tuple\"}],\"name\":\"verifyFeedData\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
}

// FtsoV2ABI is the input ABI used to generate the binding from.
// Deprecated: Use FtsoV2MetaData.ABI instead.
var FtsoV2ABI = FtsoV2MetaData.ABI

// FtsoV2 is an auto generated Go binding around an Ethereum contract.
type FtsoV2 struct {
	FtsoV2Caller     // Read-only binding to the contract
	FtsoV2Transactor // Write-only binding to the contract
	FtsoV2Filterer   // Log filterer for contract events
}

// FtsoV2Caller is an auto generated read-only Go binding around an Ethereum contract.
type FtsoV2Caller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FtsoV2Transactor is an auto generated write-only Go binding around an Ethereum contract.
type FtsoV2Transactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FtsoV2Filterer is an auto generated log filtering Go binding around an Ethereum contract events.
type FtsoV2Filterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FtsoV2Session is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type FtsoV2Session struct {
	Contract     *FtsoV2           // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// FtsoV2CallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type FtsoV2CallerSession struct {
	Contract *FtsoV2Caller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts // Call options to use throughout this session
}

// FtsoV2TransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type FtsoV2TransactorSession struct {
	Contract     *FtsoV2Transactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// FtsoV2Raw is an auto generated low-level Go binding around an Ethereum contract.
type FtsoV2Raw struct {
	Contract *FtsoV2 // Generic contract binding to access the raw methods on
}

// FtsoV2CallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type FtsoV2CallerRaw struct {
	Contract *FtsoV2Caller // Generic read-only contract binding to access the raw methods on
}

// FtsoV2TransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type FtsoV2TransactorRaw struct {
	Contract *FtsoV2Transactor // Generic write-only contract binding to access the raw methods on
}

// NewFtsoV2 creates a new instance of FtsoV2, bound to a specific deployed contract.
func NewFtsoV2(address common.Address, backend bind.ContractBackend) (*FtsoV2, error) {
	contract, err := bindFtsoV2(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &FtsoV2{FtsoV2Caller: FtsoV2Caller{contract: contract}, FtsoV2Transactor: FtsoV2Transactor{contract: contract}, FtsoV2Filterer: FtsoV2Filterer{contract: contract}}, nil
}

// NewFtsoV2Caller creates a new read-only instance of FtsoV2, bound to a specific deployed contract.
func NewFtsoV2Caller(address common.Address, caller bind.ContractCaller) (*FtsoV2Caller, error) {
	contract, err := bindFtsoV2(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &FtsoV2Caller{contract: contract}, nil
}

// NewFtsoV2Transactor creates a new write-only instance of FtsoV2, bound to a specific deployed contract.
func NewFtsoV2Transactor(address common.Address, transactor bind.ContractTransactor) (*FtsoV2Transactor, error) {
	contract, err := bindFtsoV2(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &FtsoV2Transactor{contract: contract}, nil
}

// NewFtsoV2Filterer creates a new log filterer instance of FtsoV2, bound to a specific deployed contract.
func NewFtsoV2Filterer(address common.Address, filterer bind.ContractFilterer) (*FtsoV2Filterer, error) {
	contract, err := bindFtsoV2(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &FtsoV2Filterer{contract: contract}, nil
}

// bindFtsoV2 binds a generic wrapper to an already deployed contract.
func bindFtsoV2(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := FtsoV2MetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FtsoV2 *FtsoV2Raw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FtsoV2.Contract.FtsoV2Caller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FtsoV2 *FtsoV2Raw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FtsoV2.Contract.FtsoV2Transactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FtsoV2 *FtsoV2Raw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FtsoV2.Contract.FtsoV2Transactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FtsoV2 *FtsoV2CallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FtsoV2.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FtsoV2 *FtsoV2TransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FtsoV2.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FtsoV2 *FtsoV2TransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FtsoV2.Contract.contract.Transact(opts, method, params...)
}

// FTSOPROTOCOLID is a free data retrieval call binding the contract method 0x6d461779.
//
// Solidity: function FTSO_PROTOCOL_ID() view returns(uint256)
func (_FtsoV2 *FtsoV2Caller) FTSOPROTOCOLID(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FtsoV2.contract.Call(opts, &out, "FTSO_PROTOCOL_ID")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// FTSOPROTOCOLID is a free data retrieval call binding the contract method 0x6d461779.
//
// Solidity: function FTSO_PROTOCOL_ID() view returns(uint256)
func (_FtsoV2 *FtsoV2Session) FTSOPROTOCOLID() (*big.Int, error) {
	return _FtsoV2.Contract.FTSOPROTOCOLID(&_FtsoV2.CallOpts)
}

// FTSOPROTOCOLID is a free data retrieval call binding the contract method 0x6d461779.
//
// Solidity: function FTSO_PROTOCOL_ID() view returns(uint256)
func (_FtsoV2 *FtsoV2CallerSession) FTSOPROTOCOLID() (*big.Int, error) {
	return _FtsoV2.Contract.FTSOPROTOCOLID(&_FtsoV2.CallOpts)
}

// FastUpdater is a free data retrieval call binding the contract method 0xd29a4fa9.
//
// Solidity: function fastUpdater() view returns(address)
func (_FtsoV2 *FtsoV2Caller) FastUpdater(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FtsoV2.contract.Call(opts, &out, "fastUpdater")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FastUpdater is a free data retrieval call binding the contract method 0xd29a4fa9.
//
// Solidity: function fastUpdater() view returns(address)
func (_FtsoV2 *FtsoV2Session) FastUpdater() (common.Address, error) {
	return _FtsoV2.Contract.FastUpdater(&_FtsoV2.CallOpts)
}

// FastUpdater is a free data retrieval call binding the contract method 0xd29a4fa9.
//
// Solidity: function fastUpdater() view returns(address)
func (_FtsoV2 *FtsoV2CallerSession) FastUpdater() (common.Address, error) {
	return _FtsoV2.Contract.FastUpdater(&_FtsoV2.CallOpts)
}

// FastUpdatesConfiguration is a free data retrieval call binding the contract method 0xc10f489a.
//
// Solidity: function fastUpdatesConfiguration() view returns(address)
func (_FtsoV2 *FtsoV2Caller) FastUpdatesConfiguration(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FtsoV2.contract.Call(opts, &out, "fastUpdatesConfiguration")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FastUpdatesConfiguration is a free data retrieval call binding the contract method 0xc10f489a.
//
// Solidity: function fastUpdatesConfiguration() view returns(address)
func (_FtsoV2 *FtsoV2Session) FastUpdatesConfiguration() (common.Address, error) {
	return _FtsoV2.Contract.FastUpdatesConfiguration(&_FtsoV2.CallOpts)
}

// FastUpdatesConfiguration is a free data retrieval call binding the contract method 0xc10f489a.
//
// Solidity: function fastUpdatesConfiguration() view returns(address)
func (_FtsoV2 *FtsoV2CallerSession) FastUpdatesConfiguration() (common.Address, error) {
	return _FtsoV2.Contract.FastUpdatesConfiguration(&_FtsoV2.CallOpts)
}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_FtsoV2 *FtsoV2Caller) GetAddressUpdater(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FtsoV2.contract.Call(opts, &out, "getAddressUpdater")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_FtsoV2 *FtsoV2Session) GetAddressUpdater() (common.Address, error) {
	return _FtsoV2.Contract.GetAddressUpdater(&_FtsoV2.CallOpts)
}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_FtsoV2 *FtsoV2CallerSession) GetAddressUpdater() (common.Address, error) {
	return _FtsoV2.Contract.GetAddressUpdater(&_FtsoV2.CallOpts)
}

// GetFeedId is a free data retrieval call binding the contract method 0x93102836.
//
// Solidity: function getFeedId(uint256 _index) view returns(bytes21)
func (_FtsoV2 *FtsoV2Caller) GetFeedId(opts *bind.CallOpts, _index *big.Int) ([21]byte, error) {
	var out []interface{}
	err := _FtsoV2.contract.Call(opts, &out, "getFeedId", _index)

	if err != nil {
		return *new([21]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([21]byte)).(*[21]byte)

	return out0, err

}

// GetFeedId is a free data retrieval call binding the contract method 0x93102836.
//
// Solidity: function getFeedId(uint256 _index) view returns(bytes21)
func (_FtsoV2 *FtsoV2Session) GetFeedId(_index *big.Int) ([21]byte, error) {
	return _FtsoV2.Contract.GetFeedId(&_FtsoV2.CallOpts, _index)
}

// GetFeedId is a free data retrieval call binding the contract method 0x93102836.
//
// Solidity: function getFeedId(uint256 _index) view returns(bytes21)
func (_FtsoV2 *FtsoV2CallerSession) GetFeedId(_index *big.Int) ([21]byte, error) {
	return _FtsoV2.Contract.GetFeedId(&_FtsoV2.CallOpts, _index)
}

// GetFeedIndex is a free data retrieval call binding the contract method 0x0a9cabe7.
//
// Solidity: function getFeedIndex(bytes21 _feedId) view returns(uint256)
func (_FtsoV2 *FtsoV2Caller) GetFeedIndex(opts *bind.CallOpts, _feedId [21]byte) (*big.Int, error) {
	var out []interface{}
	err := _FtsoV2.contract.Call(opts, &out, "getFeedIndex", _feedId)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetFeedIndex is a free data retrieval call binding the contract method 0x0a9cabe7.
//
// Solidity: function getFeedIndex(bytes21 _feedId) view returns(uint256)
func (_FtsoV2 *FtsoV2Session) GetFeedIndex(_feedId [21]byte) (*big.Int, error) {
	return _FtsoV2.Contract.GetFeedIndex(&_FtsoV2.CallOpts, _feedId)
}

// GetFeedIndex is a free data retrieval call binding the contract method 0x0a9cabe7.
//
// Solidity: function getFeedIndex(bytes21 _feedId) view returns(uint256)
func (_FtsoV2 *FtsoV2CallerSession) GetFeedIndex(_feedId [21]byte) (*big.Int, error) {
	return _FtsoV2.Contract.GetFeedIndex(&_FtsoV2.CallOpts, _feedId)
}

// Relay is a free data retrieval call binding the contract method 0xb59589d1.
//
// Solidity: function relay() view returns(address)
func (_FtsoV2 *FtsoV2Caller) Relay(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FtsoV2.contract.Call(opts, &out, "relay")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Relay is a free data retrieval call binding the contract method 0xb59589d1.
//
// Solidity: function relay() view returns(address)
func (_FtsoV2 *FtsoV2Session) Relay() (common.Address, error) {
	return _FtsoV2.Contract.Relay(&_FtsoV2.CallOpts)
}

// Relay is a free data retrieval call binding the contract method 0xb59589d1.
//
// Solidity: function relay() view returns(address)
func (_FtsoV2 *FtsoV2CallerSession) Relay() (common.Address, error) {
	return _FtsoV2.Contract.Relay(&_FtsoV2.CallOpts)
}

// VerifyFeedData is a free data retrieval call binding the contract method 0xceb05472.
//
// Solidity: function verifyFeedData((bytes32[],(uint32,bytes21,int32,uint16,int8)) _feedData) view returns(bool)
func (_FtsoV2 *FtsoV2Caller) VerifyFeedData(opts *bind.CallOpts, _feedData FtsoV2InterfaceFeedDataWithProof) (bool, error) {
	var out []interface{}
	err := _FtsoV2.contract.Call(opts, &out, "verifyFeedData", _feedData)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// VerifyFeedData is a free data retrieval call binding the contract method 0xceb05472.
//
// Solidity: function verifyFeedData((bytes32[],(uint32,bytes21,int32,uint16,int8)) _feedData) view returns(bool)
func (_FtsoV2 *FtsoV2Session) VerifyFeedData(_feedData FtsoV2InterfaceFeedDataWithProof) (bool, error) {
	return _FtsoV2.Contract.VerifyFeedData(&_FtsoV2.CallOpts, _feedData)
}

// VerifyFeedData is a free data retrieval call binding the contract method 0xceb05472.
//
// Solidity: function verifyFeedData((bytes32[],(uint32,bytes21,int32,uint16,int8)) _feedData) view returns(bool)
func (_FtsoV2 *FtsoV2CallerSession) VerifyFeedData(_feedData FtsoV2InterfaceFeedDataWithProof) (bool, error) {
	return _FtsoV2.Contract.VerifyFeedData(&_FtsoV2.CallOpts, _feedData)
}

// GetFeedById is a paid mutator transaction binding the contract method 0x93e9f806.
//
// Solidity: function getFeedById(bytes21 _feedId) payable returns(uint256, int8, uint64)
func (_FtsoV2 *FtsoV2Transactor) GetFeedById(opts *bind.TransactOpts, _feedId [21]byte) (*types.Transaction, error) {
	return _FtsoV2.contract.Transact(opts, "getFeedById", _feedId)
}

// GetFeedById is a paid mutator transaction binding the contract method 0x93e9f806.
//
// Solidity: function getFeedById(bytes21 _feedId) payable returns(uint256, int8, uint64)
func (_FtsoV2 *FtsoV2Session) GetFeedById(_feedId [21]byte) (*types.Transaction, error) {
	return _FtsoV2.Contract.GetFeedById(&_FtsoV2.TransactOpts, _feedId)
}

// GetFeedById is a paid mutator transaction binding the contract method 0x93e9f806.
//
// Solidity: function getFeedById(bytes21 _feedId) payable returns(uint256, int8, uint64)
func (_FtsoV2 *FtsoV2TransactorSession) GetFeedById(_feedId [21]byte) (*types.Transaction, error) {
	return _FtsoV2.Contract.GetFeedById(&_FtsoV2.TransactOpts, _feedId)
}

// GetFeedByIdInWei is a paid mutator transaction binding the contract method 0x59feadf6.
//
// Solidity: function getFeedByIdInWei(bytes21 _feedId) payable returns(uint256 _value, uint64 _timestamp)
func (_FtsoV2 *FtsoV2Transactor) GetFeedByIdInWei(opts *bind.TransactOpts, _feedId [21]byte) (*types.Transaction, error) {
	return _FtsoV2.contract.Transact(opts, "getFeedByIdInWei", _feedId)
}

// GetFeedByIdInWei is a paid mutator transaction binding the contract method 0x59feadf6.
//
// Solidity: function getFeedByIdInWei(bytes21 _feedId) payable returns(uint256 _value, uint64 _timestamp)
func (_FtsoV2 *FtsoV2Session) GetFeedByIdInWei(_feedId [21]byte) (*types.Transaction, error) {
	return _FtsoV2.Contract.GetFeedByIdInWei(&_FtsoV2.TransactOpts, _feedId)
}

// GetFeedByIdInWei is a paid mutator transaction binding the contract method 0x59feadf6.
//
// Solidity: function getFeedByIdInWei(bytes21 _feedId) payable returns(uint256 _value, uint64 _timestamp)
func (_FtsoV2 *FtsoV2TransactorSession) GetFeedByIdInWei(_feedId [21]byte) (*types.Transaction, error) {
	return _FtsoV2.Contract.GetFeedByIdInWei(&_FtsoV2.TransactOpts, _feedId)
}

// GetFeedByIndex is a paid mutator transaction binding the contract method 0x108861f3.
//
// Solidity: function getFeedByIndex(uint256 _index) payable returns(uint256, int8, uint64)
func (_FtsoV2 *FtsoV2Transactor) GetFeedByIndex(opts *bind.TransactOpts, _index *big.Int) (*types.Transaction, error) {
	return _FtsoV2.contract.Transact(opts, "getFeedByIndex", _index)
}

// GetFeedByIndex is a paid mutator transaction binding the contract method 0x108861f3.
//
// Solidity: function getFeedByIndex(uint256 _index) payable returns(uint256, int8, uint64)
func (_FtsoV2 *FtsoV2Session) GetFeedByIndex(_index *big.Int) (*types.Transaction, error) {
	return _FtsoV2.Contract.GetFeedByIndex(&_FtsoV2.TransactOpts, _index)
}

// GetFeedByIndex is a paid mutator transaction binding the contract method 0x108861f3.
//
// Solidity: function getFeedByIndex(uint256 _index) payable returns(uint256, int8, uint64)
func (_FtsoV2 *FtsoV2TransactorSession) GetFeedByIndex(_index *big.Int) (*types.Transaction, error) {
	return _FtsoV2.Contract.GetFeedByIndex(&_FtsoV2.TransactOpts, _index)
}

// GetFeedByIndexInWei is a paid mutator transaction binding the contract method 0x2ee874e8.
//
// Solidity: function getFeedByIndexInWei(uint256 _index) payable returns(uint256 _value, uint64 _timestamp)
func (_FtsoV2 *FtsoV2Transactor) GetFeedByIndexInWei(opts *bind.TransactOpts, _index *big.Int) (*types.Transaction, error) {
	return _FtsoV2.contract.Transact(opts, "getFeedByIndexInWei", _index)
}

// GetFeedByIndexInWei is a paid mutator transaction binding the contract method 0x2ee874e8.
//
// Solidity: function getFeedByIndexInWei(uint256 _index) payable returns(uint256 _value, uint64 _timestamp)
func (_FtsoV2 *FtsoV2Session) GetFeedByIndexInWei(_index *big.Int) (*types.Transaction, error) {
	return _FtsoV2.Contract.GetFeedByIndexInWei(&_FtsoV2.TransactOpts, _index)
}

// GetFeedByIndexInWei is a paid mutator transaction binding the contract method 0x2ee874e8.
//
// Solidity: function getFeedByIndexInWei(uint256 _index) payable returns(uint256 _value, uint64 _timestamp)
func (_FtsoV2 *FtsoV2TransactorSession) GetFeedByIndexInWei(_index *big.Int) (*types.Transaction, error) {
	return _FtsoV2.Contract.GetFeedByIndexInWei(&_FtsoV2.TransactOpts, _index)
}

// GetFeedsById is a paid mutator transaction binding the contract method 0x4c375745.
//
// Solidity: function getFeedsById(bytes21[] _feedIds) payable returns(uint256[], int8[], uint64)
func (_FtsoV2 *FtsoV2Transactor) GetFeedsById(opts *bind.TransactOpts, _feedIds [][21]byte) (*types.Transaction, error) {
	return _FtsoV2.contract.Transact(opts, "getFeedsById", _feedIds)
}

// GetFeedsById is a paid mutator transaction binding the contract method 0x4c375745.
//
// Solidity: function getFeedsById(bytes21[] _feedIds) payable returns(uint256[], int8[], uint64)
func (_FtsoV2 *FtsoV2Session) GetFeedsById(_feedIds [][21]byte) (*types.Transaction, error) {
	return _FtsoV2.Contract.GetFeedsById(&_FtsoV2.TransactOpts, _feedIds)
}

// GetFeedsById is a paid mutator transaction binding the contract method 0x4c375745.
//
// Solidity: function getFeedsById(bytes21[] _feedIds) payable returns(uint256[], int8[], uint64)
func (_FtsoV2 *FtsoV2TransactorSession) GetFeedsById(_feedIds [][21]byte) (*types.Transaction, error) {
	return _FtsoV2.Contract.GetFeedsById(&_FtsoV2.TransactOpts, _feedIds)
}

// GetFeedsByIdInWei is a paid mutator transaction binding the contract method 0xe3f5ccf5.
//
// Solidity: function getFeedsByIdInWei(bytes21[] _feedIds) payable returns(uint256[] _values, uint64 _timestamp)
func (_FtsoV2 *FtsoV2Transactor) GetFeedsByIdInWei(opts *bind.TransactOpts, _feedIds [][21]byte) (*types.Transaction, error) {
	return _FtsoV2.contract.Transact(opts, "getFeedsByIdInWei", _feedIds)
}

// GetFeedsByIdInWei is a paid mutator transaction binding the contract method 0xe3f5ccf5.
//
// Solidity: function getFeedsByIdInWei(bytes21[] _feedIds) payable returns(uint256[] _values, uint64 _timestamp)
func (_FtsoV2 *FtsoV2Session) GetFeedsByIdInWei(_feedIds [][21]byte) (*types.Transaction, error) {
	return _FtsoV2.Contract.GetFeedsByIdInWei(&_FtsoV2.TransactOpts, _feedIds)
}

// GetFeedsByIdInWei is a paid mutator transaction binding the contract method 0xe3f5ccf5.
//
// Solidity: function getFeedsByIdInWei(bytes21[] _feedIds) payable returns(uint256[] _values, uint64 _timestamp)
func (_FtsoV2 *FtsoV2TransactorSession) GetFeedsByIdInWei(_feedIds [][21]byte) (*types.Transaction, error) {
	return _FtsoV2.Contract.GetFeedsByIdInWei(&_FtsoV2.TransactOpts, _feedIds)
}

// GetFeedsByIndex is a paid mutator transaction binding the contract method 0x14956f5b.
//
// Solidity: function getFeedsByIndex(uint256[] _indices) payable returns(uint256[], int8[], uint64)
func (_FtsoV2 *FtsoV2Transactor) GetFeedsByIndex(opts *bind.TransactOpts, _indices []*big.Int) (*types.Transaction, error) {
	return _FtsoV2.contract.Transact(opts, "getFeedsByIndex", _indices)
}

// GetFeedsByIndex is a paid mutator transaction binding the contract method 0x14956f5b.
//
// Solidity: function getFeedsByIndex(uint256[] _indices) payable returns(uint256[], int8[], uint64)
func (_FtsoV2 *FtsoV2Session) GetFeedsByIndex(_indices []*big.Int) (*types.Transaction, error) {
	return _FtsoV2.Contract.GetFeedsByIndex(&_FtsoV2.TransactOpts, _indices)
}

// GetFeedsByIndex is a paid mutator transaction binding the contract method 0x14956f5b.
//
// Solidity: function getFeedsByIndex(uint256[] _indices) payable returns(uint256[], int8[], uint64)
func (_FtsoV2 *FtsoV2TransactorSession) GetFeedsByIndex(_indices []*big.Int) (*types.Transaction, error) {
	return _FtsoV2.Contract.GetFeedsByIndex(&_FtsoV2.TransactOpts, _indices)
}

// GetFeedsByIndexInWei is a paid mutator transaction binding the contract method 0x7722802b.
//
// Solidity: function getFeedsByIndexInWei(uint256[] _indices) payable returns(uint256[] _values, uint64 _timestamp)
func (_FtsoV2 *FtsoV2Transactor) GetFeedsByIndexInWei(opts *bind.TransactOpts, _indices []*big.Int) (*types.Transaction, error) {
	return _FtsoV2.contract.Transact(opts, "getFeedsByIndexInWei", _indices)
}

// GetFeedsByIndexInWei is a paid mutator transaction binding the contract method 0x7722802b.
//
// Solidity: function getFeedsByIndexInWei(uint256[] _indices) payable returns(uint256[] _values, uint64 _timestamp)
func (_FtsoV2 *FtsoV2Session) GetFeedsByIndexInWei(_indices []*big.Int) (*types.Transaction, error) {
	return _FtsoV2.Contract.GetFeedsByIndexInWei(&_FtsoV2.TransactOpts, _indices)
}

// GetFeedsByIndexInWei is a paid mutator transaction binding the contract method 0x7722802b.
//
// Solidity: function getFeedsByIndexInWei(uint256[] _indices) payable returns(uint256[] _values, uint64 _timestamp)
func (_FtsoV2 *FtsoV2TransactorSession) GetFeedsByIndexInWei(_indices []*big.Int) (*types.Transaction, error) {
	return _FtsoV2.Contract.GetFeedsByIndexInWei(&_FtsoV2.TransactOpts, _indices)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_FtsoV2 *FtsoV2Transactor) UpdateContractAddresses(opts *bind.TransactOpts, _contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _FtsoV2.contract.Transact(opts, "updateContractAddresses", _contractNameHashes, _contractAddresses)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_FtsoV2 *FtsoV2Session) UpdateContractAddresses(_contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _FtsoV2.Contract.UpdateContractAddresses(&_FtsoV2.TransactOpts, _contractNameHashes, _contractAddresses)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_FtsoV2 *FtsoV2TransactorSession) UpdateContractAddresses(_contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _FtsoV2.Contract.UpdateContractAddresses(&_FtsoV2.TransactOpts, _contractNameHashes, _contractAddresses)
}
