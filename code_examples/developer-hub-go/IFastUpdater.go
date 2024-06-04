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

// IFastUpdaterMetaData contains all meta data concerning the IFastUpdater contract.
var IFastUpdaterMetaData = &bind.MetaData{
	ABI: "[{\"type\":\"constructor\",\"stateMutability\":\"nonpayable\",\"inputs\":[{\"type\":\"address\",\"name\":\"_governanceSettings\",\"internalType\":\"contractIGovernanceSettings\"},{\"type\":\"address\",\"name\":\"_initialGovernance\",\"internalType\":\"address\"},{\"type\":\"address\",\"name\":\"_addressUpdater\",\"internalType\":\"address\"},{\"type\":\"address\",\"name\":\"_flareDaemon\",\"internalType\":\"address\"},{\"type\":\"uint32\",\"name\":\"_firstVotingRoundStartTs\",\"internalType\":\"uint32\"},{\"type\":\"uint8\",\"name\":\"_votingEpochDurationSeconds\",\"internalType\":\"uint8\"},{\"type\":\"uint8\",\"name\":\"_submissionWindow\",\"internalType\":\"uint8\"}]},{\"type\":\"error\",\"name\":\"ECDSAInvalidSignature\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"ECDSAInvalidSignatureLength\",\"inputs\":[{\"type\":\"uint256\",\"name\":\"length\",\"internalType\":\"uint256\"}]},{\"type\":\"error\",\"name\":\"ECDSAInvalidSignatureS\",\"inputs\":[{\"type\":\"bytes32\",\"name\":\"s\",\"internalType\":\"bytes32\"}]},{\"type\":\"event\",\"name\":\"FastUpdateFeedRemoved\",\"inputs\":[{\"type\":\"uint256\",\"name\":\"index\",\"internalType\":\"uint256\",\"indexed\":true}],\"anonymous\":false},{\"type\":\"event\",\"name\":\"FastUpdateFeedReset\",\"inputs\":[{\"type\":\"uint256\",\"name\":\"votingRoundId\",\"internalType\":\"uint256\",\"indexed\":true},{\"type\":\"uint256\",\"name\":\"index\",\"internalType\":\"uint256\",\"indexed\":true},{\"type\":\"bytes21\",\"name\":\"id\",\"internalType\":\"bytes21\",\"indexed\":true},{\"type\":\"uint256\",\"name\":\"value\",\"internalType\":\"uint256\",\"indexed\":false},{\"type\":\"int8\",\"name\":\"decimals\",\"internalType\":\"int8\",\"indexed\":false}],\"anonymous\":false},{\"type\":\"event\",\"name\":\"FastUpdateFeeds\",\"inputs\":[{\"type\":\"uint256\",\"name\":\"votingEpochId\",\"internalType\":\"uint256\",\"indexed\":true},{\"type\":\"uint256[]\",\"name\":\"feeds\",\"internalType\":\"uint256[]\",\"indexed\":false},{\"type\":\"int8[]\",\"name\":\"decimals\",\"internalType\":\"int8[]\",\"indexed\":false}],\"anonymous\":false},{\"type\":\"event\",\"name\":\"FastUpdateFeedsSubmitted\",\"inputs\":[{\"type\":\"uint32\",\"name\":\"votingRoundId\",\"internalType\":\"uint32\",\"indexed\":true},{\"type\":\"address\",\"name\":\"signingPolicyAddress\",\"internalType\":\"address\",\"indexed\":true}],\"anonymous\":false},{\"type\":\"event\",\"name\":\"GovernanceCallTimelocked\",\"inputs\":[{\"type\":\"bytes4\",\"name\":\"selector\",\"internalType\":\"bytes4\",\"indexed\":false},{\"type\":\"uint256\",\"name\":\"allowedAfterTimestamp\",\"internalType\":\"uint256\",\"indexed\":false},{\"type\":\"bytes\",\"name\":\"encodedCall\",\"internalType\":\"bytes\",\"indexed\":false}],\"anonymous\":false},{\"type\":\"event\",\"name\":\"GovernanceInitialised\",\"inputs\":[{\"type\":\"address\",\"name\":\"initialGovernance\",\"internalType\":\"address\",\"indexed\":false}],\"anonymous\":false},{\"type\":\"event\",\"name\":\"GovernedProductionModeEntered\",\"inputs\":[{\"type\":\"address\",\"name\":\"governanceSettings\",\"internalType\":\"address\",\"indexed\":false}],\"anonymous\":false},{\"type\":\"event\",\"name\":\"TimelockedGovernanceCallCanceled\",\"inputs\":[{\"type\":\"bytes4\",\"name\":\"selector\",\"internalType\":\"bytes4\",\"indexed\":false},{\"type\":\"uint256\",\"name\":\"timestamp\",\"internalType\":\"uint256\",\"indexed\":false}],\"anonymous\":false},{\"type\":\"event\",\"name\":\"TimelockedGovernanceCallExecuted\",\"inputs\":[{\"type\":\"bytes4\",\"name\":\"selector\",\"internalType\":\"bytes4\",\"indexed\":false},{\"type\":\"uint256\",\"name\":\"timestamp\",\"internalType\":\"uint256\",\"indexed\":false}],\"anonymous\":false},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"uint256\",\"name\":\"\",\"internalType\":\"uint256\"}],\"name\":\"MAX_BLOCKS_HISTORY\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"uint256\",\"name\":\"\",\"internalType\":\"uint256\"}],\"name\":\"MAX_FEED_AGE_IN_VOTING_EPOCHS\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"uint256\",\"name\":\"_cutoff\",\"internalType\":\"uint256\"}],\"name\":\"blockScoreCutoff\",\"inputs\":[{\"type\":\"uint256\",\"name\":\"_blockNum\",\"internalType\":\"uint256\"}]},{\"type\":\"function\",\"stateMutability\":\"nonpayable\",\"outputs\":[],\"name\":\"cancelGovernanceCall\",\"inputs\":[{\"type\":\"bytes4\",\"name\":\"_selector\",\"internalType\":\"bytes4\"}]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"uint24\",\"name\":\"\",\"internalType\":\"uint24\"}],\"name\":\"currentRewardEpochId\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"uint256\",\"name\":\"_cutoff\",\"internalType\":\"uint256\"}],\"name\":\"currentScoreCutoff\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"uint256\",\"name\":\"_weight\",\"internalType\":\"uint256\"}],\"name\":\"currentSortitionWeight\",\"inputs\":[{\"type\":\"address\",\"name\":\"_signingPolicyAddress\",\"internalType\":\"address\"}]},{\"type\":\"function\",\"stateMutability\":\"nonpayable\",\"outputs\":[{\"type\":\"bool\",\"name\":\"\",\"internalType\":\"bool\"}],\"name\":\"daemonize\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"nonpayable\",\"outputs\":[],\"name\":\"executeGovernanceCall\",\"inputs\":[{\"type\":\"bytes4\",\"name\":\"_selector\",\"internalType\":\"bytes4\"}]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"address\",\"name\":\"\",\"internalType\":\"contractIIFastUpdateIncentiveManager\"}],\"name\":\"fastUpdateIncentiveManager\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"address\",\"name\":\"\",\"internalType\":\"contractIFastUpdatesConfiguration\"}],\"name\":\"fastUpdatesConfiguration\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"bytes21[]\",\"name\":\"_feedIds\",\"internalType\":\"bytes21[]\"},{\"type\":\"uint256[]\",\"name\":\"_feeds\",\"internalType\":\"uint256[]\"},{\"type\":\"int8[]\",\"name\":\"_decimals\",\"internalType\":\"int8[]\"},{\"type\":\"uint64\",\"name\":\"_timestamp\",\"internalType\":\"uint64\"}],\"name\":\"fetchAllCurrentFeeds\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"uint256[]\",\"name\":\"_feeds\",\"internalType\":\"uint256[]\"},{\"type\":\"int8[]\",\"name\":\"_decimals\",\"internalType\":\"int8[]\"},{\"type\":\"uint64\",\"name\":\"_timestamp\",\"internalType\":\"uint64\"}],\"name\":\"fetchCurrentFeeds\",\"inputs\":[{\"type\":\"uint256[]\",\"name\":\"_indices\",\"internalType\":\"uint256[]\"}]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"uint64\",\"name\":\"\",\"internalType\":\"uint64\"}],\"name\":\"firstVotingRoundStartTs\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"address\",\"name\":\"\",\"internalType\":\"address\"}],\"name\":\"flareDaemon\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"address\",\"name\":\"\",\"internalType\":\"contractIFlareSystemsManager\"}],\"name\":\"flareSystemsManager\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"address\",\"name\":\"\",\"internalType\":\"contractIFtsoFeedPublisher\"}],\"name\":\"ftsoFeedPublisher\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"address\",\"name\":\"_addressUpdater\",\"internalType\":\"address\"}],\"name\":\"getAddressUpdater\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"pure\",\"outputs\":[{\"type\":\"string\",\"name\":\"\",\"internalType\":\"string\"}],\"name\":\"getContractName\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"address\",\"name\":\"\",\"internalType\":\"address\"}],\"name\":\"governance\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"address\",\"name\":\"\",\"internalType\":\"contractIGovernanceSettings\"}],\"name\":\"governanceSettings\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"nonpayable\",\"outputs\":[],\"name\":\"initialise\",\"inputs\":[{\"type\":\"address\",\"name\":\"_governanceSettings\",\"internalType\":\"contractIGovernanceSettings\"},{\"type\":\"address\",\"name\":\"_initialGovernance\",\"internalType\":\"address\"}]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"bool\",\"name\":\"\",\"internalType\":\"bool\"}],\"name\":\"isExecutor\",\"inputs\":[{\"type\":\"address\",\"name\":\"_address\",\"internalType\":\"address\"}]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"uint256[]\",\"name\":\"_noOfUpdates\",\"internalType\":\"uint256[]\"}],\"name\":\"numberOfUpdates\",\"inputs\":[{\"type\":\"uint256\",\"name\":\"_historySize\",\"internalType\":\"uint256\"}]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"uint256\",\"name\":\"\",\"internalType\":\"uint256\"}],\"name\":\"numberOfUpdatesInBlock\",\"inputs\":[{\"type\":\"uint256\",\"name\":\"_blockNumber\",\"internalType\":\"uint256\"}]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"bool\",\"name\":\"\",\"internalType\":\"bool\"}],\"name\":\"productionMode\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"nonpayable\",\"outputs\":[],\"name\":\"removeFeeds\",\"inputs\":[{\"type\":\"uint256[]\",\"name\":\"_indices\",\"internalType\":\"uint256[]\"}]},{\"type\":\"function\",\"stateMutability\":\"nonpayable\",\"outputs\":[],\"name\":\"resetFeeds\",\"inputs\":[{\"type\":\"uint256[]\",\"name\":\"_indices\",\"internalType\":\"uint256[]\"}]},{\"type\":\"function\",\"stateMutability\":\"nonpayable\",\"outputs\":[],\"name\":\"setSubmissionWindow\",\"inputs\":[{\"type\":\"uint8\",\"name\":\"_submissionWindow\",\"internalType\":\"uint8\"}]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"uint8\",\"name\":\"\",\"internalType\":\"uint8\"}],\"name\":\"submissionWindow\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"nonpayable\",\"outputs\":[],\"name\":\"submitUpdates\",\"inputs\":[{\"type\":\"tuple\",\"name\":\"_updates\",\"internalType\":\"structIFastUpdater.FastUpdates\",\"components\":[{\"type\":\"uint256\",\"name\":\"sortitionBlock\",\"internalType\":\"uint256\"},{\"type\":\"tuple\",\"name\":\"sortitionCredential\",\"internalType\":\"structSortitionCredential\",\"components\":[{\"type\":\"uint256\",\"name\":\"replicate\",\"internalType\":\"uint256\"},{\"type\":\"tuple\",\"name\":\"gamma\",\"internalType\":\"structBn256.G1Point\",\"components\":[{\"type\":\"uint256\",\"name\":\"x\",\"internalType\":\"uint256\"},{\"type\":\"uint256\",\"name\":\"y\",\"internalType\":\"uint256\"}]},{\"type\":\"uint256\",\"name\":\"c\",\"internalType\":\"uint256\"},{\"type\":\"uint256\",\"name\":\"s\",\"internalType\":\"uint256\"}]},{\"type\":\"bytes\",\"name\":\"deltas\",\"internalType\":\"bytes\"},{\"type\":\"tuple\",\"name\":\"signature\",\"internalType\":\"structIFastUpdater.Signature\",\"components\":[{\"type\":\"uint8\",\"name\":\"v\",\"internalType\":\"uint8\"},{\"type\":\"bytes32\",\"name\":\"r\",\"internalType\":\"bytes32\"},{\"type\":\"bytes32\",\"name\":\"s\",\"internalType\":\"bytes32\"}]}]}]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"bool\",\"name\":\"\",\"internalType\":\"bool\"}],\"name\":\"switchToFallbackMode\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"nonpayable\",\"outputs\":[],\"name\":\"switchToProductionMode\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"uint256\",\"name\":\"allowedAfterTimestamp\",\"internalType\":\"uint256\"},{\"type\":\"bytes\",\"name\":\"encodedCall\",\"internalType\":\"bytes\"}],\"name\":\"timelockedCalls\",\"inputs\":[{\"type\":\"bytes4\",\"name\":\"selector\",\"internalType\":\"bytes4\"}]},{\"type\":\"function\",\"stateMutability\":\"nonpayable\",\"outputs\":[],\"name\":\"updateContractAddresses\",\"inputs\":[{\"type\":\"bytes32[]\",\"name\":\"_contractNameHashes\",\"internalType\":\"bytes32[]\"},{\"type\":\"address[]\",\"name\":\"_contractAddresses\",\"internalType\":\"address[]\"}]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[],\"name\":\"verifyPublicKey\",\"inputs\":[{\"type\":\"address\",\"name\":\"_voter\",\"internalType\":\"address\"},{\"type\":\"bytes32\",\"name\":\"_part1\",\"internalType\":\"bytes32\"},{\"type\":\"bytes32\",\"name\":\"_part2\",\"internalType\":\"bytes32\"},{\"type\":\"bytes\",\"name\":\"_verificationData\",\"internalType\":\"bytes\"}]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"address\",\"name\":\"\",\"internalType\":\"contractIIVoterRegistry\"}],\"name\":\"voterRegistry\",\"inputs\":[]},{\"type\":\"function\",\"stateMutability\":\"view\",\"outputs\":[{\"type\":\"uint64\",\"name\":\"\",\"internalType\":\"uint64\"}],\"name\":\"votingEpochDurationSeconds\",\"inputs\":[]}]",
}

