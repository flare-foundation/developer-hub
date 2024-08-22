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

// IIRelaySigningPolicy is an auto generated low-level Go binding around an user-defined struct.
type IIRelaySigningPolicy struct {
	RewardEpochId      *big.Int
	StartVotingRoundId uint32
	Threshold          uint16
	Seed               *big.Int
	Voters             []common.Address
	Weights            []uint16
}

// RelayMetaData contains all meta data concerning the Relay contract.
var RelayMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_signingPolicySetter\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"_initialRewardEpochId\",\"type\":\"uint32\"},{\"internalType\":\"uint32\",\"name\":\"_startingVotingRoundIdForInitialRewardEpochId\",\"type\":\"uint32\"},{\"internalType\":\"bytes32\",\"name\":\"_initialSigningPolicyHash\",\"type\":\"bytes32\"},{\"internalType\":\"uint8\",\"name\":\"_randomNumberProtocolId\",\"type\":\"uint8\"},{\"internalType\":\"uint32\",\"name\":\"_firstVotingRoundStartTs\",\"type\":\"uint32\"},{\"internalType\":\"uint8\",\"name\":\"_votingEpochDurationSeconds\",\"type\":\"uint8\"},{\"internalType\":\"uint32\",\"name\":\"_firstRewardEpochStartVotingRoundId\",\"type\":\"uint32\"},{\"internalType\":\"uint16\",\"name\":\"_rewardEpochDurationInVotingEpochs\",\"type\":\"uint16\"},{\"internalType\":\"uint16\",\"name\":\"_thresholdIncreaseBIPS\",\"type\":\"uint16\"},{\"internalType\":\"uint32\",\"name\":\"_messageFinalizationWindowInRewardEpochs\",\"type\":\"uint32\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint8\",\"name\":\"protocolId\",\"type\":\"uint8\"},{\"indexed\":true,\"internalType\":\"uint32\",\"name\":\"votingRoundId\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"isSecureRandom\",\"type\":\"bool\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"merkleRoot\",\"type\":\"bytes32\"}],\"name\":\"ProtocolMessageRelayed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint24\",\"name\":\"rewardEpochId\",\"type\":\"uint24\"},{\"indexed\":false,\"internalType\":\"uint32\",\"name\":\"startVotingRoundId\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"uint16\",\"name\":\"threshold\",\"type\":\"uint16\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"seed\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address[]\",\"name\":\"voters\",\"type\":\"address[]\"},{\"indexed\":false,\"internalType\":\"uint16[]\",\"name\":\"weights\",\"type\":\"uint16[]\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"signingPolicyBytes\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"uint64\",\"name\":\"timestamp\",\"type\":\"uint64\"}],\"name\":\"SigningPolicyInitialized\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"rewardEpochId\",\"type\":\"uint256\"}],\"name\":\"SigningPolicyRelayed\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_protocolId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_votingRoundId\",\"type\":\"uint256\"}],\"name\":\"getConfirmedMerkleRoot\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getRandomNumber\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"_randomNumber\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"_isSecureRandom\",\"type\":\"bool\"},{\"internalType\":\"uint256\",\"name\":\"_randomTimestamp\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_timestamp\",\"type\":\"uint256\"}],\"name\":\"getVotingRoundId\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"lastInitializedRewardEpochData\",\"outputs\":[{\"internalType\":\"uint32\",\"name\":\"_lastInitializedRewardEpoch\",\"type\":\"uint32\"},{\"internalType\":\"uint32\",\"name\":\"_startingVotingRoundIdForLastInitializedRewardEpoch\",\"type\":\"uint32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"protocolId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"votingRoundId\",\"type\":\"uint256\"}],\"name\":\"merkleRoots\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"relay\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint24\",\"name\":\"rewardEpochId\",\"type\":\"uint24\"},{\"internalType\":\"uint32\",\"name\":\"startVotingRoundId\",\"type\":\"uint32\"},{\"internalType\":\"uint16\",\"name\":\"threshold\",\"type\":\"uint16\"},{\"internalType\":\"uint256\",\"name\":\"seed\",\"type\":\"uint256\"},{\"internalType\":\"address[]\",\"name\":\"voters\",\"type\":\"address[]\"},{\"internalType\":\"uint16[]\",\"name\":\"weights\",\"type\":\"uint16[]\"}],\"internalType\":\"structIIRelay.SigningPolicy\",\"name\":\"_signingPolicy\",\"type\":\"tuple\"}],\"name\":\"setSigningPolicy\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"signingPolicySetter\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"rewardEpochId\",\"type\":\"uint256\"}],\"name\":\"startingVotingRoundIds\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"stateData\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"randomNumberProtocolId\",\"type\":\"uint8\"},{\"internalType\":\"uint32\",\"name\":\"firstVotingRoundStartTs\",\"type\":\"uint32\"},{\"internalType\":\"uint8\",\"name\":\"votingEpochDurationSeconds\",\"type\":\"uint8\"},{\"internalType\":\"uint32\",\"name\":\"firstRewardEpochStartVotingRoundId\",\"type\":\"uint32\"},{\"internalType\":\"uint16\",\"name\":\"rewardEpochDurationInVotingEpochs\",\"type\":\"uint16\"},{\"internalType\":\"uint16\",\"name\":\"thresholdIncreaseBIPS\",\"type\":\"uint16\"},{\"internalType\":\"uint32\",\"name\":\"randomVotingRoundId\",\"type\":\"uint32\"},{\"internalType\":\"bool\",\"name\":\"isSecureRandom\",\"type\":\"bool\"},{\"internalType\":\"uint32\",\"name\":\"lastInitializedRewardEpoch\",\"type\":\"uint32\"},{\"internalType\":\"bool\",\"name\":\"noSigningPolicyRelay\",\"type\":\"bool\"},{\"internalType\":\"uint32\",\"name\":\"messageFinalizationWindowInRewardEpochs\",\"type\":\"uint32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"rewardEpochId\",\"type\":\"uint256\"}],\"name\":\"toSigningPolicyHash\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
}

