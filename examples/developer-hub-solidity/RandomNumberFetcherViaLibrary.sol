// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { ContractRegistry } from "@flarenetwork/flare-periphery-contracts/coston/ContractRegistry.sol";
import { RandomNumberV2Interface } from "@flarenetwork/flare-periphery-contracts/coston/RandomNumberV2Interface.sol";

contract RandomNumberFetcherViaLibrary {
    // Fetches the RandomNumberV2 contract using the shared ContractRegistry library
    function getRandomNumberViaContractLibrary() public view returns(
        uint256 _randomNumber,
        bool _isSecureRandom,
        uint256 _randomTimestamp
    ) {
        // Get the random number interface from the ContractRegistry library
        RandomNumberV2Interface randomNumberV2 = ContractRegistry.getRandomNumberV2();
        
        return randomNumberV2.getRandomNumber();
    }
}