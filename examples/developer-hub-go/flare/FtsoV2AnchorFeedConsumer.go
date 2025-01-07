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
	Bin: "0x608060405234801561001057600080fd5b50610f23806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806387179d281461003b578063be2efe0914610057575b600080fd5b61005560048036038101906100509190610345565b61008b565b005b610071600480360381019061006c9190610422565b6101d6565b6040516100829594939291906104d5565b60405180910390f35b61009361025e565b73ffffffffffffffffffffffffffffffffffffffff1663ceb05472826040518263ffffffff1660e01b81526004016100cb9190610841565b602060405180830381865afa1580156100e8573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061010c919061089b565b61014b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161014290610925565b60405180910390fd5b806020016000808360200160000160208101906101689190610945565b63ffffffff1663ffffffff168152602001908152602001600020600083602001602001602081019061019a9190610972565b6affffffffffffffffffffff19166affffffffffffffffffffff1916815260200190815260200160002081816101d09190610db4565b90505050565b6000602052816000526040600020602052806000526040600020600091509150508060000160009054906101000a900463ffffffff16908060000160049054906101000a900460581b908060000160199054906101000a900460030b9080600001601d9054906101000a900461ffff169080600001601f9054906101000a900460000b905085565b600073ad67fe66660fb8dfe9d6b1b4240d8650e30f601973ffffffffffffffffffffffffffffffffffffffff1663159354a260405160200161029f90610e0e565b604051602081830303815290604052805190602001206040518263ffffffff1660e01b81526004016102d19190610e47565b602060405180830381865afa1580156102ee573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103129190610ec0565b905090565b600080fd5b600080fd5b600080fd5b600060c0828403121561033c5761033b610321565b5b81905092915050565b60006020828403121561035b5761035a610317565b5b600082013567ffffffffffffffff8111156103795761037861031c565b5b61038584828501610326565b91505092915050565b600063ffffffff82169050919050565b6103a78161038e565b81146103b257600080fd5b50565b6000813590506103c48161039e565b92915050565b60007fffffffffffffffffffffffffffffffffffffffffff000000000000000000000082169050919050565b6103ff816103ca565b811461040a57600080fd5b50565b60008135905061041c816103f6565b92915050565b6000806040838503121561043957610438610317565b5b6000610447858286016103b5565b92505060206104588582860161040d565b9150509250929050565b61046b8161038e565b82525050565b61047a816103ca565b82525050565b60008160030b9050919050565b61049681610480565b82525050565b600061ffff82169050919050565b6104b38161049c565b82525050565b60008160000b9050919050565b6104cf816104b9565b82525050565b600060a0820190506104ea6000830188610462565b6104f76020830187610471565b610504604083018661048d565b61051160608301856104aa565b61051e60808301846104c6565b9695505050505050565b600080fd5b600080fd5b600080fd5b6000808335600160200384360303811261055457610553610532565b5b83810192508235915060208301925067ffffffffffffffff82111561057c5761057b610528565b5b6020820236038313156105925761059161052d565b5b509250929050565b600082825260208201905092915050565b600080fd5b82818337505050565b60006105c5838561059a565b93507f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8311156105f8576105f76105ab565b5b6020830292506106098385846105b0565b82840190509392505050565b600082905092915050565b600061062f60208401846103b5565b905092915050565b6106408161038e565b82525050565b6000610655602084018461040d565b905092915050565b610666816103ca565b82525050565b61067581610480565b811461068057600080fd5b50565b6000813590506106928161066c565b92915050565b60006106a76020840184610683565b905092915050565b6106b881610480565b82525050565b6106c78161049c565b81146106d257600080fd5b50565b6000813590506106e4816106be565b92915050565b60006106f960208401846106d5565b905092915050565b61070a8161049c565b82525050565b610719816104b9565b811461072457600080fd5b50565b60008135905061073681610710565b92915050565b600061074b6020840184610727565b905092915050565b61075c816104b9565b82525050565b60a082016107736000830183610620565b6107806000850182610637565b5061078e6020830183610646565b61079b602085018261065d565b506107a96040830183610698565b6107b660408501826106af565b506107c460608301836106ea565b6107d16060850182610701565b506107df608083018361073c565b6107ec6080850182610753565b50505050565b600060c083016108056000840184610537565b85830360008701526108188382846105b9565b925050506108296020840184610615565b6108366020860182610762565b508091505092915050565b6000602082019050818103600083015261085b81846107f2565b905092915050565b60008115159050919050565b61087881610863565b811461088357600080fd5b50565b6000815190506108958161086f565b92915050565b6000602082840312156108b1576108b0610317565b5b60006108bf84828501610886565b91505092915050565b600082825260208201905092915050565b7f496e76616c69642070726f6f6600000000000000000000000000000000000000600082015250565b600061090f600d836108c8565b915061091a826108d9565b602082019050919050565b6000602082019050818103600083015261093e81610902565b9050919050565b60006020828403121561095b5761095a610317565b5b6000610969848285016103b5565b91505092915050565b60006020828403121561098857610987610317565b5b60006109968482850161040d565b91505092915050565b600081356109ac8161039e565b80915050919050565b60008160001b9050919050565b600063ffffffff6109d2846109b5565b9350801983169250808416831791505092915050565b6000819050919050565b6000610a0d610a08610a038461038e565b6109e8565b61038e565b9050919050565b6000819050919050565b610a27826109f2565b610a3a610a3382610a14565b83546109c2565b8255505050565b60008135610a4e816103f6565b80915050919050565b60008160201b9050919050565b600078ffffffffffffffffffffffffffffffffffffffffff00000000610a8984610a57565b9350801983169250808416831791505092915050565b6000610aaa826103ca565b9050919050565b60008160581c9050919050565b6000610ac982610ab1565b9050919050565b610ad982610a9f565b610aec610ae582610abe565b8354610a64565b8255505050565b60008135610b008161066c565b80915050919050565b60008160c81b9050919050565b60007cffffffff00000000000000000000000000000000000000000000000000610b3f84610b09565b9350801983169250808416831791505092915050565b6000610b70610b6b610b6684610480565b6109e8565b610480565b9050919050565b6000819050919050565b610b8a82610b55565b610b9d610b9682610b77565b8354610b16565b8255505050565b60008135610bb1816106be565b80915050919050565b60008160e81b9050919050565b60007effff0000000000000000000000000000000000000000000000000000000000610bf284610bba565b9350801983169250808416831791505092915050565b6000610c23610c1e610c198461049c565b6109e8565b61049c565b9050919050565b6000819050919050565b610c3d82610c08565b610c50610c4982610c2a565b8354610bc7565b8255505050565b60008135610c6481610710565b80915050919050565b60008160f81b9050919050565b60007fff00000000000000000000000000000000000000000000000000000000000000610ca684610c6d565b9350801983169250808416831791505092915050565b6000610cd7610cd2610ccd846104b9565b6109e8565b6104b9565b9050919050565b6000819050919050565b610cf182610cbc565b610d04610cfd82610cde565b8354610c7a565b8255505050565b600081016000830180610d1d8161099f565b9050610d298184610a1e565b505050600081016020830180610d3e81610a41565b9050610d4a8184610ad0565b505050600081016040830180610d5f81610af3565b9050610d6b8184610b81565b505050600081016060830180610d8081610ba4565b9050610d8c8184610c34565b505050600081016080830180610da181610c57565b9050610dad8184610ce8565b5050505050565b610dbe8282610d0b565b5050565b7f4674736f56320000000000000000000000000000000000000000000000000000600082015250565b6000610df86006836108c8565b9150610e0382610dc2565b602082019050919050565b60006020820190508181036000830152610e2781610deb565b9050919050565b6000819050919050565b610e4181610e2e565b82525050565b6000602082019050610e5c6000830184610e38565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610e8d82610e62565b9050919050565b610e9d81610e82565b8114610ea857600080fd5b50565b600081519050610eba81610e94565b92915050565b600060208284031215610ed657610ed5610317565b5b6000610ee484828501610eab565b9150509291505056fea26469706673582212208cebfd4f48357fe08a81979822b20cc1469fa8d28a77962c8b461b2f66651ff364736f6c63430008130033",
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
