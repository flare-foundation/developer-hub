---
title: IRewardManager
sidebar_position: 5
description: Facilitates the claiming and distribution of rewards to voters, delegators, and stakers.
---

Facilitates the claiming and distribution of rewards to voters, delegators, and stakers.

Sourced from `IRewardManager.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IRewardManager.sol).

## Functions

### active

Indicates if the contract is active - claims are enabled.

```solidity
function active(
) external view returns (
    bool
);
```

### autoClaim

Claim rewards for `_rewardOwners` and their PDAs.
Rewards are deposited to the WNat (to reward owner or PDA if enabled).
It can be called by reward owner or its authorized executor.
Only claiming from weight based claims is supported.

```solidity
function autoClaim(
    address[] _rewardOwners,
    uint24 _rewardEpochId,
    struct RewardsV2Interface.RewardClaimWithProof[] _proofs
) external;
```

#### Parameters

- `_rewardOwners`: Array of reward owners.
- `_rewardEpochId`: Id of the reward epoch up to which the rewards are claimed.
- `_proofs`: Array of reward claims with merkle proofs.

### claim

Claim rewards for `_rewardOwner` and transfer them to `_recipient`.
It can be called by reward owner or its authorized executor.

```solidity
function claim(
    address _rewardOwner,
    address payable _recipient,
    uint24 _rewardEpochId,
    bool _wrap,
    struct RewardsV2Interface.RewardClaimWithProof[] _proofs
) external returns (
    uint256 _rewardAmountWei
);
```

#### Parameters

- `_rewardOwner`: Address of the reward owner.
- `_recipient`: Address of the reward recipient.
- `_rewardEpochId`: Id of the reward epoch up to which the rewards are claimed.
- `_wrap`: Indicates if the reward should be wrapped (deposited) to the WNat contract.
- `_proofs`: Array of reward claims with merkle proofs.

#### Returns

- `_rewardAmountWei`: Amount of rewarded native tokens (wei).

### cleanupBlockNumber

Get the current cleanup block number.

```solidity
function cleanupBlockNumber(
) external view returns (
    uint256
);
```

#### Returns

- ``: The currently set cleanup block number.

### firstClaimableRewardEpochId

The first reward epoch id that was claimable.

```solidity
function firstClaimableRewardEpochId(
) external view returns (
    uint24
);
```

### getCurrentRewardEpochId

Returns current reward epoch id.

```solidity
function getCurrentRewardEpochId(
) external view returns (
    uint24
);
```

### getInitialRewardEpochId

Returns initial reward epoch id.

```solidity
function getInitialRewardEpochId(
) external view returns (
    uint256
);
```

### getNextClaimableRewardEpochId

Returns the next claimable reward epoch for a reward owner.

```solidity
function getNextClaimableRewardEpochId(
    address _rewardOwner
) external view returns (
    uint256
);
```

#### Parameters

- `_rewardOwner`: Address of the reward owner to query.

### getRewardEpochIdToExpireNext

Returns the reward epoch id that will expire next once a new reward epoch starts.

```solidity
function getRewardEpochIdToExpireNext(
) external view returns (
    uint256
);
```

### getRewardEpochIdsWithClaimableRewards

Returns the start and the end of the reward epoch range for which the reward is claimable.

```solidity
function getRewardEpochIdsWithClaimableRewards(
) external view returns (
    uint24 _startEpochId,
    uint24 _endEpochId
);
```

#### Returns

- `_startEpochId`: The oldest epoch id that allows reward claiming.
- `_endEpochId`: The newest epoch id that allows reward claiming.

### getRewardEpochTotals

Returns reward epoch totals.

```solidity
function getRewardEpochTotals(
    uint24 _rewardEpochId
) external view returns (
    uint256 _totalRewardsWei,
    uint256 _totalInflationRewardsWei,
    uint256 _initialisedRewardsWei,
    uint256 _claimedRewardsWei,
    uint256 _burnedRewardsWei
);
```

#### Parameters

- `_rewardEpochId`: Reward epoch id.

#### Returns

- `_totalRewardsWei`: Total rewards (inflation + community) for the epoch (wei).
- `_totalInflationRewardsWei`: Total inflation rewards for the epoch (wei).
- `_initialisedRewardsWei`: Initialised rewards of all claim types for the epoch (wei).
- `_claimedRewardsWei`: Claimed rewards for the epoch (wei).
- `_burnedRewardsWei`: Burned rewards for the epoch (wei).

### getStateOfRewards

Returns the state of rewards for a given address for all unclaimed reward epochs with claimable rewards.

```solidity
function getStateOfRewards(
    address _rewardOwner
) external view returns (
    struct RewardsV2Interface.RewardState[][] _rewardStates
);
```

#### Parameters

- `_rewardOwner`: Address of the reward owner.

#### Returns

- `_rewardStates`: Array of reward states.

### getStateOfRewardsAt

Returns the state of rewards for a given address at a specific reward epoch.

```solidity
function getStateOfRewardsAt(
    address _rewardOwner,
    uint24 _rewardEpochId
) external view returns (
    struct RewardsV2Interface.RewardState[] _rewardStates
);
```

#### Parameters

- `_rewardOwner`: Address of the reward owner.
- `_rewardEpochId`: Reward epoch id.

#### Returns

- `_rewardStates`: Array of reward states.

### getTotals

Returns totals.

```solidity
function getTotals(
) external view returns (
    uint256 _totalRewardsWei,
    uint256 _totalInflationRewardsWei,
    uint256 _totalClaimedWei,
    uint256 _totalBurnedWei
);
```

#### Returns

- `_totalRewardsWei`: Total rewards (wei).
- `_totalInflationRewardsWei`: Total inflation rewards (wei).
- `_totalClaimedWei`: Total claimed rewards (wei).
- `_totalBurnedWei`: Total burned rewards (wei).

### getUnclaimedRewardState

Gets the unclaimed reward state for a beneficiary, reward epoch id and claim type.

```solidity
function getUnclaimedRewardState(
    address _beneficiary,
    uint24 _rewardEpochId,
    enum RewardsV2Interface.ClaimType _claimType
) external view returns (
    struct IRewardManager.UnclaimedRewardState _state
);
```

#### Parameters

- `_beneficiary`: Address of the beneficiary to query.
- `_rewardEpochId`: Id of the reward epoch to query.
- `_claimType`: Claim type to query.

#### Returns

- `_state`: Unclaimed reward state.

### initialiseWeightBasedClaims

Initialises weight based claims.

```solidity
function initialiseWeightBasedClaims(
    struct RewardsV2Interface.RewardClaimWithProof[] _proofs
) external;
```

#### Parameters

- `_proofs`: Array of reward claims with merkle proofs.

### noOfInitialisedWeightBasedClaims

Returns the number of weight based claims that have been initialised.

```solidity
function noOfInitialisedWeightBasedClaims(
    uint256 _rewardEpochId
) external view returns (
    uint256
);
```

#### Parameters

- `_rewardEpochId`: Reward epoch id.

## Events

### RewardClaimed

Emitted when rewards are claimed.

```solidity
event RewardClaimed(
    address beneficiary,
    address rewardOwner,
    address recipient,
    uint24 rewardEpochId,
    enum RewardsV2Interface.ClaimType claimType,
    uint120 amount
)
```

#### Parameters

- `beneficiary`: Address of the beneficiary (voter or node id) that accrued the reward.
- `rewardOwner`: Address that was eligible for the rewards.
- `recipient`: Address that received the reward.
- `rewardEpochId`: Id of the reward epoch where the reward was accrued.
- `claimType`: Claim type
- `amount`: Amount of rewarded native tokens (wei).

### RewardClaimsEnabled

Emitted when reward claims have been enabled.

```solidity
event RewardClaimsEnabled(
    uint256 rewardEpochId
)
```

#### Parameters

- `rewardEpochId`: First claimable reward epoch.

### RewardClaimsExpired

Unclaimed rewards have expired and are now inaccessible.

`getUnclaimedRewardState()` can be used to retrieve more information.

```solidity
event RewardClaimsExpired(
    uint256 rewardEpochId
)
```

#### Parameters

- `rewardEpochId`: Id of the reward epoch that has just expired.

## Structures

### RewardClaim

Struct used in Merkle tree for storing reward claims.

```solidity
struct RewardClaim {
  uint24 rewardEpochId;
  bytes20 beneficiary;
  uint120 amount;
  enum RewardsV2Interface.ClaimType claimType;
}
```

### RewardClaimWithProof

Struct used for claiming rewards with Merkle proof.

```solidity
struct RewardClaimWithProof {
  bytes32[] merkleProof;
  struct RewardsV2Interface.RewardClaim body;
}
```

### RewardState

Struct used for returning state of rewards.

```solidity
struct RewardState {
  uint24 rewardEpochId;
  bytes20 beneficiary;
  uint120 amount;
  enum RewardsV2Interface.ClaimType claimType;
  bool initialised;
}
```

### UnclaimedRewardState

Struct used for storing unclaimed reward data.

```solidity
struct UnclaimedRewardState {
  bool initialised;
  uint120 amount;
  uint128 weight;
}
```
