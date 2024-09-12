---
title: IClaimSetupManager
sidebar_position: 5
description: Interface for managing reward claim setup.
---

Interface for managing reward claim setup.

Sourced from `IClaimSetupManager.sol` on [GitLab](https://gitlab.com/flarenetwork/flare-smart-contracts/-/blob/master/contracts/userInterfaces/IClaimSetupManager.sol).

## Functions

### setAutoClaiming

Sets the addresses of executors and optionally enables (creates) delegation account.
If setting registered executors some fee must be paid to them.

```solidity
function setAutoClaiming(
    address[] _executors,
    bool _enableDelegationAccount
) external payable;
```

#### Parameters

- `_executors`: The new executors. All old executors will be deleted and replaced by these.
- `_enableDelegationAccount`:

### setClaimExecutors

Sets the addresses of executors.
If setting registered executors some fee must be paid to them.

```solidity
function setClaimExecutors(
    address[] _executors
) external payable;
```

#### Parameters

- `_executors`: The new executors. All old executors will be deleted and replaced by these.

### setAllowedClaimRecipients

Set the addresses of allowed recipients.
Apart from these, the owner is always an allowed recipient.

```solidity
function setAllowedClaimRecipients(
    address[] _recipients
) external;
```

#### Parameters

- `_recipients`: The new allowed recipients. All old recipients will be deleted and replaced by these.

### enableDelegationAccount

Enables (creates) delegation account contract,
i.e. all airdrop and ftso rewards will be send to delegation account when using automatic claiming.

```solidity
function enableDelegationAccount(
) external returns (
    contract IDelegationAccount);
```

#### Returns

- ``: Address of delegation account contract.

### disableDelegationAccount

Disables delegation account contract,
i.e. all airdrop and ftso rewards will be send to owner's account when using automatic claiming.
Automatic claiming will not claim airdrop and ftso rewards for delegation account anymore.

```solidity
function disableDelegationAccount(
) external;
```

### registerExecutor

Allows executor to register and set initial fee value.
If executor was already registered before (has fee set), only update fee after `feeValueUpdateOffset`.
Executor must pay fee in order to register - `registerExecutorFeeValueWei`.

```solidity
function registerExecutor(
    uint256 _feeValue
) external payable returns (
    uint256);
```

#### Parameters

- `_feeValue`: number representing fee value

#### Returns

- ``: Returns the reward epoch number when the setting becomes effective.

### unregisterExecutor

Allows executor to unregister.

```solidity
function unregisterExecutor(
) external returns (
    uint256);
```

#### Returns

- ``: Returns the reward epoch number when the setting becomes effective.

### updateExecutorFeeValue

Allows registered executor to set (or update last scheduled) fee value.

```solidity
function updateExecutorFeeValue(
    uint256 _feeValue
) external returns (
    uint256);
```

#### Parameters

- `_feeValue`: number representing fee value

#### Returns

- ``: Returns the reward epoch number when the setting becomes effective.

### delegate

Delegate `_bips` of voting power to `_to` from msg.sender's delegation account

```solidity
function delegate(
    address _to,
    uint256 _bips
) external;
```

#### Parameters

- `_to`: The address of the recipient
- `_bips`: The percentage of voting power to be delegated expressed in basis points (1/100 of one percent). Not cumulative - every call resets the delegation value (and value of 0 revokes delegation).

### batchDelegate

Undelegate all percentage delegations from the msg.sender's delegation account and then delegate
corresponding `_bips` percentage of voting power to each member of `_delegatees`.

```solidity
function batchDelegate(
    address[] _delegatees,
    uint256[] _bips
) external;
```

#### Parameters

- `_delegatees`: The addresses of the new recipients.
- `_bips`: The percentages of voting power to be delegated expressed in basis points (1/100 of one percent). Total of all `_bips` values must be at most 10000.

### undelegateAll

Undelegate all voting power for delegates of msg.sender's delegation account

```solidity
function undelegateAll(
) external;
```

### revokeDelegationAt

Revoke all delegation from msg.sender's delegation account to `_who` at given block.
Only affects the reads via `votePowerOfAtCached()` in the block `_blockNumber`.
Block `_blockNumber` must be in the past.
This method should be used only to prevent rogue delegate voting in the current voting block.
To stop delegating use delegate with value of 0 or undelegateAll.

```solidity
function revokeDelegationAt(
    address _who,
    uint256 _blockNumber
) external;
```

### delegateGovernance

Delegate all governance vote power of msg.sender's delegation account to `_to`.

```solidity
function delegateGovernance(
    address _to
) external;
```

#### Parameters

- `_to`: The address of the recipient

### undelegateGovernance

Undelegate governance vote power for delegate of msg.sender's delegation account

```solidity
function undelegateGovernance(
) external;
```

### withdraw

Allows user to transfer WNat to owner's account.

```solidity
function withdraw(
    uint256 _amount
) external;
```

#### Parameters

- `_amount`: Amount of tokens to transfer

### transferExternalToken

Allows user to transfer balance of ERC20 tokens owned by the personal delegation contract.
The main use case is to transfer tokens/NFTs that were received as part of an airdrop or register
as participant in such airdrop.

```solidity
function transferExternalToken(
    contract IERC20 _token,
    uint256 _amount
) external;
```

#### Parameters

- `_token`: Target token contract address
- `_amount`: Amount of tokens to transfer

### accountToDelegationAccount

Gets the delegation account of the `_owner`. Returns address(0) if not created yet.

```solidity
function accountToDelegationAccount(
    address _owner
) external view returns (
    address);
```

### getDelegationAccountData

Gets the delegation account data for the `_owner`. Returns address(0) if not created yet.

```solidity
function getDelegationAccountData(
    address _owner
) external view returns (
    contract IDelegationAccount _delegationAccount,
    bool _enabled);
```

#### Parameters

- `_owner`: owner's address

#### Returns

- `_delegationAccount`: owner's delegation account address - could be address(0)
- `_enabled`: indicates if delegation account is enabled

### claimExecutors

Get the addresses of executors.

```solidity
function claimExecutors(
    address _owner
) external view returns (
    address[]);
```

### allowedClaimRecipients

Get the addresses of allowed recipients.
Apart from these, the owner is always an allowed recipient.

```solidity
function allowedClaimRecipients(
    address _rewardOwner
) external view returns (
    address[]);
```

### isClaimExecutor

Returns info if `_executor` is allowed to execute calls for `_owner`

```solidity
function isClaimExecutor(
    address _owner,
    address _executor
) external view returns (
    bool);
```

### getRegisteredExecutors

Get registered executors

```solidity
function getRegisteredExecutors(
    uint256 _start,
    uint256 _end
) external view returns (
    address[] _registeredExecutors,
    uint256 _totalLength);
```

### getExecutorInfo

Returns some info about the `_executor`

```solidity
function getExecutorInfo(
    address _executor
) external view returns (
    bool _registered,
    uint256 _currentFeeValue);
```

#### Parameters

- `_executor`: address representing executor

#### Returns

- `_registered`: information if executor is registered
- `_currentFeeValue`: executor's current fee value

### getExecutorCurrentFeeValue

Returns the current fee value of `_executor`

```solidity
function getExecutorCurrentFeeValue(
    address _executor
) external view returns (
    uint256);
```

#### Parameters

- `_executor`: address representing executor

### getExecutorFeeValue

Returns the fee value of `_executor` at `_rewardEpoch`

```solidity
function getExecutorFeeValue(
    address _executor,
    uint256 _rewardEpoch
) external view returns (
    uint256);
```

#### Parameters

- `_executor`: address representing executor
- `_rewardEpoch`: reward epoch number

### getExecutorScheduledFeeValueChanges

Returns the scheduled fee value changes of `_executor`

```solidity
function getExecutorScheduledFeeValueChanges(
    address _executor
) external view returns (
    uint256[] _feeValue,
    uint256[] _validFromEpoch,
    bool[] _fixed);
```

#### Parameters

- `_executor`: address representing executor

#### Returns

- `_feeValue`: positional array of fee values
- `_validFromEpoch`: positional array of reward epochs the fee settings are effective from
- `_fixed`: positional array of boolean values indicating if settings are subjected to change

## Events

### DelegationAccountCreated

```solidity
event DelegationAccountCreated(
    address owner,
    contract IDelegationAccount delegationAccount
)
```

### DelegationAccountUpdated

```solidity
event DelegationAccountUpdated(
    address owner,
    contract IDelegationAccount delegationAccount,
    bool enabled
)
```

### ClaimExecutorsChanged

```solidity
event ClaimExecutorsChanged(
    address owner,
    address[] executors
)
```

### AllowedClaimRecipientsChanged

```solidity
event AllowedClaimRecipientsChanged(
    address owner,
    address[] recipients
)
```

### ClaimExecutorFeeValueChanged

```solidity
event ClaimExecutorFeeValueChanged(
    address executor,
    uint256 validFromRewardEpoch,
    uint256 feeValueWei
)
```

### ExecutorRegistered

```solidity
event ExecutorRegistered(
    address executor
)
```

### ExecutorUnregistered

```solidity
event ExecutorUnregistered(
    address executor,
    uint256 validFromRewardEpoch
)
```

### MinFeeSet

```solidity
event MinFeeSet(
    uint256 minFeeValueWei
)
```

### MaxFeeSet

```solidity
event MaxFeeSet(
    uint256 maxFeeValueWei
)
```

### RegisterExecutorFeeSet

```solidity
event RegisterExecutorFeeSet(
    uint256 registerExecutorFeeValueWei
)
```

### SetExecutorsExcessAmountRefunded

```solidity
event SetExecutorsExcessAmountRefunded(
    address owner,
    uint256 excessAmount
)
```
