// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package coston2

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

// IFastUpdateIncentiveManagerIncentiveOffer is an auto generated low-level Go binding around an user-defined struct.
type IFastUpdateIncentiveManagerIncentiveOffer struct {
	RangeIncrease *big.Int
	RangeLimit    *big.Int
}

// IFastUpdatesConfigurationFeedConfiguration is an auto generated low-level Go binding around an user-defined struct.
type IFastUpdatesConfigurationFeedConfiguration struct {
	FeedId          [21]byte
	RewardBandValue uint32
	InflationShare  *big.Int
}

// FastUpdatesIncentiveManagerMetaData contains all meta data concerning the FastUpdatesIncentiveManager contract.
var FastUpdatesIncentiveManagerMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"contractIGovernanceSettings\",\"name\":\"_governanceSettings\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_initialGovernance\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_addressUpdater\",\"type\":\"address\"},{\"internalType\":\"SampleSize\",\"name\":\"_ss\",\"type\":\"uint256\"},{\"internalType\":\"Range\",\"name\":\"_r\",\"type\":\"uint256\"},{\"internalType\":\"SampleSize\",\"name\":\"_sil\",\"type\":\"uint256\"},{\"internalType\":\"Range\",\"name\":\"_ril\",\"type\":\"uint256\"},{\"internalType\":\"Fee\",\"name\":\"_x\",\"type\":\"uint256\"},{\"internalType\":\"Fee\",\"name\":\"_rip\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_dur\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"authorizedAmountWei\",\"type\":\"uint256\"}],\"name\":\"DailyAuthorizedInflationSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes4\",\"name\":\"selector\",\"type\":\"bytes4\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"allowedAfterTimestamp\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"encodedCall\",\"type\":\"bytes\"}],\"name\":\"GovernanceCallTimelocked\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"initialGovernance\",\"type\":\"address\"}],\"name\":\"GovernanceInitialised\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"governanceSettings\",\"type\":\"address\"}],\"name\":\"GovernedProductionModeEntered\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint24\",\"name\":\"rewardEpochId\",\"type\":\"uint24\"},{\"indexed\":false,\"internalType\":\"Range\",\"name\":\"rangeIncrease\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"SampleSize\",\"name\":\"sampleSizeIncrease\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"Fee\",\"name\":\"offerAmount\",\"type\":\"uint256\"}],\"name\":\"IncentiveOffered\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amountReceivedWei\",\"type\":\"uint256\"}],\"name\":\"InflationReceived\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint24\",\"name\":\"rewardEpochId\",\"type\":\"uint24\"},{\"components\":[{\"internalType\":\"bytes21\",\"name\":\"feedId\",\"type\":\"bytes21\"},{\"internalType\":\"uint32\",\"name\":\"rewardBandValue\",\"type\":\"uint32\"},{\"internalType\":\"uint24\",\"name\":\"inflationShare\",\"type\":\"uint24\"}],\"indexed\":false,\"internalType\":\"structIFastUpdatesConfiguration.FeedConfiguration[]\",\"name\":\"feedConfigurations\",\"type\":\"tuple[]\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"InflationRewardsOffered\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes4\",\"name\":\"selector\",\"type\":\"bytes4\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"TimelockedGovernanceCallCanceled\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes4\",\"name\":\"selector\",\"type\":\"bytes4\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"TimelockedGovernanceCallExecuted\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"advance\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"_selector\",\"type\":\"bytes4\"}],\"name\":\"cancelGovernanceCall\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"dailyAuthorizedInflation\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"_selector\",\"type\":\"bytes4\"}],\"name\":\"executeGovernanceCall\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"fastUpdater\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"fastUpdatesConfiguration\",\"outputs\":[{\"internalType\":\"contractIFastUpdatesConfiguration\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"flareSystemsManager\",\"outputs\":[{\"internalType\":\"contractIIFlareSystemsManager\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getAddressUpdater\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"_addressUpdater\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getBaseScale\",\"outputs\":[{\"internalType\":\"Scale\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getContractName\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getCurrentSampleSizeIncreasePrice\",\"outputs\":[{\"internalType\":\"Fee\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getExpectedBalance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getExpectedSampleSize\",\"outputs\":[{\"internalType\":\"SampleSize\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getIncentiveDuration\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getInflationAddress\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getPrecision\",\"outputs\":[{\"internalType\":\"Precision\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getRange\",\"outputs\":[{\"internalType\":\"Range\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getScale\",\"outputs\":[{\"internalType\":\"Scale\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getTokenPoolSupplyData\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"_lockedFundsWei\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_totalInflationAuthorizedWei\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_totalClaimedWei\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"governance\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"governanceSettings\",\"outputs\":[{\"internalType\":\"contractIGovernanceSettings\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contractIGovernanceSettings\",\"name\":\"_governanceSettings\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_initialGovernance\",\"type\":\"address\"}],\"name\":\"initialise\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_address\",\"type\":\"address\"}],\"name\":\"isExecutor\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"lastInflationAuthorizationReceivedTs\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"lastInflationReceivedTs\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"Range\",\"name\":\"rangeIncrease\",\"type\":\"uint256\"},{\"internalType\":\"Range\",\"name\":\"rangeLimit\",\"type\":\"uint256\"}],\"internalType\":\"structIFastUpdateIncentiveManager.IncentiveOffer\",\"name\":\"_offer\",\"type\":\"tuple\"}],\"name\":\"offerIncentive\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"productionMode\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"rangeIncreaseLimit\",\"outputs\":[{\"internalType\":\"Range\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"rangeIncreasePrice\",\"outputs\":[{\"internalType\":\"Fee\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"receiveInflation\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"rewardManager\",\"outputs\":[{\"internalType\":\"contractIIRewardManager\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"sampleIncreaseLimit\",\"outputs\":[{\"internalType\":\"SampleSize\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_toAuthorizeWei\",\"type\":\"uint256\"}],\"name\":\"setDailyAuthorizedInflation\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"SampleSize\",\"name\":\"_ss\",\"type\":\"uint256\"},{\"internalType\":\"Range\",\"name\":\"_r\",\"type\":\"uint256\"},{\"internalType\":\"Fee\",\"name\":\"_x\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_dur\",\"type\":\"uint256\"}],\"name\":\"setIncentiveParameters\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"Range\",\"name\":\"_lim\",\"type\":\"uint256\"}],\"name\":\"setRangeIncreaseLimit\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"Fee\",\"name\":\"_price\",\"type\":\"uint256\"}],\"name\":\"setRangeIncreasePrice\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"SampleSize\",\"name\":\"_lim\",\"type\":\"uint256\"}],\"name\":\"setSampleIncreaseLimit\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"switchToProductionMode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"selector\",\"type\":\"bytes4\"}],\"name\":\"timelockedCalls\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"allowedAfterTimestamp\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"encodedCall\",\"type\":\"bytes\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalInflationAuthorizedWei\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalInflationReceivedWei\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalInflationRewardsOfferedWei\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint24\",\"name\":\"_currentRewardEpochId\",\"type\":\"uint24\"},{\"internalType\":\"uint64\",\"name\":\"_currentRewardEpochExpectedEndTs\",\"type\":\"uint64\"},{\"internalType\":\"uint64\",\"name\":\"_rewardEpochDurationSeconds\",\"type\":\"uint64\"}],\"name\":\"triggerRewardEpochSwitchover\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"_contractNameHashes\",\"type\":\"bytes32[]\"},{\"internalType\":\"address[]\",\"name\":\"_contractAddresses\",\"type\":\"address[]\"}],\"name\":\"updateContractAddresses\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
}

// FastUpdatesIncentiveManagerABI is the input ABI used to generate the binding from.
// Deprecated: Use FastUpdatesIncentiveManagerMetaData.ABI instead.
var FastUpdatesIncentiveManagerABI = FastUpdatesIncentiveManagerMetaData.ABI

// FastUpdatesIncentiveManager is an auto generated Go binding around an Ethereum contract.
type FastUpdatesIncentiveManager struct {
	FastUpdatesIncentiveManagerCaller     // Read-only binding to the contract
	FastUpdatesIncentiveManagerTransactor // Write-only binding to the contract
	FastUpdatesIncentiveManagerFilterer   // Log filterer for contract events
}

// FastUpdatesIncentiveManagerCaller is an auto generated read-only Go binding around an Ethereum contract.
type FastUpdatesIncentiveManagerCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FastUpdatesIncentiveManagerTransactor is an auto generated write-only Go binding around an Ethereum contract.
type FastUpdatesIncentiveManagerTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FastUpdatesIncentiveManagerFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type FastUpdatesIncentiveManagerFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FastUpdatesIncentiveManagerSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type FastUpdatesIncentiveManagerSession struct {
	Contract     *FastUpdatesIncentiveManager // Generic contract binding to set the session for
	CallOpts     bind.CallOpts                // Call options to use throughout this session
	TransactOpts bind.TransactOpts            // Transaction auth options to use throughout this session
}

// FastUpdatesIncentiveManagerCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type FastUpdatesIncentiveManagerCallerSession struct {
	Contract *FastUpdatesIncentiveManagerCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts                      // Call options to use throughout this session
}

// FastUpdatesIncentiveManagerTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type FastUpdatesIncentiveManagerTransactorSession struct {
	Contract     *FastUpdatesIncentiveManagerTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts                      // Transaction auth options to use throughout this session
}

// FastUpdatesIncentiveManagerRaw is an auto generated low-level Go binding around an Ethereum contract.
type FastUpdatesIncentiveManagerRaw struct {
	Contract *FastUpdatesIncentiveManager // Generic contract binding to access the raw methods on
}

// FastUpdatesIncentiveManagerCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type FastUpdatesIncentiveManagerCallerRaw struct {
	Contract *FastUpdatesIncentiveManagerCaller // Generic read-only contract binding to access the raw methods on
}

// FastUpdatesIncentiveManagerTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type FastUpdatesIncentiveManagerTransactorRaw struct {
	Contract *FastUpdatesIncentiveManagerTransactor // Generic write-only contract binding to access the raw methods on
}

