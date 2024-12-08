---
title: IFtsoRewardOffersManager
---

FtsoRewardOffersManager interface.
Sourced from `IFtsoRewardOffersManager.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFtsoRewardOffersManager.sol).

## Functions

### minimalRewardsOfferValueWei

Minimal rewards offer value (in wei).

```solidity
function minimalRewardsOfferValueWei(
) external view returns (
    uint256
);
```

### offerRewards

Allows community to offer rewards.

```solidity
function offerRewards(
    uint24 _nextRewardEpochId,
    struct IFtsoRewardOffersManager.Offer[] _offers
) external payable;
```

#### Parameters

- `_nextRewardEpochId`: The next reward epoch id.
- `_offers`: The list of offers.

## Events

### InflationRewardsOffered

Event emitted when inflation rewards are offered.

```solidity
event InflationRewardsOffered(
    uint24 rewardEpochId,
    bytes feedIds,
    bytes decimals,
    uint256 amount,
    uint16 minRewardedTurnoutBIPS,
    uint24 primaryBandRewardSharePPM,
    bytes secondaryBandWidthPPMs,
    uint16 mode
)
```

### MinimalRewardsOfferValueSet

Event emitted when the minimal rewards offer value is set.

```solidity
event MinimalRewardsOfferValueSet(
    uint256 valueWei
)
```

### RewardsOffered

Event emitted when a reward offer is received.

```solidity
event RewardsOffered(
    uint24 rewardEpochId,
    bytes21 feedId,
    int8 decimals,
    uint256 amount,
    uint16 minRewardedTurnoutBIPS,
    uint24 primaryBandRewardSharePPM,
    uint24 secondaryBandWidthPPM,
    address claimBackAddress
)
```

## Structures

### Offer

Defines a reward offer.

```solidity
struct Offer {
  uint120 amount;
  bytes21 feedId;
  uint16 minRewardedTurnoutBIPS;
  uint24 primaryBandRewardSharePPM;
  uint24 secondaryBandWidthPPM;
  address claimBackAddress;
}
```