// IFastUpdaterABI is the input ABI used to generate the binding from.
// Deprecated: Use IFastUpdaterMetaData.ABI instead.
var IFastUpdaterABI = IFastUpdaterMetaData.ABI

// IFastUpdater is an auto generated Go binding around an Ethereum contract.
type IFastUpdater struct {
	IFastUpdaterCaller     // Read-only binding to the contract
	IFastUpdaterTransactor // Write-only binding to the contract
	IFastUpdaterFilterer   // Log filterer for contract events
}

// IFastUpdaterCaller is an auto generated read-only Go binding around an Ethereum contract.
type IFastUpdaterCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// IFastUpdaterTransactor is an auto generated write-only Go binding around an Ethereum contract.
type IFastUpdaterTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// IFastUpdaterFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type IFastUpdaterFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// IFastUpdaterSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type IFastUpdaterSession struct {
	Contract     *IFastUpdater     // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// IFastUpdaterCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type IFastUpdaterCallerSession struct {
	Contract *IFastUpdaterCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts       // Call options to use throughout this session
}

// IFastUpdaterTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type IFastUpdaterTransactorSession struct {
	Contract     *IFastUpdaterTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts       // Transaction auth options to use throughout this session
}

// IFastUpdaterRaw is an auto generated low-level Go binding around an Ethereum contract.
type IFastUpdaterRaw struct {
	Contract *IFastUpdater // Generic contract binding to access the raw methods on
}

// IFastUpdaterCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type IFastUpdaterCallerRaw struct {
	Contract *IFastUpdaterCaller // Generic read-only contract binding to access the raw methods on
}

// IFastUpdaterTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type IFastUpdaterTransactorRaw struct {
	Contract *IFastUpdaterTransactor // Generic write-only contract binding to access the raw methods on
}

