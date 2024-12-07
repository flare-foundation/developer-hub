---
title: IFdcHub
sidebar_position: 2
description: Primary interface for interacting with FDC.
---

Primary interface for interacting with FDC.

Sourced from `IFdcHub.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IFdcHub.sol).

## Functions

### fdcInflationConfigurations

The FDC inflation configurations contract.

```solidity
function fdcInflationConfigurations(
) external view returns (
    contract IFdcInflationConfigurations
);
```

### fdcRequestFeeConfigurations

The FDC request fee configurations contract.

```solidity
function fdcRequestFeeConfigurations(
) external view returns (
    contract IFdcRequestFeeConfigurations
);
```

### requestAttestation

Method to request an attestation.

```solidity
function requestAttestation(
    bytes _data
) external payable;
```

#### Parameters

- `_data`: ABI encoded attestation request

### requestsOffsetSeconds

The offset (in seconds) for the requests to be processed during the current voting round.

```solidity
function requestsOffsetSeconds(
) external view returns (
    uint8
);
```

## Events

### AttestationRequest

```solidity
event AttestationRequest(
    bytes data,
    uint256 fee
)
```

### InflationRewardsOffered

Event emitted when inflation rewards are offered.

```solidity
event InflationRewardsOffered(
    uint24 rewardEpochId,
    struct IFdcInflationConfigurations.FdcConfiguration[] fdcConfigurations,
    uint256 amount
)
```

### RequestsOffsetSet

```solidity
event RequestsOffsetSet(
    uint8 requestsOffsetSeconds
)
```
