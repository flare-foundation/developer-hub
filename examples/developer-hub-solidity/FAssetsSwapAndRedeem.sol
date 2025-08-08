// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

// 1. Required Imports
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IAssetManager} from "@flarenetwork/flare-periphery-contracts/coston2/IAssetManager.sol";
import {AssetManagerSettings} from "@flarenetwork/flare-periphery-contracts/coston2/data/AssetManagerSettings.sol";

// 2. Interfaces

// Uniswap V2 Router interface needed for this example to communicate with BlazeSwap
interface ISwapRouter {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    )
        external
        returns (uint256[] memory amountsSent, uint256[] memory amountsRecv);

    function getAmountsIn(
        uint256 amountOut,
        address[] calldata path
    ) external view returns (uint256[] memory amounts);
}

// Contract to swap WCFLR for FXRP and redeem FAssets
contract SwapAndRedeem {
    // 3. State Variables and Constructor

    // Uniswap V2 Router interface to communicate with BlazeSwap
    ISwapRouter public immutable router;
    // FAssets token (FXRP)
    IERC20 public immutable token;

    // Path to swap WCFLR for FXRP
    address[] public swapPath;

    constructor(address _router, address[] memory _swapPath) {
        router = ISwapRouter(_router);
        swapPath = _swapPath;

        token = IERC20(_swapPath[0]);
    }

    function getAssetManager() public view returns (IAssetManager) {
        return ContractRegistry.getAssetManagerFXRP();
    }

    // 4. Main Function: `swapAndRedeem`

    // Swap WCFLR for FXRP and redeem FAssets
    // @param _lots: number of lots to redeem
    // @param _redeemerUnderlyingAddressString: redeemer underlying address string (XRP address)
    // @return amountOut: amount of FXRP received
    // @return deadline: deadline of the swap
    // @return amountsSent: amounts sent to the router
    // @return amountsRecv: amounts received from the router
    // @return _redeemedAmountUBA: amount of FAssets redeemed
    function swapAndRedeem(
        uint256 _lots,
        string memory _redeemerUnderlyingAddressString
    )
        external
        payable
        returns (
            uint256 amountOut,
            uint256 deadline,
            uint256[] memory amountsSent,
            uint256[] memory amountsRecv,
            uint256 _redeemedAmountUBA
        )
    {
        // Calculate the amount needed to swap to FXRP and redeem
        (uint256 _amountIn, uint256 _amountOut) = calculateRedemptionAmountIn(
            _lots
        );

        require(
            token.balanceOf(msg.sender) >= _amountIn,
            "Insufficient token balance to swap"
        );

        // Check if the user has enough FXRP allowance
        require(
            token.allowance(msg.sender, address(this)) >= _amountIn,
            "Insufficient FXRP allowance"
        );

        // Transfer tokens from msg.sender to this contract to swap to FXRP
        require(
            token.transferFrom(msg.sender, address(this), _amountIn),
            "Transfer failed"
        );

        // Approve Uniswap router to spend the tokens
        require(
            token.approve(address(router), _amountIn),
            "Router approval failed"
        );

        // Set the deadline for the swap (10 minutes)
        uint256 _deadline = block.timestamp + 10 minutes;
        address[] memory path = swapPath;

        // Swap tokens to FXRP using BlazeSwap (Uniswap V2 router interface)
        (uint256[] memory _amountsSent, uint256[] memory _amountsRecv) = _swap(
            _amountIn,
            _amountOut,
            path,
            _deadline
        );

        // Redeem FAssets from FXRP to the redeemer's underlying XRPL address
        _redeemedAmountUBA = _redeem(_lots, _redeemerUnderlyingAddressString);

        return (
            _amountOut,
            _deadline,
            _amountsSent,
            _amountsRecv,
            _redeemedAmountUBA
        );
    }

    // 5. Helper Function: `calculateRedemptionAmountIn`

    // Calculate the amount needed to swap to FXRP and redeem
    // @param _lots: number of lots to redeem
    // @return amountOut: amount of FXRP received
    // @return amountIn: amount of WCFLR needed to swap
    function calculateRedemptionAmountIn(
        uint256 _lots
    ) public view returns (uint256 amountOut, uint256 amountIn) {
        AssetManagerSettings.Data memory settings = getAssetManager()
            .getSettings();
        uint256 lotSizeAMG = settings.lotSizeAMG;

        // Calculate the amount of WCFLR needed to swap to FXRP
        uint256[] memory amounts = router.getAmountsIn(
            lotSizeAMG * _lots,
            swapPath
        );

        return (amounts[0], amounts[1]);
    }

    // 6. Helper Function: `_redeem`

    // Redeem FAssets from FXRP to the redeemer's underlying XRPL address
    // @param _lots: number of lots to redeem
    // @param _redeemerUnderlyingAddressString: redeemer underlying address string (XRP address)
    // @return amountRedeemed: amount of FAssets redeemed
    function _redeem(
        uint256 _lots,
        string memory _redeemerUnderlyingAddressString
    ) internal returns (uint256) {
        return
            getAssetManager().redeem(
                _lots,
                _redeemerUnderlyingAddressString,
                // The account that is allowed to execute redemption default (besides redeemer and agent).
                // In this case it is not used
                payable(address(0))
            );
    }

    // Swap tokens to FXRP using BlazeSwap (Uniswap V2 router interface)
    // @param amountIn: amount of tokens to swap
    // @param amountOutMin: minimum amount of FXRP received
    // @param path: path to swap tokens
    // @param deadline: deadline of the swap
    // @return amountsSent: amounts sent to the router
    // @return amountsRecv: amounts received from the router
    function _swap(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] memory path,
        uint256 deadline
    )
        internal
        returns (uint256[] memory amountsSent, uint256[] memory amountsRecv)
    {
        (amountsSent, amountsRecv) = router.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            address(this),
            deadline
        );

        return (amountsSent, amountsRecv);
    }
}