// RelayABI is the input ABI used to generate the binding from.
// Deprecated: Use RelayMetaData.ABI instead.
var RelayABI = RelayMetaData.ABI

// Relay is an auto generated Go binding around an Ethereum contract.
type Relay struct {
	RelayCaller     // Read-only binding to the contract
	RelayTransactor // Write-only binding to the contract
	RelayFilterer   // Log filterer for contract events
}

// RelayCaller is an auto generated read-only Go binding around an Ethereum contract.
type RelayCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// RelayTransactor is an auto generated write-only Go binding around an Ethereum contract.
type RelayTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// RelayFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type RelayFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// RelaySession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type RelaySession struct {
	Contract     *Relay            // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// RelayCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type RelayCallerSession struct {
	Contract *RelayCaller  // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts // Call options to use throughout this session
}

// RelayTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type RelayTransactorSession struct {
	Contract     *RelayTransactor  // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// RelayRaw is an auto generated low-level Go binding around an Ethereum contract.
type RelayRaw struct {
	Contract *Relay // Generic contract binding to access the raw methods on
}

// RelayCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type RelayCallerRaw struct {
	Contract *RelayCaller // Generic read-only contract binding to access the raw methods on
}

// RelayTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type RelayTransactorRaw struct {
	Contract *RelayTransactor // Generic write-only contract binding to access the raw methods on
}

