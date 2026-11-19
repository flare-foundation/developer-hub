// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { ExtensionBase } from "fcc-extension-scaffold/src/ExtensionBase.sol";
import { ITeeExtensionStateVerifier } from "flare-periphery/src/coston2/ITeeExtensionStateVerifier.sol";

/// @title InstructionSender
/// @notice The direct example's entrypoint contract: its owner sets the admin, whose signed
/// direct actions provision the extension's secrets. The owner also runs hidden auctions in
/// rounds: users bid through it, encrypted to the round's TEE, and anyone submits the winner the
/// TEE signs. It is also the extension's state verifier: a TEE passes its availability checks
/// only while it keeps up with the admins set for it.
/// @dev NOTE: the deployer owns this contract, with the admin, the project fee and its
/// withdrawal, and, through fce deploy, the extension in the registry, which decides what code
/// its machines run. Secure that key, or move both (for example to a multisig), before production.
contract InstructionSender is ExtensionBase, ITeeExtensionStateVerifier {
    /// @notice The extension's op type, the Go side's OPTypeSecrets.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant OP_TYPE_SECRETS = bytes32("SECRETS");

    /// @notice SET_ADMIN, the Go side's OPCommandSetAdmin.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant OP_COMMAND_SET_ADMIN = bytes32("SET_ADMIN");

    /// @notice The auction's op type, the Go side's OPTypeAuction.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant OP_TYPE_AUCTION = bytes32("AUCTION");

    /// @notice START, the Go side's OPCommandStart.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant OP_COMMAND_START = bytes32("START");

    /// @notice BID, the Go side's OPCommandBid.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant OP_COMMAND_BID = bytes32("BID");

    /// @notice END, the Go side's OPCommandEnd.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant OP_COMMAND_END = bytes32("END");

    /// @notice The tag opening every result the TEE signs, the Go side's resultTag: it keeps the
    /// signature from meaning anything else.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant RESULT_TAG = bytes32("AUCTION_RESULT_V1");

    /// @notice Names the state's encoding, abi.encode(uint64 nonce, address admin): the Go side's
    /// stateVersion.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant STATE_VERSION = bytes32("SECRETS_STATE_V1");

    /// @notice How long a TEE may go without applying a setAdmin sent to it. It covers the time
    /// between the TEE reporting its state and the availability proof reaching the chain, under
    /// the registry's challenge window, plus delivery.
    uint256 public constant MAX_STATE_LAG = 2 hours;

    /// @notice The largest ciphertext bid takes, the Go side's maxBidCiphertext: the TEE would
    /// refuse a larger one, and the fee isn't refunded.
    uint256 public constant MAX_BID_SIZE = 369;

    /// @notice How long after a round's last endRound, with no result submitted, the owner may
    /// cancel it.
    uint256 public constant RESULT_TIMEOUT = 1 hours;

    /// @notice An admin setting, as setAdmin sent it.
    struct AdminSetting {
        address admin;
        uint64 sentAt;
    }

    /// @notice The last setAdmin's number; each call takes the next, from 1.
    uint64 public adminNonce;

    /// @notice Each setAdmin's setting, by its number.
    mapping(uint64 nonce => AdminSetting) public adminSettings;

    // the numbers of the setAdmin calls sent to each TEE, increasing
    mapping(address teeId => uint64[]) private sentNonces;

    /// @notice Where a round is: bidding and then waiting for its result are both Open.
    enum Status {
        None,
        Open,
        Settled,
        Cancelled
    }

    /// @notice An auction round: the TEE running it, its deadline, how many bids it took, when the
    /// owner last ended it (0: never), and its winner and the winning amount once settled.
    struct Round {
        address teeId;
        uint64 deadline;
        uint64 bids;
        uint64 endedAt;
        Status status;
        address winner;
        uint256 amount;
    }

    /// @notice The last round's number; each startRound takes the next, from 1.
    uint64 public roundCount;

    /// @notice Each round, by its number.
    mapping(uint64 round => Round) public rounds;

    /// @notice keccak256(abi.encode(bidder, ciphertext)) of each bid, by round and number, so a bid
    /// the pipeline lost can be sent again.
    mapping(uint64 round => mapping(uint64 number => bytes32)) public bidHashes;

    event AdminSent(uint64 indexed nonce, address indexed admin, address[] teeIds);
    event RoundStarted(uint64 indexed round, address teeId, uint64 deadline, bytes32 instructionId);
    event BidPlaced(uint64 indexed round, uint64 number, address indexed bidder, bytes32 instructionId);
    event RoundEnded(uint64 indexed round, uint64 bids, bytes32 instructionId);
    // number 0: the round's start
    event Resent(uint64 indexed round, uint64 number, bytes32 instructionId);
    event RoundSettled(uint64 indexed round, address indexed winner, uint256 amount);
    event RoundCancelled(uint64 indexed round);

    error ZeroPeriod();
    error RoundNotOpen(uint64 round);
    error BiddingClosed(uint64 round, uint64 deadline);
    error BiddingOpen(uint64 round, uint64 deadline);
    error BidTooLarge(uint256 size);
    error NotTheBid(uint64 round, uint64 number);
    error WrongRound(uint64 round);
    error WrongBidCount(uint64 bids, uint64 expected);
    error WrongTee(address signer, address teeId);
    error TooEarlyToCancel(uint64 round, uint256 allowedAfter);

    /// @param _flareTeeManager The FlareTeeManager diamond's address.
    constructor(address _flareTeeManager) ExtensionBase(_flareTeeManager) { }

    /// @notice The price of setAdmin for `_teeIds`.
    function quoteSetAdmin(address[] calldata _teeIds) external view returns (uint256) {
        return _protocolFee(OP_TYPE_SECRETS, OP_COMMAND_SET_ADMIN, _teeIds) + projectFee;
    }

    /// @notice Sets the admin on each of `_teeIds`, which must be distinct; the zero address
    /// removes it. Pay at least quoteSetAdmin(_teeIds); the contract keeps any excess.
    /// @dev Each call is numbered, and a TEE applies only a number above the last it applied: an
    /// instruction can arrive again, or after a newer one. Each TEE keeps the admin in memory:
    /// one that reboots comes back as a new TEE, and needs it again.
    function setAdmin(address _admin, address[] calldata _teeIds)
        external
        payable
        onlyOwner
        chargesFees
        returns (bytes32)
    {
        uint64 nonce = ++adminNonce;
        adminSettings[nonce] = AdminSetting(_admin, uint64(block.timestamp));
        for (uint256 i; i < _teeIds.length; ++i) {
            sentNonces[_teeIds[i]].push(nonce);
        }
        emit AdminSent(nonce, _admin, _teeIds);
        return _send(_teeIds, OP_TYPE_SECRETS, OP_COMMAND_SET_ADMIN, abi.encode(nonce, _admin));
    }

    /// @notice Starts a round, taking bids for `_period` seconds, on a random production TEE of the
    /// extension; bidders encrypt to that TEE's key. Pay at least
    /// quoteFee(OP_TYPE_AUCTION, OP_COMMAND_START); the contract keeps any excess.
    function startRound(uint32 _period) external payable onlyOwner chargesFees returns (uint64 _round) {
        require(_period != 0, ZeroPeriod());
        address[] memory teeIds = _randomTee();
        _round = ++roundCount;
        uint64 deadline = uint64(block.timestamp) + _period;
        rounds[_round] = Round(teeIds[0], deadline, 0, 0, Status.Open, address(0), 0);
        bytes32 id = _send(teeIds, OP_TYPE_AUCTION, OP_COMMAND_START, abi.encode(_round));
        emit RoundStarted(_round, teeIds[0], deadline, id);
    }

    /// @notice Bids in `_round` until its deadline: `_ciphertext` is the bid encrypted to the round's
    /// TEE, in the format the README gives. Pay at least quoteFee(OP_TYPE_AUCTION, OP_COMMAND_BID);
    /// the contract keeps any excess.
    /// @dev The ciphertext stays public on chain; the TEE counts it as invalid unless its plaintext
    /// names the caller and the round. Every valid bid stands: the highest leads.
    function bid(uint64 _round, bytes calldata _ciphertext) external payable chargesFees returns (uint64 _number) {
        Round storage r = _open(_round);
        // a validator moves the timestamp by seconds; bidding takes longer
        // forge-lint: disable-next-line(block-timestamp)
        require(block.timestamp <= r.deadline, BiddingClosed(_round, r.deadline));
        require(_ciphertext.length <= MAX_BID_SIZE, BidTooLarge(_ciphertext.length));
        _number = ++r.bids;
        bidHashes[_round][_number] = keccak256(abi.encode(msg.sender, _ciphertext));
        bytes32 id = _sendTo(r.teeId, OP_COMMAND_BID, abi.encode(_round, _number, msg.sender, _ciphertext));
        emit BidPlaced(_round, _number, msg.sender, id);
    }

    /// @notice Ends `_round` after its deadline: its TEE answers with the winner, signed, for
    /// submitResult, once it has the round's start and every bid. Send it again while the TEE
    /// answers that a bid is missing. Pay at least quoteFee(OP_TYPE_AUCTION, OP_COMMAND_END); the
    /// excess is kept.
    function endRound(uint64 _round) external payable onlyOwner chargesFees returns (bytes32 _instructionId) {
        Round storage r = _open(_round);
        // a validator moves the timestamp by seconds; bidding takes longer
        // forge-lint: disable-next-line(block-timestamp)
        require(block.timestamp > r.deadline, BiddingOpen(_round, r.deadline));
        r.endedAt = uint64(block.timestamp);
        _instructionId = _sendTo(r.teeId, OP_COMMAND_END, abi.encode(_round, r.bids));
        emit RoundEnded(_round, r.bids, _instructionId);
    }

    /// @notice Sends `_round`'s start again, for one the pipeline lost. Pay at least
    /// quoteFee(OP_TYPE_AUCTION, OP_COMMAND_START); the contract keeps any excess.
    function resendStart(uint64 _round) external payable onlyOwner chargesFees returns (bytes32 _instructionId) {
        Round storage r = _open(_round);
        _instructionId = _sendTo(r.teeId, OP_COMMAND_START, abi.encode(_round));
        emit Resent(_round, 0, _instructionId);
    }

    /// @notice Sends bid `_number` of `_round` again, for one the pipeline lost: anyone may, even after
    /// the deadline, with the bid's bidder and ciphertext. Pay at least
    /// quoteFee(OP_TYPE_AUCTION, OP_COMMAND_BID); the contract keeps any excess.
    function resendBid(uint64 _round, uint64 _number, address _bidder, bytes calldata _ciphertext)
        external
        payable
        chargesFees
        returns (bytes32 _instructionId)
    {
        Round storage r = _open(_round);
        require(bidHashes[_round][_number] == keccak256(abi.encode(_bidder, _ciphertext)), NotTheBid(_round, _number));
        _instructionId = _sendTo(r.teeId, OP_COMMAND_BID, abi.encode(_round, _number, _bidder, _ciphertext));
        emit Resent(_round, _number, _instructionId);
    }

    /// @notice Settles `_round`: `_result` is the data of its TEE's answer to endRound,
    /// abi.encode(round, bids, winner, amount, signature). Anyone may submit it, once; the TEE's
    /// signature is the proof. With no valid bid, the winner and the amount are zero.
    function submitResult(uint64 _round, bytes calldata _result) external {
        Round storage r = _open(_round);
        (uint64 resultRound, uint64 bids, address winner, uint256 amount, bytes memory signature) =
            abi.decode(_result, (uint64, uint64, address, uint256, bytes));
        require(resultRound == _round, WrongRound(resultRound));
        require(bids == r.bids, WrongBidCount(bids, r.bids));
        address signer = _teeSigner(resultDigest(_round, bids, winner, amount), signature);
        require(signer == r.teeId, WrongTee(signer, r.teeId));

        r.status = Status.Settled;
        r.winner = winner;
        r.amount = amount;
        emit RoundSettled(_round, winner, amount);
    }

    /// @notice Cancels `_round`: before the owner first ends it, or once RESULT_TIMEOUT has passed
    /// since the last endRound with no result submitted. A cancelled round takes nothing more.
    function cancelRound(uint64 _round) external onlyOwner {
        Round storage r = _open(_round);
        uint256 allowedAfter = uint256(r.endedAt) + RESULT_TIMEOUT;
        // a validator moves the timestamp by seconds; the timeout is an hour
        // forge-lint: disable-next-line(block-timestamp)
        require(r.endedAt == 0 || block.timestamp > allowedAfter, TooEarlyToCancel(_round, allowedAfter));
        r.status = Status.Cancelled;
        emit RoundCancelled(_round);
    }

    /// @notice The keccak256 of the message the TEE signs for a round's outcome:
    /// abi.encode(RESULT_TAG, round, keccak256(abi.encode(bids, winner, amount))).
    function resultDigest(uint64 _round, uint64 _bids, address _winner, uint256 _amount) public pure returns (bytes32) {
        return keccak256(abi.encode(RESULT_TAG, _round, keccak256(abi.encode(_bids, _winner, _amount))));
    }

    /// @notice The registry's check of a TEE's state, at each availability check. The state is
    /// the last setAdmin the TEE applied, (0, 0) before any: it must be one this contract sent
    /// that TEE, and every newer one sent to it must be at most MAX_STATE_LAG old. A TEE whose
    /// state fails can be suspended by anyone.
    /// @dev Returns false on anything else, and never reverts: a revert would block every check
    /// of the machine, suspending it with a proof included.
    function verifyTeeState(address _teeId, bytes32 _stateVersion, bytes calldata _state) external view returns (bool) {
        if (_stateVersion != STATE_VERSION || _state.length != 64) return false;
        uint256 n = uint256(bytes32(_state[:32]));
        uint256 a = uint256(bytes32(_state[32:]));
        if (n > type(uint64).max || a > type(uint160).max) return false;
        // casting is safe: both checked just above
        // forge-lint: disable-next-line(unsafe-typecast)
        uint64 nonce = uint64(n);
        // forge-lint: disable-next-line(unsafe-typecast)
        address admin = address(uint160(a));

        // lo: how many nonces sent to teeId are at most nonce; a binary search keeps the gas
        // bounded however far the TEE lags
        uint64[] storage sent = sentNonces[_teeId];
        uint256 lo;
        uint256 hi = sent.length;
        while (lo < hi) {
            uint256 mid = (lo + hi) / 2;
            if (sent[mid] > nonce) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }

        if (nonce == 0) {
            if (admin != address(0)) return false;
        } else if (lo == 0 || sent[lo - 1] != nonce || adminSettings[nonce].admin != admin) {
            return false;
        }
        // a validator moves the timestamp by seconds; the window is hours
        // forge-lint: disable-next-line(block-timestamp)
        return lo == sent.length || block.timestamp <= adminSettings[sent[lo]].sentAt + MAX_STATE_LAG;
    }

    function _open(uint64 _round) internal view returns (Round storage _r) {
        _r = rounds[_round];
        require(_r.status == Status.Open, RoundNotOpen(_round));
    }

    function _sendTo(address _teeId, bytes32 _opCommand, bytes memory _message) internal returns (bytes32) {
        address[] memory teeIds = new address[](1);
        teeIds[0] = _teeId;
        return _send(teeIds, OP_TYPE_AUCTION, _opCommand, _message);
    }
}
