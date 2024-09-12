---
title: IFtsoFeedIdConverter
description: Interface for converting feed names to feed ids.
sidebar_position: 3
---

Interface for converting feed names to feed ids.

Sourced from `IFtsoFeedIdConverter.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFtsoFeedIdConverter.sol).

## Functions

### getFeedCategoryAndName

Returns the feed category and name for given feed id.

```solidity
function getFeedCategoryAndName(
    bytes21 _feedId
) external pure returns (
    uint8 _category,
    string _name
);
```

#### Parameters

- `_feedId`: Feed id.

#### Returns

- `_category`: Feed category.
- `_name`: Feed name.

### getFeedId

Returns the feed id for given category and name.

```solidity
function getFeedId(
    uint8 _category,
    string _name
) external view returns (
    bytes21
);
```

#### Parameters

- `_category`: Feed category.
- `_name`: Feed name.

#### Returns

- ``: Feed id.
