// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IFtsoFeedIdConverter} from "@flarenetwork/flare-periphery-contracts/coston2/IFtsoFeedIdConverter.sol";

contract GetFeedId {
    IFtsoFeedIdConverter internal feedIdConverter;

    constructor() {
        feedIdConverter = ContractRegistry.getFtsoFeedIdConverter();
    }

    function exampleFlrUsdConversion() external view returns (bytes21) {
        return feedIdConverter.getFeedId(1, "FLR/USD");
    }
}
