---
title: RandomNumberV2Interface
description: Primary interface for random number generation.
sidebar_position: 3
---

Primary interface for random number generation. This is a long-term support (LTS) interface, designed to ensure continuity even as underlying contracts evolve or protocols migrate to new versions.

Sourced from `RandomNumberV2Interface.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/LTS/RandomNumberV2Interface.sol).

## Functions

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

### getRandomNumberHistorical

Returns the historical random number for a given \_votingRoundId,
its timestamp and the flag indicating if it is secure.
If no finalization in the \_votingRoundId, the function reverts.

```solidity
function getRandomNumberHistorical(
    uint256 _votingRoundId
) external view returns (
    uint256 _randomNumber,
    bool _isSecureRandom,
    uint256 _randomTimestamp
);
```

#### Parameters

- `_votingRoundId`: The voting round id.

#### Returns

- `_randomNumber`: The current random number.
- `_isSecureRandom`: The flag indicating if the random number is secure.
- `_randomTimestamp`: The timestamp of the random number.
