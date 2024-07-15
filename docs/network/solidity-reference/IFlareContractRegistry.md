---
title: IFlareContractRegistry
sidebar_position: 1
description: Registry interface with all Flare contract addresses.
---

Registry interface with all Flare contract addresses.

Sourced from `IFlareContractRegistry.sol` on [GitLab](https://gitlab.com/flarenetwork/flare-smart-contracts/-/blob/master/contracts/userInterfaces/IFlareContractRegistry.sol).

## Functions

### getContractAddressByName

Returns contract address for the given name - might be address(0)

```solidity
function getContractAddressByName(
    string _name
) external view returns (
    address);
```

#### Parameters

- `_name`: name of the contract

### getContractAddressByHash

Returns contract address for the given name hash - might be address(0)

```solidity
function getContractAddressByHash(
    bytes32 _nameHash
) external view returns (
    address);
```

#### Parameters

- `_nameHash`: hash of the contract name (keccak256(abi.encode(name))

### getContractAddressesByName

Returns contract addresses for the given names - might be address(0)

```solidity
function getContractAddressesByName(
    string[] _names
) external view returns (
    address[]);
```

#### Parameters

- `_names`: names of the contracts

### getContractAddressesByHash

Returns contract addresses for the given name hashes - might be address(0)

```solidity
function getContractAddressesByHash(
    bytes32[] _nameHashes
) external view returns (
    address[]);
```

#### Parameters

- `_nameHashes`: hashes of the contract names (keccak256(abi.encode(name))

### getAllContracts

Returns all contract names and corresponding addresses

```solidity
function getAllContracts(
) external view returns (
    string[] _names,
    address[] _addresses);
```
