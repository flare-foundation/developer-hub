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

// Bn256G1Point is an auto generated low-level Go binding around an user-defined struct.
type Bn256G1Point struct {
	X *big.Int
	Y *big.Int
}

// IFastUpdaterFastUpdates is an auto generated low-level Go binding around an user-defined struct.
type IFastUpdaterFastUpdates struct {
	SortitionBlock      *big.Int
	SortitionCredential SortitionCredential
	Deltas              []byte
	Signature           IFastUpdaterSignature
}

// IFastUpdaterSignature is an auto generated low-level Go binding around an user-defined struct.
type IFastUpdaterSignature struct {
	V uint8
	R [32]byte
	S [32]byte
}

// SortitionCredential is an auto generated low-level Go binding around an user-defined struct.
type SortitionCredential struct {
	Replicate *big.Int
	Gamma     Bn256G1Point
	C         *big.Int
	S         *big.Int
}

// FastUpdaterMetaData contains all meta data concerning the FastUpdater contract.
var FastUpdaterMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"contractIGovernanceSettings\",\"name\":\"_governanceSettings\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_initialGovernance\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_addressUpdater\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_flareDaemon\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"_firstVotingRoundStartTs\",\"type\":\"uint32\"},{\"internalType\":\"uint8\",\"name\":\"_votingEpochDurationSeconds\",\"type\":\"uint8\"},{\"internalType\":\"uint8\",\"name\":\"_submissionWindow\",\"type\":\"uint8\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[],\"name\":\"ECDSAInvalidSignature\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"length\",\"type\":\"uint256\"}],\"name\":\"ECDSAInvalidSignatureLength\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"s\",\"type\":\"bytes32\"}],\"name\":\"ECDSAInvalidSignatureS\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"index\",\"type\":\"uint256\"}],\"name\":\"FastUpdateFeedRemoved\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"votingRoundId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"index\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"bytes21\",\"name\":\"id\",\"type\":\"bytes21\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"int8\",\"name\":\"decimals\",\"type\":\"int8\"}],\"name\":\"FastUpdateFeedReset\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"votingEpochId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256[]\",\"name\":\"feeds\",\"type\":\"uint256[]\"},{\"indexed\":false,\"internalType\":\"int8[]\",\"name\":\"decimals\",\"type\":\"int8[]\"}],\"name\":\"FastUpdateFeeds\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint32\",\"name\":\"votingRoundId\",\"type\":\"uint32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"signingPolicyAddress\",\"type\":\"address\"}],\"name\":\"FastUpdateFeedsSubmitted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes4\",\"name\":\"selector\",\"type\":\"bytes4\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"allowedAfterTimestamp\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"encodedCall\",\"type\":\"bytes\"}],\"name\":\"GovernanceCallTimelocked\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"initialGovernance\",\"type\":\"address\"}],\"name\":\"GovernanceInitialised\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"governanceSettings\",\"type\":\"address\"}],\"name\":\"GovernedProductionModeEntered\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes4\",\"name\":\"selector\",\"type\":\"bytes4\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"TimelockedGovernanceCallCanceled\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes4\",\"name\":\"selector\",\"type\":\"bytes4\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"TimelockedGovernanceCallExecuted\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"MAX_BLOCKS_HISTORY\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"MAX_FEED_AGE_IN_VOTING_EPOCHS\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_blockNum\",\"type\":\"uint256\"}],\"name\":\"blockScoreCutoff\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"_cutoff\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"_selector\",\"type\":\"bytes4\"}],\"name\":\"cancelGovernanceCall\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"currentRewardEpochId\",\"outputs\":[{\"internalType\":\"uint24\",\"name\":\"\",\"type\":\"uint24\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"currentScoreCutoff\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"_cutoff\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_signingPolicyAddress\",\"type\":\"address\"}],\"name\":\"currentSortitionWeight\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"_weight\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"daemonize\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"_selector\",\"type\":\"bytes4\"}],\"name\":\"executeGovernanceCall\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"fastUpdateIncentiveManager\",\"outputs\":[{\"internalType\":\"contractIIFastUpdateIncentiveManager\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"fastUpdatesConfiguration\",\"outputs\":[{\"internalType\":\"contractIFastUpdatesConfiguration\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"fetchAllCurrentFeeds\",\"outputs\":[{\"internalType\":\"bytes21[]\",\"name\":\"_feedIds\",\"type\":\"bytes21[]\"},{\"internalType\":\"uint256[]\",\"name\":\"_feeds\",\"type\":\"uint256[]\"},{\"internalType\":\"int8[]\",\"name\":\"_decimals\",\"type\":\"int8[]\"},{\"internalType\":\"uint64\",\"name\":\"_timestamp\",\"type\":\"uint64\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"_indices\",\"type\":\"uint256[]\"}],\"name\":\"fetchCurrentFeeds\",\"outputs\":[{\"internalType\":\"uint256[]\",\"name\":\"_feeds\",\"type\":\"uint256[]\"},{\"internalType\":\"int8[]\",\"name\":\"_decimals\",\"type\":\"int8[]\"},{\"internalType\":\"uint64\",\"name\":\"_timestamp\",\"type\":\"uint64\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"firstVotingRoundStartTs\",\"outputs\":[{\"internalType\":\"uint64\",\"name\":\"\",\"type\":\"uint64\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"flareDaemon\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"flareSystemsManager\",\"outputs\":[{\"internalType\":\"contractIFlareSystemsManager\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"ftsoFeedPublisher\",\"outputs\":[{\"internalType\":\"contractIFtsoFeedPublisher\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getAddressUpdater\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"_addressUpdater\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getContractName\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"governance\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"governanceSettings\",\"outputs\":[{\"internalType\":\"contractIGovernanceSettings\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contractIGovernanceSettings\",\"name\":\"_governanceSettings\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_initialGovernance\",\"type\":\"address\"}],\"name\":\"initialise\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_address\",\"type\":\"address\"}],\"name\":\"isExecutor\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_historySize\",\"type\":\"uint256\"}],\"name\":\"numberOfUpdates\",\"outputs\":[{\"internalType\":\"uint256[]\",\"name\":\"_noOfUpdates\",\"type\":\"uint256[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_blockNumber\",\"type\":\"uint256\"}],\"name\":\"numberOfUpdatesInBlock\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"productionMode\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"_indices\",\"type\":\"uint256[]\"}],\"name\":\"removeFeeds\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"_indices\",\"type\":\"uint256[]\"}],\"name\":\"resetFeeds\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint8\",\"name\":\"_submissionWindow\",\"type\":\"uint8\"}],\"name\":\"setSubmissionWindow\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"submissionWindow\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"sortitionBlock\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"uint256\",\"name\":\"replicate\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"uint256\",\"name\":\"x\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"y\",\"type\":\"uint256\"}],\"internalType\":\"structBn256.G1Point\",\"name\":\"gamma\",\"type\":\"tuple\"},{\"internalType\":\"uint256\",\"name\":\"c\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"s\",\"type\":\"uint256\"}],\"internalType\":\"structSortitionCredential\",\"name\":\"sortitionCredential\",\"type\":\"tuple\"},{\"internalType\":\"bytes\",\"name\":\"deltas\",\"type\":\"bytes\"},{\"components\":[{\"internalType\":\"uint8\",\"name\":\"v\",\"type\":\"uint8\"},{\"internalType\":\"bytes32\",\"name\":\"r\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"s\",\"type\":\"bytes32\"}],\"internalType\":\"structIFastUpdater.Signature\",\"name\":\"signature\",\"type\":\"tuple\"}],\"internalType\":\"structIFastUpdater.FastUpdates\",\"name\":\"_updates\",\"type\":\"tuple\"}],\"name\":\"submitUpdates\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"switchToFallbackMode\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"switchToProductionMode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"selector\",\"type\":\"bytes4\"}],\"name\":\"timelockedCalls\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"allowedAfterTimestamp\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"encodedCall\",\"type\":\"bytes\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"_contractNameHashes\",\"type\":\"bytes32[]\"},{\"internalType\":\"address[]\",\"name\":\"_contractAddresses\",\"type\":\"address[]\"}],\"name\":\"updateContractAddresses\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_voter\",\"type\":\"address\"},{\"internalType\":\"bytes32\",\"name\":\"_part1\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"_part2\",\"type\":\"bytes32\"},{\"internalType\":\"bytes\",\"name\":\"_verificationData\",\"type\":\"bytes\"}],\"name\":\"verifyPublicKey\",\"outputs\":[],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"voterRegistry\",\"outputs\":[{\"internalType\":\"contractIIVoterRegistry\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"votingEpochDurationSeconds\",\"outputs\":[{\"internalType\":\"uint64\",\"name\":\"\",\"type\":\"uint64\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
}

// FastUpdaterABI is the input ABI used to generate the binding from.
// Deprecated: Use FastUpdaterMetaData.ABI instead.
var FastUpdaterABI = FastUpdaterMetaData.ABI

// FastUpdater is an auto generated Go binding around an Ethereum contract.
type FastUpdater struct {
	FastUpdaterCaller     // Read-only binding to the contract
	FastUpdaterTransactor // Write-only binding to the contract
	FastUpdaterFilterer   // Log filterer for contract events
}

// FastUpdaterCaller is an auto generated read-only Go binding around an Ethereum contract.
type FastUpdaterCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FastUpdaterTransactor is an auto generated write-only Go binding around an Ethereum contract.
type FastUpdaterTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FastUpdaterFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type FastUpdaterFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FastUpdaterSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type FastUpdaterSession struct {
	Contract     *FastUpdater      // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// FastUpdaterCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type FastUpdaterCallerSession struct {
	Contract *FastUpdaterCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts      // Call options to use throughout this session
}

// FastUpdaterTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type FastUpdaterTransactorSession struct {
	Contract     *FastUpdaterTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts      // Transaction auth options to use throughout this session
}

// FastUpdaterRaw is an auto generated low-level Go binding around an Ethereum contract.
type FastUpdaterRaw struct {
	Contract *FastUpdater // Generic contract binding to access the raw methods on
}

// FastUpdaterCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type FastUpdaterCallerRaw struct {
	Contract *FastUpdaterCaller // Generic read-only contract binding to access the raw methods on
}

// FastUpdaterTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type FastUpdaterTransactorRaw struct {
	Contract *FastUpdaterTransactor // Generic write-only contract binding to access the raw methods on
}

