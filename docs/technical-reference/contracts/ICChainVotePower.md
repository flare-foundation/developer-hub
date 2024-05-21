---
title: ICChainVotePower
---

Interface for the vote power part of the `CChainStakeMirror` contract.
Sourced from `ICChainVotePower.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/ICChainVotePower.sol).

## Functions

### batchVotePowerOfAt

Return vote powers for several accounts in a batch.

```solidity
function batchVotePowerOfAt(
    address[] _accounts,
    uint256 _blockNumber
) external view returns (
    uint256[]
);
```

#### Parameters

- `_accounts`: The list of accounts to fetch vote power of.
- `_blockNumber`: The block number at which to fetch.

#### Returns

- ``: A list of vote powers.

### stakesOf

Get the amounts and accounts being staked to by a vote power owner.

```solidity
function stakesOf(
    address _owner
) external view returns (
    address[] _accounts,
    uint256[] _amounts
);
```

#### Parameters

- `_owner`: The address being queried.

#### Returns

- `_accounts`: Array of accounts.
- `_amounts`: Array of staked amounts, for each account.

### stakesOfAt

Get the amounts and accounts being staked to by a vote power owner,
at a given block.

```solidity
function stakesOfAt(
    address _owner,
    uint256 _blockNumber
) external view returns (
    address[] _accounts,
    uint256[] _amounts
);
```

#### Parameters

- `_owner`: The address being queried.
- `_blockNumber`: The block number being queried.

#### Returns

- `_accounts`: Array of accounts.
- `_amounts`: Array of staked amounts, for each account.

### totalVotePower

Get the current total vote power.

```solidity
function totalVotePower(
) external view returns (
    uint256
);
```

#### Returns

- ``: The current total vote power (sum of all accounts' vote powers).

### totalVotePowerAt

Get the total vote power at block `_blockNumber`

```solidity
function totalVotePowerAt(
    uint256 _blockNumber
) external view returns (
    uint256
);
```

#### Parameters

- `_blockNumber`: The block number at which to fetch.

#### Returns

- ``: The total vote power at the block (sum of all accounts' vote powers).

### totalVotePowerAtCached

Get the total vote power at block `_blockNumber` using cache.
It tries to read the cached value and if not found, reads the actual value and stores it in cache.
Can only be used if `_blockNumber` is in the past, otherwise reverts.

```solidity
function totalVotePowerAtCached(
    uint256 _blockNumber
) external returns (
    uint256
);
```

#### Parameters

- `_blockNumber`: The block number at which to fetch.

#### Returns

- ``: The total vote power at the block (sum of all accounts' vote powers).

### votePowerFromTo

Get current staked vote power from `_owner` staked to `_account`.

```solidity
function votePowerFromTo(
    address _owner,
    address _account
) external view returns (
    uint256
);
```

#### Parameters

- `_owner`: Address of vote power owner.
- `_account`: Account.

#### Returns

- ``: The staked vote power.

### votePowerFromToAt

Get current staked vote power from `_owner` staked to `_account` at `_blockNumber`.

```solidity
function votePowerFromToAt(
    address _owner,
    address _account,
    uint256 _blockNumber
) external view returns (
    uint256
);
```

#### Parameters

- `_owner`: Address of vote power owner.
- `_account`: Account.
- `_blockNumber`: The block number at which to fetch.

#### Returns

- ``: The staked vote power.

### votePowerOf

Get the current vote power of `_account`.

```solidity
function votePowerOf(
    address _account
) external view returns (
    uint256
);
```

#### Parameters

- `_account`: The account to get voting power.

#### Returns

- ``: Current vote power of `\_account`.

### votePowerOfAt

Get the vote power of `_account` at block `_blockNumber`

```solidity
function votePowerOfAt(
    address _account,
    uint256 _blockNumber
) external view returns (
    uint256
);
```

#### Parameters

- `_account`: The account to get voting power.
- `_blockNumber`: The block number at which to fetch.

#### Returns

- ``: Vote power of `\_account`at`\_blockNumber`.

### votePowerOfAtCached

Get the vote power of `_owner` at block `_blockNumber` using cache.
It tries to read the cached value and if not found, reads the actual value and stores it in cache.
Can only be used if \_blockNumber is in the past, otherwise reverts.

```solidity
function votePowerOfAtCached(
    address _owner,
    uint256 _blockNumber
) external returns (
    uint256
);
```

#### Parameters

- `_owner`: The account to get voting power.
- `_blockNumber`: The block number at which to fetch.

#### Returns

- ``: Vote power of `\_owner`at`\_blockNumber`.

## Events

### VotePowerCacheCreated

Emitted when a vote power cache entry is created.
Allows history cleaners to track vote power cache cleanup opportunities off-chain.

```solidity
event VotePowerCacheCreated(
    address account,
    uint256 blockNumber
)
```

#### Parameters

- `account`: The account whose vote power has just been cached.
- `blockNumber`: The block number at which the vote power has been cached.

### VotePowerChanged

Event triggered when a stake is confirmed or at the time it ends.
Definition: `votePowerFromTo(owner, account)` is `changed` from `priorVotePower` to `newVotePower`.

```solidity
event VotePowerChanged(
    address owner,
    address account,
    uint256 priorVotePower,
    uint256 newVotePower
)
```

#### Parameters

- `owner`: The account that has changed the amount of vote power it is staking.
- `account`: The account whose received vote power has changed.
- `priorVotePower`: The vote power originally on that account.
- `newVotePower`: The new vote power that triggered this event.
