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

// FtsoV2FeedConsumerMetaData contains all meta data concerning the FtsoV2FeedConsumer contract.
var FtsoV2FeedConsumerMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"feedIndexes\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getFtsoV2CurrentFeedValues\",\"outputs\":[{\"internalType\":\"uint256[]\",\"name\":\"_feedValues\",\"type\":\"uint256[]\"},{\"internalType\":\"int8[]\",\"name\":\"_decimals\",\"type\":\"int8[]\"},{\"internalType\":\"uint64\",\"name\":\"_timestamp\",\"type\":\"uint64\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
	Bin: "0x608060405260405180606001604052805f60ff168152602001600260ff168152602001600960ff16815250600290600361003a929190610173565b50348015610046575f80fd5b5073ad67fe66660fb8dfe9d6b1b4240d8650e30f60195f806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166382760fca6040518163ffffffff1660e01b81526004016100f090610238565b602060405180830381865afa15801561010b573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061012f91906102b4565b60015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506102df565b828054828255905f5260205f209081019282156101b2579160200282015b828111156101b1578251829060ff16905591602001919060010190610191565b5b5090506101bf91906101c3565b5090565b5b808211156101da575f815f9055506001016101c4565b5090565b5f82825260208201905092915050565b7f46617374557064617465720000000000000000000000000000000000000000005f82015250565b5f610222600b836101de565b915061022d826101ee565b602082019050919050565b5f6020820190508181035f83015261024f81610216565b9050919050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6102838261025a565b9050919050565b61029381610279565b811461029d575f80fd5b50565b5f815190506102ae8161028a565b92915050565b5f602082840312156102c9576102c8610256565b5b5f6102d6848285016102a0565b91505092915050565b6107f8806102ec5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c8063dae2f4bc14610038578063f601bc8b14610068575b5f80fd5b610052600480360381019061004d91906101a7565b610088565b60405161005f91906101e1565b60405180910390f35b6100706100a8565b60405161007f93929190610395565b60405180910390f35b60028181548110610097575f80fd5b905f5260205f20015f915090505481565b6060805f805f8060015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166345a15d3c60026040518263ffffffff1660e01b815260040161010a91906104a2565b5f60405180830381865afa158015610124573d5f803e3d5ffd5b505050506040513d5f823e3d601f19601f8201168201806040525081019061014c919061073a565b925092509250828282955095509550505050909192565b5f604051905090565b5f80fd5b5f80fd5b5f819050919050565b61018681610174565b8114610190575f80fd5b50565b5f813590506101a18161017d565b92915050565b5f602082840312156101bc576101bb61016c565b5b5f6101c984828501610193565b91505092915050565b6101db81610174565b82525050565b5f6020820190506101f45f8301846101d2565b92915050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b61022c81610174565b82525050565b5f61023d8383610223565b60208301905092915050565b5f602082019050919050565b5f61025f826101fa565b6102698185610204565b935061027483610214565b805f5b838110156102a457815161028b8882610232565b975061029683610249565b925050600181019050610277565b5085935050505092915050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b5f815f0b9050919050565b6102ee816102da565b82525050565b5f6102ff83836102e5565b60208301905092915050565b5f602082019050919050565b5f610321826102b1565b61032b81856102bb565b9350610336836102cb565b805f5b8381101561036657815161034d88826102f4565b97506103588361030b565b925050600181019050610339565b5085935050505092915050565b5f67ffffffffffffffff82169050919050565b61038f81610373565b82525050565b5f6060820190508181035f8301526103ad8186610255565b905081810360208301526103c18185610317565b90506103d06040830184610386565b949350505050565b5f81549050919050565b5f819050815f5260205f209050919050565b5f815f1c9050919050565b5f819050919050565b5f61041a610415836103f4565b6103ff565b9050919050565b5f61042c8254610408565b9050919050565b5f600182019050919050565b5f610449826103d8565b6104538185610204565b935061045e836103e2565b805f5b838110156104955761047282610421565b61047c8882610232565b975061048783610433565b925050600181019050610461565b5085935050505092915050565b5f6020820190508181035f8301526104ba818461043f565b905092915050565b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b61050c826104c6565b810181811067ffffffffffffffff8211171561052b5761052a6104d6565b5b80604052505050565b5f61053d610163565b90506105498282610503565b919050565b5f67ffffffffffffffff821115610568576105676104d6565b5b602082029050602081019050919050565b5f80fd5b5f8151905061058b8161017d565b92915050565b5f6105a361059e8461054e565b610534565b905080838252602082019050602084028301858111156105c6576105c5610579565b5b835b818110156105ef57806105db888261057d565b8452602084019350506020810190506105c8565b5050509392505050565b5f82601f83011261060d5761060c6104c2565b5b815161061d848260208601610591565b91505092915050565b5f67ffffffffffffffff8211156106405761063f6104d6565b5b602082029050602081019050919050565b61065a816102da565b8114610664575f80fd5b50565b5f8151905061067581610651565b92915050565b5f61068d61068884610626565b610534565b905080838252602082019050602084028301858111156106b0576106af610579565b5b835b818110156106d957806106c58882610667565b8452602084019350506020810190506106b2565b5050509392505050565b5f82601f8301126106f7576106f66104c2565b5b815161070784826020860161067b565b91505092915050565b61071981610373565b8114610723575f80fd5b50565b5f8151905061073481610710565b92915050565b5f805f606084860312156107515761075061016c565b5b5f84015167ffffffffffffffff81111561076e5761076d610170565b5b61077a868287016105f9565b935050602084015167ffffffffffffffff81111561079b5761079a610170565b5b6107a7868287016106e3565b92505060406107b886828701610726565b915050925092509256fea2646970667358221220ec64100f9062f5749e6541df584b0fc7e497728a2d80fa8301fb24b3b1e2692c64736f6c63430008190033",
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
