// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IAssetManager} from "@flarenetwork/flare-periphery-contracts/coston/IAssetManager.sol";
import {AssetManagerSettings} from "@flarenetwork/flare-periphery-contracts/coston/userInterfaces/data/AssetManagerSettings.sol";

contract FAssetsRedeem {
    // 1. Use the AssetManager contract
    IAssetManager public immutable assetManager;

    constructor(address _assetManager) {
        assetManager = IAssetManager(_assetManager);
    }

    // 2. Get the AssetManager settings
    function getSettings() public view returns (uint256 lotSizeAMG, uint256 assetDecimals) {
        AssetManagerSettings.Data memory settings = assetManager.getSettings();
        lotSizeAMG = settings.lotSizeAMG;
        assetDecimals = settings.assetDecimals;

        return (lotSizeAMG, assetDecimals);
    }

    // 3. Redeem FAssets
    function redeem(
        uint256 _lots,
        string memory _redeemerUnderlyingAddressString
    ) public returns (uint256) {
        uint256 redeemedAmountUBA = 
            assetManager.redeem(
                _lots,
                _redeemerUnderlyingAddressString,
                payable(address(0))
            );
            
        return redeemedAmountUBA;
    }
}
