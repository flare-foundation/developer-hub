// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

// 1. Import the Flare Contract Registry
import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";

// 2. Import the AssetManager interface
import {IAssetManager} from "@flarenetwork/flare-periphery-contracts/coston2/IAssetManager.sol";

// 3. Contract for accessing FAssets settings from the asset manager
contract FAssetsSettings {
    // 4. Read how many decimal places FXRP uses.
    // FAssets Operation Parameters https://dev.flare.network/fassets/operational-parameters
    function getAssetDecimals() public view returns (uint8 assetDecimals) {
        // 5. Get the AssetManager contract from the Flare Contract Registry
        IAssetManager assetManager = ContractRegistry.getAssetManagerFXRP();

        // 6. Read asset decimals from the AssetManager settings
        assetDecimals = assetManager.getSettings().assetDecimals;

        return assetDecimals;
    }
}
