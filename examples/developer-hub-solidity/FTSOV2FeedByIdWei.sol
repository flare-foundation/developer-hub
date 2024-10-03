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

    // Feed data structure to store multiple feed values with timestamps
    struct FeedInfo {
        uint256 valueInWei;
        uint64 timestamp;
    }

    // Mapping to store the latest feed data for a given index
    mapping(uint256 => FeedInfo) public feedDataByIndex;
    uint256 public highestValueIndex;
    uint256 public highestValueInWei;

    // Event to track feed retrieval
    event FeedFetched(uint256 index, uint256 valueInWei, uint64 timestamp);

    /**
     * Constructor initializes the FTSOv2 contract.
     * The contract registry is used to fetch the FtsoV2 contract address.
     */
    constructor() {
        /* THIS IS A TEST METHOD, in production use: ftsoV2 = ContractRegistry.getFtsoV2(); */
        ftsoV2 = ContractRegistry.getTestFtsoV2();
    }

    /**
     * Get the current value of a specific feed by its index, in wei.
     * @param _index The index of the feed to retrieve.
     * @return _feedValue The latest price value of the feed in wei.
     * @return _timestamp The timestamp of the last update for the feed.
     */
    function getFeedValueByIndexInWei(uint256 _index)
        external
        payable
        returns (uint256 _feedValue, uint64 _timestamp)
    {
        // Retrieve feed value and timestamp from the FtsoV2 contract
        (_feedValue, _timestamp) = ftsoV2.getFeedByInWei{value: msg.value}(_index);

        // Store the feed value and timestamp in the contract's storage
        feedDataByIndex[_index] = FeedInfo({
            valueInWei: _feedValue,
            timestamp: _timestamp
        });

        // Update the highest value feed if applicable
        if (_feedValue > highestValueInWei) {
            highestValueInWei = _feedValue;
            highestValueIndex = _index;
        }

        // Emit an event to log the feed retrieval
        emit FeedFetched(_index, _feedValue, _timestamp);
    }

}