// NewFastUpdatesIncentiveManager creates a new instance of FastUpdatesIncentiveManager, bound to a specific deployed contract.
func NewFastUpdatesIncentiveManager(address common.Address, backend bind.ContractBackend) (*FastUpdatesIncentiveManager, error) {
	contract, err := bindFastUpdatesIncentiveManager(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &FastUpdatesIncentiveManager{FastUpdatesIncentiveManagerCaller: FastUpdatesIncentiveManagerCaller{contract: contract}, FastUpdatesIncentiveManagerTransactor: FastUpdatesIncentiveManagerTransactor{contract: contract}, FastUpdatesIncentiveManagerFilterer: FastUpdatesIncentiveManagerFilterer{contract: contract}}, nil
}

// NewFastUpdatesIncentiveManagerCaller creates a new read-only instance of FastUpdatesIncentiveManager, bound to a specific deployed contract.
func NewFastUpdatesIncentiveManagerCaller(address common.Address, caller bind.ContractCaller) (*FastUpdatesIncentiveManagerCaller, error) {
	contract, err := bindFastUpdatesIncentiveManager(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &FastUpdatesIncentiveManagerCaller{contract: contract}, nil
}

// NewFastUpdatesIncentiveManagerTransactor creates a new write-only instance of FastUpdatesIncentiveManager, bound to a specific deployed contract.
func NewFastUpdatesIncentiveManagerTransactor(address common.Address, transactor bind.ContractTransactor) (*FastUpdatesIncentiveManagerTransactor, error) {
	contract, err := bindFastUpdatesIncentiveManager(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &FastUpdatesIncentiveManagerTransactor{contract: contract}, nil
}

// NewFastUpdatesIncentiveManagerFilterer creates a new log filterer instance of FastUpdatesIncentiveManager, bound to a specific deployed contract.
func NewFastUpdatesIncentiveManagerFilterer(address common.Address, filterer bind.ContractFilterer) (*FastUpdatesIncentiveManagerFilterer, error) {
	contract, err := bindFastUpdatesIncentiveManager(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &FastUpdatesIncentiveManagerFilterer{contract: contract}, nil
}

// bindFastUpdatesIncentiveManager binds a generic wrapper to an already deployed contract.
func bindFastUpdatesIncentiveManager(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := FastUpdatesIncentiveManagerMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FastUpdatesIncentiveManager.Contract.FastUpdatesIncentiveManagerCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.FastUpdatesIncentiveManagerTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.FastUpdatesIncentiveManagerTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FastUpdatesIncentiveManager.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.contract.Transact(opts, method, params...)
}

// DailyAuthorizedInflation is a free data retrieval call binding the contract method 0x708e34ce.
//
// Solidity: function dailyAuthorizedInflation() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) DailyAuthorizedInflation(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "dailyAuthorizedInflation")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// DailyAuthorizedInflation is a free data retrieval call binding the contract method 0x708e34ce.
//
// Solidity: function dailyAuthorizedInflation() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) DailyAuthorizedInflation() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.DailyAuthorizedInflation(&_FastUpdatesIncentiveManager.CallOpts)
}

// DailyAuthorizedInflation is a free data retrieval call binding the contract method 0x708e34ce.
//
// Solidity: function dailyAuthorizedInflation() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) DailyAuthorizedInflation() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.DailyAuthorizedInflation(&_FastUpdatesIncentiveManager.CallOpts)
}

// FastUpdater is a free data retrieval call binding the contract method 0xd29a4fa9.
//
// Solidity: function fastUpdater() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) FastUpdater(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "fastUpdater")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FastUpdater is a free data retrieval call binding the contract method 0xd29a4fa9.
//
// Solidity: function fastUpdater() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) FastUpdater() (common.Address, error) {
	return _FastUpdatesIncentiveManager.Contract.FastUpdater(&_FastUpdatesIncentiveManager.CallOpts)
}

// FastUpdater is a free data retrieval call binding the contract method 0xd29a4fa9.
//
// Solidity: function fastUpdater() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) FastUpdater() (common.Address, error) {
	return _FastUpdatesIncentiveManager.Contract.FastUpdater(&_FastUpdatesIncentiveManager.CallOpts)
}

// FastUpdatesConfiguration is a free data retrieval call binding the contract method 0xc10f489a.
//
// Solidity: function fastUpdatesConfiguration() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) FastUpdatesConfiguration(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "fastUpdatesConfiguration")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FastUpdatesConfiguration is a free data retrieval call binding the contract method 0xc10f489a.
//
// Solidity: function fastUpdatesConfiguration() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) FastUpdatesConfiguration() (common.Address, error) {
	return _FastUpdatesIncentiveManager.Contract.FastUpdatesConfiguration(&_FastUpdatesIncentiveManager.CallOpts)
}

// FastUpdatesConfiguration is a free data retrieval call binding the contract method 0xc10f489a.
//
// Solidity: function fastUpdatesConfiguration() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) FastUpdatesConfiguration() (common.Address, error) {
	return _FastUpdatesIncentiveManager.Contract.FastUpdatesConfiguration(&_FastUpdatesIncentiveManager.CallOpts)
}

// FlareSystemsManager is a free data retrieval call binding the contract method 0xfaae7fc9.
//
// Solidity: function flareSystemsManager() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) FlareSystemsManager(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "flareSystemsManager")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FlareSystemsManager is a free data retrieval call binding the contract method 0xfaae7fc9.
//
// Solidity: function flareSystemsManager() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) FlareSystemsManager() (common.Address, error) {
	return _FastUpdatesIncentiveManager.Contract.FlareSystemsManager(&_FastUpdatesIncentiveManager.CallOpts)
}

