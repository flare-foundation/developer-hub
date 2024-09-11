// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6 <0.9;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {FtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/FtsoV2Interface.sol";

contract FtsoV2FeedConsumer {
    FtsoV2Interface internal ftsoV2;

    /**
     * Constructor initializes the FTSOv2 contract.
     * The contract registry is used to fetch the FtsoV2Interface contract address.
     */
    constructor() {
        ftsoV2 = ContractRegistry.getFtsoV2();
    }

    function convertToFeedId(
        string memory _name
    ) internal pure returns (bytes21) {
        return
            bytes21(
                bytes.concat(
                    // Crypto prices have category 1
                    bytes1(uint8(1)),
                    // Feeds are not just names, but can be pegged against a specific currency
                    // All existing feeds are pegged against USD
                    bytes(string.concat(_name, "/USD"))
                )
            );
    }

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
        for (uint256 i = 0; i < _feedNames.length; i++) {
            feedIds[i] = convertToFeedId(_feedNames[i]);
        }
        (
            uint256[] memory feedValues,
            int8[] memory decimals,
            uint64 timestamp
        ) = ftsoV2.getFeedsById(feedIds);
        return (feedValues, decimals, timestamp);
    }

    // You can also use the version that directly converts the values to wei (and accounts for decimals)
    function getFtsoV2CurrentFeedValuesInWei(
        string[] memory _feedNames
    )
        external
        payable
        returns (uint256[] memory _feedValues, uint64 _timestamp)
    {
        bytes21[] memory feedIds = new bytes21[](_feedNames.length);
        for (uint256 i = 0; i < _feedNames.length; i++) {
            feedIds[i] = convertToFeedId(_feedNames[i]);
        }
        (uint256[] memory feedValues, uint64 timestamp) = ftsoV2
            .getFeedsByIdInWei(feedIds);
        return (feedValues, timestamp);
    }
}
