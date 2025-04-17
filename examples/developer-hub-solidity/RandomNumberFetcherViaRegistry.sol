// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IFlareContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston/IFlareContractRegistry.sol";
import {RandomNumberV2Interface} from "@flarenetwork/flare-periphery-contracts/coston/RandomNumberV2Interface.sol";

contract RandomNumberFetcher {
    // Fetches the RandomNumberV2 contract from the registry by name
    function getRandomNumberViaRegistryName()
        public
        view
        returns (
            uint256 _randomNumber,
            bool _isSecureRandom,
            uint256 _randomTimestamp
        )
    {
        // Get the Flare Contracts Registry smart contract
        IFlareContractRegistry flareContractRegistry = IFlareContractRegistry(
            0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019
        );
        // Get the address of the Random Number V2 contract
        address randomNumberV2Address = flareContractRegistry
            .getContractAddressByName("RandomNumberV2");
        // Define the random number V2 interface
        RandomNumberV2Interface randomNumberV2 = RandomNumberV2Interface(
            randomNumberV2Address
        );

        return randomNumberV2.getRandomNumber();
    }
}
