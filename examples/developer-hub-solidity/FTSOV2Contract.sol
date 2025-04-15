// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "flare-periphery-contracts-fassets-test/coston2/ContractRegistry.sol";

contract FTSOV2Contract {
    function getFtsoV2() public view returns (address) {
        return ContractRegistry.getContractAddressByName("FtsoV2");
    }
}
