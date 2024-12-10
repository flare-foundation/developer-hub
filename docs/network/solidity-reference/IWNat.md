---
title: IWNat
description: Interface for wrapping and unwrapping native tokens.
sidebar_position: 7
---

Interface for wrapping and unwrapping native tokens.

Sourced from `IWNat.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IWNat.sol).

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

### balanceOfAt

Queries the token balance of `_owner` at a specific `_blockNumber`.

```solidity
function balanceOfAt(
    address _owner,
    uint256 _blockNumber
) external view returns (
    uint256
);
```

#### Parameters

- `_owner`: The address from which the balance will be retrieved.
- `_blockNumber`: The block number to query.

#### Returns

- ``: The balance at `\_blockNumber`.

### batchDelegate

Undelegate all percentage delegations from the sender and then delegate corresponding
`_bips` percentage of voting power from the sender to each member of the `_delegatees` array.

```solidity
function batchDelegate(
    address[] _delegatees,
    uint256[] _bips
) external;
```

#### Parameters

- `_delegatees`: The addresses of the new recipients.
- `_bips`: The percentages of voting power to be delegated expressed in basis points (1/100 of one percent). The sum of all `_bips` values must be at most 10000 (100%).

### cleanupBlockNumber

Get the current cleanup block number set with `setCleanupBlockNumber()`.

```solidity
function cleanupBlockNumber(
) external view returns (
    uint256
);
```

#### Returns

- ``: The currently set cleanup block number.

### decimals

Returns the number of decimals used to get its user representation.
For example, if `decimals` equals 2, a balance of 505 tokens should
be displayed to a user as 5.05 (505 / 10<sup>2</sup>).

Tokens usually opt for a value of 18, imitating the relationship between
Ether and wei. This is the default value returned by this function, unless
it's overridden.

NOTE: This information is only used for _display_ purposes: it in
no way affects any of the arithmetic of the contract, including
balanceOf and transfer.

Should be compatible with ERC20 method.

```solidity
function decimals(
) external view returns (
    uint8
);
```

### delegate

Delegate voting power to account `_to` from `msg.sender`, by percentage.

```solidity
function delegate(
    address _to,
    uint256 _bips
) external;
```

#### Parameters

- `_to`: The address of the recipient.
- `_bips`: The percentage of voting power to be delegated expressed in basis points (1/100 of one percent). Not cumulative: every call resets the delegation value (and a value of 0 revokes all previous delegations).

### delegateExplicit

Explicitly delegate `_amount` voting power to account `_to` from `msg.sender`.
Compare with `delegate` which delegates by percentage.

```solidity
function delegateExplicit(
    address _to,
    uint256 _amount
) external;
```

#### Parameters

- `_to`: The address of the recipient.
- `_amount`: An explicit vote power amount to be delegated. Not cumulative: every call resets the delegation value (and a value of 0 revokes all previous delegations).

### delegatesOf

Get the list of addresses to which `_who` is delegating, and their percentages.

```solidity
function delegatesOf(
    address _who
) external view returns (
    address[] _delegateAddresses,
    uint256[] _bips,
    uint256 _count,
    uint256 _delegationMode
);
```

#### Parameters

- `_who`: The address to query.

#### Returns

- `_delegateAddresses`: Positional array of addresses being delegated to.
- `_bips`: Positional array of delegation percents specified in basis points (1/100 of 1 percent). Each one matches the address in the same position in the `_delegateAddresses` array.
- `_count`: The number of delegates.
- `_delegationMode`: Delegation mode: 0 = NOT SET, 1 = PERCENTAGE, 2 = AMOUNT (i.e. explicit).

### delegatesOfAt

Get the list of addresses to which `_who` is delegating, and their percentages, at the given block.

```solidity
function delegatesOfAt(
    address _who,
    uint256 _blockNumber
) external view returns (
    address[] _delegateAddresses,
    uint256[] _bips,
    uint256 _count,
    uint256 _delegationMode
);
```

#### Parameters

- `_who`: The address to query.
- `_blockNumber`: The block number to query.

#### Returns

- `_delegateAddresses`: Positional array of addresses being delegated to.
- `_bips`: Positional array of delegation percents specified in basis points (1/100 of 1 percent). Each one matches the address in the same position in the `_delegateAddresses` array.
- `_count`: The number of delegates.
- `_delegationMode`: Delegation mode: 0 = NOT SET, 1 = PERCENTAGE, 2 = AMOUNT (i.e. explicit).

### delegationModeOf

Get the delegation mode for account '\_who'. This mode determines whether vote power is
allocated by percentage or by explicit amount. Once the delegation mode is set,
it can never be changed, even if all delegations are removed.

```solidity
function delegationModeOf(
    address _who
) external view returns (
    uint256
);
```

#### Parameters

- `_who`: The address to get delegation mode.

#### Returns

- ``: Delegation mode: 0 = NOT SET, 1 = PERCENTAGE, 2 = AMOUNT (i.e. explicit).

### deposit

Deposit Native and mint WNat ERC20.

```solidity
function deposit(
) external payable;
```

### depositTo

Deposit Native from msg.sender and mints WNat ERC20 to recipient address.

```solidity
function depositTo(
    address recipient
) external payable;
```

#### Parameters

- `recipient`: An address to receive minted WNat.

### governanceVotePower

When set, allows token owners to participate in governance voting
and delegating governance vote power.

```solidity
function governanceVotePower(
) external view returns (
    contract IGovernanceVotePower
);
```

### name

Returns the name of the token.

Should be compatible with ERC20 method.

```solidity
function name(
) external view returns (
    string
);
```

### readVotePowerContract

Returns VPContract event interface used for read-only operations (view methods).
The only non-view method that might be called on it is `revokeDelegationAt`.

`readVotePowerContract` is almost always equal to `writeVotePowerContract`
except during an upgrade from one `VPContract` to a new version (which should happen
rarely or never and will be announced beforehand).

Do not call any methods on `VPContract` directly.
State changing methods are forbidden from direct calls.
All methods are exposed via `VPToken`.
This is the reason that this method returns `IVPContractEvents`.
Use it only for listening to events and revoking.

```solidity
function readVotePowerContract(
) external view returns (
    contract IVPContractEvents
);
```

### revokeDelegationAt

Revoke all delegation from sender to `_who` at given block.
Only affects the reads via `votePowerOfAtCached()` in the block `_blockNumber`.
Block `_blockNumber` must be in the past.
This method should be used only to prevent rogue delegate voting in the current voting block.
To stop delegating use delegate / delegateExplicit with value of 0 or undelegateAll / undelegateAllExplicit.

```solidity
function revokeDelegationAt(
    address _who,
    uint256 _blockNumber
) external;
```

#### Parameters

- `_who`: Address of the delegatee.
- `_blockNumber`: The block number at which to revoke delegation..

### setCleanerContract

Set the contract that is allowed to call history cleaning methods.

```solidity
function setCleanerContract(
    address _cleanerContract
) external;
```

#### Parameters

- `_cleanerContract`: Address of the cleanup contract. Usually this will be an instance of `CleanupBlockNumberManager`.

### setCleanupBlockNumber

Set the cleanup block number.
Historic data for the blocks before `cleanupBlockNumber` can be erased.
History before that block should never be used since it can be inconsistent.
In particular, cleanup block number must be lower than the current vote power block.

```solidity
function setCleanupBlockNumber(
    uint256 _blockNumber
) external;
```

#### Parameters

- `_blockNumber`: The new cleanup block number.

### symbol

Returns the symbol of the token, usually a shorter version of the name.

Should be compatible with ERC20 method.

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

### totalSupplyAt

Total amount of tokens held by all accounts at a specific block number.

```solidity
function totalSupplyAt(
    uint256 _blockNumber
) external view returns (
    uint256
);
```

#### Parameters

- `_blockNumber`: The block number to query.

#### Returns

- ``: The total amount of tokens at `\_blockNumber`.

### totalVotePower

Get the current total vote power.

```solidity
function totalVotePower(
) external view returns (
    uint256
);
```

#### Returns

- ``: The current total vote power (sum of all accounts' vote power).

### totalVotePowerAt

Get the total vote power at block `_blockNumber`.

```solidity
function totalVotePowerAt(
    uint256 _blockNumber
) external view returns (
    uint256
);
```

#### Parameters

- `_blockNumber`: The block number to query.

#### Returns

- ``: The total vote power at the queried block (sum of all accounts' vote powers).

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

### undelegateAll

Undelegate all voting power of `msg.sender`. This effectively revokes all previous delegations.
Can only be used with percentage delegation.
Does not reset delegation mode back to NOT SET.

```solidity
function undelegateAll(
) external;
```

### undelegateAllExplicit

Undelegate all explicit vote power by amount of `msg.sender`.
Can only be used with explicit delegation.
Does not reset delegation mode back to NOT SET.

```solidity
function undelegateAllExplicit(
    address[] _delegateAddresses
) external returns (
    uint256
);
```

#### Parameters

- `_delegateAddresses`: Explicit delegation does not store delegatees' addresses, so the caller must supply them.

#### Returns

- ``: The amount still delegated (in case the list of delegates was incomplete).

### undelegatedVotePowerOf

Compute the current undelegated vote power of the `_owner` account.

```solidity
function undelegatedVotePowerOf(
    address _owner
) external view returns (
    uint256
);
```

#### Parameters

- `_owner`: The address to query.

#### Returns

- ``: The unallocated vote power of `\_owner`.

### undelegatedVotePowerOfAt

Get the undelegated vote power of the `_owner` account at a given block number.

```solidity
function undelegatedVotePowerOfAt(
    address _owner,
    uint256 _blockNumber
) external view returns (
    uint256
);
```

#### Parameters

- `_owner`: The address to query.
- `_blockNumber`: The block number to query.

#### Returns

- ``: The unallocated vote power of `\_owner`.

### votePowerFromTo

Get current delegated vote power from delegator `_from` to delegatee `_to`.

```solidity
function votePowerFromTo(
    address _from,
    address _to
) external view returns (
    uint256
);
```

#### Parameters

- `_from`: Address of delegator.
- `_to`: Address of delegatee.

#### Returns

- ``: votePower The delegated vote power.

### votePowerFromToAt

Get delegated vote power from delegator `_from` to delegatee `_to` at `_blockNumber`.

```solidity
function votePowerFromToAt(
    address _from,
    address _to,
    uint256 _blockNumber
) external view returns (
    uint256
);
```

#### Parameters

- `_from`: Address of delegator.
- `_to`: Address of delegatee.
- `_blockNumber`: The block number to query.

#### Returns

- ``: The delegated vote power.

### votePowerOf

Get the current vote power of `_owner`.

```solidity
function votePowerOf(
    address _owner
) external view returns (
    uint256
);
```

#### Parameters

- `_owner`: The address to query.

#### Returns

- ``: Current vote power of `\_owner`.

### votePowerOfAt

Get the vote power of `_owner` at block `_blockNumber`

```solidity
function votePowerOfAt(
    address _owner,
    uint256 _blockNumber
) external view returns (
    uint256
);
```

#### Parameters

- `_owner`: The address to query.
- `_blockNumber`: The block number to query.

#### Returns

- ``: Vote power of `\_owner`at block number`\_blockNumber`.

### votePowerOfAtIgnoringRevocation

Get the vote power of `_owner` at block `_blockNumber`, ignoring revocation information (and cache).

```solidity
function votePowerOfAtIgnoringRevocation(
    address _owner,
    uint256 _blockNumber
) external view returns (
    uint256
);
```

#### Parameters

- `_owner`: The address to query.
- `_blockNumber`: The block number to query.

#### Returns

- ``: Vote power of `\_owner`at block number`\_blockNumber`. Result doesn't change if vote power is revoked.

### withdraw

Withdraw Native and burn WNat ERC20.

```solidity
function withdraw(
    uint256 amount
) external;
```

#### Parameters

- `amount`: The amount to withdraw.

### withdrawFrom

Withdraw WNat from an owner and send native tokens to msg.sender given an allowance.

```solidity
function withdrawFrom(
    address owner,
    uint256 amount
) external;
```

#### Parameters

- `owner`: An address spending the Native tokens.
- `amount`: The amount to spend. Requirements: - `owner` must have a balance of at least `amount`. - the caller must have allowance for `owners`'s tokens of at least `amount`.

### writeVotePowerContract

Returns VPContract event interface used for state-changing operations (non-view methods).
The only non-view method that might be called on it is `revokeDelegationAt`.

`writeVotePowerContract` is almost always equal to `readVotePowerContract`,
except during upgrade from one `VPContract` to a new version (which should happen
rarely or never and will be announced beforehand).
In the case of an upgrade, `writeVotePowerContract` is replaced first to establish delegations.
After some period (e.g., after a reward epoch ends), `readVotePowerContract` is set equal to it.

Do not call any methods on `VPContract` directly.
State changing methods are forbidden from direct calls.
All are exposed via `VPToken`.
This is the reason that this method returns `IVPContractEvents`
Use it only for listening to events, delegating, and revoking.

```solidity
function writeVotePowerContract(
) external view returns (
    contract IVPContractEvents
);
```
