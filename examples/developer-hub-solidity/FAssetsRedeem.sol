// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "flare-periphery-contracts-fassets-test/coston2/ContractRegistry.sol";
import {IAssetManager} from "flare-periphery-contracts-fassets-test/coston2/IAssetManager.sol";
import {AssetManagerSettings} from "flare-periphery-contracts-fassets-test/coston2/data/AssetManagerSettings.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {RedemptionRequestInfo} from "flare-periphery-contracts-fassets-test/coston2/data/RedemptionRequestInfo.sol";

contract FAssetsRedeem {
    // 1. Redeem FAssets
    function redeem(
        uint256 _lots,
        string memory _redeemerUnderlyingAddressString
    ) public returns (uint256) {
        // Calculate the amount of FXRP needed for redemption
        IAssetManager assetManager = ContractRegistry.getAssetManagerFXRP();
        AssetManagerSettings.Data memory settings = assetManager.getSettings();
        uint256 amountToRedeem = settings.lotSizeAMG * _lots;

        IERC20 fAssetToken = IERC20(getFXRPAddress());
        // Transfer FXRP from caller to AssetManager
        fAssetToken.transferFrom(msg.sender, address(this), amountToRedeem);

        uint256 redeemedAmountUBA = assetManager.redeem(
            _lots,
            _redeemerUnderlyingAddressString,
            payable(address(0))
        );

        return redeemedAmountUBA;
    }

    function getFXRPAddress() public view returns (address) {
        IAssetManager assetManager = ContractRegistry.getAssetManagerFXRP();
        return address(assetManager.fAsset());
    }

    // 2. Get the AssetManager settings
    function getSettings()
        public
        view
        returns (uint256 lotSizeAMG, uint256 assetDecimals)
    {
        IAssetManager assetManager = ContractRegistry.getAssetManagerFXRP();
        AssetManagerSettings.Data memory settings = assetManager.getSettings();
        lotSizeAMG = settings.lotSizeAMG;
        assetDecimals = settings.assetDecimals;

        return (lotSizeAMG, assetDecimals);
    }

    // 3. Get the redemption request info
    function getRedemptionRequestInfo(
        uint256 _redemptionTicketId
    ) public view returns (RedemptionRequestInfo.Data memory) {
        IAssetManager assetManager = ContractRegistry.getAssetManagerFXRP();

        return assetManager.redemptionRequestInfo(_redemptionTicketId);
    }
}
