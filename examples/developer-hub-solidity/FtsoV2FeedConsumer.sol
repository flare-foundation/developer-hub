// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {FtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/FtsoV2Interface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract FtsoV2FeedConsumer {
    FtsoV2Interface internal ftsoV2;
    // Feed IDs, see https://dev.flare.network/ftso/feeds for full list
    bytes21[] public feedIds = [
        bytes21(0x01464c522f55534400000000000000000000000000), // FLR/USD
        bytes21(0x014254432f55534400000000000000000000000000), // BTC/USD
        bytes21(0x014554482f55534400000000000000000000000000) // ETH/USD
    ];

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
        ) = ftsoV2.getFeedsById(feedIds);
        /* Your custom feed consumption logic. In this example the values are just returned. */
        return (feedValues, decimals, timestamp);
    }
}