// NewIFastUpdater creates a new instance of IFastUpdater, bound to a specific deployed contract.
func NewIFastUpdater(address common.Address, backend bind.ContractBackend) (*IFastUpdater, error) {
	contract, err := bindIFastUpdater(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &IFastUpdater{IFastUpdaterCaller: IFastUpdaterCaller{contract: contract}, IFastUpdaterTransactor: IFastUpdaterTransactor{contract: contract}, IFastUpdaterFilterer: IFastUpdaterFilterer{contract: contract}}, nil
}

// NewIFastUpdaterCaller creates a new read-only instance of IFastUpdater, bound to a specific deployed contract.
func NewIFastUpdaterCaller(address common.Address, caller bind.ContractCaller) (*IFastUpdaterCaller, error) {
	contract, err := bindIFastUpdater(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &IFastUpdaterCaller{contract: contract}, nil
}

// NewIFastUpdaterTransactor creates a new write-only instance of IFastUpdater, bound to a specific deployed contract.
func NewIFastUpdaterTransactor(address common.Address, transactor bind.ContractTransactor) (*IFastUpdaterTransactor, error) {
	contract, err := bindIFastUpdater(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &IFastUpdaterTransactor{contract: contract}, nil
}

// NewIFastUpdaterFilterer creates a new log filterer instance of IFastUpdater, bound to a specific deployed contract.
func NewIFastUpdaterFilterer(address common.Address, filterer bind.ContractFilterer) (*IFastUpdaterFilterer, error) {
	contract, err := bindIFastUpdater(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &IFastUpdaterFilterer{contract: contract}, nil
}

// bindIFastUpdater binds a generic wrapper to an already deployed contract.
func bindIFastUpdater(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := IFastUpdaterMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_IFastUpdater *IFastUpdaterRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _IFastUpdater.Contract.IFastUpdaterCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_IFastUpdater *IFastUpdaterRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _IFastUpdater.Contract.IFastUpdaterTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_IFastUpdater *IFastUpdaterRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _IFastUpdater.Contract.IFastUpdaterTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_IFastUpdater *IFastUpdaterCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _IFastUpdater.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_IFastUpdater *IFastUpdaterTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _IFastUpdater.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_IFastUpdater *IFastUpdaterTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _IFastUpdater.Contract.contract.Transact(opts, method, params...)
}

// MAXBLOCKSHISTORY is a free data retrieval call binding the contract method 0xc1bff139.
//
// Solidity: function MAX_BLOCKS_HISTORY() view returns(uint256)
func (_IFastUpdater *IFastUpdaterCaller) MAXBLOCKSHISTORY(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "MAX_BLOCKS_HISTORY")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// MAXBLOCKSHISTORY is a free data retrieval call binding the contract method 0xc1bff139.
//
// Solidity: function MAX_BLOCKS_HISTORY() view returns(uint256)
func (_IFastUpdater *IFastUpdaterSession) MAXBLOCKSHISTORY() (*big.Int, error) {
	return _IFastUpdater.Contract.MAXBLOCKSHISTORY(&_IFastUpdater.CallOpts)
}

// MAXBLOCKSHISTORY is a free data retrieval call binding the contract method 0xc1bff139.
//
// Solidity: function MAX_BLOCKS_HISTORY() view returns(uint256)
func (_IFastUpdater *IFastUpdaterCallerSession) MAXBLOCKSHISTORY() (*big.Int, error) {
	return _IFastUpdater.Contract.MAXBLOCKSHISTORY(&_IFastUpdater.CallOpts)
}

// MAXFEEDAGEINVOTINGEPOCHS is a free data retrieval call binding the contract method 0x7fe3341a.
//
// Solidity: function MAX_FEED_AGE_IN_VOTING_EPOCHS() view returns(uint256)
func (_IFastUpdater *IFastUpdaterCaller) MAXFEEDAGEINVOTINGEPOCHS(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "MAX_FEED_AGE_IN_VOTING_EPOCHS")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// MAXFEEDAGEINVOTINGEPOCHS is a free data retrieval call binding the contract method 0x7fe3341a.
//
// Solidity: function MAX_FEED_AGE_IN_VOTING_EPOCHS() view returns(uint256)
func (_IFastUpdater *IFastUpdaterSession) MAXFEEDAGEINVOTINGEPOCHS() (*big.Int, error) {
	return _IFastUpdater.Contract.MAXFEEDAGEINVOTINGEPOCHS(&_IFastUpdater.CallOpts)
}

// MAXFEEDAGEINVOTINGEPOCHS is a free data retrieval call binding the contract method 0x7fe3341a.
//
// Solidity: function MAX_FEED_AGE_IN_VOTING_EPOCHS() view returns(uint256)
func (_IFastUpdater *IFastUpdaterCallerSession) MAXFEEDAGEINVOTINGEPOCHS() (*big.Int, error) {
	return _IFastUpdater.Contract.MAXFEEDAGEINVOTINGEPOCHS(&_IFastUpdater.CallOpts)
}

// BlockScoreCutoff is a free data retrieval call binding the contract method 0xdcb1476e.
//
// Solidity: function blockScoreCutoff(uint256 _blockNum) view returns(uint256 _cutoff)
func (_IFastUpdater *IFastUpdaterCaller) BlockScoreCutoff(opts *bind.CallOpts, _blockNum *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "blockScoreCutoff", _blockNum)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// BlockScoreCutoff is a free data retrieval call binding the contract method 0xdcb1476e.
//
// Solidity: function blockScoreCutoff(uint256 _blockNum) view returns(uint256 _cutoff)
func (_IFastUpdater *IFastUpdaterSession) BlockScoreCutoff(_blockNum *big.Int) (*big.Int, error) {
	return _IFastUpdater.Contract.BlockScoreCutoff(&_IFastUpdater.CallOpts, _blockNum)
}

// BlockScoreCutoff is a free data retrieval call binding the contract method 0xdcb1476e.
//
// Solidity: function blockScoreCutoff(uint256 _blockNum) view returns(uint256 _cutoff)
func (_IFastUpdater *IFastUpdaterCallerSession) BlockScoreCutoff(_blockNum *big.Int) (*big.Int, error) {
	return _IFastUpdater.Contract.BlockScoreCutoff(&_IFastUpdater.CallOpts, _blockNum)
}

// CurrentRewardEpochId is a free data retrieval call binding the contract method 0x8e0e9f7c.
//
// Solidity: function currentRewardEpochId() view returns(uint24)
func (_IFastUpdater *IFastUpdaterCaller) CurrentRewardEpochId(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "currentRewardEpochId")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// CurrentRewardEpochId is a free data retrieval call binding the contract method 0x8e0e9f7c.
//
// Solidity: function currentRewardEpochId() view returns(uint24)
func (_IFastUpdater *IFastUpdaterSession) CurrentRewardEpochId() (*big.Int, error) {
	return _IFastUpdater.Contract.CurrentRewardEpochId(&_IFastUpdater.CallOpts)
}

// CurrentRewardEpochId is a free data retrieval call binding the contract method 0x8e0e9f7c.
//
// Solidity: function currentRewardEpochId() view returns(uint24)
func (_IFastUpdater *IFastUpdaterCallerSession) CurrentRewardEpochId() (*big.Int, error) {
	return _IFastUpdater.Contract.CurrentRewardEpochId(&_IFastUpdater.CallOpts)
}

// CurrentScoreCutoff is a free data retrieval call binding the contract method 0x0799fe75.
//
// Solidity: function currentScoreCutoff() view returns(uint256 _cutoff)
func (_IFastUpdater *IFastUpdaterCaller) CurrentScoreCutoff(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "currentScoreCutoff")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// CurrentScoreCutoff is a free data retrieval call binding the contract method 0x0799fe75.
//
// Solidity: function currentScoreCutoff() view returns(uint256 _cutoff)
func (_IFastUpdater *IFastUpdaterSession) CurrentScoreCutoff() (*big.Int, error) {
	return _IFastUpdater.Contract.CurrentScoreCutoff(&_IFastUpdater.CallOpts)
}

// CurrentScoreCutoff is a free data retrieval call binding the contract method 0x0799fe75.
//
// Solidity: function currentScoreCutoff() view returns(uint256 _cutoff)
func (_IFastUpdater *IFastUpdaterCallerSession) CurrentScoreCutoff() (*big.Int, error) {
	return _IFastUpdater.Contract.CurrentScoreCutoff(&_IFastUpdater.CallOpts)
}

// CurrentSortitionWeight is a free data retrieval call binding the contract method 0xa14634a7.
//
// Solidity: function currentSortitionWeight(address _signingPolicyAddress) view returns(uint256 _weight)
func (_IFastUpdater *IFastUpdaterCaller) CurrentSortitionWeight(opts *bind.CallOpts, _signingPolicyAddress common.Address) (*big.Int, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "currentSortitionWeight", _signingPolicyAddress)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// CurrentSortitionWeight is a free data retrieval call binding the contract method 0xa14634a7.
//
// Solidity: function currentSortitionWeight(address _signingPolicyAddress) view returns(uint256 _weight)
func (_IFastUpdater *IFastUpdaterSession) CurrentSortitionWeight(_signingPolicyAddress common.Address) (*big.Int, error) {
	return _IFastUpdater.Contract.CurrentSortitionWeight(&_IFastUpdater.CallOpts, _signingPolicyAddress)
}

// CurrentSortitionWeight is a free data retrieval call binding the contract method 0xa14634a7.
//
// Solidity: function currentSortitionWeight(address _signingPolicyAddress) view returns(uint256 _weight)
func (_IFastUpdater *IFastUpdaterCallerSession) CurrentSortitionWeight(_signingPolicyAddress common.Address) (*big.Int, error) {
	return _IFastUpdater.Contract.CurrentSortitionWeight(&_IFastUpdater.CallOpts, _signingPolicyAddress)
}

// FastUpdateIncentiveManager is a free data retrieval call binding the contract method 0x7925eaca.
//
// Solidity: function fastUpdateIncentiveManager() view returns(address)
func (_IFastUpdater *IFastUpdaterCaller) FastUpdateIncentiveManager(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "fastUpdateIncentiveManager")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FastUpdateIncentiveManager is a free data retrieval call binding the contract method 0x7925eaca.
//
// Solidity: function fastUpdateIncentiveManager() view returns(address)
func (_IFastUpdater *IFastUpdaterSession) FastUpdateIncentiveManager() (common.Address, error) {
	return _IFastUpdater.Contract.FastUpdateIncentiveManager(&_IFastUpdater.CallOpts)
}

// FastUpdateIncentiveManager is a free data retrieval call binding the contract method 0x7925eaca.
//
// Solidity: function fastUpdateIncentiveManager() view returns(address)
func (_IFastUpdater *IFastUpdaterCallerSession) FastUpdateIncentiveManager() (common.Address, error) {
	return _IFastUpdater.Contract.FastUpdateIncentiveManager(&_IFastUpdater.CallOpts)
}

// FastUpdatesConfiguration is a free data retrieval call binding the contract method 0xc10f489a.
//
// Solidity: function fastUpdatesConfiguration() view returns(address)
func (_IFastUpdater *IFastUpdaterCaller) FastUpdatesConfiguration(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "fastUpdatesConfiguration")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FastUpdatesConfiguration is a free data retrieval call binding the contract method 0xc10f489a.
//
// Solidity: function fastUpdatesConfiguration() view returns(address)
func (_IFastUpdater *IFastUpdaterSession) FastUpdatesConfiguration() (common.Address, error) {
	return _IFastUpdater.Contract.FastUpdatesConfiguration(&_IFastUpdater.CallOpts)
}

// FastUpdatesConfiguration is a free data retrieval call binding the contract method 0xc10f489a.
//
// Solidity: function fastUpdatesConfiguration() view returns(address)
func (_IFastUpdater *IFastUpdaterCallerSession) FastUpdatesConfiguration() (common.Address, error) {
	return _IFastUpdater.Contract.FastUpdatesConfiguration(&_IFastUpdater.CallOpts)
}

// FetchAllCurrentFeeds is a free data retrieval call binding the contract method 0x4691377f.
//
// Solidity: function fetchAllCurrentFeeds() view returns(bytes21[] _feedIds, uint256[] _feeds, int8[] _decimals, uint64 _timestamp)
func (_IFastUpdater *IFastUpdaterCaller) FetchAllCurrentFeeds(opts *bind.CallOpts) (struct {
	FeedIds   [][21]byte
	Feeds     []*big.Int
	Decimals  []int8
	Timestamp uint64
}, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "fetchAllCurrentFeeds")

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
func (_IFastUpdater *IFastUpdaterSession) FetchAllCurrentFeeds() (struct {
	FeedIds   [][21]byte
	Feeds     []*big.Int
	Decimals  []int8
	Timestamp uint64
}, error) {
	return _IFastUpdater.Contract.FetchAllCurrentFeeds(&_IFastUpdater.CallOpts)
}

// FetchAllCurrentFeeds is a free data retrieval call binding the contract method 0x4691377f.
//
// Solidity: function fetchAllCurrentFeeds() view returns(bytes21[] _feedIds, uint256[] _feeds, int8[] _decimals, uint64 _timestamp)
func (_IFastUpdater *IFastUpdaterCallerSession) FetchAllCurrentFeeds() (struct {
	FeedIds   [][21]byte
	Feeds     []*big.Int
	Decimals  []int8
	Timestamp uint64
}, error) {
	return _IFastUpdater.Contract.FetchAllCurrentFeeds(&_IFastUpdater.CallOpts)
}

// FetchCurrentFeeds is a free data retrieval call binding the contract method 0x45a15d3c.
//
// Solidity: function fetchCurrentFeeds(uint256[] _indices) view returns(uint256[] _feeds, int8[] _decimals, uint64 _timestamp)
func (_IFastUpdater *IFastUpdaterCaller) FetchCurrentFeeds(opts *bind.CallOpts, _indices []*big.Int) (struct {
	Feeds     []*big.Int
	Decimals  []int8
	Timestamp uint64
}, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "fetchCurrentFeeds", _indices)

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
func (_IFastUpdater *IFastUpdaterSession) FetchCurrentFeeds(_indices []*big.Int) (struct {
	Feeds     []*big.Int
	Decimals  []int8
	Timestamp uint64
}, error) {
	return _IFastUpdater.Contract.FetchCurrentFeeds(&_IFastUpdater.CallOpts, _indices)
}

// FetchCurrentFeeds is a free data retrieval call binding the contract method 0x45a15d3c.
//
// Solidity: function fetchCurrentFeeds(uint256[] _indices) view returns(uint256[] _feeds, int8[] _decimals, uint64 _timestamp)
func (_IFastUpdater *IFastUpdaterCallerSession) FetchCurrentFeeds(_indices []*big.Int) (struct {
	Feeds     []*big.Int
	Decimals  []int8
	Timestamp uint64
}, error) {
	return _IFastUpdater.Contract.FetchCurrentFeeds(&_IFastUpdater.CallOpts, _indices)
}

// FirstVotingRoundStartTs is a free data retrieval call binding the contract method 0xe8d0e70a.
//
// Solidity: function firstVotingRoundStartTs() view returns(uint64)
func (_IFastUpdater *IFastUpdaterCaller) FirstVotingRoundStartTs(opts *bind.CallOpts) (uint64, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "firstVotingRoundStartTs")

	if err != nil {
		return *new(uint64), err
	}

	out0 := *abi.ConvertType(out[0], new(uint64)).(*uint64)

	return out0, err

}

// FirstVotingRoundStartTs is a free data retrieval call binding the contract method 0xe8d0e70a.
//
// Solidity: function firstVotingRoundStartTs() view returns(uint64)
func (_IFastUpdater *IFastUpdaterSession) FirstVotingRoundStartTs() (uint64, error) {
	return _IFastUpdater.Contract.FirstVotingRoundStartTs(&_IFastUpdater.CallOpts)
}

// FirstVotingRoundStartTs is a free data retrieval call binding the contract method 0xe8d0e70a.
//
// Solidity: function firstVotingRoundStartTs() view returns(uint64)
func (_IFastUpdater *IFastUpdaterCallerSession) FirstVotingRoundStartTs() (uint64, error) {
	return _IFastUpdater.Contract.FirstVotingRoundStartTs(&_IFastUpdater.CallOpts)
}

// FlareDaemon is a free data retrieval call binding the contract method 0xa1077532.
//
// Solidity: function flareDaemon() view returns(address)
func (_IFastUpdater *IFastUpdaterCaller) FlareDaemon(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "flareDaemon")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FlareDaemon is a free data retrieval call binding the contract method 0xa1077532.
//
// Solidity: function flareDaemon() view returns(address)
func (_IFastUpdater *IFastUpdaterSession) FlareDaemon() (common.Address, error) {
	return _IFastUpdater.Contract.FlareDaemon(&_IFastUpdater.CallOpts)
}

// FlareDaemon is a free data retrieval call binding the contract method 0xa1077532.
//
// Solidity: function flareDaemon() view returns(address)
func (_IFastUpdater *IFastUpdaterCallerSession) FlareDaemon() (common.Address, error) {
	return _IFastUpdater.Contract.FlareDaemon(&_IFastUpdater.CallOpts)
}

// FlareSystemsManager is a free data retrieval call binding the contract method 0xfaae7fc9.
//
// Solidity: function flareSystemsManager() view returns(address)
func (_IFastUpdater *IFastUpdaterCaller) FlareSystemsManager(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "flareSystemsManager")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FlareSystemsManager is a free data retrieval call binding the contract method 0xfaae7fc9.
//
// Solidity: function flareSystemsManager() view returns(address)
func (_IFastUpdater *IFastUpdaterSession) FlareSystemsManager() (common.Address, error) {
	return _IFastUpdater.Contract.FlareSystemsManager(&_IFastUpdater.CallOpts)
}

// FlareSystemsManager is a free data retrieval call binding the contract method 0xfaae7fc9.
//
// Solidity: function flareSystemsManager() view returns(address)
func (_IFastUpdater *IFastUpdaterCallerSession) FlareSystemsManager() (common.Address, error) {
	return _IFastUpdater.Contract.FlareSystemsManager(&_IFastUpdater.CallOpts)
}

// FtsoFeedPublisher is a free data retrieval call binding the contract method 0x29bfe39d.
//
// Solidity: function ftsoFeedPublisher() view returns(address)
func (_IFastUpdater *IFastUpdaterCaller) FtsoFeedPublisher(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "ftsoFeedPublisher")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FtsoFeedPublisher is a free data retrieval call binding the contract method 0x29bfe39d.
//
// Solidity: function ftsoFeedPublisher() view returns(address)
func (_IFastUpdater *IFastUpdaterSession) FtsoFeedPublisher() (common.Address, error) {
	return _IFastUpdater.Contract.FtsoFeedPublisher(&_IFastUpdater.CallOpts)
}

// FtsoFeedPublisher is a free data retrieval call binding the contract method 0x29bfe39d.
//
// Solidity: function ftsoFeedPublisher() view returns(address)
func (_IFastUpdater *IFastUpdaterCallerSession) FtsoFeedPublisher() (common.Address, error) {
	return _IFastUpdater.Contract.FtsoFeedPublisher(&_IFastUpdater.CallOpts)
}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_IFastUpdater *IFastUpdaterCaller) GetAddressUpdater(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "getAddressUpdater")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_IFastUpdater *IFastUpdaterSession) GetAddressUpdater() (common.Address, error) {
	return _IFastUpdater.Contract.GetAddressUpdater(&_IFastUpdater.CallOpts)
}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_IFastUpdater *IFastUpdaterCallerSession) GetAddressUpdater() (common.Address, error) {
	return _IFastUpdater.Contract.GetAddressUpdater(&_IFastUpdater.CallOpts)
}

