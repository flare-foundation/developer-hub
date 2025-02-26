---
title: IVoterRegistry
sidebar_position: 6
description: Manages the registration of voters for upcoming reward epochs.
---

Manages the registration of voters for upcoming reward epochs.

Sourced from `IVoterRegistry.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IVoterRegistry.sol).

## Functions

### chilledUntilRewardEpochId

In case of providing bad votes (e.g. ftso collusion), the beneficiary can be chilled for a few reward epochs.
If beneficiary is chilled, the vote power assigned to it is zero.

```solidity
function chilledUntilRewardEpochId(
    bytes20 _beneficiary
) external view returns (
    uint256 _rewardEpochId
);
```

#### Parameters

- `_beneficiary`: The beneficiary (c-chain address or node id).

#### Returns

- `_rewardEpochId`: The reward epoch id until which the voter is chilled.

### getNumberOfRegisteredVoters

Returns the number of registered voters for a given reward epoch.
Size can be zero if the reward epoch is not supported (before initial reward epoch or future reward epoch).
Size for the next reward epoch can still change until the signing policy snapshot is created.

```solidity
function getNumberOfRegisteredVoters(
    uint256 _rewardEpochId
) external view returns (
    uint256
);
```

#### Parameters

- `_rewardEpochId`: The reward epoch id.

### getRegisteredVoters

Returns the list of registered voters for a given reward epoch.
List can be empty if the reward epoch is not supported (before initial reward epoch or future reward epoch).
List for the next reward epoch can still change until the signing policy snapshot is created.

```solidity
function getRegisteredVoters(
    uint256 _rewardEpochId
) external view returns (
    address[]
);
```

#### Parameters

- `_rewardEpochId`: The reward epoch id.

### isVoterRegistered

Returns true if a voter was (is currently) registered in a given reward epoch.

```solidity
function isVoterRegistered(
    address _voter,
    uint256 _rewardEpochId
) external view returns (
    bool
);
```

#### Parameters

- `_voter`: The voter address.
- `_rewardEpochId`: The reward epoch id.

### maxVoters

Maximum number of voters in one reward epoch.

```solidity
function maxVoters(
) external view returns (
    uint256
);
```

### newSigningPolicyInitializationStartBlockNumber

Returns the block number of the start of the new signing policy initialisation for a given reward epoch.
It is a snapshot block of the voters' addresses (it is zero if the reward epoch is not supported).

```solidity
function newSigningPolicyInitializationStartBlockNumber(
    uint256 _rewardEpochId
) external view returns (
    uint256
);
```

#### Parameters

- `_rewardEpochId`: The reward epoch id.

### publicKeyRequired

Indicates if the voter must have the public key set when registering.

```solidity
function publicKeyRequired(
) external view returns (
    bool
);
```

### registerVoter

Registers a voter if the weight is high enough.

```solidity
function registerVoter(
    address _voter,
    struct IVoterRegistry.Signature _signature
) external;
```

#### Parameters

- `_voter`: The voter address.
- `_signature`: The signature.

## Events

### BeneficiaryChilled

Event emitted when a beneficiary (c-chain address or node id) is chilled.

```solidity
event BeneficiaryChilled(
    bytes20 beneficiary,
    uint256 untilRewardEpochId
)
```

### VoterRegistered

Event emitted when a voter is registered.

```solidity
event VoterRegistered(
    address voter,
    uint24 rewardEpochId,
    address signingPolicyAddress,
    address submitAddress,
    address submitSignaturesAddress,
    bytes32 publicKeyPart1,
    bytes32 publicKeyPart2,
    uint256 registrationWeight
)
```

### VoterRemoved

Event emitted when a voter is removed.

```solidity
event VoterRemoved(
    address voter,
    uint256 rewardEpochId
)
```

## Structures

### Signature

Signature data.

```solidity
struct Signature {
  uint8 v;
  bytes32 r;
  bytes32 s;
}
```
