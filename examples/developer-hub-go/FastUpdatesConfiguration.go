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

// IFastUpdatesConfigurationFeedConfiguration is an auto generated low-level Go binding around an user-defined struct.
type IFastUpdatesConfigurationFeedConfiguration struct {
	FeedId          [21]byte
	RewardBandValue uint32
	InflationShare  *big.Int
}

// FastUpdatesConfigurationMetaData contains all meta data concerning the FastUpdatesConfiguration contract.
var FastUpdatesConfigurationMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"contractIGovernanceSettings\",\"name\":\"_governanceSettings\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_initialGovernance\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_addressUpdater\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes21\",\"name\":\"feedId\",\"type\":\"bytes21\"},{\"indexed\":false,\"internalType\":\"uint32\",\"name\":\"rewardBandValue\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"uint24\",\"name\":\"inflationShare\",\"type\":\"uint24\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"index\",\"type\":\"uint256\"}],\"name\":\"FeedAdded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes21\",\"name\":\"feedId\",\"type\":\"bytes21\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"index\",\"type\":\"uint256\"}],\"name\":\"FeedRemoved\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes21\",\"name\":\"feedId\",\"type\":\"bytes21\"},{\"indexed\":false,\"internalType\":\"uint32\",\"name\":\"rewardBandValue\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"uint24\",\"name\":\"inflationShare\",\"type\":\"uint24\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"index\",\"type\":\"uint256\"}],\"name\":\"FeedUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes4\",\"name\":\"selector\",\"type\":\"bytes4\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"allowedAfterTimestamp\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"encodedCall\",\"type\":\"bytes\"}],\"name\":\"GovernanceCallTimelocked\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"initialGovernance\",\"type\":\"address\"}],\"name\":\"GovernanceInitialised\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"governanceSettings\",\"type\":\"address\"}],\"name\":\"GovernedProductionModeEntered\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes4\",\"name\":\"selector\",\"type\":\"bytes4\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"TimelockedGovernanceCallCanceled\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes4\",\"name\":\"selector\",\"type\":\"bytes4\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"TimelockedGovernanceCallExecuted\",\"type\":\"event\"},{\"inputs\":[{\"components\":[{\"internalType\":\"bytes21\",\"name\":\"feedId\",\"type\":\"bytes21\"},{\"internalType\":\"uint32\",\"name\":\"rewardBandValue\",\"type\":\"uint32\"},{\"internalType\":\"uint24\",\"name\":\"inflationShare\",\"type\":\"uint24\"}],\"internalType\":\"structIFastUpdatesConfiguration.FeedConfiguration[]\",\"name\":\"_feedConfigs\",\"type\":\"tuple[]\"}],\"name\":\"addFeeds\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"_selector\",\"type\":\"bytes4\"}],\"name\":\"cancelGovernanceCall\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"_selector\",\"type\":\"bytes4\"}],\"name\":\"executeGovernanceCall\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"fastUpdater\",\"outputs\":[{\"internalType\":\"contractIIFastUpdater\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getAddressUpdater\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"_addressUpdater\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getFeedConfigurations\",\"outputs\":[{\"components\":[{\"internalType\":\"bytes21\",\"name\":\"feedId\",\"type\":\"bytes21\"},{\"internalType\":\"uint32\",\"name\":\"rewardBandValue\",\"type\":\"uint32\"},{\"internalType\":\"uint24\",\"name\":\"inflationShare\",\"type\":\"uint24\"}],\"internalType\":\"structIFastUpdatesConfiguration.FeedConfiguration[]\",\"name\":\"\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_index\",\"type\":\"uint256\"}],\"name\":\"getFeedId\",\"outputs\":[{\"internalType\":\"bytes21\",\"name\":\"_feedId\",\"type\":\"bytes21\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getFeedIds\",\"outputs\":[{\"internalType\":\"bytes21[]\",\"name\":\"_feedIds\",\"type\":\"bytes21[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes21\",\"name\":\"_feedId\",\"type\":\"bytes21\"}],\"name\":\"getFeedIndex\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"_index\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getNumberOfFeeds\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getUnusedIndices\",\"outputs\":[{\"internalType\":\"uint256[]\",\"name\":\"\",\"type\":\"uint256[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"governance\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"governanceSettings\",\"outputs\":[{\"internalType\":\"contractIGovernanceSettings\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contractIGovernanceSettings\",\"name\":\"_governanceSettings\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_initialGovernance\",\"type\":\"address\"}],\"name\":\"initialise\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_address\",\"type\":\"address\"}],\"name\":\"isExecutor\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"productionMode\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes21[]\",\"name\":\"_feedIds\",\"type\":\"bytes21[]\"}],\"name\":\"removeFeeds\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"switchToProductionMode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"selector\",\"type\":\"bytes4\"}],\"name\":\"timelockedCalls\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"allowedAfterTimestamp\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"encodedCall\",\"type\":\"bytes\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"_contractNameHashes\",\"type\":\"bytes32[]\"},{\"internalType\":\"address[]\",\"name\":\"_contractAddresses\",\"type\":\"address[]\"}],\"name\":\"updateContractAddresses\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"bytes21\",\"name\":\"feedId\",\"type\":\"bytes21\"},{\"internalType\":\"uint32\",\"name\":\"rewardBandValue\",\"type\":\"uint32\"},{\"internalType\":\"uint24\",\"name\":\"inflationShare\",\"type\":\"uint24\"}],\"internalType\":\"structIFastUpdatesConfiguration.FeedConfiguration[]\",\"name\":\"_feedConfigs\",\"type\":\"tuple[]\"}],\"name\":\"updateFeeds\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
}

// FastUpdatesConfigurationABI is the input ABI used to generate the binding from.
// Deprecated: Use FastUpdatesConfigurationMetaData.ABI instead.
var FastUpdatesConfigurationABI = FastUpdatesConfigurationMetaData.ABI

// FastUpdatesConfiguration is an auto generated Go binding around an Ethereum contract.
type FastUpdatesConfiguration struct {
	FastUpdatesConfigurationCaller     // Read-only binding to the contract
	FastUpdatesConfigurationTransactor // Write-only binding to the contract
	FastUpdatesConfigurationFilterer   // Log filterer for contract events
}

// FastUpdatesConfigurationCaller is an auto generated read-only Go binding around an Ethereum contract.
type FastUpdatesConfigurationCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FastUpdatesConfigurationTransactor is an auto generated write-only Go binding around an Ethereum contract.
type FastUpdatesConfigurationTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FastUpdatesConfigurationFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type FastUpdatesConfigurationFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FastUpdatesConfigurationSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type FastUpdatesConfigurationSession struct {
	Contract     *FastUpdatesConfiguration // Generic contract binding to set the session for
	CallOpts     bind.CallOpts             // Call options to use throughout this session
	TransactOpts bind.TransactOpts         // Transaction auth options to use throughout this session
}

// FastUpdatesConfigurationCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type FastUpdatesConfigurationCallerSession struct {
	Contract *FastUpdatesConfigurationCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts                   // Call options to use throughout this session
}

// FastUpdatesConfigurationTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type FastUpdatesConfigurationTransactorSession struct {
	Contract     *FastUpdatesConfigurationTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts                   // Transaction auth options to use throughout this session
}

