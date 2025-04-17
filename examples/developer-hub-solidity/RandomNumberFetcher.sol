// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston/ContractRegistry.sol";
import {IFlareContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston/IFlareContractRegistry.sol";
import {RandomNumberV2Interface} from "@flarenetwork/flare-periphery-contracts/coston/RandomNumberV2Interface.sol";

// Demonstrates three different ways to retrieve the RandomNumberV2 contract on the Flare network.
contract RandomNumberFetcher {
    // DO NOT USE IN PRODUCTION — hardcoding addresses is discouraged due to upgradeability and security risks
    function getRandomNumberHardcoded()
        public
        view
        returns (
            uint256 _randomNumber,
            bool _isSecureRandom,
            uint256 _randomTimestamp
        )
    {
        // Using a hardcoded address to create an interface instance (Not recommended in production)
        RandomNumberV2Interface randomNumberV2 = RandomNumberV2Interface(
            0x92a6E1127262106611e1e129BB64B6D8654273F7
        );

        return randomNumberV2.getRandomNumber();
    }

    // Fetches a random number by resolving the contract address via the FlareContractRegistry
    function getRandomNumberViaRegistryName()
        public
        view
        returns (
            uint256 _randomNumber,
            bool _isSecureRandom,
            uint256 _randomTimestamp
        )
    {
        // Instantiate the FlareContractRegistry at the known address (same across all networks)
        IFlareContractRegistry flareContractRegistry = IFlareContractRegistry(
            0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019
        );

        // Get the address of the Random Number V2 contract
        address randomNumberV2Address = flareContractRegistry
            .getContractAddressByName("RandomNumberV2");

        // Create an interface instance pointing to the contract address
        RandomNumberV2Interface randomNumberV2 = RandomNumberV2Interface(
            randomNumberV2Address
        );

        return randomNumberV2.getRandomNumber();
    }

    // Fetches the RandomNumberV2 contract using the shared ContractRegistry library
    function getRandomNumberViaContractLibrary()
        public
        view
        returns (
            uint256 _randomNumber,
            bool _isSecureRandom,
            uint256 _randomTimestamp
        )
    {
        // Get the RandomNumberV2 contract interface using the ContractRegistry library
        RandomNumberV2Interface randomNumberV2 = ContractRegistry
            .getRandomNumberV2();

        return randomNumberV2.getRandomNumber();
    }
}
