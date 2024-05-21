---
title: IGovernor
---

Governor interface.
Sourced from `IGovernor.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IGovernor.sol).

## Functions

### cancel

Cancels a proposal.

```solidity
function cancel(
    uint256 _proposalId
) external;
```

#### Parameters

- `_proposalId`: Unique identifier obtained by hashing proposal data. Emits a ProposalCanceled event

### castVote

Casts a vote on a proposal.

```solidity
function castVote(
    uint256 _proposalId,
    uint8 _support
) external returns (
    uint256
);
```

#### Parameters

- `_proposalId`: Id of the proposal.
- `_support`: A value indicating vote type (against, for).

#### Returns

- ``: Vote power of the cast vote. Emits a VoteCast event.

### castVoteBySig

Casts a vote on a proposal using the user cryptographic signature.

```solidity
function castVoteBySig(
    uint256 _proposalId,
    uint8 _support,
    uint8 _v,
    bytes32 _r,
    bytes32 _s
) external returns (
    uint256
);
```

#### Parameters

- `_proposalId`: Id of the proposal.
- `_support`: A value indicating vote type (against, for).
- `_v`: v part of the signature.
- `_r`: r part of the signature.
- `_s`: s part of the signature. Emits a VoteCast event.

### castVoteWithReason

Casts a vote on a proposal with a reason.

```solidity
function castVoteWithReason(
    uint256 _proposalId,
    uint8 _support,
    string _reason
) external returns (
    uint256
);
```

#### Parameters

- `_proposalId`: Id of the proposal.
- `_support`: A value indicating vote type (against, for).
- `_reason`: Vote reason.

#### Returns

- ``: Vote power of the cast vote. Emits a VoteCast event.

### execute

Executes a successful proposal without execution parameters.

```solidity
function execute(
    uint256 _proposalId
) external;
```

#### Parameters

- `_proposalId`: Id of the proposal. Emits a ProposalExecuted event.

### execute

Executes a successful proposal.

```solidity
function execute(
    uint256 _proposalId,
    address[] _targets,
    uint256[] _values,
    bytes[] _calldatas
) external payable;
```

#### Parameters

- `_proposalId`: Id of the proposal.
- `_targets`: Array of target addresses on which the calls are to be invoked.
- `_values`: Array of values with which the calls are to be invoked.
- `_calldatas`: Array of call data to be invoked. Emits a ProposalExecuted event.

### getProposalId

Returns proposal id determined by hashing proposal data.

```solidity
function getProposalId(
    address[] _targets,
    uint256[] _values,
    bytes[] _calldatas,
    string _description
) external view returns (
    uint256
);
```

#### Parameters

- `_targets`: Array of target addresses on which the calls are to be invoked.
- `_values`: Array of values with which the calls are to be invoked.
- `_calldatas`: Array of call data to be invoked.
- `_description`: Description of the proposal.

#### Returns

- ``: Proposal id.

### getProposalIds

Returns the list of proposal ids.

```solidity
function getProposalIds(
) external view returns (
    uint256[]
);
```

### getProposalInfo

Returns information of the specified proposal.

```solidity
function getProposalInfo(
    uint256 _proposalId
) external view returns (
    address _proposer,
    bool _accept,
    uint256 _votePowerBlock,
    uint256 _voteStartTime,
    uint256 _voteEndTime,
    uint256 _execStartTime,
    uint256 _execEndTime,
    uint256 _thresholdConditionBIPS,
    uint256 _majorityConditionBIPS,
    uint256 _circulatingSupply,
    string _description
);
```

#### Parameters

- `_proposalId`: Id of the proposal.

#### Returns

- `_proposer`: Address of the proposal submitter.
- `_accept`: Type of the proposal - accept or reject.
- `_votePowerBlock`: Block number used to determine the vote powers in voting process.
- `_voteStartTime`: Start time (in seconds from epoch) of the proposal voting.
- `_voteEndTime`: End time (in seconds from epoch) of the proposal voting.
- `_execStartTime`: Start time (in seconds from epoch) of the proposal execution window.
- `_execEndTime`: End time (in seconds from epoch) of the proposal exectuion window.
- `_thresholdConditionBIPS`: Percentage in BIPS of the total vote power required for proposal "quorum".
- `_majorityConditionBIPS`: Percentage in BIPS of the proper relation between FOR and AGAINST votes.
- `_circulatingSupply`: Circulating supply at votePowerBlock.
- `_description`: Description of the proposal.

### getProposalVotes

Returns votes (for, against) of the specified proposal.

```solidity
function getProposalVotes(
    uint256 _proposalId
) external view returns (
    uint256 _for,
    uint256 _against
);
```

#### Parameters

- `_proposalId`: Id of the proposal.

#### Returns

- `_for`: Accumulated vote power for the proposal.
- `_against`: Accumulated vote power against the proposal.

### getVotes

Returns the vote power of a voter at a specific block number.

```solidity
function getVotes(
    address _voter,
    uint256 _blockNumber
) external view returns (
    uint256
);
```

#### Parameters

- `_voter`: Address of the voter.
- `_blockNumber`: The block number.

#### Returns

- ``: Vote power of the voter at the block number.

### hasVoted

Returns information if a voter has cast a vote on a specific proposal.

```solidity
function hasVoted(
    uint256 _proposalId,
    address _voter
) external view returns (
    bool
);
```

#### Parameters

- `_proposalId`: Id of the proposal.
- `_voter`: Address of the voter.

#### Returns

- ``: True if the voter has cast a vote on the proposal, and false otherwise.

### state

Returns the current state of a proposal.

```solidity
function state(
    uint256 _proposalId
) external view returns (
    enum IGovernor.ProposalState
);
```

#### Parameters

- `_proposalId`: Id of the proposal.

#### Returns

- ``: ProposalState enum.

## Events

### ProposalCanceled

Event emitted when a proposal is canceled.

```solidity
event ProposalCanceled(
    uint256 proposalId
)
```

### ProposalCreated

Event emitted when a proposal is created.

```solidity
event ProposalCreated(
    uint256 proposalId,
    address proposer,
    address[] targets,
    uint256[] values,
    bytes[] calldatas,
    string description,
    bool accept,
    uint256[2] voteTimes,
    uint256[2] executionTimes,
    uint256 votePowerBlock,
    uint256 thresholdConditionBIPS,
    uint256 majorityConditionBIPS,
    uint256 circulatingSupply
)
```

### ProposalExecuted

Event emitted when a proposal is executed.

```solidity
event ProposalExecuted(
    uint256 proposalId
)
```

### VoteCast

Event emitted when a vote is cast.

```solidity
event VoteCast(
    address voter,
    uint256 proposalId,
    uint8 support,
    uint256 votePower,
    string reason,
    uint256 forVotePower,
    uint256 againstVotePower
)
```

## Structures

### GovernorSettings

```solidity
struct GovernorSettings {
  bool accept;
  uint256 votingStartTs;
  uint256 votingPeriodSeconds;
  uint256 vpBlockPeriodSeconds;
  uint256 thresholdConditionBIPS;
  uint256 majorityConditionBIPS;
  uint256 executionDelaySeconds;
  uint256 executionPeriodSeconds;
}
```

## Enums

### ProposalState

Enum describing a proposal state.

A proposal is:

- `Pending` when first created,
- `Active` when it’s being voted on,
- `Defeated` or `Succeeded` as a result of the vote,
- `Queued` when in the process of executing,
- `Expired` when it times out or fails to execute upon a certain date, and
- `Executed` when it goes live.

```solidity
enum ProposalState {
  Pending,
  Active,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
  Canceled
}
```

Enum describing a proposal state.
A proposal is:

- `Pending` when first created,
- `Active` when it’s being voted on,
- `Defeated` or `Succeeded` as a result of the vote,
- `Queued` when in the process of executing,
- `Expired` when it times out or fails to execute upon a certain date, and
- `Executed` when it goes live.
