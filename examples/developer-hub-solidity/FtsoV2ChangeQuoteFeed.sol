// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
/* THIS IS A TEST IMPORT, in production use: import {FtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/FtsoV2Interface.sol"; */
import {TestFtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract FtsoV2ChangeQuoteFeed {
    TestFtsoV2Interface internal ftsoV2;

    /**
     * Initializing an instance with FtsoV2Interface.
     * The contract registry is used to fetch the contract address.
     */
    constructor() {
        /* THIS IS A TEST METHOD, in production use: ftsoV2 = ContractRegistry.getFtsoV2(); */
        ftsoV2 = ContractRegistry.getTestFtsoV2();
    }

    /**
     * @dev Internal function to scale the base feed value to match the decimals of the quote feed.
     */
    function _scaleBaseFeedValue(
        uint256 _baseFeedValue,
        uint8 _baseFeedDecimals,
        uint8 _quoteDecimals
    ) internal pure returns (uint256) {
        if (_baseFeedDecimals < _quoteDecimals) {
            // Scale up if base feed decimals are less than quote feed decimals
            return
                _baseFeedValue *
                10 ** uint256(_quoteDecimals - _baseFeedDecimals);
        } else if (_baseFeedDecimals > _quoteDecimals) {
            // Scale down if base feed decimals are more than quote feed decimals
            return
                _baseFeedValue /
                10 ** uint256(_baseFeedDecimals - _quoteDecimals);
        } else {
            // No scaling needed if decimals are equal
            return _baseFeedValue;
        }
    }

    /**
     * @dev Function to compute the new quote feed value based on the base and quote feed values.
     * @param _baseAndQuoteFeedIds Array containing the IDs of the base and quote feeds.
     * @return The computed new quote feed value.
     */
    function getNewQuoteFeedValue(
        bytes21[] calldata _baseAndQuoteFeedIds
    ) external view returns (uint256) {
        require(
            _baseAndQuoteFeedIds.length == 2,
            "Invalid feed indexes. Please provide exactly two indexes."
        );
        // Fetch current feeds
        (uint256[] memory feedValues, int8[] memory decimals, ) = ftsoV2
            .getFeedsById(_baseAndQuoteFeedIds);
        uint8 newQuoteDecimals = uint8(decimals[1]);
        // Scale the base feed value to match the quote feed decimals
        uint256 scaledBaseFeedValue = _scaleBaseFeedValue(
            feedValues[0],
            uint8(decimals[0]),
            newQuoteDecimals
        );
        // Prevent division by zero
        require(feedValues[1] != 0, "Division by zero");
        // Compute the new quote feed value
        uint256 newQuoteFeedValue = (scaledBaseFeedValue *
            10 ** uint256(newQuoteDecimals)) / feedValues[1];
        return newQuoteFeedValue;
    }
}
