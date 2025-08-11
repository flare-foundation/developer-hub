// 1. Dependencies and constants
import { run } from "hardhat";

import { SwapAndRedeemInstance } from "../../typechain-types";
import { ERC20Instance } from "../../typechain-types/@openzeppelin/contracts/token/ERC20/ERC20";

import { getAssetManagerFXRP } from "../utils/getters";

// yarn hardhat run scripts/fassets/swapAndRedeem.ts --network coston2

const LOTS_TO_REDEEM = 1;
const UNDERLYING_ADDRESS = "rSHYuiEvsYsKR8uUHhBTuGP5zjRcGt4nm";

// BlazeSwap router address on Flare Testnet Coston2 network
const SWAP_ROUTER_ADDRESS = "0x8D29b61C41CF318d15d031BE2928F79630e068e6";
const WC2FLR = "0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273";

const SwapAndRedeem = artifacts.require("SwapAndRedeem");

// 2. Deploy and verify the `SwapAndRedeem` smart contract
async function deployAndVerifyContract() {
  const assetManager = await getAssetManagerFXRP();
  const fassetAddress = await assetManager.fAsset();
  const swapPath = [WC2FLR, fassetAddress];

  const args = [SWAP_ROUTER_ADDRESS, swapPath];
  const swapAndRedeem: SwapAndRedeemInstance = await SwapAndRedeem.new(...args);

  const fassetsSwapAndRedeemAddress = await swapAndRedeem.address;

  try {
    await run("verify:verify", {
      address: fassetsSwapAndRedeemAddress,
      constructorArguments: args,
    });
  } catch (e) {
    console.log(e);
  }

  console.log("FAssetsSwapAndRedeem deployed to:", fassetsSwapAndRedeemAddress);

  return swapAndRedeem;
}

async function main() {
  // 2. Deploy and verify the `SwapAndRedeem` smart contract
  const swapAndRedeem: SwapAndRedeemInstance = await deployAndVerifyContract();

  // 3. Calculate Required Amounts
  const swapAndRedeemAddress = await swapAndRedeem.address;
  const amounts =
    await swapAndRedeem.calculateRedemptionAmountIn(LOTS_TO_REDEEM);
  const amountIn = amounts.amountIn;
  const amountOut = amounts.amountOut;
  console.log("Amount of tokens out (FXRP): ", amountOut.toString());
  console.log("Amount of tokens in (WCFLR): ", amountIn.toString());

  // 4. Approve spending WCFLR tokens
  // Get WCFLR token
  const ERC20 = artifacts.require("ERC20");
  const wcflr: ERC20Instance = await ERC20.at(WC2FLR);

  const approveTx = await wcflr.approve(swapAndRedeemAddress, amountOut);
  console.log("Approve transaction: ", approveTx);

  // 5. Swap WCFLR for FXRP and redeem to underlying XRP token on XRP Ledger
  const swapResult = await swapAndRedeem.swapAndRedeem(
    LOTS_TO_REDEEM,
    UNDERLYING_ADDRESS,
  );
  console.log("Swap and redeem transaction: ", swapResult);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