// GetContractName is a free data retrieval call binding the contract method 0xf5f5ba72.
//
// Solidity: function getContractName() pure returns(string)
func (_IFastUpdater *IFastUpdaterCaller) GetContractName(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "getContractName")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetContractName is a free data retrieval call binding the contract method 0xf5f5ba72.
//
// Solidity: function getContractName() pure returns(string)
func (_IFastUpdater *IFastUpdaterSession) GetContractName() (string, error) {
	return _IFastUpdater.Contract.GetContractName(&_IFastUpdater.CallOpts)
}

// GetContractName is a free data retrieval call binding the contract method 0xf5f5ba72.
//
// Solidity: function getContractName() pure returns(string)
func (_IFastUpdater *IFastUpdaterCallerSession) GetContractName() (string, error) {
	return _IFastUpdater.Contract.GetContractName(&_IFastUpdater.CallOpts)
}

// Governance is a free data retrieval call binding the contract method 0x5aa6e675.
//
// Solidity: function governance() view returns(address)
func (_IFastUpdater *IFastUpdaterCaller) Governance(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "governance")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Governance is a free data retrieval call binding the contract method 0x5aa6e675.
//
// Solidity: function governance() view returns(address)
func (_IFastUpdater *IFastUpdaterSession) Governance() (common.Address, error) {
	return _IFastUpdater.Contract.Governance(&_IFastUpdater.CallOpts)
}

// Governance is a free data retrieval call binding the contract method 0x5aa6e675.
//
// Solidity: function governance() view returns(address)
func (_IFastUpdater *IFastUpdaterCallerSession) Governance() (common.Address, error) {
	return _IFastUpdater.Contract.Governance(&_IFastUpdater.CallOpts)
}

// GovernanceSettings is a free data retrieval call binding the contract method 0x62354e03.
//
// Solidity: function governanceSettings() view returns(address)
func (_IFastUpdater *IFastUpdaterCaller) GovernanceSettings(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "governanceSettings")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GovernanceSettings is a free data retrieval call binding the contract method 0x62354e03.
//
// Solidity: function governanceSettings() view returns(address)
func (_IFastUpdater *IFastUpdaterSession) GovernanceSettings() (common.Address, error) {
	return _IFastUpdater.Contract.GovernanceSettings(&_IFastUpdater.CallOpts)
}

// GovernanceSettings is a free data retrieval call binding the contract method 0x62354e03.
//
// Solidity: function governanceSettings() view returns(address)
func (_IFastUpdater *IFastUpdaterCallerSession) GovernanceSettings() (common.Address, error) {
	return _IFastUpdater.Contract.GovernanceSettings(&_IFastUpdater.CallOpts)
}

// IsExecutor is a free data retrieval call binding the contract method 0xdebfda30.
//
// Solidity: function isExecutor(address _address) view returns(bool)
func (_IFastUpdater *IFastUpdaterCaller) IsExecutor(opts *bind.CallOpts, _address common.Address) (bool, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "isExecutor", _address)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsExecutor is a free data retrieval call binding the contract method 0xdebfda30.
//
// Solidity: function isExecutor(address _address) view returns(bool)
func (_IFastUpdater *IFastUpdaterSession) IsExecutor(_address common.Address) (bool, error) {
	return _IFastUpdater.Contract.IsExecutor(&_IFastUpdater.CallOpts, _address)
}

// IsExecutor is a free data retrieval call binding the contract method 0xdebfda30.
//
// Solidity: function isExecutor(address _address) view returns(bool)
func (_IFastUpdater *IFastUpdaterCallerSession) IsExecutor(_address common.Address) (bool, error) {
	return _IFastUpdater.Contract.IsExecutor(&_IFastUpdater.CallOpts, _address)
}

// NumberOfUpdates is a free data retrieval call binding the contract method 0xe36da7b7.
//
// Solidity: function numberOfUpdates(uint256 _historySize) view returns(uint256[] _noOfUpdates)
func (_IFastUpdater *IFastUpdaterCaller) NumberOfUpdates(opts *bind.CallOpts, _historySize *big.Int) ([]*big.Int, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "numberOfUpdates", _historySize)

	if err != nil {
		return *new([]*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new([]*big.Int)).(*[]*big.Int)

	return out0, err

}

// NumberOfUpdates is a free data retrieval call binding the contract method 0xe36da7b7.
//
// Solidity: function numberOfUpdates(uint256 _historySize) view returns(uint256[] _noOfUpdates)
func (_IFastUpdater *IFastUpdaterSession) NumberOfUpdates(_historySize *big.Int) ([]*big.Int, error) {
	return _IFastUpdater.Contract.NumberOfUpdates(&_IFastUpdater.CallOpts, _historySize)
}

// NumberOfUpdates is a free data retrieval call binding the contract method 0xe36da7b7.
//
// Solidity: function numberOfUpdates(uint256 _historySize) view returns(uint256[] _noOfUpdates)
func (_IFastUpdater *IFastUpdaterCallerSession) NumberOfUpdates(_historySize *big.Int) ([]*big.Int, error) {
	return _IFastUpdater.Contract.NumberOfUpdates(&_IFastUpdater.CallOpts, _historySize)
}

// NumberOfUpdatesInBlock is a free data retrieval call binding the contract method 0xfc79c300.
//
// Solidity: function numberOfUpdatesInBlock(uint256 _blockNumber) view returns(uint256)
func (_IFastUpdater *IFastUpdaterCaller) NumberOfUpdatesInBlock(opts *bind.CallOpts, _blockNumber *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "numberOfUpdatesInBlock", _blockNumber)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// NumberOfUpdatesInBlock is a free data retrieval call binding the contract method 0xfc79c300.
//
// Solidity: function numberOfUpdatesInBlock(uint256 _blockNumber) view returns(uint256)
func (_IFastUpdater *IFastUpdaterSession) NumberOfUpdatesInBlock(_blockNumber *big.Int) (*big.Int, error) {
	return _IFastUpdater.Contract.NumberOfUpdatesInBlock(&_IFastUpdater.CallOpts, _blockNumber)
}

// NumberOfUpdatesInBlock is a free data retrieval call binding the contract method 0xfc79c300.
//
// Solidity: function numberOfUpdatesInBlock(uint256 _blockNumber) view returns(uint256)
func (_IFastUpdater *IFastUpdaterCallerSession) NumberOfUpdatesInBlock(_blockNumber *big.Int) (*big.Int, error) {
	return _IFastUpdater.Contract.NumberOfUpdatesInBlock(&_IFastUpdater.CallOpts, _blockNumber)
}

// ProductionMode is a free data retrieval call binding the contract method 0xe17f212e.
//
// Solidity: function productionMode() view returns(bool)
func (_IFastUpdater *IFastUpdaterCaller) ProductionMode(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "productionMode")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// ProductionMode is a free data retrieval call binding the contract method 0xe17f212e.
//
// Solidity: function productionMode() view returns(bool)
func (_IFastUpdater *IFastUpdaterSession) ProductionMode() (bool, error) {
	return _IFastUpdater.Contract.ProductionMode(&_IFastUpdater.CallOpts)
}

// ProductionMode is a free data retrieval call binding the contract method 0xe17f212e.
//
// Solidity: function productionMode() view returns(bool)
func (_IFastUpdater *IFastUpdaterCallerSession) ProductionMode() (bool, error) {
	return _IFastUpdater.Contract.ProductionMode(&_IFastUpdater.CallOpts)
}

// SubmissionWindow is a free data retrieval call binding the contract method 0xe621dbc7.
//
// Solidity: function submissionWindow() view returns(uint8)
func (_IFastUpdater *IFastUpdaterCaller) SubmissionWindow(opts *bind.CallOpts) (uint8, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "submissionWindow")

	if err != nil {
		return *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(uint8)).(*uint8)

	return out0, err

}

// SubmissionWindow is a free data retrieval call binding the contract method 0xe621dbc7.
//
// Solidity: function submissionWindow() view returns(uint8)
func (_IFastUpdater *IFastUpdaterSession) SubmissionWindow() (uint8, error) {
	return _IFastUpdater.Contract.SubmissionWindow(&_IFastUpdater.CallOpts)
}

// SubmissionWindow is a free data retrieval call binding the contract method 0xe621dbc7.
//
// Solidity: function submissionWindow() view returns(uint8)
func (_IFastUpdater *IFastUpdaterCallerSession) SubmissionWindow() (uint8, error) {
	return _IFastUpdater.Contract.SubmissionWindow(&_IFastUpdater.CallOpts)
}

// SwitchToFallbackMode is a free data retrieval call binding the contract method 0xe22fdece.
//
// Solidity: function switchToFallbackMode() view returns(bool)
func (_IFastUpdater *IFastUpdaterCaller) SwitchToFallbackMode(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "switchToFallbackMode")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// SwitchToFallbackMode is a free data retrieval call binding the contract method 0xe22fdece.
//
// Solidity: function switchToFallbackMode() view returns(bool)
func (_IFastUpdater *IFastUpdaterSession) SwitchToFallbackMode() (bool, error) {
	return _IFastUpdater.Contract.SwitchToFallbackMode(&_IFastUpdater.CallOpts)
}

// SwitchToFallbackMode is a free data retrieval call binding the contract method 0xe22fdece.
//
// Solidity: function switchToFallbackMode() view returns(bool)
func (_IFastUpdater *IFastUpdaterCallerSession) SwitchToFallbackMode() (bool, error) {
	return _IFastUpdater.Contract.SwitchToFallbackMode(&_IFastUpdater.CallOpts)
}

// TimelockedCalls is a free data retrieval call binding the contract method 0x74e6310e.
//
// Solidity: function timelockedCalls(bytes4 selector) view returns(uint256 allowedAfterTimestamp, bytes encodedCall)
func (_IFastUpdater *IFastUpdaterCaller) TimelockedCalls(opts *bind.CallOpts, selector [4]byte) (struct {
	AllowedAfterTimestamp *big.Int
	EncodedCall           []byte
}, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "timelockedCalls", selector)

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
func (_IFastUpdater *IFastUpdaterSession) TimelockedCalls(selector [4]byte) (struct {
	AllowedAfterTimestamp *big.Int
	EncodedCall           []byte
}, error) {
	return _IFastUpdater.Contract.TimelockedCalls(&_IFastUpdater.CallOpts, selector)
}