// NewFastUpdater creates a new instance of FastUpdater, bound to a specific deployed contract.
func NewFastUpdater(address common.Address, backend bind.ContractBackend) (*FastUpdater, error) {
	contract, err := bindFastUpdater(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &FastUpdater{FastUpdaterCaller: FastUpdaterCaller{contract: contract}, FastUpdaterTransactor: FastUpdaterTransactor{contract: contract}, FastUpdaterFilterer: FastUpdaterFilterer{contract: contract}}, nil
}

// NewFastUpdaterCaller creates a new read-only instance of FastUpdater, bound to a specific deployed contract.
func NewFastUpdaterCaller(address common.Address, caller bind.ContractCaller) (*FastUpdaterCaller, error) {
	contract, err := bindFastUpdater(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &FastUpdaterCaller{contract: contract}, nil
}

// NewFastUpdaterTransactor creates a new write-only instance of FastUpdater, bound to a specific deployed contract.
func NewFastUpdaterTransactor(address common.Address, transactor bind.ContractTransactor) (*FastUpdaterTransactor, error) {
	contract, err := bindFastUpdater(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &FastUpdaterTransactor{contract: contract}, nil
}

// NewFastUpdaterFilterer creates a new log filterer instance of FastUpdater, bound to a specific deployed contract.
func NewFastUpdaterFilterer(address common.Address, filterer bind.ContractFilterer) (*FastUpdaterFilterer, error) {
	contract, err := bindFastUpdater(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &FastUpdaterFilterer{contract: contract}, nil
}

// bindFastUpdater binds a generic wrapper to an already deployed contract.
func bindFastUpdater(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := FastUpdaterMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FastUpdater *FastUpdaterRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FastUpdater.Contract.FastUpdaterCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FastUpdater *FastUpdaterRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FastUpdater.Contract.FastUpdaterTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FastUpdater *FastUpdaterRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FastUpdater.Contract.FastUpdaterTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FastUpdater *FastUpdaterCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FastUpdater.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FastUpdater *FastUpdaterTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FastUpdater.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FastUpdater *FastUpdaterTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FastUpdater.Contract.contract.Transact(opts, method, params...)
}

// MAXBLOCKSHISTORY is a free data retrieval call binding the contract method 0xc1bff139.
//
// Solidity: function MAX_BLOCKS_HISTORY() view returns(uint256)
func (_FastUpdater *FastUpdaterCaller) MAXBLOCKSHISTORY(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "MAX_BLOCKS_HISTORY")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// MAXBLOCKSHISTORY is a free data retrieval call binding the contract method 0xc1bff139.
//
// Solidity: function MAX_BLOCKS_HISTORY() view returns(uint256)
func (_FastUpdater *FastUpdaterSession) MAXBLOCKSHISTORY() (*big.Int, error) {
	return _FastUpdater.Contract.MAXBLOCKSHISTORY(&_FastUpdater.CallOpts)
}

// MAXBLOCKSHISTORY is a free data retrieval call binding the contract method 0xc1bff139.
//
// Solidity: function MAX_BLOCKS_HISTORY() view returns(uint256)
func (_FastUpdater *FastUpdaterCallerSession) MAXBLOCKSHISTORY() (*big.Int, error) {
	return _FastUpdater.Contract.MAXBLOCKSHISTORY(&_FastUpdater.CallOpts)
}

// MAXFEEDAGEINVOTINGEPOCHS is a free data retrieval call binding the contract method 0x7fe3341a.
//
// Solidity: function MAX_FEED_AGE_IN_VOTING_EPOCHS() view returns(uint256)
func (_FastUpdater *FastUpdaterCaller) MAXFEEDAGEINVOTINGEPOCHS(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "MAX_FEED_AGE_IN_VOTING_EPOCHS")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// MAXFEEDAGEINVOTINGEPOCHS is a free data retrieval call binding the contract method 0x7fe3341a.
//
// Solidity: function MAX_FEED_AGE_IN_VOTING_EPOCHS() view returns(uint256)
func (_FastUpdater *FastUpdaterSession) MAXFEEDAGEINVOTINGEPOCHS() (*big.Int, error) {
	return _FastUpdater.Contract.MAXFEEDAGEINVOTINGEPOCHS(&_FastUpdater.CallOpts)
}

// MAXFEEDAGEINVOTINGEPOCHS is a free data retrieval call binding the contract method 0x7fe3341a.
//
// Solidity: function MAX_FEED_AGE_IN_VOTING_EPOCHS() view returns(uint256)
func (_FastUpdater *FastUpdaterCallerSession) MAXFEEDAGEINVOTINGEPOCHS() (*big.Int, error) {
	return _FastUpdater.Contract.MAXFEEDAGEINVOTINGEPOCHS(&_FastUpdater.CallOpts)
}

// BlockScoreCutoff is a free data retrieval call binding the contract method 0xdcb1476e.
//
// Solidity: function blockScoreCutoff(uint256 _blockNum) view returns(uint256 _cutoff)
func (_FastUpdater *FastUpdaterCaller) BlockScoreCutoff(opts *bind.CallOpts, _blockNum *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "blockScoreCutoff", _blockNum)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// BlockScoreCutoff is a free data retrieval call binding the contract method 0xdcb1476e.
//
// Solidity: function blockScoreCutoff(uint256 _blockNum) view returns(uint256 _cutoff)
func (_FastUpdater *FastUpdaterSession) BlockScoreCutoff(_blockNum *big.Int) (*big.Int, error) {
	return _FastUpdater.Contract.BlockScoreCutoff(&_FastUpdater.CallOpts, _blockNum)
}

// BlockScoreCutoff is a free data retrieval call binding the contract method 0xdcb1476e.
//
// Solidity: function blockScoreCutoff(uint256 _blockNum) view returns(uint256 _cutoff)
func (_FastUpdater *FastUpdaterCallerSession) BlockScoreCutoff(_blockNum *big.Int) (*big.Int, error) {
	return _FastUpdater.Contract.BlockScoreCutoff(&_FastUpdater.CallOpts, _blockNum)
}

// CurrentRewardEpochId is a free data retrieval call binding the contract method 0x8e0e9f7c.
//
// Solidity: function currentRewardEpochId() view returns(uint24)
func (_FastUpdater *FastUpdaterCaller) CurrentRewardEpochId(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "currentRewardEpochId")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// CurrentRewardEpochId is a free data retrieval call binding the contract method 0x8e0e9f7c.
//
// Solidity: function currentRewardEpochId() view returns(uint24)
func (_FastUpdater *FastUpdaterSession) CurrentRewardEpochId() (*big.Int, error) {
	return _FastUpdater.Contract.CurrentRewardEpochId(&_FastUpdater.CallOpts)
}

// CurrentRewardEpochId is a free data retrieval call binding the contract method 0x8e0e9f7c.
//
// Solidity: function currentRewardEpochId() view returns(uint24)
func (_FastUpdater *FastUpdaterCallerSession) CurrentRewardEpochId() (*big.Int, error) {
	return _FastUpdater.Contract.CurrentRewardEpochId(&_FastUpdater.CallOpts)
}

// CurrentScoreCutoff is a free data retrieval call binding the contract method 0x0799fe75.
//
// Solidity: function currentScoreCutoff() view returns(uint256 _cutoff)
func (_FastUpdater *FastUpdaterCaller) CurrentScoreCutoff(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "currentScoreCutoff")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// CurrentScoreCutoff is a free data retrieval call binding the contract method 0x0799fe75.
//
// Solidity: function currentScoreCutoff() view returns(uint256 _cutoff)
func (_FastUpdater *FastUpdaterSession) CurrentScoreCutoff() (*big.Int, error) {
	return _FastUpdater.Contract.CurrentScoreCutoff(&_FastUpdater.CallOpts)
}

// CurrentScoreCutoff is a free data retrieval call binding the contract method 0x0799fe75.
//
// Solidity: function currentScoreCutoff() view returns(uint256 _cutoff)
func (_FastUpdater *FastUpdaterCallerSession) CurrentScoreCutoff() (*big.Int, error) {
	return _FastUpdater.Contract.CurrentScoreCutoff(&_FastUpdater.CallOpts)
}

// CurrentSortitionWeight is a free data retrieval call binding the contract method 0xa14634a7.
//
// Solidity: function currentSortitionWeight(address _signingPolicyAddress) view returns(uint256 _weight)
func (_FastUpdater *FastUpdaterCaller) CurrentSortitionWeight(opts *bind.CallOpts, _signingPolicyAddress common.Address) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "currentSortitionWeight", _signingPolicyAddress)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// CurrentSortitionWeight is a free data retrieval call binding the contract method 0xa14634a7.
//
// Solidity: function currentSortitionWeight(address _signingPolicyAddress) view returns(uint256 _weight)
func (_FastUpdater *FastUpdaterSession) CurrentSortitionWeight(_signingPolicyAddress common.Address) (*big.Int, error) {
	return _FastUpdater.Contract.CurrentSortitionWeight(&_FastUpdater.CallOpts, _signingPolicyAddress)
}

// CurrentSortitionWeight is a free data retrieval call binding the contract method 0xa14634a7.
//
// Solidity: function currentSortitionWeight(address _signingPolicyAddress) view returns(uint256 _weight)
func (_FastUpdater *FastUpdaterCallerSession) CurrentSortitionWeight(_signingPolicyAddress common.Address) (*big.Int, error) {
	return _FastUpdater.Contract.CurrentSortitionWeight(&_FastUpdater.CallOpts, _signingPolicyAddress)
}

// FastUpdateIncentiveManager is a free data retrieval call binding the contract method 0x7925eaca.
//
// Solidity: function fastUpdateIncentiveManager() view returns(address)
func (_FastUpdater *FastUpdaterCaller) FastUpdateIncentiveManager(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "fastUpdateIncentiveManager")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FastUpdateIncentiveManager is a free data retrieval call binding the contract method 0x7925eaca.
//
// Solidity: function fastUpdateIncentiveManager() view returns(address)
func (_FastUpdater *FastUpdaterSession) FastUpdateIncentiveManager() (common.Address, error) {
	return _FastUpdater.Contract.FastUpdateIncentiveManager(&_FastUpdater.CallOpts)
}

// FastUpdateIncentiveManager is a free data retrieval call binding the contract method 0x7925eaca.
//
// Solidity: function fastUpdateIncentiveManager() view returns(address)
func (_FastUpdater *FastUpdaterCallerSession) FastUpdateIncentiveManager() (common.Address, error) {
	return _FastUpdater.Contract.FastUpdateIncentiveManager(&_FastUpdater.CallOpts)
}

// FastUpdatesConfiguration is a free data retrieval call binding the contract method 0xc10f489a.
//
// Solidity: function fastUpdatesConfiguration() view returns(address)
func (_FastUpdater *FastUpdaterCaller) FastUpdatesConfiguration(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "fastUpdatesConfiguration")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FastUpdatesConfiguration is a free data retrieval call binding the contract method 0xc10f489a.
//
// Solidity: function fastUpdatesConfiguration() view returns(address)
func (_FastUpdater *FastUpdaterSession) FastUpdatesConfiguration() (common.Address, error) {
	return _FastUpdater.Contract.FastUpdatesConfiguration(&_FastUpdater.CallOpts)
}

// FastUpdatesConfiguration is a free data retrieval call binding the contract method 0xc10f489a.
//
// Solidity: function fastUpdatesConfiguration() view returns(address)
func (_FastUpdater *FastUpdaterCallerSession) FastUpdatesConfiguration() (common.Address, error) {
	return _FastUpdater.Contract.FastUpdatesConfiguration(&_FastUpdater.CallOpts)
}

// FetchAllCurrentFeeds is a free data retrieval call binding the contract method 0x4691377f.
//
// Solidity: function fetchAllCurrentFeeds() view returns(bytes21[] _feedIds, uint256[] _feeds, int8[] _decimals, uint64 _timestamp)
func (_FastUpdater *FastUpdaterCaller) FetchAllCurrentFeeds(opts *bind.CallOpts) (struct {
	FeedIds   [][21]byte
	Feeds     []*big.Int
	Decimals  []int8
	Timestamp uint64
}, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "fetchAllCurrentFeeds")

	outstruct := new(struct {
		FeedIds   [][21]byte
		Feeds     []*big.Int
		Decimals  []int8
		Timestamp uint64
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.FeedIds = *abi.ConvertType(out[0], new([][21]byte)).(*[][21]byte)
	outstruct.Feeds = *abi.ConvertType(out[1], new([]*big.Int)).(*[]*big.Int)
	outstruct.Decimals = *abi.ConvertType(out[2], new([]int8)).(*[]int8)
	outstruct.Timestamp = *abi.ConvertType(out[3], new(uint64)).(*uint64)

	return *outstruct, err

}

// FetchAllCurrentFeeds is a free data retrieval call binding the contract method 0x4691377f.
//
// Solidity: function fetchAllCurrentFeeds() view returns(bytes21[] _feedIds, uint256[] _feeds, int8[] _decimals, uint64 _timestamp)
func (_FastUpdater *FastUpdaterSession) FetchAllCurrentFeeds() (struct {
	FeedIds   [][21]byte
	Feeds     []*big.Int
	Decimals  []int8
	Timestamp uint64
}, error) {
	return _FastUpdater.Contract.FetchAllCurrentFeeds(&_FastUpdater.CallOpts)
}

// FetchAllCurrentFeeds is a free data retrieval call binding the contract method 0x4691377f.
//
// Solidity: function fetchAllCurrentFeeds() view returns(bytes21[] _feedIds, uint256[] _feeds, int8[] _decimals, uint64 _timestamp)
func (_FastUpdater *FastUpdaterCallerSession) FetchAllCurrentFeeds() (struct {
	FeedIds   [][21]byte
	Feeds     []*big.Int
	Decimals  []int8
	Timestamp uint64
}, error) {
	return _FastUpdater.Contract.FetchAllCurrentFeeds(&_FastUpdater.CallOpts)
}

// FetchCurrentFeeds is a free data retrieval call binding the contract method 0x45a15d3c.
//
// Solidity: function fetchCurrentFeeds(uint256[] _indices) view returns(uint256[] _feeds, int8[] _decimals, uint64 _timestamp)
func (_FastUpdater *FastUpdaterCaller) FetchCurrentFeeds(opts *bind.CallOpts, _indices []*big.Int) (struct {
	Feeds     []*big.Int
	Decimals  []int8
	Timestamp uint64
}, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "fetchCurrentFeeds", _indices)

	outstruct := new(struct {
		Feeds     []*big.Int
		Decimals  []int8
		Timestamp uint64
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.Feeds = *abi.ConvertType(out[0], new([]*big.Int)).(*[]*big.Int)
	outstruct.Decimals = *abi.ConvertType(out[1], new([]int8)).(*[]int8)
	outstruct.Timestamp = *abi.ConvertType(out[2], new(uint64)).(*uint64)

	return *outstruct, err

}

// FetchCurrentFeeds is a free data retrieval call binding the contract method 0x45a15d3c.
//
// Solidity: function fetchCurrentFeeds(uint256[] _indices) view returns(uint256[] _feeds, int8[] _decimals, uint64 _timestamp)
func (_FastUpdater *FastUpdaterSession) FetchCurrentFeeds(_indices []*big.Int) (struct {
	Feeds     []*big.Int
	Decimals  []int8
	Timestamp uint64
}, error) {
	return _FastUpdater.Contract.FetchCurrentFeeds(&_FastUpdater.CallOpts, _indices)
}

// FetchCurrentFeeds is a free data retrieval call binding the contract method 0x45a15d3c.
//
// Solidity: function fetchCurrentFeeds(uint256[] _indices) view returns(uint256[] _feeds, int8[] _decimals, uint64 _timestamp)
func (_FastUpdater *FastUpdaterCallerSession) FetchCurrentFeeds(_indices []*big.Int) (struct {
	Feeds     []*big.Int
	Decimals  []int8
	Timestamp uint64
}, error) {
	return _FastUpdater.Contract.FetchCurrentFeeds(&_FastUpdater.CallOpts, _indices)
}

// FirstVotingRoundStartTs is a free data retrieval call binding the contract method 0xe8d0e70a.
//
// Solidity: function firstVotingRoundStartTs() view returns(uint64)
func (_FastUpdater *FastUpdaterCaller) FirstVotingRoundStartTs(opts *bind.CallOpts) (uint64, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "firstVotingRoundStartTs")

	if err != nil {
		return *new(uint64), err
	}

	out0 := *abi.ConvertType(out[0], new(uint64)).(*uint64)

	return out0, err

}

// FirstVotingRoundStartTs is a free data retrieval call binding the contract method 0xe8d0e70a.
//
// Solidity: function firstVotingRoundStartTs() view returns(uint64)
func (_FastUpdater *FastUpdaterSession) FirstVotingRoundStartTs() (uint64, error) {
	return _FastUpdater.Contract.FirstVotingRoundStartTs(&_FastUpdater.CallOpts)
}

// FirstVotingRoundStartTs is a free data retrieval call binding the contract method 0xe8d0e70a.
//
// Solidity: function firstVotingRoundStartTs() view returns(uint64)
func (_FastUpdater *FastUpdaterCallerSession) FirstVotingRoundStartTs() (uint64, error) {
	return _FastUpdater.Contract.FirstVotingRoundStartTs(&_FastUpdater.CallOpts)
}

// FlareDaemon is a free data retrieval call binding the contract method 0xa1077532.
//
// Solidity: function flareDaemon() view returns(address)
func (_FastUpdater *FastUpdaterCaller) FlareDaemon(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "flareDaemon")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FlareDaemon is a free data retrieval call binding the contract method 0xa1077532.
//
// Solidity: function flareDaemon() view returns(address)
func (_FastUpdater *FastUpdaterSession) FlareDaemon() (common.Address, error) {
	return _FastUpdater.Contract.FlareDaemon(&_FastUpdater.CallOpts)
}

// FlareDaemon is a free data retrieval call binding the contract method 0xa1077532.
//
// Solidity: function flareDaemon() view returns(address)
func (_FastUpdater *FastUpdaterCallerSession) FlareDaemon() (common.Address, error) {
	return _FastUpdater.Contract.FlareDaemon(&_FastUpdater.CallOpts)
}

// FlareSystemsManager is a free data retrieval call binding the contract method 0xfaae7fc9.
//
// Solidity: function flareSystemsManager() view returns(address)
func (_FastUpdater *FastUpdaterCaller) FlareSystemsManager(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "flareSystemsManager")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FlareSystemsManager is a free data retrieval call binding the contract method 0xfaae7fc9.
//
// Solidity: function flareSystemsManager() view returns(address)
func (_FastUpdater *FastUpdaterSession) FlareSystemsManager() (common.Address, error) {
	return _FastUpdater.Contract.FlareSystemsManager(&_FastUpdater.CallOpts)
}

// FlareSystemsManager is a free data retrieval call binding the contract method 0xfaae7fc9.
//
// Solidity: function flareSystemsManager() view returns(address)
func (_FastUpdater *FastUpdaterCallerSession) FlareSystemsManager() (common.Address, error) {
	return _FastUpdater.Contract.FlareSystemsManager(&_FastUpdater.CallOpts)
}

// FtsoFeedPublisher is a free data retrieval call binding the contract method 0x29bfe39d.
//
// Solidity: function ftsoFeedPublisher() view returns(address)
func (_FastUpdater *FastUpdaterCaller) FtsoFeedPublisher(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "ftsoFeedPublisher")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FtsoFeedPublisher is a free data retrieval call binding the contract method 0x29bfe39d.
//
// Solidity: function ftsoFeedPublisher() view returns(address)
func (_FastUpdater *FastUpdaterSession) FtsoFeedPublisher() (common.Address, error) {
	return _FastUpdater.Contract.FtsoFeedPublisher(&_FastUpdater.CallOpts)
}

// FtsoFeedPublisher is a free data retrieval call binding the contract method 0x29bfe39d.
//
// Solidity: function ftsoFeedPublisher() view returns(address)
func (_FastUpdater *FastUpdaterCallerSession) FtsoFeedPublisher() (common.Address, error) {
	return _FastUpdater.Contract.FtsoFeedPublisher(&_FastUpdater.CallOpts)
}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_FastUpdater *FastUpdaterCaller) GetAddressUpdater(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "getAddressUpdater")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_FastUpdater *FastUpdaterSession) GetAddressUpdater() (common.Address, error) {
	return _FastUpdater.Contract.GetAddressUpdater(&_FastUpdater.CallOpts)
}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_FastUpdater *FastUpdaterCallerSession) GetAddressUpdater() (common.Address, error) {
	return _FastUpdater.Contract.GetAddressUpdater(&_FastUpdater.CallOpts)
}

// GetContractName is a free data retrieval call binding the contract method 0xf5f5ba72.
//
// Solidity: function getContractName() pure returns(string)
func (_FastUpdater *FastUpdaterCaller) GetContractName(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "getContractName")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetContractName is a free data retrieval call binding the contract method 0xf5f5ba72.
//
// Solidity: function getContractName() pure returns(string)
func (_FastUpdater *FastUpdaterSession) GetContractName() (string, error) {
	return _FastUpdater.Contract.GetContractName(&_FastUpdater.CallOpts)
}

// GetContractName is a free data retrieval call binding the contract method 0xf5f5ba72.
//
// Solidity: function getContractName() pure returns(string)
func (_FastUpdater *FastUpdaterCallerSession) GetContractName() (string, error) {
	return _FastUpdater.Contract.GetContractName(&_FastUpdater.CallOpts)
}

// Governance is a free data retrieval call binding the contract method 0x5aa6e675.
//
// Solidity: function governance() view returns(address)
func (_FastUpdater *FastUpdaterCaller) Governance(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "governance")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Governance is a free data retrieval call binding the contract method 0x5aa6e675.
//
// Solidity: function governance() view returns(address)
func (_FastUpdater *FastUpdaterSession) Governance() (common.Address, error) {
	return _FastUpdater.Contract.Governance(&_FastUpdater.CallOpts)
}

// Governance is a free data retrieval call binding the contract method 0x5aa6e675.
//
// Solidity: function governance() view returns(address)
func (_FastUpdater *FastUpdaterCallerSession) Governance() (common.Address, error) {
	return _FastUpdater.Contract.Governance(&_FastUpdater.CallOpts)
}

// GovernanceSettings is a free data retrieval call binding the contract method 0x62354e03.
//
// Solidity: function governanceSettings() view returns(address)
func (_FastUpdater *FastUpdaterCaller) GovernanceSettings(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "governanceSettings")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GovernanceSettings is a free data retrieval call binding the contract method 0x62354e03.
//
// Solidity: function governanceSettings() view returns(address)
func (_FastUpdater *FastUpdaterSession) GovernanceSettings() (common.Address, error) {
	return _FastUpdater.Contract.GovernanceSettings(&_FastUpdater.CallOpts)
}

// GovernanceSettings is a free data retrieval call binding the contract method 0x62354e03.
//
// Solidity: function governanceSettings() view returns(address)
func (_FastUpdater *FastUpdaterCallerSession) GovernanceSettings() (common.Address, error) {
	return _FastUpdater.Contract.GovernanceSettings(&_FastUpdater.CallOpts)
}

// IsExecutor is a free data retrieval call binding the contract method 0xdebfda30.
//
// Solidity: function isExecutor(address _address) view returns(bool)
func (_FastUpdater *FastUpdaterCaller) IsExecutor(opts *bind.CallOpts, _address common.Address) (bool, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "isExecutor", _address)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsExecutor is a free data retrieval call binding the contract method 0xdebfda30.
//
// Solidity: function isExecutor(address _address) view returns(bool)
func (_FastUpdater *FastUpdaterSession) IsExecutor(_address common.Address) (bool, error) {
	return _FastUpdater.Contract.IsExecutor(&_FastUpdater.CallOpts, _address)
}

// IsExecutor is a free data retrieval call binding the contract method 0xdebfda30.
//
// Solidity: function isExecutor(address _address) view returns(bool)
func (_FastUpdater *FastUpdaterCallerSession) IsExecutor(_address common.Address) (bool, error) {
	return _FastUpdater.Contract.IsExecutor(&_FastUpdater.CallOpts, _address)
}

// NumberOfUpdates is a free data retrieval call binding the contract method 0xe36da7b7.
//
// Solidity: function numberOfUpdates(uint256 _historySize) view returns(uint256[] _noOfUpdates)
func (_FastUpdater *FastUpdaterCaller) NumberOfUpdates(opts *bind.CallOpts, _historySize *big.Int) ([]*big.Int, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "numberOfUpdates", _historySize)

	if err != nil {
		return *new([]*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new([]*big.Int)).(*[]*big.Int)

	return out0, err

}

// NumberOfUpdates is a free data retrieval call binding the contract method 0xe36da7b7.
//
// Solidity: function numberOfUpdates(uint256 _historySize) view returns(uint256[] _noOfUpdates)
func (_FastUpdater *FastUpdaterSession) NumberOfUpdates(_historySize *big.Int) ([]*big.Int, error) {
	return _FastUpdater.Contract.NumberOfUpdates(&_FastUpdater.CallOpts, _historySize)
}

// NumberOfUpdates is a free data retrieval call binding the contract method 0xe36da7b7.
//
// Solidity: function numberOfUpdates(uint256 _historySize) view returns(uint256[] _noOfUpdates)
func (_FastUpdater *FastUpdaterCallerSession) NumberOfUpdates(_historySize *big.Int) ([]*big.Int, error) {
	return _FastUpdater.Contract.NumberOfUpdates(&_FastUpdater.CallOpts, _historySize)
}

// NumberOfUpdatesInBlock is a free data retrieval call binding the contract method 0xfc79c300.
//
// Solidity: function numberOfUpdatesInBlock(uint256 _blockNumber) view returns(uint256)
func (_FastUpdater *FastUpdaterCaller) NumberOfUpdatesInBlock(opts *bind.CallOpts, _blockNumber *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "numberOfUpdatesInBlock", _blockNumber)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// NumberOfUpdatesInBlock is a free data retrieval call binding the contract method 0xfc79c300.
//
// Solidity: function numberOfUpdatesInBlock(uint256 _blockNumber) view returns(uint256)
func (_FastUpdater *FastUpdaterSession) NumberOfUpdatesInBlock(_blockNumber *big.Int) (*big.Int, error) {
	return _FastUpdater.Contract.NumberOfUpdatesInBlock(&_FastUpdater.CallOpts, _blockNumber)
}

// NumberOfUpdatesInBlock is a free data retrieval call binding the contract method 0xfc79c300.
//
// Solidity: function numberOfUpdatesInBlock(uint256 _blockNumber) view returns(uint256)
func (_FastUpdater *FastUpdaterCallerSession) NumberOfUpdatesInBlock(_blockNumber *big.Int) (*big.Int, error) {
	return _FastUpdater.Contract.NumberOfUpdatesInBlock(&_FastUpdater.CallOpts, _blockNumber)
}

// ProductionMode is a free data retrieval call binding the contract method 0xe17f212e.
//
// Solidity: function productionMode() view returns(bool)
func (_FastUpdater *FastUpdaterCaller) ProductionMode(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "productionMode")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// ProductionMode is a free data retrieval call binding the contract method 0xe17f212e.
//
// Solidity: function productionMode() view returns(bool)
func (_FastUpdater *FastUpdaterSession) ProductionMode() (bool, error) {
	return _FastUpdater.Contract.ProductionMode(&_FastUpdater.CallOpts)
}

// ProductionMode is a free data retrieval call binding the contract method 0xe17f212e.
//
// Solidity: function productionMode() view returns(bool)
func (_FastUpdater *FastUpdaterCallerSession) ProductionMode() (bool, error) {
	return _FastUpdater.Contract.ProductionMode(&_FastUpdater.CallOpts)
}

// SubmissionWindow is a free data retrieval call binding the contract method 0xe621dbc7.
//
// Solidity: function submissionWindow() view returns(uint8)
func (_FastUpdater *FastUpdaterCaller) SubmissionWindow(opts *bind.CallOpts) (uint8, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "submissionWindow")

	if err != nil {
		return *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(uint8)).(*uint8)

	return out0, err

}

