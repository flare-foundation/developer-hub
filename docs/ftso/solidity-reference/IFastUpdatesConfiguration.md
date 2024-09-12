---
title: IFastUpdatesConfiguration
sidebar_position: 5
description: Interface for the block-latency feed configuration.
---

Interface for the block-latency feed configuration.

Sourced from `IFastUpdatesConfiguration.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFastUpdatesConfiguration.sol).

## Functions

### getFeedConfigurations

Returns the feed configurations, including removed ones.

```solidity
function getFeedConfigurations(
) external view returns (
    struct IFastUpdatesConfiguration.FeedConfiguration[]
);
```

### getFeedId

Returns the feed id at a given index. Removed (unused) feed index will return bytes21(0).

```solidity
function getFeedId(
    uint256 _index
) external view returns (
    bytes21 _feedId
);
```

#### Parameters

- `_index`: The index.

#### Returns

- `_feedId`: The feed id.

### getFeedIds

Returns all feed ids. For removed (unused) feed indices, the feed id will be bytes21(0).

```solidity
function getFeedIds(
) external view returns (
    bytes21[]
);
```

### getFeedIndex

Returns the index of a feed.

```solidity
function getFeedIndex(
    bytes21 _feedId
) external view returns (
    uint256 _index
);
```

#### Parameters

- `_feedId`: The feed id.

#### Returns

- `_index`: The index of the feed.

### getNumberOfFeeds

Returns the number of feeds, including removed ones.

```solidity
function getNumberOfFeeds(
) external view returns (
    uint256
);
```

### getUnusedIndices

Returns the unused indices - indices of removed feeds.

```solidity
function getUnusedIndices(
) external view returns (
    uint256[]
);
```

## Events

### FeedAdded

Event emitted when a feed is added.

```solidity
event FeedAdded(
    bytes21 feedId,
    uint32 rewardBandValue,
    uint24 inflationShare,
    uint256 index
)
```

### FeedRemoved

Event emitted when a feed is removed.

```solidity
event FeedRemoved(
    bytes21 feedId,
    uint256 index
)
```

### FeedUpdated

Event emitted when a feed is updated.

```solidity
event FeedUpdated(
    bytes21 feedId,
    uint32 rewardBandValue,
    uint24 inflationShare,
    uint256 index
)
```

## Structures

### FeedConfiguration

The feed configuration struct.

```solidity
struct FeedConfiguration {
  bytes21 feedId;
  uint32 rewardBandValue;
  uint24 inflationShare;
}
```