// TimelockedCalls is a free data retrieval call binding the contract method 0x74e6310e.
//
// Solidity: function timelockedCalls(bytes4 selector) view returns(uint256 allowedAfterTimestamp, bytes encodedCall)
func (_IFastUpdater *IFastUpdaterCallerSession) TimelockedCalls(selector [4]byte) (struct {
	AllowedAfterTimestamp *big.Int
	EncodedCall           []byte
}, error) {
	return _IFastUpdater.Contract.TimelockedCalls(&_IFastUpdater.CallOpts, selector)
}

// VerifyPublicKey is a free data retrieval call binding the contract method 0x70473f2f.
//
// Solidity: function verifyPublicKey(address _voter, bytes32 _part1, bytes32 _part2, bytes _verificationData) view returns()
func (_IFastUpdater *IFastUpdaterCaller) VerifyPublicKey(opts *bind.CallOpts, _voter common.Address, _part1 [32]byte, _part2 [32]byte, _verificationData []byte) error {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "verifyPublicKey", _voter, _part1, _part2, _verificationData)

	if err != nil {
		return err
	}

	return err

}

// VerifyPublicKey is a free data retrieval call binding the contract method 0x70473f2f.
//
// Solidity: function verifyPublicKey(address _voter, bytes32 _part1, bytes32 _part2, bytes _verificationData) view returns()
func (_IFastUpdater *IFastUpdaterSession) VerifyPublicKey(_voter common.Address, _part1 [32]byte, _part2 [32]byte, _verificationData []byte) error {
	return _IFastUpdater.Contract.VerifyPublicKey(&_IFastUpdater.CallOpts, _voter, _part1, _part2, _verificationData)
}

// VerifyPublicKey is a free data retrieval call binding the contract method 0x70473f2f.
//
// Solidity: function verifyPublicKey(address _voter, bytes32 _part1, bytes32 _part2, bytes _verificationData) view returns()
func (_IFastUpdater *IFastUpdaterCallerSession) VerifyPublicKey(_voter common.Address, _part1 [32]byte, _part2 [32]byte, _verificationData []byte) error {
	return _IFastUpdater.Contract.VerifyPublicKey(&_IFastUpdater.CallOpts, _voter, _part1, _part2, _verificationData)
}

// VoterRegistry is a free data retrieval call binding the contract method 0xbe60040e.
//
// Solidity: function voterRegistry() view returns(address)
func (_IFastUpdater *IFastUpdaterCaller) VoterRegistry(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "voterRegistry")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// VoterRegistry is a free data retrieval call binding the contract method 0xbe60040e.
//
// Solidity: function voterRegistry() view returns(address)
func (_IFastUpdater *IFastUpdaterSession) VoterRegistry() (common.Address, error) {
	return _IFastUpdater.Contract.VoterRegistry(&_IFastUpdater.CallOpts)
}

// VoterRegistry is a free data retrieval call binding the contract method 0xbe60040e.
//
// Solidity: function voterRegistry() view returns(address)
func (_IFastUpdater *IFastUpdaterCallerSession) VoterRegistry() (common.Address, error) {
	return _IFastUpdater.Contract.VoterRegistry(&_IFastUpdater.CallOpts)
}

// VotingEpochDurationSeconds is a free data retrieval call binding the contract method 0x5a832088.
//
// Solidity: function votingEpochDurationSeconds() view returns(uint64)
func (_IFastUpdater *IFastUpdaterCaller) VotingEpochDurationSeconds(opts *bind.CallOpts) (uint64, error) {
	var out []interface{}
	err := _IFastUpdater.contract.Call(opts, &out, "votingEpochDurationSeconds")

	if err != nil {
		return *new(uint64), err
	}

	out0 := *abi.ConvertType(out[0], new(uint64)).(*uint64)

	return out0, err

}

// VotingEpochDurationSeconds is a free data retrieval call binding the contract method 0x5a832088.
//
// Solidity: function votingEpochDurationSeconds() view returns(uint64)
func (_IFastUpdater *IFastUpdaterSession) VotingEpochDurationSeconds() (uint64, error) {
	return _IFastUpdater.Contract.VotingEpochDurationSeconds(&_IFastUpdater.CallOpts)
}

// VotingEpochDurationSeconds is a free data retrieval call binding the contract method 0x5a832088.
//
// Solidity: function votingEpochDurationSeconds() view returns(uint64)
func (_IFastUpdater *IFastUpdaterCallerSession) VotingEpochDurationSeconds() (uint64, error) {
	return _IFastUpdater.Contract.VotingEpochDurationSeconds(&_IFastUpdater.CallOpts)
}

// CancelGovernanceCall is a paid mutator transaction binding the contract method 0x67fc4029.
//
// Solidity: function cancelGovernanceCall(bytes4 _selector) returns()
func (_IFastUpdater *IFastUpdaterTransactor) CancelGovernanceCall(opts *bind.TransactOpts, _selector [4]byte) (*types.Transaction, error) {
	return _IFastUpdater.contract.Transact(opts, "cancelGovernanceCall", _selector)
}

// CancelGovernanceCall is a paid mutator transaction binding the contract method 0x67fc4029.
//
// Solidity: function cancelGovernanceCall(bytes4 _selector) returns()
func (_IFastUpdater *IFastUpdaterSession) CancelGovernanceCall(_selector [4]byte) (*types.Transaction, error) {
	return _IFastUpdater.Contract.CancelGovernanceCall(&_IFastUpdater.TransactOpts, _selector)
}

// CancelGovernanceCall is a paid mutator transaction binding the contract method 0x67fc4029.
//
// Solidity: function cancelGovernanceCall(bytes4 _selector) returns()
func (_IFastUpdater *IFastUpdaterTransactorSession) CancelGovernanceCall(_selector [4]byte) (*types.Transaction, error) {
	return _IFastUpdater.Contract.CancelGovernanceCall(&_IFastUpdater.TransactOpts, _selector)
}

// Daemonize is a paid mutator transaction binding the contract method 0x6d0e8c34.
//
// Solidity: function daemonize() returns(bool)
func (_IFastUpdater *IFastUpdaterTransactor) Daemonize(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _IFastUpdater.contract.Transact(opts, "daemonize")
}

// Daemonize is a paid mutator transaction binding the contract method 0x6d0e8c34.
//
// Solidity: function daemonize() returns(bool)
func (_IFastUpdater *IFastUpdaterSession) Daemonize() (*types.Transaction, error) {
	return _IFastUpdater.Contract.Daemonize(&_IFastUpdater.TransactOpts)
}

// Daemonize is a paid mutator transaction binding the contract method 0x6d0e8c34.
//
// Solidity: function daemonize() returns(bool)
func (_IFastUpdater *IFastUpdaterTransactorSession) Daemonize() (*types.Transaction, error) {
	return _IFastUpdater.Contract.Daemonize(&_IFastUpdater.TransactOpts)
}

// ExecuteGovernanceCall is a paid mutator transaction binding the contract method 0x5ff27079.
//
// Solidity: function executeGovernanceCall(bytes4 _selector) returns()
func (_IFastUpdater *IFastUpdaterTransactor) ExecuteGovernanceCall(opts *bind.TransactOpts, _selector [4]byte) (*types.Transaction, error) {
	return _IFastUpdater.contract.Transact(opts, "executeGovernanceCall", _selector)
}

// ExecuteGovernanceCall is a paid mutator transaction binding the contract method 0x5ff27079.
//
// Solidity: function executeGovernanceCall(bytes4 _selector) returns()
func (_IFastUpdater *IFastUpdaterSession) ExecuteGovernanceCall(_selector [4]byte) (*types.Transaction, error) {
	return _IFastUpdater.Contract.ExecuteGovernanceCall(&_IFastUpdater.TransactOpts, _selector)
}

// ExecuteGovernanceCall is a paid mutator transaction binding the contract method 0x5ff27079.
//
// Solidity: function executeGovernanceCall(bytes4 _selector) returns()
func (_IFastUpdater *IFastUpdaterTransactorSession) ExecuteGovernanceCall(_selector [4]byte) (*types.Transaction, error) {
	return _IFastUpdater.Contract.ExecuteGovernanceCall(&_IFastUpdater.TransactOpts, _selector)
}

// Initialise is a paid mutator transaction binding the contract method 0xef88bf13.
//
// Solidity: function initialise(address _governanceSettings, address _initialGovernance) returns()
func (_IFastUpdater *IFastUpdaterTransactor) Initialise(opts *bind.TransactOpts, _governanceSettings common.Address, _initialGovernance common.Address) (*types.Transaction, error) {
	return _IFastUpdater.contract.Transact(opts, "initialise", _governanceSettings, _initialGovernance)
}

// Initialise is a paid mutator transaction binding the contract method 0xef88bf13.
//
// Solidity: function initialise(address _governanceSettings, address _initialGovernance) returns()
func (_IFastUpdater *IFastUpdaterSession) Initialise(_governanceSettings common.Address, _initialGovernance common.Address) (*types.Transaction, error) {
	return _IFastUpdater.Contract.Initialise(&_IFastUpdater.TransactOpts, _governanceSettings, _initialGovernance)
}

// Initialise is a paid mutator transaction binding the contract method 0xef88bf13.
//
// Solidity: function initialise(address _governanceSettings, address _initialGovernance) returns()
func (_IFastUpdater *IFastUpdaterTransactorSession) Initialise(_governanceSettings common.Address, _initialGovernance common.Address) (*types.Transaction, error) {
	return _IFastUpdater.Contract.Initialise(&_IFastUpdater.TransactOpts, _governanceSettings, _initialGovernance)
}

// RemoveFeeds is a paid mutator transaction binding the contract method 0xabfaf170.
//
// Solidity: function removeFeeds(uint256[] _indices) returns()
func (_IFastUpdater *IFastUpdaterTransactor) RemoveFeeds(opts *bind.TransactOpts, _indices []*big.Int) (*types.Transaction, error) {
	return _IFastUpdater.contract.Transact(opts, "removeFeeds", _indices)
}

// RemoveFeeds is a paid mutator transaction binding the contract method 0xabfaf170.
//
// Solidity: function removeFeeds(uint256[] _indices) returns()
func (_IFastUpdater *IFastUpdaterSession) RemoveFeeds(_indices []*big.Int) (*types.Transaction, error) {
	return _IFastUpdater.Contract.RemoveFeeds(&_IFastUpdater.TransactOpts, _indices)
}

// RemoveFeeds is a paid mutator transaction binding the contract method 0xabfaf170.
//
// Solidity: function removeFeeds(uint256[] _indices) returns()
func (_IFastUpdater *IFastUpdaterTransactorSession) RemoveFeeds(_indices []*big.Int) (*types.Transaction, error) {
	return _IFastUpdater.Contract.RemoveFeeds(&_IFastUpdater.TransactOpts, _indices)
}

// ResetFeeds is a paid mutator transaction binding the contract method 0x63f921db.
//
// Solidity: function resetFeeds(uint256[] _indices) returns()
func (_IFastUpdater *IFastUpdaterTransactor) ResetFeeds(opts *bind.TransactOpts, _indices []*big.Int) (*types.Transaction, error) {
	return _IFastUpdater.contract.Transact(opts, "resetFeeds", _indices)
}

