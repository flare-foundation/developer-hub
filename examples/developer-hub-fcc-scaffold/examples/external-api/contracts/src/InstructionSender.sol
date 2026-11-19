// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { ExtensionBase } from "fcc-extension-scaffold/src/ExtensionBase.sol";

/// @title InstructionSender
/// @notice The external-api example's entrypoint contract: anyone may ask for a price, which the
/// TEE fetches from several public APIs and answers as their median, signed; anyone may then
/// submit the signed answer, and the contract keeps the latest price per pair.
/// @dev WARNING: an example, not a production oracle. One TEE answers each request, and its
/// operator sees the price first and may withhold it. A price may be up to MAX_PRICE_DELAY old
/// when stored, and ages from there: consumers check requestedAt.
/// NOTE: the deployer owns this contract, with the project fee and its withdrawal, and,
/// through fce deploy, the extension in the registry, which decides what code its machines run.
/// Secure that key, or move both (for example to a multisig), before production.
contract InstructionSender is ExtensionBase {
    /// @notice The extension's op type, the Go side's OPTypePrices.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant OP_TYPE_PRICES = bytes32("PRICES");

    /// @notice GET_PRICE, the Go side's OPCommandGetPrice.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant OP_COMMAND_GET_PRICE = bytes32("GET_PRICE");

    /// @notice The tag opening every price the TEE signs, the Go side's priceTag: it keeps the
    /// signature from meaning anything else.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant PRICE_TAG = bytes32("PRICES_PRICE_V1");

    /// @notice How long after its request a price may be submitted, in chain time. The TEE fetched
    /// it between the two blocks, so it bounds how long the operator can hold a request back.
    uint256 public constant MAX_PRICE_DELAY = 10 minutes;

    /// @notice A getPrice waiting for its signed answer.
    struct Request {
        bytes32 pairHash;
        address teeId;
        uint64 requestedAt;
    }

    /// @notice A pair's latest price: an integer with `decimals` decimals, the median of `sources`
    /// sources, requested at `requestedAt` and fetched at most MAX_PRICE_DELAY later.
    struct Price {
        uint256 price;
        uint8 decimals;
        uint8 sources;
        uint64 requestedAt;
    }

    /// @notice The requests waiting for an answer, by instruction id.
    mapping(bytes32 instructionId => Request) public requests;

    mapping(bytes32 pairHash => Price) internal latest;

    event PriceRequested(bytes32 indexed instructionId, string pair, address teeId);
    event PriceSubmitted(bytes32 indexed instructionId, string pair, uint256 price, uint64 requestedAt);

    error UnknownRequest(bytes32 instructionId);
    error TooLate(bytes32 instructionId, uint256 deadline);
    error WrongPair(bytes32 instructionId);
    error WrongTee(address signer, address teeId);

    /// @param _flareTeeManager The FlareTeeManager diamond's address.
    constructor(address _flareTeeManager) ExtensionBase(_flareTeeManager) { }

    /// @notice Asks for `_pair`'s price, such as "BTC/USD". Pay at least
    /// quoteFee(OP_TYPE_PRICES, OP_COMMAND_GET_PRICE); the contract keeps any excess.
    /// @dev One random TEE answers, on its proxy: a partial result per source, then the signed
    /// median, for submitPrice. It refuses a pair it doesn't price; the contract leaves that check
    /// to it.
    function getPrice(string calldata _pair) external payable chargesFees returns (bytes32 _instructionId) {
        address[] memory teeIds = _randomTee();
        _instructionId = _send(teeIds, OP_TYPE_PRICES, OP_COMMAND_GET_PRICE, abi.encode(_pair));
        requests[_instructionId] = Request(keccak256(bytes(_pair)), teeIds[0], uint64(block.timestamp));
        emit PriceRequested(_instructionId, _pair, teeIds[0]);
    }

    /// @notice Stores a signed price: `_result` is the data of the TEE's final answer to
    /// `_instructionId`, abi.encode(pair, price, decimals, sources, signature). Anyone may submit
    /// it, once, within MAX_PRICE_DELAY of the request; the TEE's signature is the proof.
    /// @dev An answer to an older request than the stored price's is accepted but not stored.
    function submitPrice(bytes32 _instructionId, bytes calldata _result) external {
        Request memory r = requests[_instructionId];
        require(r.teeId != address(0), UnknownRequest(_instructionId));
        uint256 deadline = r.requestedAt + MAX_PRICE_DELAY;
        // a validator moves the timestamp by seconds; the window is minutes
        // forge-lint: disable-next-line(block-timestamp)
        require(block.timestamp <= deadline, TooLate(_instructionId, deadline));

        (string memory pair, uint256 price, uint8 decimals, uint8 sources, bytes memory signature) =
            abi.decode(_result, (string, uint256, uint8, uint8, bytes));
        require(keccak256(bytes(pair)) == r.pairHash, WrongPair(_instructionId));
        address signer = _teeSigner(priceDigest(_instructionId, pair, price, decimals, sources), signature);
        require(signer == r.teeId, WrongTee(signer, r.teeId));

        delete requests[_instructionId];
        if (r.requestedAt >= latest[r.pairHash].requestedAt) {
            latest[r.pairHash] = Price(price, decimals, sources, r.requestedAt);
        }
        emit PriceSubmitted(_instructionId, pair, price, r.requestedAt);
    }

    /// @notice `_pair`'s latest stored price; all zero if none. Check requestedAt: the price is
    /// as old as it says, and older by up to MAX_PRICE_DELAY.
    function latestPrice(string calldata _pair) external view returns (Price memory) {
        return latest[keccak256(bytes(_pair))];
    }

    /// @notice The keccak256 of the message the TEE signs for a price:
    /// abi.encode(PRICE_TAG, instructionId, keccak256(abi.encode(pair, price, decimals, sources))).
    function priceDigest(bytes32 _instructionId, string memory _pair, uint256 _price, uint8 _decimals, uint8 _sources)
        public
        pure
        returns (bytes32)
    {
        return
            keccak256(abi.encode(PRICE_TAG, _instructionId, keccak256(abi.encode(_pair, _price, _decimals, _sources))));
    }
}