// FastUpdatesConfigurationRaw is an auto generated low-level Go binding around an Ethereum contract.
type FastUpdatesConfigurationRaw struct {
	Contract *FastUpdatesConfiguration // Generic contract binding to access the raw methods on
}

// FastUpdatesConfigurationCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type FastUpdatesConfigurationCallerRaw struct {
	Contract *FastUpdatesConfigurationCaller // Generic read-only contract binding to access the raw methods on
}

// FastUpdatesConfigurationTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type FastUpdatesConfigurationTransactorRaw struct {
	Contract *FastUpdatesConfigurationTransactor // Generic write-only contract binding to access the raw methods on
}

// NewFastUpdatesConfiguration creates a new instance of FastUpdatesConfiguration, bound to a specific deployed contract.
func NewFastUpdatesConfiguration(address common.Address, backend bind.ContractBackend) (*FastUpdatesConfiguration, error) {
	contract, err := bindFastUpdatesConfiguration(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &FastUpdatesConfiguration{FastUpdatesConfigurationCaller: FastUpdatesConfigurationCaller{contract: contract}, FastUpdatesConfigurationTransactor: FastUpdatesConfigurationTransactor{contract: contract}, FastUpdatesConfigurationFilterer: FastUpdatesConfigurationFilterer{contract: contract}}, nil
}

// NewFastUpdatesConfigurationCaller creates a new read-only instance of FastUpdatesConfiguration, bound to a specific deployed contract.
func NewFastUpdatesConfigurationCaller(address common.Address, caller bind.ContractCaller) (*FastUpdatesConfigurationCaller, error) {
	contract, err := bindFastUpdatesConfiguration(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &FastUpdatesConfigurationCaller{contract: contract}, nil
}

// NewFastUpdatesConfigurationTransactor creates a new write-only instance of FastUpdatesConfiguration, bound to a specific deployed contract.
func NewFastUpdatesConfigurationTransactor(address common.Address, transactor bind.ContractTransactor) (*FastUpdatesConfigurationTransactor, error) {
	contract, err := bindFastUpdatesConfiguration(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &FastUpdatesConfigurationTransactor{contract: contract}, nil
}

// NewFastUpdatesConfigurationFilterer creates a new log filterer instance of FastUpdatesConfiguration, bound to a specific deployed contract.
func NewFastUpdatesConfigurationFilterer(address common.Address, filterer bind.ContractFilterer) (*FastUpdatesConfigurationFilterer, error) {
	contract, err := bindFastUpdatesConfiguration(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &FastUpdatesConfigurationFilterer{contract: contract}, nil
}

// bindFastUpdatesConfiguration binds a generic wrapper to an already deployed contract.
func bindFastUpdatesConfiguration(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := FastUpdatesConfigurationMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FastUpdatesConfiguration *FastUpdatesConfigurationRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FastUpdatesConfiguration.Contract.FastUpdatesConfigurationCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FastUpdatesConfiguration *FastUpdatesConfigurationRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.FastUpdatesConfigurationTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FastUpdatesConfiguration *FastUpdatesConfigurationRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.FastUpdatesConfigurationTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FastUpdatesConfiguration.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.contract.Transact(opts, method, params...)
}

// FastUpdater is a free data retrieval call binding the contract method 0xd29a4fa9.
//
// Solidity: function fastUpdater() view returns(address)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCaller) FastUpdater(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdatesConfiguration.contract.Call(opts, &out, "fastUpdater")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FastUpdater is a free data retrieval call binding the contract method 0xd29a4fa9.
//
// Solidity: function fastUpdater() view returns(address)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) FastUpdater() (common.Address, error) {
	return _FastUpdatesConfiguration.Contract.FastUpdater(&_FastUpdatesConfiguration.CallOpts)
}

// FastUpdater is a free data retrieval call binding the contract method 0xd29a4fa9.
//
// Solidity: function fastUpdater() view returns(address)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCallerSession) FastUpdater() (common.Address, error) {
	return _FastUpdatesConfiguration.Contract.FastUpdater(&_FastUpdatesConfiguration.CallOpts)
}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCaller) GetAddressUpdater(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdatesConfiguration.contract.Call(opts, &out, "getAddressUpdater")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) GetAddressUpdater() (common.Address, error) {
	return _FastUpdatesConfiguration.Contract.GetAddressUpdater(&_FastUpdatesConfiguration.CallOpts)
}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCallerSession) GetAddressUpdater() (common.Address, error) {
	return _FastUpdatesConfiguration.Contract.GetAddressUpdater(&_FastUpdatesConfiguration.CallOpts)
}

// GetFeedConfigurations is a free data retrieval call binding the contract method 0x31038aad.
//
// Solidity: function getFeedConfigurations() view returns((bytes21,uint32,uint24)[])
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCaller) GetFeedConfigurations(opts *bind.CallOpts) ([]IFastUpdatesConfigurationFeedConfiguration, error) {
	var out []interface{}
	err := _FastUpdatesConfiguration.contract.Call(opts, &out, "getFeedConfigurations")

	if err != nil {
		return *new([]IFastUpdatesConfigurationFeedConfiguration), err
	}

	out0 := *abi.ConvertType(out[0], new([]IFastUpdatesConfigurationFeedConfiguration)).(*[]IFastUpdatesConfigurationFeedConfiguration)

	return out0, err

}

// GetFeedConfigurations is a free data retrieval call binding the contract method 0x31038aad.
//
// Solidity: function getFeedConfigurations() view returns((bytes21,uint32,uint24)[])
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) GetFeedConfigurations() ([]IFastUpdatesConfigurationFeedConfiguration, error) {
	return _FastUpdatesConfiguration.Contract.GetFeedConfigurations(&_FastUpdatesConfiguration.CallOpts)
}

// GetFeedConfigurations is a free data retrieval call binding the contract method 0x31038aad.
//
// Solidity: function getFeedConfigurations() view returns((bytes21,uint32,uint24)[])
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCallerSession) GetFeedConfigurations() ([]IFastUpdatesConfigurationFeedConfiguration, error) {
	return _FastUpdatesConfiguration.Contract.GetFeedConfigurations(&_FastUpdatesConfiguration.CallOpts)
}

// GetFeedId is a free data retrieval call binding the contract method 0x93102836.
//
// Solidity: function getFeedId(uint256 _index) view returns(bytes21 _feedId)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCaller) GetFeedId(opts *bind.CallOpts, _index *big.Int) ([21]byte, error) {
	var out []interface{}
	err := _FastUpdatesConfiguration.contract.Call(opts, &out, "getFeedId", _index)

	if err != nil {
		return *new([21]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([21]byte)).(*[21]byte)

	return out0, err

}

// GetFeedId is a free data retrieval call binding the contract method 0x93102836.
//
// Solidity: function getFeedId(uint256 _index) view returns(bytes21 _feedId)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) GetFeedId(_index *big.Int) ([21]byte, error) {
	return _FastUpdatesConfiguration.Contract.GetFeedId(&_FastUpdatesConfiguration.CallOpts, _index)
}

// GetFeedId is a free data retrieval call binding the contract method 0x93102836.
//
// Solidity: function getFeedId(uint256 _index) view returns(bytes21 _feedId)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCallerSession) GetFeedId(_index *big.Int) ([21]byte, error) {
	return _FastUpdatesConfiguration.Contract.GetFeedId(&_FastUpdatesConfiguration.CallOpts, _index)
}

