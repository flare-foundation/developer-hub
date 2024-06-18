// SPDX-License-Identifier: MIT
pragma solidity <0.9.0;

interface IFastUpdater {
    function fetchCurrentFeeds(uint256[] calldata feedIndexes)
        external
        view
        returns (uint256[] memory feedValues, int8[] memory decimals);
}

/**
 * THIS IS AN EXAMPLE CONTRACT USING HARDCODED VALUES.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract FtsoV2FeedConsumer {
    IFastUpdater internal ftsoV2;
    // Feed indexes: 0 = FLR/USD, 2 = BTC/USD, 9 = ETH/USD
    uint256[] public feedIndexes = [0, 1, 2];

    /**
     * Network: Coston
     * Address: 0x9B931f5d3e24fc8C9064DB35bDc8FB4bE0E862f9
     */
    constructor() {
        ftsoV2 = IFastUpdater(0x9B931f5d3e24fc8C9064DB35bDc8FB4bE0E862f9);
    }

    /**
     * Get the current value of the feeds.
     */
    function getFtsoV2CurrentFeedValues()
        public
        view
        returns (uint256[] memory _feedValues, int8[] memory _decimals)
    {
        return ftsoV2.fetchCurrentFeeds(feedIndexes);
    }
}