// FlareSystemsManager is a free data retrieval call binding the contract method 0xfaae7fc9.
//
// Solidity: function flareSystemsManager() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) FlareSystemsManager() (common.Address, error) {
	return _FastUpdatesIncentiveManager.Contract.FlareSystemsManager(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) GetAddressUpdater(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "getAddressUpdater")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) GetAddressUpdater() (common.Address, error) {
	return _FastUpdatesIncentiveManager.Contract.GetAddressUpdater(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetAddressUpdater is a free data retrieval call binding the contract method 0x5267a15d.
//
// Solidity: function getAddressUpdater() view returns(address _addressUpdater)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) GetAddressUpdater() (common.Address, error) {
	return _FastUpdatesIncentiveManager.Contract.GetAddressUpdater(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetBaseScale is a free data retrieval call binding the contract method 0x7a68533f.
//
// Solidity: function getBaseScale() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) GetBaseScale(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "getBaseScale")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetBaseScale is a free data retrieval call binding the contract method 0x7a68533f.
//
// Solidity: function getBaseScale() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) GetBaseScale() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.GetBaseScale(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetBaseScale is a free data retrieval call binding the contract method 0x7a68533f.
//
// Solidity: function getBaseScale() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) GetBaseScale() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.GetBaseScale(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetContractName is a free data retrieval call binding the contract method 0xf5f5ba72.
//
// Solidity: function getContractName() pure returns(string)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) GetContractName(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "getContractName")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetContractName is a free data retrieval call binding the contract method 0xf5f5ba72.
//
// Solidity: function getContractName() pure returns(string)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) GetContractName() (string, error) {
	return _FastUpdatesIncentiveManager.Contract.GetContractName(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetContractName is a free data retrieval call binding the contract method 0xf5f5ba72.
//
// Solidity: function getContractName() pure returns(string)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) GetContractName() (string, error) {
	return _FastUpdatesIncentiveManager.Contract.GetContractName(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetCurrentSampleSizeIncreasePrice is a free data retrieval call binding the contract method 0x2de490c3.
//
// Solidity: function getCurrentSampleSizeIncreasePrice() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) GetCurrentSampleSizeIncreasePrice(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "getCurrentSampleSizeIncreasePrice")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetCurrentSampleSizeIncreasePrice is a free data retrieval call binding the contract method 0x2de490c3.
//
// Solidity: function getCurrentSampleSizeIncreasePrice() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) GetCurrentSampleSizeIncreasePrice() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.GetCurrentSampleSizeIncreasePrice(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetCurrentSampleSizeIncreasePrice is a free data retrieval call binding the contract method 0x2de490c3.
//
// Solidity: function getCurrentSampleSizeIncreasePrice() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) GetCurrentSampleSizeIncreasePrice() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.GetCurrentSampleSizeIncreasePrice(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetExpectedBalance is a free data retrieval call binding the contract method 0xaf04cd3b.
//
// Solidity: function getExpectedBalance() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) GetExpectedBalance(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "getExpectedBalance")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetExpectedBalance is a free data retrieval call binding the contract method 0xaf04cd3b.
//
// Solidity: function getExpectedBalance() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) GetExpectedBalance() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.GetExpectedBalance(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetExpectedBalance is a free data retrieval call binding the contract method 0xaf04cd3b.
//
// Solidity: function getExpectedBalance() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) GetExpectedBalance() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.GetExpectedBalance(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetExpectedSampleSize is a free data retrieval call binding the contract method 0x6d62b413.
//
// Solidity: function getExpectedSampleSize() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) GetExpectedSampleSize(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "getExpectedSampleSize")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetExpectedSampleSize is a free data retrieval call binding the contract method 0x6d62b413.
//
// Solidity: function getExpectedSampleSize() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) GetExpectedSampleSize() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.GetExpectedSampleSize(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetExpectedSampleSize is a free data retrieval call binding the contract method 0x6d62b413.
//
// Solidity: function getExpectedSampleSize() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) GetExpectedSampleSize() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.GetExpectedSampleSize(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetIncentiveDuration is a free data retrieval call binding the contract method 0xdd8dca9f.
//
// Solidity: function getIncentiveDuration() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) GetIncentiveDuration(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "getIncentiveDuration")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetIncentiveDuration is a free data retrieval call binding the contract method 0xdd8dca9f.
//
// Solidity: function getIncentiveDuration() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) GetIncentiveDuration() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.GetIncentiveDuration(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetIncentiveDuration is a free data retrieval call binding the contract method 0xdd8dca9f.
//
// Solidity: function getIncentiveDuration() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) GetIncentiveDuration() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.GetIncentiveDuration(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetInflationAddress is a free data retrieval call binding the contract method 0xed39d3f8.
//
// Solidity: function getInflationAddress() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) GetInflationAddress(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "getInflationAddress")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetInflationAddress is a free data retrieval call binding the contract method 0xed39d3f8.
//
// Solidity: function getInflationAddress() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) GetInflationAddress() (common.Address, error) {
	return _FastUpdatesIncentiveManager.Contract.GetInflationAddress(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetInflationAddress is a free data retrieval call binding the contract method 0xed39d3f8.
//
// Solidity: function getInflationAddress() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) GetInflationAddress() (common.Address, error) {
	return _FastUpdatesIncentiveManager.Contract.GetInflationAddress(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetPrecision is a free data retrieval call binding the contract method 0x9670c0bc.
//
// Solidity: function getPrecision() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) GetPrecision(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "getPrecision")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetPrecision is a free data retrieval call binding the contract method 0x9670c0bc.
//
// Solidity: function getPrecision() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) GetPrecision() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.GetPrecision(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetPrecision is a free data retrieval call binding the contract method 0x9670c0bc.
//
// Solidity: function getPrecision() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) GetPrecision() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.GetPrecision(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetRange is a free data retrieval call binding the contract method 0x9b85961f.
//
// Solidity: function getRange() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) GetRange(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "getRange")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetRange is a free data retrieval call binding the contract method 0x9b85961f.
//
// Solidity: function getRange() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) GetRange() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.GetRange(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetRange is a free data retrieval call binding the contract method 0x9b85961f.
//
// Solidity: function getRange() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) GetRange() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.GetRange(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetScale is a free data retrieval call binding the contract method 0xb5cddab8.
//
// Solidity: function getScale() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) GetScale(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "getScale")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetScale is a free data retrieval call binding the contract method 0xb5cddab8.
//
// Solidity: function getScale() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) GetScale() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.GetScale(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetScale is a free data retrieval call binding the contract method 0xb5cddab8.
//
// Solidity: function getScale() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) GetScale() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.GetScale(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetTokenPoolSupplyData is a free data retrieval call binding the contract method 0x2dafdbbf.
//
// Solidity: function getTokenPoolSupplyData() view returns(uint256 _lockedFundsWei, uint256 _totalInflationAuthorizedWei, uint256 _totalClaimedWei)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) GetTokenPoolSupplyData(opts *bind.CallOpts) (struct {
	LockedFundsWei              *big.Int
	TotalInflationAuthorizedWei *big.Int
	TotalClaimedWei             *big.Int
}, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "getTokenPoolSupplyData")

	outstruct := new(struct {
		LockedFundsWei              *big.Int
		TotalInflationAuthorizedWei *big.Int
		TotalClaimedWei             *big.Int
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.LockedFundsWei = *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	outstruct.TotalInflationAuthorizedWei = *abi.ConvertType(out[1], new(*big.Int)).(**big.Int)
	outstruct.TotalClaimedWei = *abi.ConvertType(out[2], new(*big.Int)).(**big.Int)

	return *outstruct, err

}

// GetTokenPoolSupplyData is a free data retrieval call binding the contract method 0x2dafdbbf.
//
// Solidity: function getTokenPoolSupplyData() view returns(uint256 _lockedFundsWei, uint256 _totalInflationAuthorizedWei, uint256 _totalClaimedWei)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) GetTokenPoolSupplyData() (struct {
	LockedFundsWei              *big.Int
	TotalInflationAuthorizedWei *big.Int
	TotalClaimedWei             *big.Int
}, error) {
	return _FastUpdatesIncentiveManager.Contract.GetTokenPoolSupplyData(&_FastUpdatesIncentiveManager.CallOpts)
}

// GetTokenPoolSupplyData is a free data retrieval call binding the contract method 0x2dafdbbf.
//
// Solidity: function getTokenPoolSupplyData() view returns(uint256 _lockedFundsWei, uint256 _totalInflationAuthorizedWei, uint256 _totalClaimedWei)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) GetTokenPoolSupplyData() (struct {
	LockedFundsWei              *big.Int
	TotalInflationAuthorizedWei *big.Int
	TotalClaimedWei             *big.Int
}, error) {
	return _FastUpdatesIncentiveManager.Contract.GetTokenPoolSupplyData(&_FastUpdatesIncentiveManager.CallOpts)
}

// Governance is a free data retrieval call binding the contract method 0x5aa6e675.
//
// Solidity: function governance() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) Governance(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "governance")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Governance is a free data retrieval call binding the contract method 0x5aa6e675.
//
// Solidity: function governance() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) Governance() (common.Address, error) {
	return _FastUpdatesIncentiveManager.Contract.Governance(&_FastUpdatesIncentiveManager.CallOpts)
}

// Governance is a free data retrieval call binding the contract method 0x5aa6e675.
//
// Solidity: function governance() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) Governance() (common.Address, error) {
	return _FastUpdatesIncentiveManager.Contract.Governance(&_FastUpdatesIncentiveManager.CallOpts)
}

// GovernanceSettings is a free data retrieval call binding the contract method 0x62354e03.
//
// Solidity: function governanceSettings() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) GovernanceSettings(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "governanceSettings")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GovernanceSettings is a free data retrieval call binding the contract method 0x62354e03.
//
// Solidity: function governanceSettings() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) GovernanceSettings() (common.Address, error) {
	return _FastUpdatesIncentiveManager.Contract.GovernanceSettings(&_FastUpdatesIncentiveManager.CallOpts)
}

// GovernanceSettings is a free data retrieval call binding the contract method 0x62354e03.
//
// Solidity: function governanceSettings() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) GovernanceSettings() (common.Address, error) {
	return _FastUpdatesIncentiveManager.Contract.GovernanceSettings(&_FastUpdatesIncentiveManager.CallOpts)
}

// IsExecutor is a free data retrieval call binding the contract method 0xdebfda30.
//
// Solidity: function isExecutor(address _address) view returns(bool)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) IsExecutor(opts *bind.CallOpts, _address common.Address) (bool, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "isExecutor", _address)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsExecutor is a free data retrieval call binding the contract method 0xdebfda30.
//
// Solidity: function isExecutor(address _address) view returns(bool)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) IsExecutor(_address common.Address) (bool, error) {
	return _FastUpdatesIncentiveManager.Contract.IsExecutor(&_FastUpdatesIncentiveManager.CallOpts, _address)
}

// IsExecutor is a free data retrieval call binding the contract method 0xdebfda30.
//
// Solidity: function isExecutor(address _address) view returns(bool)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) IsExecutor(_address common.Address) (bool, error) {
	return _FastUpdatesIncentiveManager.Contract.IsExecutor(&_FastUpdatesIncentiveManager.CallOpts, _address)
}

// LastInflationAuthorizationReceivedTs is a free data retrieval call binding the contract method 0x473252c4.
//
// Solidity: function lastInflationAuthorizationReceivedTs() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) LastInflationAuthorizationReceivedTs(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "lastInflationAuthorizationReceivedTs")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// LastInflationAuthorizationReceivedTs is a free data retrieval call binding the contract method 0x473252c4.
//
// Solidity: function lastInflationAuthorizationReceivedTs() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) LastInflationAuthorizationReceivedTs() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.LastInflationAuthorizationReceivedTs(&_FastUpdatesIncentiveManager.CallOpts)
}

// LastInflationAuthorizationReceivedTs is a free data retrieval call binding the contract method 0x473252c4.
//
// Solidity: function lastInflationAuthorizationReceivedTs() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) LastInflationAuthorizationReceivedTs() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.LastInflationAuthorizationReceivedTs(&_FastUpdatesIncentiveManager.CallOpts)
}

// LastInflationReceivedTs is a free data retrieval call binding the contract method 0x12afcf0b.
//
// Solidity: function lastInflationReceivedTs() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) LastInflationReceivedTs(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "lastInflationReceivedTs")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// LastInflationReceivedTs is a free data retrieval call binding the contract method 0x12afcf0b.
//
// Solidity: function lastInflationReceivedTs() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) LastInflationReceivedTs() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.LastInflationReceivedTs(&_FastUpdatesIncentiveManager.CallOpts)
}

// LastInflationReceivedTs is a free data retrieval call binding the contract method 0x12afcf0b.
//
// Solidity: function lastInflationReceivedTs() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) LastInflationReceivedTs() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.LastInflationReceivedTs(&_FastUpdatesIncentiveManager.CallOpts)
}

// ProductionMode is a free data retrieval call binding the contract method 0xe17f212e.
//
// Solidity: function productionMode() view returns(bool)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) ProductionMode(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "productionMode")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// ProductionMode is a free data retrieval call binding the contract method 0xe17f212e.
//
// Solidity: function productionMode() view returns(bool)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) ProductionMode() (bool, error) {
	return _FastUpdatesIncentiveManager.Contract.ProductionMode(&_FastUpdatesIncentiveManager.CallOpts)
}

// ProductionMode is a free data retrieval call binding the contract method 0xe17f212e.
//
// Solidity: function productionMode() view returns(bool)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) ProductionMode() (bool, error) {
	return _FastUpdatesIncentiveManager.Contract.ProductionMode(&_FastUpdatesIncentiveManager.CallOpts)
}

// RangeIncreaseLimit is a free data retrieval call binding the contract method 0x74f3eff9.
//
// Solidity: function rangeIncreaseLimit() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) RangeIncreaseLimit(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "rangeIncreaseLimit")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// RangeIncreaseLimit is a free data retrieval call binding the contract method 0x74f3eff9.
//
// Solidity: function rangeIncreaseLimit() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) RangeIncreaseLimit() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.RangeIncreaseLimit(&_FastUpdatesIncentiveManager.CallOpts)
}

