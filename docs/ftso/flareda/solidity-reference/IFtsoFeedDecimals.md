---
title: IFtsoFeedDecimals
---

FtsoFeedDecimals interface.
Sourced from `IFtsoFeedDecimals.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFtsoFeedDecimals.sol).

## Functions

### decimalsUpdateOffset

The offset in reward epochs for the decimals value to become effective.

```solidity
function decimalsUpdateOffset(
) external view returns (
    uint24
);
```

### defaultDecimals

The default decimals value.

```solidity
function defaultDecimals(
) external view returns (
    int8
);
```

### getCurrentDecimals

Returns current decimals set for `_feedId`.

```solidity
function getCurrentDecimals(
    bytes21 _feedId
) external view returns (
    int8
);
```

#### Parameters

- `_feedId`: Feed id.

### getCurrentDecimalsBulk

Returns current decimals setting for `_feedIds`.

```solidity
function getCurrentDecimalsBulk(
    bytes _feedIds
) external view returns (
    bytes _decimals
);
```

#### Parameters

- `_feedIds`: Concatenated feed ids (each feedId bytes21).

#### Returns

- `_decimals`: Concatenated corresponding decimals (each as bytes1(uint8(int8))).

### getDecimals

Returns the decimals of `_feedId` for given reward epoch id.

```solidity
function getDecimals(
    bytes21 _feedId,
    uint256 _rewardEpochId
) external view returns (
    int8
);
```

#### Parameters

- `_feedId`: Feed id.
- `_rewardEpochId`: Reward epoch id. **NOTE:** decimals might still change for the `current + decimalsUpdateOffset` reward epoch id.

### getDecimalsBulk

Returns decimals setting for `_feedIds` at `_rewardEpochId`.

```solidity
function getDecimalsBulk(
    bytes _feedIds,
    uint256 _rewardEpochId
) external view returns (
    bytes _decimals
);
```

#### Parameters

- `_feedIds`: Concatenated feed ids (each feedId bytes21).
- `_rewardEpochId`: Reward epoch id.

#### Returns

- `_decimals`: Concatenated corresponding decimals (each as bytes1(uint8(int8))). **NOTE:** decimals might still change for the `current + decimalsUpdateOffset` reward epoch id.

### getScheduledDecimalsChanges

Returns the scheduled decimals changes of `_feedId`.

```solidity
function getScheduledDecimalsChanges(
    bytes21 _feedId
) external view returns (
    int8[] _decimals,
    uint256[] _validFromEpochId,
    bool[] _fixed
);
```

#### Parameters

- `_feedId`: Feed id.

#### Returns

- `_decimals`: Positional array of decimals.
- `_validFromEpochId`: Positional array of reward epoch ids the decimals setings are effective from.
- `_fixed`: Positional array of boolean values indicating if settings are subjected to change.

## Events

### DecimalsChanged

Event emitted when a feed decimals value is changed.

```solidity
event DecimalsChanged(
    bytes21 feedId,
    int8 decimals,
    uint24 rewardEpochId
)
```
