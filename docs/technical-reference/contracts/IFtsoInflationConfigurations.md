---
title: IFtsoInflationConfigurations
---

FtsoInflationConfigurations interface.
Sourced from `IFtsoInflationConfigurations.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFtsoInflationConfigurations.sol).

## Functions

### getFtsoConfiguration

Returns the FTSO configuration at `_index`.

```solidity
function getFtsoConfiguration(
    uint256 _index
) external view returns (
    struct IFtsoInflationConfigurations.FtsoConfiguration
);
```

#### Parameters

- `_index`: The index of the FTSO configuration.

### getFtsoConfigurations

Returns the FTSO configurations.

```solidity
function getFtsoConfigurations(
) external view returns (
    struct IFtsoInflationConfigurations.FtsoConfiguration[]
);
```

## Structures

### FtsoConfiguration

The FTSO configuration struct.

```solidity
struct FtsoConfiguration {
  bytes feedIds;
  uint24 inflationShare;
  uint16 minRewardedTurnoutBIPS;
  uint24 primaryBandRewardSharePPM;
  bytes secondaryBandWidthPPMs;
  uint16 mode;
}
```
