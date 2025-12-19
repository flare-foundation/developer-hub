// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IOAppComposer} from "@layerzerolabs/oapp-evm/contracts/oapp/interfaces/IOAppComposer.sol";
import {OFTComposeMsgCodec} from "@layerzerolabs/oft-evm/contracts/libs/OFTComposeMsgCodec.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IAssetManager} from "@flarenetwork/flare-periphery-contracts/coston2/IAssetManager.sol";
import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";

contract FAssetRedeemComposer is IOAppComposer, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public immutable endpoint;

    event RedemptionTriggered(
        address indexed redeemer,
        string underlyingAddress,
        uint256 indexed amountRedeemed,
        uint256 indexed lots
    );

    error OnlyEndpoint();
    error InsufficientBalance();
    error AmountTooSmall();

    constructor(address _endpoint) Ownable(msg.sender) {
        endpoint = _endpoint;
    }

    receive() external payable {}

    function lzCompose(
        address /* _from */,
        bytes32 /* _guid */,
        bytes calldata _message,
        address /* _executor */,
        bytes calldata /* _extraData */
    ) external payable override nonReentrant {
        if (msg.sender != endpoint) revert OnlyEndpoint();

        bytes memory composeMsg = OFTComposeMsgCodec.composeMsg(_message);
        _processRedemption(composeMsg);
    }

    function _processRedemption(bytes memory composeMsg) internal {
        // 1. Decode message
        (, string memory underlyingAddress, address redeemer) = abi.decode(
            composeMsg,
            (uint256, string, address)
        );

        // 2. Get Asset Manager & fXRP Token from Registry
        IAssetManager assetManager = ContractRegistry.getAssetManagerFXRP();
        IERC20 fAssetToken = IERC20(address(assetManager.fAsset()));

        // 3. Check Actual Balance received from LayerZero
        uint256 currentBalance = fAssetToken.balanceOf(address(this));
        if (currentBalance == 0) revert InsufficientBalance();

        // 4. Calculate Lots
        uint256 lotSizeUBA = assetManager.getSettings().lotSizeAMG;
        uint256 lots = currentBalance / lotSizeUBA;

        if (lots == 0) revert AmountTooSmall();

        // 5. Calculate amount to burn
        uint256 amountToRedeem = lots * lotSizeUBA;

        // 6. Approve AssetManager to spend the tokens
        fAssetToken.forceApprove(address(assetManager), amountToRedeem);

        // 7. Redeem
        uint256 redeemedAmount = assetManager.redeem(
            lots,
            underlyingAddress,
            payable(address(0))
        );

        emit RedemptionTriggered(
            redeemer,
            underlyingAddress,
            redeemedAmount,
            lots
        );
    }

    function recoverTokens(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        IERC20(token).safeTransfer(to, amount);
    }

    function recoverNative() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
