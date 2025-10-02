// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IFdcHub} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcHub.sol";
import {IFdcInflationConfigurations} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcInflationConfigurations.sol";

contract InflationMonitor {
    function getInflationShare(
        bytes32 attestationType,
        bytes32 source
    ) external view returns (uint24) {
        // Fetch the FdcHub from the registry to access other FDC contracts
        IFdcHub fdcHub = ContractRegistry.getFdcHub();

        // Get the inflation configurations contract
        IFdcInflationConfigurations inflationConfigs = fdcHub
            .fdcInflationConfigurations();

        // Retrieve the entire array of configurations
        IFdcInflationConfigurations.FdcConfiguration[]
            memory configs = inflationConfigs.getFdcConfigurations();

        // Loop through the array to find the matching configuration
        for (uint i = 0; i < configs.length; i++) {
            if (
                configs[i].attestationType == attestationType &&
                configs[i].source == source
            ) {
                return configs[i].inflationShare;
            }
        }

        // Return 0 if no matching configuration is found
        return 0;
    }
}