// RangeIncreaseLimit is a free data retrieval call binding the contract method 0x74f3eff9.
//
// Solidity: function rangeIncreaseLimit() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) RangeIncreaseLimit() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.RangeIncreaseLimit(&_FastUpdatesIncentiveManager.CallOpts)
}

// RangeIncreasePrice is a free data retrieval call binding the contract method 0x52545a7c.
//
// Solidity: function rangeIncreasePrice() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) RangeIncreasePrice(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "rangeIncreasePrice")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// RangeIncreasePrice is a free data retrieval call binding the contract method 0x52545a7c.
//
// Solidity: function rangeIncreasePrice() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) RangeIncreasePrice() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.RangeIncreasePrice(&_FastUpdatesIncentiveManager.CallOpts)
}

// RangeIncreasePrice is a free data retrieval call binding the contract method 0x52545a7c.
//
// Solidity: function rangeIncreasePrice() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) RangeIncreasePrice() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.RangeIncreasePrice(&_FastUpdatesIncentiveManager.CallOpts)
}

// RewardManager is a free data retrieval call binding the contract method 0x0f4ef8a6.
//
// Solidity: function rewardManager() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) RewardManager(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "rewardManager")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// RewardManager is a free data retrieval call binding the contract method 0x0f4ef8a6.
//
// Solidity: function rewardManager() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) RewardManager() (common.Address, error) {
	return _FastUpdatesIncentiveManager.Contract.RewardManager(&_FastUpdatesIncentiveManager.CallOpts)
}

// RewardManager is a free data retrieval call binding the contract method 0x0f4ef8a6.
//
// Solidity: function rewardManager() view returns(address)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) RewardManager() (common.Address, error) {
	return _FastUpdatesIncentiveManager.Contract.RewardManager(&_FastUpdatesIncentiveManager.CallOpts)
}

// SampleIncreaseLimit is a free data retrieval call binding the contract method 0xd4ab8f94.
//
// Solidity: function sampleIncreaseLimit() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) SampleIncreaseLimit(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "sampleIncreaseLimit")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// SampleIncreaseLimit is a free data retrieval call binding the contract method 0xd4ab8f94.
//
// Solidity: function sampleIncreaseLimit() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) SampleIncreaseLimit() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.SampleIncreaseLimit(&_FastUpdatesIncentiveManager.CallOpts)
}

// SampleIncreaseLimit is a free data retrieval call binding the contract method 0xd4ab8f94.
//
// Solidity: function sampleIncreaseLimit() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) SampleIncreaseLimit() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.SampleIncreaseLimit(&_FastUpdatesIncentiveManager.CallOpts)
}

// TimelockedCalls is a free data retrieval call binding the contract method 0x74e6310e.
//
// Solidity: function timelockedCalls(bytes4 selector) view returns(uint256 allowedAfterTimestamp, bytes encodedCall)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) TimelockedCalls(opts *bind.CallOpts, selector [4]byte) (struct {
	AllowedAfterTimestamp *big.Int
	EncodedCall           []byte
}, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "timelockedCalls", selector)

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
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) TimelockedCalls(selector [4]byte) (struct {
	AllowedAfterTimestamp *big.Int
	EncodedCall           []byte
}, error) {
	return _FastUpdatesIncentiveManager.Contract.TimelockedCalls(&_FastUpdatesIncentiveManager.CallOpts, selector)
}

// TimelockedCalls is a free data retrieval call binding the contract method 0x74e6310e.
//
// Solidity: function timelockedCalls(bytes4 selector) view returns(uint256 allowedAfterTimestamp, bytes encodedCall)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) TimelockedCalls(selector [4]byte) (struct {
	AllowedAfterTimestamp *big.Int
	EncodedCall           []byte
}, error) {
	return _FastUpdatesIncentiveManager.Contract.TimelockedCalls(&_FastUpdatesIncentiveManager.CallOpts, selector)
}

// TotalInflationAuthorizedWei is a free data retrieval call binding the contract method 0xd0c1c393.
//
// Solidity: function totalInflationAuthorizedWei() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) TotalInflationAuthorizedWei(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "totalInflationAuthorizedWei")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TotalInflationAuthorizedWei is a free data retrieval call binding the contract method 0xd0c1c393.
//
// Solidity: function totalInflationAuthorizedWei() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) TotalInflationAuthorizedWei() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.TotalInflationAuthorizedWei(&_FastUpdatesIncentiveManager.CallOpts)
}

// TotalInflationAuthorizedWei is a free data retrieval call binding the contract method 0xd0c1c393.
//
// Solidity: function totalInflationAuthorizedWei() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) TotalInflationAuthorizedWei() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.TotalInflationAuthorizedWei(&_FastUpdatesIncentiveManager.CallOpts)
}

// TotalInflationReceivedWei is a free data retrieval call binding the contract method 0xa5555aea.
//
// Solidity: function totalInflationReceivedWei() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) TotalInflationReceivedWei(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "totalInflationReceivedWei")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TotalInflationReceivedWei is a free data retrieval call binding the contract method 0xa5555aea.
//
// Solidity: function totalInflationReceivedWei() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) TotalInflationReceivedWei() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.TotalInflationReceivedWei(&_FastUpdatesIncentiveManager.CallOpts)
}

// TotalInflationReceivedWei is a free data retrieval call binding the contract method 0xa5555aea.
//
// Solidity: function totalInflationReceivedWei() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) TotalInflationReceivedWei() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.TotalInflationReceivedWei(&_FastUpdatesIncentiveManager.CallOpts)
}

// TotalInflationRewardsOfferedWei is a free data retrieval call binding the contract method 0xbd76b69c.
//
// Solidity: function totalInflationRewardsOfferedWei() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCaller) TotalInflationRewardsOfferedWei(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FastUpdatesIncentiveManager.contract.Call(opts, &out, "totalInflationRewardsOfferedWei")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TotalInflationRewardsOfferedWei is a free data retrieval call binding the contract method 0xbd76b69c.
//
// Solidity: function totalInflationRewardsOfferedWei() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) TotalInflationRewardsOfferedWei() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.TotalInflationRewardsOfferedWei(&_FastUpdatesIncentiveManager.CallOpts)
}

// TotalInflationRewardsOfferedWei is a free data retrieval call binding the contract method 0xbd76b69c.
//
// Solidity: function totalInflationRewardsOfferedWei() view returns(uint256)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerCallerSession) TotalInflationRewardsOfferedWei() (*big.Int, error) {
	return _FastUpdatesIncentiveManager.Contract.TotalInflationRewardsOfferedWei(&_FastUpdatesIncentiveManager.CallOpts)
}

// Advance is a paid mutator transaction binding the contract method 0xea105ac7.
//
// Solidity: function advance() returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactor) Advance(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.contract.Transact(opts, "advance")
}

// Advance is a paid mutator transaction binding the contract method 0xea105ac7.
//
// Solidity: function advance() returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) Advance() (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.Advance(&_FastUpdatesIncentiveManager.TransactOpts)
}

// Advance is a paid mutator transaction binding the contract method 0xea105ac7.
//
// Solidity: function advance() returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactorSession) Advance() (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.Advance(&_FastUpdatesIncentiveManager.TransactOpts)
}

// CancelGovernanceCall is a paid mutator transaction binding the contract method 0x67fc4029.
//
// Solidity: function cancelGovernanceCall(bytes4 _selector) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactor) CancelGovernanceCall(opts *bind.TransactOpts, _selector [4]byte) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.contract.Transact(opts, "cancelGovernanceCall", _selector)
}

// CancelGovernanceCall is a paid mutator transaction binding the contract method 0x67fc4029.
//
// Solidity: function cancelGovernanceCall(bytes4 _selector) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) CancelGovernanceCall(_selector [4]byte) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.CancelGovernanceCall(&_FastUpdatesIncentiveManager.TransactOpts, _selector)
}

// CancelGovernanceCall is a paid mutator transaction binding the contract method 0x67fc4029.
//
// Solidity: function cancelGovernanceCall(bytes4 _selector) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactorSession) CancelGovernanceCall(_selector [4]byte) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.CancelGovernanceCall(&_FastUpdatesIncentiveManager.TransactOpts, _selector)
}

// ExecuteGovernanceCall is a paid mutator transaction binding the contract method 0x5ff27079.
//
// Solidity: function executeGovernanceCall(bytes4 _selector) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactor) ExecuteGovernanceCall(opts *bind.TransactOpts, _selector [4]byte) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.contract.Transact(opts, "executeGovernanceCall", _selector)
}

// ExecuteGovernanceCall is a paid mutator transaction binding the contract method 0x5ff27079.
//
// Solidity: function executeGovernanceCall(bytes4 _selector) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) ExecuteGovernanceCall(_selector [4]byte) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.ExecuteGovernanceCall(&_FastUpdatesIncentiveManager.TransactOpts, _selector)
}

// ExecuteGovernanceCall is a paid mutator transaction binding the contract method 0x5ff27079.
//
// Solidity: function executeGovernanceCall(bytes4 _selector) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactorSession) ExecuteGovernanceCall(_selector [4]byte) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.ExecuteGovernanceCall(&_FastUpdatesIncentiveManager.TransactOpts, _selector)
}

// Initialise is a paid mutator transaction binding the contract method 0xef88bf13.
//
// Solidity: function initialise(address _governanceSettings, address _initialGovernance) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactor) Initialise(opts *bind.TransactOpts, _governanceSettings common.Address, _initialGovernance common.Address) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.contract.Transact(opts, "initialise", _governanceSettings, _initialGovernance)
}

// Initialise is a paid mutator transaction binding the contract method 0xef88bf13.
//
// Solidity: function initialise(address _governanceSettings, address _initialGovernance) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) Initialise(_governanceSettings common.Address, _initialGovernance common.Address) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.Initialise(&_FastUpdatesIncentiveManager.TransactOpts, _governanceSettings, _initialGovernance)
}

