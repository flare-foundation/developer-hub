// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {FtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/FtsoV2Interface.sol";
import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {TestFtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract FtsoV2AnchorFeedConsumer {
    TestFtsoV2Interface internal ftsoV2;
    mapping(uint32 => mapping(bytes21 => TestFtsoV2Interface.FeedData))
    public provenFeeds;

    function savePrice(
        TestFtsoV2Interface.FeedDataWithProof calldata data
    ) public {
        /* THIS IS A TEST METHOD, in production use: ftsoV2 = ContractRegistry.getFtsoV2(); */
        ftsoV2 = ContractRegistry.getTestFtsoV2();
        // Step 1: Verify the proof
        require(ftsoV2.verifyFeedData(data), "Invalid proof");
        // Step 2: Use the feed data with app specific logic
        // Here the feeds are saved
        provenFeeds[data.body.votingRoundId][data.body.id] = data.body;
    }
}
