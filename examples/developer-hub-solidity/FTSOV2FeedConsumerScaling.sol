// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {FtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/FtsoV2Interface.sol";
import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract FTSOV2FeedConsumerScaling {
    mapping(uint32 => mapping(bytes21 => FtsoV2Interface.FeedData))
        public provenFeeds;

    function savePrice(FtsoV2Interface.FeedDataWithProof calldata data) public {
        // Step 1: Verify the proof
        require(
            ContractRegistry.getFtsoV2().verifyFeedData(data),
            "Invalid proof"
        );
        // Add applications specific logic
        // Step 2: Use the feed data
        provenFeeds[data.body.votingRoundId][data.body.id] = data.body;
    }
}
