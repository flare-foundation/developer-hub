---
title: IFeeCalculator
description: Interface for calculating block-latency feed fees.
sidebar_position: 2
---

Interface for calculating block-latency feed fees.

Sourced from `IFeeCalculator.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFeeCalculator.sol).

## Functions

### calculateFeeByIds

Calculates a fee that needs to be paid to fetch feeds' data.

```solidity
function calculateFeeByIds(
    bytes21[] _feedIds
) external view returns (
    uint256 _fee
);
```

#### Parameters

- `_feedIds`: List of feed ids.

### calculateFeeByIndices

Calculates a fee that needs to be paid to fetch feeds' data.

```solidity
function calculateFeeByIndices(
    uint256[] _indices
) external view returns (
    uint256 _fee
);
```

#### Parameters

- `_indices`: Indices of the feeds, corresponding to feed ids in the FastUpdatesConfiguration contract.
