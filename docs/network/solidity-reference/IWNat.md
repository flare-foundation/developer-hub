---
title: IWNat
description: Interface for wrapping and unwrapping native tokens.
sidebar_position: 7
---

Interface for wrapping and unwrapping the native Flare token (FLR/SGB/C2FLR/CFLR) into the ERC-20 representation WNAT.

Sourced from `IWNat.sol` in [`@flarenetwork/flare-periphery-contracts`](https://www.npmjs.com/package/@flarenetwork/flare-periphery-contracts) (v0.1.41+).

The published `IWNat` interface only declares the four functions below.
The ERC-20 surface area (`balanceOf`, `transfer`, `approve`, `allowance`, ...) is inherited via the WNat implementation contract, not the `IWNat` interface; if you need those methods, import [`IVPToken`](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IVPToken.sol) (which extends `IERC20`) instead.
Vote-power and delegation methods (`delegate`, `governanceVotePower`, ...) come from `IVPToken` + [`IGovernanceVotePower`](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IGovernanceVotePower.sol).

## Functions

### deposit

Deposit native token and mint WNAT ERC-20 to the caller.

```solidity
function deposit() external payable;
```

### withdraw

Withdraw native token and burn WNAT ERC-20 from the caller.

```solidity
function withdraw(uint256 _amount) external;
```

Parameters:

- `_amount`: The amount to withdraw.

### depositTo

Deposit native token from `msg.sender` and mint WNAT ERC-20 to `_recipient`.

```solidity
function depositTo(address _recipient) external payable;
```

Parameters:

- `_recipient`: The address that receives the minted WNAT.

### withdrawFrom

Withdraw WNAT from `_owner` (subject to allowance) and send the native token to `msg.sender`.

```solidity
function withdrawFrom(address _owner, uint256 _amount) external;
```

Parameters:

- `_owner`: An address spending the native tokens.
- `_amount`: The amount to spend.

Requirements:

- `_owner` must have a balance of at least `_amount`.
- The caller must have an allowance for `_owner`'s tokens of at least `_amount`.

## Related interfaces

- [`IVPToken`](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IVPToken.sol) — ERC-20 + vote-power view methods inherited by the WNat implementation.
- [`IGovernanceVotePower`](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IGovernanceVotePower.sol) — governance vote-power delegation methods.
- [`IClaimSetupManager`](/network/solidity-reference/IClaimSetupManager) — claim executor configuration that builds on top of WNAT.
