# IFtsoFeedIdConverter

## Fn getFeedId

Returns the feed id for given category and name.

```solidity
function getFeedId(uint8 _category, string _name) external view returns (bytes21)
```

Params:

| Name | Type | Description |
| ---- | ---- | ----------- |
| `_category` | `uint8` | Feed category. |
| `_name` | `string` | Feed name. |

Returns:

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | `bytes21` | Feed id. |

## Fn getFeedCategoryAndName

Returns the feed category and name for given feed id.

```solidity
function getFeedCategoryAndName(bytes21 _feedId) external pure returns (uint8 _category, string _name)
```

Params:

| Name | Type | Description |
| ---- | ---- | ----------- |
| `_feedId` | `bytes21` | Feed id. |

Returns:

| Name | Type | Description |
| ---- | ---- | ----------- |
| `_category` | `uint8` | Feed category. |
| `_name` | `string` | Feed name. |

