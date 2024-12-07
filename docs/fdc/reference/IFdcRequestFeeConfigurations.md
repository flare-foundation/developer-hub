---
title: IFdcRequestFeeConfigurations
sidebar_position: 4
description: Interface for managing FDC request fee configuration.
---

Interface for managing FDC request fee configuration.

Sourced from `IFdcRequestFeeConfigurations.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFdcRequestFeeConfigurations.sol).

## Functions

### getRequestFee

Method to get the base fee for an attestation request. It reverts if the request is not supported.

```solidity
function getRequestFee(
    bytes _data
) external view returns (
    uint256
);
```

#### Parameters

- `_data`: ABI encoded attestation request

## Events

### TypeAndSourceFeeRemoved

```solidity
event TypeAndSourceFeeRemoved(
    bytes32 attestationType,
    bytes32 source
)
```

### TypeAndSourceFeeSet

```solidity
event TypeAndSourceFeeSet(
    bytes32 attestationType,
    bytes32 source,
    uint256 fee
)
```
