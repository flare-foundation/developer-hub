// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import {TestFtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";
import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IFeeCalculator} from "@flarenetwork/flare-periphery-contracts/coston2/IFeeCalculator.sol";


/**
 * THIS IS AN EXAMPLE CONTRACT.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract FtsoV2FeedConsumer {
    bytes21[] public feedIds;
    bytes21 public constant flrUsdId = 0x01464c522f55534400000000000000000000000000; // "FLR/USD"
    uint256 public fee;

    

    function checkFees() external view returns (uint256 _fee) {
       IFeeCalculator feeCalc = ContractRegistry.getFeeCalculator();
        return feeCalc.calculateFeeByIds(feedIds);
    }
    /* THIS IS A TEST METHOD, in production use: ftsoV2 = ContractRegistry.getFtsoV2(); */
    function getFlrUsdPrice() external view returns (uint256, int8, uint64) {
        TestFtsoV2Interface ftsoV2 = TestFtsoV2Interface(ContractRegistry.getTestFtsoV2());
    
        return ftsoV2.getFeedById(flrUsdId);
    }
}