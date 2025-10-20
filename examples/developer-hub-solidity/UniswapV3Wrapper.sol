// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// 1. Defines Uniswap V3 router functions for swaps
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

    // 2. exactInputSingle (single-hop swap)
    // https://docs.uniswap.org/contracts/v3/reference/periphery/interfaces/ISwapRouter#exactinputsingle
    function exactInputSingle(
        ExactInputSingleParams calldata params
    ) external payable returns (uint256 amountOut);
    // 3. factory (factory interface)
    function factory() external view returns (address);
}

// 4. Uniswap V3 factory interface
interface IUniswapV3Factory {
    function getPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external view returns (address pool);
}

// 5. Uniswap V3 pool interface
interface IUniswapV3Pool {
    function liquidity() external view returns (uint128);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function fee() external view returns (uint24);
}

// 6. UniswapV3Wrapper contract
contract UniswapV3Wrapper {
    using SafeERC20 for IERC20;

    // 7. Existing Uniswap V3 SwapRouter on Flare (SparkDEX)
    ISwapRouter public immutable swapRouter;
    // 8. Uniswap V3 factory
    IUniswapV3Factory public immutable factory;

    // 9. Events
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

    // 10. Constructor that initializes the swap router and factory
    constructor(address _swapRouter) {
        swapRouter = ISwapRouter(_swapRouter);
        factory = IUniswapV3Factory(ISwapRouter(_swapRouter).factory());
    }

    // 11 Check if pool exists and has liquidity
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

    // 12. Swap exact input single function
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
        // 12.1. Check if pool exists
        address poolAddress = factory.getPool(tokenIn, tokenOut, fee);
        require(poolAddress != address(0), "Pool does not exist");

        // 12.2. Check if the pool has liquidity
        IUniswapV3Pool pool = IUniswapV3Pool(poolAddress);
        require(pool.liquidity() > 0, "Pool has no liquidity");

        // 12.3. Transfer tokens from the user to this contract
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // 12.4. Approve router to spend tokens using SafeERC20
        IERC20(tokenIn).approve(address(swapRouter), amountIn);
        emit TokensApproved(tokenIn, address(swapRouter), amountIn);

        // 12.5. Prepare swap parameters
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

        // 12.6. Execute swap
        amountOut = swapRouter.exactInputSingle(params);

        // 12.7. Emit swap executed event
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
