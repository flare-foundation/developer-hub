---
title: FtsoV2Interface
sidebar_position: 1
description: Primary interface for interacting with FTSOv2.
---

import Remix from "@site/src/components/remix";
import CodeBlock from "@theme/CodeBlock";
import FTSOV2FeedById from "!!raw-loader!/examples/developer-hub-solidity/FTSOV2FeedById.sol";
import FTSOV2FeedByIdWei from "!!raw-loader!/examples/developer-hub-solidity/FTSOV2FeedByIdWei.sol";
import FTSOV2FeedsById from "!!raw-loader!/examples/developer-hub-solidity/FTSOV2FeedsById.sol";
import FTSOV2FeedsByIdWei from "!!raw-loader!/examples/developer-hub-solidity/FTSOV2FeedsByIdWei.sol";
import FTSOV2VerifyProof from "!!raw-loader!/examples/developer-hub-solidity/FTSOV2VerifyProof.sol";

Primary interface for interacting with FTSOv2. This is a long-term support (LTS) interface, designed to ensure continuity even as underlying contracts evolve or protocols migrate to new versions.

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

<details>
<summary>Sample contract usage</summary>

<CodeBlock language="solidity" title="FTSOV2FeedById.sol">
  {FTSOV2FeedById}
</CodeBlock>

</details>

<Remix fileName="FTSOV2FeedById.sol">Open sample in Remix</Remix>

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

<details>
<summary>Sample contract usage</summary>

<CodeBlock language="solidity" title="FTSOV2FeedByIdWei.sol">
  {FTSOV2FeedByIdWei}
</CodeBlock>

</details>

<Remix fileName="FTSOV2FeedByIdWei.sol">Open sample in Remix</Remix>

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

<details>
<summary>Sample contract usage</summary>

<CodeBlock language="solidity" title="FTSOV2FeedsById.sol">
  {FTSOV2FeedsById}
</CodeBlock>

</details>

<Remix fileName="FTSOV2FeedsById.sol">Open sample in Remix</Remix>

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

<details>
<summary>Sample contract usage</summary>

<CodeBlock language="solidity" title="FTSOV2FeedsByIdWei.sol">
  {FTSOV2FeedsByIdWei}
</CodeBlock>

</details>

<Remix fileName="FTSOV2FeedsByIdWei.sol">Open sample in Remix</Remix>

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

- `_0`: true if the feed data is valid.

<details>
<summary>Sample contract usage</summary>

<CodeBlock language="solidity" title="FTSOV2VerifyProof.sol">
  {FTSOV2VerifyProof}
</CodeBlock>

</details>

<Remix fileName="FTSOV2VerifyProof.sol">Open sample in Remix</Remix>

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
