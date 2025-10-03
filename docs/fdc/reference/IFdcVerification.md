---
title: IFdcVerification
sidebar_position: 3
description: Interface for verifying FDC requests.
---

import CodeBlock from "@theme/CodeBlock";
import AddressSolidity from "!!raw-loader!/examples/developer-hub-solidity/AddressSolidity.sol";
import Remix from "@site/src/components/remix";

Interface for verifying Flare Data Connector (FDC) attestation requests.

Sourced from `IFdcVerification.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFdcVerification.sol).

## Overview

The IFdcVerification interface provides methods to verify different types of attestations from the Flare Data Connector. Smart contracts can use these verification functions to validate proofs provided by the State Connector system, ensuring the authenticity and integrity of the external data being used.

## Verification Functions

Each verification function takes a proof structure specific to the attestation type and returns a boolean indicating whether the proof is valid.

### verifyAddressValidity

Verifies a proof for an address validity attestation.

```solidity
function verifyAddressValidity(
    struct IAddressValidity.Proof _proof
) external view returns (
    bool _proved
);
```

**Parameters**

- `_proof`: The address validity proof structure containing the merkle proof and response data

**Returns**

- `_proved`: Boolean indicating if the proof is valid

### verifyBalanceDecreasingTransaction

Verifies a proof for a balance decreasing transaction attestation.

```solidity
function verifyBalanceDecreasingTransaction(
    struct IBalanceDecreasingTransaction.Proof _proof
) external view returns (
    bool _proved
);
```

**Parameters**

- `_proof`: The balance decreasing transaction proof structure

**Returns**

- `_proved`: Boolean indicating if the proof is valid

### verifyConfirmedBlockHeightExists

Verifies a proof that a specified block height exists and is confirmed.

```solidity
function verifyConfirmedBlockHeightExists(
    struct IConfirmedBlockHeightExists.Proof _proof
) external view returns (
    bool _proved
);
```

**Parameters**

- `_proof`: The confirmed block height existence proof structure

**Returns**

- `_proved`: Boolean indicating if the proof is valid

### verifyEVMTransaction

Verifies a proof for an Ethereum Virtual Machine transaction.

```solidity
function verifyEVMTransaction(
    struct IEVMTransaction.Proof _proof
) external view returns (
    bool _proved
);
```

**Parameters**

- `_proof`: The EVM transaction proof structure

**Returns**

- `_proved`: Boolean indicating if the proof is valid

### verifyPayment

Verifies a proof for a payment transaction.

```solidity
function verifyPayment(
    struct IPayment.Proof _proof
) external view returns (
    bool _proved
);
```

**Parameters**

- `_proof`: The payment proof structure

**Returns**

- `_proved`: Boolean indicating if the proof is valid

### verifyReferencedPaymentNonexistence

Verifies a proof that a specific payment with reference did not occur within a given timeframe.

```solidity
function verifyReferencedPaymentNonexistence(
    struct IReferencedPaymentNonexistence.Proof _proof
) external view returns (
    bool _proved
);
```

**Parameters**

- `_proof`: The referenced payment nonexistence proof structure

**Returns**

- `_proved`: Boolean indicating if the proof is valid

## Usage Example

<CodeBlock language="solidity" title="AddressSolidity.sol">
  {AddressSolidity}
</CodeBlock>
<Remix fileName="AddressSolidity.sol">Open example in Remix</Remix>
