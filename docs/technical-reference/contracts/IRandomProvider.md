---
title: IRandomProvider
---

Random provider interface.
Sourced from `IRandomProvider.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IRandomProvider.sol).

## Functions

### getCurrentRandom

Returns current random number. Method reverts if random number was not generated securely.

```solidity
function getCurrentRandom(
) external view returns (
    uint256 _randomNumber
);
```

#### Returns

- `_randomNumber`: Current random number.

### getCurrentRandomWithQuality

Returns current random number and a flag indicating if it was securely generated.
It is up to the caller to decide whether to use the returned random number or not.

```solidity
function getCurrentRandomWithQuality(
) external view returns (
    uint256 _randomNumber,
    bool _isSecureRandom
);
```

#### Returns

- `_randomNumber`: Current random number.
- `_isSecureRandom`: Indicates if current random number is secure.

### getCurrentRandomWithQualityAndTimestamp

Returns current random number, a flag indicating if it was securely generated and its timestamp.
It is up to the caller to decide whether to use the returned random number or not.

```solidity
function getCurrentRandomWithQualityAndTimestamp(
) external view returns (
    uint256 _randomNumber,
    bool _isSecureRandom,
    uint256 _randomTimestamp
);
```

#### Returns

- `_randomNumber`: Current random number.
- `_isSecureRandom`: Indicates if current random number is secure.
- `_randomTimestamp`: Random timestamp.