// SubmissionWindow is a free data retrieval call binding the contract method 0xe621dbc7.
//
// Solidity: function submissionWindow() view returns(uint8)
func (_FastUpdater *FastUpdaterSession) SubmissionWindow() (uint8, error) {
	return _FastUpdater.Contract.SubmissionWindow(&_FastUpdater.CallOpts)
}

// SubmissionWindow is a free data retrieval call binding the contract method 0xe621dbc7.
//
// Solidity: function submissionWindow() view returns(uint8)
func (_FastUpdater *FastUpdaterCallerSession) SubmissionWindow() (uint8, error) {
	return _FastUpdater.Contract.SubmissionWindow(&_FastUpdater.CallOpts)
}

// SwitchToFallbackMode is a free data retrieval call binding the contract method 0xe22fdece.
//
// Solidity: function switchToFallbackMode() view returns(bool)
func (_FastUpdater *FastUpdaterCaller) SwitchToFallbackMode(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "switchToFallbackMode")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// SwitchToFallbackMode is a free data retrieval call binding the contract method 0xe22fdece.
//
// Solidity: function switchToFallbackMode() view returns(bool)
func (_FastUpdater *FastUpdaterSession) SwitchToFallbackMode() (bool, error) {
	return _FastUpdater.Contract.SwitchToFallbackMode(&_FastUpdater.CallOpts)
}

