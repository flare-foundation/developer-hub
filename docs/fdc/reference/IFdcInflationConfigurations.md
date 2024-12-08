---
title: IFdcInflationConfigurations
sidebar_position: 5
description: Interface for managing FDC inflation configuration.
---

Interface for managing FDC inflation configuration.

Sourced from `IFdcInflationConfigurations.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFdcInflationConfigurations.sol).

## Functions

### getFdcConfiguration

Returns the FDC configuration at `_index`.

```solidity
function getFdcConfiguration(
    uint256 _index
) external view returns (
    struct IFdcInflationConfigurations.FdcConfiguration
);
```

#### Parameters

- `_index`: The index of the FDC configuration.

### getFdcConfigurations

Returns the FDC configurations.

```solidity
function getFdcConfigurations(
) external view returns (
    struct IFdcInflationConfigurations.FdcConfiguration[]
);
```

## Structures

### FdcConfiguration

The FDC configuration struct.

```solidity
struct FdcConfiguration {
  bytes32 attestationType;
  bytes32 source;
  uint24 inflationShare;
  uint8 minRequestsThreshold;
  uint224 mode;
}
```