// Initialise is a paid mutator transaction binding the contract method 0xef88bf13.
//
// Solidity: function initialise(address _governanceSettings, address _initialGovernance) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactorSession) Initialise(_governanceSettings common.Address, _initialGovernance common.Address) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.Initialise(&_FastUpdatesIncentiveManager.TransactOpts, _governanceSettings, _initialGovernance)
}

// OfferIncentive is a paid mutator transaction binding the contract method 0x36247180.
//
// Solidity: function offerIncentive((uint256,uint256) _offer) payable returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactor) OfferIncentive(opts *bind.TransactOpts, _offer IFastUpdateIncentiveManagerIncentiveOffer) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.contract.Transact(opts, "offerIncentive", _offer)
}

// OfferIncentive is a paid mutator transaction binding the contract method 0x36247180.
//
// Solidity: function offerIncentive((uint256,uint256) _offer) payable returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) OfferIncentive(_offer IFastUpdateIncentiveManagerIncentiveOffer) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.OfferIncentive(&_FastUpdatesIncentiveManager.TransactOpts, _offer)
}

// OfferIncentive is a paid mutator transaction binding the contract method 0x36247180.
//
// Solidity: function offerIncentive((uint256,uint256) _offer) payable returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactorSession) OfferIncentive(_offer IFastUpdateIncentiveManagerIncentiveOffer) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.OfferIncentive(&_FastUpdatesIncentiveManager.TransactOpts, _offer)
}

// ReceiveInflation is a paid mutator transaction binding the contract method 0x06201f1d.
//
// Solidity: function receiveInflation() payable returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactor) ReceiveInflation(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.contract.Transact(opts, "receiveInflation")
}

// ReceiveInflation is a paid mutator transaction binding the contract method 0x06201f1d.
//
// Solidity: function receiveInflation() payable returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) ReceiveInflation() (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.ReceiveInflation(&_FastUpdatesIncentiveManager.TransactOpts)
}

// ReceiveInflation is a paid mutator transaction binding the contract method 0x06201f1d.
//
// Solidity: function receiveInflation() payable returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactorSession) ReceiveInflation() (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.ReceiveInflation(&_FastUpdatesIncentiveManager.TransactOpts)
}

// SetDailyAuthorizedInflation is a paid mutator transaction binding the contract method 0xe2739563.
//
// Solidity: function setDailyAuthorizedInflation(uint256 _toAuthorizeWei) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactor) SetDailyAuthorizedInflation(opts *bind.TransactOpts, _toAuthorizeWei *big.Int) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.contract.Transact(opts, "setDailyAuthorizedInflation", _toAuthorizeWei)
}

// SetDailyAuthorizedInflation is a paid mutator transaction binding the contract method 0xe2739563.
//
// Solidity: function setDailyAuthorizedInflation(uint256 _toAuthorizeWei) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) SetDailyAuthorizedInflation(_toAuthorizeWei *big.Int) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.SetDailyAuthorizedInflation(&_FastUpdatesIncentiveManager.TransactOpts, _toAuthorizeWei)
}

// SetDailyAuthorizedInflation is a paid mutator transaction binding the contract method 0xe2739563.
//
// Solidity: function setDailyAuthorizedInflation(uint256 _toAuthorizeWei) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactorSession) SetDailyAuthorizedInflation(_toAuthorizeWei *big.Int) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.SetDailyAuthorizedInflation(&_FastUpdatesIncentiveManager.TransactOpts, _toAuthorizeWei)
}

// SetIncentiveParameters is a paid mutator transaction binding the contract method 0x75d71307.
//
// Solidity: function setIncentiveParameters(uint256 _ss, uint256 _r, uint256 _x, uint256 _dur) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactor) SetIncentiveParameters(opts *bind.TransactOpts, _ss *big.Int, _r *big.Int, _x *big.Int, _dur *big.Int) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.contract.Transact(opts, "setIncentiveParameters", _ss, _r, _x, _dur)
}

// SetIncentiveParameters is a paid mutator transaction binding the contract method 0x75d71307.
//
// Solidity: function setIncentiveParameters(uint256 _ss, uint256 _r, uint256 _x, uint256 _dur) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) SetIncentiveParameters(_ss *big.Int, _r *big.Int, _x *big.Int, _dur *big.Int) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.SetIncentiveParameters(&_FastUpdatesIncentiveManager.TransactOpts, _ss, _r, _x, _dur)
}

// SetIncentiveParameters is a paid mutator transaction binding the contract method 0x75d71307.
//
// Solidity: function setIncentiveParameters(uint256 _ss, uint256 _r, uint256 _x, uint256 _dur) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactorSession) SetIncentiveParameters(_ss *big.Int, _r *big.Int, _x *big.Int, _dur *big.Int) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.SetIncentiveParameters(&_FastUpdatesIncentiveManager.TransactOpts, _ss, _r, _x, _dur)
}

// SetRangeIncreaseLimit is a paid mutator transaction binding the contract method 0x864578e8.
//
// Solidity: function setRangeIncreaseLimit(uint256 _lim) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactor) SetRangeIncreaseLimit(opts *bind.TransactOpts, _lim *big.Int) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.contract.Transact(opts, "setRangeIncreaseLimit", _lim)
}

// SetRangeIncreaseLimit is a paid mutator transaction binding the contract method 0x864578e8.
//
// Solidity: function setRangeIncreaseLimit(uint256 _lim) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) SetRangeIncreaseLimit(_lim *big.Int) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.SetRangeIncreaseLimit(&_FastUpdatesIncentiveManager.TransactOpts, _lim)
}

// SetRangeIncreaseLimit is a paid mutator transaction binding the contract method 0x864578e8.
//
// Solidity: function setRangeIncreaseLimit(uint256 _lim) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactorSession) SetRangeIncreaseLimit(_lim *big.Int) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.SetRangeIncreaseLimit(&_FastUpdatesIncentiveManager.TransactOpts, _lim)
}

// SetRangeIncreasePrice is a paid mutator transaction binding the contract method 0x0d6e9537.
//
// Solidity: function setRangeIncreasePrice(uint256 _price) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactor) SetRangeIncreasePrice(opts *bind.TransactOpts, _price *big.Int) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.contract.Transact(opts, "setRangeIncreasePrice", _price)
}

// SetRangeIncreasePrice is a paid mutator transaction binding the contract method 0x0d6e9537.
//
// Solidity: function setRangeIncreasePrice(uint256 _price) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) SetRangeIncreasePrice(_price *big.Int) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.SetRangeIncreasePrice(&_FastUpdatesIncentiveManager.TransactOpts, _price)
}

// SetRangeIncreasePrice is a paid mutator transaction binding the contract method 0x0d6e9537.
//
// Solidity: function setRangeIncreasePrice(uint256 _price) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactorSession) SetRangeIncreasePrice(_price *big.Int) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.SetRangeIncreasePrice(&_FastUpdatesIncentiveManager.TransactOpts, _price)
}

// SetSampleIncreaseLimit is a paid mutator transaction binding the contract method 0xf7690bfe.
//
// Solidity: function setSampleIncreaseLimit(uint256 _lim) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactor) SetSampleIncreaseLimit(opts *bind.TransactOpts, _lim *big.Int) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.contract.Transact(opts, "setSampleIncreaseLimit", _lim)
}

// SetSampleIncreaseLimit is a paid mutator transaction binding the contract method 0xf7690bfe.
//
// Solidity: function setSampleIncreaseLimit(uint256 _lim) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) SetSampleIncreaseLimit(_lim *big.Int) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.SetSampleIncreaseLimit(&_FastUpdatesIncentiveManager.TransactOpts, _lim)
}

// SetSampleIncreaseLimit is a paid mutator transaction binding the contract method 0xf7690bfe.
//
// Solidity: function setSampleIncreaseLimit(uint256 _lim) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactorSession) SetSampleIncreaseLimit(_lim *big.Int) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.SetSampleIncreaseLimit(&_FastUpdatesIncentiveManager.TransactOpts, _lim)
}

// SwitchToProductionMode is a paid mutator transaction binding the contract method 0xf5a98383.
//
// Solidity: function switchToProductionMode() returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactor) SwitchToProductionMode(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.contract.Transact(opts, "switchToProductionMode")
}

// SwitchToProductionMode is a paid mutator transaction binding the contract method 0xf5a98383.
//
// Solidity: function switchToProductionMode() returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) SwitchToProductionMode() (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.SwitchToProductionMode(&_FastUpdatesIncentiveManager.TransactOpts)
}

// SwitchToProductionMode is a paid mutator transaction binding the contract method 0xf5a98383.
//
// Solidity: function switchToProductionMode() returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactorSession) SwitchToProductionMode() (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.SwitchToProductionMode(&_FastUpdatesIncentiveManager.TransactOpts)
}

// TriggerRewardEpochSwitchover is a paid mutator transaction binding the contract method 0x91f25679.
//
// Solidity: function triggerRewardEpochSwitchover(uint24 _currentRewardEpochId, uint64 _currentRewardEpochExpectedEndTs, uint64 _rewardEpochDurationSeconds) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactor) TriggerRewardEpochSwitchover(opts *bind.TransactOpts, _currentRewardEpochId *big.Int, _currentRewardEpochExpectedEndTs uint64, _rewardEpochDurationSeconds uint64) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.contract.Transact(opts, "triggerRewardEpochSwitchover", _currentRewardEpochId, _currentRewardEpochExpectedEndTs, _rewardEpochDurationSeconds)
}

// TriggerRewardEpochSwitchover is a paid mutator transaction binding the contract method 0x91f25679.
//
// Solidity: function triggerRewardEpochSwitchover(uint24 _currentRewardEpochId, uint64 _currentRewardEpochExpectedEndTs, uint64 _rewardEpochDurationSeconds) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) TriggerRewardEpochSwitchover(_currentRewardEpochId *big.Int, _currentRewardEpochExpectedEndTs uint64, _rewardEpochDurationSeconds uint64) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.TriggerRewardEpochSwitchover(&_FastUpdatesIncentiveManager.TransactOpts, _currentRewardEpochId, _currentRewardEpochExpectedEndTs, _rewardEpochDurationSeconds)
}