// GetFeedIds is a free data retrieval call binding the contract method 0x0c518dce.
//
// Solidity: function getFeedIds() view returns(bytes21[] _feedIds)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCaller) GetFeedIds(opts *bind.CallOpts) ([][21]byte, error) {
	var out []interface{}
	err := _FastUpdatesConfiguration.contract.Call(opts, &out, "getFeedIds")

	if err != nil {
		return *new([][21]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([][21]byte)).(*[][21]byte)

	return out0, err

}

// GetFeedIds is a free data retrieval call binding the contract method 0x0c518dce.
//
// Solidity: function getFeedIds() view returns(bytes21[] _feedIds)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) GetFeedIds() ([][21]byte, error) {
	return _FastUpdatesConfiguration.Contract.GetFeedIds(&_FastUpdatesConfiguration.CallOpts)
}

// GetFeedIds is a free data retrieval call binding the contract method 0x0c518dce.
//
// Solidity: function getFeedIds() view returns(bytes21[] _feedIds)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCallerSession) GetFeedIds() ([][21]byte, error) {
	return _FastUpdatesConfiguration.Contract.GetFeedIds(&_FastUpdatesConfiguration.CallOpts)
}

// GetFeedIndex is a free data retrieval call binding the contract method 0x0a9cabe7.
//
// Solidity: function getFeedIndex(bytes21 _feedId) view returns(uint256 _index)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCaller) GetFeedIndex(opts *bind.CallOpts, _feedId [21]byte) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesConfiguration.contract.Call(opts, &out, "getFeedIndex", _feedId)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetFeedIndex is a free data retrieval call binding the contract method 0x0a9cabe7.
//
// Solidity: function getFeedIndex(bytes21 _feedId) view returns(uint256 _index)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) GetFeedIndex(_feedId [21]byte) (*big.Int, error) {
	return _FastUpdatesConfiguration.Contract.GetFeedIndex(&_FastUpdatesConfiguration.CallOpts, _feedId)
}

// GetFeedIndex is a free data retrieval call binding the contract method 0x0a9cabe7.
//
// Solidity: function getFeedIndex(bytes21 _feedId) view returns(uint256 _index)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCallerSession) GetFeedIndex(_feedId [21]byte) (*big.Int, error) {
	return _FastUpdatesConfiguration.Contract.GetFeedIndex(&_FastUpdatesConfiguration.CallOpts, _feedId)
}

// GetNumberOfFeeds is a free data retrieval call binding the contract method 0xc906b1b4.
//
// Solidity: function getNumberOfFeeds() view returns(uint256)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCaller) GetNumberOfFeeds(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesConfiguration.contract.Call(opts, &out, "getNumberOfFeeds")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetNumberOfFeeds is a free data retrieval call binding the contract method 0xc906b1b4.
//
// Solidity: function getNumberOfFeeds() view returns(uint256)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) GetNumberOfFeeds() (*big.Int, error) {
	return _FastUpdatesConfiguration.Contract.GetNumberOfFeeds(&_FastUpdatesConfiguration.CallOpts)
}

// GetNumberOfFeeds is a free data retrieval call binding the contract method 0xc906b1b4.
//
// Solidity: function getNumberOfFeeds() view returns(uint256)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCallerSession) GetNumberOfFeeds() (*big.Int, error) {
	return _FastUpdatesConfiguration.Contract.GetNumberOfFeeds(&_FastUpdatesConfiguration.CallOpts)
}

// GetUnusedIndices is a free data retrieval call binding the contract method 0x31864f1f.
//
// Solidity: function getUnusedIndices() view returns(uint256[])
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCaller) GetUnusedIndices(opts *bind.CallOpts) ([]*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesConfiguration.contract.Call(opts, &out, "getUnusedIndices")

	if err != nil {
		return *new([]*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new([]*big.Int)).(*[]*big.Int)

	return out0, err

}

// GetUnusedIndices is a free data retrieval call binding the contract method 0x31864f1f.
//
// Solidity: function getUnusedIndices() view returns(uint256[])
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) GetUnusedIndices() ([]*big.Int, error) {
	return _FastUpdatesConfiguration.Contract.GetUnusedIndices(&_FastUpdatesConfiguration.CallOpts)
}

// GetUnusedIndices is a free data retrieval call binding the contract method 0x31864f1f.
//
// Solidity: function getUnusedIndices() view returns(uint256[])
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCallerSession) GetUnusedIndices() ([]*big.Int, error) {
	return _FastUpdatesConfiguration.Contract.GetUnusedIndices(&_FastUpdatesConfiguration.CallOpts)
}

// Governance is a free data retrieval call binding the contract method 0x5aa6e675.
//
// Solidity: function governance() view returns(address)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCaller) Governance(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdatesConfiguration.contract.Call(opts, &out, "governance")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Governance is a free data retrieval call binding the contract method 0x5aa6e675.
//
// Solidity: function governance() view returns(address)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) Governance() (common.Address, error) {
	return _FastUpdatesConfiguration.Contract.Governance(&_FastUpdatesConfiguration.CallOpts)
}

// Governance is a free data retrieval call binding the contract method 0x5aa6e675.
//
// Solidity: function governance() view returns(address)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCallerSession) Governance() (common.Address, error) {
	return _FastUpdatesConfiguration.Contract.Governance(&_FastUpdatesConfiguration.CallOpts)
}

// GovernanceSettings is a free data retrieval call binding the contract method 0x62354e03.
//
// Solidity: function governanceSettings() view returns(address)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCaller) GovernanceSettings(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdatesConfiguration.contract.Call(opts, &out, "governanceSettings")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GovernanceSettings is a free data retrieval call binding the contract method 0x62354e03.
//
// Solidity: function governanceSettings() view returns(address)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) GovernanceSettings() (common.Address, error) {
	return _FastUpdatesConfiguration.Contract.GovernanceSettings(&_FastUpdatesConfiguration.CallOpts)
}

// GovernanceSettings is a free data retrieval call binding the contract method 0x62354e03.
//
// Solidity: function governanceSettings() view returns(address)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCallerSession) GovernanceSettings() (common.Address, error) {
	return _FastUpdatesConfiguration.Contract.GovernanceSettings(&_FastUpdatesConfiguration.CallOpts)
}

// IsExecutor is a free data retrieval call binding the contract method 0xdebfda30.
//
// Solidity: function isExecutor(address _address) view returns(bool)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCaller) IsExecutor(opts *bind.CallOpts, _address common.Address) (bool, error) {
	var out []interface{}
	err := _FastUpdatesConfiguration.contract.Call(opts, &out, "isExecutor", _address)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsExecutor is a free data retrieval call binding the contract method 0xdebfda30.
//
// Solidity: function isExecutor(address _address) view returns(bool)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) IsExecutor(_address common.Address) (bool, error) {
	return _FastUpdatesConfiguration.Contract.IsExecutor(&_FastUpdatesConfiguration.CallOpts, _address)
}

// IsExecutor is a free data retrieval call binding the contract method 0xdebfda30.
//
// Solidity: function isExecutor(address _address) view returns(bool)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCallerSession) IsExecutor(_address common.Address) (bool, error) {
	return _FastUpdatesConfiguration.Contract.IsExecutor(&_FastUpdatesConfiguration.CallOpts, _address)
}

