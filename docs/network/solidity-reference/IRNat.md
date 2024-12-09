---
title: IRNat
description: Interface for managing rFLR.
sidebar_position: 10
---

Interface for managing rFLR.

Sourced from `IRNat.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IRNat.sol).

## Functions

### allowance

Returns the remaining number of tokens that `spender` will be
allowed to spend on behalf of `owner` through transferFrom. This is
zero by default.

This value changes when approve or transferFrom are called.

```solidity
function allowance(
    address owner,
    address spender
) external view returns (
    uint256
);
```

### approve

Sets a `value` amount of tokens as the allowance of `spender` over the
caller's tokens.

Returns a boolean value indicating whether the operation succeeded.

IMPORTANT: Beware that changing an allowance with this method brings the risk
that someone may use both the old and the new allowance by unfortunate
transaction ordering. One possible solution to mitigate this race
condition is to first reduce the spender's allowance to 0 and set the
desired value afterwards:
https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

Emits an Approval event.

```solidity
function approve(
    address spender,
    uint256 value
) external returns (
    bool
);
```

### balanceOf

Returns the value of tokens owned by `account`.

```solidity
function balanceOf(
    address account
) external view returns (
    uint256
);
```

### claimRewards

Claim rewards for a list of projects up to the given month.

```solidity
function claimRewards(
    uint256[] _projectIds,
    uint256 _month
) external returns (
    uint128 _claimedRewardsWei
);
```

#### Parameters

- `_projectIds`: The ids of the projects.
- `_month`: The month up to which (including) rewards will be claimed.

#### Returns

- `_claimedRewardsWei`: The total amount of rewards claimed (in wei).

### decimals

Returns the decimals places of the token.

```solidity
function decimals(
) external view returns (
    uint8
);
```

### distributeRewards

Distributes the rewards of a project for a given month to a list of recipients.
It must be called by the project's distributor.
It can only be called for the last or current month (if enabled).

```solidity
function distributeRewards(
    uint256 _projectId,
    uint256 _month,
    address[] _recipients,
    uint128[] _amountsWei
) external;
```

#### Parameters

- `_projectId`: The id of the project.
- `_month`: The month of the rewards.
- `_recipients`: The addresses of the recipients.
- `_amountsWei`: The amounts of rewards to distribute to each recipient (in wei).

### firstMonthStartTs

Returns the timestamp of the start of the first month.

```solidity
function firstMonthStartTs(
) external view returns (
    uint256
);
```

### getBalancesOf

Gets owner's balances of `WNat`, `RNat` and locked tokens.

```solidity
function getBalancesOf(
    address _owner
) external view returns (
    uint256 _wNatBalance,
    uint256 _rNatBalance,
    uint256 _lockedBalance
);
```

#### Parameters

- `_owner`: The address of the owner.

#### Returns

- `_wNatBalance`: The balance of `WNat` (in wei).
- `_rNatBalance`: The balance of `RNat` (in wei).
- `_lockedBalance`: The locked/vested balance (in wei).

### getClaimableRewards

Gets the claimable rewards of a project for a given owner.

```solidity
function getClaimableRewards(
    uint256 _projectId,
    address _owner
) external view returns (
    uint128
);
```

#### Parameters

- `_projectId`: The id of the project.
- `_owner`: The address of the owner.

#### Returns

- ``: The amount of rewards claimable by the owner (in wei).

### getCurrentMonth

Gets the current month.

```solidity
function getCurrentMonth(
) external view returns (
    uint256
);
```

#### Returns

- ``: The current month.

### getOwnerRewardsInfo

Gets the rewards information of a project for a given month and owner.

```solidity
function getOwnerRewardsInfo(
    uint256 _projectId,
    uint256 _month,
    address _owner
) external view returns (
    uint128 _assignedRewards,
    uint128 _claimedRewards,
    bool _claimable
);
```

#### Parameters

- `_projectId`: The id of the project.
- `_month`: The month of the rewards.
- `_owner`: The address of the owner.

#### Returns

- `_assignedRewards`: The amount of rewards assigned to the owner for the month (in wei).
- `_claimedRewards`: The amount of rewards claimed by the owner for the month (in wei).
- `_claimable`: Whether the rewards are claimable by the owner.

### getProjectInfo

Gets the information of a project.

```solidity
function getProjectInfo(
    uint256 _projectId
) external view returns (
    string _name,
    address _distributor,
    bool _currentMonthDistributionEnabled,
    bool _distributionDisabled,
    bool _claimingDisabled,
    uint128 _totalAssignedRewards,
    uint128 _totalDistributedRewards,
    uint128 _totalClaimedRewards,
    uint128 _totalUnassignedUnclaimedRewards,
    uint256[] _monthsWithRewards
);
```

#### Parameters

- `_projectId`: The id of the project.

#### Returns

- `_name`: The name of the project.
- `_distributor`: The address of the distributor.
- `_currentMonthDistributionEnabled`: Whether distribution is enabled for the current month.
- `_distributionDisabled`: Whether distribution is disabled.
- `_claimingDisabled`: Whether claiming is disabled.
- `_totalAssignedRewards`: The total amount of rewards assigned to the project (in wei).
- `_totalDistributedRewards`: The total amount of rewards distributed by the project (in wei).
- `_totalClaimedRewards`: The total amount of rewards claimed from the project (in wei).
- `_totalUnassignedUnclaimedRewards`: The total amount of unassigned unclaimed rewards (in wei).
- `_monthsWithRewards`: The months with rewards.

### getProjectRewardsInfo

Gets the rewards information of a project for a given month.

```solidity
function getProjectRewardsInfo(
    uint256 _projectId,
    uint256 _month
) external view returns (
    uint128 _assignedRewards,
    uint128 _distributedRewards,
    uint128 _claimedRewards,
    uint128 _unassignedUnclaimedRewards
);
```

#### Parameters

- `_projectId`: The id of the project.
- `_month`: The month of the rewards.

#### Returns

- `_assignedRewards`: The amount of rewards assigned to the project for the month (in wei).
- `_distributedRewards`: The amount of rewards distributed by the project for the month (in wei).
- `_claimedRewards`: The amount of rewards claimed from the project for the month (in wei).
- `_unassignedUnclaimedRewards`: The amount of unassigned unclaimed rewards for the month (in wei).

### getProjectsBasicInfo

Gets the basic information of all projects.

```solidity
function getProjectsBasicInfo(
) external view returns (
    string[] _names,
    bool[] _claimingDisabled
);
```

#### Returns

- `_names`: The names of the projects.
- `_claimingDisabled`: Whether claiming is disabled for each project.

### getProjectsCount

Gets the total number of projects.

```solidity
function getProjectsCount(
) external view returns (
    uint256
);
```

#### Returns

- ``: The total number of projects.

### getRNatAccount

Gets owner's RNat account. If it doesn't exist it reverts.

```solidity
function getRNatAccount(
    address _owner
) external view returns (
    contract IRNatAccount
);
```

#### Parameters

- `_owner`: Account to query.

#### Returns

- ``: Address of its RNat account.

### getRewardsInfo

Gets totals rewards information.

```solidity
function getRewardsInfo(
) external view returns (
    uint256 _totalAssignableRewards,
    uint256 _totalAssignedRewards,
    uint256 _totalClaimedRewards,
    uint256 _totalWithdrawnRewards,
    uint256 _totalWithdrawnAssignableRewards
);
```

#### Returns

- `_totalAssignableRewards`: The total amount of assignable rewards (in wei).
- `_totalAssignedRewards`: The total amount of assigned rewards (in wei).
- `_totalClaimedRewards`: The total amount of claimed rewards (in wei).
- `_totalWithdrawnRewards`: The total amount of withdrawn rewards (in wei).
- `_totalWithdrawnAssignableRewards`: The total amount of withdrawn once assignable rewards (in wei).

### name

Returns the name of the token.

```solidity
function name(
) external view returns (
    string
);
```

### setClaimExecutors

Sets the addresses of executors and adds the owner as an executor.

If any of the executors is a registered executor, some fee needs to be paid.

```solidity
function setClaimExecutors(
    address[] _executors
) external payable;
```

#### Parameters

- `_executors`: The new executors. All old executors will be deleted and replaced by these.

### symbol

Returns the symbol of the token.

```solidity
function symbol(
) external view returns (
    string
);
```

### totalSupply

Returns the value of tokens in existence.

```solidity
function totalSupply(
) external view returns (
    uint256
);
```

### transfer

Moves a `value` amount of tokens from the caller's account to `to`.

Returns a boolean value indicating whether the operation succeeded.

Emits a Transfer event.

```solidity
function transfer(
    address to,
    uint256 value
) external returns (
    bool
);
```

### transferExternalToken

Allows the caller to transfer ERC-20 tokens from their RNat account to the owner account.

The main use case is to move ERC-20 tokes received by mistake (by an airdrop, for example) out of the
RNat account and move them into the main account, where they can be more easily managed.

Reverts if the target token is the `WNat` contract: use method `withdraw` or `withdrawAll` for that.

```solidity
function transferExternalToken(
    contract IERC20 _token,
    uint256 _amount
) external;
```

#### Parameters

- `_token`: Target token contract address.
- `_amount`: Amount of tokens to transfer.

### transferFrom

Moves a `value` amount of tokens from `from` to `to` using the
allowance mechanism. `value` is then deducted from the caller's
allowance.

Returns a boolean value indicating whether the operation succeeded.

Emits a Transfer event.

```solidity
function transferFrom(
    address from,
    address to,
    uint256 value
) external returns (
    bool
);
```

### WNat

Returns the `WNat` contract.

```solidity
function wNat(
) external view returns (
    contract IWNat
);
```

### withdraw

Allows the caller to withdraw `WNat` wrapped tokens from their RNat account to the owner account.
In case there are some self-destruct native tokens left on the contract,
they can be transferred to the owner account using this method and `_wrap = false`.

```solidity
function withdraw(
    uint128 _amount,
    bool _wrap
) external;
```

#### Parameters

- `_amount`: Amount of tokens to transfer (in wei).
- `_wrap`: If `true`, the tokens will be sent wrapped in `WNat`. If `false`, they will be sent as `Nat`.

### withdrawAll

Allows the caller to withdraw `WNat` wrapped tokens from their RNat account to the owner account.
If some tokens are still locked, only 50% of them will be withdrawn, the rest will be burned as a penalty.
In case there are some self-destruct native tokens left on the contract,
they can be transferred to the owner account using this method and `_wrap = false`.

```solidity
function withdrawAll(
    bool _wrap
) external;
```

#### Parameters

- `_wrap`: If `true`, the tokens will be sent wrapped in `WNat`. If `false`, they will be sent as `Nat`.

## Events

### Approval

Emitted when the allowance of a `spender` for an `owner` is set by
a call to approve. `value` is the new allowance.

```solidity
event Approval(
    address owner,
    address spender,
    uint256 value
)
```

### ClaimingPermissionUpdated

```solidity
event ClaimingPermissionUpdated(
    uint256[] projectIds,
    bool disabled
)
```

### DistributionPermissionUpdated

```solidity
event DistributionPermissionUpdated(
    uint256[] projectIds,
    bool disabled
)
```

### ProjectAdded

```solidity
event ProjectAdded(
    uint256 id,
    string name,
    address distributor,
    bool currentMonthDistributionEnabled
)
```

### ProjectUpdated

```solidity
event ProjectUpdated(
    uint256 id,
    string name,
    address distributor,
    bool currentMonthDistributionEnabled
)
```

### RNatAccountCreated

```solidity
event RNatAccountCreated(
    address owner,
    contract IRNatAccount rNatAccount
)
```

### RewardsAssigned

```solidity
event RewardsAssigned(
    uint256 projectId,
    uint256 month,
    uint128 amount
)
```

### RewardsClaimed

```solidity
event RewardsClaimed(
    uint256 projectId,
    uint256 month,
    address owner,
    uint128 amount
)
```

### RewardsDistributed

```solidity
event RewardsDistributed(
    uint256 projectId,
    uint256 month,
    address[] recipients,
    uint128[] amounts
)
```

### RewardsUnassigned

```solidity
event RewardsUnassigned(
    uint256 projectId,
    uint256 month,
    uint128 amount
)
```

### Transfer

Emitted when `value` tokens are moved from one account (`from`) to
another (`to`).

Note that `value` may be zero.

```solidity
event Transfer(
    address from,
    address to,
    uint256 value
)
```

### UnassignedRewardsWithdrawn

```solidity
event UnassignedRewardsWithdrawn(
    address recipient,
    uint128 amount
)
```

### UnclaimedRewardsUnassigned

```solidity
event UnclaimedRewardsUnassigned(
    uint256 projectId,
    uint256 month,
    uint128 amount
)
```
