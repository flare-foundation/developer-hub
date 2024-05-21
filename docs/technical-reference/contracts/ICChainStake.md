---
title: ICChainStake
---

Interface for the `CChainStake` contract.
Sourced from `ICChainStake.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/ICChainStake.sol).

## Functions

### balanceOf

Queries the token balance of `_owner` at current block.

```solidity
function balanceOf(
    address _owner
) external view returns (
    uint256
);
```

#### Parameters

- `_owner`: The address from which the balance will be retrieved.

#### Returns

- ``: The current balance.

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
- `_blockNumber`: The block number when the balance is queried.

#### Returns

- ``: The balance at `\_blockNumber`.

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

### totalSupply

Total amount of tokens at current block.

```solidity
function totalSupply(
) external view returns (
    uint256
);
```

#### Returns

- ``: The current total amount of tokens.

### totalSupplyAt

Total amount of tokens at a specific `_blockNumber`.

```solidity
function totalSupplyAt(
    uint256 _blockNumber
) external view returns (
    uint256
);
```

#### Parameters

- `_blockNumber`: The block number when the totalSupply is queried.

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
