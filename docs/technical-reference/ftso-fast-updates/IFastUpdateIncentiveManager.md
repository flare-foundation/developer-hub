# IFastUpdateIncentiveManager

## Event IncentiveOffered

Event emitted when an incentive is offered.

```solidity
event IncentiveOffered(Range rangeIncrease, SampleSize sampleSizeIncrease, Fee offerAmount)
```

## Event InflationRewardsOffered

Event emitted when inflation rewards are offered.

```solidity
event InflationRewardsOffered(uint24 rewardEpochId, bytes feedIds, bytes rewardBandValues, bytes inflationShares, uint256 amount)
```

## Fn offerIncentive

The entry point for third parties to make incentive offers. It accepts a payment and, using the contents of
`_offer`, computes how much the expected sample size will be increased to apply the requested (but capped) range
increase. If the ultimate value of the range exceeds the cap, funds are returned to the sender in proportion to
the amount by which the increase is adjusted to reach the cap.

```solidity
function offerIncentive(struct IFastUpdateIncentiveManager.IncentiveOffer _offer) external payable
```

Params:

| Name | Type | Description |
| ---- | ---- | ----------- |
| `_offer` | `struct IFastUpdateIncentiveManager.IncentiveOffer` | The requested amount of per-block variation range increase, along with a cap for the ultimate range. |

## Fn getExpectedSampleSize

Viewer for the current value of the expected sample size.

```solidity
function getExpectedSampleSize() external view returns (SampleSize)
```

## Fn getPrecision

Viewer for the current value of the unit delta's precision (the fractional part of the scale).

```solidity
function getPrecision() external view returns (Precision)
```

## Fn getRange

Viewer for the current value of the per-block variation range.

```solidity
function getRange() external view returns (Range)
```

## Fn getScale

Viewer for the current value of the scale itself.

```solidity
function getScale() external view returns (Scale)
```

