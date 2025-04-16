// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "flare-periphery-contracts-fassets-test/coston2/ContractRegistry.sol";
import {FtsoV2Interface} from "flare-periphery-contracts-fassets-test/coston2/FtsoV2Interface.sol";

contract FTSOV2Interface {
    function getFtsoV2() public view returns (FtsoV2Interface) {
        return ContractRegistry.getFtsoV2();
    }
}