// NewRelay creates a new instance of Relay, bound to a specific deployed contract.
func NewRelay(address common.Address, backend bind.ContractBackend) (*Relay, error) {
	contract, err := bindRelay(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Relay{RelayCaller: RelayCaller{contract: contract}, RelayTransactor: RelayTransactor{contract: contract}, RelayFilterer: RelayFilterer{contract: contract}}, nil
}

// NewRelayCaller creates a new read-only instance of Relay, bound to a specific deployed contract.
func NewRelayCaller(address common.Address, caller bind.ContractCaller) (*RelayCaller, error) {
	contract, err := bindRelay(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &RelayCaller{contract: contract}, nil
}

// NewRelayTransactor creates a new write-only instance of Relay, bound to a specific deployed contract.
func NewRelayTransactor(address common.Address, transactor bind.ContractTransactor) (*RelayTransactor, error) {
	contract, err := bindRelay(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &RelayTransactor{contract: contract}, nil
}

// NewRelayFilterer creates a new log filterer instance of Relay, bound to a specific deployed contract.
func NewRelayFilterer(address common.Address, filterer bind.ContractFilterer) (*RelayFilterer, error) {
	contract, err := bindRelay(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &RelayFilterer{contract: contract}, nil
}

// bindRelay binds a generic wrapper to an already deployed contract.
func bindRelay(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := RelayMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Relay *RelayRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Relay.Contract.RelayCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Relay *RelayRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Relay.Contract.RelayTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Relay *RelayRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Relay.Contract.RelayTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Relay *RelayCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Relay.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Relay *RelayTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Relay.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Relay *RelayTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Relay.Contract.contract.Transact(opts, method, params...)
}

// GetConfirmedMerkleRoot is a free data retrieval call binding the contract method 0x22c3f6fa.
//
// Solidity: function getConfirmedMerkleRoot(uint256 _protocolId, uint256 _votingRoundId) view returns(bytes32)
func (_Relay *RelayCaller) GetConfirmedMerkleRoot(opts *bind.CallOpts, _protocolId *big.Int, _votingRoundId *big.Int) ([32]byte, error) {
	var out []interface{}
	err := _Relay.contract.Call(opts, &out, "getConfirmedMerkleRoot", _protocolId, _votingRoundId)

	if err != nil {
		return *new([32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)

	return out0, err

}

// GetConfirmedMerkleRoot is a free data retrieval call binding the contract method 0x22c3f6fa.
//
// Solidity: function getConfirmedMerkleRoot(uint256 _protocolId, uint256 _votingRoundId) view returns(bytes32)
func (_Relay *RelaySession) GetConfirmedMerkleRoot(_protocolId *big.Int, _votingRoundId *big.Int) ([32]byte, error) {
	return _Relay.Contract.GetConfirmedMerkleRoot(&_Relay.CallOpts, _protocolId, _votingRoundId)
}

// GetConfirmedMerkleRoot is a free data retrieval call binding the contract method 0x22c3f6fa.
//
// Solidity: function getConfirmedMerkleRoot(uint256 _protocolId, uint256 _votingRoundId) view returns(bytes32)
func (_Relay *RelayCallerSession) GetConfirmedMerkleRoot(_protocolId *big.Int, _votingRoundId *big.Int) ([32]byte, error) {
	return _Relay.Contract.GetConfirmedMerkleRoot(&_Relay.CallOpts, _protocolId, _votingRoundId)
}

// GetRandomNumber is a free data retrieval call binding the contract method 0xdbdff2c1.
//
// Solidity: function getRandomNumber() view returns(uint256 _randomNumber, bool _isSecureRandom, uint256 _randomTimestamp)
func (_Relay *RelayCaller) GetRandomNumber(opts *bind.CallOpts) (struct {
	RandomNumber    *big.Int
	IsSecureRandom  bool
	RandomTimestamp *big.Int
}, error) {
	var out []interface{}
	err := _Relay.contract.Call(opts, &out, "getRandomNumber")

	outstruct := new(struct {
		RandomNumber    *big.Int
		IsSecureRandom  bool
		RandomTimestamp *big.Int
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.RandomNumber = *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	outstruct.IsSecureRandom = *abi.ConvertType(out[1], new(bool)).(*bool)
	outstruct.RandomTimestamp = *abi.ConvertType(out[2], new(*big.Int)).(**big.Int)

	return *outstruct, err

}

// GetRandomNumber is a free data retrieval call binding the contract method 0xdbdff2c1.
//
// Solidity: function getRandomNumber() view returns(uint256 _randomNumber, bool _isSecureRandom, uint256 _randomTimestamp)
func (_Relay *RelaySession) GetRandomNumber() (struct {
	RandomNumber    *big.Int
	IsSecureRandom  bool
	RandomTimestamp *big.Int
}, error) {
	return _Relay.Contract.GetRandomNumber(&_Relay.CallOpts)
}

// GetRandomNumber is a free data retrieval call binding the contract method 0xdbdff2c1.
//
// Solidity: function getRandomNumber() view returns(uint256 _randomNumber, bool _isSecureRandom, uint256 _randomTimestamp)
func (_Relay *RelayCallerSession) GetRandomNumber() (struct {
	RandomNumber    *big.Int
	IsSecureRandom  bool
	RandomTimestamp *big.Int
}, error) {
	return _Relay.Contract.GetRandomNumber(&_Relay.CallOpts)
}

// GetVotingRoundId is a free data retrieval call binding the contract method 0xab97db37.
//
// Solidity: function getVotingRoundId(uint256 _timestamp) view returns(uint256)
func (_Relay *RelayCaller) GetVotingRoundId(opts *bind.CallOpts, _timestamp *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Relay.contract.Call(opts, &out, "getVotingRoundId", _timestamp)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetVotingRoundId is a free data retrieval call binding the contract method 0xab97db37.
//
// Solidity: function getVotingRoundId(uint256 _timestamp) view returns(uint256)
func (_Relay *RelaySession) GetVotingRoundId(_timestamp *big.Int) (*big.Int, error) {
	return _Relay.Contract.GetVotingRoundId(&_Relay.CallOpts, _timestamp)
}

// GetVotingRoundId is a free data retrieval call binding the contract method 0xab97db37.
//
// Solidity: function getVotingRoundId(uint256 _timestamp) view returns(uint256)
func (_Relay *RelayCallerSession) GetVotingRoundId(_timestamp *big.Int) (*big.Int, error) {
	return _Relay.Contract.GetVotingRoundId(&_Relay.CallOpts, _timestamp)
}

// LastInitializedRewardEpochData is a free data retrieval call binding the contract method 0x8af0c307.
//
// Solidity: function lastInitializedRewardEpochData() view returns(uint32 _lastInitializedRewardEpoch, uint32 _startingVotingRoundIdForLastInitializedRewardEpoch)
func (_Relay *RelayCaller) LastInitializedRewardEpochData(opts *bind.CallOpts) (struct {
	LastInitializedRewardEpoch                         uint32
	StartingVotingRoundIdForLastInitializedRewardEpoch uint32
}, error) {
	var out []interface{}
	err := _Relay.contract.Call(opts, &out, "lastInitializedRewardEpochData")

	outstruct := new(struct {
		LastInitializedRewardEpoch                         uint32
		StartingVotingRoundIdForLastInitializedRewardEpoch uint32
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.LastInitializedRewardEpoch = *abi.ConvertType(out[0], new(uint32)).(*uint32)
	outstruct.StartingVotingRoundIdForLastInitializedRewardEpoch = *abi.ConvertType(out[1], new(uint32)).(*uint32)

	return *outstruct, err

}

// LastInitializedRewardEpochData is a free data retrieval call binding the contract method 0x8af0c307.
//
// Solidity: function lastInitializedRewardEpochData() view returns(uint32 _lastInitializedRewardEpoch, uint32 _startingVotingRoundIdForLastInitializedRewardEpoch)
func (_Relay *RelaySession) LastInitializedRewardEpochData() (struct {
	LastInitializedRewardEpoch                         uint32
	StartingVotingRoundIdForLastInitializedRewardEpoch uint32
}, error) {
	return _Relay.Contract.LastInitializedRewardEpochData(&_Relay.CallOpts)
}

// LastInitializedRewardEpochData is a free data retrieval call binding the contract method 0x8af0c307.
//
// Solidity: function lastInitializedRewardEpochData() view returns(uint32 _lastInitializedRewardEpoch, uint32 _startingVotingRoundIdForLastInitializedRewardEpoch)
func (_Relay *RelayCallerSession) LastInitializedRewardEpochData() (struct {
	LastInitializedRewardEpoch                         uint32
	StartingVotingRoundIdForLastInitializedRewardEpoch uint32
}, error) {
	return _Relay.Contract.LastInitializedRewardEpochData(&_Relay.CallOpts)
}

// MerkleRoots is a free data retrieval call binding the contract method 0x39436b00.
//
// Solidity: function merkleRoots(uint256 protocolId, uint256 votingRoundId) view returns(bytes32)
func (_Relay *RelayCaller) MerkleRoots(opts *bind.CallOpts, protocolId *big.Int, votingRoundId *big.Int) ([32]byte, error) {
	var out []interface{}
	err := _Relay.contract.Call(opts, &out, "merkleRoots", protocolId, votingRoundId)

	if err != nil {
		return *new([32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)

	return out0, err

}

// MerkleRoots is a free data retrieval call binding the contract method 0x39436b00.
//
// Solidity: function merkleRoots(uint256 protocolId, uint256 votingRoundId) view returns(bytes32)
func (_Relay *RelaySession) MerkleRoots(protocolId *big.Int, votingRoundId *big.Int) ([32]byte, error) {
	return _Relay.Contract.MerkleRoots(&_Relay.CallOpts, protocolId, votingRoundId)
}

// MerkleRoots is a free data retrieval call binding the contract method 0x39436b00.
//
// Solidity: function merkleRoots(uint256 protocolId, uint256 votingRoundId) view returns(bytes32)
func (_Relay *RelayCallerSession) MerkleRoots(protocolId *big.Int, votingRoundId *big.Int) ([32]byte, error) {
	return _Relay.Contract.MerkleRoots(&_Relay.CallOpts, protocolId, votingRoundId)
}

// SigningPolicySetter is a free data retrieval call binding the contract method 0xa9dbe8ed.
//
// Solidity: function signingPolicySetter() view returns(address)
func (_Relay *RelayCaller) SigningPolicySetter(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _Relay.contract.Call(opts, &out, "signingPolicySetter")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// SigningPolicySetter is a free data retrieval call binding the contract method 0xa9dbe8ed.
//
// Solidity: function signingPolicySetter() view returns(address)
func (_Relay *RelaySession) SigningPolicySetter() (common.Address, error) {
	return _Relay.Contract.SigningPolicySetter(&_Relay.CallOpts)
}

// SigningPolicySetter is a free data retrieval call binding the contract method 0xa9dbe8ed.
//
// Solidity: function signingPolicySetter() view returns(address)
func (_Relay *RelayCallerSession) SigningPolicySetter() (common.Address, error) {
	return _Relay.Contract.SigningPolicySetter(&_Relay.CallOpts)
}

// StartingVotingRoundIds is a free data retrieval call binding the contract method 0x7297c0a2.
//
// Solidity: function startingVotingRoundIds(uint256 rewardEpochId) view returns(uint256)
func (_Relay *RelayCaller) StartingVotingRoundIds(opts *bind.CallOpts, rewardEpochId *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Relay.contract.Call(opts, &out, "startingVotingRoundIds", rewardEpochId)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// StartingVotingRoundIds is a free data retrieval call binding the contract method 0x7297c0a2.
//
// Solidity: function startingVotingRoundIds(uint256 rewardEpochId) view returns(uint256)
func (_Relay *RelaySession) StartingVotingRoundIds(rewardEpochId *big.Int) (*big.Int, error) {
	return _Relay.Contract.StartingVotingRoundIds(&_Relay.CallOpts, rewardEpochId)
}

// StartingVotingRoundIds is a free data retrieval call binding the contract method 0x7297c0a2.
//
// Solidity: function startingVotingRoundIds(uint256 rewardEpochId) view returns(uint256)
func (_Relay *RelayCallerSession) StartingVotingRoundIds(rewardEpochId *big.Int) (*big.Int, error) {
	return _Relay.Contract.StartingVotingRoundIds(&_Relay.CallOpts, rewardEpochId)
}

// StateData is a free data retrieval call binding the contract method 0x1e8fb36a.
//
// Solidity: function stateData() view returns(uint8 randomNumberProtocolId, uint32 firstVotingRoundStartTs, uint8 votingEpochDurationSeconds, uint32 firstRewardEpochStartVotingRoundId, uint16 rewardEpochDurationInVotingEpochs, uint16 thresholdIncreaseBIPS, uint32 randomVotingRoundId, bool isSecureRandom, uint32 lastInitializedRewardEpoch, bool noSigningPolicyRelay, uint32 messageFinalizationWindowInRewardEpochs)
func (_Relay *RelayCaller) StateData(opts *bind.CallOpts) (struct {
	RandomNumberProtocolId                  uint8
	FirstVotingRoundStartTs                 uint32
	VotingEpochDurationSeconds              uint8
	FirstRewardEpochStartVotingRoundId      uint32
	RewardEpochDurationInVotingEpochs       uint16
	ThresholdIncreaseBIPS                   uint16
	RandomVotingRoundId                     uint32
	IsSecureRandom                          bool
	LastInitializedRewardEpoch              uint32
	NoSigningPolicyRelay                    bool
	MessageFinalizationWindowInRewardEpochs uint32
}, error) {
	var out []interface{}
	err := _Relay.contract.Call(opts, &out, "stateData")

	outstruct := new(struct {
		RandomNumberProtocolId                  uint8
		FirstVotingRoundStartTs                 uint32
		VotingEpochDurationSeconds              uint8
		FirstRewardEpochStartVotingRoundId      uint32
		RewardEpochDurationInVotingEpochs       uint16
		ThresholdIncreaseBIPS                   uint16
		RandomVotingRoundId                     uint32
		IsSecureRandom                          bool
		LastInitializedRewardEpoch              uint32
		NoSigningPolicyRelay                    bool
		MessageFinalizationWindowInRewardEpochs uint32
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.RandomNumberProtocolId = *abi.ConvertType(out[0], new(uint8)).(*uint8)
	outstruct.FirstVotingRoundStartTs = *abi.ConvertType(out[1], new(uint32)).(*uint32)
	outstruct.VotingEpochDurationSeconds = *abi.ConvertType(out[2], new(uint8)).(*uint8)
	outstruct.FirstRewardEpochStartVotingRoundId = *abi.ConvertType(out[3], new(uint32)).(*uint32)
	outstruct.RewardEpochDurationInVotingEpochs = *abi.ConvertType(out[4], new(uint16)).(*uint16)
	outstruct.ThresholdIncreaseBIPS = *abi.ConvertType(out[5], new(uint16)).(*uint16)
	outstruct.RandomVotingRoundId = *abi.ConvertType(out[6], new(uint32)).(*uint32)
	outstruct.IsSecureRandom = *abi.ConvertType(out[7], new(bool)).(*bool)
	outstruct.LastInitializedRewardEpoch = *abi.ConvertType(out[8], new(uint32)).(*uint32)
	outstruct.NoSigningPolicyRelay = *abi.ConvertType(out[9], new(bool)).(*bool)
	outstruct.MessageFinalizationWindowInRewardEpochs = *abi.ConvertType(out[10], new(uint32)).(*uint32)

	return *outstruct, err

}

// StateData is a free data retrieval call binding the contract method 0x1e8fb36a.
//
// Solidity: function stateData() view returns(uint8 randomNumberProtocolId, uint32 firstVotingRoundStartTs, uint8 votingEpochDurationSeconds, uint32 firstRewardEpochStartVotingRoundId, uint16 rewardEpochDurationInVotingEpochs, uint16 thresholdIncreaseBIPS, uint32 randomVotingRoundId, bool isSecureRandom, uint32 lastInitializedRewardEpoch, bool noSigningPolicyRelay, uint32 messageFinalizationWindowInRewardEpochs)
func (_Relay *RelaySession) StateData() (struct {
	RandomNumberProtocolId                  uint8
	FirstVotingRoundStartTs                 uint32
	VotingEpochDurationSeconds              uint8
	FirstRewardEpochStartVotingRoundId      uint32
	RewardEpochDurationInVotingEpochs       uint16
	ThresholdIncreaseBIPS                   uint16
	RandomVotingRoundId                     uint32
	IsSecureRandom                          bool
	LastInitializedRewardEpoch              uint32
	NoSigningPolicyRelay                    bool
	MessageFinalizationWindowInRewardEpochs uint32
}, error) {
	return _Relay.Contract.StateData(&_Relay.CallOpts)
}

// StateData is a free data retrieval call binding the contract method 0x1e8fb36a.
//
// Solidity: function stateData() view returns(uint8 randomNumberProtocolId, uint32 firstVotingRoundStartTs, uint8 votingEpochDurationSeconds, uint32 firstRewardEpochStartVotingRoundId, uint16 rewardEpochDurationInVotingEpochs, uint16 thresholdIncreaseBIPS, uint32 randomVotingRoundId, bool isSecureRandom, uint32 lastInitializedRewardEpoch, bool noSigningPolicyRelay, uint32 messageFinalizationWindowInRewardEpochs)
func (_Relay *RelayCallerSession) StateData() (struct {
	RandomNumberProtocolId                  uint8
	FirstVotingRoundStartTs                 uint32
	VotingEpochDurationSeconds              uint8
	FirstRewardEpochStartVotingRoundId      uint32
	RewardEpochDurationInVotingEpochs       uint16
	ThresholdIncreaseBIPS                   uint16
	RandomVotingRoundId                     uint32
	IsSecureRandom                          bool
	LastInitializedRewardEpoch              uint32
	NoSigningPolicyRelay                    bool
	MessageFinalizationWindowInRewardEpochs uint32
}, error) {
	return _Relay.Contract.StateData(&_Relay.CallOpts)
}

// ToSigningPolicyHash is a free data retrieval call binding the contract method 0x0c85bf07.
//
// Solidity: function toSigningPolicyHash(uint256 rewardEpochId) view returns(bytes32)
func (_Relay *RelayCaller) ToSigningPolicyHash(opts *bind.CallOpts, rewardEpochId *big.Int) ([32]byte, error) {
	var out []interface{}
	err := _Relay.contract.Call(opts, &out, "toSigningPolicyHash", rewardEpochId)

	if err != nil {
		return *new([32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)

	return out0, err

}

// ToSigningPolicyHash is a free data retrieval call binding the contract method 0x0c85bf07.
//
// Solidity: function toSigningPolicyHash(uint256 rewardEpochId) view returns(bytes32)
func (_Relay *RelaySession) ToSigningPolicyHash(rewardEpochId *big.Int) ([32]byte, error) {
	return _Relay.Contract.ToSigningPolicyHash(&_Relay.CallOpts, rewardEpochId)
}

// ToSigningPolicyHash is a free data retrieval call binding the contract method 0x0c85bf07.
//
// Solidity: function toSigningPolicyHash(uint256 rewardEpochId) view returns(bytes32)
func (_Relay *RelayCallerSession) ToSigningPolicyHash(rewardEpochId *big.Int) ([32]byte, error) {
	return _Relay.Contract.ToSigningPolicyHash(&_Relay.CallOpts, rewardEpochId)
}

// Relay is a paid mutator transaction binding the contract method 0xb59589d1.
//
// Solidity: function relay() returns()
func (_Relay *RelayTransactor) Relay(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Relay.contract.Transact(opts, "relay")
}

// Relay is a paid mutator transaction binding the contract method 0xb59589d1.
//
// Solidity: function relay() returns()
func (_Relay *RelaySession) Relay() (*types.Transaction, error) {
	return _Relay.Contract.Relay(&_Relay.TransactOpts)
}

// Relay is a paid mutator transaction binding the contract method 0xb59589d1.
//
// Solidity: function relay() returns()
func (_Relay *RelayTransactorSession) Relay() (*types.Transaction, error) {
	return _Relay.Contract.Relay(&_Relay.TransactOpts)
}

// SetSigningPolicy is a paid mutator transaction binding the contract method 0x83534125.
//
// Solidity: function setSigningPolicy((uint24,uint32,uint16,uint256,address[],uint16[]) _signingPolicy) returns(bytes32)
func (_Relay *RelayTransactor) SetSigningPolicy(opts *bind.TransactOpts, _signingPolicy IIRelaySigningPolicy) (*types.Transaction, error) {
	return _Relay.contract.Transact(opts, "setSigningPolicy", _signingPolicy)
}

// SetSigningPolicy is a paid mutator transaction binding the contract method 0x83534125.
//
// Solidity: function setSigningPolicy((uint24,uint32,uint16,uint256,address[],uint16[]) _signingPolicy) returns(bytes32)
func (_Relay *RelaySession) SetSigningPolicy(_signingPolicy IIRelaySigningPolicy) (*types.Transaction, error) {
	return _Relay.Contract.SetSigningPolicy(&_Relay.TransactOpts, _signingPolicy)
}

// SetSigningPolicy is a paid mutator transaction binding the contract method 0x83534125.
//
// Solidity: function setSigningPolicy((uint24,uint32,uint16,uint256,address[],uint16[]) _signingPolicy) returns(bytes32)
func (_Relay *RelayTransactorSession) SetSigningPolicy(_signingPolicy IIRelaySigningPolicy) (*types.Transaction, error) {
	return _Relay.Contract.SetSigningPolicy(&_Relay.TransactOpts, _signingPolicy)
}

// RelayProtocolMessageRelayedIterator is returned from FilterProtocolMessageRelayed and is used to iterate over the raw logs and unpacked data for ProtocolMessageRelayed events raised by the Relay contract.
type RelayProtocolMessageRelayedIterator struct {
	Event *RelayProtocolMessageRelayed // Event containing the contract specifics and raw log

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
func (it *RelayProtocolMessageRelayedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RelayProtocolMessageRelayed)
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
		it.Event = new(RelayProtocolMessageRelayed)
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
func (it *RelayProtocolMessageRelayedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RelayProtocolMessageRelayedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RelayProtocolMessageRelayed represents a ProtocolMessageRelayed event raised by the Relay contract.
type RelayProtocolMessageRelayed struct {
	ProtocolId     uint8
	VotingRoundId  uint32
	IsSecureRandom bool
	MerkleRoot     [32]byte
	Raw            types.Log // Blockchain specific contextual infos
}

// FilterProtocolMessageRelayed is a free log retrieval operation binding the contract event 0x4b781cfef3123d9257ab69e6e8ea36ad75a346d63c5ecf8a46931a0eef48bb9e.
//
// Solidity: event ProtocolMessageRelayed(uint8 indexed protocolId, uint32 indexed votingRoundId, bool isSecureRandom, bytes32 merkleRoot)
func (_Relay *RelayFilterer) FilterProtocolMessageRelayed(opts *bind.FilterOpts, protocolId []uint8, votingRoundId []uint32) (*RelayProtocolMessageRelayedIterator, error) {

	var protocolIdRule []interface{}
	for _, protocolIdItem := range protocolId {
		protocolIdRule = append(protocolIdRule, protocolIdItem)
	}
	var votingRoundIdRule []interface{}
	for _, votingRoundIdItem := range votingRoundId {
		votingRoundIdRule = append(votingRoundIdRule, votingRoundIdItem)
	}

	logs, sub, err := _Relay.contract.FilterLogs(opts, "ProtocolMessageRelayed", protocolIdRule, votingRoundIdRule)
	if err != nil {
		return nil, err
	}
	return &RelayProtocolMessageRelayedIterator{contract: _Relay.contract, event: "ProtocolMessageRelayed", logs: logs, sub: sub}, nil
}

// WatchProtocolMessageRelayed is a free log subscription operation binding the contract event 0x4b781cfef3123d9257ab69e6e8ea36ad75a346d63c5ecf8a46931a0eef48bb9e.
//
// Solidity: event ProtocolMessageRelayed(uint8 indexed protocolId, uint32 indexed votingRoundId, bool isSecureRandom, bytes32 merkleRoot)
func (_Relay *RelayFilterer) WatchProtocolMessageRelayed(opts *bind.WatchOpts, sink chan<- *RelayProtocolMessageRelayed, protocolId []uint8, votingRoundId []uint32) (event.Subscription, error) {

	var protocolIdRule []interface{}
	for _, protocolIdItem := range protocolId {
		protocolIdRule = append(protocolIdRule, protocolIdItem)
	}
	var votingRoundIdRule []interface{}
	for _, votingRoundIdItem := range votingRoundId {
		votingRoundIdRule = append(votingRoundIdRule, votingRoundIdItem)
	}

	logs, sub, err := _Relay.contract.WatchLogs(opts, "ProtocolMessageRelayed", protocolIdRule, votingRoundIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RelayProtocolMessageRelayed)
				if err := _Relay.contract.UnpackLog(event, "ProtocolMessageRelayed", log); err != nil {
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

// ParseProtocolMessageRelayed is a log parse operation binding the contract event 0x4b781cfef3123d9257ab69e6e8ea36ad75a346d63c5ecf8a46931a0eef48bb9e.
//
// Solidity: event ProtocolMessageRelayed(uint8 indexed protocolId, uint32 indexed votingRoundId, bool isSecureRandom, bytes32 merkleRoot)
func (_Relay *RelayFilterer) ParseProtocolMessageRelayed(log types.Log) (*RelayProtocolMessageRelayed, error) {
	event := new(RelayProtocolMessageRelayed)
	if err := _Relay.contract.UnpackLog(event, "ProtocolMessageRelayed", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RelaySigningPolicyInitializedIterator is returned from FilterSigningPolicyInitialized and is used to iterate over the raw logs and unpacked data for SigningPolicyInitialized events raised by the Relay contract.
type RelaySigningPolicyInitializedIterator struct {
	Event *RelaySigningPolicyInitialized // Event containing the contract specifics and raw log

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
func (it *RelaySigningPolicyInitializedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RelaySigningPolicyInitialized)
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
		it.Event = new(RelaySigningPolicyInitialized)
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
func (it *RelaySigningPolicyInitializedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RelaySigningPolicyInitializedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RelaySigningPolicyInitialized represents a SigningPolicyInitialized event raised by the Relay contract.
type RelaySigningPolicyInitialized struct {
	RewardEpochId      *big.Int
	StartVotingRoundId uint32
	Threshold          uint16
	Seed               *big.Int
	Voters             []common.Address
	Weights            []uint16
	SigningPolicyBytes []byte
	Timestamp          uint64
	Raw                types.Log // Blockchain specific contextual infos
}

// FilterSigningPolicyInitialized is a free log retrieval operation binding the contract event 0x91d0280e969157fc6c5b8f952f237b03d934b18534dafcac839075bbc33522f8.
//
// Solidity: event SigningPolicyInitialized(uint24 indexed rewardEpochId, uint32 startVotingRoundId, uint16 threshold, uint256 seed, address[] voters, uint16[] weights, bytes signingPolicyBytes, uint64 timestamp)
func (_Relay *RelayFilterer) FilterSigningPolicyInitialized(opts *bind.FilterOpts, rewardEpochId []*big.Int) (*RelaySigningPolicyInitializedIterator, error) {

	var rewardEpochIdRule []interface{}
	for _, rewardEpochIdItem := range rewardEpochId {
		rewardEpochIdRule = append(rewardEpochIdRule, rewardEpochIdItem)
	}

	logs, sub, err := _Relay.contract.FilterLogs(opts, "SigningPolicyInitialized", rewardEpochIdRule)
	if err != nil {
		return nil, err
	}
	return &RelaySigningPolicyInitializedIterator{contract: _Relay.contract, event: "SigningPolicyInitialized", logs: logs, sub: sub}, nil
}

// WatchSigningPolicyInitialized is a free log subscription operation binding the contract event 0x91d0280e969157fc6c5b8f952f237b03d934b18534dafcac839075bbc33522f8.
//
// Solidity: event SigningPolicyInitialized(uint24 indexed rewardEpochId, uint32 startVotingRoundId, uint16 threshold, uint256 seed, address[] voters, uint16[] weights, bytes signingPolicyBytes, uint64 timestamp)
func (_Relay *RelayFilterer) WatchSigningPolicyInitialized(opts *bind.WatchOpts, sink chan<- *RelaySigningPolicyInitialized, rewardEpochId []*big.Int) (event.Subscription, error) {

	var rewardEpochIdRule []interface{}
	for _, rewardEpochIdItem := range rewardEpochId {
		rewardEpochIdRule = append(rewardEpochIdRule, rewardEpochIdItem)
	}

	logs, sub, err := _Relay.contract.WatchLogs(opts, "SigningPolicyInitialized", rewardEpochIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RelaySigningPolicyInitialized)
				if err := _Relay.contract.UnpackLog(event, "SigningPolicyInitialized", log); err != nil {
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

// ParseSigningPolicyInitialized is a log parse operation binding the contract event 0x91d0280e969157fc6c5b8f952f237b03d934b18534dafcac839075bbc33522f8.
//
// Solidity: event SigningPolicyInitialized(uint24 indexed rewardEpochId, uint32 startVotingRoundId, uint16 threshold, uint256 seed, address[] voters, uint16[] weights, bytes signingPolicyBytes, uint64 timestamp)
func (_Relay *RelayFilterer) ParseSigningPolicyInitialized(log types.Log) (*RelaySigningPolicyInitialized, error) {
	event := new(RelaySigningPolicyInitialized)
	if err := _Relay.contract.UnpackLog(event, "SigningPolicyInitialized", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RelaySigningPolicyRelayedIterator is returned from FilterSigningPolicyRelayed and is used to iterate over the raw logs and unpacked data for SigningPolicyRelayed events raised by the Relay contract.
type RelaySigningPolicyRelayedIterator struct {
	Event *RelaySigningPolicyRelayed // Event containing the contract specifics and raw log

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
func (it *RelaySigningPolicyRelayedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RelaySigningPolicyRelayed)
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
		it.Event = new(RelaySigningPolicyRelayed)
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
func (it *RelaySigningPolicyRelayedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RelaySigningPolicyRelayedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RelaySigningPolicyRelayed represents a SigningPolicyRelayed event raised by the Relay contract.
type RelaySigningPolicyRelayed struct {
	RewardEpochId *big.Int
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterSigningPolicyRelayed is a free log retrieval operation binding the contract event 0xe68f222ab8e81b2e0b38a4725817a1846aeee9a4a11f55899e83fc20766175e8.
//
// Solidity: event SigningPolicyRelayed(uint256 indexed rewardEpochId)
func (_Relay *RelayFilterer) FilterSigningPolicyRelayed(opts *bind.FilterOpts, rewardEpochId []*big.Int) (*RelaySigningPolicyRelayedIterator, error) {

	var rewardEpochIdRule []interface{}
	for _, rewardEpochIdItem := range rewardEpochId {
		rewardEpochIdRule = append(rewardEpochIdRule, rewardEpochIdItem)
	}

	logs, sub, err := _Relay.contract.FilterLogs(opts, "SigningPolicyRelayed", rewardEpochIdRule)
	if err != nil {
		return nil, err
	}
	return &RelaySigningPolicyRelayedIterator{contract: _Relay.contract, event: "SigningPolicyRelayed", logs: logs, sub: sub}, nil
}

// WatchSigningPolicyRelayed is a free log subscription operation binding the contract event 0xe68f222ab8e81b2e0b38a4725817a1846aeee9a4a11f55899e83fc20766175e8.
//
// Solidity: event SigningPolicyRelayed(uint256 indexed rewardEpochId)
func (_Relay *RelayFilterer) WatchSigningPolicyRelayed(opts *bind.WatchOpts, sink chan<- *RelaySigningPolicyRelayed, rewardEpochId []*big.Int) (event.Subscription, error) {

	var rewardEpochIdRule []interface{}
	for _, rewardEpochIdItem := range rewardEpochId {
		rewardEpochIdRule = append(rewardEpochIdRule, rewardEpochIdItem)
	}

	logs, sub, err := _Relay.contract.WatchLogs(opts, "SigningPolicyRelayed", rewardEpochIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RelaySigningPolicyRelayed)
				if err := _Relay.contract.UnpackLog(event, "SigningPolicyRelayed", log); err != nil {
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

// ParseSigningPolicyRelayed is a log parse operation binding the contract event 0xe68f222ab8e81b2e0b38a4725817a1846aeee9a4a11f55899e83fc20766175e8.
//
// Solidity: event SigningPolicyRelayed(uint256 indexed rewardEpochId)
func (_Relay *RelayFilterer) ParseSigningPolicyRelayed(log types.Log) (*RelaySigningPolicyRelayed, error) {
	event := new(RelaySigningPolicyRelayed)
	if err := _Relay.contract.UnpackLog(event, "SigningPolicyRelayed", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
