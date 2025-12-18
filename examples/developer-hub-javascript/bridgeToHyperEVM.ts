/**
 * Bridge FXRP from Coston2 to Hyperliquid EVM Testnet
 *
 * This script helps you get FXRP on Hyperliquid EVM Testnet by bridging from Coston2
 *
 * Prerequisites:
 * - FTestXRP tokens on Coston2
 * - CFLR on Coston2 for gas
 *
 * Usage:
 * yarn hardhat run scripts/fassets/bridgeToHyperEVM.ts --network coston2
 */

import { web3 } from "hardhat";
import { formatUnits } from "ethers";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import {
  IERC20Instance,
  FAssetOFTAdapterInstance,
} from "../../typechain-types";
import { getAssetManagerFXRP } from "../utils/getters";

// Get the contracts
const IERC20 = artifacts.require("IERC20");
const FAssetOFTAdapter = artifacts.require("FAssetOFTAdapter");

const CONFIG = {
  COSTON2_FTESTXRP: "0x8b4abA9C4BD7DD961659b02129beE20c6286e17F",
  COSTON2_OFT_ADAPTER: "0xCd3d2127935Ae82Af54Fc31cCD9D3440dbF46639",
  COSTON2_COMPOSER: process.env.COSTON2_COMPOSER || "",
  HYPERLIQUID_EID: EndpointId.HYPERLIQUID_V2_TESTNET, // Hyperliquid testnet EID
  EXECUTOR_GAS: 200_000,
  BRIDGE_LOTS: "1",
} as const;

type BridgeParams = {
  amountToBridge: bigint;
  recipientAddress: string;
  signerAddress: string;
};

type SendParams = {
  dstEid: EndpointId;
  to: string;
  amountLD: string;
  minAmountLD: string;
  extraOptions: string;
  composeMsg: string;
  oftCmd: string;
};

async function calculateAmountToBridge(lots: bigint) {
  const assetManager = await getAssetManagerFXRP();
  const lotSize = await assetManager.lotSize();
  const amountToBridge = lotSize * lots;

  return amountToBridge * BigInt(1.1); // 10% buffer
}

/**
 * Gets the signer and displays account information
 */
async function getSigner() {
  const accounts = await web3.eth.getAccounts();
  const signerAddress = accounts[0];

  console.log("Using account:", signerAddress);
  console.log("Token address:", CONFIG.COSTON2_FTESTXRP);

  return signerAddress;
}

/**
 * Prepares bridge parameters
 */
async function prepareBridgeParams(
  signerAddress: string,
): Promise<BridgeParams> {
  const amountToBridge = await calculateAmountToBridge(
    BigInt(CONFIG.BRIDGE_LOTS),
  );
  const recipientAddress = signerAddress;

  console.log("\n📋 Bridge Details:");
  console.log("From: Coston2");
  console.log("To: Hyperliquid EVM Testnet");
  console.log("Amount:", formatUnits(amountToBridge.toString(), 6), "FXRP");
  console.log("Recipient:", recipientAddress);

  return { amountToBridge, recipientAddress, signerAddress };
}

/**
 * Checks if user has sufficient balance to bridge
 */
async function checkBalance(params: BridgeParams): Promise<IERC20Instance> {
  const fTestXRP: IERC20Instance = await IERC20.at(CONFIG.COSTON2_FTESTXRP);

  const balance = await fTestXRP.balanceOf(params.signerAddress);
  console.log("\nYour FTestXRP balance:", formatUnits(balance.toString(), 6));

  if (BigInt(balance.toString()) > params.amountToBridge) {
    console.error("\n❌ Insufficient FTestXRP balance!");
    console.log("   Token address: " + CONFIG.COSTON2_FTESTXRP);
    throw new Error("Insufficient balance");
  }

  return fTestXRP;
}

/**
 * Approves OFT Adapter AND Composer to spend FTestXRP
 */
