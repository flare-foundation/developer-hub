// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6 <0.9.0;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {FtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/FtsoV2Interface.sol";

contract FtsoV2FeedConsumer {
    FtsoV2Interface internal ftsoV2;

    /**
     * @dev Constructor initializes the FTSOv2 contract by fetching the FtsoV2Interface address from the ContractRegistry.
     */
    constructor() {
        ftsoV2 = ContractRegistry.getFtsoV2();
    }

    /**
     * @dev Converts a feed name to a bytes21 ID with a fixed category (1) and USD quote.
     * @param _name The name of the feed, e.g. FLR.
     * @return A bytes21 ID representing the feed with USD quote.
     */
    function convertToFeedId(
        string memory _name
    ) internal pure returns (bytes21) {
        return
            bytes21(
                bytes.concat(
                    bytes1(uint8(1)), // Category 1 for crypto feeds
                    bytes(string.concat(_name, "/USD")) // Append "/USD" to the feed name
                )
            );
    }

    /**
     * @dev Fetches the current feed values, decimals, and timestamp from FtsoV2 for the specified feeds.
     * @param _feedNames An array of feed names.
     * @return _feedValues The current values of the specified feeds.
     * @return _decimals The number of decimals for each feed.
     * @return _timestamp The timestamp of the latest update for the feeds.
     */
    function getFtsoV2CurrentFeedValues(
        string[] memory _feedNames
    )
        external
        payable
        returns (
            uint256[] memory _feedValues,
            int8[] memory _decimals,
            uint64 _timestamp
        )
    {
        bytes21[] memory feedIds = new bytes21[](_feedNames.length);

        // Preprocess feed names to feed IDs
        for (uint256 i = 0; i < _feedNames.length; i++) {
            feedIds[i] = convertToFeedId(_feedNames[i]);
        }

        // Fetch feed data from the FtsoV2 contract
        (
            uint256[] memory feedValues,
            int8[] memory decimals,
            uint64 timestamp
        ) = ftsoV2.getFeedsById(feedIds);

        return (feedValues, decimals, timestamp);
    }

    /**
     * @dev Fetches the current feed values in Wei (adjusted for decimals) and timestamp from FtsoV2 for the specified feeds.
     * @param _feedNames An array of feed names.
     * @return _feedValues The current values in Wei.
     * @return _timestamp The timestamp of the latest update for the feeds.
     */
    function getFtsoV2CurrentFeedValuesInWei(
        string[] memory _feedNames
    )
        external
        payable
        returns (uint256[] memory _feedValues, uint64 _timestamp)
    {
        bytes21[] memory feedIds = new bytes21[](_feedNames.length);

        // Preprocess feed names to feed IDs
        for (uint256 i = 0; i < _feedNames.length; i++) {
            feedIds[i] = convertToFeedId(_feedNames[i]);
        }

        // Fetch feed values in Wei and timestamp from FtsoV2 contract
        (uint256[] memory feedValues, uint64 timestamp) = ftsoV2
            .getFeedsByIdInWei{value: msg.value}(feedIds);

        return (feedValues, timestamp);
    }
}