// TriggerRewardEpochSwitchover is a paid mutator transaction binding the contract method 0x91f25679.
//
// Solidity: function triggerRewardEpochSwitchover(uint24 _currentRewardEpochId, uint64 _currentRewardEpochExpectedEndTs, uint64 _rewardEpochDurationSeconds) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactorSession) TriggerRewardEpochSwitchover(_currentRewardEpochId *big.Int, _currentRewardEpochExpectedEndTs uint64, _rewardEpochDurationSeconds uint64) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.TriggerRewardEpochSwitchover(&_FastUpdatesIncentiveManager.TransactOpts, _currentRewardEpochId, _currentRewardEpochExpectedEndTs, _rewardEpochDurationSeconds)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactor) UpdateContractAddresses(opts *bind.TransactOpts, _contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.contract.Transact(opts, "updateContractAddresses", _contractNameHashes, _contractAddresses)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerSession) UpdateContractAddresses(_contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.UpdateContractAddresses(&_FastUpdatesIncentiveManager.TransactOpts, _contractNameHashes, _contractAddresses)
}

// UpdateContractAddresses is a paid mutator transaction binding the contract method 0xb00c0b76.
//
// Solidity: function updateContractAddresses(bytes32[] _contractNameHashes, address[] _contractAddresses) returns()
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerTransactorSession) UpdateContractAddresses(_contractNameHashes [][32]byte, _contractAddresses []common.Address) (*types.Transaction, error) {
	return _FastUpdatesIncentiveManager.Contract.UpdateContractAddresses(&_FastUpdatesIncentiveManager.TransactOpts, _contractNameHashes, _contractAddresses)
}

// FastUpdatesIncentiveManagerDailyAuthorizedInflationSetIterator is returned from FilterDailyAuthorizedInflationSet and is used to iterate over the raw logs and unpacked data for DailyAuthorizedInflationSet events raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerDailyAuthorizedInflationSetIterator struct {
	Event *FastUpdatesIncentiveManagerDailyAuthorizedInflationSet // Event containing the contract specifics and raw log

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
func (it *FastUpdatesIncentiveManagerDailyAuthorizedInflationSetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesIncentiveManagerDailyAuthorizedInflationSet)
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
		it.Event = new(FastUpdatesIncentiveManagerDailyAuthorizedInflationSet)
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
func (it *FastUpdatesIncentiveManagerDailyAuthorizedInflationSetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesIncentiveManagerDailyAuthorizedInflationSetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesIncentiveManagerDailyAuthorizedInflationSet represents a DailyAuthorizedInflationSet event raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerDailyAuthorizedInflationSet struct {
	AuthorizedAmountWei *big.Int
	Raw                 types.Log // Blockchain specific contextual infos
}

// FilterDailyAuthorizedInflationSet is a free log retrieval operation binding the contract event 0x187f32a0f765499f15b3bb52ed0aebf6015059f230f2ace7e701e60a47669595.
//
// Solidity: event DailyAuthorizedInflationSet(uint256 authorizedAmountWei)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) FilterDailyAuthorizedInflationSet(opts *bind.FilterOpts) (*FastUpdatesIncentiveManagerDailyAuthorizedInflationSetIterator, error) {

	logs, sub, err := _FastUpdatesIncentiveManager.contract.FilterLogs(opts, "DailyAuthorizedInflationSet")
	if err != nil {
		return nil, err
	}
	return &FastUpdatesIncentiveManagerDailyAuthorizedInflationSetIterator{contract: _FastUpdatesIncentiveManager.contract, event: "DailyAuthorizedInflationSet", logs: logs, sub: sub}, nil
}

