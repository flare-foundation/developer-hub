// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {RandomNumberV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/RandomNumberV2Interface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract SecureRandomConsumer {
    RandomNumberV2Interface internal randomV2;

    /**
     * Initializing an instance with RandomNumberV2Interface.
     * The contract registry is used to fetch the contract address.
     */
    constructor() {
        randomV2 = ContractRegistry.getRandomNumberV2();
    }

    /**
     * Fetch the latest secure random number.
     * The random number is generated every 90 seconds.
     */
    function getSecureRandomNumber()
        external
        view
        returns (uint256 randomNumber)
    {
        (randomNumber, isSecure, timestamp) = randomV2.getRandomNumber();
        /* DO NOT USE if isSecure=false. Wait till the next voting round (90s). */
        require(isSecure, "Random number is not secure");
        /* Your custom RNG consumption logic. Here the random value is just returned. */
        return randomNumber;
    }
}