// ResetFeeds is a paid mutator transaction binding the contract method 0x63f921db.
//
// Solidity: function resetFeeds(uint256[] _indices) returns()
func (_IFastUpdater *IFastUpdaterSession) ResetFeeds(_indices []*big.Int) (*types.Transaction, error) {
	return _IFastUpdater.Contract.ResetFeeds(&_IFastUpdater.TransactOpts, _indices)
}

// ResetFeeds is a paid mutator transaction binding the contract method 0x63f921db.
//
// Solidity: function resetFeeds(uint256[] _indices) returns()
func (_IFastUpdater *IFastUpdaterTransactorSession) ResetFeeds(_indices []*big.Int) (*types.Transaction, error) {
	return _IFastUpdater.Contract.ResetFeeds(&_IFastUpdater.TransactOpts, _indices)
}

// SetSubmissionWindow is a paid mutator transaction binding the contract method 0x0a166051.
//
// Solidity: function setSubmissionWindow(uint8 _submissionWindow) returns()
func (_IFastUpdater *IFastUpdaterTransactor) SetSubmissionWindow(opts *bind.TransactOpts, _submissionWindow uint8) (*types.Transaction, error) {
	return _IFastUpdater.contract.Transact(opts, "setSubmissionWindow", _submissionWindow)
}

// SetSubmissionWindow is a paid mutator transaction binding the contract method 0x0a166051.
//
// Solidity: function setSubmissionWindow(uint8 _submissionWindow) returns()
func (_IFastUpdater *IFastUpdaterSession) SetSubmissionWindow(_submissionWindow uint8) (*types.Transaction, error) {
	return _IFastUpdater.Contract.SetSubmissionWindow(&_IFastUpdater.TransactOpts, _submissionWindow)
}

// SetSubmissionWindow is a paid mutator transaction binding the contract method 0x0a166051.
//
// Solidity: function setSubmissionWindow(uint8 _submissionWindow) returns()
func (_IFastUpdater *IFastUpdaterTransactorSession) SetSubmissionWindow(_submissionWindow uint8) (*types.Transaction, error) {
	return _IFastUpdater.Contract.SetSubmissionWindow(&_IFastUpdater.TransactOpts, _submissionWindow)
}

// SubmitUpdates is a paid mutator transaction binding the contract method 0x470e91df.
//
// Solidity: function submitUpdates((uint256,(uint256,(uint256,uint256),uint256,uint256),bytes,(uint8,bytes32,bytes32)) _updates) returns()
func (_IFastUpdater *IFastUpdaterTransactor) SubmitUpdates(opts *bind.TransactOpts, _updates IFastUpdaterFastUpdates) (*types.Transaction, error) {
	return _IFastUpdater.contract.Transact(opts, "submitUpdates", _updates)
}

// SubmitUpdates is a paid mutator transaction binding the contract method 0x470e91df.
//
// Solidity: function submitUpdates((uint256,(uint256,(uint256,uint256),uint256,uint256),bytes,(uint8,bytes32,bytes32)) _updates) returns()
func (_IFastUpdater *IFastUpdaterSession) SubmitUpdates(_updates IFastUpdaterFastUpdates) (*types.Transaction, error) {
	return _IFastUpdater.Contract.SubmitUpdates(&_IFastUpdater.TransactOpts, _updates)
}

// SubmitUpdates is a paid mutator transaction binding the contract method 0x470e91df.
//
// Solidity: function submitUpdates((uint256,(uint256,(uint256,uint256),uint256,uint256),bytes,(uint8,bytes32,bytes32)) _updates) returns()
func (_IFastUpdater *IFastUpdaterTransactorSession) SubmitUpdates(_updates IFastUpdaterFastUpdates) (*types.Transaction, error) {
	return _IFastUpdater.Contract.SubmitUpdates(&_IFastUpdater.TransactOpts, _updates)
}

// SwitchToProductionMode is a paid mutator transaction binding the contract method 0xf5a98383.
//
// Solidity: function switchToProductionMode() returns()
func (_IFastUpdater *IFastUpdaterTransactor) SwitchToProductionMode(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _IFastUpdater.contract.Transact(opts, "switchToProductionMode")
}

// SwitchToProductionMode is a paid mutator transaction binding the contract method 0xf5a98383.
//
// Solidity: function switchToProductionMode() returns()
func (_IFastUpdater *IFastUpdaterSession) SwitchToProductionMode() (*types.Transaction, error) {
	return _IFastUpdater.Contract.SwitchToProductionMode(&_IFastUpdater.TransactOpts)
}

// SwitchToProductionMode is a paid mutator transaction binding the contract method 0xf5a98383.
//
// Solidity: function switchToProductionMode() returns()
func (_IFastUpdater *IFastUpdaterTransactorSession) SwitchToProductionMode() (*types.Transaction, error) {
	return _IFastUpdater.Contract.SwitchToProductionMode(&_IFastUpdater.TransactOpts)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_IFastUpdater *IFastUpdaterTransactor) UpdateContractAddresses(opts *bind.TransactOpts, _contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _IFastUpdater.contract.Transact(opts, "updateContractAddresses", _contractNameHashes, _contractAddresses)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_IFastUpdater *IFastUpdaterSession) UpdateContractAddresses(_contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _IFastUpdater.Contract.UpdateContractAddresses(&_IFastUpdater.TransactOpts, _contractNameHashes, _contractAddresses)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_IFastUpdater *IFastUpdaterTransactorSession) UpdateContractAddresses(_contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _IFastUpdater.Contract.UpdateContractAddresses(&_IFastUpdater.TransactOpts, _contractNameHashes, _contractAddresses)
}

