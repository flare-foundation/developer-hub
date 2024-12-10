---
title: RewardsV2Interface
description: Primary interface for managing all protocol rewards.
sidebar_position: 4
---

Primary interface for managing all protocol rewards. This is a long-term support (LTS) interface, designed to ensure continuity even as underlying contracts evolve or protocols migrate to new versions.

Sourced from `RewardsV2Interface.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/LTS/RewardsV2Interface.sol).

## Functions

### active

Indicates if the contract is active - claims are enabled.

```solidity
function active(
) external view returns (
    bool
);
```

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

## Enums

### ClaimType

Claim type enum.

```solidity
enum ClaimType {
  DIRECT,
  FEE,
  WNAT,
  MIRROR,
  CCHAIN
}
```
