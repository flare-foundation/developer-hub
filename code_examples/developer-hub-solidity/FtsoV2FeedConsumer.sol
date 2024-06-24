// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

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

contract FtsoV2FeedConsumer {
    IFastUpdater internal ftsoV2;
    // Feed indexes: 0 = FLR/USD, 2 = BTC/USD, 9 = ETH/USD
    uint256[] public feedIndexes = [0, 2, 9];

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
        external
        view
        returns (
            uint256[] memory _feedValues,
            int8[] memory _decimals,
            int64 _timestamp
        )
    {
        (
            uint256[] memory feedValues,
            int8[] memory decimals,
            int64 timestamp
        ) = ftsoV2.fetchCurrentFeeds(feedIndexes);
        /* Your custom feed consumption logic. */
        /* In this example the feed values, decimals and last updated timestamp are just returned. */
        return (feedValues, decimals, timestamp);
    }
}
