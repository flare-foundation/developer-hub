---
title: ProtocolsV2Interface
description: Primary interface for managing protocol related metadata.
sidebar_position: 2
---

Primary interface for managing protocol related metadata. This is a long-term support (LTS) interface, designed to ensure continuity even as underlying contracts evolve or protocols migrate to new versions.

Sourced from `ProtocolsV2Interface.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/LTS/ProtocolsV2Interface.sol).

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

### getStartVotingRoundId

Returns the start voting round id for given reward epoch id.

```solidity
function getStartVotingRoundId(
    uint256 _rewardEpochId
) external view returns (
    uint32
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

### rewardEpochDurationSeconds

Duration of reward epoch, in seconds.

```solidity
function rewardEpochDurationSeconds(
) external view returns (
    uint64
);
```

### votingEpochDurationSeconds

Duration of voting epoch, in seconds.

```solidity
function votingEpochDurationSeconds(
) external view returns (
    uint64
);
```
