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

// FtsoV2FeedConsumerMetaData contains all meta data concerning the FtsoV2FeedConsumer contract.
var FtsoV2FeedConsumerMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"feedIndexes\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getFtsoV2CurrentFeedValues\",\"outputs\":[{\"internalType\":\"uint256[]\",\"name\":\"_feedValues\",\"type\":\"uint256[]\"},{\"internalType\":\"int8[]\",\"name\":\"_decimals\",\"type\":\"int8[]\"},{\"internalType\":\"uint64\",\"name\":\"_timestamp\",\"type\":\"uint64\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
	Bin: "0x60806040526040518060600160405280600060ff168152602001600260ff168152602001600960ff16815250600290600361003b92919061017a565b5034801561004857600080fd5b5073ad67fe66660fb8dfe9d6b1b4240d8650e30f60196000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166382760fca6040518163ffffffff1660e01b81526004016100f490610246565b602060405180830381865afa158015610111573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061013591906102c9565b600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506102f6565b8280548282559060005260206000209081019282156101bb579160200282015b828111156101ba578251829060ff1690559160200191906001019061019a565b5b5090506101c891906101cc565b5090565b5b808211156101e55760008160009055506001016101cd565b5090565b600082825260208201905092915050565b7f4661737455706461746572000000000000000000000000000000000000000000600082015250565b6000610230600b836101e9565b915061023b826101fa565b602082019050919050565b6000602082019050818103600083015261025f81610223565b9050919050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006102968261026b565b9050919050565b6102a68161028b565b81146102b157600080fd5b50565b6000815190506102c38161029d565b92915050565b6000602082840312156102df576102de610266565b5b60006102ed848285016102b4565b91505092915050565b610845806103056000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063dae2f4bc1461003b578063f601bc8b1461006b575b600080fd5b610055600480360381019061005091906101bb565b61008b565b60405161006291906101f7565b60405180910390f35b6100736100af565b604051610082939291906103be565b60405180910390f35b6002818154811061009b57600080fd5b906000526020600020016000915090505481565b606080600080600080600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166345a15d3c60026040518263ffffffff1660e01b815260040161011491906104d9565b600060405180830381865afa158015610131573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f8201168201806040525081019061015a9190610784565b925092509250828282955095509550505050909192565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b61019881610185565b81146101a357600080fd5b50565b6000813590506101b58161018f565b92915050565b6000602082840312156101d1576101d061017b565b5b60006101df848285016101a6565b91505092915050565b6101f181610185565b82525050565b600060208201905061020c60008301846101e8565b92915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b61024781610185565b82525050565b6000610259838361023e565b60208301905092915050565b6000602082019050919050565b600061027d82610212565b610287818561021d565b93506102928361022e565b8060005b838110156102c35781516102aa888261024d565b97506102b583610265565b925050600181019050610296565b5085935050505092915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b60008160000b9050919050565b610312816102fc565b82525050565b60006103248383610309565b60208301905092915050565b6000602082019050919050565b6000610348826102d0565b61035281856102db565b935061035d836102ec565b8060005b8381101561038e5781516103758882610318565b975061038083610330565b925050600181019050610361565b5085935050505092915050565b600067ffffffffffffffff82169050919050565b6103b88161039b565b82525050565b600060608201905081810360008301526103d88186610272565b905081810360208301526103ec818561033d565b90506103fb60408301846103af565b949350505050565b600081549050919050565b60008190508160005260206000209050919050565b60008160001c9050919050565b6000819050919050565b600061044d61044883610423565b610430565b9050919050565b6000610460825461043a565b9050919050565b6000600182019050919050565b600061047f82610403565b610489818561021d565b93506104948361040e565b8060005b838110156104cc576104a982610454565b6104b3888261024d565b97506104be83610467565b925050600181019050610498565b5085935050505092915050565b600060208201905081810360008301526104f38184610474565b905092915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61054982610500565b810181811067ffffffffffffffff8211171561056857610567610511565b5b80604052505050565b600061057b610171565b90506105878282610540565b919050565b600067ffffffffffffffff8211156105a7576105a6610511565b5b602082029050602081019050919050565b600080fd5b6000815190506105cc8161018f565b92915050565b60006105e56105e08461058c565b610571565b90508083825260208201905060208402830185811115610608576106076105b8565b5b835b81811015610631578061061d88826105bd565b84526020840193505060208101905061060a565b5050509392505050565b600082601f8301126106505761064f6104fb565b5b81516106608482602086016105d2565b91505092915050565b600067ffffffffffffffff82111561068457610683610511565b5b602082029050602081019050919050565b61069e816102fc565b81146106a957600080fd5b50565b6000815190506106bb81610695565b92915050565b60006106d46106cf84610669565b610571565b905080838252602082019050602084028301858111156106f7576106f66105b8565b5b835b81811015610720578061070c88826106ac565b8452602084019350506020810190506106f9565b5050509392505050565b600082601f83011261073f5761073e6104fb565b5b815161074f8482602086016106c1565b91505092915050565b6107618161039b565b811461076c57600080fd5b50565b60008151905061077e81610758565b92915050565b60008060006060848603121561079d5761079c61017b565b5b600084015167ffffffffffffffff8111156107bb576107ba610180565b5b6107c78682870161063b565b935050602084015167ffffffffffffffff8111156107e8576107e7610180565b5b6107f48682870161072a565b92505060406108058682870161076f565b915050925092509256fea2646970667358221220eb33bd14ba21e825dfd87aec9ad44e3f2bb8f9c567df65246a6c05c998d410c764736f6c63430008190033",
}

