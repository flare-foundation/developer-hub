---
title: IPollingFtso
---

Sourced from `IPollingFtso.sol` on [GitHub](https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main/contracts/userInterfaces/IPollingFtso.sol).

## Functions

### canPropose

Returns whether an account can create proposals.
An address can make proposals if it is registered voter,
its proxy or the maintainer of the contract.

```solidity
function canPropose(
    address _account
) external view returns (
    bool
);
```

#### Parameters

- `_account`: Address of the queried account.

#### Returns

- ``: True if the queried account can create a proposal, false otherwise.

### canVote

Returns whether an account can vote for a given proposal.

```solidity
function canVote(
    address _account,
    uint256 _proposalId
) external view returns (
    bool
);
```

#### Parameters

- `_account`: Address of the queried account.
- `_proposalId`: Id of the queried proposal.

#### Returns

- ``: True if account is eligible to vote, false otherwise.

### cancel

Cancels an existing proposal.

```solidity
function cancel(
    uint256 _proposalId
) external;
```

#### Parameters

- `_proposalId`: Unique identifier of a proposal. Emits a ProposalCanceled event.

### castVote

Casts a vote on a proposal.

```solidity
function castVote(
    uint256 _proposalId,
    uint8 _support
) external;
```

#### Parameters

- `_proposalId`: Id of the proposal.
- `_support`: A value indicating vote type (against, for). Emits a VoteCast event.

### getLastProposal

Returns id and description of the last created proposal.

```solidity
function getLastProposal(
) external view returns (
    uint256 _proposalId,
    string _description
);
```

#### Returns

- `_proposalId`: Id of the last proposal.
- `_description`: Description of the last proposal.

### getProposalDescription

Returns the description string that was supplied when the specified proposal was created.

```solidity
function getProposalDescription(
    uint256 _proposalId
) external view returns (
    string _description
);
```

#### Parameters

- `_proposalId`: Id of the proposal.

#### Returns

- `_description`: Description of the proposal.

### getProposalInfo

Returns information about the specified proposal.

```solidity
function getProposalInfo(
    uint256 _proposalId
) external view returns (
    uint256 _rewardEpochId,
    string _description,
    address _proposer,
    uint256 _voteStartTime,
    uint256 _voteEndTime,
    uint256 _thresholdConditionBIPS,
    uint256 _majorityConditionBIPS,
    uint256 _totalWeight
);
```

#### Parameters

- `_proposalId`: Id of the proposal.

#### Returns

- `_rewardEpochId`: Reward epoch id.
- `_description`: Description of the proposal.
- `_proposer`: Address of the proposal submitter.
- `_voteStartTime`: Start time (in seconds from epoch) of the proposal voting.
- `_voteEndTime`: End time (in seconds from epoch) of the proposal voting.
- `_thresholdConditionBIPS`: Number of votes (voter power) cast required for the proposal to pass.
- `_majorityConditionBIPS`: Number of FOR votes, as a percentage in BIPS of the.
- `_totalWeight`: Total weight of all eligible voters.

### getProposalVotes

Returns number of votes for and against the specified proposal.

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

### hasVoted

Returns whether a voter has cast a vote on a specific proposal.

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

### propose

Creates a new proposal.

```solidity
function propose(
    string _description
) external payable returns (
    uint256
);
```

#### Parameters

- `_description`: String description of the proposal.

#### Returns

- ``: \_proposalId Unique identifier of the proposal. Emits a FtsoProposalCreated event.

### setParameters

Sets (or changes) contract's parameters. It is called after deployment of the contract
and every time one of the parameters changes.

```solidity
function setParameters(
    uint256 _votingDelaySeconds,
    uint256 _votingPeriodSeconds,
    uint256 _thresholdConditionBIPS,
    uint256 _majorityConditionBIPS,
    uint256 _proposalFeeValueWei
) external;
```

#### Parameters

- `_votingDelaySeconds`: Period between proposal creation and start of the vote, in seconds.
- `_votingPeriodSeconds`: Length of voting period, in seconds.
- `_thresholdConditionBIPS`: Share of total vote power (in BIPS) required to participate in vote for proposal to pass.
- `_majorityConditionBIPS`: Share of participating vote power (in BIPS) required to vote in favor.
- `_proposalFeeValueWei`: Fee value (in wei) that proposer must pay to submit a proposal.

### setProxyVoter

Sets a proxy voter for a voter (i.e. address that can vote in its name).

```solidity
function setProxyVoter(
    address _proxyVoter
) external;
```

#### Parameters

- `_proxyVoter`: Address to register as a proxy (use address(0) to remove proxy). Emits a ProxyVoterSet event.

### state

Returns the current state of a proposal.

```solidity
function state(
    uint256 _proposalId
) external view returns (
    enum IPollingFtso.ProposalState
);
```

#### Parameters

- `_proposalId`: Id of the proposal.

#### Returns

- ``: ProposalState enum.

## Events

### FtsoProposalCreated

Event emitted when a proposal is created.

```solidity
event FtsoProposalCreated(
    uint256 proposalId,
    uint256 rewardEpochId,
    address proposer,
    string description,
    uint256 voteStartTime,
    uint256 voteEndTime,
    uint256 threshold,
    uint256 majorityConditionBIPS,
    uint256 totalWeight
)
```

### MaintainerSet

Event emitted when maintainer is set.

```solidity
event MaintainerSet(
    address newMaintainer
)
```

### ParametersSet

Event emitted when parameters are set.

```solidity
event ParametersSet(
    uint256 votingDelaySeconds,
    uint256 votingPeriodSeconds,
    uint256 thresholdConditionBIPS,
    uint256 majorityConditionBIPS,
    uint256 proposalFeeValueWei
)
```

### ProposalCanceled

Event emitted when a proposal is canceled.

```solidity
event ProposalCanceled(
    uint256 proposalId
)
```

### ProxyVoterSet

Event emitted when proxy voter is set.

```solidity
event ProxyVoterSet(
    address account,
    address proxyVoter
)
```

### VoteCast

Event emitted when a vote is cast.

```solidity
event VoteCast(
    address voter,
    uint256 proposalId,
    uint8 support,
    uint256 forVotePower,
    uint256 againstVotePower
)
```

## Structures

### Proposal

Struct holding the information about proposal properties.

```solidity
struct Proposal {
  uint256 rewardEpochId;
  string description;
  address proposer;
  bool canceled;
  uint256 voteStartTime;
  uint256 voteEndTime;
  uint256 thresholdConditionBIPS;
  uint256 majorityConditionBIPS;
  uint256 totalWeight;
}
```

### ProposalVoting

Struct holding the information about proposal voting.

```solidity
struct ProposalVoting {
  uint256 againstVotePower;
  uint256 forVotePower;
  mapping(address => bool) hasVoted;
}
```

## Enums

### ProposalState

Enum describing a proposal state.

```solidity
enum ProposalState {
  Canceled,
  Pending,
  Active,
  Defeated,
  Succeeded
}
```

Enum describing a proposal state.

### VoteType

Enum that determines vote (support) type.
0 = Against, 1 = For.

```solidity
enum VoteType {
  Against,
  For
}
```

Enum that determines vote (support) type.
0 = Against, 1 = For.
