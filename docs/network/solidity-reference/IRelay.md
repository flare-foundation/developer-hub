---
title: IRelay
sidebar_position: 2
description: Interface for Merkle roots, secure RNG, signing policies etc.
---

Interface for Merkle roots, secure RNG, signing policies etc.

Sourced from `IRelay.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IRelay.sol).

## Functions

### getConfirmedMerkleRoot

Returns the confirmed merkle root for given protocol id and voting round id.

```solidity
function getConfirmedMerkleRoot(
    uint256 _protocolId,
    uint256 _votingRoundId
) external view returns (
    bytes32 _merkleRoot
);
```

#### Parameters

- `_protocolId`: The protocol id.
- `_votingRoundId`: The voting round id.

#### Returns

- `_merkleRoot`: The confirmed merkle root.

### getRandomNumber

Returns the current random number, its timestamp and the flag indicating if it is secure.

```solidity
function getRandomNumber(
) external view returns (
    uint256 _randomNumber,
    bool _isSecureRandom,
    uint256 _randomTimestamp
);
```

#### Returns

- `_randomNumber`: The current random number.
- `_isSecureRandom`: The flag indicating if the random number is secure.
- `_randomTimestamp`: The timestamp of the random number.

### getVotingRoundId

Returns the voting round id for given timestamp.

```solidity
function getVotingRoundId(
    uint256 _timestamp
) external view returns (
    uint256 _votingRoundId
);
```

#### Parameters

- `_timestamp`: The timestamp.

#### Returns

- `_votingRoundId`: The voting round id.

### lastInitializedRewardEpochData

Returns last initialized reward epoch data.

```solidity
function lastInitializedRewardEpochData(
) external view returns (
    uint32 _lastInitializedRewardEpoch,
    uint32 _startingVotingRoundIdForLastInitializedRewardEpoch
);
```

#### Returns

- `_lastInitializedRewardEpoch`: Last initialized reward epoch.
- `_startingVotingRoundIdForLastInitializedRewardEpoch`: Starting voting round id for it.

### merkleRoots

Returns the Merkle root for given protocol id and voting round id.

```solidity
function merkleRoots(
    uint256 _protocolId,
    uint256 _votingRoundId
) external view returns (
    bytes32 _merkleRoot
);
```

#### Parameters

- `_protocolId`: The protocol id.
- `_votingRoundId`: The voting round id.

#### Returns

- `_merkleRoot`: The Merkle root.

### relay

Finalization function for new signing policies and protocol messages.
It can be used as finalization contract on Flare chain or as relay contract on other EVM chain.
Can be called in two modes. It expects calldata that is parsed in a custom manner.
Hence the transaction calls should assemble relevant calldata in the 'data' field.
Depending on the data provided, the contract operations in essentially two modes:
(1) Relaying signing policy. The structure of the calldata is:
function signature (4 bytes) + active signing policy + 0 (1 byte) + new signing policy,
total of exactly 4423 bytes.
(2) Relaying signed message. The structure of the calldata is:
function signature (4 bytes) + signing policy + signed message (38 bytes) + ECDSA signatures with indices (67 bytes each)
Reverts if relaying is not successful.

```solidity
function relay(
) external;
```

### startingVotingRoundIds

Returns the start voting round id for given reward epoch id.

```solidity
function startingVotingRoundIds(
    uint256 _rewardEpochId
) external view returns (
    uint256 _startingVotingRoundId
);
```

#### Parameters

- `_rewardEpochId`: The reward epoch id.

#### Returns

- `_startingVotingRoundId`: The start voting round id.

### toSigningPolicyHash

Returns the signing policy hash for given reward epoch id.

```solidity
function toSigningPolicyHash(
    uint256 _rewardEpochId
) external view returns (
    bytes32 _signingPolicyHash
);
```

#### Parameters

- `_rewardEpochId`: The reward epoch id.

#### Returns

- `_signingPolicyHash`: The signing policy hash.

## Events

### ProtocolMessageRelayed

```solidity
event ProtocolMessageRelayed(
    uint8 protocolId,
    uint32 votingRoundId,
    bool isSecureRandom,
    bytes32 merkleRoot
)
```

### SigningPolicyInitialized

```solidity
event SigningPolicyInitialized(
    uint24 rewardEpochId,
    uint32 startVotingRoundId,
    uint16 threshold,
    uint256 seed,
    address[] voters,
    uint16[] weights,
    bytes signingPolicyBytes,
    uint64 timestamp
)
```

### SigningPolicyRelayed

```solidity
event SigningPolicyRelayed(
    uint256 rewardEpochId
)
```