// FtsoV2FeedConsumerABI is the input ABI used to generate the binding from.
// Deprecated: Use FtsoV2FeedConsumerMetaData.ABI instead.
var FtsoV2FeedConsumerABI = FtsoV2FeedConsumerMetaData.ABI

// FtsoV2FeedConsumerBin is the compiled bytecode used for deploying new contracts.
// Deprecated: Use FtsoV2FeedConsumerMetaData.Bin instead.
var FtsoV2FeedConsumerBin = FtsoV2FeedConsumerMetaData.Bin

// DeployFtsoV2FeedConsumer deploys a new Ethereum contract, binding an instance of FtsoV2FeedConsumer to it.
func DeployFtsoV2FeedConsumer(auth *bind.TransactOpts, backend bind.ContractBackend) (common.Address, *types.Transaction, *FtsoV2FeedConsumer, error) {
	parsed, err := FtsoV2FeedConsumerMetaData.GetAbi()
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	if parsed == nil {
		return common.Address{}, nil, nil, errors.New("GetABI returned nil")
	}

	address, tx, contract, err := bind.DeployContract(auth, *parsed, common.FromHex(FtsoV2FeedConsumerBin), backend)
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	return address, tx, &FtsoV2FeedConsumer{FtsoV2FeedConsumerCaller: FtsoV2FeedConsumerCaller{contract: contract}, FtsoV2FeedConsumerTransactor: FtsoV2FeedConsumerTransactor{contract: contract}, FtsoV2FeedConsumerFilterer: FtsoV2FeedConsumerFilterer{contract: contract}}, nil
}

// FtsoV2FeedConsumer is an auto generated Go binding around an Ethereum contract.
type FtsoV2FeedConsumer struct {
	FtsoV2FeedConsumerCaller     // Read-only binding to the contract
	FtsoV2FeedConsumerTransactor // Write-only binding to the contract
	FtsoV2FeedConsumerFilterer   // Log filterer for contract events
}

// FtsoV2FeedConsumerCaller is an auto generated read-only Go binding around an Ethereum contract.
type FtsoV2FeedConsumerCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FtsoV2FeedConsumerTransactor is an auto generated write-only Go binding around an Ethereum contract.
type FtsoV2FeedConsumerTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FtsoV2FeedConsumerFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type FtsoV2FeedConsumerFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FtsoV2FeedConsumerSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type FtsoV2FeedConsumerSession struct {
	Contract     *FtsoV2FeedConsumer // Generic contract binding to set the session for
	CallOpts     bind.CallOpts       // Call options to use throughout this session
	TransactOpts bind.TransactOpts   // Transaction auth options to use throughout this session
}

