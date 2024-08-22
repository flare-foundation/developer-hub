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

// FlareContractRegistryMetaData contains all meta data concerning the FlareContractRegistry contract.
var FlareContractRegistryMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_addressUpdater\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[],\"name\":\"getAddressUpdater\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"_addressUpdater\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getAllContracts\",\"outputs\":[{\"internalType\":\"string[]\",\"name\":\"\",\"type\":\"string[]\"},{\"internalType\":\"address[]\",\"name\":\"\",\"type\":\"address[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"_nameHash\",\"type\":\"bytes32\"}],\"name\":\"getContractAddressByHash\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"_name\",\"type\":\"string\"}],\"name\":\"getContractAddressByName\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"_nameHashes\",\"type\":\"bytes32[]\"}],\"name\":\"getContractAddressesByHash\",\"outputs\":[{\"internalType\":\"address[]\",\"name\":\"\",\"type\":\"address[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string[]\",\"name\":\"_names\",\"type\":\"string[]\"}],\"name\":\"getContractAddressesByName\",\"outputs\":[{\"internalType\":\"address[]\",\"name\":\"\",\"type\":\"address[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"_contractNameHashes\",\"type\":\"bytes32[]\"},{\"internalType\":\"address[]\",\"name\":\"_contractAddresses\",\"type\":\"address[]\"}],\"name\":\"updateContractAddresses\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
}

// FlareContractRegistryABI is the input ABI used to generate the binding from.
// Deprecated: Use FlareContractRegistryMetaData.ABI instead.
var FlareContractRegistryABI = FlareContractRegistryMetaData.ABI

// FlareContractRegistry is an auto generated Go binding around an Ethereum contract.
type FlareContractRegistry struct {
	FlareContractRegistryCaller     // Read-only binding to the contract
	FlareContractRegistryTransactor // Write-only binding to the contract
	FlareContractRegistryFilterer   // Log filterer for contract events
}

// FlareContractRegistryCaller is an auto generated read-only Go binding around an Ethereum contract.
type FlareContractRegistryCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FlareContractRegistryTransactor is an auto generated write-only Go binding around an Ethereum contract.
type FlareContractRegistryTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FlareContractRegistryFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type FlareContractRegistryFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FlareContractRegistrySession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type FlareContractRegistrySession struct {
	Contract     *FlareContractRegistry // Generic contract binding to set the session for
	CallOpts     bind.CallOpts          // Call options to use throughout this session
	TransactOpts bind.TransactOpts      // Transaction auth options to use throughout this session
}

// FlareContractRegistryCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type FlareContractRegistryCallerSession struct {
	Contract *FlareContractRegistryCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts                // Call options to use throughout this session
}

// FlareContractRegistryTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type FlareContractRegistryTransactorSession struct {
	Contract     *FlareContractRegistryTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts                // Transaction auth options to use throughout this session
}

// FlareContractRegistryRaw is an auto generated low-level Go binding around an Ethereum contract.
type FlareContractRegistryRaw struct {
	Contract *FlareContractRegistry // Generic contract binding to access the raw methods on
}

// FlareContractRegistryCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type FlareContractRegistryCallerRaw struct {
	Contract *FlareContractRegistryCaller // Generic read-only contract binding to access the raw methods on
}

// FlareContractRegistryTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type FlareContractRegistryTransactorRaw struct {
	Contract *FlareContractRegistryTransactor // Generic write-only contract binding to access the raw methods on
}

