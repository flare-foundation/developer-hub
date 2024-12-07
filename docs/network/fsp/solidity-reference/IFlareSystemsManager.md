---
title: IFlareSystemsManager
sidebar_position: 3
description: Manages system protocols like Signing Policy Definition, Uptime Voting, and Reward Voting.
---

Manages system protocols like the Signing Policy Definition, Uptime Voting, and Reward Voting.

Sourced from `IFlareSystemsManager.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFlareSystemsManager.sol).

## Functions

### firstRewardEpochStartTs

Timestamp when the first reward epoch started, in seconds since UNIX epoch.

```solidity
function firstRewardEpochStartTs(
) external view returns (
    uint64
);
```

### firstVotingRoundStartTs

Timestamp when the first voting epoch started, in seconds since UNIX epoch.

```solidity
function firstVotingRoundStartTs(
) external view returns (
    uint64
);
```

### getCurrentRewardEpoch

Returns the current reward epoch id (backwards compatibility).

```solidity
function getCurrentRewardEpoch(
) external view returns (
    uint256
);
```

### getCurrentRewardEpochId

Returns the current reward epoch id.

```solidity
function getCurrentRewardEpochId(
) external view returns (
    uint24
);
```

### getCurrentVotingEpochId

Returns the current voting epoch id.

```solidity
function getCurrentVotingEpochId(
) external view returns (
    uint32
);
```

### getSeed

Returns the seed for given reward epoch id.

```solidity
function getSeed(
    uint256 _rewardEpochId
) external view returns (
    uint256
);
```

### getStartVotingRoundId

Returns the start voting round id for given reward epoch id.

```solidity
function getStartVotingRoundId(
    uint256 _rewardEpochId
) external view returns (
    uint32
);
```

### getThreshold

Returns the threshold for given reward epoch id.

```solidity
function getThreshold(
    uint256 _rewardEpochId
) external view returns (
    uint16
);
```

### getVotePowerBlock

Returns the vote power block for given reward epoch id.

```solidity
function getVotePowerBlock(
    uint256 _rewardEpochId
) external view returns (
    uint64 _votePowerBlock
);
```

### getVoterRegistrationData

Returns voter rgistration data for given reward epoch id.

```solidity
function getVoterRegistrationData(
    uint256 _rewardEpochId
) external view returns (
    uint256 _votePowerBlock,
    bool _enabled
);
```

#### Parameters

- `_rewardEpochId`: Reward epoch id.

#### Returns

- `_votePowerBlock`: Vote power block.
- `_enabled`: Indicates if voter registration is enabled.

### isVoterRegistrationEnabled

Indicates if voter registration is currently enabled.

```solidity
function isVoterRegistrationEnabled(
) external view returns (
    bool
);
```

### rewardEpochDurationSeconds

Duration of reward epoch, in seconds.

```solidity
function rewardEpochDurationSeconds(
) external view returns (
    uint64
);
```

### signNewSigningPolicy

Method for collecting signatures for the new signing policy.

```solidity
function signNewSigningPolicy(
    uint24 _rewardEpochId,
    bytes32 _newSigningPolicyHash,
    struct IFlareSystemsManager.Signature _signature
) external;
```

#### Parameters

- `_rewardEpochId`: Reward epoch id of the new signing policy.
- `_newSigningPolicyHash`: New signing policy hash.
- `_signature`: Signature.

### signRewards

Method for collecting signatures for the rewards.

```solidity
function signRewards(
    uint24 _rewardEpochId,
    struct IFlareSystemsManager.NumberOfWeightBasedClaims[] _noOfWeightBasedClaims,
    bytes32 _rewardsHash,
    struct IFlareSystemsManager.Signature _signature
) external;
```

#### Parameters

- `_rewardEpochId`: Reward epoch id of the rewards.
- `_noOfWeightBasedClaims`: Number of weight based claims list.
- `_rewardsHash`: Rewards hash.
- `_signature`: Signature.

### signUptimeVote

Method for collecting signatures for the uptime vote.

```solidity
function signUptimeVote(
    uint24 _rewardEpochId,
    bytes32 _uptimeVoteHash,
    struct IFlareSystemsManager.Signature _signature
) external;
```

#### Parameters

- `_rewardEpochId`: Reward epoch id of the uptime vote.
- `_uptimeVoteHash`: Uptime vote hash.
- `_signature`: Signature.

### submitUptimeVote

Method for submitting node ids with high enough uptime.

```solidity
function submitUptimeVote(
    uint24 _rewardEpochId,
    bytes20[] _nodeIds,
    struct IFlareSystemsManager.Signature _signature
) external;
```

#### Parameters

- `_rewardEpochId`: Reward epoch id of the uptime vote.
- `_nodeIds`: Node ids with high enough uptime.
- `_signature`: Signature.

### votingEpochDurationSeconds

Duration of voting epoch, in seconds.

```solidity
function votingEpochDurationSeconds(
) external view returns (
    uint64
);
```

## Events

### RandomAcquisitionStarted

Event emitted when random acquisition phase starts.

```solidity
event RandomAcquisitionStarted(
    uint24 rewardEpochId,
    uint64 timestamp
)
```

### RewardEpochStarted

Event emitted when reward epoch starts.

```solidity
event RewardEpochStarted(
    uint24 rewardEpochId,
    uint32 startVotingRoundId,
    uint64 timestamp
)
```

### RewardsSigned

Event emitted when rewards are signed.

```solidity
event RewardsSigned(
    uint24 rewardEpochId,
    address signingPolicyAddress,
    address voter,
    bytes32 rewardsHash,
    struct IFlareSystemsManager.NumberOfWeightBasedClaims[] noOfWeightBasedClaims,
    uint64 timestamp,
    bool thresholdReached
)
```

### SignUptimeVoteEnabled

Event emitted when it is time to sign uptime vote.

```solidity
event SignUptimeVoteEnabled(
    uint24 rewardEpochId,
    uint64 timestamp
)
```

### SigningPolicySigned

Event emitted when signing policy is signed.

```solidity
event SigningPolicySigned(
    uint24 rewardEpochId,
    address signingPolicyAddress,
    address voter,
    uint64 timestamp,
    bool thresholdReached
)
```

### UptimeVoteSigned

Event emitted when uptime vote is signed.

```solidity
event UptimeVoteSigned(
    uint24 rewardEpochId,
    address signingPolicyAddress,
    address voter,
    bytes32 uptimeVoteHash,
    uint64 timestamp,
    bool thresholdReached
)
```

### UptimeVoteSubmitted

Event emitted when uptime vote is submitted.

```solidity
event UptimeVoteSubmitted(
    uint24 rewardEpochId,
    address signingPolicyAddress,
    address voter,
    bytes20[] nodeIds,
    uint64 timestamp
)
```

### VotePowerBlockSelected

Event emitted when vote power block is selected.

```solidity
event VotePowerBlockSelected(
    uint24 rewardEpochId,
    uint64 votePowerBlock,
    uint64 timestamp
)
```

## Structures

### NumberOfWeightBasedClaims

Number of weight based claims structure

```solidity
struct NumberOfWeightBasedClaims {
  uint256 rewardManagerId;
  uint256 noOfWeightBasedClaims;
}
```

### Signature

Signature structure

```solidity
struct Signature {
  uint8 v;
  bytes32 r;
  bytes32 s;
}
```
