---
title: IFdcRequestFeeConfigurations
sidebar_position: 4
description: Interface for managing FDC request fee configuration.
---

import CodeBlock from "@theme/CodeBlock";
import FeeChecker from "!!raw-loader!/examples/developer-hub-solidity/FeeChecker.sol";
import RemixEmbed from "@site/src/components/RemixEmbed";

Interface for managing FDC request fee configuration.

Sourced from `IFdcRequestFeeConfigurations.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFdcRequestFeeConfigurations.sol).

## Overview

The IFdcRequestFeeConfigurations interface provides functionality for managing and retrieving fees associated with attestation requests in the Flare Data Connector (FDC) system.
It allows for querying the base fee required for specific attestation requests.

## Functions

### getRequestFee

Returns the **minimum** base fee (in wei of the network’s native token) required to submit an attestation request to [`FdcHub.requestAttestation`](/fdc/reference/IFdcHub#requestattestation).

The fee is looked up from the **attestation type** and **source** encoded in the first two 32-byte words of `_data` (for example `EVMTransaction` + `testETH`).
The remainder of the ABI-encoded request body does not change the base fee.

Reverts if that type and source pair is not supported (no fee configured).

```solidity
function getRequestFee(
    bytes _data
) external view returns (
    uint256
);
```

**Parameters**

- `_data`: ABI-encoded attestation request (the same `abiEncodedRequest` bytes returned by a verifier `prepareRequest` and later passed to `requestAttestation`)

**Returns**

- `uint256`: Minimum fee in wei.
  Pass at least this amount as `msg.value` when calling `requestAttestation`.
  Paying more than the minimum can increase the chance the request is confirmed in its voting round.
  Fees for confirmed requests are awarded to data providers; fees for unconfirmed requests are burnt.

**See also**

- Manual walkthrough: [FDC by hand — EVMTransaction](/fdc/guides/fdc-by-hand/evm-transaction#get-the-request-fee)
- Resolve the contract via `ContractRegistry.getFdcRequestFeeConfigurations()` or `FdcHub.fdcRequestFeeConfigurations()` rather than hardcoding addresses.

## Events

### TypeAndSourceFeeRemoved

Emitted when a fee configuration for a specific attestation type and source is removed.

```solidity
event TypeAndSourceFeeRemoved(
    bytes32 attestationType,
    bytes32 source
)
```

**Parameters**

- `attestationType`: The type of attestation
- `source`: The source identifier

### TypeAndSourceFeeSet

Emitted when a fee configuration for a specific attestation type and source is set.

```solidity
event TypeAndSourceFeeSet(
    bytes32 attestationType,
    bytes32 source,
    uint256 fee
)
```

**Parameters**

- `attestationType`: The type of attestation
- `source`: The source identifier
- `fee`: The fee amount set for the attestation type and source

## Usage Example

<CodeBlock language="solidity" title="FeeChecker.sol">
  {FeeChecker}
</CodeBlock>
<RemixEmbed fileName="FeeChecker.sol">Open example in Remix</RemixEmbed>
