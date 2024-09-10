---
title: FtsoV2Interface
sidebar_position: 1
description: Primary interface for interacting with FTSOv2.
---

Primary interface for interacting with FTSOv2.

Sourced from `FtsoV2Interface.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/LTS/FtsoV2Interface.sol).

## Functions

### getFeedById

Returns stored data of a feed.
A fee (calculated by the FeeCalculator contract) may need to be paid.

```solidity
function getFeedById(
    bytes21 _feedId
) external payable returns (
    uint256 _value,
    int8 _decimals,
    uint64 _timestamp
);
```

#### Parameters

- `_feedId`: The id of the feed.

#### Returns

- `_value`: The value for the requested feed.
- `_decimals`: The decimal places for the requested feed.
- `_timestamp`: The timestamp of the last update.

### getFeedByIdInWei

Returns value in wei and timestamp of a feed.
A fee (calculated by the FeeCalculator contract) may need to be paid.

```solidity
function getFeedByIdInWei(
    bytes21 _feedId
) external payable returns (
    uint256 _value,
    uint64 _timestamp
);
```

#### Parameters

- `_feedId`: The id of the feed.

#### Returns

- `_value`: The value for the requested feed in wei (i.e. with 18 decimal places).
- `_timestamp`: The timestamp of the last update.

### getFeedByIndex

Returns stored data of a feed.
A fee (calculated by the FeeCalculator contract) may need to be paid.

```solidity
function getFeedByIndex(
    uint256 _index
) external payable returns (
    uint256 _value,
    int8 _decimals,
    uint64 _timestamp
);
```

#### Parameters

- `_index`: The index of the feed, corresponding to feed id in the FastUpdatesConfiguration contract.

#### Returns

- `_value`: The value for the requested feed.
- `_decimals`: The decimal places for the requested feed.
- `_timestamp`: The timestamp of the last update.

### getFeedByIndexInWei

Returns value in wei and timestamp of a feed.
A fee (calculated by the FeeCalculator contract) may need to be paid.

```solidity
function getFeedByIndexInWei(
    uint256 _index
) external payable returns (
    uint256 _value,
    uint64 _timestamp
);
```

#### Parameters

- `_index`: The index of the feed, corresponding to feed id in the FastUpdatesConfiguration contract.

#### Returns

- `_value`: The value for the requested feed in wei (i.e. with 18 decimal places).
- `_timestamp`: The timestamp of the last update.

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

### getFeedsById

Returns stored data of each feed.
A fee (calculated by the FeeCalculator contract) may need to be paid.

```solidity
function getFeedsById(
    bytes21[] _feedIds
) external payable returns (
    uint256[] _values,
    int8[] _decimals,
    uint64 _timestamp
);
```

#### Parameters

- `_feedIds`: The list of feed ids.

#### Returns

- `_values`: The list of values for the requested feeds.
- `_decimals`: The list of decimal places for the requested feeds.
- `_timestamp`: The timestamp of the last update.

### getFeedsByIdInWei

Returns value of each feed and a timestamp.
For some feeds, a fee (calculated by the FeeCalculator contract) may need to be paid.

```solidity
function getFeedsByIdInWei(
    bytes21[] _feedIds
) external payable returns (
    uint256[] _values,
    uint64 _timestamp
);
```

#### Parameters

- `_feedIds`: Ids of the feeds.

#### Returns

- `_values`: The list of values for the requested feeds in wei (i.e. with 18 decimal places).
- `_timestamp`: The timestamp of the last update.

### getFeedsByIndex

Returns stored data of each feed.
A fee (calculated by the FeeCalculator contract) may need to be paid.

```solidity
function getFeedsByIndex(
    uint256[] _indices
) external payable returns (
    uint256[] _values,
    int8[] _decimals,
    uint64 _timestamp
);
```

#### Parameters

- `_indices`: Indices of the feeds, corresponding to feed ids in the FastUpdatesConfiguration contract.

#### Returns

- `_values`: The list of values for the requested feeds.
- `_decimals`: The list of decimal places for the requested feeds.
- `_timestamp`: The timestamp of the last update.

### getFeedsByIndexInWei

Returns value in wei of each feed and a timestamp.
For some feeds, a fee (calculated by the FeeCalculator contract) may need to be paid.

```solidity
function getFeedsByIndexInWei(
    uint256[] _indices
) external payable returns (
    uint256[] _values,
    uint64 _timestamp
);
```

#### Parameters

- `_indices`: Indices of the feeds, corresponding to feed ids in the FastUpdatesConfiguration contract.

#### Returns

- `_values`: The list of values for the requested feeds in wei (i.e. with 18 decimal places).
- `_timestamp`: The timestamp of the last update.

### verifyFeedData

Checks if the feed data is valid (i.e. is part of the confirmed Merkle tree).

```solidity
function verifyFeedData(
    struct FtsoV2Interface.FeedDataWithProof _feedData
) external view returns (
    bool
);
```

#### Parameters

- `_feedData`: Structure containing data about the feed (FeedData structure) and Merkle proof.

#### Returns

- ``: true if the feed data is valid.

## Structures

### FeedData

Feed data structure

```solidity
struct FeedData {
  uint32 votingRoundId;
  bytes21 id;
  int32 value;
  uint16 turnoutBIPS;
  int8 decimals;
}
```

### FeedDataWithProof

Feed data with proof structure

```solidity
struct FeedDataWithProof {
  bytes32[] proof;
  struct FtsoV2Interface.FeedData body;
}
```