// FtsoV2FeedConsumerCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type FtsoV2FeedConsumerCallerSession struct {
	Contract *FtsoV2FeedConsumerCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts             // Call options to use throughout this session
}

// FtsoV2FeedConsumerTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type FtsoV2FeedConsumerTransactorSession struct {
	Contract     *FtsoV2FeedConsumerTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts             // Transaction auth options to use throughout this session
}

// FtsoV2FeedConsumerRaw is an auto generated low-level Go binding around an Ethereum contract.
type FtsoV2FeedConsumerRaw struct {
	Contract *FtsoV2FeedConsumer // Generic contract binding to access the raw methods on
}

// FtsoV2FeedConsumerCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type FtsoV2FeedConsumerCallerRaw struct {
	Contract *FtsoV2FeedConsumerCaller // Generic read-only contract binding to access the raw methods on
}

// FtsoV2FeedConsumerTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type FtsoV2FeedConsumerTransactorRaw struct {
	Contract *FtsoV2FeedConsumerTransactor // Generic write-only contract binding to access the raw methods on
}

// NewFtsoV2FeedConsumer creates a new instance of FtsoV2FeedConsumer, bound to a specific deployed contract.
func NewFtsoV2FeedConsumer(address common.Address, backend bind.ContractBackend) (*FtsoV2FeedConsumer, error) {
	contract, err := bindFtsoV2FeedConsumer(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &FtsoV2FeedConsumer{FtsoV2FeedConsumerCaller: FtsoV2FeedConsumerCaller{contract: contract}, FtsoV2FeedConsumerTransactor: FtsoV2FeedConsumerTransactor{contract: contract}, FtsoV2FeedConsumerFilterer: FtsoV2FeedConsumerFilterer{contract: contract}}, nil
}

// NewFtsoV2FeedConsumerCaller creates a new read-only instance of FtsoV2FeedConsumer, bound to a specific deployed contract.
func NewFtsoV2FeedConsumerCaller(address common.Address, caller bind.ContractCaller) (*FtsoV2FeedConsumerCaller, error) {
	contract, err := bindFtsoV2FeedConsumer(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &FtsoV2FeedConsumerCaller{contract: contract}, nil
}

// NewFtsoV2FeedConsumerTransactor creates a new write-only instance of FtsoV2FeedConsumer, bound to a specific deployed contract.
func NewFtsoV2FeedConsumerTransactor(address common.Address, transactor bind.ContractTransactor) (*FtsoV2FeedConsumerTransactor, error) {
	contract, err := bindFtsoV2FeedConsumer(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &FtsoV2FeedConsumerTransactor{contract: contract}, nil
}

// NewFtsoV2FeedConsumerFilterer creates a new log filterer instance of FtsoV2FeedConsumer, bound to a specific deployed contract.
func NewFtsoV2FeedConsumerFilterer(address common.Address, filterer bind.ContractFilterer) (*FtsoV2FeedConsumerFilterer, error) {
	contract, err := bindFtsoV2FeedConsumer(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &FtsoV2FeedConsumerFilterer{contract: contract}, nil
}

// bindFtsoV2FeedConsumer binds a generic wrapper to an already deployed contract.
func bindFtsoV2FeedConsumer(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := FtsoV2FeedConsumerMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FtsoV2FeedConsumer *FtsoV2FeedConsumerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FtsoV2FeedConsumer.Contract.FtsoV2FeedConsumerCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FtsoV2FeedConsumer *FtsoV2FeedConsumerRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FtsoV2FeedConsumer.Contract.FtsoV2FeedConsumerTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FtsoV2FeedConsumer *FtsoV2FeedConsumerRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FtsoV2FeedConsumer.Contract.FtsoV2FeedConsumerTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FtsoV2FeedConsumer *FtsoV2FeedConsumerCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FtsoV2FeedConsumer.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FtsoV2FeedConsumer *FtsoV2FeedConsumerTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FtsoV2FeedConsumer.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FtsoV2FeedConsumer *FtsoV2FeedConsumerTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FtsoV2FeedConsumer.Contract.contract.Transact(opts, method, params...)
}

// FeedIndexes is a free data retrieval call binding the contract method 0xdae2f4bc.
//
// Solidity: function feedIndexes(uint256 ) view returns(uint256)
func (_FtsoV2FeedConsumer *FtsoV2FeedConsumerCaller) FeedIndexes(opts *bind.CallOpts, arg0 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _FtsoV2FeedConsumer.contract.Call(opts, &out, "feedIndexes", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// FeedIndexes is a free data retrieval call binding the contract method 0xdae2f4bc.
//
// Solidity: function feedIndexes(uint256 ) view returns(uint256)
func (_FtsoV2FeedConsumer *FtsoV2FeedConsumerSession) FeedIndexes(arg0 *big.Int) (*big.Int, error) {
	return _FtsoV2FeedConsumer.Contract.FeedIndexes(&_FtsoV2FeedConsumer.CallOpts, arg0)
}

// FeedIndexes is a free data retrieval call binding the contract method 0xdae2f4bc.
//
// Solidity: function feedIndexes(uint256 ) view returns(uint256)
func (_FtsoV2FeedConsumer *FtsoV2FeedConsumerCallerSession) FeedIndexes(arg0 *big.Int) (*big.Int, error) {
	return _FtsoV2FeedConsumer.Contract.FeedIndexes(&_FtsoV2FeedConsumer.CallOpts, arg0)
}

// GetFtsoV2CurrentFeedValues is a free data retrieval call binding the contract method 0xf601bc8b.
//
// Solidity: function getFtsoV2CurrentFeedValues() view returns(uint256[] _feedValues, int8[] _decimals, uint64 _timestamp)
func (_FtsoV2FeedConsumer *FtsoV2FeedConsumerCaller) GetFtsoV2CurrentFeedValues(opts *bind.CallOpts) (struct {
	FeedValues []*big.Int
	Decimals   []int8
	Timestamp  uint64
}, error) {
	var out []interface{}
	err := _FtsoV2FeedConsumer.contract.Call(opts, &out, "getFtsoV2CurrentFeedValues")

	outstruct := new(struct {
		FeedValues []*big.Int
		Decimals   []int8
		Timestamp  uint64
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.FeedValues = *abi.ConvertType(out[0], new([]*big.Int)).(*[]*big.Int)
	outstruct.Decimals = *abi.ConvertType(out[1], new([]int8)).(*[]int8)
	outstruct.Timestamp = *abi.ConvertType(out[2], new(uint64)).(*uint64)

	return *outstruct, err

}

// GetFtsoV2CurrentFeedValues is a free data retrieval call binding the contract method 0xf601bc8b.
//
// Solidity: function getFtsoV2CurrentFeedValues() view returns(uint256[] _feedValues, int8[] _decimals, uint64 _timestamp)
func (_FtsoV2FeedConsumer *FtsoV2FeedConsumerSession) GetFtsoV2CurrentFeedValues() (struct {
	FeedValues []*big.Int
	Decimals   []int8
	Timestamp  uint64
}, error) {
	return _FtsoV2FeedConsumer.Contract.GetFtsoV2CurrentFeedValues(&_FtsoV2FeedConsumer.CallOpts)
}

// GetFtsoV2CurrentFeedValues is a free data retrieval call binding the contract method 0xf601bc8b.
//
// Solidity: function getFtsoV2CurrentFeedValues() view returns(uint256[] _feedValues, int8[] _decimals, uint64 _timestamp)
func (_FtsoV2FeedConsumer *FtsoV2FeedConsumerCallerSession) GetFtsoV2CurrentFeedValues() (struct {
	FeedValues []*big.Int
	Decimals   []int8
	Timestamp  uint64
}, error) {
	return _FtsoV2FeedConsumer.Contract.GetFtsoV2CurrentFeedValues(&_FtsoV2FeedConsumer.CallOpts)
}
