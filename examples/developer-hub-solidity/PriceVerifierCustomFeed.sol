// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IWeb2Json} from "@flarenetwork/flare-periphery-contracts/coston2/IWeb2Json.sol";
import {IICustomFeed} from "@flarenetwork/flare-periphery-contracts/coston2/customFeeds/interfaces/IICustomFeed.sol";

struct PriceData {
    uint256 price;
}

/**
 * @title PriceVerifierCustomFeed
 * @notice An FTSO Custom Feed contract that sources its value from FDC-verified data using Web2Json.
 * @dev Implements the IICustomFeed interface and includes verification logic specific to Web2Json API structure.
 */
contract PriceVerifierCustomFeed is IICustomFeed {
    // --- State Variables ---

    bytes21 public immutable feedIdentifier;
    string public expectedSymbol;
    int8 public decimals_;
    uint256 public latestVerifiedPrice;

    address public owner;
    mapping(bytes32 => string) public symbolToCoinGeckoId;

    // --- Events ---
    event PriceVerified(string indexed symbol, uint256 price, string apiUrl);
    event UrlParsingCheck(string apiUrl, string coinGeckoId, string dateString);
    event CoinGeckoIdMappingSet(bytes32 indexed symbolHash, string coinGeckoId);

    // --- Errors ---
    error InvalidFeedId();
    error InvalidSymbol();
    error UrlCoinGeckoIdMismatchExpected();
    error CoinGeckoIdParsingFailed();
    error UnknownSymbolForCoinGeckoId(); // Kept for direct call if needed, but mapping is primary
    error CoinGeckoIdNotMapped(string symbol);
    error DateStringParsingFailed();
    error InvalidCoinGeckoIdInUrl(
        string url,
        string extractedId,
        string expectedId
    );
    error InvalidProof();

    // --- Constructor ---
    constructor(
        bytes21 _feedId,
        string memory _expectedSymbol,
        int8 _decimals
    ) {
        if (_feedId == bytes21(0)) revert InvalidFeedId();
        if (bytes(_expectedSymbol).length == 0) revert InvalidSymbol();
        if (_decimals < 0) revert InvalidSymbol();

        owner = msg.sender;
        feedIdentifier = _feedId;
        expectedSymbol = _expectedSymbol;
        decimals_ = _decimals;

        // Initialize default CoinGecko IDs
        _setCoinGeckoIdInternal("BTC", "bitcoin");
        _setCoinGeckoIdInternal("ETH", "ethereum");

        // Ensure the expected symbol has a mapping at deployment time
        require(
            bytes(
                symbolToCoinGeckoId[
                    keccak256(abi.encodePacked(_expectedSymbol))
                ]
            ).length > 0,
            "Initial symbol not mapped"
        );
    }

    // --- Owner Functions ---
    /**
     * @notice Allows the owner to add or update a CoinGecko ID mapping for a symbol.
     * @param _symbol The trading symbol (e.g., "LTC").
     * @param _coinGeckoId The corresponding CoinGecko ID (e.g., "litecoin").
     */
    function setCoinGeckoIdMapping(
        string calldata _symbol,
        string calldata _coinGeckoId
    ) external {
        _setCoinGeckoIdInternal(_symbol, _coinGeckoId);
    }

    function _setCoinGeckoIdInternal(
        string memory _symbol,
        string memory _coinGeckoId
    ) internal {
        require(bytes(_symbol).length > 0, "Symbol cannot be empty");
        require(bytes(_coinGeckoId).length > 0, "CoinGecko ID cannot be empty");
        bytes32 symbolHash = keccak256(abi.encodePacked(_symbol));
        symbolToCoinGeckoId[symbolHash] = _coinGeckoId;
        emit CoinGeckoIdMappingSet(symbolHash, _coinGeckoId);
    }

    // --- FDC Verification & Price Logic ---
    /**
     * @notice Verifies the price data proof and stores the price.
     * @dev Uses Web2Json FDC verification. Checks if the symbol in the URL matches expectedSymbol.
     * @param _proof The IWeb2Json.Proof data structure.
     */
    function verifyPrice(IWeb2Json.Proof calldata _proof) external {
        // 1. CoinGecko ID Verification (from URL)
        string memory extractedCoinGeckoId = _extractCoinGeckoIdFromUrl(
            _proof.data.requestBody.url
        );

        string memory expectedCoinGeckoId = symbolToCoinGeckoId[
            keccak256(abi.encodePacked(expectedSymbol))
        ];

        if (bytes(expectedCoinGeckoId).length == 0) {
            revert CoinGeckoIdNotMapped(expectedSymbol);
        }

        if (
            keccak256(abi.encodePacked(extractedCoinGeckoId)) !=
            keccak256(abi.encodePacked(expectedCoinGeckoId))
        ) {
            revert InvalidCoinGeckoIdInUrl(
                _proof.data.requestBody.url,
                extractedCoinGeckoId,
                expectedCoinGeckoId
            );
        }

        // 2. FDC Verification (Web2Json)
        // Aligned with the Web2Json.sol example's pattern
        require(
            ContractRegistry.getFdcVerification().verifyWeb2Json(_proof),
            "FDC: Invalid Web2Json proof"
        );

        // 3. Decode Price Data
        // Path changed to _proof.data.responseBody.abiEncodedData
        PriceData memory newPriceData = abi.decode(
            _proof.data.responseBody.abiEncodedData,
            (PriceData)
        );

        // 4. Store verified data
        latestVerifiedPrice = newPriceData.price;

        // 5. Emit main event
        emit PriceVerified(
            expectedSymbol,
            newPriceData.price,
            _proof.data.requestBody.url // URL from the Web2Json proof
        );
    }

    // --- Custom Feed Logic ---
    function read() public view returns (uint256 value) {
        value = latestVerifiedPrice;
    }

    function feedId() external view override returns (bytes21 _feedId) {
        _feedId = feedIdentifier;
    }

    function calculateFee() external pure override returns (uint256 _fee) {
        return 0;
    }

    function getFeedDataView()
        external
        view
        returns (uint256 _value, int8 _decimals)
    {
        _value = latestVerifiedPrice;
        _decimals = decimals_;
    }

    function getCurrentFeed()
        external
        payable
        override
        returns (uint256 _value, int8 _decimals, uint64 _timestamp)
    {
        _value = latestVerifiedPrice;
        _decimals = decimals_;
        _timestamp = 0;
    }

    function decimals() external view returns (int8) {
        return decimals_;
    }

    // --- Internal Helper Functions To Parse URL---

    /**
     * @notice Helper function to extract a slice of bytes.
     * @param data The original bytes array.
     * @param start The starting index (inclusive).
     * @param end The ending index (exclusive).
     * @return The sliced bytes.
     */
    function slice(
        bytes memory data,
        uint256 start,
        uint256 end
    ) internal pure returns (bytes memory) {
        require(end >= start, "Slice: end before start");
        require(data.length >= end, "Slice: end out of bounds");
        bytes memory result = new bytes(end - start);
        for (uint256 i = start; i < end; i++) {
            result[i - start] = data[i];
        }
        return result;
    }

    /**
     * @notice Extracts the CoinGecko ID from the API URL.
     * @dev It assumes the URL format is like ".../coins/{id}/history..." or ".../coins/{id}"
     * @param _url The full URL string from the proof.
     * @return The extracted CoinGecko ID.
     */
    function _extractCoinGeckoIdFromUrl(
        string memory _url
    ) internal pure returns (string memory) {
        bytes memory urlBytes = bytes(_url);
        bytes memory prefix = bytes("/coins/");
        bytes memory suffix = bytes("/history");

        uint256 startIndex = _indexOf(urlBytes, prefix);
        if (startIndex == type(uint256).max) {
            return ""; // Prefix not found
        }
        startIndex += prefix.length;

        uint256 endIndex = _indexOfFrom(urlBytes, suffix, startIndex);
        if (endIndex == type(uint256).max) {
            // Suffix not found, assume it's the end of the string
            endIndex = urlBytes.length;
        }

        return string(slice(urlBytes, startIndex, endIndex));
    }

    /**
     * @notice Helper to find the first occurrence of a marker in bytes.
     * @param data The bytes data to search in.
     * @param marker The bytes marker to find.
     * @return The starting index of the marker, or type(uint256).max if not found.
     */
    function _indexOf(
        bytes memory data,
        bytes memory marker
    ) internal pure returns (uint256) {
        uint256 dataLen = data.length;
        uint256 markerLen = marker.length;
        if (markerLen == 0 || dataLen < markerLen) return type(uint256).max;

        for (uint256 i = 0; i <= dataLen - markerLen; i++) {
            bool found = true;
            for (uint256 j = 0; j < markerLen; j++) {
                if (data[i + j] != marker[j]) {
                    found = false;
                    break;
                }
            }
            if (found) return i;
        }
        return type(uint256).max;
    }

    /**
     * @notice Helper to find the first occurrence of a marker in bytes, starting from an index.
     * @param data The bytes data to search in.
     * @param marker The bytes marker to find.
     * @param from The index to start searching from.
     * @return The starting index of the marker, or type(uint256).max if not found.
     */
    function _indexOfFrom(
        bytes memory data,
        bytes memory marker,
        uint256 from
    ) internal pure returns (uint256) {
        uint256 dataLen = data.length;
        uint256 markerLen = marker.length;
        if (markerLen == 0 || dataLen < markerLen) return type(uint256).max;

        for (uint256 i = from; i <= dataLen - markerLen; i++) {
            bool found = true;
            for (uint256 j = 0; j < markerLen; j++) {
                if (data[i + j] != marker[j]) {
                    found = false;
                    break;
                }
            }
            if (found) return i;
        }
        return type(uint256).max;
    }
}
