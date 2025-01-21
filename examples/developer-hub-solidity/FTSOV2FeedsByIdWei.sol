// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
/* THIS IS A TEST IMPORT, in production use: import {FtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/FtsoV2Interface.sol"; */
import {TestFtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract FtsoV2FeedConsumer {
    TestFtsoV2Interface internal ftsoV2;

    // Feed IDs, see https://dev.flare.network/ftso/feeds for full list
    bytes21[] public feedIds = [
    bytes21(0x01464c522f55534400000000000000000000000000), // FLR/USD
    bytes21(0x014254432f55534400000000000000000000000000), // BTC/USD
    bytes21(0x014554482f55534400000000000000000000000000) // ETH/USD
    ];

    // Event to log feed values retrieval
    event FeedValuesRetrieved(
        bytes21[] indexed feedIds,
        uint256[] values,
        uint64 timestamp
    );

    /**
     * Get the current value of the feeds in wei.
     * A fee may be required for certain feeds, calculated by the FeeCalculator contract.
     * @param _feedIds The IDs of the feeds to retrieve values for.
     * @return _values The list of values for the requested feeds in wei.
     * @return _timestamp The timestamp of the last update.
     */
    function getFeedsByIdInWei(
        bytes21[] calldata _feedIds
    ) external payable returns (uint256[] memory _values, uint64 _timestamp) {
        // Ensure that the length of the feed IDs is non-zero
        require(_feedIds.length > 0, "No feed IDs provided");

        /* THIS IS A TEST METHOD, in production use: ftsoV2 = ContractRegistry.getFtsoV2(); */
        ftsoV2 = ContractRegistry.getTestFtsoV2();

        // Retrieve the feed values and timestamp from the FTSOv2 contract
        (_values, _timestamp) = ftsoV2.getFeedsByIdInWei(_feedIds);

        // Emit an event to log the retrieved feed values
        emit FeedValuesRetrieved(_feedIds, _values, _timestamp);
    }
}
