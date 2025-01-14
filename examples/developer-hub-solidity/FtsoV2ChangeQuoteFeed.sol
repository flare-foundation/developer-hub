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
     * @dev Internal function to scale the base feed value to match the decimals of the final feed.
     */
    function _scaleBaseFeedValue(
        uint256 _baseFeedValue,
        uint8 _baseFeedDecimals,
        uint8 _finalDecimals
    ) internal pure returns (uint256) {
        if (_baseFeedDecimals < _finalDecimals) {
            // Scale up if base feed decimals are less than final feed decimals
            return
                _baseFeedValue *
                10 ** uint256(_finalDecimals - _baseFeedDecimals);
        } else if (_baseFeedDecimals > _finalDecimals) {
            // Scale down if base feed decimals are more than final feed decimals
            return
                _baseFeedValue /
                10 ** uint256(_baseFeedDecimals - _finalDecimals);
        } else {
            // No scaling needed if decimals are equal
            return _baseFeedValue;
        }
    }

    /**
     * @dev Function to compute the new quote feed value based on the base and quote feed values.
     * @param _baseAndQuoteFeedIds Array containing the IDs of the base and quote feeds.
     * @return The computed new quote feed value in the original quote decimals.
     */
    function getNewQuoteFeedValue(
        bytes21[] calldata _baseAndQuoteFeedIds
    ) external returns (uint256) {
        require(
            _baseAndQuoteFeedIds.length == 2,
            "Invalid feed indexes. Please provide exactly two indexes."
        );
        /* THIS IS A TEST METHOD, in production use: ftsoV2 = ContractRegistry.getFtsoV2(); */
        ftsoV2 = ContractRegistry.getTestFtsoV2();
        // Fetch current feeds
        (uint256[] memory feedValues, int8[] memory decimals, ) = ftsoV2
            .getFeedsById(_baseAndQuoteFeedIds);
        // The base feed gets scaled by:
        // - comparison with the quote feed
        // - being returned in the quote feed decimals
        uint8 finalDecimals = 2 * uint8(decimals[1]);
        // Scale the base feed value to match the final feed decimals
        // Scaling is done all at once for smaller calculation errors
        uint256 scaledBaseFeedValue = _scaleBaseFeedValue(
            feedValues[0],
            uint8(decimals[0]),
            finalDecimals
        );
        // Prevent division by zero
        require(feedValues[1] != 0, "Division by zero");
        // Compute the new quote feed value
        uint256 newQuoteFeedValue = scaledBaseFeedValue / feedValues[1];
        return newQuoteFeedValue;
    }

    /**
     * @dev Function to compute the new quote feed value based on the base and quote feed values.
     * @param _baseAndQuoteFeedIds Array containing the IDs of the base and quote feeds.
     * @param _newQuoteDecimals Number of decimals for the returned value.
     * @return The computed new quote feed value in the parameter decimals.
     */
    function getNewQuoteFeedValueSetDecimals(
        bytes21[] calldata _baseAndQuoteFeedIds,
        uint8 _newQuoteDecimals
    ) public view returns (uint256) {
        require(
            _baseAndQuoteFeedIds.length == 2,
            "Invalid feed indexes. Please provide exactly two indexes."
        );

        // Fetch current feeds
        (uint256[] memory feedValues, int8[] memory decimals, ) = ftsoV2
            .getFeedsById(_baseAndQuoteFeedIds);
        // The base feed gets scaled by:
        // - comparison with the quote feed
        // - being returned in the "_newQuoteDecimals" decimals
        uint8 finalDecimals = uint8(decimals[1]) + _newQuoteDecimals;
        // Scale the base feed value to match the final feed decimals
        // Scaling is done all at once for smaller calculation errors
        uint256 scaledBaseFeedValue = _scaleBaseFeedValue(
            feedValues[0],
            uint8(decimals[0]),
            finalDecimals
        );
        // Prevent division by zero
        require(feedValues[1] != 0, "Division by zero");
        // Compute the new quote feed value
        uint256 newQuoteFeedValue = scaledBaseFeedValue / feedValues[1];
        return newQuoteFeedValue;
    }

    /**
     * @dev Function to compute the new quote feed value based on the base and quote feed values.
     * @param _baseAndQuoteFeedIds Array containing the IDs of the base and quote feeds.
     * @return The computed new quote feed value in wei (with 18 decimals).
     */
    function getNewQuoteFeedValueInWei(
        bytes21[] calldata _baseAndQuoteFeedIds
    ) external view returns (uint256) {
        uint256 newQuoteFeedValue = getNewQuoteFeedValueSetDecimals(
            _baseAndQuoteFeedIds,
            18
        );
        return newQuoteFeedValue;
    }
}