// NewFlareContractRegistry creates a new instance of FlareContractRegistry, bound to a specific deployed contract.
func NewFlareContractRegistry(address common.Address, backend bind.ContractBackend) (*FlareContractRegistry, error) {
	contract, err := bindFlareContractRegistry(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &FlareContractRegistry{FlareContractRegistryCaller: FlareContractRegistryCaller{contract: contract}, FlareContractRegistryTransactor: FlareContractRegistryTransactor{contract: contract}, FlareContractRegistryFilterer: FlareContractRegistryFilterer{contract: contract}}, nil
}

// NewFlareContractRegistryCaller creates a new read-only instance of FlareContractRegistry, bound to a specific deployed contract.
func NewFlareContractRegistryCaller(address common.Address, caller bind.ContractCaller) (*FlareContractRegistryCaller, error) {
	contract, err := bindFlareContractRegistry(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &FlareContractRegistryCaller{contract: contract}, nil
}

// NewFlareContractRegistryTransactor creates a new write-only instance of FlareContractRegistry, bound to a specific deployed contract.
func NewFlareContractRegistryTransactor(address common.Address, transactor bind.ContractTransactor) (*FlareContractRegistryTransactor, error) {
	contract, err := bindFlareContractRegistry(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &FlareContractRegistryTransactor{contract: contract}, nil
}

// NewFlareContractRegistryFilterer creates a new log filterer instance of FlareContractRegistry, bound to a specific deployed contract.
func NewFlareContractRegistryFilterer(address common.Address, filterer bind.ContractFilterer) (*FlareContractRegistryFilterer, error) {
	contract, err := bindFlareContractRegistry(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &FlareContractRegistryFilterer{contract: contract}, nil
}

// bindFlareContractRegistry binds a generic wrapper to an already deployed contract.
func bindFlareContractRegistry(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := FlareContractRegistryMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FlareContractRegistry *FlareContractRegistryRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FlareContractRegistry.Contract.FlareContractRegistryCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FlareContractRegistry *FlareContractRegistryRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FlareContractRegistry.Contract.FlareContractRegistryTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FlareContractRegistry *FlareContractRegistryRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FlareContractRegistry.Contract.FlareContractRegistryTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FlareContractRegistry *FlareContractRegistryCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FlareContractRegistry.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FlareContractRegistry *FlareContractRegistryTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FlareContractRegistry.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FlareContractRegistry *FlareContractRegistryTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FlareContractRegistry.Contract.contract.Transact(opts, method, params...)
}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_FlareContractRegistry *FlareContractRegistryCaller) GetAddressUpdater(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FlareContractRegistry.contract.Call(opts, &out, "getAddressUpdater")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_FlareContractRegistry *FlareContractRegistrySession) GetAddressUpdater() (common.Address, error) {
	return _FlareContractRegistry.Contract.GetAddressUpdater(&_FlareContractRegistry.CallOpts)
}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_FlareContractRegistry *FlareContractRegistryCallerSession) GetAddressUpdater() (common.Address, error) {
	return _FlareContractRegistry.Contract.GetAddressUpdater(&_FlareContractRegistry.CallOpts)
}

// GetAllContracts is a free data retrieval call binding the contract method 0x18d3ce96.
//
// Solidity: function getAllContracts() view returns(string[], address[])
func (_FlareContractRegistry *FlareContractRegistryCaller) GetAllContracts(opts *bind.CallOpts) ([]string, []common.Address, error) {
	var out []interface{}
	err := _FlareContractRegistry.contract.Call(opts, &out, "getAllContracts")

	if err != nil {
		return *new([]string), *new([]common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new([]string)).(*[]string)
	out1 := *abi.ConvertType(out[1], new([]common.Address)).(*[]common.Address)

	return out0, out1, err

}

// GetAllContracts is a free data retrieval call binding the contract method 0x18d3ce96.
//
// Solidity: function getAllContracts() view returns(string[], address[])
func (_FlareContractRegistry *FlareContractRegistrySession) GetAllContracts() ([]string, []common.Address, error) {
	return _FlareContractRegistry.Contract.GetAllContracts(&_FlareContractRegistry.CallOpts)
}

// GetAllContracts is a free data retrieval call binding the contract method 0x18d3ce96.
//
// Solidity: function getAllContracts() view returns(string[], address[])
func (_FlareContractRegistry *FlareContractRegistryCallerSession) GetAllContracts() ([]string, []common.Address, error) {
	return _FlareContractRegistry.Contract.GetAllContracts(&_FlareContractRegistry.CallOpts)
}

// GetContractAddressByHash is a free data retrieval call binding the contract method 0x159354a2.
//
// Solidity: function getContractAddressByHash(bytes32 _nameHash) view returns(address)
func (_FlareContractRegistry *FlareContractRegistryCaller) GetContractAddressByHash(opts *bind.CallOpts, _nameHash [32]byte) (common.Address, error) {
	var out []interface{}
	err := _FlareContractRegistry.contract.Call(opts, &out, "getContractAddressByHash", _nameHash)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetContractAddressByHash is a free data retrieval call binding the contract method 0x159354a2.
//
// Solidity: function getContractAddressByHash(bytes32 _nameHash) view returns(address)
func (_FlareContractRegistry *FlareContractRegistrySession) GetContractAddressByHash(_nameHash [32]byte) (common.Address, error) {
	return _FlareContractRegistry.Contract.GetContractAddressByHash(&_FlareContractRegistry.CallOpts, _nameHash)
}

// GetContractAddressByHash is a free data retrieval call binding the contract method 0x159354a2.
//
// Solidity: function getContractAddressByHash(bytes32 _nameHash) view returns(address)
func (_FlareContractRegistry *FlareContractRegistryCallerSession) GetContractAddressByHash(_nameHash [32]byte) (common.Address, error) {
	return _FlareContractRegistry.Contract.GetContractAddressByHash(&_FlareContractRegistry.CallOpts, _nameHash)
}

// GetContractAddressByName is a free data retrieval call binding the contract method 0x82760fca.
//
// Solidity: function getContractAddressByName(string _name) view returns(address)
func (_FlareContractRegistry *FlareContractRegistryCaller) GetContractAddressByName(opts *bind.CallOpts, _name string) (common.Address, error) {
	var out []interface{}
	err := _FlareContractRegistry.contract.Call(opts, &out, "getContractAddressByName", _name)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetContractAddressByName is a free data retrieval call binding the contract method 0x82760fca.
//
// Solidity: function getContractAddressByName(string _name) view returns(address)
func (_FlareContractRegistry *FlareContractRegistrySession) GetContractAddressByName(_name string) (common.Address, error) {
	return _FlareContractRegistry.Contract.GetContractAddressByName(&_FlareContractRegistry.CallOpts, _name)
}

// GetContractAddressByName is a free data retrieval call binding the contract method 0x82760fca.
//
// Solidity: function getContractAddressByName(string _name) view returns(address)
func (_FlareContractRegistry *FlareContractRegistryCallerSession) GetContractAddressByName(_name string) (common.Address, error) {
	return _FlareContractRegistry.Contract.GetContractAddressByName(&_FlareContractRegistry.CallOpts, _name)
}

// GetContractAddressesByHash is a free data retrieval call binding the contract method 0x5e11e2d1.
//
// Solidity: function getContractAddressesByHash(bytes32[] _nameHashes) view returns(address[])
func (_FlareContractRegistry *FlareContractRegistryCaller) GetContractAddressesByHash(opts *bind.CallOpts, _nameHashes [][32]byte) ([]common.Address, error) {
	var out []interface{}
	err := _FlareContractRegistry.contract.Call(opts, &out, "getContractAddressesByHash", _nameHashes)

	if err != nil {
		return *new([]common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new([]common.Address)).(*[]common.Address)

	return out0, err

}

// GetContractAddressesByHash is a free data retrieval call binding the contract method 0x5e11e2d1.
//
// Solidity: function getContractAddressesByHash(bytes32[] _nameHashes) view returns(address[])
func (_FlareContractRegistry *FlareContractRegistrySession) GetContractAddressesByHash(_nameHashes [][32]byte) ([]common.Address, error) {
	return _FlareContractRegistry.Contract.GetContractAddressesByHash(&_FlareContractRegistry.CallOpts, _nameHashes)
}

// GetContractAddressesByHash is a free data retrieval call binding the contract method 0x5e11e2d1.
//
// Solidity: function getContractAddressesByHash(bytes32[] _nameHashes) view returns(address[])
func (_FlareContractRegistry *FlareContractRegistryCallerSession) GetContractAddressesByHash(_nameHashes [][32]byte) ([]common.Address, error) {
	return _FlareContractRegistry.Contract.GetContractAddressesByHash(&_FlareContractRegistry.CallOpts, _nameHashes)
}

// GetContractAddressesByName is a free data retrieval call binding the contract method 0x76d2b1af.
//
// Solidity: function getContractAddressesByName(string[] _names) view returns(address[])
func (_FlareContractRegistry *FlareContractRegistryCaller) GetContractAddressesByName(opts *bind.CallOpts, _names []string) ([]common.Address, error) {
	var out []interface{}
	err := _FlareContractRegistry.contract.Call(opts, &out, "getContractAddressesByName", _names)

	if err != nil {
		return *new([]common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new([]common.Address)).(*[]common.Address)

	return out0, err

}

// GetContractAddressesByName is a free data retrieval call binding the contract method 0x76d2b1af.
//
// Solidity: function getContractAddressesByName(string[] _names) view returns(address[])
func (_FlareContractRegistry *FlareContractRegistrySession) GetContractAddressesByName(_names []string) ([]common.Address, error) {
	return _FlareContractRegistry.Contract.GetContractAddressesByName(&_FlareContractRegistry.CallOpts, _names)
}

// GetContractAddressesByName is a free data retrieval call binding the contract method 0x76d2b1af.
//
// Solidity: function getContractAddressesByName(string[] _names) view returns(address[])
func (_FlareContractRegistry *FlareContractRegistryCallerSession) GetContractAddressesByName(_names []string) ([]common.Address, error) {
	return _FlareContractRegistry.Contract.GetContractAddressesByName(&_FlareContractRegistry.CallOpts, _names)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_FlareContractRegistry *FlareContractRegistryTransactor) UpdateContractAddresses(opts *bind.TransactOpts, _contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _FlareContractRegistry.contract.Transact(opts, "updateContractAddresses", _contractNameHashes, _contractAddresses)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_FlareContractRegistry *FlareContractRegistrySession) UpdateContractAddresses(_contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _FlareContractRegistry.Contract.UpdateContractAddresses(&_FlareContractRegistry.TransactOpts, _contractNameHashes, _contractAddresses)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_FlareContractRegistry *FlareContractRegistryTransactorSession) UpdateContractAddresses(_contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _FlareContractRegistry.Contract.UpdateContractAddresses(&_FlareContractRegistry.TransactOpts, _contractNameHashes, _contractAddresses)
}
