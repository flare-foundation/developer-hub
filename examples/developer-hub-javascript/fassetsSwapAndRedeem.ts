import { run } from "hardhat";

import { SwapAndRedeemInstance } from "../../typechain-types";
import { ERC20Instance } from "../../typechain-types/@openzeppelin/contracts/token/ERC20/ERC20";

// AssetManager address on Songbird Testnet Coston network
const ASSET_MANAGER_ADDRESS = "0x56728e46908fB6FcC5BCD2cc0c0F9BB91C3e4D34";
const LOTS_TO_REDEEM = 1;
const UNDERLYING_ADDRESS = "rSHYuiEvsYsKR8uUHhBTuGP5zjRcGt4nm";
// BlazeSwap router address on Songbird Testnet Coston network
const SWAP_ROUTER_ADDRESS = "0xf0D01450C037DB2903CF5Ff638Dd1e2e6B0EEDF4";
const SWAP_PATH = [
  "0x767b25A658E8FC8ab6eBbd52043495dB61b4ea91", // WCFLR
  "0x36be8f2e1CC3339Cf6702CEfA69626271C36E2fd", // FXRP
];

async function deployAndVerifyContract() {
  const SwapAndRedeem = artifacts.require("SwapAndRedeem");
  const args = [SWAP_ROUTER_ADDRESS, ASSET_MANAGER_ADDRESS, SWAP_PATH];
  const swapAndRedeem: SwapAndRedeemInstance = await SwapAndRedeem.new(...args);

  const fassetsSwapAndRedeemAddress = await swapAndRedeem.address;

  try {
    await run("verify:verify", {
      address: fassetsSwapAndRedeemAddress,
      constructorArguments: args,
    });
  } catch (e: any) {
    console.log(e);
  }

  console.log("FAssetsSwapAndRedeem deployed to:", fassetsSwapAndRedeemAddress);

  return swapAndRedeem;
}

async function main() {
  const swapAndRedeem: SwapAndRedeemInstance = await deployAndVerifyContract();

  const swapAndRedeemAddress = await swapAndRedeem.address;
  const amounts = await swapAndRedeem.calculateRedemptionAmountIn(LOTS_TO_REDEEM);
  const amountIn = amounts.amountIn;
  const amountOut = amounts.amountOut;
  console.log("Amount of tokens out (FXRP): ", amountOut.toString());
  console.log("Amount of tokens in (WCFLR): ", amountIn.toString());

  // Get WCFLR token
  const ERC20 = artifacts.require("ERC20");
  const wcflr: ERC20Instance = await ERC20.at(SWAP_PATH[0]);

  const approveTx = await wcflr.approve(swapAndRedeemAddress, amountOut);
  console.log("Approve transaction: ", approveTx);

  // Swap and redeem
  const swapResult = await swapAndRedeemAddress.swapAndRedeem(LOTS_TO_REDEEM, UNDERLYING_ADDRESS);
  console.log("Swap and redeem transaction: ", swapResult);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