// SwitchToFallbackMode is a free data retrieval call binding the contract method 0xe22fdece.
//
// Solidity: function switchToFallbackMode() view returns(bool)
func (_FastUpdater *FastUpdaterCallerSession) SwitchToFallbackMode() (bool, error) {
	return _FastUpdater.Contract.SwitchToFallbackMode(&_FastUpdater.CallOpts)
}

// TimelockedCalls is a free data retrieval call binding the contract method 0x74e6310e.
//
// Solidity: function timelockedCalls(bytes4 selector) view returns(uint256 allowedAfterTimestamp, bytes encodedCall)
func (_FastUpdater *FastUpdaterCaller) TimelockedCalls(opts *bind.CallOpts, selector [4]byte) (struct {
	AllowedAfterTimestamp *big.Int
	EncodedCall           []byte
}, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "timelockedCalls", selector)

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
func (_FastUpdater *FastUpdaterSession) TimelockedCalls(selector [4]byte) (struct {
	AllowedAfterTimestamp *big.Int
	EncodedCall           []byte
}, error) {
	return _FastUpdater.Contract.TimelockedCalls(&_FastUpdater.CallOpts, selector)
}

// TimelockedCalls is a free data retrieval call binding the contract method 0x74e6310e.
//
// Solidity: function timelockedCalls(bytes4 selector) view returns(uint256 allowedAfterTimestamp, bytes encodedCall)
func (_FastUpdater *FastUpdaterCallerSession) TimelockedCalls(selector [4]byte) (struct {
	AllowedAfterTimestamp *big.Int
	EncodedCall           []byte
}, error) {
	return _FastUpdater.Contract.TimelockedCalls(&_FastUpdater.CallOpts, selector)
}

// VerifyPublicKey is a free data retrieval call binding the contract method 0x70473f2f.
//
// Solidity: function verifyPublicKey(address _voter, bytes32 _part1, bytes32 _part2, bytes _verificationData) view returns()
func (_FastUpdater *FastUpdaterCaller) VerifyPublicKey(opts *bind.CallOpts, _voter common.Address, _part1 [32]byte, _part2 [32]byte, _verificationData []byte) error {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "verifyPublicKey", _voter, _part1, _part2, _verificationData)

	if err != nil {
		return err
	}

	return err

}

// VerifyPublicKey is a free data retrieval call binding the contract method 0x70473f2f.
//
// Solidity: function verifyPublicKey(address _voter, bytes32 _part1, bytes32 _part2, bytes _verificationData) view returns()
func (_FastUpdater *FastUpdaterSession) VerifyPublicKey(_voter common.Address, _part1 [32]byte, _part2 [32]byte, _verificationData []byte) error {
	return _FastUpdater.Contract.VerifyPublicKey(&_FastUpdater.CallOpts, _voter, _part1, _part2, _verificationData)
}

// VerifyPublicKey is a free data retrieval call binding the contract method 0x70473f2f.
//
// Solidity: function verifyPublicKey(address _voter, bytes32 _part1, bytes32 _part2, bytes _verificationData) view returns()
func (_FastUpdater *FastUpdaterCallerSession) VerifyPublicKey(_voter common.Address, _part1 [32]byte, _part2 [32]byte, _verificationData []byte) error {
	return _FastUpdater.Contract.VerifyPublicKey(&_FastUpdater.CallOpts, _voter, _part1, _part2, _verificationData)
}

// VoterRegistry is a free data retrieval call binding the contract method 0xbe60040e.
//
// Solidity: function voterRegistry() view returns(address)
func (_FastUpdater *FastUpdaterCaller) VoterRegistry(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "voterRegistry")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// VoterRegistry is a free data retrieval call binding the contract method 0xbe60040e.
//
// Solidity: function voterRegistry() view returns(address)
func (_FastUpdater *FastUpdaterSession) VoterRegistry() (common.Address, error) {
	return _FastUpdater.Contract.VoterRegistry(&_FastUpdater.CallOpts)
}

