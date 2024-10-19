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

    // Event to log feed retrievals
    event FeedsRetrieved(uint256[] indices, uint256[] values, int8[] decimals, uint64 timestamp);

    /**
     * Constructor initializes the FTSOv2 contract.
     * The contract registry is used to fetch the FtsoV2 contract address.
     */
    constructor() {
        /* THIS IS A TEST METHOD, in production use: ftsoV2 = ContractRegistry.getFtsoV2(); */
        ftsoV2 = ContractRegistry.getTestFtsoV2();
    }

    /**
     * Get the values and decimals of feeds by their indices.
     * A fee may be required for certain feeds, calculated by the FeeCalculator contract.
     * @param _indices The indices of the feeds to retrieve values for.
     * @return _values The list of values for the requested feeds.
     * @return _decimals The list of decimal places for the requested feeds.
     * @return _timestamp The timestamp of the last update.
     */
    function getFeedsByIndex(uint256[] calldata _indices)
        external
        payable
        returns (uint256[] memory _values, int8[] memory _decimals, uint64 _timestamp)
    {
        // Ensure that the length of the indices is non-zero
        require(_indices.length > 0, "No indices provided");

        // Retrieve the feed values, decimals, and timestamp from the FTSOv2 contract
        (_values, _decimals, _timestamp) = ftsoV2.getFeedsByIndex(_indices);

        // Emit an event to log the retrieved feed values
        emit FeedsRetrieved(_indices, _values, _decimals, _timestamp);
    }

    /**
     * Get the current feed values for a specific index.
     * This function is helpful to verify values before making a payment for feeds.
     */
    function previewFeedValues(uint256[] calldata _indices)
        external
        view
        returns (uint256[] memory _values, int8[] memory _decimals)
    {
        // Ensure that the length of the indices is non-zero
        require(_indices.length > 0, "No indices provided");

        // Call the FTSOv2 contract to get the feed values and decimals
        (_values, _decimals) = ftsoV2.getFeedsByIndex(_indices);
    }
}