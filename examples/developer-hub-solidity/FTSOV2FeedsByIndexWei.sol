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

    // Fee percentage that will be deducted from the payment
    uint256 public feePercentage = 1; // 1%

    /**
     * Constructor initializes the FTSOv2 contract.
     * The contract registry is used to fetch the FtsoV2 contract address.
     */
    constructor() {
        /* THIS IS A TEST METHOD, in production use: ftsoV2 = ContractRegistry.getFtsoV2(); */
        ftsoV2 = ContractRegistry.getTestFtsoV2();
    }

    /**
     * Get the values of feeds in wei by their indices.
     * A fee may need to be paid for certain feeds, calculated by the FeeCalculator contract.
     * @param _indices The indices of the feeds to retrieve values for.
     * @return _values The list of values for the requested feeds in wei.
     * @return _timestamp The timestamp of the last update.
     */
    function getFeedsByIndexInWei(uint256[] calldata _indices)
        external
        payable
        returns (uint256[] memory _values, uint64 _timestamp)
    {
        // Ensure that the length of the indices is non-zero
        require(_indices.length > 0, "No indices provided");

        // Calculate total fee based on the number of indices
        uint256 totalFee = calculateFee(_indices.length);
        require(msg.value >= totalFee, "Insufficient fee paid");

        // Retrieve the feed values and timestamp from the FTSOv2 contract
        (_values, _timestamp) = ftsoV2.getFeedsByIndexInWei(_indices);

        // Refund excess Ether paid (if any)
        if (msg.value > totalFee) {
            payable(msg.sender).transfer(msg.value - totalFee);
        }
    }

    /**
     * Calculate the fee based on the number of feeds requested.
     * @param _numFeeds The number of feeds requested.
     * @return The calculated fee in wei.
     */
    function calculateFee(uint256 _numFeeds) internal view returns (uint256) {
        return (_numFeeds * 1 ether * feePercentage) / 100; // Example: 1% of the total requested amount
    }
}