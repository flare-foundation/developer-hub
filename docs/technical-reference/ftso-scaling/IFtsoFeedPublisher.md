---
sidebar_position: 1
---

# IFtsoFeedPublisher

## Event FtsoFeedPublished

Event emitted when a new feed is published.

```solidity
event FtsoFeedPublished(uint32 votingRoundId, bytes21 id, int32 value, uint16 turnoutBIPS, int8 decimals)
```

## Fn publish

Publishes feeds.

```solidity
function publish(struct IFtsoFeedPublisher.FeedWithProof[] _proofs) external
```

Params:

| Name | Type | Description |
| ---- | ---- | ----------- |
| `_proofs` | `struct IFtsoFeedPublisher.FeedWithProof[]` | The FTSO feeds with proofs to publish. |

## Fn ftsoProtocolId

The FTSO protocol id.

```solidity
function ftsoProtocolId() external view returns (uint8)
```

## Fn feedsHistorySize

The size of the feeds history.

```solidity
function feedsHistorySize() external view returns (uint256)
```

## Fn getCurrentFeed

Returns the current feed.

```solidity
function getCurrentFeed(bytes21 _feedId) external view returns (struct IFtsoFeedPublisher.Feed)
```

Params:

| Name | Type | Description |
| ---- | ---- | ----------- |
| `_feedId` | `bytes21` | Feed id. |

## Fn getFeed

Returns the feed for given voting round id.

```solidity
function getFeed(bytes21 _feedId, uint256 _votingRoundId) external view returns (struct IFtsoFeedPublisher.Feed)
```

Params:

| Name | Type | Description |
| ---- | ---- | ----------- |
| `_feedId` | `bytes21` | Feed id. |
| `_votingRoundId` | `uint256` | Voting round id. |

