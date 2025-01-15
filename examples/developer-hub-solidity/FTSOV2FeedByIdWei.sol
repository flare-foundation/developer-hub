// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
/* THIS IS A TEST IMPORT, in production use: import {FtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/FtsoV2Interface.sol"; */
import {TestFtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract FtsoV2FeedTracker {
    TestFtsoV2Interface internal ftsoV2;
    bytes21 public feedId = bytes21(0x01464c522f55534400000000000000000000000000); // FLR/USD

    // Event to track feed retrieval
    event FeedFetched(bytes21 feedId, uint256 valueInWei, uint64 timestamp);

    /**
     * Get the current value of a specific feed by its index, in wei.
     * @return _feedValue The latest price value of the feed in wei.
     * @return _timestamp The timestamp of the last update for the feed.
     */
    function getFeedValueByIdWei()
    external
    payable
    returns (uint256 _feedValue, uint64 _timestamp)
    {
        /* THIS IS A TEST METHOD, in production use: ftsoV2 = ContractRegistry.getFtsoV2(); */
        ftsoV2 = ContractRegistry.getTestFtsoV2();
        // Retrieve feed value and timestamp from the FtsoV2 contract
        (_feedValue, _timestamp) = ftsoV2.getFeedByIdInWei(feedId);

        // Emit an event to log the feed retrieval
        emit FeedFetched(feedId, _feedValue, _timestamp);
    }

}