// ProductionMode is a free data retrieval call binding the contract method 0xe17f212e.
//
// Solidity: function productionMode() view returns(bool)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCaller) ProductionMode(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _FastUpdatesConfiguration.contract.Call(opts, &out, "productionMode")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// ProductionMode is a free data retrieval call binding the contract method 0xe17f212e.
//
// Solidity: function productionMode() view returns(bool)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) ProductionMode() (bool, error) {
	return _FastUpdatesConfiguration.Contract.ProductionMode(&_FastUpdatesConfiguration.CallOpts)
}

// ProductionMode is a free data retrieval call binding the contract method 0xe17f212e.
//
// Solidity: function productionMode() view returns(bool)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCallerSession) ProductionMode() (bool, error) {
	return _FastUpdatesConfiguration.Contract.ProductionMode(&_FastUpdatesConfiguration.CallOpts)
}

// TimelockedCalls is a free data retrieval call binding the contract method 0x74e6310e.
//
// Solidity: function timelockedCalls(bytes4 selector) view returns(uint256 allowedAfterTimestamp, bytes encodedCall)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCaller) TimelockedCalls(opts *bind.CallOpts, selector [4]byte) (struct {
	AllowedAfterTimestamp *big.Int
	EncodedCall           []byte
}, error) {
	var out []interface{}
	err := _FastUpdatesConfiguration.contract.Call(opts, &out, "timelockedCalls", selector)

	outstruct := new(struct {
		AllowedAfterTimestamp *big.Int
		EncodedCall           []byte
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.AllowedAfterTimestamp = *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	outstruct.EncodedCall = *abi.ConvertType(out[1], new([]byte)).(*[]byte)

	return *outstruct, err

}

// TimelockedCalls is a free data retrieval call binding the contract method 0x74e6310e.
//
// Solidity: function timelockedCalls(bytes4 selector) view returns(uint256 allowedAfterTimestamp, bytes encodedCall)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) TimelockedCalls(selector [4]byte) (struct {
	AllowedAfterTimestamp *big.Int
	EncodedCall           []byte
}, error) {
	return _FastUpdatesConfiguration.Contract.TimelockedCalls(&_FastUpdatesConfiguration.CallOpts, selector)
}

// TimelockedCalls is a free data retrieval call binding the contract method 0x74e6310e.
//
// Solidity: function timelockedCalls(bytes4 selector) view returns(uint256 allowedAfterTimestamp, bytes encodedCall)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationCallerSession) TimelockedCalls(selector [4]byte) (struct {
	AllowedAfterTimestamp *big.Int
	EncodedCall           []byte
}, error) {
	return _FastUpdatesConfiguration.Contract.TimelockedCalls(&_FastUpdatesConfiguration.CallOpts, selector)
}

// AddFeeds is a paid mutator transaction binding the contract method 0x247c9cf7.
//
// Solidity: function addFeeds((bytes21,uint32,uint24)[] _feedConfigs) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactor) AddFeeds(opts *bind.TransactOpts, _feedConfigs []IFastUpdatesConfigurationFeedConfiguration) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.contract.Transact(opts, "addFeeds", _feedConfigs)
}

// AddFeeds is a paid mutator transaction binding the contract method 0x247c9cf7.
//
// Solidity: function addFeeds((bytes21,uint32,uint24)[] _feedConfigs) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) AddFeeds(_feedConfigs []IFastUpdatesConfigurationFeedConfiguration) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.AddFeeds(&_FastUpdatesConfiguration.TransactOpts, _feedConfigs)
}

// AddFeeds is a paid mutator transaction binding the contract method 0x247c9cf7.
//
// Solidity: function addFeeds((bytes21,uint32,uint24)[] _feedConfigs) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactorSession) AddFeeds(_feedConfigs []IFastUpdatesConfigurationFeedConfiguration) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.AddFeeds(&_FastUpdatesConfiguration.TransactOpts, _feedConfigs)
}

// CancelGovernanceCall is a paid mutator transaction binding the contract method 0x67fc4029.
//
// Solidity: function cancelGovernanceCall(bytes4 _selector) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactor) CancelGovernanceCall(opts *bind.TransactOpts, _selector [4]byte) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.contract.Transact(opts, "cancelGovernanceCall", _selector)
}

// CancelGovernanceCall is a paid mutator transaction binding the contract method 0x67fc4029.
//
// Solidity: function cancelGovernanceCall(bytes4 _selector) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) CancelGovernanceCall(_selector [4]byte) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.CancelGovernanceCall(&_FastUpdatesConfiguration.TransactOpts, _selector)
}

// CancelGovernanceCall is a paid mutator transaction binding the contract method 0x67fc4029.
//
// Solidity: function cancelGovernanceCall(bytes4 _selector) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactorSession) CancelGovernanceCall(_selector [4]byte) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.CancelGovernanceCall(&_FastUpdatesConfiguration.TransactOpts, _selector)
}

// ExecuteGovernanceCall is a paid mutator transaction binding the contract method 0x5ff27079.
//
// Solidity: function executeGovernanceCall(bytes4 _selector) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactor) ExecuteGovernanceCall(opts *bind.TransactOpts, _selector [4]byte) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.contract.Transact(opts, "executeGovernanceCall", _selector)
}

// ExecuteGovernanceCall is a paid mutator transaction binding the contract method 0x5ff27079.
//
// Solidity: function executeGovernanceCall(bytes4 _selector) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) ExecuteGovernanceCall(_selector [4]byte) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.ExecuteGovernanceCall(&_FastUpdatesConfiguration.TransactOpts, _selector)
}

// ExecuteGovernanceCall is a paid mutator transaction binding the contract method 0x5ff27079.
//
// Solidity: function executeGovernanceCall(bytes4 _selector) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactorSession) ExecuteGovernanceCall(_selector [4]byte) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.ExecuteGovernanceCall(&_FastUpdatesConfiguration.TransactOpts, _selector)
}

// Initialise is a paid mutator transaction binding the contract method 0xef88bf13.
//
// Solidity: function initialise(address _governanceSettings, address _initialGovernance) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactor) Initialise(opts *bind.TransactOpts, _governanceSettings common.Address, _initialGovernance common.Address) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.contract.Transact(opts, "initialise", _governanceSettings, _initialGovernance)
}

// Initialise is a paid mutator transaction binding the contract method 0xef88bf13.
//
// Solidity: function initialise(address _governanceSettings, address _initialGovernance) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) Initialise(_governanceSettings common.Address, _initialGovernance common.Address) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.Initialise(&_FastUpdatesConfiguration.TransactOpts, _governanceSettings, _initialGovernance)
}

// Initialise is a paid mutator transaction binding the contract method 0xef88bf13.
//
// Solidity: function initialise(address _governanceSettings, address _initialGovernance) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactorSession) Initialise(_governanceSettings common.Address, _initialGovernance common.Address) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.Initialise(&_FastUpdatesConfiguration.TransactOpts, _governanceSettings, _initialGovernance)
}

// RemoveFeeds is a paid mutator transaction binding the contract method 0xa59b2c46.
//
// Solidity: function removeFeeds(bytes21[] _feedIds) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactor) RemoveFeeds(opts *bind.TransactOpts, _feedIds [][21]byte) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.contract.Transact(opts, "removeFeeds", _feedIds)
}

// RemoveFeeds is a paid mutator transaction binding the contract method 0xa59b2c46.
//
// Solidity: function removeFeeds(bytes21[] _feedIds) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) RemoveFeeds(_feedIds [][21]byte) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.RemoveFeeds(&_FastUpdatesConfiguration.TransactOpts, _feedIds)
}