// VoterRegistry is a free data retrieval call binding the contract method 0xbe60040e.
//
// Solidity: function voterRegistry() view returns(address)
func (_FastUpdater *FastUpdaterCallerSession) VoterRegistry() (common.Address, error) {
	return _FastUpdater.Contract.VoterRegistry(&_FastUpdater.CallOpts)
}

// VotingEpochDurationSeconds is a free data retrieval call binding the contract method 0x5a832088.
//
// Solidity: function votingEpochDurationSeconds() view returns(uint64)
func (_FastUpdater *FastUpdaterCaller) VotingEpochDurationSeconds(opts *bind.CallOpts) (uint64, error) {
	var out []interface{}
	err := _FastUpdater.contract.Call(opts, &out, "votingEpochDurationSeconds")

	if err != nil {
		return *new(uint64), err
	}

	out0 := *abi.ConvertType(out[0], new(uint64)).(*uint64)

	return out0, err

}

// VotingEpochDurationSeconds is a free data retrieval call binding the contract method 0x5a832088.
//
// Solidity: function votingEpochDurationSeconds() view returns(uint64)
func (_FastUpdater *FastUpdaterSession) VotingEpochDurationSeconds() (uint64, error) {
	return _FastUpdater.Contract.VotingEpochDurationSeconds(&_FastUpdater.CallOpts)
}

// VotingEpochDurationSeconds is a free data retrieval call binding the contract method 0x5a832088.
//
// Solidity: function votingEpochDurationSeconds() view returns(uint64)
func (_FastUpdater *FastUpdaterCallerSession) VotingEpochDurationSeconds() (uint64, error) {
	return _FastUpdater.Contract.VotingEpochDurationSeconds(&_FastUpdater.CallOpts)
}

// CancelGovernanceCall is a paid mutator transaction binding the contract method 0x67fc4029.
//
// Solidity: function cancelGovernanceCall(bytes4 _selector) returns()
func (_FastUpdater *FastUpdaterTransactor) CancelGovernanceCall(opts *bind.TransactOpts, _selector [4]byte) (*types.Transaction, error) {
	return _FastUpdater.contract.Transact(opts, "cancelGovernanceCall", _selector)
}

// CancelGovernanceCall is a paid mutator transaction binding the contract method 0x67fc4029.
//
// Solidity: function cancelGovernanceCall(bytes4 _selector) returns()
func (_FastUpdater *FastUpdaterSession) CancelGovernanceCall(_selector [4]byte) (*types.Transaction, error) {
	return _FastUpdater.Contract.CancelGovernanceCall(&_FastUpdater.TransactOpts, _selector)
}

// CancelGovernanceCall is a paid mutator transaction binding the contract method 0x67fc4029.
//
// Solidity: function cancelGovernanceCall(bytes4 _selector) returns()
func (_FastUpdater *FastUpdaterTransactorSession) CancelGovernanceCall(_selector [4]byte) (*types.Transaction, error) {
	return _FastUpdater.Contract.CancelGovernanceCall(&_FastUpdater.TransactOpts, _selector)
}

// Daemonize is a paid mutator transaction binding the contract method 0x6d0e8c34.
//
// Solidity: function daemonize() returns(bool)
func (_FastUpdater *FastUpdaterTransactor) Daemonize(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FastUpdater.contract.Transact(opts, "daemonize")
}

// Daemonize is a paid mutator transaction binding the contract method 0x6d0e8c34.
//
// Solidity: function daemonize() returns(bool)
func (_FastUpdater *FastUpdaterSession) Daemonize() (*types.Transaction, error) {
	return _FastUpdater.Contract.Daemonize(&_FastUpdater.TransactOpts)
}

// Daemonize is a paid mutator transaction binding the contract method 0x6d0e8c34.
//
// Solidity: function daemonize() returns(bool)
func (_FastUpdater *FastUpdaterTransactorSession) Daemonize() (*types.Transaction, error) {
	return _FastUpdater.Contract.Daemonize(&_FastUpdater.TransactOpts)
}

// ExecuteGovernanceCall is a paid mutator transaction binding the contract method 0x5ff27079.
//
// Solidity: function executeGovernanceCall(bytes4 _selector) returns()
func (_FastUpdater *FastUpdaterTransactor) ExecuteGovernanceCall(opts *bind.TransactOpts, _selector [4]byte) (*types.Transaction, error) {
	return _FastUpdater.contract.Transact(opts, "executeGovernanceCall", _selector)
}

// ExecuteGovernanceCall is a paid mutator transaction binding the contract method 0x5ff27079.
//
// Solidity: function executeGovernanceCall(bytes4 _selector) returns()
func (_FastUpdater *FastUpdaterSession) ExecuteGovernanceCall(_selector [4]byte) (*types.Transaction, error) {
	return _FastUpdater.Contract.ExecuteGovernanceCall(&_FastUpdater.TransactOpts, _selector)
}

// ExecuteGovernanceCall is a paid mutator transaction binding the contract method 0x5ff27079.
//
// Solidity: function executeGovernanceCall(bytes4 _selector) returns()
func (_FastUpdater *FastUpdaterTransactorSession) ExecuteGovernanceCall(_selector [4]byte) (*types.Transaction, error) {
	return _FastUpdater.Contract.ExecuteGovernanceCall(&_FastUpdater.TransactOpts, _selector)
}

// Initialise is a paid mutator transaction binding the contract method 0xef88bf13.
//
// Solidity: function initialise(address _governanceSettings, address _initialGovernance) returns()
func (_FastUpdater *FastUpdaterTransactor) Initialise(opts *bind.TransactOpts, _governanceSettings common.Address, _initialGovernance common.Address) (*types.Transaction, error) {
	return _FastUpdater.contract.Transact(opts, "initialise", _governanceSettings, _initialGovernance)
}

// Initialise is a paid mutator transaction binding the contract method 0xef88bf13.
//
// Solidity: function initialise(address _governanceSettings, address _initialGovernance) returns()
func (_FastUpdater *FastUpdaterSession) Initialise(_governanceSettings common.Address, _initialGovernance common.Address) (*types.Transaction, error) {
	return _FastUpdater.Contract.Initialise(&_FastUpdater.TransactOpts, _governanceSettings, _initialGovernance)
}

// Initialise is a paid mutator transaction binding the contract method 0xef88bf13.
//
// Solidity: function initialise(address _governanceSettings, address _initialGovernance) returns()
func (_FastUpdater *FastUpdaterTransactorSession) Initialise(_governanceSettings common.Address, _initialGovernance common.Address) (*types.Transaction, error) {
	return _FastUpdater.Contract.Initialise(&_FastUpdater.TransactOpts, _governanceSettings, _initialGovernance)
}

// RemoveFeeds is a paid mutator transaction binding the contract method 0xabfaf170.
//
// Solidity: function removeFeeds(uint256[] _indices) returns()
func (_FastUpdater *FastUpdaterTransactor) RemoveFeeds(opts *bind.TransactOpts, _indices []*big.Int) (*types.Transaction, error) {
	return _FastUpdater.contract.Transact(opts, "removeFeeds", _indices)
}

// RemoveFeeds is a paid mutator transaction binding the contract method 0xabfaf170.
//
// Solidity: function removeFeeds(uint256[] _indices) returns()
func (_FastUpdater *FastUpdaterSession) RemoveFeeds(_indices []*big.Int) (*types.Transaction, error) {
	return _FastUpdater.Contract.RemoveFeeds(&_FastUpdater.TransactOpts, _indices)
}

// RemoveFeeds is a paid mutator transaction binding the contract method 0xabfaf170.
//
// Solidity: function removeFeeds(uint256[] _indices) returns()
func (_FastUpdater *FastUpdaterTransactorSession) RemoveFeeds(_indices []*big.Int) (*types.Transaction, error) {
	return _FastUpdater.Contract.RemoveFeeds(&_FastUpdater.TransactOpts, _indices)
}

// ResetFeeds is a paid mutator transaction binding the contract method 0x63f921db.
//
// Solidity: function resetFeeds(uint256[] _indices) returns()
func (_FastUpdater *FastUpdaterTransactor) ResetFeeds(opts *bind.TransactOpts, _indices []*big.Int) (*types.Transaction, error) {
	return _FastUpdater.contract.Transact(opts, "resetFeeds", _indices)
}

// ResetFeeds is a paid mutator transaction binding the contract method 0x63f921db.
//
// Solidity: function resetFeeds(uint256[] _indices) returns()
func (_FastUpdater *FastUpdaterSession) ResetFeeds(_indices []*big.Int) (*types.Transaction, error) {
	return _FastUpdater.Contract.ResetFeeds(&_FastUpdater.TransactOpts, _indices)
}

// ResetFeeds is a paid mutator transaction binding the contract method 0x63f921db.
//
// Solidity: function resetFeeds(uint256[] _indices) returns()
func (_FastUpdater *FastUpdaterTransactorSession) ResetFeeds(_indices []*big.Int) (*types.Transaction, error) {
	return _FastUpdater.Contract.ResetFeeds(&_FastUpdater.TransactOpts, _indices)
}

// SetSubmissionWindow is a paid mutator transaction binding the contract method 0x0a166051.
//
// Solidity: function setSubmissionWindow(uint8 _submissionWindow) returns()
func (_FastUpdater *FastUpdaterTransactor) SetSubmissionWindow(opts *bind.TransactOpts, _submissionWindow uint8) (*types.Transaction, error) {
	return _FastUpdater.contract.Transact(opts, "setSubmissionWindow", _submissionWindow)
}

// SetSubmissionWindow is a paid mutator transaction binding the contract method 0x0a166051.
//
// Solidity: function setSubmissionWindow(uint8 _submissionWindow) returns()
func (_FastUpdater *FastUpdaterSession) SetSubmissionWindow(_submissionWindow uint8) (*types.Transaction, error) {
	return _FastUpdater.Contract.SetSubmissionWindow(&_FastUpdater.TransactOpts, _submissionWindow)
}

// SetSubmissionWindow is a paid mutator transaction binding the contract method 0x0a166051.
//
// Solidity: function setSubmissionWindow(uint8 _submissionWindow) returns()
func (_FastUpdater *FastUpdaterTransactorSession) SetSubmissionWindow(_submissionWindow uint8) (*types.Transaction, error) {
	return _FastUpdater.Contract.SetSubmissionWindow(&_FastUpdater.TransactOpts, _submissionWindow)
}

// SubmitUpdates is a paid mutator transaction binding the contract method 0x470e91df.
//
// Solidity: function submitUpdates((uint256,(uint256,(uint256,uint256),uint256,uint256),bytes,(uint8,bytes32,bytes32)) _updates) returns()
func (_FastUpdater *FastUpdaterTransactor) SubmitUpdates(opts *bind.TransactOpts, _updates IFastUpdaterFastUpdates) (*types.Transaction, error) {
	return _FastUpdater.contract.Transact(opts, "submitUpdates", _updates)
}

