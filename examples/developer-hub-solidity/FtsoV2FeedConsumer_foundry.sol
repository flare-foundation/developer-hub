// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import {console2} from "forge-std/Test.sol";
import {FtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/FtsoV2Interface.sol";
import {IFeeCalculator} from "@flarenetwork/flare-periphery-contracts/coston2/IFeeCalculator.sol";

contract FtsoV2FeedConsumer {
    FtsoV2Interface internal ftsoV2;
    IFeeCalculator internal feeCalc;
    bytes21[] public feedIds;
    bytes21 public flrUsdId;
    uint256 public fee;

    constructor(address _ftsoV2, address _feeCalc, bytes21 _flrUsdId) {
        ftsoV2 = FtsoV2Interface(_ftsoV2);
        feeCalc = IFeeCalculator(_feeCalc);
        flrUsdId = _flrUsdId;
        feedIds.push(_flrUsdId);
    }

    function checkFees() external returns (uint256 _fee) {
        fee = feeCalc.calculateFeeByIds(feedIds);
        return fee;
    }

    function getFlrUsdPrice() external payable returns (uint256, int8, uint64) {
        (uint256 feedValue, int8 decimals, uint64 timestamp) = ftsoV2
            .getFeedById{value: msg.value}(flrUsdId);

        if (fee != msg.value) {
            console2.log("msg.value %i doesn't match fee %i", msg.value, fee);
        } else {
            console2.log("msg.value matches fee");
        }

        console2.log("feedValue %i", feedValue);
        console2.log("decimals %i", decimals);
        console2.log("timestamp %i", timestamp);
        return (feedValue, decimals, timestamp);
    }
}