// RemoveFeeds is a paid mutator transaction binding the contract method 0xa59b2c46.
//
// Solidity: function removeFeeds(bytes21[] _feedIds) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactorSession) RemoveFeeds(_feedIds [][21]byte) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.RemoveFeeds(&_FastUpdatesConfiguration.TransactOpts, _feedIds)
}

// SwitchToProductionMode is a paid mutator transaction binding the contract method 0xf5a98383.
//
// Solidity: function switchToProductionMode() returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactor) SwitchToProductionMode(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.contract.Transact(opts, "switchToProductionMode")
}

// SwitchToProductionMode is a paid mutator transaction binding the contract method 0xf5a98383.
//
// Solidity: function switchToProductionMode() returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) SwitchToProductionMode() (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.SwitchToProductionMode(&_FastUpdatesConfiguration.TransactOpts)
}

// SwitchToProductionMode is a paid mutator transaction binding the contract method 0xf5a98383.
//
// Solidity: function switchToProductionMode() returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactorSession) SwitchToProductionMode() (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.SwitchToProductionMode(&_FastUpdatesConfiguration.TransactOpts)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactor) UpdateContractAddresses(opts *bind.TransactOpts, _contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.contract.Transact(opts, "updateContractAddresses", _contractNameHashes, _contractAddresses)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) UpdateContractAddresses(_contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.UpdateContractAddresses(&_FastUpdatesConfiguration.TransactOpts, _contractNameHashes, _contractAddresses)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactorSession) UpdateContractAddresses(_contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.UpdateContractAddresses(&_FastUpdatesConfiguration.TransactOpts, _contractNameHashes, _contractAddresses)
}

// UpdateFeeds is a paid mutator transaction binding the contract method 0xa087d184.
//
// Solidity: function updateFeeds((bytes21,uint32,uint24)[] _feedConfigs) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactor) UpdateFeeds(opts *bind.TransactOpts, _feedConfigs []IFastUpdatesConfigurationFeedConfiguration) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.contract.Transact(opts, "updateFeeds", _feedConfigs)
}

// UpdateFeeds is a paid mutator transaction binding the contract method 0xa087d184.
//
// Solidity: function updateFeeds((bytes21,uint32,uint24)[] _feedConfigs) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationSession) UpdateFeeds(_feedConfigs []IFastUpdatesConfigurationFeedConfiguration) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.UpdateFeeds(&_FastUpdatesConfiguration.TransactOpts, _feedConfigs)
}

// UpdateFeeds is a paid mutator transaction binding the contract method 0xa087d184.
//
// Solidity: function updateFeeds((bytes21,uint32,uint24)[] _feedConfigs) returns()
func (_FastUpdatesConfiguration *FastUpdatesConfigurationTransactorSession) UpdateFeeds(_feedConfigs []IFastUpdatesConfigurationFeedConfiguration) (*types.Transaction, error) {
	return _FastUpdatesConfiguration.Contract.UpdateFeeds(&_FastUpdatesConfiguration.TransactOpts, _feedConfigs)
}

// FastUpdatesConfigurationFeedAddedIterator is returned from FilterFeedAdded and is used to iterate over the raw logs and unpacked data for FeedAdded events raised by the FastUpdatesConfiguration contract.
type FastUpdatesConfigurationFeedAddedIterator struct {
	Event *FastUpdatesConfigurationFeedAdded // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *FastUpdatesConfigurationFeedAddedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesConfigurationFeedAdded)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(FastUpdatesConfigurationFeedAdded)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *FastUpdatesConfigurationFeedAddedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesConfigurationFeedAddedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesConfigurationFeedAdded represents a FeedAdded event raised by the FastUpdatesConfiguration contract.
type FastUpdatesConfigurationFeedAdded struct {
	FeedId          [21]byte
	RewardBandValue uint32
	InflationShare  *big.Int
	Index           *big.Int
	Raw             types.Log // Blockchain specific contextual infos
}

// FilterFeedAdded is a free log retrieval operation binding the contract event 0x3ca318c85958cdc1745f9edcd68164b4579efa8050b27b9d634f5e0427e7e33a.
//
// Solidity: event FeedAdded(bytes21 indexed feedId, uint32 rewardBandValue, uint24 inflationShare, uint256 index)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) FilterFeedAdded(opts *bind.FilterOpts, feedId [][21]byte) (*FastUpdatesConfigurationFeedAddedIterator, error) {

	var feedIdRule []interface{}
	for _, feedIdItem := range feedId {
		feedIdRule = append(feedIdRule, feedIdItem)
	}

	logs, sub, err := _FastUpdatesConfiguration.contract.FilterLogs(opts, "FeedAdded", feedIdRule)
	if err != nil {
		return nil, err
	}
	return &FastUpdatesConfigurationFeedAddedIterator{contract: _FastUpdatesConfiguration.contract, event: "FeedAdded", logs: logs, sub: sub}, nil
}

