---
title: IFastUpdater
sidebar_position: 4
description: Interface for updating block-latency feeds.
---

Interface for updating block-latency feeds.

Sourced from `IFastUpdater.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFastUpdater.sol).

## Functions

### blockScoreCutoff

Informational getter concerning the eligibility criterion for being chosen by sortition in a given block.

```solidity
function blockScoreCutoff(
    uint256 _blockNum
) external view returns (
    uint256 _cutoff
);
```

#### Parameters

- `_blockNum`: The block for which the cutoff is requested.

#### Returns

- `_cutoff`: The upper endpoint of the acceptable range of "scores" that providers generate for sortition. A score below the cutoff indicates eligibility to submit updates in the present sortition round.

### currentRewardEpochId

Id of the current reward epoch.

```solidity
function currentRewardEpochId(
) external view returns (
    uint24
);
```

### currentScoreCutoff

Informational getter concerning the eligibility criterion for being chosen by sortition.

```solidity
function currentScoreCutoff(
) external view returns (
    uint256 _cutoff
);
```

#### Returns

- `_cutoff`: The upper endpoint of the acceptable range of "scores" that providers generate for sortition. A score below the cutoff indicates eligibility to submit updates in the present sortition round.

### currentSortitionWeight

Informational getter concerning a provider's likelihood of being chosen by sortition.

```solidity
function currentSortitionWeight(
    address _signingPolicyAddress
) external view returns (
    uint256 _weight
);
```

#### Parameters

- `_signingPolicyAddress`: The signing policy address of the specified provider. This is different from the sender of an update transaction, due to the signature included in the `FastUpdates` type.

#### Returns

- `_weight`: The specified provider's weight for sortition purposes. This is derived from the provider's delegation weight for the FTSO, but rescaled against a fixed number of "virtual providers", indicating how many potential updates a single provider may make in a sortition round.

### fetchAllCurrentFeeds

Public access to the stored data of all feeds.

```solidity
function fetchAllCurrentFeeds(
) external view returns (
    bytes21[] _feedIds,
    uint256[] _feeds,
    int8[] _decimals,
    uint64 _timestamp
);
```

#### Returns

- `_feedIds`: The list of feed ids.
- `_feeds`: The list of feeds.
- `_decimals`: The list of decimal places for feeds.
- `_timestamp`: The timestamp of the last update.

### fetchCurrentFeeds

Public access to the stored data of each feed, allowing controlled batch access to the lengthy complete data.
Feeds should be sorted for better performance.

```solidity
function fetchCurrentFeeds(
    uint256[] _indices
) external view returns (
    uint256[] _feeds,
    int8[] _decimals,
    uint64 _timestamp
);
```

#### Parameters

- `_indices`: Index numbers of the feeds for which data should be returned, corresponding to `feedIds` in the `FastUpdatesConfiguration` contract.

#### Returns

- `_feeds`: The list of data for the requested feeds, in the same order as the feed indices were given (which may not be their sorted order).
- `_decimals`: The list of decimal places for the requested feeds, in the same order as the feed indices were given (which may not be their sorted order).
- `_timestamp`: The timestamp of the last update.

### numberOfUpdates

The number of updates submitted in each block for the last `_historySize` blocks (up to `MAX_BLOCKS_HISTORY`).

```solidity
function numberOfUpdates(
    uint256 _historySize
) external view returns (
    uint256[] _noOfUpdates
);
```

#### Parameters

- `_historySize`: The number of blocks for which the number of updates should be returned.

#### Returns

- `_noOfUpdates`: The number of updates submitted in each block for the last `_historySize` blocks. The array is ordered from the current block to the oldest block.

### numberOfUpdatesInBlock

The number of updates submitted in a block - available only for the last `MAX_BLOCKS_HISTORY` blocks.

```solidity
function numberOfUpdatesInBlock(
    uint256 _blockNumber
) external view returns (
    uint256 _noOfUpdates
);
```

#### Parameters

- `_blockNumber`: The block number for which the number of updates should be returned.

#### Returns

- `_noOfUpdates`: The number of updates submitted in the specified block.

### submissionWindow

The submission window is a number of blocks forming a "grace period" after a round of sortition starts,
during which providers may submit updates for that round. In other words, each block starts a new round of
sortition and that round lasts `submissionWindow` blocks.

```solidity
function submissionWindow(
) external view returns (
    uint8
);
```

### submitUpdates

The entry point for providers to submit an update transaction.

```solidity
function submitUpdates(
    struct IFastUpdater.FastUpdates _updates
) external;
```

#### Parameters

- `_updates`: Data of an update transaction, which in addition to the actual list of updates, includes the sortition credential proving the provider's eligibility to make updates in the also-included sortition round, as well as a signature allowing a single registered provider to submit from multiple EVM accounts.

## Events

### FastUpdateFeedRemoved

Event emitted when a feed is removed.

```solidity
event FastUpdateFeedRemoved(
    uint256 index
)
```

### FastUpdateFeedReset

Event emitted when a feed is added or reset.

```solidity
event FastUpdateFeedReset(
    uint256 votingRoundId,
    uint256 index,
    bytes21 id,
    uint256 value,
    int8 decimals
)
```

### FastUpdateFeeds

Event emitted at the start of a new voting epoch - current feeds' values and decimals.

```solidity
event FastUpdateFeeds(
    uint256 votingEpochId,
    uint256[] feeds,
    int8[] decimals
)
```

### FastUpdateFeedsSubmitted

Event emitted when a new set of updates is submitted.

```solidity
event FastUpdateFeedsSubmitted(
    uint32 votingRoundId,
    address signingPolicyAddress
)
```

## Structures

### FastUpdates

Fast update structure

```solidity
struct FastUpdates {
  uint256 sortitionBlock;
  struct SortitionCredential sortitionCredential;
  bytes deltas;
  struct IFastUpdater.Signature signature;
}
```

### Signature

Signature structure

```solidity
struct Signature {
  uint8 v;
  bytes32 r;
  bytes32 s;
}
```
