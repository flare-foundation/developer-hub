// SPDX-License-Identifier: MIT
pragma solidity <0.9.0;

interface IFastUpdater {
    function fetchCurrentFeeds(
        uint256[] calldata _feedIndexes
    )
        external
        view
        returns (uint256[] memory _feedValues, int8[] memory _decimals);
}

/**
 * THIS IS AN EXAMPLE CONTRACT USING HARDCODED VALUES.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract FtsoV2FeedChangeQuote {
    IFastUpdater internal ftsoV2;

    /**
     * Network: Coston
     * Address: 0x9B931f5d3e24fc8C9064DB35bDc8FB4bE0E862f9
     */
    constructor() {
        ftsoV2 = IFastUpdater(0x9B931f5d3e24fc8C9064DB35bDc8FB4bE0E862f9);
    }

    function _scaleFeed(
        uint256 _feedValue,
        uint8 _feedDecimals,
        uint8 _decimals
    ) internal pure returns (uint256) {
        if (_feedDecimals < _decimals) {
            return _feedValue * 10 ** uint256(_decimals - _feedDecimals);
        } else if (_feedDecimals > _decimals) {
            return _feedValue / 10 ** uint256(_feedDecimals - _decimals);
        }
        return _feedValue;
    }

    function getNewQuoteFeed(
        uint256[] calldata _baseAndQuoteFeedIndexes,
        uint8 _newQuoteDecimals
    ) public view returns (uint256) {
        require(
            _baseAndQuoteFeedIndexes.length == 2,
            "invalid _baseAndQuoteFeedIndexes, should be of length 2"
        );
        require(
            _newQuoteDecimals > uint8(0) && _newQuoteDecimals <= uint8(18),
            "invalid _newQuoteDecimals, should be between 1 and 18 inclusive"
        );

        (uint256[] memory feedValues, int8[] memory decimals) = ftsoV2
            .fetchCurrentFeeds(_baseAndQuoteFeedIndexes);

        uint256 scaledBaseFeedValue = _scaleFeed(
            feedValues[0],
            uint8(decimals[0]),
            _newQuoteDecimals
        );

        uint256 scaledQuoteFeedValue = _scaleFeed(
            feedValues[1],
            uint8(decimals[1]),
            _newQuoteDecimals
        );
        return (scaledBaseFeedValue * _newQuoteDecimals) / scaledQuoteFeedValue;
    }
}