async function approveTokens(
  fTestXRP: IERC20Instance,
  amountToBridge: bigint,
  signerAddress: string,
): Promise<FAssetOFTAdapterInstance> {
  const oftAdapter: FAssetOFTAdapterInstance = await FAssetOFTAdapter.at(
    CONFIG.COSTON2_OFT_ADAPTER,
  );

  console.log("\n1️⃣ Checking OFT Adapter token address...");
  const innerToken = await oftAdapter.token();
  console.log("   OFT Adapter's inner token:", innerToken);
  console.log("   Expected token:", CONFIG.COSTON2_FTESTXRP);
  console.log(
    "   Match:",
    innerToken.toLowerCase() === CONFIG.COSTON2_FTESTXRP.toLowerCase(),
  );

  console.log("\n   Approving FTestXRP for OFT Adapter...");
  console.log("   OFT Adapter address:", oftAdapter.address);
  console.log("   Amount:", formatUnits(amountToBridge.toString(), 6), "FXRP");

  // Approve a much larger amount to account for any potential fees
  const largeAmount = amountToBridge * BigInt(2);
  await fTestXRP.approve(oftAdapter.address, largeAmount.toString());
  console.log("✅ OFT Adapter approved");

  // Verify the allowance
  const oftAdapterAllowance = await fTestXRP.allowance(
    signerAddress,
    oftAdapter.address,
  );
  console.log(
    "   Verified allowance:",
    formatUnits(oftAdapterAllowance.toString(), 6),
    "FXRP",
  );

  console.log("\n2️⃣ Approving FTestXRP for Composer...");
  console.log("   Composer address:", CONFIG.COSTON2_COMPOSER);
  await fTestXRP.approve(CONFIG.COSTON2_COMPOSER, amountToBridge.toString());
  console.log("✅ Composer approved");

  // Verify the allowance
  const composerAllowance = await fTestXRP.allowance(
    signerAddress,
    CONFIG.COSTON2_COMPOSER,
  );
  console.log(
    "   Verified allowance:",
    formatUnits(composerAllowance.toString(), 6),
    "FXRP",
  );

  return oftAdapter;
}

/**
 * Builds LayerZero send parameters
 */
function buildSendParams(params: BridgeParams): SendParams {
  // See https://docs.layerzero.network/v2/tools/sdks/options#generating-options
  const options = Options.newOptions().addExecutorLzReceiveOption(
    CONFIG.EXECUTOR_GAS,
    0,
  );
  // Review send parameters here: https://docs.layerzero.network/v2/developers/evm/oft/oft-patterns-extensions#:~:text=Sending%20Token%E2%80%8B,composeMsg%20in%20bytes.
  return {
    dstEid: CONFIG.HYPERLIQUID_EID as EndpointId,
    to: web3.utils.padLeft(params.recipientAddress, 64), // 32 bytes = 64 hex chars
    amountLD: params.amountToBridge.toString(),
    minAmountLD: params.amountToBridge.toString(),
    extraOptions: options.toHex(),
    composeMsg: "0x",
    oftCmd: "0x",
  };
}

/**
 * Quotes the LayerZero fee for the bridge transaction
 */
async function quoteFee(
  oftAdapter: FAssetOFTAdapterInstance,
  sendParam: SendParams,
): Promise<BN> {
  const result = await oftAdapter.quoteSend(sendParam, false);
  const nativeFee = web3.utils.toBN(result.nativeFee.toString());
  console.log(
    "\n3️⃣ LayerZero Fee:",
    formatUnits(nativeFee.toString(), 18),
    "C2FLR",
  );
  return nativeFee;
}

/**
 * Executes the bridge transaction
 */
async function executeBridge(
  oftAdapter: FAssetOFTAdapterInstance,
  sendParam: SendParams,
  nativeFee: BN,
  signerAddress: string,
): Promise<void> {
  console.log("\n4️⃣ Sending FXRP to Hyperliquid EVM Testnet...");

  const tx = await oftAdapter.send(
    sendParam,
    { nativeFee: nativeFee.toString(), lzTokenFee: "0" },
    signerAddress,
    {
      value: nativeFee.toString(),
    },
  );

  console.log("Transaction sent:", tx.tx);
  console.log("✅ Confirmed in block:", tx.receipt.blockNumber);

  console.log(
    "\n🎉 Success! Your FXRP is on the way to Hyperliquid EVM Testnet!",
  );
  console.log("\nTrack your transaction:");
  console.log(`https://testnet.layerzeroscan.com/tx/${tx.tx}`);
  console.log(
    "\nIt may take a few minutes to arrive on Hyperliquid EVM Testnet.",
  );
}

async function main() {
  // 1. Get signer and display account info
  const signerAddress = await getSigner();

  // 2. Prepare bridge parameters
  const params = await prepareBridgeParams(signerAddress);

  // 3. Check balance and get token contract
  const fTestXRP = await checkBalance(params);

  // 4. Approve tokens and get OFT adapter
  const oftAdapter = await approveTokens(
    fTestXRP,
    params.amountToBridge,
    signerAddress,
  );

  // 5. Build send parameters
  const sendParam = buildSendParams(params);

  // 6. Quote the fee
  const nativeFee = await quoteFee(oftAdapter, sendParam);

  // 7. Execute the bridge transaction
  await executeBridge(oftAdapter, sendParam, nativeFee, signerAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
