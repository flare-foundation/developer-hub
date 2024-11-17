---
title: IEntityManager
sidebar_position: 1
description: Manages voter entities, including addresses and node IDs.
---

Manages voter entities, including addresses and node IDs.

Sourced from `IEntityManager.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IEntityManager.sol).

## Functions

### confirmDelegationAddressRegistration

Confirms a delegation address registration (called by the delegation address).

```solidity
function confirmDelegationAddressRegistration(
    address _voter
) external;
```

#### Parameters

- `_voter`: Voter address.

### confirmSigningPolicyAddressRegistration

Confirms a signing policy address registration (called by the signing policy address).

```solidity
function confirmSigningPolicyAddressRegistration(
    address _voter
) external;
```

#### Parameters

- `_voter`: Voter address.

### confirmSubmitAddressRegistration

Confirms a submit address registration (called by the submit address).

```solidity
function confirmSubmitAddressRegistration(
    address _voter
) external;
```

#### Parameters

- `_voter`: Voter address.

### confirmSubmitSignaturesAddressRegistration

Confirms a submit signatures address registration (called by the submit signatures address).

```solidity
function confirmSubmitSignaturesAddressRegistration(
    address _voter
) external;
```

#### Parameters

- `_voter`: Voter address.

### getDelegationAddressOf

Gets the delegation address of a voter at the current block number.

```solidity
function getDelegationAddressOf(
    address _voter
) external view returns (
    address
);
```

#### Parameters

- `_voter`: Voter address.

#### Returns

- ``: Public key.

### getDelegationAddressOfAt

Gets the delegation address of a voter at a specific block number.

```solidity
function getDelegationAddressOfAt(
    address _voter,
    uint256 _blockNumber
) external view returns (
    address
);
```

#### Parameters

- `_voter`: Voter address.
- `_blockNumber`: Block number.

#### Returns

- ``: Public key.

### getNodeIdsOf

Gets the node ids of a voter at the current block number.

```solidity
function getNodeIdsOf(
    address _voter
) external view returns (
    bytes20[]
);
```

#### Parameters

- `_voter`: Voter address.

#### Returns

- ``: Node ids.

### getNodeIdsOfAt

Gets the node ids of a voter at a specific block number.

```solidity
function getNodeIdsOfAt(
    address _voter,
    uint256 _blockNumber
) external view returns (
    bytes20[]
);
```

#### Parameters

- `_voter`: Voter address.
- `_blockNumber`: Block number.

#### Returns

- ``: Node ids.

### getPublicKeyOf

Gets the public key of a voter at the current block number.

```solidity
function getPublicKeyOf(
    address _voter
) external view returns (
    bytes32,
    bytes32
);
```

#### Parameters

- `_voter`: Voter address.

#### Returns

- ``: Public key.
- ``:

### getPublicKeyOfAt

Gets the public key of a voter at a specific block number.

```solidity
function getPublicKeyOfAt(
    address _voter,
    uint256 _blockNumber
) external view returns (
    bytes32,
    bytes32
);
```

#### Parameters

- `_voter`: Voter address.
- `_blockNumber`: Block number.

#### Returns

- ``: Public key.
- ``:

### getVoterAddresses

Gets voter's addresses at the current block number.

```solidity
function getVoterAddresses(
    address _voter
) external view returns (
    struct IEntityManager.VoterAddresses _addresses
);
```

#### Parameters

- `_voter`: Voter address.

#### Returns

- `_addresses`: Voter addresses.

### getVoterAddressesAt

Gets voter's addresses at a specific block number.

```solidity
function getVoterAddressesAt(
    address _voter,
    uint256 _blockNumber
) external view returns (
    struct IEntityManager.VoterAddresses _addresses
);
```

#### Parameters

- `_voter`: Voter address.
- `_blockNumber`: Block number.

#### Returns

- `_addresses`: Voter addresses.

### getVoterForDelegationAddress

Gets voter's address for a delegation address at a specific block number.

```solidity
function getVoterForDelegationAddress(
    address _delegationAddress,
    uint256 _blockNumber
) external view returns (
    address _voter
);
```

#### Parameters

- `_delegationAddress`: Delegation address.
- `_blockNumber`: Block number.

#### Returns

- `_voter`: Voter address.

### getVoterForNodeId

Gets voter's address for a node id at a specific block number.

```solidity
function getVoterForNodeId(
    bytes20 _nodeId,
    uint256 _blockNumber
) external view returns (
    address _voter
);
```

#### Parameters

- `_nodeId`: Node id.
- `_blockNumber`: Block number.

#### Returns

- `_voter`: Voter address.

### getVoterForPublicKey

Gets voter's address for a public key at a specific block number.

```solidity
function getVoterForPublicKey(
    bytes32 _part1,
    bytes32 _part2,
    uint256 _blockNumber
) external view returns (
    address _voter
);
```

#### Parameters

- `_part1`: First part of the public key.
- `_part2`: Second part of the public key.
- `_blockNumber`: Block number.

#### Returns

- `_voter`: Voter address.

### getVoterForSigningPolicyAddress

Gets voter's address for a signing policy address at a specific block number.

```solidity
function getVoterForSigningPolicyAddress(
    address _signingPolicyAddress,
    uint256 _blockNumber
) external view returns (
    address _voter
);
```

#### Parameters

- `_signingPolicyAddress`: Signing policy address.
- `_blockNumber`: Block number.

#### Returns

- `_voter`: Voter address.

### getVoterForSubmitAddress

Gets voter's address for a submit address at a specific block number.

```solidity
function getVoterForSubmitAddress(
    address _submitAddress,
    uint256 _blockNumber
) external view returns (
    address _voter
);
```

#### Parameters

- `_submitAddress`: Submit address.
- `_blockNumber`: Block number.

#### Returns

- `_voter`: Voter address.

### getVoterForSubmitSignaturesAddress

Gets voter's address for a submit signatures address at a specific block number.

```solidity
function getVoterForSubmitSignaturesAddress(
    address _submitSignaturesAddress,
    uint256 _blockNumber
) external view returns (
    address _voter
);
```

#### Parameters

- `_submitSignaturesAddress`: Submit signatures address.
- `_blockNumber`: Block number.

#### Returns

- `_voter`: Voter address.

### proposeDelegationAddress

Proposes a delegation address (called by the voter).

```solidity
function proposeDelegationAddress(
    address _delegationAddress
) external;
```

#### Parameters

- `_delegationAddress`: Delegation address.

### proposeSigningPolicyAddress

Proposes a signing policy address (called by the voter).

```solidity
function proposeSigningPolicyAddress(
    address _signingPolicyAddress
) external;
```

#### Parameters

- `_signingPolicyAddress`: Signing policy address.

### proposeSubmitAddress

Proposes a submit address (called by the voter).

```solidity
function proposeSubmitAddress(
    address _submitAddress
) external;
```

#### Parameters

- `_submitAddress`: Submit address.

### proposeSubmitSignaturesAddress

Proposes a submit signatures address (called by the voter).

```solidity
function proposeSubmitSignaturesAddress(
    address _submitSignaturesAddress
) external;
```

#### Parameters

- `_submitSignaturesAddress`: Submit signatures address.

### registerNodeId

Registers a node id.

```solidity
function registerNodeId(
    bytes20 _nodeId,
    bytes _certificateRaw,
    bytes _signature
) external;
```

#### Parameters

- `_nodeId`: Node id.
- `_certificateRaw`: Certificate in raw format.
- `_signature`: Signature.

### registerPublicKey

Registers a public key.

```solidity
function registerPublicKey(
    bytes32 _part1,
    bytes32 _part2,
    bytes _verificationData
) external;
```

#### Parameters

- `_part1`: First part of the public key.
- `_part2`: Second part of the public key.
- `_verificationData`: Additional data used to verify the public key.

### unregisterNodeId

Unregisters a node id.

```solidity
function unregisterNodeId(
    bytes20 _nodeId
) external;
```

#### Parameters

- `_nodeId`: Node id.

### unregisterPublicKey

Unregisters a public key.

```solidity
function unregisterPublicKey(
) external;
```

## Events

### DelegationAddressProposed

Event emitted when a delegation address is proposed.

```solidity
event DelegationAddressProposed(
    address voter,
    address delegationAddress
)
```

### DelegationAddressRegistrationConfirmed

Event emitted when a delegation address registration is confirmed.

```solidity
event DelegationAddressRegistrationConfirmed(
    address voter,
    address delegationAddress
)
```

### MaxNodeIdsPerEntitySet

Event emitted when the maximum number of node ids per entity is set.

```solidity
event MaxNodeIdsPerEntitySet(
    uint256 maxNodeIdsPerEntity
)
```

### NodeIdRegistered

Event emitted when a node id is registered.

```solidity
event NodeIdRegistered(
    address voter,
    bytes20 nodeId
)
```

### NodeIdUnregistered

Event emitted when a node id is unregistered.

```solidity
event NodeIdUnregistered(
    address voter,
    bytes20 nodeId
)
```

### PublicKeyRegistered

Event emitted when a public key is registered.

```solidity
event PublicKeyRegistered(
    address voter,
    bytes32 part1,
    bytes32 part2
)
```

### PublicKeyUnregistered

Event emitted when a public key is unregistered.

```solidity
event PublicKeyUnregistered(
    address voter,
    bytes32 part1,
    bytes32 part2
)
```

### SigningPolicyAddressProposed

Event emitted when a signing policy address is proposed.

```solidity
event SigningPolicyAddressProposed(
    address voter,
    address signingPolicyAddress
)
```

### SigningPolicyAddressRegistrationConfirmed

Event emitted when a signing policy address registration is confirmed.

```solidity
event SigningPolicyAddressRegistrationConfirmed(
    address voter,
    address signingPolicyAddress
)
```

### SubmitAddressProposed

Event emitted when a submit address is proposed.

```solidity
event SubmitAddressProposed(
    address voter,
    address submitAddress
)
```

### SubmitAddressRegistrationConfirmed

Event emitted when a submit address registration is confirmed.

```solidity
event SubmitAddressRegistrationConfirmed(
    address voter,
    address submitAddress
)
```

### SubmitSignaturesAddressProposed

Event emitted when a submit signatures address is proposed.

```solidity
event SubmitSignaturesAddressProposed(
    address voter,
    address submitSignaturesAddress
)
```

### SubmitSignaturesAddressRegistrationConfirmed

Event emitted when a submit signatures address registration is confirmed.

```solidity
event SubmitSignaturesAddressRegistrationConfirmed(
    address voter,
    address submitSignaturesAddress
)
```

## Structures

### VoterAddresses

Voter addresses.

```solidity
struct VoterAddresses {
  address submitAddress;
  address submitSignaturesAddress;
  address signingPolicyAddress;
}
```
