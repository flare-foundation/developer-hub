// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
/* THIS IS A TEST IMPORT, in production use: import {FtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/FtsoV2Interface.sol"; */
import {TestFtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract FtsoV2FeedIdManager {
    TestFtsoV2Interface internal ftsoV2;

    // Mapping to store the feed IDs for each index
    mapping(uint256 => bytes21) public feedIdByIndex;

    // Mapping to track the number of times each feed index was accessed
    mapping(uint256 => uint256) public feedAccessCount;

    // State variables to track the most frequently accessed feed
    uint256 public mostAccessedFeedIndex;
    uint256 public mostAccessedFeedCount;

    // Event to track feed ID retrieval
    event FeedIdFetched(uint256 indexed index, bytes21 feedId);

    /**
     * Constructor initializes the FTSOv2 contract.
     * The contract registry is used to fetch the FtsoV2 contract address.
     */
    constructor() {
        /* THIS IS A TEST METHOD, in production use: ftsoV2 = ContractRegistry.getFtsoV2(); */
        ftsoV2 = ContractRegistry.getTestFtsoV2();
    }

    /**
     * Get the feed ID for a given index and track usage statistics.
     * @param _index The index of the feed.
     * @return _feedId The feed ID for the given index.
     */
    function getFeedIdForIndex(uint256 _index)
        external
        view
        returns (bytes21 _feedId)
    {
        // Retrieve feed ID from the FtsoV2 contract
        _feedId = ftsoV2.getFeedId(_index);

        // If the feed ID is not zero (i.e., it is valid), store it and update access count
        if (_feedId != bytes21(0)) {
            // Update access count for this feed index
            feedAccessCount[_index]++;

            // Check if this feed index is now the most accessed
            if (feedAccessCount[_index] > mostAccessedFeedCount) {
                mostAccessedFeedCount = feedAccessCount[_index];
                mostAccessedFeedIndex = _index;
            }

            // Emit an event for external monitoring
            emit FeedIdFetched(_index, _feedId);
        }
    }

    /**
     * Fetch feed IDs for multiple indices and store them.
     * @param _indices An array of feed indices.
     * @return _feedIds An array of corresponding feed IDs.
     */
    function getMultipleFeedIds(uint256[] calldata _indices)
        external
        view
        returns (bytes21[] memory _feedIds)
    {
        _feedIds = new bytes21[](_indices.length);

        for (uint256 i = 0; i < _indices.length; i++) {
            _feedIds[i] = getFeedIdForIndex(_indices[i]);
        }
    }

    /**
     * Get the most accessed feed's index and the access count.
     * @return _mostAccessedIndex The index of the most accessed feed.
     * @return _mostAccessedCount The number of times the most accessed feed has been queried.
     */
    function getMostAccessedFeed()
        external
        view
        returns (uint256 _mostAccessedIndex, uint256 _mostAccessedCount)
    {
        return (mostAccessedFeedIndex, mostAccessedFeedCount);
    }

    /**
     * View the number of times a particular feed has been accessed.
     * @param _index The index of the feed.
     * @return _accessCount The number of times the feed has been accessed.
     */
    function getFeedAccessCount(uint256 _index)
        external
        view
        returns (uint256 _accessCount)
    {
        return feedAccessCount[_index];
    }
}