// WatchDailyAuthorizedInflationSet is a free log subscription operation binding the contract event 0x187f32a0f765499f15b3bb52ed0aebf6015059f230f2ace7e701e60a47669595.
//
// Solidity: event DailyAuthorizedInflationSet(uint256 authorizedAmountWei)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) WatchDailyAuthorizedInflationSet(opts *bind.WatchOpts, sink chan<- *FastUpdatesIncentiveManagerDailyAuthorizedInflationSet) (event.Subscription, error) {

	logs, sub, err := _FastUpdatesIncentiveManager.contract.WatchLogs(opts, "DailyAuthorizedInflationSet")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesIncentiveManagerDailyAuthorizedInflationSet)
				if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "DailyAuthorizedInflationSet", log); err != nil {
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

// ParseDailyAuthorizedInflationSet is a log parse operation binding the contract event 0x187f32a0f765499f15b3bb52ed0aebf6015059f230f2ace7e701e60a47669595.
//
// Solidity: event DailyAuthorizedInflationSet(uint256 authorizedAmountWei)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) ParseDailyAuthorizedInflationSet(log types.Log) (*FastUpdatesIncentiveManagerDailyAuthorizedInflationSet, error) {
	event := new(FastUpdatesIncentiveManagerDailyAuthorizedInflationSet)
	if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "DailyAuthorizedInflationSet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdatesIncentiveManagerGovernanceCallTimelockedIterator is returned from FilterGovernanceCallTimelocked and is used to iterate over the raw logs and unpacked data for GovernanceCallTimelocked events raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerGovernanceCallTimelockedIterator struct {
	Event *FastUpdatesIncentiveManagerGovernanceCallTimelocked // Event containing the contract specifics and raw log

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
func (it *FastUpdatesIncentiveManagerGovernanceCallTimelockedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesIncentiveManagerGovernanceCallTimelocked)
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
		it.Event = new(FastUpdatesIncentiveManagerGovernanceCallTimelocked)
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
func (it *FastUpdatesIncentiveManagerGovernanceCallTimelockedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesIncentiveManagerGovernanceCallTimelockedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesIncentiveManagerGovernanceCallTimelocked represents a GovernanceCallTimelocked event raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerGovernanceCallTimelocked struct {
	Selector              [4]byte
	AllowedAfterTimestamp *big.Int
	EncodedCall           []byte
	Raw                   types.Log // Blockchain specific contextual infos
}

// FilterGovernanceCallTimelocked is a free log retrieval operation binding the contract event 0xed948300a3694aa01d4a6b258bfd664350193d770c0b51f8387277f6d83ea3b6.
//
// Solidity: event GovernanceCallTimelocked(bytes4 selector, uint256 allowedAfterTimestamp, bytes encodedCall)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) FilterGovernanceCallTimelocked(opts *bind.FilterOpts) (*FastUpdatesIncentiveManagerGovernanceCallTimelockedIterator, error) {

	logs, sub, err := _FastUpdatesIncentiveManager.contract.FilterLogs(opts, "GovernanceCallTimelocked")
	if err != nil {
		return nil, err
	}
	return &FastUpdatesIncentiveManagerGovernanceCallTimelockedIterator{contract: _FastUpdatesIncentiveManager.contract, event: "GovernanceCallTimelocked", logs: logs, sub: sub}, nil
}

// WatchGovernanceCallTimelocked is a free log subscription operation binding the contract event 0xed948300a3694aa01d4a6b258bfd664350193d770c0b51f8387277f6d83ea3b6.
//
// Solidity: event GovernanceCallTimelocked(bytes4 selector, uint256 allowedAfterTimestamp, bytes encodedCall)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) WatchGovernanceCallTimelocked(opts *bind.WatchOpts, sink chan<- *FastUpdatesIncentiveManagerGovernanceCallTimelocked) (event.Subscription, error) {

	logs, sub, err := _FastUpdatesIncentiveManager.contract.WatchLogs(opts, "GovernanceCallTimelocked")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesIncentiveManagerGovernanceCallTimelocked)
				if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "GovernanceCallTimelocked", log); err != nil {
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
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) ParseGovernanceCallTimelocked(log types.Log) (*FastUpdatesIncentiveManagerGovernanceCallTimelocked, error) {
	event := new(FastUpdatesIncentiveManagerGovernanceCallTimelocked)
	if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "GovernanceCallTimelocked", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdatesIncentiveManagerGovernanceInitialisedIterator is returned from FilterGovernanceInitialised and is used to iterate over the raw logs and unpacked data for GovernanceInitialised events raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerGovernanceInitialisedIterator struct {
	Event *FastUpdatesIncentiveManagerGovernanceInitialised // Event containing the contract specifics and raw log

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
func (it *FastUpdatesIncentiveManagerGovernanceInitialisedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesIncentiveManagerGovernanceInitialised)
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
		it.Event = new(FastUpdatesIncentiveManagerGovernanceInitialised)
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
func (it *FastUpdatesIncentiveManagerGovernanceInitialisedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesIncentiveManagerGovernanceInitialisedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesIncentiveManagerGovernanceInitialised represents a GovernanceInitialised event raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerGovernanceInitialised struct {
	InitialGovernance common.Address
	Raw               types.Log // Blockchain specific contextual infos
}

// FilterGovernanceInitialised is a free log retrieval operation binding the contract event 0x9789733827840833afc031fb2ef9ab6894271f77bad2085687cf4ae5c7bee4db.
//
// Solidity: event GovernanceInitialised(address initialGovernance)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) FilterGovernanceInitialised(opts *bind.FilterOpts) (*FastUpdatesIncentiveManagerGovernanceInitialisedIterator, error) {

	logs, sub, err := _FastUpdatesIncentiveManager.contract.FilterLogs(opts, "GovernanceInitialised")
	if err != nil {
		return nil, err
	}
	return &FastUpdatesIncentiveManagerGovernanceInitialisedIterator{contract: _FastUpdatesIncentiveManager.contract, event: "GovernanceInitialised", logs: logs, sub: sub}, nil
}

// WatchGovernanceInitialised is a free log subscription operation binding the contract event 0x9789733827840833afc031fb2ef9ab6894271f77bad2085687cf4ae5c7bee4db.
//
// Solidity: event GovernanceInitialised(address initialGovernance)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) WatchGovernanceInitialised(opts *bind.WatchOpts, sink chan<- *FastUpdatesIncentiveManagerGovernanceInitialised) (event.Subscription, error) {

	logs, sub, err := _FastUpdatesIncentiveManager.contract.WatchLogs(opts, "GovernanceInitialised")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesIncentiveManagerGovernanceInitialised)
				if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "GovernanceInitialised", log); err != nil {
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
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) ParseGovernanceInitialised(log types.Log) (*FastUpdatesIncentiveManagerGovernanceInitialised, error) {
	event := new(FastUpdatesIncentiveManagerGovernanceInitialised)
	if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "GovernanceInitialised", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdatesIncentiveManagerGovernedProductionModeEnteredIterator is returned from FilterGovernedProductionModeEntered and is used to iterate over the raw logs and unpacked data for GovernedProductionModeEntered events raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerGovernedProductionModeEnteredIterator struct {
	Event *FastUpdatesIncentiveManagerGovernedProductionModeEntered // Event containing the contract specifics and raw log

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
func (it *FastUpdatesIncentiveManagerGovernedProductionModeEnteredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesIncentiveManagerGovernedProductionModeEntered)
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
		it.Event = new(FastUpdatesIncentiveManagerGovernedProductionModeEntered)
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
func (it *FastUpdatesIncentiveManagerGovernedProductionModeEnteredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesIncentiveManagerGovernedProductionModeEnteredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesIncentiveManagerGovernedProductionModeEntered represents a GovernedProductionModeEntered event raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerGovernedProductionModeEntered struct {
	GovernanceSettings common.Address
	Raw                types.Log // Blockchain specific contextual infos
}

// FilterGovernedProductionModeEntered is a free log retrieval operation binding the contract event 0x83af113638b5422f9e977cebc0aaf0eaf2188eb9a8baae7f9d46c42b33a1560c.
//
// Solidity: event GovernedProductionModeEntered(address governanceSettings)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) FilterGovernedProductionModeEntered(opts *bind.FilterOpts) (*FastUpdatesIncentiveManagerGovernedProductionModeEnteredIterator, error) {

	logs, sub, err := _FastUpdatesIncentiveManager.contract.FilterLogs(opts, "GovernedProductionModeEntered")
	if err != nil {
		return nil, err
	}
	return &FastUpdatesIncentiveManagerGovernedProductionModeEnteredIterator{contract: _FastUpdatesIncentiveManager.contract, event: "GovernedProductionModeEntered", logs: logs, sub: sub}, nil
}

// WatchGovernedProductionModeEntered is a free log subscription operation binding the contract event 0x83af113638b5422f9e977cebc0aaf0eaf2188eb9a8baae7f9d46c42b33a1560c.
//
// Solidity: event GovernedProductionModeEntered(address governanceSettings)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) WatchGovernedProductionModeEntered(opts *bind.WatchOpts, sink chan<- *FastUpdatesIncentiveManagerGovernedProductionModeEntered) (event.Subscription, error) {

	logs, sub, err := _FastUpdatesIncentiveManager.contract.WatchLogs(opts, "GovernedProductionModeEntered")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesIncentiveManagerGovernedProductionModeEntered)
				if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "GovernedProductionModeEntered", log); err != nil {
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
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) ParseGovernedProductionModeEntered(log types.Log) (*FastUpdatesIncentiveManagerGovernedProductionModeEntered, error) {
	event := new(FastUpdatesIncentiveManagerGovernedProductionModeEntered)
	if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "GovernedProductionModeEntered", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdatesIncentiveManagerIncentiveOfferedIterator is returned from FilterIncentiveOffered and is used to iterate over the raw logs and unpacked data for IncentiveOffered events raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerIncentiveOfferedIterator struct {
	Event *FastUpdatesIncentiveManagerIncentiveOffered // Event containing the contract specifics and raw log

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
func (it *FastUpdatesIncentiveManagerIncentiveOfferedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesIncentiveManagerIncentiveOffered)
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
		it.Event = new(FastUpdatesIncentiveManagerIncentiveOffered)
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
func (it *FastUpdatesIncentiveManagerIncentiveOfferedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesIncentiveManagerIncentiveOfferedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesIncentiveManagerIncentiveOffered represents a IncentiveOffered event raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerIncentiveOffered struct {
	RewardEpochId      *big.Int
	RangeIncrease      *big.Int
	SampleSizeIncrease *big.Int
	OfferAmount        *big.Int
	Raw                types.Log // Blockchain specific contextual infos
}

// FilterIncentiveOffered is a free log retrieval operation binding the contract event 0x1c5543607841f3a87aa841c3bfa973bf64f4d545b1d9c12af3cd5831ecf82603.
//
// Solidity: event IncentiveOffered(uint24 indexed rewardEpochId, uint256 rangeIncrease, uint256 sampleSizeIncrease, uint256 offerAmount)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) FilterIncentiveOffered(opts *bind.FilterOpts, rewardEpochId []*big.Int) (*FastUpdatesIncentiveManagerIncentiveOfferedIterator, error) {

	var rewardEpochIdRule []interface{}
	for _, rewardEpochIdItem := range rewardEpochId {
		rewardEpochIdRule = append(rewardEpochIdRule, rewardEpochIdItem)
	}

	logs, sub, err := _FastUpdatesIncentiveManager.contract.FilterLogs(opts, "IncentiveOffered", rewardEpochIdRule)
	if err != nil {
		return nil, err
	}
	return &FastUpdatesIncentiveManagerIncentiveOfferedIterator{contract: _FastUpdatesIncentiveManager.contract, event: "IncentiveOffered", logs: logs, sub: sub}, nil
}

// WatchIncentiveOffered is a free log subscription operation binding the contract event 0x1c5543607841f3a87aa841c3bfa973bf64f4d545b1d9c12af3cd5831ecf82603.
//
// Solidity: event IncentiveOffered(uint24 indexed rewardEpochId, uint256 rangeIncrease, uint256 sampleSizeIncrease, uint256 offerAmount)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) WatchIncentiveOffered(opts *bind.WatchOpts, sink chan<- *FastUpdatesIncentiveManagerIncentiveOffered, rewardEpochId []*big.Int) (event.Subscription, error) {

	var rewardEpochIdRule []interface{}
	for _, rewardEpochIdItem := range rewardEpochId {
		rewardEpochIdRule = append(rewardEpochIdRule, rewardEpochIdItem)
	}

	logs, sub, err := _FastUpdatesIncentiveManager.contract.WatchLogs(opts, "IncentiveOffered", rewardEpochIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesIncentiveManagerIncentiveOffered)
				if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "IncentiveOffered", log); err != nil {
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

// ParseIncentiveOffered is a log parse operation binding the contract event 0x1c5543607841f3a87aa841c3bfa973bf64f4d545b1d9c12af3cd5831ecf82603.
//
// Solidity: event IncentiveOffered(uint24 indexed rewardEpochId, uint256 rangeIncrease, uint256 sampleSizeIncrease, uint256 offerAmount)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) ParseIncentiveOffered(log types.Log) (*FastUpdatesIncentiveManagerIncentiveOffered, error) {
	event := new(FastUpdatesIncentiveManagerIncentiveOffered)
	if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "IncentiveOffered", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdatesIncentiveManagerInflationReceivedIterator is returned from FilterInflationReceived and is used to iterate over the raw logs and unpacked data for InflationReceived events raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerInflationReceivedIterator struct {
	Event *FastUpdatesIncentiveManagerInflationReceived // Event containing the contract specifics and raw log

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
func (it *FastUpdatesIncentiveManagerInflationReceivedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesIncentiveManagerInflationReceived)
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
		it.Event = new(FastUpdatesIncentiveManagerInflationReceived)
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
func (it *FastUpdatesIncentiveManagerInflationReceivedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesIncentiveManagerInflationReceivedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesIncentiveManagerInflationReceived represents a InflationReceived event raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerInflationReceived struct {
	AmountReceivedWei *big.Int
	Raw               types.Log // Blockchain specific contextual infos
}

// FilterInflationReceived is a free log retrieval operation binding the contract event 0x95c4e29cc99bc027cfc3cd719d6fd973d5f0317061885fbb322b9b17d8d35d37.
//
// Solidity: event InflationReceived(uint256 amountReceivedWei)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) FilterInflationReceived(opts *bind.FilterOpts) (*FastUpdatesIncentiveManagerInflationReceivedIterator, error) {

	logs, sub, err := _FastUpdatesIncentiveManager.contract.FilterLogs(opts, "InflationReceived")
	if err != nil {
		return nil, err
	}
	return &FastUpdatesIncentiveManagerInflationReceivedIterator{contract: _FastUpdatesIncentiveManager.contract, event: "InflationReceived", logs: logs, sub: sub}, nil
}

// WatchInflationReceived is a free log subscription operation binding the contract event 0x95c4e29cc99bc027cfc3cd719d6fd973d5f0317061885fbb322b9b17d8d35d37.
//
// Solidity: event InflationReceived(uint256 amountReceivedWei)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) WatchInflationReceived(opts *bind.WatchOpts, sink chan<- *FastUpdatesIncentiveManagerInflationReceived) (event.Subscription, error) {

	logs, sub, err := _FastUpdatesIncentiveManager.contract.WatchLogs(opts, "InflationReceived")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesIncentiveManagerInflationReceived)
				if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "InflationReceived", log); err != nil {
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

// ParseInflationReceived is a log parse operation binding the contract event 0x95c4e29cc99bc027cfc3cd719d6fd973d5f0317061885fbb322b9b17d8d35d37.
//
// Solidity: event InflationReceived(uint256 amountReceivedWei)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) ParseInflationReceived(log types.Log) (*FastUpdatesIncentiveManagerInflationReceived, error) {
	event := new(FastUpdatesIncentiveManagerInflationReceived)
	if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "InflationReceived", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdatesIncentiveManagerInflationRewardsOfferedIterator is returned from FilterInflationRewardsOffered and is used to iterate over the raw logs and unpacked data for InflationRewardsOffered events raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerInflationRewardsOfferedIterator struct {
	Event *FastUpdatesIncentiveManagerInflationRewardsOffered // Event containing the contract specifics and raw log

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
func (it *FastUpdatesIncentiveManagerInflationRewardsOfferedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesIncentiveManagerInflationRewardsOffered)
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
		it.Event = new(FastUpdatesIncentiveManagerInflationRewardsOffered)
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
func (it *FastUpdatesIncentiveManagerInflationRewardsOfferedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesIncentiveManagerInflationRewardsOfferedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesIncentiveManagerInflationRewardsOffered represents a InflationRewardsOffered event raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerInflationRewardsOffered struct {
	RewardEpochId      *big.Int
	FeedConfigurations []IFastUpdatesConfigurationFeedConfiguration
	Amount             *big.Int
	Raw                types.Log // Blockchain specific contextual infos
}

// FilterInflationRewardsOffered is a free log retrieval operation binding the contract event 0x58575ff9908663af0451165c3cefcb802da242d63261f6d9df3be0e05366e4da.
//
// Solidity: event InflationRewardsOffered(uint24 indexed rewardEpochId, (bytes21,uint32,uint24)[] feedConfigurations, uint256 amount)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) FilterInflationRewardsOffered(opts *bind.FilterOpts, rewardEpochId []*big.Int) (*FastUpdatesIncentiveManagerInflationRewardsOfferedIterator, error) {

	var rewardEpochIdRule []interface{}
	for _, rewardEpochIdItem := range rewardEpochId {
		rewardEpochIdRule = append(rewardEpochIdRule, rewardEpochIdItem)
	}

	logs, sub, err := _FastUpdatesIncentiveManager.contract.FilterLogs(opts, "InflationRewardsOffered", rewardEpochIdRule)
	if err != nil {
		return nil, err
	}
	return &FastUpdatesIncentiveManagerInflationRewardsOfferedIterator{contract: _FastUpdatesIncentiveManager.contract, event: "InflationRewardsOffered", logs: logs, sub: sub}, nil
}

// WatchInflationRewardsOffered is a free log subscription operation binding the contract event 0x58575ff9908663af0451165c3cefcb802da242d63261f6d9df3be0e05366e4da.
//
// Solidity: event InflationRewardsOffered(uint24 indexed rewardEpochId, (bytes21,uint32,uint24)[] feedConfigurations, uint256 amount)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) WatchInflationRewardsOffered(opts *bind.WatchOpts, sink chan<- *FastUpdatesIncentiveManagerInflationRewardsOffered, rewardEpochId []*big.Int) (event.Subscription, error) {

	var rewardEpochIdRule []interface{}
	for _, rewardEpochIdItem := range rewardEpochId {
		rewardEpochIdRule = append(rewardEpochIdRule, rewardEpochIdItem)
	}

	logs, sub, err := _FastUpdatesIncentiveManager.contract.WatchLogs(opts, "InflationRewardsOffered", rewardEpochIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesIncentiveManagerInflationRewardsOffered)
				if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "InflationRewardsOffered", log); err != nil {
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

// ParseInflationRewardsOffered is a log parse operation binding the contract event 0x58575ff9908663af0451165c3cefcb802da242d63261f6d9df3be0e05366e4da.
//
// Solidity: event InflationRewardsOffered(uint24 indexed rewardEpochId, (bytes21,uint32,uint24)[] feedConfigurations, uint256 amount)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) ParseInflationRewardsOffered(log types.Log) (*FastUpdatesIncentiveManagerInflationRewardsOffered, error) {
	event := new(FastUpdatesIncentiveManagerInflationRewardsOffered)
	if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "InflationRewardsOffered", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdatesIncentiveManagerTimelockedGovernanceCallCanceledIterator is returned from FilterTimelockedGovernanceCallCanceled and is used to iterate over the raw logs and unpacked data for TimelockedGovernanceCallCanceled events raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerTimelockedGovernanceCallCanceledIterator struct {
	Event *FastUpdatesIncentiveManagerTimelockedGovernanceCallCanceled // Event containing the contract specifics and raw log

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
func (it *FastUpdatesIncentiveManagerTimelockedGovernanceCallCanceledIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesIncentiveManagerTimelockedGovernanceCallCanceled)
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
		it.Event = new(FastUpdatesIncentiveManagerTimelockedGovernanceCallCanceled)
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
func (it *FastUpdatesIncentiveManagerTimelockedGovernanceCallCanceledIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesIncentiveManagerTimelockedGovernanceCallCanceledIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesIncentiveManagerTimelockedGovernanceCallCanceled represents a TimelockedGovernanceCallCanceled event raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerTimelockedGovernanceCallCanceled struct {
	Selector  [4]byte
	Timestamp *big.Int
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterTimelockedGovernanceCallCanceled is a free log retrieval operation binding the contract event 0x7735b2391c38a81419c513e30ca578db7158eadd7101511b23e221c654d19cf8.
//
// Solidity: event TimelockedGovernanceCallCanceled(bytes4 selector, uint256 timestamp)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) FilterTimelockedGovernanceCallCanceled(opts *bind.FilterOpts) (*FastUpdatesIncentiveManagerTimelockedGovernanceCallCanceledIterator, error) {

	logs, sub, err := _FastUpdatesIncentiveManager.contract.FilterLogs(opts, "TimelockedGovernanceCallCanceled")
	if err != nil {
		return nil, err
	}
	return &FastUpdatesIncentiveManagerTimelockedGovernanceCallCanceledIterator{contract: _FastUpdatesIncentiveManager.contract, event: "TimelockedGovernanceCallCanceled", logs: logs, sub: sub}, nil
}

// WatchTimelockedGovernanceCallCanceled is a free log subscription operation binding the contract event 0x7735b2391c38a81419c513e30ca578db7158eadd7101511b23e221c654d19cf8.
//
// Solidity: event TimelockedGovernanceCallCanceled(bytes4 selector, uint256 timestamp)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) WatchTimelockedGovernanceCallCanceled(opts *bind.WatchOpts, sink chan<- *FastUpdatesIncentiveManagerTimelockedGovernanceCallCanceled) (event.Subscription, error) {

	logs, sub, err := _FastUpdatesIncentiveManager.contract.WatchLogs(opts, "TimelockedGovernanceCallCanceled")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesIncentiveManagerTimelockedGovernanceCallCanceled)
				if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "TimelockedGovernanceCallCanceled", log); err != nil {
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
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) ParseTimelockedGovernanceCallCanceled(log types.Log) (*FastUpdatesIncentiveManagerTimelockedGovernanceCallCanceled, error) {
	event := new(FastUpdatesIncentiveManagerTimelockedGovernanceCallCanceled)
	if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "TimelockedGovernanceCallCanceled", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// FastUpdatesIncentiveManagerTimelockedGovernanceCallExecutedIterator is returned from FilterTimelockedGovernanceCallExecuted and is used to iterate over the raw logs and unpacked data for TimelockedGovernanceCallExecuted events raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerTimelockedGovernanceCallExecutedIterator struct {
	Event *FastUpdatesIncentiveManagerTimelockedGovernanceCallExecuted // Event containing the contract specifics and raw log

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
func (it *FastUpdatesIncentiveManagerTimelockedGovernanceCallExecutedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FastUpdatesIncentiveManagerTimelockedGovernanceCallExecuted)
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
		it.Event = new(FastUpdatesIncentiveManagerTimelockedGovernanceCallExecuted)
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
func (it *FastUpdatesIncentiveManagerTimelockedGovernanceCallExecutedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FastUpdatesIncentiveManagerTimelockedGovernanceCallExecutedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FastUpdatesIncentiveManagerTimelockedGovernanceCallExecuted represents a TimelockedGovernanceCallExecuted event raised by the FastUpdatesIncentiveManager contract.
type FastUpdatesIncentiveManagerTimelockedGovernanceCallExecuted struct {
	Selector  [4]byte
	Timestamp *big.Int
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterTimelockedGovernanceCallExecuted is a free log retrieval operation binding the contract event 0xa7326b57fc9cfe267aaea5e7f0b01757154d265620a0585819416ee9ddd2c438.
//
// Solidity: event TimelockedGovernanceCallExecuted(bytes4 selector, uint256 timestamp)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) FilterTimelockedGovernanceCallExecuted(opts *bind.FilterOpts) (*FastUpdatesIncentiveManagerTimelockedGovernanceCallExecutedIterator, error) {

	logs, sub, err := _FastUpdatesIncentiveManager.contract.FilterLogs(opts, "TimelockedGovernanceCallExecuted")
	if err != nil {
		return nil, err
	}
	return &FastUpdatesIncentiveManagerTimelockedGovernanceCallExecutedIterator{contract: _FastUpdatesIncentiveManager.contract, event: "TimelockedGovernanceCallExecuted", logs: logs, sub: sub}, nil
}

// WatchTimelockedGovernanceCallExecuted is a free log subscription operation binding the contract event 0xa7326b57fc9cfe267aaea5e7f0b01757154d265620a0585819416ee9ddd2c438.
//
// Solidity: event TimelockedGovernanceCallExecuted(bytes4 selector, uint256 timestamp)
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) WatchTimelockedGovernanceCallExecuted(opts *bind.WatchOpts, sink chan<- *FastUpdatesIncentiveManagerTimelockedGovernanceCallExecuted) (event.Subscription, error) {

	logs, sub, err := _FastUpdatesIncentiveManager.contract.WatchLogs(opts, "TimelockedGovernanceCallExecuted")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FastUpdatesIncentiveManagerTimelockedGovernanceCallExecuted)
				if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "TimelockedGovernanceCallExecuted", log); err != nil {
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
func (_FastUpdatesIncentiveManager *FastUpdatesIncentiveManagerFilterer) ParseTimelockedGovernanceCallExecuted(log types.Log) (*FastUpdatesIncentiveManagerTimelockedGovernanceCallExecuted, error) {
	event := new(FastUpdatesIncentiveManagerTimelockedGovernanceCallExecuted)
	if err := _FastUpdatesIncentiveManager.contract.UnpackLog(event, "TimelockedGovernanceCallExecuted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
