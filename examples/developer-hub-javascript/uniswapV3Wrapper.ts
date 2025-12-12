import { ethers, run } from "hardhat";
import { web3 } from "hardhat";

import type { UniswapV3WrapperInstance } from "../../typechain-types";
import { getAssetManagerFXRP } from "../utils/getters";
import type { ERC20Instance } from "../../typechain-types/@openzeppelin/contracts/token/ERC20/ERC20";

// yarn hardhat run scripts/fassets/uniswapV3Wrapper.ts --network flare

// 1. Contract artifacts
const UniswapV3Wrapper = artifacts.require("UniswapV3Wrapper");
const ERC20 = artifacts.require("ERC20");

// 2. Flare Uniswap V3 addresses (SparkDEX)
// https://docs.sparkdex.ai/additional-information/smart-contract-overview/v2-v3.1-dex
const SWAP_ROUTER = "0x8a1E35F5c98C4E85B36B7B253222eE17773b2781";

// 3. USDT0 token addresses on Flare
// https://docs.usdt0.to/technical-documentation/developer#flare-eid-30295
const USDT0 = "0xe7cd86e13AC4309349F30B3435a9d337750fC82D";

// 4. Pool fee tier
const FEE = 500; // 0.05%

// 5. Swap parameters
const AMOUNT_IN = ethers.parseUnits("1.0", 6); // 1 USDT0 (6 decimals)
const AMOUNT_OUT_MIN = ethers.parseUnits("0.3", 6); // 0.3 FXRP minimum expected (6 decimals)

// 6. Function to deploy and verify the smart contract
async function deployAndVerifyContract() {
  const args = [SWAP_ROUTER];
  const uniswapV3Wrapper: UniswapV3WrapperInstance = await UniswapV3Wrapper.new(
    ...args,
  );

  const uniswapV3WrapperAddress = await uniswapV3Wrapper.address;

  try {
    await run("verify:verify", {
      address: uniswapV3WrapperAddress,
      constructorArguments: args,
    });
  } catch (e: unknown) {
    console.log(e);
  }

  console.log("UniswapV3Wrapper deployed to:", uniswapV3WrapperAddress);

  return uniswapV3Wrapper;
}

// 7. Function to setup and initialize tokens
async function setUpAndInitializeTokens() {
  const accounts = await web3.eth.getAccounts();
  const deployer = accounts[0];

  console.log("Deployer:", deployer);
  console.log("Total accounts available:", accounts.length);

  // FXRP address on Flare (from asset manager)
  const assetManager = await getAssetManagerFXRP();
  const FXRP = await assetManager.fAsset();

  console.log("USDT0:", USDT0);
  console.log("FXRP:", FXRP);
  console.log("Fee:", FEE);
  console.log("Amount In:", AMOUNT_IN.toString());
  console.log("Amount Out Min:", AMOUNT_OUT_MIN.toString());
  console.log("");

  const usdt0: ERC20Instance = await ERC20.at(USDT0);
  const fxrp: ERC20Instance = await ERC20.at(FXRP);

  // Check initial balances
  const initialUsdt0Balance = BigInt(
    (await usdt0.balanceOf(deployer)).toString(),
  );
  const initialFxrpBalance = BigInt(
    (await fxrp.balanceOf(deployer)).toString(),
  );

  console.log("Initial USDT0 balance:", initialUsdt0Balance.toString());
  console.log("Initial FXRP balance:", initialFxrpBalance.toString());

  // Check if there are enough USDT0
  const amountInBN = AMOUNT_IN;
  if (initialUsdt0Balance < amountInBN) {
    console.log(
      "❌ Insufficient USDT0 balance. Need:",
      AMOUNT_IN.toString(),
      "Have:",
      initialUsdt0Balance.toString(),
    );
    console.log(
      "Please ensure you have sufficient USDT0 tokens to perform the swap.",
    );
    throw new Error("Insufficient USDT0 balance");
  }

  return { deployer, usdt0, fxrp, initialUsdt0Balance, initialFxrpBalance };
}