// SubmitUpdates is a paid mutator transaction binding the contract method 0x470e91df.
//
// Solidity: function submitUpdates((uint256,(uint256,(uint256,uint256),uint256,uint256),bytes,(uint8,bytes32,bytes32)) _updates) returns()
func (_FastUpdater *FastUpdaterSession) SubmitUpdates(_updates IFastUpdaterFastUpdates) (*types.Transaction, error) {
	return _FastUpdater.Contract.SubmitUpdates(&_FastUpdater.TransactOpts, _updates)
}

// SubmitUpdates is a paid mutator transaction binding the contract method 0x470e91df.
//
// Solidity: function submitUpdates((uint256,(uint256,(uint256,uint256),uint256,uint256),bytes,(uint8,bytes32,bytes32)) _updates) returns()
func (_FastUpdater *FastUpdaterTransactorSession) SubmitUpdates(_updates IFastUpdaterFastUpdates) (*types.Transaction, error) {
	return _FastUpdater.Contract.SubmitUpdates(&_FastUpdater.TransactOpts, _updates)
}

// SwitchToProductionMode is a paid mutator transaction binding the contract method 0xf5a98383.
//
// Solidity: function switchToProductionMode() returns()
func (_FastUpdater *FastUpdaterTransactor) SwitchToProductionMode(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FastUpdater.contract.Transact(opts, "switchToProductionMode")
}

// SwitchToProductionMode is a paid mutator transaction binding the contract method 0xf5a98383.
//
// Solidity: function switchToProductionMode() returns()
func (_FastUpdater *FastUpdaterSession) SwitchToProductionMode() (*types.Transaction, error) {
	return _FastUpdater.Contract.SwitchToProductionMode(&_FastUpdater.TransactOpts)
}

// SwitchToProductionMode is a paid mutator transaction binding the contract method 0xf5a98383.
//
// Solidity: function switchToProductionMode() returns()
func (_FastUpdater *FastUpdaterTransactorSession) SwitchToProductionMode() (*types.Transaction, error) {
	return _FastUpdater.Contract.SwitchToProductionMode(&_FastUpdater.TransactOpts)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_FastUpdater *FastUpdaterTransactor) UpdateContractAddresses(opts *bind.TransactOpts, _contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _FastUpdater.contract.Transact(opts, "updateContractAddresses", _contractNameHashes, _contractAddresses)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_FastUpdater *FastUpdaterSession) UpdateContractAddresses(_contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _FastUpdater.Contract.UpdateContractAddresses(&_FastUpdater.TransactOpts, _contractNameHashes, _contractAddresses)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_FastUpdater *FastUpdaterTransactorSession) UpdateContractAddresses(_contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _FastUpdater.Contract.UpdateContractAddresses(&_FastUpdater.TransactOpts, _contractNameHashes, _contractAddresses)
}

