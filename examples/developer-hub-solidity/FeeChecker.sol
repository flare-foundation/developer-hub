// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IFdcHub} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcHub.sol";
import {IFdcRequestFeeConfigurations} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcRequestFeeConfigurations.sol";

contract FeeChecker {
    function getRequestFee(
        bytes calldata _attestationData
    ) external view returns (uint256) {
        // Use the registry to find the FdcHub
        IFdcHub fdcHub = ContractRegistry.getFdcHub();

        // From the FdcHub, get the current fee configuration contract
        IFdcRequestFeeConfigurations feeConfigs = fdcHub
            .fdcRequestFeeConfigurations();

        // Return the fee for the given request data
        return feeConfigs.getRequestFee(_attestationData);
    }
}