// IFastUpdaterFastUpdateFeedRemovedIterator is returned from FilterFastUpdateFeedRemoved and is used to iterate over the raw logs and unpacked data for FastUpdateFeedRemoved events raised by the IFastUpdater contract.
type IFastUpdaterFastUpdateFeedRemovedIterator struct {
	Event *IFastUpdaterFastUpdateFeedRemoved // Event containing the contract specifics and raw log

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
func (it *IFastUpdaterFastUpdateFeedRemovedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(IFastUpdaterFastUpdateFeedRemoved)
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
		it.Event = new(IFastUpdaterFastUpdateFeedRemoved)
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
func (it *IFastUpdaterFastUpdateFeedRemovedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *IFastUpdaterFastUpdateFeedRemovedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// IFastUpdaterFastUpdateFeedRemoved represents a FastUpdateFeedRemoved event raised by the IFastUpdater contract.
type IFastUpdaterFastUpdateFeedRemoved struct {
	Index *big.Int
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterFastUpdateFeedRemoved is a free log retrieval operation binding the contract event 0x5a17f564b9fd53c971695a2e033e0cd39ee8ad08d8117242cdecad8b017335c8.
//
// Solidity: event FastUpdateFeedRemoved(uint256 indexed index)
func (_IFastUpdater *IFastUpdaterFilterer) FilterFastUpdateFeedRemoved(opts *bind.FilterOpts, index []*big.Int) (*IFastUpdaterFastUpdateFeedRemovedIterator, error) {

	var indexRule []interface{}
	for _, indexItem := range index {
		indexRule = append(indexRule, indexItem)
	}

	logs, sub, err := _IFastUpdater.contract.FilterLogs(opts, "FastUpdateFeedRemoved", indexRule)
	if err != nil {
		return nil, err
	}
	return &IFastUpdaterFastUpdateFeedRemovedIterator{contract: _IFastUpdater.contract, event: "FastUpdateFeedRemoved", logs: logs, sub: sub}, nil
}

// WatchFastUpdateFeedRemoved is a free log subscription operation binding the contract event 0x5a17f564b9fd53c971695a2e033e0cd39ee8ad08d8117242cdecad8b017335c8.
//
// Solidity: event FastUpdateFeedRemoved(uint256 indexed index)
func (_IFastUpdater *IFastUpdaterFilterer) WatchFastUpdateFeedRemoved(opts *bind.WatchOpts, sink chan<- *IFastUpdaterFastUpdateFeedRemoved, index []*big.Int) (event.Subscription, error) {

	var indexRule []interface{}
	for _, indexItem := range index {
		indexRule = append(indexRule, indexItem)
	}

	logs, sub, err := _IFastUpdater.contract.WatchLogs(opts, "FastUpdateFeedRemoved", indexRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(IFastUpdaterFastUpdateFeedRemoved)
				if err := _IFastUpdater.contract.UnpackLog(event, "FastUpdateFeedRemoved", log); err != nil {
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
func (_IFastUpdater *IFastUpdaterFilterer) ParseFastUpdateFeedRemoved(log types.Log) (*IFastUpdaterFastUpdateFeedRemoved, error) {
	event := new(IFastUpdaterFastUpdateFeedRemoved)
	if err := _IFastUpdater.contract.UnpackLog(event, "FastUpdateFeedRemoved", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// IFastUpdaterFastUpdateFeedResetIterator is returned from FilterFastUpdateFeedReset and is used to iterate over the raw logs and unpacked data for FastUpdateFeedReset events raised by the IFastUpdater contract.
type IFastUpdaterFastUpdateFeedResetIterator struct {
	Event *IFastUpdaterFastUpdateFeedReset // Event containing the contract specifics and raw log

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
func (it *IFastUpdaterFastUpdateFeedResetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(IFastUpdaterFastUpdateFeedReset)
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
		it.Event = new(IFastUpdaterFastUpdateFeedReset)
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
func (it *IFastUpdaterFastUpdateFeedResetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *IFastUpdaterFastUpdateFeedResetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// IFastUpdaterFastUpdateFeedReset represents a FastUpdateFeedReset event raised by the IFastUpdater contract.
type IFastUpdaterFastUpdateFeedReset struct {
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
func (_IFastUpdater *IFastUpdaterFilterer) FilterFastUpdateFeedReset(opts *bind.FilterOpts, votingRoundId []*big.Int, index []*big.Int, id [][21]byte) (*IFastUpdaterFastUpdateFeedResetIterator, error) {

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

	logs, sub, err := _IFastUpdater.contract.FilterLogs(opts, "FastUpdateFeedReset", votingRoundIdRule, indexRule, idRule)
	if err != nil {
		return nil, err
	}
	return &IFastUpdaterFastUpdateFeedResetIterator{contract: _IFastUpdater.contract, event: "FastUpdateFeedReset", logs: logs, sub: sub}, nil
}

// WatchFastUpdateFeedReset is a free log subscription operation binding the contract event 0xfa800fadb5e7b72652da40bcd7ca9a96cd4e53c9ea4c68b8afbba027e77a7cf5.
//
// Solidity: event FastUpdateFeedReset(uint256 indexed votingRoundId, uint256 indexed index, bytes21 indexed id, uint256 value, int8 decimals)
func (_IFastUpdater *IFastUpdaterFilterer) WatchFastUpdateFeedReset(opts *bind.WatchOpts, sink chan<- *IFastUpdaterFastUpdateFeedReset, votingRoundId []*big.Int, index []*big.Int, id [][21]byte) (event.Subscription, error) {

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

	logs, sub, err := _IFastUpdater.contract.WatchLogs(opts, "FastUpdateFeedReset", votingRoundIdRule, indexRule, idRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(IFastUpdaterFastUpdateFeedReset)
				if err := _IFastUpdater.contract.UnpackLog(event, "FastUpdateFeedReset", log); err != nil {
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
func (_IFastUpdater *IFastUpdaterFilterer) ParseFastUpdateFeedReset(log types.Log) (*IFastUpdaterFastUpdateFeedReset, error) {
	event := new(IFastUpdaterFastUpdateFeedReset)
	if err := _IFastUpdater.contract.UnpackLog(event, "FastUpdateFeedReset", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// IFastUpdaterFastUpdateFeedsIterator is returned from FilterFastUpdateFeeds and is used to iterate over the raw logs and unpacked data for FastUpdateFeeds events raised by the IFastUpdater contract.
type IFastUpdaterFastUpdateFeedsIterator struct {
	Event *IFastUpdaterFastUpdateFeeds // Event containing the contract specifics and raw log

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
func (it *IFastUpdaterFastUpdateFeedsIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(IFastUpdaterFastUpdateFeeds)
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
		it.Event = new(IFastUpdaterFastUpdateFeeds)
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
func (it *IFastUpdaterFastUpdateFeedsIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *IFastUpdaterFastUpdateFeedsIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// IFastUpdaterFastUpdateFeeds represents a FastUpdateFeeds event raised by the IFastUpdater contract.
type IFastUpdaterFastUpdateFeeds struct {
	VotingEpochId *big.Int
	Feeds         []*big.Int
	Decimals      []int8
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterFastUpdateFeeds is a free log retrieval operation binding the contract event 0x7195d3bbca575b55b0f4b62da395f7224b75225d9c08741d216e6cf10a83eabe.
//
// Solidity: event FastUpdateFeeds(uint256 indexed votingEpochId, uint256[] feeds, int8[] decimals)
func (_IFastUpdater *IFastUpdaterFilterer) FilterFastUpdateFeeds(opts *bind.FilterOpts, votingEpochId []*big.Int) (*IFastUpdaterFastUpdateFeedsIterator, error) {

	var votingEpochIdRule []interface{}
	for _, votingEpochIdItem := range votingEpochId {
		votingEpochIdRule = append(votingEpochIdRule, votingEpochIdItem)
	}

	logs, sub, err := _IFastUpdater.contract.FilterLogs(opts, "FastUpdateFeeds", votingEpochIdRule)
	if err != nil {
		return nil, err
	}
	return &IFastUpdaterFastUpdateFeedsIterator{contract: _IFastUpdater.contract, event: "FastUpdateFeeds", logs: logs, sub: sub}, nil
}

// WatchFastUpdateFeeds is a free log subscription operation binding the contract event 0x7195d3bbca575b55b0f4b62da395f7224b75225d9c08741d216e6cf10a83eabe.
//
// Solidity: event FastUpdateFeeds(uint256 indexed votingEpochId, uint256[] feeds, int8[] decimals)
func (_IFastUpdater *IFastUpdaterFilterer) WatchFastUpdateFeeds(opts *bind.WatchOpts, sink chan<- *IFastUpdaterFastUpdateFeeds, votingEpochId []*big.Int) (event.Subscription, error) {

	var votingEpochIdRule []interface{}
	for _, votingEpochIdItem := range votingEpochId {
		votingEpochIdRule = append(votingEpochIdRule, votingEpochIdItem)
	}

	logs, sub, err := _IFastUpdater.contract.WatchLogs(opts, "FastUpdateFeeds", votingEpochIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(IFastUpdaterFastUpdateFeeds)
				if err := _IFastUpdater.contract.UnpackLog(event, "FastUpdateFeeds", log); err != nil {
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
func (_IFastUpdater *IFastUpdaterFilterer) ParseFastUpdateFeeds(log types.Log) (*IFastUpdaterFastUpdateFeeds, error) {
	event := new(IFastUpdaterFastUpdateFeeds)
	if err := _IFastUpdater.contract.UnpackLog(event, "FastUpdateFeeds", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// IFastUpdaterFastUpdateFeedsSubmittedIterator is returned from FilterFastUpdateFeedsSubmitted and is used to iterate over the raw logs and unpacked data for FastUpdateFeedsSubmitted events raised by the IFastUpdater contract.
type IFastUpdaterFastUpdateFeedsSubmittedIterator struct {
	Event *IFastUpdaterFastUpdateFeedsSubmitted // Event containing the contract specifics and raw log

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
func (it *IFastUpdaterFastUpdateFeedsSubmittedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(IFastUpdaterFastUpdateFeedsSubmitted)
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
		it.Event = new(IFastUpdaterFastUpdateFeedsSubmitted)
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
func (it *IFastUpdaterFastUpdateFeedsSubmittedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *IFastUpdaterFastUpdateFeedsSubmittedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// IFastUpdaterFastUpdateFeedsSubmitted represents a FastUpdateFeedsSubmitted event raised by the IFastUpdater contract.
type IFastUpdaterFastUpdateFeedsSubmitted struct {
	VotingRoundId        uint32
	SigningPolicyAddress common.Address
	Raw                  types.Log // Blockchain specific contextual infos
}

// FilterFastUpdateFeedsSubmitted is a free log retrieval operation binding the contract event 0x63db91b14b3d088c677f046180aefcea7a236649704d90ce810cde455d38d936.
//
// Solidity: event FastUpdateFeedsSubmitted(uint32 indexed votingRoundId, address indexed signingPolicyAddress)
func (_IFastUpdater *IFastUpdaterFilterer) FilterFastUpdateFeedsSubmitted(opts *bind.FilterOpts, votingRoundId []uint32, signingPolicyAddress []common.Address) (*IFastUpdaterFastUpdateFeedsSubmittedIterator, error) {

	var votingRoundIdRule []interface{}
	for _, votingRoundIdItem := range votingRoundId {
		votingRoundIdRule = append(votingRoundIdRule, votingRoundIdItem)
	}
	var signingPolicyAddressRule []interface{}
	for _, signingPolicyAddressItem := range signingPolicyAddress {
		signingPolicyAddressRule = append(signingPolicyAddressRule, signingPolicyAddressItem)
	}

	logs, sub, err := _IFastUpdater.contract.FilterLogs(opts, "FastUpdateFeedsSubmitted", votingRoundIdRule, signingPolicyAddressRule)
	if err != nil {
		return nil, err
	}
	return &IFastUpdaterFastUpdateFeedsSubmittedIterator{contract: _IFastUpdater.contract, event: "FastUpdateFeedsSubmitted", logs: logs, sub: sub}, nil
}

// WatchFastUpdateFeedsSubmitted is a free log subscription operation binding the contract event 0x63db91b14b3d088c677f046180aefcea7a236649704d90ce810cde455d38d936.
//
// Solidity: event FastUpdateFeedsSubmitted(uint32 indexed votingRoundId, address indexed signingPolicyAddress)
func (_IFastUpdater *IFastUpdaterFilterer) WatchFastUpdateFeedsSubmitted(opts *bind.WatchOpts, sink chan<- *IFastUpdaterFastUpdateFeedsSubmitted, votingRoundId []uint32, signingPolicyAddress []common.Address) (event.Subscription, error) {

	var votingRoundIdRule []interface{}
	for _, votingRoundIdItem := range votingRoundId {
		votingRoundIdRule = append(votingRoundIdRule, votingRoundIdItem)
	}
	var signingPolicyAddressRule []interface{}
	for _, signingPolicyAddressItem := range signingPolicyAddress {
		signingPolicyAddressRule = append(signingPolicyAddressRule, signingPolicyAddressItem)
	}

	logs, sub, err := _IFastUpdater.contract.WatchLogs(opts, "FastUpdateFeedsSubmitted", votingRoundIdRule, signingPolicyAddressRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(IFastUpdaterFastUpdateFeedsSubmitted)
				if err := _IFastUpdater.contract.UnpackLog(event, "FastUpdateFeedsSubmitted", log); err != nil {
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
func (_IFastUpdater *IFastUpdaterFilterer) ParseFastUpdateFeedsSubmitted(log types.Log) (*IFastUpdaterFastUpdateFeedsSubmitted, error) {
	event := new(IFastUpdaterFastUpdateFeedsSubmitted)
	if err := _IFastUpdater.contract.UnpackLog(event, "FastUpdateFeedsSubmitted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// IFastUpdaterGovernanceCallTimelockedIterator is returned from FilterGovernanceCallTimelocked and is used to iterate over the raw logs and unpacked data for GovernanceCallTimelocked events raised by the IFastUpdater contract.
type IFastUpdaterGovernanceCallTimelockedIterator struct {
	Event *IFastUpdaterGovernanceCallTimelocked // Event containing the contract specifics and raw log

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
func (it *IFastUpdaterGovernanceCallTimelockedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(IFastUpdaterGovernanceCallTimelocked)
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
		it.Event = new(IFastUpdaterGovernanceCallTimelocked)
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
func (it *IFastUpdaterGovernanceCallTimelockedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *IFastUpdaterGovernanceCallTimelockedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// IFastUpdaterGovernanceCallTimelocked represents a GovernanceCallTimelocked event raised by the IFastUpdater contract.
type IFastUpdaterGovernanceCallTimelocked struct {
	Selector              [4]byte
	AllowedAfterTimestamp *big.Int
	EncodedCall           []byte
	Raw                   types.Log // Blockchain specific contextual infos
}

// FilterGovernanceCallTimelocked is a free log retrieval operation binding the contract event 0xed948300a3694aa01d4a6b258bfd664350193d770c0b51f8387277f6d83ea3b6.
//
// Solidity: event GovernanceCallTimelocked(bytes4 selector, uint256 allowedAfterTimestamp, bytes encodedCall)
func (_IFastUpdater *IFastUpdaterFilterer) FilterGovernanceCallTimelocked(opts *bind.FilterOpts) (*IFastUpdaterGovernanceCallTimelockedIterator, error) {

	logs, sub, err := _IFastUpdater.contract.FilterLogs(opts, "GovernanceCallTimelocked")
	if err != nil {
		return nil, err
	}
	return &IFastUpdaterGovernanceCallTimelockedIterator{contract: _IFastUpdater.contract, event: "GovernanceCallTimelocked", logs: logs, sub: sub}, nil
}

// WatchGovernanceCallTimelocked is a free log subscription operation binding the contract event 0xed948300a3694aa01d4a6b258bfd664350193d770c0b51f8387277f6d83ea3b6.
//
// Solidity: event GovernanceCallTimelocked(bytes4 selector, uint256 allowedAfterTimestamp, bytes encodedCall)
func (_IFastUpdater *IFastUpdaterFilterer) WatchGovernanceCallTimelocked(opts *bind.WatchOpts, sink chan<- *IFastUpdaterGovernanceCallTimelocked) (event.Subscription, error) {

	logs, sub, err := _IFastUpdater.contract.WatchLogs(opts, "GovernanceCallTimelocked")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(IFastUpdaterGovernanceCallTimelocked)
				if err := _IFastUpdater.contract.UnpackLog(event, "GovernanceCallTimelocked", log); err != nil {
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
func (_IFastUpdater *IFastUpdaterFilterer) ParseGovernanceCallTimelocked(log types.Log) (*IFastUpdaterGovernanceCallTimelocked, error) {
	event := new(IFastUpdaterGovernanceCallTimelocked)
	if err := _IFastUpdater.contract.UnpackLog(event, "GovernanceCallTimelocked", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// IFastUpdaterGovernanceInitialisedIterator is returned from FilterGovernanceInitialised and is used to iterate over the raw logs and unpacked data for GovernanceInitialised events raised by the IFastUpdater contract.
type IFastUpdaterGovernanceInitialisedIterator struct {
	Event *IFastUpdaterGovernanceInitialised // Event containing the contract specifics and raw log

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
func (it *IFastUpdaterGovernanceInitialisedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(IFastUpdaterGovernanceInitialised)
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
		it.Event = new(IFastUpdaterGovernanceInitialised)
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
func (it *IFastUpdaterGovernanceInitialisedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *IFastUpdaterGovernanceInitialisedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// IFastUpdaterGovernanceInitialised represents a GovernanceInitialised event raised by the IFastUpdater contract.
type IFastUpdaterGovernanceInitialised struct {
	InitialGovernance common.Address
	Raw               types.Log // Blockchain specific contextual infos
}

// FilterGovernanceInitialised is a free log retrieval operation binding the contract event 0x9789733827840833afc031fb2ef9ab6894271f77bad2085687cf4ae5c7bee4db.
//
// Solidity: event GovernanceInitialised(address initialGovernance)
func (_IFastUpdater *IFastUpdaterFilterer) FilterGovernanceInitialised(opts *bind.FilterOpts) (*IFastUpdaterGovernanceInitialisedIterator, error) {

	logs, sub, err := _IFastUpdater.contract.FilterLogs(opts, "GovernanceInitialised")
	if err != nil {
		return nil, err
	}
	return &IFastUpdaterGovernanceInitialisedIterator{contract: _IFastUpdater.contract, event: "GovernanceInitialised", logs: logs, sub: sub}, nil
}

// WatchGovernanceInitialised is a free log subscription operation binding the contract event 0x9789733827840833afc031fb2ef9ab6894271f77bad2085687cf4ae5c7bee4db.
//
// Solidity: event GovernanceInitialised(address initialGovernance)
func (_IFastUpdater *IFastUpdaterFilterer) WatchGovernanceInitialised(opts *bind.WatchOpts, sink chan<- *IFastUpdaterGovernanceInitialised) (event.Subscription, error) {

	logs, sub, err := _IFastUpdater.contract.WatchLogs(opts, "GovernanceInitialised")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(IFastUpdaterGovernanceInitialised)
				if err := _IFastUpdater.contract.UnpackLog(event, "GovernanceInitialised", log); err != nil {
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
func (_IFastUpdater *IFastUpdaterFilterer) ParseGovernanceInitialised(log types.Log) (*IFastUpdaterGovernanceInitialised, error) {
	event := new(IFastUpdaterGovernanceInitialised)
	if err := _IFastUpdater.contract.UnpackLog(event, "GovernanceInitialised", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// IFastUpdaterGovernedProductionModeEnteredIterator is returned from FilterGovernedProductionModeEntered and is used to iterate over the raw logs and unpacked data for GovernedProductionModeEntered events raised by the IFastUpdater contract.
type IFastUpdaterGovernedProductionModeEnteredIterator struct {
	Event *IFastUpdaterGovernedProductionModeEntered // Event containing the contract specifics and raw log

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
func (it *IFastUpdaterGovernedProductionModeEnteredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(IFastUpdaterGovernedProductionModeEntered)
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
		it.Event = new(IFastUpdaterGovernedProductionModeEntered)
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
func (it *IFastUpdaterGovernedProductionModeEnteredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *IFastUpdaterGovernedProductionModeEnteredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// IFastUpdaterGovernedProductionModeEntered represents a GovernedProductionModeEntered event raised by the IFastUpdater contract.
type IFastUpdaterGovernedProductionModeEntered struct {
	GovernanceSettings common.Address
	Raw                types.Log // Blockchain specific contextual infos
}

// FilterGovernedProductionModeEntered is a free log retrieval operation binding the contract event 0x83af113638b5422f9e977cebc0aaf0eaf2188eb9a8baae7f9d46c42b33a1560c.
//
// Solidity: event GovernedProductionModeEntered(address governanceSettings)
func (_IFastUpdater *IFastUpdaterFilterer) FilterGovernedProductionModeEntered(opts *bind.FilterOpts) (*IFastUpdaterGovernedProductionModeEnteredIterator, error) {

	logs, sub, err := _IFastUpdater.contract.FilterLogs(opts, "GovernedProductionModeEntered")
	if err != nil {
		return nil, err
	}
	return &IFastUpdaterGovernedProductionModeEnteredIterator{contract: _IFastUpdater.contract, event: "GovernedProductionModeEntered", logs: logs, sub: sub}, nil
}

// WatchGovernedProductionModeEntered is a free log subscription operation binding the contract event 0x83af113638b5422f9e977cebc0aaf0eaf2188eb9a8baae7f9d46c42b33a1560c.
//
// Solidity: event GovernedProductionModeEntered(address governanceSettings)
func (_IFastUpdater *IFastUpdaterFilterer) WatchGovernedProductionModeEntered(opts *bind.WatchOpts, sink chan<- *IFastUpdaterGovernedProductionModeEntered) (event.Subscription, error) {

	logs, sub, err := _IFastUpdater.contract.WatchLogs(opts, "GovernedProductionModeEntered")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(IFastUpdaterGovernedProductionModeEntered)
				if err := _IFastUpdater.contract.UnpackLog(event, "GovernedProductionModeEntered", log); err != nil {
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
func (_IFastUpdater *IFastUpdaterFilterer) ParseGovernedProductionModeEntered(log types.Log) (*IFastUpdaterGovernedProductionModeEntered, error) {
	event := new(IFastUpdaterGovernedProductionModeEntered)
	if err := _IFastUpdater.contract.UnpackLog(event, "GovernedProductionModeEntered", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// IFastUpdaterTimelockedGovernanceCallCanceledIterator is returned from FilterTimelockedGovernanceCallCanceled and is used to iterate over the raw logs and unpacked data for TimelockedGovernanceCallCanceled events raised by the IFastUpdater contract.
type IFastUpdaterTimelockedGovernanceCallCanceledIterator struct {
	Event *IFastUpdaterTimelockedGovernanceCallCanceled // Event containing the contract specifics and raw log

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
func (it *IFastUpdaterTimelockedGovernanceCallCanceledIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(IFastUpdaterTimelockedGovernanceCallCanceled)
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
		it.Event = new(IFastUpdaterTimelockedGovernanceCallCanceled)
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
func (it *IFastUpdaterTimelockedGovernanceCallCanceledIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *IFastUpdaterTimelockedGovernanceCallCanceledIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// IFastUpdaterTimelockedGovernanceCallCanceled represents a TimelockedGovernanceCallCanceled event raised by the IFastUpdater contract.
type IFastUpdaterTimelockedGovernanceCallCanceled struct {
	Selector  [4]byte
	Timestamp *big.Int
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterTimelockedGovernanceCallCanceled is a free log retrieval operation binding the contract event 0x7735b2391c38a81419c513e30ca578db7158eadd7101511b23e221c654d19cf8.
//
// Solidity: event TimelockedGovernanceCallCanceled(bytes4 selector, uint256 timestamp)
func (_IFastUpdater *IFastUpdaterFilterer) FilterTimelockedGovernanceCallCanceled(opts *bind.FilterOpts) (*IFastUpdaterTimelockedGovernanceCallCanceledIterator, error) {

	logs, sub, err := _IFastUpdater.contract.FilterLogs(opts, "TimelockedGovernanceCallCanceled")
	if err != nil {
		return nil, err
	}
	return &IFastUpdaterTimelockedGovernanceCallCanceledIterator{contract: _IFastUpdater.contract, event: "TimelockedGovernanceCallCanceled", logs: logs, sub: sub}, nil
}

// WatchTimelockedGovernanceCallCanceled is a free log subscription operation binding the contract event 0x7735b2391c38a81419c513e30ca578db7158eadd7101511b23e221c654d19cf8.
//
// Solidity: event TimelockedGovernanceCallCanceled(bytes4 selector, uint256 timestamp)
func (_IFastUpdater *IFastUpdaterFilterer) WatchTimelockedGovernanceCallCanceled(opts *bind.WatchOpts, sink chan<- *IFastUpdaterTimelockedGovernanceCallCanceled) (event.Subscription, error) {

	logs, sub, err := _IFastUpdater.contract.WatchLogs(opts, "TimelockedGovernanceCallCanceled")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(IFastUpdaterTimelockedGovernanceCallCanceled)
				if err := _IFastUpdater.contract.UnpackLog(event, "TimelockedGovernanceCallCanceled", log); err != nil {
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
func (_IFastUpdater *IFastUpdaterFilterer) ParseTimelockedGovernanceCallCanceled(log types.Log) (*IFastUpdaterTimelockedGovernanceCallCanceled, error) {
	event := new(IFastUpdaterTimelockedGovernanceCallCanceled)
	if err := _IFastUpdater.contract.UnpackLog(event, "TimelockedGovernanceCallCanceled", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// IFastUpdaterTimelockedGovernanceCallExecutedIterator is returned from FilterTimelockedGovernanceCallExecuted and is used to iterate over the raw logs and unpacked data for TimelockedGovernanceCallExecuted events raised by the IFastUpdater contract.
type IFastUpdaterTimelockedGovernanceCallExecutedIterator struct {
	Event *IFastUpdaterTimelockedGovernanceCallExecuted // Event containing the contract specifics and raw log

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
func (it *IFastUpdaterTimelockedGovernanceCallExecutedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(IFastUpdaterTimelockedGovernanceCallExecuted)
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
		it.Event = new(IFastUpdaterTimelockedGovernanceCallExecuted)
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
func (it *IFastUpdaterTimelockedGovernanceCallExecutedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *IFastUpdaterTimelockedGovernanceCallExecutedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// IFastUpdaterTimelockedGovernanceCallExecuted represents a TimelockedGovernanceCallExecuted event raised by the IFastUpdater contract.
type IFastUpdaterTimelockedGovernanceCallExecuted struct {
	Selector  [4]byte
	Timestamp *big.Int
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterTimelockedGovernanceCallExecuted is a free log retrieval operation binding the contract event 0xa7326b57fc9cfe267aaea5e7f0b01757154d265620a0585819416ee9ddd2c438.
//
// Solidity: event TimelockedGovernanceCallExecuted(bytes4 selector, uint256 timestamp)
func (_IFastUpdater *IFastUpdaterFilterer) FilterTimelockedGovernanceCallExecuted(opts *bind.FilterOpts) (*IFastUpdaterTimelockedGovernanceCallExecutedIterator, error) {

	logs, sub, err := _IFastUpdater.contract.FilterLogs(opts, "TimelockedGovernanceCallExecuted")
	if err != nil {
		return nil, err
	}
	return &IFastUpdaterTimelockedGovernanceCallExecutedIterator{contract: _IFastUpdater.contract, event: "TimelockedGovernanceCallExecuted", logs: logs, sub: sub}, nil
}

// WatchTimelockedGovernanceCallExecuted is a free log subscription operation binding the contract event 0xa7326b57fc9cfe267aaea5e7f0b01757154d265620a0585819416ee9ddd2c438.
//
// Solidity: event TimelockedGovernanceCallExecuted(bytes4 selector, uint256 timestamp)
func (_IFastUpdater *IFastUpdaterFilterer) WatchTimelockedGovernanceCallExecuted(opts *bind.WatchOpts, sink chan<- *IFastUpdaterTimelockedGovernanceCallExecuted) (event.Subscription, error) {

	logs, sub, err := _IFastUpdater.contract.WatchLogs(opts, "TimelockedGovernanceCallExecuted")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(IFastUpdaterTimelockedGovernanceCallExecuted)
				if err := _IFastUpdater.contract.UnpackLog(event, "TimelockedGovernanceCallExecuted", log); err != nil {
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
func (_IFastUpdater *IFastUpdaterFilterer) ParseTimelockedGovernanceCallExecuted(log types.Log) (*IFastUpdaterTimelockedGovernanceCallExecuted, error) {
	event := new(IFastUpdaterTimelockedGovernanceCallExecuted)
	if err := _IFastUpdater.contract.UnpackLog(event, "TimelockedGovernanceCallExecuted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
