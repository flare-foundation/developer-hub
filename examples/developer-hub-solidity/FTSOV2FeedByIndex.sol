// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
/* THIS IS A TEST IMPORT, in production use: import {FtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/FtsoV2Interface.sol"; */
import {TestFtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract FtsoV2FeedConsumerByIndex {
    TestFtsoV2Interface internal ftsoV2;
    // Example index for a feed (corresponding to a feed id)
    uint256 public feedIndex = 1; // Example: FLR/USD

    /**
     * Constructor initializes the FTSOv2 contract.
     * The contract registry is used to fetch the FtsoV2 contract address.
     */
    constructor() {
        /* THIS IS A TEST METHOD, in production use: ftsoV2 = ContractRegistry.getFtsoV2(); */
        ftsoV2 = ContractRegistry.getTestFtsoV2();
    }

    /**
     * Get the current value of a specific feed by its index.
     * @return _feedValue The latest price value of the feed.
     * @return _decimals The decimal precision of the feed value.
     * @return _timestamp The timestamp of the last feed update.
     */
    function getFtsoV2FeedValueByIndex()
        external
        payable
        returns (
            uint256 _feedValue,
            int8 _decimals,
            uint64 _timestamp
        )
    {
        /* Retrieves the latest value, decimals, and timestamp for the specified feed index. */
        return ftsoV2.getFeedByIndex(feedIndex);
    }
}