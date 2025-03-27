---
title: IFdcHub
sidebar_position: 2
description: Primary interface for interacting with FDC.
---

Primary interface for interacting with the Flare Data Connector (FDC).

Sourced from `IFdcHub.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFdcHub.sol).

## Overview

The IFdcHub interface serves as the main entry point for applications requesting attestations from the Flare Data Connector. It provides functionality to request attestations, access configuration contracts, and handle related events.

## Functions

### fdcInflationConfigurations

Returns the FDC inflation configurations contract address.

```solidity
function fdcInflationConfigurations(
) external view returns (
    contract IFdcInflationConfigurations
);
```

**Returns**

- `IFdcInflationConfigurations`: Contract interface for accessing inflation configurations

### fdcRequestFeeConfigurations

Returns the FDC request fee configurations contract address.

```solidity
function fdcRequestFeeConfigurations(
) external view returns (
    contract IFdcRequestFeeConfigurations
);
```

**Returns**

- `IFdcRequestFeeConfigurations`: Contract interface for accessing request fee configurations

### requestAttestation

Requests an attestation from the Flare Data Connector.

```solidity
function requestAttestation(
    bytes _data
) external payable;
```

**Parameters**

- `_data`: ABI encoded attestation request

**Note**: This function is payable and requires a fee based on the attestation type.

### requestsOffsetSeconds

Returns the offset (in seconds) for the requests to be processed during the current voting round.

```solidity
function requestsOffsetSeconds(
) external view returns (
    uint8
);
```

**Returns**

- `uint8`: Offset in seconds

## Events

### AttestationRequest

Emitted when an attestation request is submitted.

```solidity
event AttestationRequest(
    bytes data,
    uint256 fee
)
```

**Parameters**

- `data`: The encoded attestation request data
- `fee`: The amount paid for the attestation request

### InflationRewardsOffered

Emitted when inflation rewards are offered.

```solidity
event InflationRewardsOffered(
    uint24 rewardEpochId,
    struct IFdcInflationConfigurations.FdcConfiguration[] fdcConfigurations,
    uint256 amount
)
```

**Parameters**

- `rewardEpochId`: The ID of the reward epoch
- `fdcConfigurations`: Array of FDC configurations
- `amount`: The total amount of rewards offered

### RequestsOffsetSet

Emitted when the requests offset is updated.

```solidity
event RequestsOffsetSet(
    uint8 requestsOffsetSeconds
)
```

**Parameters**

- `requestsOffsetSeconds`: The new offset value in seconds

## Usage Example

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@flare-foundation/flare-smart-contracts-v2/contracts/userInterfaces/IFdcHub.sol";
import "@flare-foundation/flare-smart-contracts-v2/contracts/userInterfaces/fdc/IAddressValidity.sol";

contract AddressValidator {
    IFdcHub private fdcHub;

    constructor(address _fdcHubAddress) {
        fdcHub = IFdcHub(_fdcHubAddress);
    }

    function validateAddress(string memory addressStr, bytes32 sourceId) external payable {
        // Create address validity request
        IAddressValidity.RequestBody memory requestBody = IAddressValidity.RequestBody({
            addressStr: addressStr
        });

        // Encode the full request
        bytes memory encodedRequest = abi.encode(
            bytes32(0x05), // attestationType for AddressValidity
            sourceId,
            bytes32(0), // messageIntegrityCode - should be calculated properly
            requestBody
        );

        // Submit the request with appropriate fee
        fdcHub.requestAttestation{value: msg.value}(encodedRequest);
    }
}
```
