// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
/* THIS IS A TEST IMPORT, in production use: import {FtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/FtsoV2Interface.sol"; */
import {TestFtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract FtsoV2FeedConsumerById {
    TestFtsoV2Interface internal ftsoV2;
    // Example Feed ID for FLR/USD
    bytes21 public feedId =
    bytes21(0x01464c522f55534400000000000000000000000000); // FLR/USD

    /**
     * Get the current value of a specific feed by its ID.
     * @return _feedValue The latest price value of the feed.
     * @return _decimals The decimal precision of the feed value.
     * @return _timestamp The timestamp of the last feed update.
     */
    function getFtsoV2FeedValueById()
    external
    payable
    returns (uint256 _feedValue, int8 _decimals, uint64 _timestamp)
    {
        /* THIS IS A TEST METHOD, in production use: ftsoV2 = ContractRegistry.getFtsoV2(); */
        ftsoV2 = ContractRegistry.getTestFtsoV2();
        /* Retrieves the latest value, decimals, and timestamp for the specified feed ID. */
        return ftsoV2.getFeedById(feedId);
    }
}
