---
title: IFdcRequestFeeConfigurations
sidebar_position: 4
description: Interface for managing FDC request fee configuration.
---

Interface for managing FDC request fee configuration.

Sourced from `IFdcRequestFeeConfigurations.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFdcRequestFeeConfigurations.sol).

## Overview

The IFdcRequestFeeConfigurations interface provides functionality for managing and retrieving fees associated with attestation requests in the Flare Data Connector (FDC) system. It allows for querying the base fee required for specific attestation requests.

## Functions

### getRequestFee

Method to get the base fee for an attestation request. It reverts if the request is not supported.

```solidity
function getRequestFee(
    bytes _data
) external view returns (
    uint256
);
```

**Parameters**

- `_data`: ABI encoded attestation request

**Returns**

- `uint256`: The base fee required for the specified attestation request

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

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@flare-foundation/flare-smart-contracts-v2/contracts/userInterfaces/IFdcHub.sol";
import "@flare-foundation/flare-smart-contracts-v2/contracts/userInterfaces/IFdcRequestFeeConfigurations.sol";

contract FeeChecker {
    IFdcHub private fdcHub;
    IFdcRequestFeeConfigurations private feeConfigs;

    constructor(address _fdcHubAddress) {
        fdcHub = IFdcHub(_fdcHubAddress);
        feeConfigs = fdcHub.fdcRequestFeeConfigurations();
    }

    function checkRequestFee(bytes memory attestationData) external view returns (uint256) {
        // Get the fee required for this attestation request
        return feeConfigs.getRequestFee(attestationData);
    }

    function submitRequestWithFee(bytes memory attestationData) external payable {
        // Check if enough fee is provided
        uint256 requiredFee = feeConfigs.getRequestFee(attestationData);
        require(msg.value >= requiredFee, "Insufficient fee");

        // Submit the attestation request
        fdcHub.requestAttestation{value: msg.value}(attestationData);
    }
}
```
