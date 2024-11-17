---
title: IRelay
sidebar_position: 4
description: Stores confirmed Merkle roots and signing policies.
---

Stores confirmed Merkle roots and signing policies.

Sourced from `IRelay.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IRelay.sol).

## Functions

### feeCollectionAddress

Returns fee collection address.

```solidity
function feeCollectionAddress(
) external view returns (
    address payable
);
```

### getRandomNumber

Returns the current random number, its timestamp and the flag indicating if it is secure.

```solidity
function getRandomNumber(
) external view returns (
    uint256 _randomNumber,
    bool _isSecureRandom,
    uint256 _randomTimestamp
);
```

#### Returns

- `_randomNumber`: The current random number.
- `_isSecureRandom`: The flag indicating if the random number is secure.
- `_randomTimestamp`: The timestamp of the random number.

### getRandomNumberHistorical

Returns the historical random number for a given \_votingRoundId,
its timestamp and the flag indicating if it is secure.
If no finalization in the \_votingRoundId, the function reverts.

```solidity
function getRandomNumberHistorical(
    uint256 _votingRoundId
) external view returns (
    uint256 _randomNumber,
    bool _isSecureRandom,
    uint256 _randomTimestamp
);
```

#### Parameters

- `_votingRoundId`: The voting round id.

#### Returns

- `_randomNumber`: The current random number.
- `_isSecureRandom`: The flag indicating if the random number is secure.
- `_randomTimestamp`: The timestamp of the random number.

### getVotingRoundId

Returns the voting round id for given timestamp.

```solidity
function getVotingRoundId(
    uint256 _timestamp
) external view returns (
    uint256 _votingRoundId
);
```

#### Parameters

- `_timestamp`: The timestamp.

#### Returns

- `_votingRoundId`: The voting round id.

### governanceFeeSetup

Checks the relay message for sufficient weight of signatures of the hash of the \_config data.
If the check is successful, the relay contract is configured with the new \_config data, which
in particular means that fee configurations are updated.
Otherwise the function reverts.

```solidity
function governanceFeeSetup(
    bytes _relayMessage,
    struct IRelay.RelayGovernanceConfig _config
) external;
```

#### Parameters

- `_relayMessage`: The relay message.
- `_config`: The new relay configuration.

### isFinalized

Returns true if there is finalization for a given protocol id and voting round id.

```solidity
function isFinalized(
    uint256 _protocolId,
    uint256 _votingRoundId
) external view returns (
    bool
);
```

#### Parameters

- `_protocolId`: The protocol id.
- `_votingRoundId`: The voting round id.

### lastInitializedRewardEpochData

Returns last initialized reward epoch data.

```solidity
function lastInitializedRewardEpochData(
) external view returns (
    uint32 _lastInitializedRewardEpoch,
    uint32 _startingVotingRoundIdForLastInitializedRewardEpoch
);
```

#### Returns

- `_lastInitializedRewardEpoch`: Last initialized reward epoch.
- `_startingVotingRoundIdForLastInitializedRewardEpoch`: Starting voting round id for it.

### merkleRoots

Returns the Merkle root for given protocol id and voting round id.
The function is reverted if signingPolicySetter is set, hence on all
deployments where the contract is used as a pure relay.

```solidity
function merkleRoots(
    uint256 _protocolId,
    uint256 _votingRoundId
) external view returns (
    bytes32 _merkleRoot
);
```

#### Parameters

- `_protocolId`: The protocol id.
- `_votingRoundId`: The voting round id.

#### Returns

- `_merkleRoot`: The Merkle root.

### protocolFeeInWei

Returns fee in wei for one verification of a given protocol id.

```solidity
function protocolFeeInWei(
    uint256 _protocolId
) external view returns (
    uint256
);
```

#### Parameters

- `_protocolId`: The protocol id.

### relay

Finalization function for new signing policies and protocol messages.
It can be used as finalization contract on Flare chain or as relay contract on other EVM chain.
Can be called in two modes. It expects calldata that is parsed in a custom manner.
Hence the transaction calls should assemble relevant calldata in the 'data' field.
Depending on the data provided, the contract operations in essentially two modes:
(1) Relaying signing policy. The structure of the calldata is:
function signature (4 bytes) + active signing policy + 0 (1 byte) + new signing policy,
total of exactly 4423 bytes.
(2) Relaying signed message. The structure of the calldata is:
function signature (4 bytes) + signing policy + signed message (38 bytes) + ECDSA signatures with indices (67 bytes each)
This case splits into two subcases: - protocolMessageId = 1: Message id must be of the form (protocolMessageId, 0, 0, merkleRoot).
The validity of the signatures of sufficient weight is checked and if
successful, the merkleRoot from the message is returned (32 bytes) and the
reward epoch id of the signing policy as well (additional 3 bytes) - protocolMessageId > 1: The validity of the signatures of sufficient weight is checked and if
it is valid, the merkleRoot is published for protocolId and votingRoundId.
Reverts if relaying is not successful.

```solidity
function relay(
) external returns (
    bytes
);
```

### startingVotingRoundIds

Returns the start voting round id for given reward epoch id.

```solidity
function startingVotingRoundIds(
    uint256 _rewardEpochId
) external view returns (
    uint256 _startingVotingRoundId
);
```

#### Parameters

- `_rewardEpochId`: The reward epoch id.

#### Returns

- `_startingVotingRoundId`: The start voting round id.

### toSigningPolicyHash

Returns the signing policy hash for given reward epoch id.
The function is reverted if signingPolicySetter is set, hence on all
deployments where the contract is used as a pure relay.

```solidity
function toSigningPolicyHash(
    uint256 _rewardEpochId
) external view returns (
    bytes32 _signingPolicyHash
);
```

#### Parameters

- `_rewardEpochId`: The reward epoch id.

#### Returns

- `_signingPolicyHash`: The signing policy hash.

### verify

Verifies the leaf (or intermediate node) with the Merkle proof against the Merkle root
for given protocol id and voting round id.
A fee may need to be paid. It is protocol specific.
**NOTE:** Overpayment is not refunded.

```solidity
function verify(
    uint256 _protocolId,
    uint256 _votingRoundId,
    bytes32 _leaf,
    bytes32[] _proof
) external payable returns (
    bool
);
```

#### Parameters

- `_protocolId`: The protocol id.
- `_votingRoundId`: The voting round id.
- `_leaf`: The leaf (or intermediate node) to verify.
- `_proof`: The Merkle proof.

#### Returns

- ``: True if the verification is successful.

### verifyCustomSignature

Checks the relay message for sufficient weight of signatures for the \_messageHash
signed for protocol message Merkle root of the form (1, 0, 0, \_messageHash).
If the check is successful, reward epoch id of the signing policy is returned.
Otherwise the function reverts.

```solidity
function verifyCustomSignature(
    bytes _relayMessage,
    bytes32 _messageHash
) external returns (
    uint256 _rewardEpochId
);
```

#### Parameters

- `_relayMessage`: The relay message.
- `_messageHash`: The hash of the message.

#### Returns

- `_rewardEpochId`: The reward epoch id of the signing policy.

## Events

### ProtocolMessageRelayed

```solidity
event ProtocolMessageRelayed(
    uint8 protocolId,
    uint32 votingRoundId,
    bool isSecureRandom,
    bytes32 merkleRoot
)
```

### SigningPolicyInitialized

```solidity
event SigningPolicyInitialized(
    uint24 rewardEpochId,
    uint32 startVotingRoundId,
    uint16 threshold,
    uint256 seed,
    address[] voters,
    uint16[] weights,
    bytes signingPolicyBytes,
    uint64 timestamp
)
```

### SigningPolicyRelayed

```solidity
event SigningPolicyRelayed(
    uint256 rewardEpochId
)
```

## Structures

### FeeConfig

```solidity
struct FeeConfig {
  uint8 protocolId;
  uint256 feeInWei;
}
```

### RelayGovernanceConfig

```solidity
struct RelayGovernanceConfig {
  bytes32 descriptionHash;
  uint256 chainId;
  struct IRelay.FeeConfig[] newFeeConfigs;
}
```

### RelayInitialConfig

```solidity
struct RelayInitialConfig {
  uint32 initialRewardEpochId;
  uint32 startingVotingRoundIdForInitialRewardEpochId;
  bytes32 initialSigningPolicyHash;
  uint8 randomNumberProtocolId;
  uint32 firstVotingRoundStartTs;
  uint8 votingEpochDurationSeconds;
  uint32 firstRewardEpochStartVotingRoundId;
  uint16 rewardEpochDurationInVotingEpochs;
  uint16 thresholdIncreaseBIPS;
  uint32 messageFinalizationWindowInRewardEpochs;
  address payable feeCollectionAddress;
  struct IRelay.FeeConfig[] feeConfigs;
}
```
