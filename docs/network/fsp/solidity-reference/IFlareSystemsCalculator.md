---
title: IFlareSystemsCalculator
sidebar_position: 7
description: Performs calculations for weights and burn factors used by other contracts.
---

Performs calculations for weights and burn factors used by other contracts.

Sourced from `IFlareSystemsCalculator.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFlareSystemsCalculator.sol).

## Functions

### signingPolicySignNoRewardsDurationBlocks

Number of blocks (in addition to non-punishable blocks) after which all rewards are burned.

```solidity
function signingPolicySignNoRewardsDurationBlocks(
) external view returns (
    uint64
);
```

### signingPolicySignNonPunishableDurationBlocks

Number of non-punishable blocks to sign new signing policy.

```solidity
function signingPolicySignNonPunishableDurationBlocks(
) external view returns (
    uint64
);
```

### signingPolicySignNonPunishableDurationSeconds

Non-punishable time to sign new signing policy.

```solidity
function signingPolicySignNonPunishableDurationSeconds(
) external view returns (
    uint64
);
```

### wNatCapPPM

WNat cap used in signing policy weight.

```solidity
function wNatCapPPM(
) external view returns (
    uint24
);
```

## Events

### VoterRegistrationInfo

Event emitted when the registration weight of a voter is calculated.

```solidity
event VoterRegistrationInfo(
    address voter,
    uint24 rewardEpochId,
    address delegationAddress,
    uint16 delegationFeeBIPS,
    uint256 wNatWeight,
    uint256 wNatCappedWeight,
    bytes20[] nodeIds,
    uint256[] nodeWeights
)
```
