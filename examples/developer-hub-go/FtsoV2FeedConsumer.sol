// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IFlareContractRegistry {
    function getContractAddressByName(
        string calldata _name
    ) external view returns (address);
}

interface IFastUpdater {
    function fetchCurrentFeeds(
        uint256[] calldata _feedIndexes
    )
        external
        view
        returns (
            uint256[] memory _feedValues,
            int8[] memory _decimals,
            uint64 _timestamp
        );
}

/**
 * THIS IS AN EXAMPLE CONTRACT USING HARDCODED VALUES.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract FtsoV2FeedConsumer {
    IFlareContractRegistry internal contractRegistry;
    IFastUpdater internal ftsoV2;
    // Feed indexes: 0 = FLR/USD, 2 = BTC/USD, 9 = ETH/USD
    uint256[] public feedIndexes = [0, 2, 9];

    /**
     * Constructor initializes the contract registry and fetches the FTSOv2 contract address.
     */
    constructor() {
        contractRegistry = IFlareContractRegistry(
            0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019
        );
        ftsoV2 = IFastUpdater(
            contractRegistry.getContractAddressByName("FastUpdater")
        );
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
            uint64 _timestamp
        )
    {
        (
            uint256[] memory feedValues,
            int8[] memory decimals,
            uint64 timestamp
        ) = ftsoV2.fetchCurrentFeeds(feedIndexes);
        /* Your custom feed consumption logic. */
        /* In this example the feed values, decimals and last updated timestamp are just returned. */
        return (feedValues, decimals, timestamp);
    }
}