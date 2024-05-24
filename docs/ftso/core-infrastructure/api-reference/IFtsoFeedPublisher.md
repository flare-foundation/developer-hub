---
title: IFtsoFeedPublisher
---

FtsoFeedPublisher interface.
Sourced from `IFtsoFeedPublisher.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFtsoFeedPublisher.sol).

## Functions

### feedsHistorySize

The size of the feeds history.

```solidity
function feedsHistorySize(
) external view returns (
    uint256
);
```

### ftsoProtocolId

The FTSO protocol id.

```solidity
function ftsoProtocolId(
) external view returns (
    uint8
);
```

### getCurrentFeed

Returns the current feed.

```solidity
function getCurrentFeed(
    bytes21 _feedId
) external view returns (
    struct IFtsoFeedPublisher.Feed
);
```

#### Parameters

- `_feedId`: Feed id.

### getFeed

Returns the feed for given voting round id.

```solidity
function getFeed(
    bytes21 _feedId,
    uint256 _votingRoundId
) external view returns (
    struct IFtsoFeedPublisher.Feed
);
```

#### Parameters

- `_feedId`: Feed id.
- `_votingRoundId`: Voting round id.

### publish

Publishes feeds.

```solidity
function publish(
    struct IFtsoFeedPublisher.FeedWithProof[] _proofs
) external;
```

#### Parameters

- `_proofs`: The FTSO feeds with proofs to publish.

## Events

### FtsoFeedPublished

Event emitted when a new feed is published.

```solidity
event FtsoFeedPublished(
    uint32 votingRoundId,
    bytes21 id,
    int32 value,
    uint16 turnoutBIPS,
    int8 decimals
)
```

## Structures

### Feed

The FTSO feed struct.

```solidity
struct Feed {
  uint32 votingRoundId;
  bytes21 id;
  int32 value;
  uint16 turnoutBIPS;
  int8 decimals;
}
```

### FeedWithProof

The FTSO feed with proof struct.

```solidity
struct FeedWithProof {
  bytes32[] merkleProof;
  struct IFtsoFeedPublisher.Feed body;
}
```

### Random

The FTSO random struct.

```solidity
struct Random {
  uint32 votingRoundId;
  uint256 value;
  bool isSecure;
}
```
