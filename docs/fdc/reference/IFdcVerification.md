---
title: IFdcVerification
sidebar_position: 3
description: Interface for verifying FDC requests.
---

import CodeBlock from "@theme/CodeBlock";
import AddressSolidity from "!!raw-loader!/examples/developer-hub-solidity/AddressSolidity.sol";
import RemixEmbed from "@site/src/components/RemixEmbed";

Interface for verifying Flare Data Connector (FDC) attestation requests.

Sourced from `IFdcVerification.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFdcVerification.sol).

## Overview

The IFdcVerification interface provides methods to verify different types of attestations from the Flare Data Connector.
Smart contracts can use these verification functions to validate proofs provided by the FDC, ensuring the authenticity and integrity of the external data being used.

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

### verifyWeb2Json

Verifies a proof for a Web2Json attestation (FDC-fetched HTTP response post-processed through JQ).

```solidity
function verifyWeb2Json(
    struct IWeb2Json.Proof _proof
) external view returns (
    bool _proved
);
```

**Parameters**

- `_proof`: The Web2Json proof structure

**Returns**

- `_proved`: Boolean indicating if the proof is valid

## Metadata accessors

### fdcProtocolId

Returns the FDC protocol id used as the `protocolId` argument when querying `IRelay.isFinalized(protocolId, votingRoundId)`.
Read this at runtime instead of hard-coding a literal — the value can change between network releases.

```solidity
function fdcProtocolId() external view returns (uint8 _fdcProtocolId);
```

### relay

Returns the `IRelay` contract address bound to this `IFdcVerification` deployment.

```solidity
function relay() external view returns (IRelay);
```

## Usage Example

<CodeBlock language="solidity" title="AddressSolidity.sol">
  {AddressSolidity}
</CodeBlock>
<RemixEmbed fileName="AddressSolidity.sol">Open example in Remix</RemixEmbed>
