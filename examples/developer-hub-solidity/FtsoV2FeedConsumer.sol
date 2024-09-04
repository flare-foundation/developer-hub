// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/flare/ContractRegistry.sol";
import {FtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/flare/FtsoV2Interface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract FtsoV2FeedConsumer {
    FtsoV2Interface internal ftsoV2;
    // Feed indexes: 0 = FLR/USD, 2 = BTC/USD, 9 = ETH/USD
    // See https://dev.flare.network/ftso/feeds for all feeds
    uint256[] public feedIndexes = [0, 2, 9];

    /**
     * Constructor initializes the FTSOv2 contract.
     * The contract registry is used to fetch the FtsoV2Interface contract address.
     */
    constructor() {
        ftsoV2 = ContractRegistry.getFtsoV2();
    }

    /**
     * Get the current value of the feeds.
     */
    function getFtsoV2CurrentFeedValues()
        external
        payable
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
        ) = ftsoV2.getFeedsByIndex(feedIndexes);
        /* Your custom feed consumption logic. In this example the values are just returned. */
        return (feedValues, decimals, timestamp);
    }
}
