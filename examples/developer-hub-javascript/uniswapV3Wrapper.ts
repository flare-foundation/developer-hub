import { ethers, run } from "hardhat";
import { web3 } from "hardhat";

import { UniswapV3WrapperInstance } from "../../typechain-types";
import { getAssetManagerFXRP } from "../utils/getters";
import { ERC20Instance } from "../../typechain-types/@openzeppelin/contracts/token/ERC20/ERC20";

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

// 7. The main function to execute the swap
async function main() {
  // 8. Deploy and verify the UniswapV3 wrapper smart contract and get its address
  const uniswapV3Wrapper: UniswapV3WrapperInstance =
    await deployAndVerifyContract();
  const uniswapV3WrapperAddress = await uniswapV3Wrapper.address;

  // 9. Get the deployer account
  const accounts = await web3.eth.getAccounts();
  const deployer = accounts[0];

  console.log("Deployer:", deployer);
  console.log("Total accounts available:", accounts.length);

  // 10. Get the FXRP address on Flare (from the Asset Manager)
  const assetManager = await getAssetManagerFXRP();
  const FXRP = await assetManager.fAsset();

  console.log("USDT0:", USDT0);
  console.log("FXRP:", FXRP);
  console.log("Fee:", FEE);
  console.log("Amount In:", AMOUNT_IN.toString());
  console.log("Amount Out Min:", AMOUNT_OUT_MIN.toString());
  console.log("");

  // 11. Define the USDT0 and FXRP token addresses
  const usdt0: ERC20Instance = await ERC20.at(USDT0);
  const fxrp: ERC20Instance = await ERC20.at(FXRP);

  // 12. Check initial balances
  const initialUsdt0Balance = BigInt(
    (await usdt0.balanceOf(deployer)).toString(),
  );
  const initialFxrpBalance = BigInt(
    (await fxrp.balanceOf(deployer)).toString(),
  );

  console.log("Initial USDT0 balance:", initialUsdt0Balance.toString());
  console.log("Initial FXRP balance:", initialFxrpBalance.toString());

  // 13. Check if there is enough USDT0 to perform the swap
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
    return;
  }

  // 14 Check Uniswap V3 pool using wrapper if it exists and has liquidity
  console.log("\n=== Step 1: Pool Verification ===");
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
    return;
  }

  if (!hasLiquidity) {
    console.log("❌ Pool exists but has no liquidity");
    return;
  }

  console.log("✅ Pool verification successful!");

  // 15. Approve USDT0 to wrapper contract to spend the tokens
  console.log("\n=== Step 2: Token Approval ===");
  const approveTx = await usdt0.approve(
    uniswapV3WrapperAddress,
    AMOUNT_IN.toString(),
  );
  console.log("✅ USDT0 approved to wrapper contract", approveTx);

  // 16. Execute swap using the Uniswap V3 wrapper contract
  console.log("\n=== Step 3: Execute SparkDEX Swap ===");
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
    0, // sqrtPriceLimitX96 = 0 (no limit)
  );

  console.log("Transaction submitted:", swapTx);

  await swapTx.receipt;
  console.log("✅ SparkDEX swap executed successfully!");

  // 17. Extract amount out from events or calculate from balance change
  const finalFxrpBalance = BigInt((await fxrp.balanceOf(deployer)).toString());
  const amountOut = finalFxrpBalance - initialFxrpBalance;
  console.log("Amount out:", amountOut.toString());

  // 18. Check final balances to verify the swap
  console.log("\n=== Step 4: Final Balances ===");
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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