// WatchFeedAdded is a free log subscription operation binding the contract event 0x3ca318c85958cdc1745f9edcd68164b4579efa8050b27b9d634f5e0427e7e33a.
//
// Solidity: event FeedAdded(bytes21 indexed feedId, uint32 rewardBandValue, uint24 inflationShare, uint256 index)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) WatchFeedAdded(opts *bind.WatchOpts, sink chan<- *FastUpdatesConfigurationFeedAdded, feedId [][21]byte) (event.Subscription, error) {

	var feedIdRule []interface{}
	for _, feedIdItem := range feedId {
		feedIdRule = append(feedIdRule, feedIdItem)
	}

	logs, sub, err := _FastUpdatesConfiguration.contract.WatchLogs(opts, "FeedAdded", feedIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesConfigurationFeedAdded)
				if err := _FastUpdatesConfiguration.contract.UnpackLog(event, "FeedAdded", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseFeedAdded is a log parse operation binding the contract event 0x3ca318c85958cdc1745f9edcd68164b4579efa8050b27b9d634f5e0427e7e33a.
//
// Solidity: event FeedAdded(bytes21 indexed feedId, uint32 rewardBandValue, uint24 inflationShare, uint256 index)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) ParseFeedAdded(log types.Log) (*FastUpdatesConfigurationFeedAdded, error) {
	event := new(FastUpdatesConfigurationFeedAdded)
	if err := _FastUpdatesConfiguration.contract.UnpackLog(event, "FeedAdded", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdatesConfigurationFeedRemovedIterator is returned from FilterFeedRemoved and is used to iterate over the raw logs and unpacked data for FeedRemoved events raised by the FastUpdatesConfiguration contract.
type FastUpdatesConfigurationFeedRemovedIterator struct {
	Event *FastUpdatesConfigurationFeedRemoved // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *FastUpdatesConfigurationFeedRemovedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesConfigurationFeedRemoved)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(FastUpdatesConfigurationFeedRemoved)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *FastUpdatesConfigurationFeedRemovedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesConfigurationFeedRemovedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesConfigurationFeedRemoved represents a FeedRemoved event raised by the FastUpdatesConfiguration contract.
type FastUpdatesConfigurationFeedRemoved struct {
	FeedId [21]byte
	Index  *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterFeedRemoved is a free log retrieval operation binding the contract event 0xbb4bc8e9bdadd13a82544df890de25d2c6403cd23a7655410eb2ad4f542425ab.
//
// Solidity: event FeedRemoved(bytes21 indexed feedId, uint256 index)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) FilterFeedRemoved(opts *bind.FilterOpts, feedId [][21]byte) (*FastUpdatesConfigurationFeedRemovedIterator, error) {

	var feedIdRule []interface{}
	for _, feedIdItem := range feedId {
		feedIdRule = append(feedIdRule, feedIdItem)
	}

	logs, sub, err := _FastUpdatesConfiguration.contract.FilterLogs(opts, "FeedRemoved", feedIdRule)
	if err != nil {
		return nil, err
	}
	return &FastUpdatesConfigurationFeedRemovedIterator{contract: _FastUpdatesConfiguration.contract, event: "FeedRemoved", logs: logs, sub: sub}, nil
}

// WatchFeedRemoved is a free log subscription operation binding the contract event 0xbb4bc8e9bdadd13a82544df890de25d2c6403cd23a7655410eb2ad4f542425ab.
//
// Solidity: event FeedRemoved(bytes21 indexed feedId, uint256 index)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) WatchFeedRemoved(opts *bind.WatchOpts, sink chan<- *FastUpdatesConfigurationFeedRemoved, feedId [][21]byte) (event.Subscription, error) {

	var feedIdRule []interface{}
	for _, feedIdItem := range feedId {
		feedIdRule = append(feedIdRule, feedIdItem)
	}

	logs, sub, err := _FastUpdatesConfiguration.contract.WatchLogs(opts, "FeedRemoved", feedIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesConfigurationFeedRemoved)
				if err := _FastUpdatesConfiguration.contract.UnpackLog(event, "FeedRemoved", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseFeedRemoved is a log parse operation binding the contract event 0xbb4bc8e9bdadd13a82544df890de25d2c6403cd23a7655410eb2ad4f542425ab.
//
// Solidity: event FeedRemoved(bytes21 indexed feedId, uint256 index)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) ParseFeedRemoved(log types.Log) (*FastUpdatesConfigurationFeedRemoved, error) {
	event := new(FastUpdatesConfigurationFeedRemoved)
	if err := _FastUpdatesConfiguration.contract.UnpackLog(event, "FeedRemoved", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdatesConfigurationFeedUpdatedIterator is returned from FilterFeedUpdated and is used to iterate over the raw logs and unpacked data for FeedUpdated events raised by the FastUpdatesConfiguration contract.
type FastUpdatesConfigurationFeedUpdatedIterator struct {
	Event *FastUpdatesConfigurationFeedUpdated // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *FastUpdatesConfigurationFeedUpdatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesConfigurationFeedUpdated)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(FastUpdatesConfigurationFeedUpdated)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *FastUpdatesConfigurationFeedUpdatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesConfigurationFeedUpdatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesConfigurationFeedUpdated represents a FeedUpdated event raised by the FastUpdatesConfiguration contract.
type FastUpdatesConfigurationFeedUpdated struct {
	FeedId          [21]byte
	RewardBandValue uint32
	InflationShare  *big.Int
	Index           *big.Int
	Raw             types.Log // Blockchain specific contextual infos
}

// FilterFeedUpdated is a free log retrieval operation binding the contract event 0x317c7e03c79b6fcd22d6f17813b4e8e8a4a14104fdfb79431c6c73b550c7ca9d.
//
// Solidity: event FeedUpdated(bytes21 indexed feedId, uint32 rewardBandValue, uint24 inflationShare, uint256 index)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) FilterFeedUpdated(opts *bind.FilterOpts, feedId [][21]byte) (*FastUpdatesConfigurationFeedUpdatedIterator, error) {

	var feedIdRule []interface{}
	for _, feedIdItem := range feedId {
		feedIdRule = append(feedIdRule, feedIdItem)
	}

	logs, sub, err := _FastUpdatesConfiguration.contract.FilterLogs(opts, "FeedUpdated", feedIdRule)
	if err != nil {
		return nil, err
	}
	return &FastUpdatesConfigurationFeedUpdatedIterator{contract: _FastUpdatesConfiguration.contract, event: "FeedUpdated", logs: logs, sub: sub}, nil
}

// WatchFeedUpdated is a free log subscription operation binding the contract event 0x317c7e03c79b6fcd22d6f17813b4e8e8a4a14104fdfb79431c6c73b550c7ca9d.
//
// Solidity: event FeedUpdated(bytes21 indexed feedId, uint32 rewardBandValue, uint24 inflationShare, uint256 index)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) WatchFeedUpdated(opts *bind.WatchOpts, sink chan<- *FastUpdatesConfigurationFeedUpdated, feedId [][21]byte) (event.Subscription, error) {

	var feedIdRule []interface{}
	for _, feedIdItem := range feedId {
		feedIdRule = append(feedIdRule, feedIdItem)
	}

	logs, sub, err := _FastUpdatesConfiguration.contract.WatchLogs(opts, "FeedUpdated", feedIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesConfigurationFeedUpdated)
				if err := _FastUpdatesConfiguration.contract.UnpackLog(event, "FeedUpdated", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseFeedUpdated is a log parse operation binding the contract event 0x317c7e03c79b6fcd22d6f17813b4e8e8a4a14104fdfb79431c6c73b550c7ca9d.
//
// Solidity: event FeedUpdated(bytes21 indexed feedId, uint32 rewardBandValue, uint24 inflationShare, uint256 index)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) ParseFeedUpdated(log types.Log) (*FastUpdatesConfigurationFeedUpdated, error) {
	event := new(FastUpdatesConfigurationFeedUpdated)
	if err := _FastUpdatesConfiguration.contract.UnpackLog(event, "FeedUpdated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdatesConfigurationGovernanceCallTimelockedIterator is returned from FilterGovernanceCallTimelocked and is used to iterate over the raw logs and unpacked data for GovernanceCallTimelocked events raised by the FastUpdatesConfiguration contract.
type FastUpdatesConfigurationGovernanceCallTimelockedIterator struct {
	Event *FastUpdatesConfigurationGovernanceCallTimelocked // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *FastUpdatesConfigurationGovernanceCallTimelockedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesConfigurationGovernanceCallTimelocked)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(FastUpdatesConfigurationGovernanceCallTimelocked)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *FastUpdatesConfigurationGovernanceCallTimelockedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesConfigurationGovernanceCallTimelockedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesConfigurationGovernanceCallTimelocked represents a GovernanceCallTimelocked event raised by the FastUpdatesConfiguration contract.
type FastUpdatesConfigurationGovernanceCallTimelocked struct {
	Selector              [4]byte
	AllowedAfterTimestamp *big.Int
	EncodedCall           []byte
	Raw                   types.Log // Blockchain specific contextual infos
}

// FilterGovernanceCallTimelocked is a free log retrieval operation binding the contract event 0xed948300a3694aa01d4a6b258bfd664350193d770c0b51f8387277f6d83ea3b6.
//
// Solidity: event GovernanceCallTimelocked(bytes4 selector, uint256 allowedAfterTimestamp, bytes encodedCall)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) FilterGovernanceCallTimelocked(opts *bind.FilterOpts) (*FastUpdatesConfigurationGovernanceCallTimelockedIterator, error) {

	logs, sub, err := _FastUpdatesConfiguration.contract.FilterLogs(opts, "GovernanceCallTimelocked")
	if err != nil {
		return nil, err
	}
	return &FastUpdatesConfigurationGovernanceCallTimelockedIterator{contract: _FastUpdatesConfiguration.contract, event: "GovernanceCallTimelocked", logs: logs, sub: sub}, nil
}

// WatchGovernanceCallTimelocked is a free log subscription operation binding the contract event 0xed948300a3694aa01d4a6b258bfd664350193d770c0b51f8387277f6d83ea3b6.
//
// Solidity: event GovernanceCallTimelocked(bytes4 selector, uint256 allowedAfterTimestamp, bytes encodedCall)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) WatchGovernanceCallTimelocked(opts *bind.WatchOpts, sink chan<- *FastUpdatesConfigurationGovernanceCallTimelocked) (event.Subscription, error) {

	logs, sub, err := _FastUpdatesConfiguration.contract.WatchLogs(opts, "GovernanceCallTimelocked")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesConfigurationGovernanceCallTimelocked)
				if err := _FastUpdatesConfiguration.contract.UnpackLog(event, "GovernanceCallTimelocked", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseGovernanceCallTimelocked is a log parse operation binding the contract event 0xed948300a3694aa01d4a6b258bfd664350193d770c0b51f8387277f6d83ea3b6.
//
// Solidity: event GovernanceCallTimelocked(bytes4 selector, uint256 allowedAfterTimestamp, bytes encodedCall)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) ParseGovernanceCallTimelocked(log types.Log) (*FastUpdatesConfigurationGovernanceCallTimelocked, error) {
	event := new(FastUpdatesConfigurationGovernanceCallTimelocked)
	if err := _FastUpdatesConfiguration.contract.UnpackLog(event, "GovernanceCallTimelocked", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdatesConfigurationGovernanceInitialisedIterator is returned from FilterGovernanceInitialised and is used to iterate over the raw logs and unpacked data for GovernanceInitialised events raised by the FastUpdatesConfiguration contract.
type FastUpdatesConfigurationGovernanceInitialisedIterator struct {
	Event *FastUpdatesConfigurationGovernanceInitialised // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *FastUpdatesConfigurationGovernanceInitialisedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesConfigurationGovernanceInitialised)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(FastUpdatesConfigurationGovernanceInitialised)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *FastUpdatesConfigurationGovernanceInitialisedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesConfigurationGovernanceInitialisedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesConfigurationGovernanceInitialised represents a GovernanceInitialised event raised by the FastUpdatesConfiguration contract.
type FastUpdatesConfigurationGovernanceInitialised struct {
	InitialGovernance common.Address
	Raw               types.Log // Blockchain specific contextual infos
}

// FilterGovernanceInitialised is a free log retrieval operation binding the contract event 0x9789733827840833afc031fb2ef9ab6894271f77bad2085687cf4ae5c7bee4db.
//
// Solidity: event GovernanceInitialised(address initialGovernance)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) FilterGovernanceInitialised(opts *bind.FilterOpts) (*FastUpdatesConfigurationGovernanceInitialisedIterator, error) {

	logs, sub, err := _FastUpdatesConfiguration.contract.FilterLogs(opts, "GovernanceInitialised")
	if err != nil {
		return nil, err
	}
	return &FastUpdatesConfigurationGovernanceInitialisedIterator{contract: _FastUpdatesConfiguration.contract, event: "GovernanceInitialised", logs: logs, sub: sub}, nil
}

// WatchGovernanceInitialised is a free log subscription operation binding the contract event 0x9789733827840833afc031fb2ef9ab6894271f77bad2085687cf4ae5c7bee4db.
//
// Solidity: event GovernanceInitialised(address initialGovernance)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) WatchGovernanceInitialised(opts *bind.WatchOpts, sink chan<- *FastUpdatesConfigurationGovernanceInitialised) (event.Subscription, error) {

	logs, sub, err := _FastUpdatesConfiguration.contract.WatchLogs(opts, "GovernanceInitialised")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesConfigurationGovernanceInitialised)
				if err := _FastUpdatesConfiguration.contract.UnpackLog(event, "GovernanceInitialised", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseGovernanceInitialised is a log parse operation binding the contract event 0x9789733827840833afc031fb2ef9ab6894271f77bad2085687cf4ae5c7bee4db.
//
// Solidity: event GovernanceInitialised(address initialGovernance)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) ParseGovernanceInitialised(log types.Log) (*FastUpdatesConfigurationGovernanceInitialised, error) {
	event := new(FastUpdatesConfigurationGovernanceInitialised)
	if err := _FastUpdatesConfiguration.contract.UnpackLog(event, "GovernanceInitialised", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdatesConfigurationGovernedProductionModeEnteredIterator is returned from FilterGovernedProductionModeEntered and is used to iterate over the raw logs and unpacked data for GovernedProductionModeEntered events raised by the FastUpdatesConfiguration contract.
type FastUpdatesConfigurationGovernedProductionModeEnteredIterator struct {
	Event *FastUpdatesConfigurationGovernedProductionModeEntered // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *FastUpdatesConfigurationGovernedProductionModeEnteredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesConfigurationGovernedProductionModeEntered)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(FastUpdatesConfigurationGovernedProductionModeEntered)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *FastUpdatesConfigurationGovernedProductionModeEnteredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesConfigurationGovernedProductionModeEnteredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesConfigurationGovernedProductionModeEntered represents a GovernedProductionModeEntered event raised by the FastUpdatesConfiguration contract.
type FastUpdatesConfigurationGovernedProductionModeEntered struct {
	GovernanceSettings common.Address
	Raw                types.Log // Blockchain specific contextual infos
}

// FilterGovernedProductionModeEntered is a free log retrieval operation binding the contract event 0x83af113638b5422f9e977cebc0aaf0eaf2188eb9a8baae7f9d46c42b33a1560c.
//
// Solidity: event GovernedProductionModeEntered(address governanceSettings)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) FilterGovernedProductionModeEntered(opts *bind.FilterOpts) (*FastUpdatesConfigurationGovernedProductionModeEnteredIterator, error) {

	logs, sub, err := _FastUpdatesConfiguration.contract.FilterLogs(opts, "GovernedProductionModeEntered")
	if err != nil {
		return nil, err
	}
	return &FastUpdatesConfigurationGovernedProductionModeEnteredIterator{contract: _FastUpdatesConfiguration.contract, event: "GovernedProductionModeEntered", logs: logs, sub: sub}, nil
}

// WatchGovernedProductionModeEntered is a free log subscription operation binding the contract event 0x83af113638b5422f9e977cebc0aaf0eaf2188eb9a8baae7f9d46c42b33a1560c.
//
// Solidity: event GovernedProductionModeEntered(address governanceSettings)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) WatchGovernedProductionModeEntered(opts *bind.WatchOpts, sink chan<- *FastUpdatesConfigurationGovernedProductionModeEntered) (event.Subscription, error) {

	logs, sub, err := _FastUpdatesConfiguration.contract.WatchLogs(opts, "GovernedProductionModeEntered")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesConfigurationGovernedProductionModeEntered)
				if err := _FastUpdatesConfiguration.contract.UnpackLog(event, "GovernedProductionModeEntered", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseGovernedProductionModeEntered is a log parse operation binding the contract event 0x83af113638b5422f9e977cebc0aaf0eaf2188eb9a8baae7f9d46c42b33a1560c.
//
// Solidity: event GovernedProductionModeEntered(address governanceSettings)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) ParseGovernedProductionModeEntered(log types.Log) (*FastUpdatesConfigurationGovernedProductionModeEntered, error) {
	event := new(FastUpdatesConfigurationGovernedProductionModeEntered)
	if err := _FastUpdatesConfiguration.contract.UnpackLog(event, "GovernedProductionModeEntered", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdatesConfigurationTimelockedGovernanceCallCanceledIterator is returned from FilterTimelockedGovernanceCallCanceled and is used to iterate over the raw logs and unpacked data for TimelockedGovernanceCallCanceled events raised by the FastUpdatesConfiguration contract.
type FastUpdatesConfigurationTimelockedGovernanceCallCanceledIterator struct {
	Event *FastUpdatesConfigurationTimelockedGovernanceCallCanceled // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *FastUpdatesConfigurationTimelockedGovernanceCallCanceledIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesConfigurationTimelockedGovernanceCallCanceled)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(FastUpdatesConfigurationTimelockedGovernanceCallCanceled)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *FastUpdatesConfigurationTimelockedGovernanceCallCanceledIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesConfigurationTimelockedGovernanceCallCanceledIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesConfigurationTimelockedGovernanceCallCanceled represents a TimelockedGovernanceCallCanceled event raised by the FastUpdatesConfiguration contract.
type FastUpdatesConfigurationTimelockedGovernanceCallCanceled struct {
	Selector  [4]byte
	Timestamp *big.Int
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterTimelockedGovernanceCallCanceled is a free log retrieval operation binding the contract event 0x7735b2391c38a81419c513e30ca578db7158eadd7101511b23e221c654d19cf8.
//
// Solidity: event TimelockedGovernanceCallCanceled(bytes4 selector, uint256 timestamp)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) FilterTimelockedGovernanceCallCanceled(opts *bind.FilterOpts) (*FastUpdatesConfigurationTimelockedGovernanceCallCanceledIterator, error) {

	logs, sub, err := _FastUpdatesConfiguration.contract.FilterLogs(opts, "TimelockedGovernanceCallCanceled")
	if err != nil {
		return nil, err
	}
	return &FastUpdatesConfigurationTimelockedGovernanceCallCanceledIterator{contract: _FastUpdatesConfiguration.contract, event: "TimelockedGovernanceCallCanceled", logs: logs, sub: sub}, nil
}

// WatchTimelockedGovernanceCallCanceled is a free log subscription operation binding the contract event 0x7735b2391c38a81419c513e30ca578db7158eadd7101511b23e221c654d19cf8.
//
// Solidity: event TimelockedGovernanceCallCanceled(bytes4 selector, uint256 timestamp)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) WatchTimelockedGovernanceCallCanceled(opts *bind.WatchOpts, sink chan<- *FastUpdatesConfigurationTimelockedGovernanceCallCanceled) (event.Subscription, error) {

	logs, sub, err := _FastUpdatesConfiguration.contract.WatchLogs(opts, "TimelockedGovernanceCallCanceled")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesConfigurationTimelockedGovernanceCallCanceled)
				if err := _FastUpdatesConfiguration.contract.UnpackLog(event, "TimelockedGovernanceCallCanceled", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTimelockedGovernanceCallCanceled is a log parse operation binding the contract event 0x7735b2391c38a81419c513e30ca578db7158eadd7101511b23e221c654d19cf8.
//
// Solidity: event TimelockedGovernanceCallCanceled(bytes4 selector, uint256 timestamp)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) ParseTimelockedGovernanceCallCanceled(log types.Log) (*FastUpdatesConfigurationTimelockedGovernanceCallCanceled, error) {
	event := new(FastUpdatesConfigurationTimelockedGovernanceCallCanceled)
	if err := _FastUpdatesConfiguration.contract.UnpackLog(event, "TimelockedGovernanceCallCanceled", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdatesConfigurationTimelockedGovernanceCallExecutedIterator is returned from FilterTimelockedGovernanceCallExecuted and is used to iterate over the raw logs and unpacked data for TimelockedGovernanceCallExecuted events raised by the FastUpdatesConfiguration contract.
type FastUpdatesConfigurationTimelockedGovernanceCallExecutedIterator struct {
	Event *FastUpdatesConfigurationTimelockedGovernanceCallExecuted // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *FastUpdatesConfigurationTimelockedGovernanceCallExecutedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesConfigurationTimelockedGovernanceCallExecuted)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(FastUpdatesConfigurationTimelockedGovernanceCallExecuted)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *FastUpdatesConfigurationTimelockedGovernanceCallExecutedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesConfigurationTimelockedGovernanceCallExecutedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesConfigurationTimelockedGovernanceCallExecuted represents a TimelockedGovernanceCallExecuted event raised by the FastUpdatesConfiguration contract.
type FastUpdatesConfigurationTimelockedGovernanceCallExecuted struct {
	Selector  [4]byte
	Timestamp *big.Int
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterTimelockedGovernanceCallExecuted is a free log retrieval operation binding the contract event 0xa7326b57fc9cfe267aaea5e7f0b01757154d265620a0585819416ee9ddd2c438.
//
// Solidity: event TimelockedGovernanceCallExecuted(bytes4 selector, uint256 timestamp)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) FilterTimelockedGovernanceCallExecuted(opts *bind.FilterOpts) (*FastUpdatesConfigurationTimelockedGovernanceCallExecutedIterator, error) {

	logs, sub, err := _FastUpdatesConfiguration.contract.FilterLogs(opts, "TimelockedGovernanceCallExecuted")
	if err != nil {
		return nil, err
	}
	return &FastUpdatesConfigurationTimelockedGovernanceCallExecutedIterator{contract: _FastUpdatesConfiguration.contract, event: "TimelockedGovernanceCallExecuted", logs: logs, sub: sub}, nil
}

// WatchTimelockedGovernanceCallExecuted is a free log subscription operation binding the contract event 0xa7326b57fc9cfe267aaea5e7f0b01757154d265620a0585819416ee9ddd2c438.
//
// Solidity: event TimelockedGovernanceCallExecuted(bytes4 selector, uint256 timestamp)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) WatchTimelockedGovernanceCallExecuted(opts *bind.WatchOpts, sink chan<- *FastUpdatesConfigurationTimelockedGovernanceCallExecuted) (event.Subscription, error) {

	logs, sub, err := _FastUpdatesConfiguration.contract.WatchLogs(opts, "TimelockedGovernanceCallExecuted")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesConfigurationTimelockedGovernanceCallExecuted)
				if err := _FastUpdatesConfiguration.contract.UnpackLog(event, "TimelockedGovernanceCallExecuted", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTimelockedGovernanceCallExecuted is a log parse operation binding the contract event 0xa7326b57fc9cfe267aaea5e7f0b01757154d265620a0585819416ee9ddd2c438.
//
// Solidity: event TimelockedGovernanceCallExecuted(bytes4 selector, uint256 timestamp)
func (_FastUpdatesConfiguration *FastUpdatesConfigurationFilterer) ParseTimelockedGovernanceCallExecuted(log types.Log) (*FastUpdatesConfigurationTimelockedGovernanceCallExecuted, error) {
	event := new(FastUpdatesConfigurationTimelockedGovernanceCallExecuted)
	if err := _FastUpdatesConfiguration.contract.UnpackLog(event, "TimelockedGovernanceCallExecuted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
