---
title: IRewardManager
---

<!-- This is an autogenerated file. Do not edit! -->

`IRewardManager.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IRewardManager.sol).

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

## Events

### RewardClaimed

Emitted when rewards are claimed.

```solidity
event RewardClaimed(
    address beneficiary,
    address rewardOwner,
    address recipient,
    uint24 rewardEpochId,
    enum IRewardManager.ClaimType claimType,
    uint120 amount
)
```

| Parameters      | Type                            | Description                                                            |
| --------------- | ------------------------------- | ---------------------------------------------------------------------- |
| `beneficiary`   | `address`                       | Address of the beneficiary (voter or node id) that accrued the reward. |
| `rewardOwner`   | `address`                       | Address that was eligible for the rewards.                             |
| `recipient`     | `address`                       | Address that received the reward.                                      |
| `rewardEpochId` | `uint24`                        | Id of the reward epoch where the reward was accrued.                   |
| `claimType`     | `enum IRewardManager.ClaimType` | Claim type                                                             |
| `amount`        | `uint120`                       | Amount of rewarded native tokens (wei).                                |

### RewardClaimsEnabled

Emitted when reward claims have been enabled.

```solidity
event RewardClaimsEnabled(
    uint256 rewardEpochId
)
```

| Parameters      | Type      | Description                   |
| --------------- | --------- | ----------------------------- |
| `rewardEpochId` | `uint256` | First claimable reward epoch. |

### RewardClaimsExpired

Unclaimed rewards have expired and are now inaccessible.

`getUnclaimedRewardState()` can be used to retrieve more information.

```solidity
event RewardClaimsExpired(
    uint256 rewardEpochId
)
```

| Parameters      | Type      | Description                                   |
| --------------- | --------- | --------------------------------------------- |
| `rewardEpochId` | `uint256` | Id of the reward epoch that has just expired. |

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
Rewards are deposited to the WNAT (to reward owner or PDA if enabled).
It can be called by reward owner or its authorized executor.
Only claiming from weight based claims is supported.

```solidity
function autoClaim(
    address[] _rewardOwners,
    uint24 _rewardEpochId,
    struct IRewardManager.RewardClaimWithProof[] _proofs
) external;
```

| Parameters       | Type                                           | Description                                                 |
| ---------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| `_rewardOwners`  | `address[]`                                    | Array of reward owners.                                     |
| `_rewardEpochId` | `uint24`                                       | Id of the reward epoch up to which the rewards are claimed. |
| `_proofs`        | `struct IRewardManager.RewardClaimWithProof[]` | Array of reward claims with merkle proofs.                  |

### claim

Claim rewards for `_rewardOwner` and transfer them to `_recipient`.
It can be called by reward owner or its authorized executor.

```solidity
function claim(
    address _rewardOwner,
    address payable _recipient,
    uint24 _rewardEpochId,
    bool _wrap,
    struct IRewardManager.RewardClaimWithProof[] _proofs
) external returns (
    uint256 _rewardAmountWei
);
```

| Parameters       | Type                                           | Description                                                                 |
| ---------------- | ---------------------------------------------- | --------------------------------------------------------------------------- |
| `_rewardOwner`   | `address`                                      | Address of the reward owner.                                                |
| `_recipient`     | `address payable`                              | Address of the reward recipient.                                            |
| `_rewardEpochId` | `uint24`                                       | Id of the reward epoch up to which the rewards are claimed.                 |
| `_wrap`          | `bool`                                         | Indicates if the reward should be wrapped (deposited) to the WNAT contract. |
| `_proofs`        | `struct IRewardManager.RewardClaimWithProof[]` | Array of reward claims with merkle proofs.                                  |

| Returns            | Type      | Description                             |
| ------------------ | --------- | --------------------------------------- |
| `_rewardAmountWei` | `uint256` | Amount of rewarded native tokens (wei). |

### cleanupBlockNumber

Get the current cleanup block number.

```solidity
function cleanupBlockNumber(
) external view returns (
    uint256
);
```

| Returns | Type      | Description                             |
| ------- | --------- | --------------------------------------- |
| [0]     | `uint256` | The currently set cleanup block number. |

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

| Parameters     | Type      | Description                           |
| -------------- | --------- | ------------------------------------- |
| `_rewardOwner` | `address` | Address of the reward owner to query. |

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

| Returns         | Type     | Description                                      |
| --------------- | -------- | ------------------------------------------------ |
| `_startEpochId` | `uint24` | The oldest epoch id that allows reward claiming. |
| `_endEpochId`   | `uint24` | The newest epoch id that allows reward claiming. |

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

| Parameters       | Type     | Description      |
| ---------------- | -------- | ---------------- |
| `_rewardEpochId` | `uint24` | Reward epoch id. |

| Returns                     | Type      | Description                                                 |
| --------------------------- | --------- | ----------------------------------------------------------- |
| `_totalRewardsWei`          | `uint256` | Total rewards (inflation + community) for the epoch (wei).  |
| `_totalInflationRewardsWei` | `uint256` | Total inflation rewards for the epoch (wei).                |
| `_initialisedRewardsWei`    | `uint256` | Initialised rewards of all claim types for the epoch (wei). |
| `_claimedRewardsWei`        | `uint256` | Claimed rewards for the epoch (wei).                        |
| `_burnedRewardsWei`         | `uint256` | Burned rewards for the epoch (wei).                         |

### getStateOfRewards

Returns the state of rewards for a given address for all unclaimed reward epochs with claimable rewards.

```solidity
function getStateOfRewards(
    address _rewardOwner
) external view returns (
    struct IRewardManager.RewardState[][] _rewardStates
);
```

| Parameters     | Type      | Description                  |
| -------------- | --------- | ---------------------------- |
| `_rewardOwner` | `address` | Address of the reward owner. |

| Returns         | Type                                    | Description             |
| --------------- | --------------------------------------- | ----------------------- |
| `_rewardStates` | `struct IRewardManager.RewardState[][]` | Array of reward states. |

### getStateOfRewardsAt

Returns the state of rewards for a given address at a specific reward epoch.

```solidity
function getStateOfRewardsAt(
    address _rewardOwner,
    uint24 _rewardEpochId
) external view returns (
    struct IRewardManager.RewardState[] _rewardStates
);
```

| Parameters       | Type      | Description                  |
| ---------------- | --------- | ---------------------------- |
| `_rewardOwner`   | `address` | Address of the reward owner. |
| `_rewardEpochId` | `uint24`  | Reward epoch id.             |

| Returns         | Type                                  | Description             |
| --------------- | ------------------------------------- | ----------------------- |
| `_rewardStates` | `struct IRewardManager.RewardState[]` | Array of reward states. |

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

| Returns                     | Type      | Description                    |
| --------------------------- | --------- | ------------------------------ |
| `_totalRewardsWei`          | `uint256` | Total rewards (wei).           |
| `_totalInflationRewardsWei` | `uint256` | Total inflation rewards (wei). |
| `_totalClaimedWei`          | `uint256` | Total claimed rewards (wei).   |
| `_totalBurnedWei`           | `uint256` | Total burned rewards (wei).    |

### getUnclaimedRewardState

Gets the unclaimed reward state for a beneficiary, reward epoch id and claim type.

```solidity
function getUnclaimedRewardState(
    address _beneficiary,
    uint24 _rewardEpochId,
    enum IRewardManager.ClaimType _claimType
) external view returns (
    struct IRewardManager.UnclaimedRewardState _state
);
```

| Parameters       | Type                            | Description                          |
| ---------------- | ------------------------------- | ------------------------------------ |
| `_beneficiary`   | `address`                       | Address of the beneficiary to query. |
| `_rewardEpochId` | `uint24`                        | Id of the reward epoch to query.     |
| `_claimType`     | `enum IRewardManager.ClaimType` | Claim type to query.                 |

| Returns  | Type                                         | Description             |
| -------- | -------------------------------------------- | ----------------------- |
| `_state` | `struct IRewardManager.UnclaimedRewardState` | Unclaimed reward state. |

### initialiseWeightBasedClaims

Initialises weight based claims.

```solidity
function initialiseWeightBasedClaims(
    struct IRewardManager.RewardClaimWithProof[] _proofs
) external;
```

| Parameters | Type                                           | Description                                |
| ---------- | ---------------------------------------------- | ------------------------------------------ |
| `_proofs`  | `struct IRewardManager.RewardClaimWithProof[]` | Array of reward claims with merkle proofs. |

### noOfInitialisedWeightBasedClaims

Returns the number of weight based claims that have been initialised.

```solidity
function noOfInitialisedWeightBasedClaims(
    uint256 _rewardEpochId
) external view returns (
    uint256
);
```

| Parameters       | Type      | Description      |
| ---------------- | --------- | ---------------- |
| `_rewardEpochId` | `uint256` | Reward epoch id. |

## Structures

### RewardClaim

Struct used in Merkle tree for storing reward claims.

```solidity
struct RewardClaim {
  uint24 rewardEpochId;
  bytes20 beneficiary;
  uint120 amount;
  enum IRewardManager.ClaimType claimType;
}
```

### RewardClaimWithProof

Struct used for claiming rewards with Merkle proof.

```solidity
struct RewardClaimWithProof {
  bytes32[] merkleProof;
  struct IRewardManager.RewardClaim body;
}
```

### RewardState

Struct used for returning state of rewards.

```solidity
struct RewardState {
  uint24 rewardEpochId;
  bytes20 beneficiary;
  uint120 amount;
  enum IRewardManager.ClaimType claimType;
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