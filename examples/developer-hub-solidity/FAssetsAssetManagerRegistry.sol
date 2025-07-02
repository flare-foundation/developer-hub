// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 1. Import the necessary interfaces and libraries
import {IFlareContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/IFlareContractRegistry.sol";

import {IAssetManager} from "@flarenetwork/flare-periphery-contracts/coston2/IAssetManager.sol";
import {IAssetManagerController} from "@flarenetwork/flare-periphery-contracts/coston2/IAssetManagerController.sol";

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";

import {AssetManagerSettings} from "@flarenetwork/flare-periphery-contracts/coston2/userInterfaces/data/AssetManagerSettings.sol";

contract AssetManagerRegistry {
    // 2. Define a constant TXRP_HASH that is the hash of the string "TXRP"
    bytes32 private constant TXRP_HASH = keccak256(abi.encodePacked("TXRP"));

    // 3. Implement a function that returns the FXRP Asset Manager address
    function getFxrpAssetManager() public view returns (address) {
        // 4. Use the ContractRegistry library to get the AssetManagerController
        IAssetManagerController assetManagerController = ContractRegistry
            .getAssetManagerController();

        // 5. Get all the asset managers from the AssetManagerController
        IAssetManager[] memory assetManagers = assetManagerController
            .getAssetManagers();

        // 6. Iterate over the asset managers and return the FXRP Asset Manager address
        for (uint256 i = 0; i < assetManagers.length; i++) {
            IAssetManager assetManager = IAssetManager(assetManagers[i]);

            // 7. Get the settings of the asset manager
            AssetManagerSettings.Data memory settings = assetManager
                .getSettings();

            //8. return the address of the asset manager that has the pool token suffix "TXRP"
            if (
                keccak256(abi.encodePacked(settings.poolTokenSuffix)) ==
                TXRP_HASH
            ) {
                return address(assetManager);
            }
        }
        // If no asset manager is found, return the zero address
        return address(0);
    }
}