// 8. Function to verify the pool and liquidity
async function verifyPoolAndLiquidity(
  uniswapV3Wrapper: UniswapV3WrapperInstance,
) {
  console.log("\n=== Pool Verification ===");
  const assetManager = await getAssetManagerFXRP();
  const FXRP = await assetManager.fAsset();

  const poolInfo = await uniswapV3Wrapper.checkPool(USDT0, FXRP, FEE);
  console.log("Pool info:", poolInfo);
  const poolAddress = poolInfo.poolAddress;
  const hasLiquidity = poolInfo.hasLiquidity;
  const liquidity = poolInfo.liquidity;

  console.log("Pool Address:", poolAddress);
  console.log("Has Liquidity:", hasLiquidity);
  console.log("Liquidity:", liquidity.toString());

  if (poolAddress === "0x0000000000000000000000000000000000000000") {
    console.log("❌ Pool does not exist for this token pair and fee tier");
    console.log("Please check if the USDT0/FXRP pool exists on SparkDEX");
    throw new Error("Pool does not exist");
  }

  if (!hasLiquidity) {
    console.log("❌ Pool exists but has no liquidity");
    throw new Error("Pool has no liquidity");
  }

  console.log("✅ Pool verification successful!");
  return { poolAddress, hasLiquidity, liquidity };
}

// 9. Function to approve USDT0 for the swap
async function approveUsdt0ForSwap(
  usdt0: ERC20Instance,
  uniswapV3WrapperAddress: string,
) {
  console.log("\n=== Token Approval ===");
  const approveTx = await usdt0.approve(
    uniswapV3WrapperAddress,
    AMOUNT_IN.toString(),
  );
  console.log("✅ USDT0 approved to wrapper contract", approveTx);
  return approveTx;
}

// 10. Function to execute the SparkDEX swap
async function executeSparkDexSwap(uniswapV3Wrapper: UniswapV3WrapperInstance) {
  console.log("\n=== Execute SparkDEX Swap ===");
  const assetManager = await getAssetManagerFXRP();
  const FXRP = await assetManager.fAsset();

  const deadline = Math.floor(Date.now() / 1000) + 20 * 60; // 20 minutes
  console.log("Deadline:", deadline);

  console.log("Executing SparkDEX swap using wrapper...");
  const swapTx = await uniswapV3Wrapper.swapExactInputSingle(
    USDT0,
    FXRP,
    FEE,
    AMOUNT_IN.toString(),
    AMOUNT_OUT_MIN.toString(),
    deadline,
    0, // sqrtPriceLimitX96 = 0 (no limit for the price)
    // https://docs.uniswap.org/contracts/v3/guides/swaps/single-swaps#swap-input-parameters
  );

  console.log("Transaction submitted:", swapTx);

  const swapReceipt = await swapTx.receipt;
  console.log("✅ SparkDEX swap executed successfully!");

  return { swapTx, swapReceipt };
}

// 11. Function to check the final balances
async function checkFinalBalances(
  usdt0: ERC20Instance,
  fxrp: ERC20Instance,
  deployer: string,
  initialUsdt0Balance: bigint,
  initialFxrpBalance: bigint,
) {
  console.log("\n=== Final Balances ===");
  const finalUsdt0Balance = BigInt(
    (await usdt0.balanceOf(deployer)).toString(),
  );
  const finalFxrpBalanceAfter = BigInt(
    (await fxrp.balanceOf(deployer)).toString(),
  );

  console.log("Final USDT0 balance:", finalUsdt0Balance.toString());
  console.log("Final FXRP balance:", finalFxrpBalanceAfter.toString());
  console.log(
    "USDT0 spent:",
    (initialUsdt0Balance - finalUsdt0Balance).toString(),
  );
  console.log(
    "FXRP received:",
    (finalFxrpBalanceAfter - initialFxrpBalance).toString(),
  );

  return { finalUsdt0Balance, finalFxrpBalanceAfter };
}

// 12. The main function to execute the complete swap logic and verify the results
async function main() {
  const uniswapV3Wrapper: UniswapV3WrapperInstance =
    await deployAndVerifyContract();

  const { deployer, usdt0, fxrp, initialUsdt0Balance, initialFxrpBalance } =
    await setUpAndInitializeTokens();

  await verifyPoolAndLiquidity(uniswapV3Wrapper);

  await approveUsdt0ForSwap(usdt0, uniswapV3Wrapper.address);

  await executeSparkDexSwap(uniswapV3Wrapper);

  await checkFinalBalances(
    usdt0,
    fxrp,
    deployer,
    initialUsdt0Balance,
    initialFxrpBalance,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
