---
title: IFdcVerification
sidebar_position: 3
description: Interface for verifying FDC requests.
---

Interface for verifying FDC requests.

Sourced from `IFdcVerification.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFdcVerification.sol).

## Functions

### verifyAddressValidity

```solidity
function verifyAddressValidity(
    struct IAddressValidity.Proof _proof
) external view returns (
    bool _proved
);
```

### verifyBalanceDecreasingTransaction

```solidity
function verifyBalanceDecreasingTransaction(
    struct IBalanceDecreasingTransaction.Proof _proof
) external view returns (
    bool _proved
);
```

### verifyConfirmedBlockHeightExists

```solidity
function verifyConfirmedBlockHeightExists(
    struct IConfirmedBlockHeightExists.Proof _proof
) external view returns (
    bool _proved
);
```

### verifyEVMTransaction

```solidity
function verifyEVMTransaction(
    struct IEVMTransaction.Proof _proof
) external view returns (
    bool _proved
);
```

### verifyPayment

```solidity
function verifyPayment(
    struct IPayment.Proof _proof
) external view returns (
    bool _proved
);
```

### verifyReferencedPaymentNonexistence

```solidity
function verifyReferencedPaymentNonexistence(
    struct IReferencedPaymentNonexistence.Proof _proof
) external view returns (
    bool _proved
);
```
