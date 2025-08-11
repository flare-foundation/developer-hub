// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

// 1. Import the Flare Contract Registry
import {ContractRegistry} from "flare-periphery-contracts-fassets-test/coston2/ContractRegistry.sol";

// 2. Import the AssetManager interface
import {IAssetManager} from "flare-periphery-contracts-fassets-test/coston2/IAssetManager.sol";

// 3. Contract for accessing FAssets settings from the asset manager
contract FAssetsSettings {
    // 4. This function gets two important numbers from the asset manager settings:
    // * lotSizeAMG: The smallest amount you can trade (in AMG units)
    // * assetDecimals: How many decimal places the asset uses
    // FAssets Operation Parameters https://dev.flare.network/fassets/operational-parameters
    function getLotSize()
        public
        view
        returns (uint64 lotSizeAMG, uint8 assetDecimals)
    {
        // 5. Get the AssetManager contract from the Flare Contract Registry
        IAssetManager assetManager = ContractRegistry.getAssetManagerFXRP();

        // 6. Get the lot size and asset decimals from the AssetManager contract
        lotSizeAMG = assetManager.getSettings().lotSizeAMG;
        assetDecimals = assetManager.getSettings().assetDecimals;

        return (lotSizeAMG, assetDecimals);
    }
}
