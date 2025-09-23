// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {RandomNumberV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/RandomNumberV2Interface.sol";

/**
 * @title SecureRandomConsumer
 * @notice Example consumer that reads secure random values from Flare's RandomNumberV2.
 * @dev THIS IS AN EXAMPLE CONTRACT. DO NOT USE THIS EXACT CODE IN PRODUCTION.
 */
contract SecureRandomConsumer {
    /// @notice Random number provider (fetched from ContractRegistry at construction).
    RandomNumberV2Interface public immutable randomV2;

    /**
     * @notice Initialize and grab the RandomNumberV2 instance from the ContractRegistry.
     */
    constructor() {
        randomV2 = ContractRegistry.getRandomNumberV2();
    }

    /**
     * @notice Returns the latest secure random number.
     * @dev The underlying provider returns `(uint256 random, bool isSecure, uint256 timestamp)`.
     *      Only returns `random` when `isSecure == true`. This function is `view`.
     * @return randomNumber Latest secure random value.
     */
    function getSecureRandomNumber()
        external
        view
        returns (uint256 randomNumber, bool isSecure, uint256 timestamp)
    {
        (uint256 _randomNumber, bool _isSecure, uint256 _timestamp) = randomV2
            .getRandomNumber();

        // DO NOT USE returned value if isSecure==false. Wait until the next secure round.
        require(isSecure, "Random number is not secure yet");

        return (_randomNumber, _isSecure, _timestamp);
    }

    /**
     * @notice Convenience read: returns raw tuple from the random provider.
     * @return randomNumber Latest random value (may be insecure).
     * @return isSecure Whether the value is considered secure by provider.
     * @return timestamp Provider timestamp for the random value.
     */
    function peekRandomNumber()
        external
        view
        returns (uint256 randomNumber, bool isSecure, uint256 timestamp)
    {
        (randomNumber, isSecure, timestamp) = randomV2.getRandomNumber();
    }
}
