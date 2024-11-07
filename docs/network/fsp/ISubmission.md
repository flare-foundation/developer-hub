---
title: ISubmission
sidebar_position: 2
description: Manages prioritized and subsidized submissions for protocols.
---

Manages prioritized and subsidized submissions for protocols.

Sourced from `ISubmission.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/ISubmission.sol).

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

### submit1

Submit1 method. Used in multiple protocols (i.e. as FTSO commit method).

```solidity
function submit1(
) external returns (
    bool
);
```

### submit2

Submit2 method. Used in multiple protocols (i.e. as FTSO reveal method).

```solidity
function submit2(
) external returns (
    bool
);
```

### submit3

Submit3 method. Future usage.

```solidity
function submit3(
) external returns (
    bool
);
```

### submitAndPass

SubmitAndPass method. Future usage.

```solidity
function submitAndPass(
    bytes _data
) external returns (
    bool
);
```

#### Parameters

- `_data`: The data to pass to the submitAndPassContract.

### submitSignatures

SubmitSignatures method. Used in multiple protocols (i.e. as FTSO submit signature method).

```solidity
function submitSignatures(
) external returns (
    bool
);
```

## Events

### NewVotingRoundInitiated

Event emitted when a new voting round is initiated.

```solidity
event NewVotingRoundInitiated(
)
```
