---
title: IFastUpdateIncentiveManager
sidebar_position: 6
description: Interface for making volatility incentive offers.
---

Interface for making volatility incentive offers.

Sourced from `IFastUpdateIncentiveManager.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFastUpdateIncentiveManager.sol).

## Functions

### getBaseScale

Viewer for the base value of the scale itself.

```solidity
function getBaseScale(
) external view returns (
    Scale
);
```

### getCurrentSampleSizeIncreasePrice

Viewer for the current value of sample size increase price.

```solidity
function getCurrentSampleSizeIncreasePrice(
) external view returns (
    Fee
);
```

### getExpectedSampleSize

Viewer for the current value of the expected sample size.

```solidity
function getExpectedSampleSize(
) external view returns (
    SampleSize
);
```

### getIncentiveDuration

```solidity
function getIncentiveDuration(
) external view returns (
    uint256
);
```

### getPrecision

Viewer for the current value of the unit delta's precision (the fractional part of the scale).

```solidity
function getPrecision(
) external view returns (
    Precision
);
```

### getRange

Viewer for the current value of the per-block variation range.

```solidity
function getRange(
) external view returns (
    Range
);
```

### getScale

Viewer for the current value of the scale itself.

```solidity
function getScale(
) external view returns (
    Scale
);
```

### offerIncentive

The entry point for third parties to make incentive offers. It accepts a payment and, using the contents of
`_offer`, computes how much the expected sample size will be increased to apply the requested (but capped) range
increase. If the ultimate value of the range exceeds the cap, funds are returned to the sender in proportion to
the amount by which the increase is adjusted to reach the cap.

```solidity
function offerIncentive(
    struct IFastUpdateIncentiveManager.IncentiveOffer _offer
) external payable;
```

#### Parameters

- `_offer`: The requested amount of per-block variation range increase, along with a cap for the ultimate range.

### rangeIncreaseLimit

The maximum value that the range can be increased to by an incentive offer.

```solidity
function rangeIncreaseLimit(
) external view returns (
    Range
);
```

### rangeIncreasePrice

The price for increasing the per-block range of variation by 1, prorated for the actual amount of increase.

```solidity
function rangeIncreasePrice(
) external view returns (
    Fee
);
```

### sampleIncreaseLimit

The maximum amount by which the expected sample size can be increased by an incentive offer.
This is controlled by governance and forces a minimum cost to increasing the sample size greatly,
which would otherwise be an attack on the protocol.

```solidity
function sampleIncreaseLimit(
) external view returns (
    SampleSize
);
```

## Events

### IncentiveOffered

Event emitted when an incentive is offered.

```solidity
event IncentiveOffered(
    uint24 rewardEpochId,
    Range rangeIncrease,
    SampleSize sampleSizeIncrease,
    Fee offerAmount
)
```

### InflationRewardsOffered

Event emitted when inflation rewards are offered.

```solidity
event InflationRewardsOffered(
    uint24 rewardEpochId,
    struct IFastUpdatesConfiguration.FeedConfiguration[] feedConfigurations,
    uint256 amount
)
```

## Structures

### IncentiveOffer

Incentive offer structure.

```solidity
struct IncentiveOffer {
  Range rangeIncrease;
  Range rangeLimit;
}
```
