// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {IFlareContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/util-contracts/userInterfaces/IFlareContractRegistry.sol";
import {IRelay} from "@flarenetwork/flare-periphery-contracts/coston2/util-contracts/userInterfaces/IRelay.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract SecureRandomConsumer {
    IFlareContractRegistry internal contractRegistry;
    IRelay internal secureRng;

    /**
     * Constructor initializes the Relay contract.
     * The contract registry is used to fetch the Relay contract address.
     */
    constructor() {
        contractRegistry = IFlareContractRegistry(
            0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019
        );
        secureRng = IRelay(contractRegistry.getContractAddressByName("Relay"));
    }

    /**
     * Fetch and check the latest secure random number.
     * The random number is generated every 90 seconds.
     */
    function getSecureRandomNumber()
        external
        view
        returns (uint256 randomNumber, uint256 timestamp)
    {
        (randomNumber, isSecure, timestamp) = secureRng.getRandomNumber();
        require(isSecure, "Random number is not secure");
        /* Your custom RNG consumption logic. In this example the values are just returned. */
        return (randomNumber, timestamp);
    }
}