// FastUpdaterFastUpdateFeedRemovedIterator is returned from FilterFastUpdateFeedRemoved and is used to iterate over the raw logs and unpacked data for FastUpdateFeedRemoved events raised by the FastUpdater contract.
type FastUpdaterFastUpdateFeedRemovedIterator struct {
	Event *FastUpdaterFastUpdateFeedRemoved // Event containing the contract specifics and raw log

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
func (it *FastUpdaterFastUpdateFeedRemovedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdaterFastUpdateFeedRemoved)
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
		it.Event = new(FastUpdaterFastUpdateFeedRemoved)
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
func (it *FastUpdaterFastUpdateFeedRemovedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdaterFastUpdateFeedRemovedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdaterFastUpdateFeedRemoved represents a FastUpdateFeedRemoved event raised by the FastUpdater contract.
type FastUpdaterFastUpdateFeedRemoved struct {
	Index *big.Int
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterFastUpdateFeedRemoved is a free log retrieval operation binding the contract event 0x5a17f564b9fd53c971695a2e033e0cd39ee8ad08d8117242cdecad8b017335c8.
//
// Solidity: event FastUpdateFeedRemoved(uint256 indexed index)
func (_FastUpdater *FastUpdaterFilterer) FilterFastUpdateFeedRemoved(opts *bind.FilterOpts, index []*big.Int) (*FastUpdaterFastUpdateFeedRemovedIterator, error) {

	var indexRule []interface{}
	for _, indexItem := range index {
		indexRule = append(indexRule, indexItem)
	}

	logs, sub, err := _FastUpdater.contract.FilterLogs(opts, "FastUpdateFeedRemoved", indexRule)
	if err != nil {
		return nil, err
	}
	return &FastUpdaterFastUpdateFeedRemovedIterator{contract: _FastUpdater.contract, event: "FastUpdateFeedRemoved", logs: logs, sub: sub}, nil
}

// WatchFastUpdateFeedRemoved is a free log subscription operation binding the contract event 0x5a17f564b9fd53c971695a2e033e0cd39ee8ad08d8117242cdecad8b017335c8.
//
// Solidity: event FastUpdateFeedRemoved(uint256 indexed index)
func (_FastUpdater *FastUpdaterFilterer) WatchFastUpdateFeedRemoved(opts *bind.WatchOpts, sink chan<- *FastUpdaterFastUpdateFeedRemoved, index []*big.Int) (event.Subscription, error) {

	var indexRule []interface{}
	for _, indexItem := range index {
		indexRule = append(indexRule, indexItem)
	}

	logs, sub, err := _FastUpdater.contract.WatchLogs(opts, "FastUpdateFeedRemoved", indexRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdaterFastUpdateFeedRemoved)
				if err := _FastUpdater.contract.UnpackLog(event, "FastUpdateFeedRemoved", log); err != nil {
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

// ParseFastUpdateFeedRemoved is a log parse operation binding the contract event 0x5a17f564b9fd53c971695a2e033e0cd39ee8ad08d8117242cdecad8b017335c8.
//
// Solidity: event FastUpdateFeedRemoved(uint256 indexed index)
func (_FastUpdater *FastUpdaterFilterer) ParseFastUpdateFeedRemoved(log types.Log) (*FastUpdaterFastUpdateFeedRemoved, error) {
	event := new(FastUpdaterFastUpdateFeedRemoved)
	if err := _FastUpdater.contract.UnpackLog(event, "FastUpdateFeedRemoved", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdaterFastUpdateFeedResetIterator is returned from FilterFastUpdateFeedReset and is used to iterate over the raw logs and unpacked data for FastUpdateFeedReset events raised by the FastUpdater contract.
type FastUpdaterFastUpdateFeedResetIterator struct {
	Event *FastUpdaterFastUpdateFeedReset // Event containing the contract specifics and raw log

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
func (it *FastUpdaterFastUpdateFeedResetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdaterFastUpdateFeedReset)
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
		it.Event = new(FastUpdaterFastUpdateFeedReset)
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
func (it *FastUpdaterFastUpdateFeedResetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdaterFastUpdateFeedResetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdaterFastUpdateFeedReset represents a FastUpdateFeedReset event raised by the FastUpdater contract.
type FastUpdaterFastUpdateFeedReset struct {
	VotingRoundId *big.Int
	Index         *big.Int
	Id            [21]byte
	Value         *big.Int
	Decimals      int8
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterFastUpdateFeedReset is a free log retrieval operation binding the contract event 0xfa800fadb5e7b72652da40bcd7ca9a96cd4e53c9ea4c68b8afbba027e77a7cf5.
//
// Solidity: event FastUpdateFeedReset(uint256 indexed votingRoundId, uint256 indexed index, bytes21 indexed id, uint256 value, int8 decimals)
func (_FastUpdater *FastUpdaterFilterer) FilterFastUpdateFeedReset(opts *bind.FilterOpts, votingRoundId []*big.Int, index []*big.Int, id [][21]byte) (*FastUpdaterFastUpdateFeedResetIterator, error) {

	var votingRoundIdRule []interface{}
	for _, votingRoundIdItem := range votingRoundId {
		votingRoundIdRule = append(votingRoundIdRule, votingRoundIdItem)
	}
	var indexRule []interface{}
	for _, indexItem := range index {
		indexRule = append(indexRule, indexItem)
	}
	var idRule []interface{}
	for _, idItem := range id {
		idRule = append(idRule, idItem)
	}

	logs, sub, err := _FastUpdater.contract.FilterLogs(opts, "FastUpdateFeedReset", votingRoundIdRule, indexRule, idRule)
	if err != nil {
		return nil, err
	}
	return &FastUpdaterFastUpdateFeedResetIterator{contract: _FastUpdater.contract, event: "FastUpdateFeedReset", logs: logs, sub: sub}, nil
}

// WatchFastUpdateFeedReset is a free log subscription operation binding the contract event 0xfa800fadb5e7b72652da40bcd7ca9a96cd4e53c9ea4c68b8afbba027e77a7cf5.
//
// Solidity: event FastUpdateFeedReset(uint256 indexed votingRoundId, uint256 indexed index, bytes21 indexed id, uint256 value, int8 decimals)
func (_FastUpdater *FastUpdaterFilterer) WatchFastUpdateFeedReset(opts *bind.WatchOpts, sink chan<- *FastUpdaterFastUpdateFeedReset, votingRoundId []*big.Int, index []*big.Int, id [][21]byte) (event.Subscription, error) {

	var votingRoundIdRule []interface{}
	for _, votingRoundIdItem := range votingRoundId {
		votingRoundIdRule = append(votingRoundIdRule, votingRoundIdItem)
	}
	var indexRule []interface{}
	for _, indexItem := range index {
		indexRule = append(indexRule, indexItem)
	}
	var idRule []interface{}
	for _, idItem := range id {
		idRule = append(idRule, idItem)
	}

	logs, sub, err := _FastUpdater.contract.WatchLogs(opts, "FastUpdateFeedReset", votingRoundIdRule, indexRule, idRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdaterFastUpdateFeedReset)
				if err := _FastUpdater.contract.UnpackLog(event, "FastUpdateFeedReset", log); err != nil {
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

// ParseFastUpdateFeedReset is a log parse operation binding the contract event 0xfa800fadb5e7b72652da40bcd7ca9a96cd4e53c9ea4c68b8afbba027e77a7cf5.
//
// Solidity: event FastUpdateFeedReset(uint256 indexed votingRoundId, uint256 indexed index, bytes21 indexed id, uint256 value, int8 decimals)
func (_FastUpdater *FastUpdaterFilterer) ParseFastUpdateFeedReset(log types.Log) (*FastUpdaterFastUpdateFeedReset, error) {
	event := new(FastUpdaterFastUpdateFeedReset)
	if err := _FastUpdater.contract.UnpackLog(event, "FastUpdateFeedReset", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdaterFastUpdateFeedsIterator is returned from FilterFastUpdateFeeds and is used to iterate over the raw logs and unpacked data for FastUpdateFeeds events raised by the FastUpdater contract.
type FastUpdaterFastUpdateFeedsIterator struct {
	Event *FastUpdaterFastUpdateFeeds // Event containing the contract specifics and raw log

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
func (it *FastUpdaterFastUpdateFeedsIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdaterFastUpdateFeeds)
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
		it.Event = new(FastUpdaterFastUpdateFeeds)
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
func (it *FastUpdaterFastUpdateFeedsIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdaterFastUpdateFeedsIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdaterFastUpdateFeeds represents a FastUpdateFeeds event raised by the FastUpdater contract.
type FastUpdaterFastUpdateFeeds struct {
	VotingEpochId *big.Int
	Feeds         []*big.Int
	Decimals      []int8
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterFastUpdateFeeds is a free log retrieval operation binding the contract event 0x7195d3bbca575b55b0f4b62da395f7224b75225d9c08741d216e6cf10a83eabe.
//
// Solidity: event FastUpdateFeeds(uint256 indexed votingEpochId, uint256[] feeds, int8[] decimals)
func (_FastUpdater *FastUpdaterFilterer) FilterFastUpdateFeeds(opts *bind.FilterOpts, votingEpochId []*big.Int) (*FastUpdaterFastUpdateFeedsIterator, error) {

	var votingEpochIdRule []interface{}
	for _, votingEpochIdItem := range votingEpochId {
		votingEpochIdRule = append(votingEpochIdRule, votingEpochIdItem)
	}

	logs, sub, err := _FastUpdater.contract.FilterLogs(opts, "FastUpdateFeeds", votingEpochIdRule)
	if err != nil {
		return nil, err
	}
	return &FastUpdaterFastUpdateFeedsIterator{contract: _FastUpdater.contract, event: "FastUpdateFeeds", logs: logs, sub: sub}, nil
}

// WatchFastUpdateFeeds is a free log subscription operation binding the contract event 0x7195d3bbca575b55b0f4b62da395f7224b75225d9c08741d216e6cf10a83eabe.
//
// Solidity: event FastUpdateFeeds(uint256 indexed votingEpochId, uint256[] feeds, int8[] decimals)
func (_FastUpdater *FastUpdaterFilterer) WatchFastUpdateFeeds(opts *bind.WatchOpts, sink chan<- *FastUpdaterFastUpdateFeeds, votingEpochId []*big.Int) (event.Subscription, error) {

	var votingEpochIdRule []interface{}
	for _, votingEpochIdItem := range votingEpochId {
		votingEpochIdRule = append(votingEpochIdRule, votingEpochIdItem)
	}

	logs, sub, err := _FastUpdater.contract.WatchLogs(opts, "FastUpdateFeeds", votingEpochIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdaterFastUpdateFeeds)
				if err := _FastUpdater.contract.UnpackLog(event, "FastUpdateFeeds", log); err != nil {
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

// ParseFastUpdateFeeds is a log parse operation binding the contract event 0x7195d3bbca575b55b0f4b62da395f7224b75225d9c08741d216e6cf10a83eabe.
//
// Solidity: event FastUpdateFeeds(uint256 indexed votingEpochId, uint256[] feeds, int8[] decimals)
func (_FastUpdater *FastUpdaterFilterer) ParseFastUpdateFeeds(log types.Log) (*FastUpdaterFastUpdateFeeds, error) {
	event := new(FastUpdaterFastUpdateFeeds)
	if err := _FastUpdater.contract.UnpackLog(event, "FastUpdateFeeds", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdaterFastUpdateFeedsSubmittedIterator is returned from FilterFastUpdateFeedsSubmitted and is used to iterate over the raw logs and unpacked data for FastUpdateFeedsSubmitted events raised by the FastUpdater contract.
type FastUpdaterFastUpdateFeedsSubmittedIterator struct {
	Event *FastUpdaterFastUpdateFeedsSubmitted // Event containing the contract specifics and raw log

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
func (it *FastUpdaterFastUpdateFeedsSubmittedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdaterFastUpdateFeedsSubmitted)
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
		it.Event = new(FastUpdaterFastUpdateFeedsSubmitted)
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
func (it *FastUpdaterFastUpdateFeedsSubmittedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdaterFastUpdateFeedsSubmittedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdaterFastUpdateFeedsSubmitted represents a FastUpdateFeedsSubmitted event raised by the FastUpdater contract.
type FastUpdaterFastUpdateFeedsSubmitted struct {
	VotingRoundId        uint32
	SigningPolicyAddress common.Address
	Raw                  types.Log // Blockchain specific contextual infos
}

// FilterFastUpdateFeedsSubmitted is a free log retrieval operation binding the contract event 0x63db91b14b3d088c677f046180aefcea7a236649704d90ce810cde455d38d936.
//
// Solidity: event FastUpdateFeedsSubmitted(uint32 indexed votingRoundId, address indexed signingPolicyAddress)
func (_FastUpdater *FastUpdaterFilterer) FilterFastUpdateFeedsSubmitted(opts *bind.FilterOpts, votingRoundId []uint32, signingPolicyAddress []common.Address) (*FastUpdaterFastUpdateFeedsSubmittedIterator, error) {

	var votingRoundIdRule []interface{}
	for _, votingRoundIdItem := range votingRoundId {
		votingRoundIdRule = append(votingRoundIdRule, votingRoundIdItem)
	}
	var signingPolicyAddressRule []interface{}
	for _, signingPolicyAddressItem := range signingPolicyAddress {
		signingPolicyAddressRule = append(signingPolicyAddressRule, signingPolicyAddressItem)
	}

	logs, sub, err := _FastUpdater.contract.FilterLogs(opts, "FastUpdateFeedsSubmitted", votingRoundIdRule, signingPolicyAddressRule)
	if err != nil {
		return nil, err
	}
	return &FastUpdaterFastUpdateFeedsSubmittedIterator{contract: _FastUpdater.contract, event: "FastUpdateFeedsSubmitted", logs: logs, sub: sub}, nil
}

// WatchFastUpdateFeedsSubmitted is a free log subscription operation binding the contract event 0x63db91b14b3d088c677f046180aefcea7a236649704d90ce810cde455d38d936.
//
// Solidity: event FastUpdateFeedsSubmitted(uint32 indexed votingRoundId, address indexed signingPolicyAddress)
func (_FastUpdater *FastUpdaterFilterer) WatchFastUpdateFeedsSubmitted(opts *bind.WatchOpts, sink chan<- *FastUpdaterFastUpdateFeedsSubmitted, votingRoundId []uint32, signingPolicyAddress []common.Address) (event.Subscription, error) {

	var votingRoundIdRule []interface{}
	for _, votingRoundIdItem := range votingRoundId {
		votingRoundIdRule = append(votingRoundIdRule, votingRoundIdItem)
	}
	var signingPolicyAddressRule []interface{}
	for _, signingPolicyAddressItem := range signingPolicyAddress {
		signingPolicyAddressRule = append(signingPolicyAddressRule, signingPolicyAddressItem)
	}

	logs, sub, err := _FastUpdater.contract.WatchLogs(opts, "FastUpdateFeedsSubmitted", votingRoundIdRule, signingPolicyAddressRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdaterFastUpdateFeedsSubmitted)
				if err := _FastUpdater.contract.UnpackLog(event, "FastUpdateFeedsSubmitted", log); err != nil {
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

// ParseFastUpdateFeedsSubmitted is a log parse operation binding the contract event 0x63db91b14b3d088c677f046180aefcea7a236649704d90ce810cde455d38d936.
//
// Solidity: event FastUpdateFeedsSubmitted(uint32 indexed votingRoundId, address indexed signingPolicyAddress)
func (_FastUpdater *FastUpdaterFilterer) ParseFastUpdateFeedsSubmitted(log types.Log) (*FastUpdaterFastUpdateFeedsSubmitted, error) {
	event := new(FastUpdaterFastUpdateFeedsSubmitted)
	if err := _FastUpdater.contract.UnpackLog(event, "FastUpdateFeedsSubmitted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdaterGovernanceCallTimelockedIterator is returned from FilterGovernanceCallTimelocked and is used to iterate over the raw logs and unpacked data for GovernanceCallTimelocked events raised by the FastUpdater contract.
type FastUpdaterGovernanceCallTimelockedIterator struct {
	Event *FastUpdaterGovernanceCallTimelocked // Event containing the contract specifics and raw log

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
func (it *FastUpdaterGovernanceCallTimelockedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdaterGovernanceCallTimelocked)
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
		it.Event = new(FastUpdaterGovernanceCallTimelocked)
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
func (it *FastUpdaterGovernanceCallTimelockedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdaterGovernanceCallTimelockedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdaterGovernanceCallTimelocked represents a GovernanceCallTimelocked event raised by the FastUpdater contract.
type FastUpdaterGovernanceCallTimelocked struct {
	Selector              [4]byte
	AllowedAfterTimestamp *big.Int
	EncodedCall           []byte
	Raw                   types.Log // Blockchain specific contextual infos
}

// FilterGovernanceCallTimelocked is a free log retrieval operation binding the contract event 0xed948300a3694aa01d4a6b258bfd664350193d770c0b51f8387277f6d83ea3b6.
//
// Solidity: event GovernanceCallTimelocked(bytes4 selector, uint256 allowedAfterTimestamp, bytes encodedCall)
func (_FastUpdater *FastUpdaterFilterer) FilterGovernanceCallTimelocked(opts *bind.FilterOpts) (*FastUpdaterGovernanceCallTimelockedIterator, error) {

	logs, sub, err := _FastUpdater.contract.FilterLogs(opts, "GovernanceCallTimelocked")
	if err != nil {
		return nil, err
	}
	return &FastUpdaterGovernanceCallTimelockedIterator{contract: _FastUpdater.contract, event: "GovernanceCallTimelocked", logs: logs, sub: sub}, nil
}

// WatchGovernanceCallTimelocked is a free log subscription operation binding the contract event 0xed948300a3694aa01d4a6b258bfd664350193d770c0b51f8387277f6d83ea3b6.
//
// Solidity: event GovernanceCallTimelocked(bytes4 selector, uint256 allowedAfterTimestamp, bytes encodedCall)
func (_FastUpdater *FastUpdaterFilterer) WatchGovernanceCallTimelocked(opts *bind.WatchOpts, sink chan<- *FastUpdaterGovernanceCallTimelocked) (event.Subscription, error) {

	logs, sub, err := _FastUpdater.contract.WatchLogs(opts, "GovernanceCallTimelocked")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdaterGovernanceCallTimelocked)
				if err := _FastUpdater.contract.UnpackLog(event, "GovernanceCallTimelocked", log); err != nil {
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
func (_FastUpdater *FastUpdaterFilterer) ParseGovernanceCallTimelocked(log types.Log) (*FastUpdaterGovernanceCallTimelocked, error) {
	event := new(FastUpdaterGovernanceCallTimelocked)
	if err := _FastUpdater.contract.UnpackLog(event, "GovernanceCallTimelocked", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdaterGovernanceInitialisedIterator is returned from FilterGovernanceInitialised and is used to iterate over the raw logs and unpacked data for GovernanceInitialised events raised by the FastUpdater contract.
type FastUpdaterGovernanceInitialisedIterator struct {
	Event *FastUpdaterGovernanceInitialised // Event containing the contract specifics and raw log

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
func (it *FastUpdaterGovernanceInitialisedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdaterGovernanceInitialised)
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
		it.Event = new(FastUpdaterGovernanceInitialised)
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
func (it *FastUpdaterGovernanceInitialisedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdaterGovernanceInitialisedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdaterGovernanceInitialised represents a GovernanceInitialised event raised by the FastUpdater contract.
type FastUpdaterGovernanceInitialised struct {
	InitialGovernance common.Address
	Raw               types.Log // Blockchain specific contextual infos
}

// FilterGovernanceInitialised is a free log retrieval operation binding the contract event 0x9789733827840833afc031fb2ef9ab6894271f77bad2085687cf4ae5c7bee4db.
//
// Solidity: event GovernanceInitialised(address initialGovernance)
func (_FastUpdater *FastUpdaterFilterer) FilterGovernanceInitialised(opts *bind.FilterOpts) (*FastUpdaterGovernanceInitialisedIterator, error) {

	logs, sub, err := _FastUpdater.contract.FilterLogs(opts, "GovernanceInitialised")
	if err != nil {
		return nil, err
	}
	return &FastUpdaterGovernanceInitialisedIterator{contract: _FastUpdater.contract, event: "GovernanceInitialised", logs: logs, sub: sub}, nil
}

// WatchGovernanceInitialised is a free log subscription operation binding the contract event 0x9789733827840833afc031fb2ef9ab6894271f77bad2085687cf4ae5c7bee4db.
//
// Solidity: event GovernanceInitialised(address initialGovernance)
func (_FastUpdater *FastUpdaterFilterer) WatchGovernanceInitialised(opts *bind.WatchOpts, sink chan<- *FastUpdaterGovernanceInitialised) (event.Subscription, error) {

	logs, sub, err := _FastUpdater.contract.WatchLogs(opts, "GovernanceInitialised")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdaterGovernanceInitialised)
				if err := _FastUpdater.contract.UnpackLog(event, "GovernanceInitialised", log); err != nil {
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
func (_FastUpdater *FastUpdaterFilterer) ParseGovernanceInitialised(log types.Log) (*FastUpdaterGovernanceInitialised, error) {
	event := new(FastUpdaterGovernanceInitialised)
	if err := _FastUpdater.contract.UnpackLog(event, "GovernanceInitialised", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdaterGovernedProductionModeEnteredIterator is returned from FilterGovernedProductionModeEntered and is used to iterate over the raw logs and unpacked data for GovernedProductionModeEntered events raised by the FastUpdater contract.
type FastUpdaterGovernedProductionModeEnteredIterator struct {
	Event *FastUpdaterGovernedProductionModeEntered // Event containing the contract specifics and raw log

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
func (it *FastUpdaterGovernedProductionModeEnteredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdaterGovernedProductionModeEntered)
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
		it.Event = new(FastUpdaterGovernedProductionModeEntered)
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
func (it *FastUpdaterGovernedProductionModeEnteredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdaterGovernedProductionModeEnteredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdaterGovernedProductionModeEntered represents a GovernedProductionModeEntered event raised by the FastUpdater contract.
type FastUpdaterGovernedProductionModeEntered struct {
	GovernanceSettings common.Address
	Raw                types.Log // Blockchain specific contextual infos
}

// FilterGovernedProductionModeEntered is a free log retrieval operation binding the contract event 0x83af113638b5422f9e977cebc0aaf0eaf2188eb9a8baae7f9d46c42b33a1560c.
//
// Solidity: event GovernedProductionModeEntered(address governanceSettings)
func (_FastUpdater *FastUpdaterFilterer) FilterGovernedProductionModeEntered(opts *bind.FilterOpts) (*FastUpdaterGovernedProductionModeEnteredIterator, error) {

	logs, sub, err := _FastUpdater.contract.FilterLogs(opts, "GovernedProductionModeEntered")
	if err != nil {
		return nil, err
	}
	return &FastUpdaterGovernedProductionModeEnteredIterator{contract: _FastUpdater.contract, event: "GovernedProductionModeEntered", logs: logs, sub: sub}, nil
}

// WatchGovernedProductionModeEntered is a free log subscription operation binding the contract event 0x83af113638b5422f9e977cebc0aaf0eaf2188eb9a8baae7f9d46c42b33a1560c.
//
// Solidity: event GovernedProductionModeEntered(address governanceSettings)
func (_FastUpdater *FastUpdaterFilterer) WatchGovernedProductionModeEntered(opts *bind.WatchOpts, sink chan<- *FastUpdaterGovernedProductionModeEntered) (event.Subscription, error) {

	logs, sub, err := _FastUpdater.contract.WatchLogs(opts, "GovernedProductionModeEntered")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdaterGovernedProductionModeEntered)
				if err := _FastUpdater.contract.UnpackLog(event, "GovernedProductionModeEntered", log); err != nil {
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
func (_FastUpdater *FastUpdaterFilterer) ParseGovernedProductionModeEntered(log types.Log) (*FastUpdaterGovernedProductionModeEntered, error) {
	event := new(FastUpdaterGovernedProductionModeEntered)
	if err := _FastUpdater.contract.UnpackLog(event, "GovernedProductionModeEntered", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdaterTimelockedGovernanceCallCanceledIterator is returned from FilterTimelockedGovernanceCallCanceled and is used to iterate over the raw logs and unpacked data for TimelockedGovernanceCallCanceled events raised by the FastUpdater contract.
type FastUpdaterTimelockedGovernanceCallCanceledIterator struct {
	Event *FastUpdaterTimelockedGovernanceCallCanceled // Event containing the contract specifics and raw log

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
func (it *FastUpdaterTimelockedGovernanceCallCanceledIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdaterTimelockedGovernanceCallCanceled)
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
		it.Event = new(FastUpdaterTimelockedGovernanceCallCanceled)
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
func (it *FastUpdaterTimelockedGovernanceCallCanceledIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdaterTimelockedGovernanceCallCanceledIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdaterTimelockedGovernanceCallCanceled represents a TimelockedGovernanceCallCanceled event raised by the FastUpdater contract.
type FastUpdaterTimelockedGovernanceCallCanceled struct {
	Selector  [4]byte
	Timestamp *big.Int
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterTimelockedGovernanceCallCanceled is a free log retrieval operation binding the contract event 0x7735b2391c38a81419c513e30ca578db7158eadd7101511b23e221c654d19cf8.
//
// Solidity: event TimelockedGovernanceCallCanceled(bytes4 selector, uint256 timestamp)
func (_FastUpdater *FastUpdaterFilterer) FilterTimelockedGovernanceCallCanceled(opts *bind.FilterOpts) (*FastUpdaterTimelockedGovernanceCallCanceledIterator, error) {

	logs, sub, err := _FastUpdater.contract.FilterLogs(opts, "TimelockedGovernanceCallCanceled")
	if err != nil {
		return nil, err
	}
	return &FastUpdaterTimelockedGovernanceCallCanceledIterator{contract: _FastUpdater.contract, event: "TimelockedGovernanceCallCanceled", logs: logs, sub: sub}, nil
}

// WatchTimelockedGovernanceCallCanceled is a free log subscription operation binding the contract event 0x7735b2391c38a81419c513e30ca578db7158eadd7101511b23e221c654d19cf8.
//
// Solidity: event TimelockedGovernanceCallCanceled(bytes4 selector, uint256 timestamp)
func (_FastUpdater *FastUpdaterFilterer) WatchTimelockedGovernanceCallCanceled(opts *bind.WatchOpts, sink chan<- *FastUpdaterTimelockedGovernanceCallCanceled) (event.Subscription, error) {

	logs, sub, err := _FastUpdater.contract.WatchLogs(opts, "TimelockedGovernanceCallCanceled")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdaterTimelockedGovernanceCallCanceled)
				if err := _FastUpdater.contract.UnpackLog(event, "TimelockedGovernanceCallCanceled", log); err != nil {
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
func (_FastUpdater *FastUpdaterFilterer) ParseTimelockedGovernanceCallCanceled(log types.Log) (*FastUpdaterTimelockedGovernanceCallCanceled, error) {
	event := new(FastUpdaterTimelockedGovernanceCallCanceled)
	if err := _FastUpdater.contract.UnpackLog(event, "TimelockedGovernanceCallCanceled", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdaterTimelockedGovernanceCallExecutedIterator is returned from FilterTimelockedGovernanceCallExecuted and is used to iterate over the raw logs and unpacked data for TimelockedGovernanceCallExecuted events raised by the FastUpdater contract.
type FastUpdaterTimelockedGovernanceCallExecutedIterator struct {
	Event *FastUpdaterTimelockedGovernanceCallExecuted // Event containing the contract specifics and raw log

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
func (it *FastUpdaterTimelockedGovernanceCallExecutedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdaterTimelockedGovernanceCallExecuted)
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
		it.Event = new(FastUpdaterTimelockedGovernanceCallExecuted)
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
func (it *FastUpdaterTimelockedGovernanceCallExecutedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdaterTimelockedGovernanceCallExecutedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdaterTimelockedGovernanceCallExecuted represents a TimelockedGovernanceCallExecuted event raised by the FastUpdater contract.
type FastUpdaterTimelockedGovernanceCallExecuted struct {
	Selector  [4]byte
	Timestamp *big.Int
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterTimelockedGovernanceCallExecuted is a free log retrieval operation binding the contract event 0xa7326b57fc9cfe267aaea5e7f0b01757154d265620a0585819416ee9ddd2c438.
//
// Solidity: event TimelockedGovernanceCallExecuted(bytes4 selector, uint256 timestamp)
func (_FastUpdater *FastUpdaterFilterer) FilterTimelockedGovernanceCallExecuted(opts *bind.FilterOpts) (*FastUpdaterTimelockedGovernanceCallExecutedIterator, error) {

	logs, sub, err := _FastUpdater.contract.FilterLogs(opts, "TimelockedGovernanceCallExecuted")
	if err != nil {
		return nil, err
	}
	return &FastUpdaterTimelockedGovernanceCallExecutedIterator{contract: _FastUpdater.contract, event: "TimelockedGovernanceCallExecuted", logs: logs, sub: sub}, nil
}

// WatchTimelockedGovernanceCallExecuted is a free log subscription operation binding the contract event 0xa7326b57fc9cfe267aaea5e7f0b01757154d265620a0585819416ee9ddd2c438.
//
// Solidity: event TimelockedGovernanceCallExecuted(bytes4 selector, uint256 timestamp)
func (_FastUpdater *FastUpdaterFilterer) WatchTimelockedGovernanceCallExecuted(opts *bind.WatchOpts, sink chan<- *FastUpdaterTimelockedGovernanceCallExecuted) (event.Subscription, error) {

	logs, sub, err := _FastUpdater.contract.WatchLogs(opts, "TimelockedGovernanceCallExecuted")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdaterTimelockedGovernanceCallExecuted)
				if err := _FastUpdater.contract.UnpackLog(event, "TimelockedGovernanceCallExecuted", log); err != nil {
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
func (_FastUpdater *FastUpdaterFilterer) ParseTimelockedGovernanceCallExecuted(log types.Log) (*FastUpdaterTimelockedGovernanceCallExecuted, error) {
	event := new(FastUpdaterTimelockedGovernanceCallExecuted)
	if err := _FastUpdater.contract.UnpackLog(event, "TimelockedGovernanceCallExecuted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
