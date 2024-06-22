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
     * Network: Flare Testnet Coston2
     * Address: 0x58fb598EC6DB6901aA6F26a9A2087E9274128E59
     */
    constructor() {
        ftsoV2 = IFastUpdater(0x58fb598EC6DB6901aA6F26a9A2087E9274128E59);
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