// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IFastUpdater {
    function fetchCurrentFeeds(
        uint256[] calldata _feedIndexes
    )
        external
        view
        returns (
            uint256[] memory _feedValues,
            int8[] memory _decimals,
            int64 _timestamp
        );
}

/**
 * THIS IS AN EXAMPLE CONTRACT USING HARDCODED VALUES.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract FtsoV2ChangeQuoteFeed {
    IFastUpdater internal ftsoV2;

    /**
     * Network: Songbird Testnet Coston
     * Address: 0x9B931f5d3e24fc8C9064DB35bDc8FB4bE0E862f9
     */
    constructor() {
        ftsoV2 = IFastUpdater(0x9B931f5d3e24fc8C9064DB35bDc8FB4bE0E862f9);
    }

    /**
     * @dev Internal function to scale the base feed value to match the decimals of the quote feed.
     */
    function _scaleBaseFeedValue(
        uint256 _baseFeedValue,
        uint8 _baseFeedDecimals,
        uint8 _quoteDecimals
    ) internal pure returns (uint256) {
        if (_baseFeedDecimals < _quoteDecimals) {
            // Scale up if base feed decimals are less than quote feed decimals
            return
                _baseFeedValue *
                10 ** uint256(_quoteDecimals - _baseFeedDecimals);
        } else if (_baseFeedDecimals > _quoteDecimals) {
            // Scale down if base feed decimals are more than quote feed decimals
            return
                _baseFeedValue /
                10 ** uint256(_baseFeedDecimals - _quoteDecimals);
        } else {
            // No scaling needed if decimals are equal
            return _baseFeedValue;
        }
    }

    /**
     * @dev Function to compute the new quote feed value based on the base and quote feed values.
     * @param _baseAndQuoteFeedIndexes Array containing the indexes of the base and quote feeds.
     * @return The computed new quote feed value.
     */
    function getNewQuoteFeedValue(
        uint256[] calldata _baseAndQuoteFeedIndexes
    ) external view returns (uint256) {
        require(
            _baseAndQuoteFeedIndexes.length == 2,
            "Invalid feed indexes. Please provide exactly two indexes."
        );
        // Fetch current feeds
        (uint256[] memory feedValues, int8[] memory decimals, ) = ftsoV2
            .fetchCurrentFeeds(_baseAndQuoteFeedIndexes);
        uint8 newQuoteDecimals = uint8(decimals[1]);
        // Scale the base feed value to match the quote feed decimals
        uint256 scaledBaseFeedValue = _scaleBaseFeedValue(
            feedValues[0],
            uint8(decimals[0]),
            newQuoteDecimals
        );
        // Prevent division by zero
        require(feedValues[1] != 0, "Division by zero");
        // Compute the new quote feed value
        uint256 newQuoteFeedValue = (scaledBaseFeedValue *
            10 ** uint256(newQuoteDecimals)) / feedValues[1];
        return newQuoteFeedValue;
    }
}
