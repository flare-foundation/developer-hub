// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IFlareContractRegistry} from "flare-periphery-contracts-fassets-test/coston/IFlareContractRegistry.sol";

contract FlareContractRegistryReader {
    IFlareContractRegistry flareContractRegistry;

    constructor(address _flareContractRegistry) {
        flareContractRegistry = IFlareContractRegistry(_flareContractRegistry);
    }

    function getContractByName(
        string memory name
    ) public view returns (address) {
        return flareContractRegistry.getContractAddressByName(name);
    }

    function getAllContracts()
        public
        view
        returns (string[] memory, address[] memory)
    {
        return flareContractRegistry.getAllContracts();
    }
}
