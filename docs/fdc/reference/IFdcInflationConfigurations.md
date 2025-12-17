---
title: IFdcInflationConfigurations
sidebar_position: 5
description: Interface for managing FDC inflation configuration.
---

import CodeBlock from "@theme/CodeBlock";
import InflationMonitor from "!!raw-loader!/examples/developer-hub-solidity/InflationMonitor.sol";
import RemixEmbed from "@site/src/components/RemixEmbed";

Interface for managing Flare Data Connector (FDC) inflation configuration.

Sourced from `IFdcInflationConfigurations.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFdcInflationConfigurations.sol).

## Overview

The IFdcInflationConfigurations interface allows access to the inflation distribution settings for different attestation types and sources within the Flare Data Connector system. These configurations determine how inflation rewards are allocated to validators based on the attestation requests they process.

## Functions

### getFdcConfiguration

Returns a single FDC configuration at the specified index.

```solidity
function getFdcConfiguration(
    uint256 _index
) external view returns (
    struct IFdcInflationConfigurations.FdcConfiguration
);
```

**Parameters**

- `_index`: The index of the FDC configuration

**Returns**

- `FdcConfiguration`: The configuration struct at the specified index

### getFdcConfigurations

Returns the complete array of all FDC configurations.

```solidity
function getFdcConfigurations(
) external view returns (
    struct IFdcInflationConfigurations.FdcConfiguration[]
);
```

**Returns**

- `FdcConfiguration[]`: Array of all configured FDC configurations

## Structures

### FdcConfiguration

Configuration structure for FDC inflation settings per attestation type and source.

```solidity
struct FdcConfiguration {
  bytes32 attestationType;
  bytes32 source;
  uint24 inflationShare;
  uint8 minRequestsThreshold;
  uint224 mode;
}
```

**Fields**

- `attestationType`: Identifier for the attestation type (e.g., AddressValidity, BalanceDecreasingTransaction)
- `source`: The data source identifier (e.g., BTC, DOGE, XRP)
- `inflationShare`: Percentage share of the total inflation allocated to this configuration (basis points)
- `minRequestsThreshold`: Minimum number of requests required for this configuration to receive inflation rewards
- `mode`: Additional configuration flags and settings

## Usage Example

<CodeBlock language="solidity" title="InflationMonitor.sol">
  {InflationMonitor}
</CodeBlock>
<RemixEmbed fileName="InflationMonitor.sol">Open example in Remix</RemixEmbed>
