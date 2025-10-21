// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// 1. Defines Uniswap V3 router functions for swaps
// https://github.com/Uniswap/v3-periphery
// https://github.com/Uniswap/v3-periphery/blob/main/contracts/interfaces/ISwapRouter.sol
interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    struct ExactInputParams {
        bytes path;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
    }

    function exactInputSingle(
        ExactInputSingleParams calldata params
    ) external payable returns (uint256 amountOut);
    function factory() external view returns (address);
}

// 2. Uniswap V3 factory interface
// https://github.com/Uniswap/v3-periphery
interface IUniswapV3Factory {
    function getPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external view returns (address pool);
}

// 3. Uniswap V3 pool interface
interface IUniswapV3Pool {
    function liquidity() external view returns (uint128);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function fee() external view returns (uint24);
}

// 4. UniswapV3Wrapper contract
contract UniswapV3Wrapper {
    using SafeERC20 for IERC20;

    // 5. Existing Uniswap V3 SwapRouter on Flare (SparkDEX)
    ISwapRouter public immutable swapRouter;
    // 6. Uniswap V3 factory
    IUniswapV3Factory public immutable factory;

    // 7. Events
    event SwapExecuted(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 deadline,
        string method
    );

    event PoolChecked(
        address indexed tokenA,
        address indexed tokenB,
        uint24 fee,
        address poolAddress,
        uint128 liquidity
    );

    event TokensApproved(
        address indexed token,
        address indexed spender,
        uint256 amount
    );

    // 8. Constructor that initializes the swap router and factory
    constructor(address _swapRouter) {
        swapRouter = ISwapRouter(_swapRouter);
        factory = IUniswapV3Factory(ISwapRouter(_swapRouter).factory());
    }

    // 9. Check if pool exists and has liquidity
    function checkPool(
        address tokenA,
        address tokenB,
        uint24 fee
    )
        external
        view
        returns (address poolAddress, bool hasLiquidity, uint128 liquidity)
    {
        poolAddress = factory.getPool(tokenA, tokenB, fee);

        if (poolAddress != address(0)) {
            IUniswapV3Pool pool = IUniswapV3Pool(poolAddress);
            liquidity = pool.liquidity();
            hasLiquidity = liquidity > 0;
        }
    }

    // 10. Swap exact input single function
    // https://docs.uniswap.org/contracts/v3/reference/periphery/interfaces/ISwapRouter#exactinputsingle
    function swapExactInputSingle(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        uint256 amountIn,
        uint256 amountOutMinimum,
        uint256 deadline,
        uint160 sqrtPriceLimitX96
    ) external returns (uint256 amountOut) {
        // 10.1. Check if pool exists
        address poolAddress = factory.getPool(tokenIn, tokenOut, fee);
        require(poolAddress != address(0), "Pool does not exist");

        // 10.2. Check if the pool has liquidity
        IUniswapV3Pool pool = IUniswapV3Pool(poolAddress);
        require(pool.liquidity() > 0, "Pool has no liquidity");

        // 10.3. Transfer tokens from the user to this contract
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // 10.4 Approve router to spend tokens using SafeERC20
        IERC20(tokenIn).approve(address(swapRouter), amountIn);
        emit TokensApproved(tokenIn, address(swapRouter), amountIn);

        // 10.5. Prepare swap parameters
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: fee,
                recipient: msg.sender,
                deadline: deadline,
                amountIn: amountIn,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: sqrtPriceLimitX96
            });

        // 10.6. Execute swap
        amountOut = swapRouter.exactInputSingle(params);

        // 10.7. Emit swap executed event
        emit SwapExecuted(
            msg.sender,
            tokenIn,
            tokenOut,
            amountIn,
            amountOut,
            deadline,
            "exactInputSingle"
        );
    }
}
