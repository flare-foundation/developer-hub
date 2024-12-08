---
title: IWNatDelegationFee
description: Manages the delegation fees set by voters for WFLR delegations.
sidebar_position: 8
---

Manages the delegation fees set by voters for WFLR delegations.

Sourced from `IWNatDelegationFee.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IWNatDelegationFee.sol).

## Functions

### defaultFeePercentageBIPS

The default fee percentage value.

```solidity
function defaultFeePercentageBIPS(
) external view returns (
    uint16
);
```

### feePercentageUpdateOffset

The offset in reward epochs for the fee percentage value to become effective.

```solidity
function feePercentageUpdateOffset(
) external view returns (
    uint24
);
```

### getVoterCurrentFeePercentage

Returns the current fee percentage of `_voter`.

```solidity
function getVoterCurrentFeePercentage(
    address _voter
) external view returns (
    uint16
);
```

#### Parameters

- `_voter`: Voter address.

### getVoterFeePercentage

Returns the fee percentage of `_voter` for given reward epoch id.

```solidity
function getVoterFeePercentage(
    address _voter,
    uint256 _rewardEpochId
) external view returns (
    uint16
);
```

#### Parameters

- `_voter`: Voter address.
- `_rewardEpochId`: Reward epoch id. **NOTE:** fee percentage might still change for the `current + feePercentageUpdateOffset` reward epoch id

### getVoterScheduledFeePercentageChanges

Returns the scheduled fee percentage changes of `_voter`.

```solidity
function getVoterScheduledFeePercentageChanges(
    address _voter
) external view returns (
    uint256[] _feePercentageBIPS,
    uint256[] _validFromEpochId,
    bool[] _fixed
);
```

#### Parameters

- `_voter`: Voter address.

#### Returns

- `_feePercentageBIPS`: Positional array of fee percentages in BIPS.
- `_validFromEpochId`: Positional array of reward epoch ids the fee settings are effective from.
- `_fixed`: Positional array of boolean values indicating if settings are subjected to change.

### setVoterFeePercentage

Allows voter to set (or update last) fee percentage.

```solidity
function setVoterFeePercentage(
    uint16 _feePercentageBIPS
) external returns (
    uint256
);
```

#### Parameters

- `_feePercentageBIPS`: Number representing fee percentage in BIPS.

#### Returns

- ``: Returns the reward epoch number when the value becomes effective.

## Events

### FeePercentageChanged

Event emitted when a voter fee percentage value is changed.

```solidity
event FeePercentageChanged(
    address voter,
    uint16 value,
    uint24 validFromEpochId
)
```
