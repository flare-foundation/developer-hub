// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "forge-std/Test.sol";
import {FtsoV2FeedConsumer} from "../src/FtsoV2FeedConsumer.sol";

contract MockFtsoV2 {
    function getFeedById(
        bytes21 /*_feedId*/
    ) external payable returns (uint256, int8, uint64) {
        return (150000, 7, uint64(block.timestamp));
    }
}

contract MockFeeCalculator {
    function calculateFeeByIds(
        bytes21[] memory /*_feedIds*/
    ) external pure returns (uint256) {
        return 0;
    }
}

contract FtsoV2FeedConsumerTest is Test {
    FtsoV2FeedConsumer public feedConsumer;
    MockFtsoV2 public mockFtsoV2;
    MockFeeCalculator public mockFeeCalc;
    bytes21 constant flrUsdId =
        bytes21(0x01464c522f55534400000000000000000000000000);

    function setUp() public {
        mockFtsoV2 = new MockFtsoV2();
        mockFeeCalc = new MockFeeCalculator();
        feedConsumer = new FtsoV2FeedConsumer(
            address(mockFtsoV2),
            address(mockFeeCalc),
            flrUsdId
        );
    }

    function testCheckFees() public {
        assertEq(feedConsumer.checkFees(), 0, "Feed value mismatch");
    }

    function testGetFlrUsdPrice() public {
        (uint256 feedValue, int8 decimals, uint64 timestamp) = feedConsumer
            .getFlrUsdPrice{value: 0}();
        assertEq(feedValue, 150000, "Feed value mismatch");
        assertEq(decimals, 7, "Decimals mismatch");
        assertApproxEqAbs(
            timestamp,
            uint64(block.timestamp),
            2,
            "Timestamp mismatch"
        );
    }
}
