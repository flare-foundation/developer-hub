---
title: IDistributionToDelegators
sidebar_position: 6
description: Interface for managing FlareDrop claims.
---

Interface for managing FlareDrop claims.

Sourced from `IDistributionToDelegators.sol` on [GitLab](https://gitlab.com/flarenetwork/flare-smart-contracts/-/blob/master/contracts/userInterfaces/IDistributionToDelegators.sol).

Manages the ongoing distribution of tokens from the Delegation Incentive Pool (the "FlareDrop"). The approval of [FIP.01](https://proposals.flare.network/FIP/FIP_1) created this pool, that releases its tokens every 30 days, over a period of 36 months, to all accounts holding Wrapped FLR.

## Functions

### claim

Allows the sender to claim or wrap rewards for reward owner.
The caller does not have to be the owner, but must be approved by the owner to claim on his behalf,
this approval is done by calling `setClaimExecutors`.
It is actually safe for this to be called by anybody (nothing can be stolen), but by limiting who can
call, we allow the owner to control the timing of the calls.
Reward owner can claim to any `_recipient`, while the executor can only claim to the reward owner,
reward owners's personal delegation account or one of the addresses set by `setAllowedClaimRecipients`.

```solidity
function claim(
    address _rewardOwner,
    address _recipient,
    uint256 _month,
    bool _wrap
) external returns (
    uint256 _rewardAmount);
```

#### Parameters

- `_rewardOwner`: address of the reward owner
- `_recipient`: address to transfer funds to
- `_month`: last month to claim for
- `_wrap`: should reward be wrapped immediately

#### Returns

- `_rewardAmount`: amount of total claimed rewards

### autoClaim

Allows batch claiming for the list of '\_rewardOwners' up to given '\_month'.
If reward owner has enabled delegation account, rewards are also claimed for that delegation account and
total claimed amount is sent to that delegation account, otherwise claimed amount is sent to owner's account.
Claimed amount is automatically wrapped.
Method can be used by reward owner or executor. If executor is registered with fee > 0,
then fee is paid to executor for each claimed address from the list.

```solidity
function autoClaim(
    address[] _rewardOwners,
    uint256 _month
) external;
```

#### Parameters

- `_rewardOwners`: list of reward owners to claim for
- `_month`: last month to claim for

### optOutOfAirdrop

Method to opt-out of receiving airdrop rewards

```solidity
function optOutOfAirdrop(
) external;
```

### nextClaimableMonth

Returns the next claimable month for '\_rewardOwner'.

```solidity
function nextClaimableMonth(
    address _rewardOwner
) external view returns (
    uint256);
```

#### Parameters

- `_rewardOwner`: address of the reward owner

### getClaimableAmount

get claimable amount of wei for requesting account for specified month

```solidity
function getClaimableAmount(
    uint256 _month
) external view returns (
    uint256 _amountWei);
```

#### Parameters

- `_month`: month of interest

#### Returns

- `_amountWei`: amount of wei available for this account and provided month

### getClaimableAmountOf

get claimable amount of wei for account for specified month

```solidity
function getClaimableAmountOf(
    address _account,
    uint256 _month
) external view returns (
    uint256 _amountWei);
```

#### Parameters

- `_account`: the address of an account we want to get the claimable amount of wei
- `_month`: month of interest

#### Returns

- `_amountWei`: amount of wei available for provided account and month

### getCurrentMonth

Returns the current month

```solidity
function getCurrentMonth(
) external view returns (
    uint256 _currentMonth);
```

#### Returns

- `_currentMonth`: Current month, 0 before entitlementStartTs

### getMonthToExpireNext

Returns the month that will expire next

```solidity
function getMonthToExpireNext(
) external view returns (
    uint256 _monthToExpireNext);
```

#### Returns

- `_monthToExpireNext`: Month that will expire next, 36 when last month expired

### getClaimableMonths

Returns claimable months - reverts if none

```solidity
function getClaimableMonths(
) external view returns (
    uint256 _startMonth,
    uint256 _endMonth);
```

#### Returns

- `_startMonth`: first claimable month
- `_endMonth`: last claimable month

## Events

### UseGoodRandomSet

```solidity
event UseGoodRandomSet(
    bool useGoodRandom,
    uint256 maxWaitForGoodRandomSeconds
)
```

### EntitlementStart

```solidity
event EntitlementStart(
    uint256 entitlementStartTs
)
```

### AccountClaimed

```solidity
event AccountClaimed(
    address whoClaimed,
    address sentTo,
    uint256 month,
    uint256 amountWei
)
```

### AccountOptOut

```solidity
event AccountOptOut(
    address theAccount,
    bool confirmed
)
```
