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
import type {
  IERC20MetadataInstance,
  FAssetOFTAdapterInstance,
} from "../../typechain-types";
import { getAssetManagerFXRP } from "../utils/getters";

const IERC20Metadata = artifacts.require("IERC20Metadata");
const FAssetOFTAdapter = artifacts.require("FAssetOFTAdapter");

const CONFIG = {
  COSTON2_OFT_ADAPTER: "0xCd3d2127935Ae82Af54Fc31cCD9D3440dbF46639",
  COSTON2_COMPOSER: process.env.COSTON2_COMPOSER || "",
  HYPERLIQUID_EID: EndpointId.HYPERLIQUID_V2_TESTNET,
  EXECUTOR_GAS: 200_000,
  BRIDGE_LOTS: "1",
} as const;

type BridgeParams = {
  amountToBridge: bigint;
  recipientAddress: string;
  signerAddress: string;
  fAssetAddress: string;
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

async function getAssetManagerInfo(lots: bigint) {
  const assetManager = await getAssetManagerFXRP();
  const fAssetAddress = await assetManager.fAsset();
  const lotSizeBN = await assetManager.lotSize();
  const lotSize = BigInt(lotSizeBN.toString());
  const amountToBridge = lotSize * lots;

  return {
    fAssetAddress,
    amountToBridge: (amountToBridge * 11n) / 10n, // 10% buffer
  };
}

/**
 * Gets the signer and displays account information
 */
async function getSigner(fAssetAddress: string) {
  const accounts = await web3.eth.getAccounts();
  const signerAddress = accounts[0];

  console.log("Using account:", signerAddress);
  console.log("Token address:", fAssetAddress);

  return signerAddress;
}

/**
 * Prepares bridge parameters
 */
function prepareBridgeParams(
  signerAddress: string,
  fAssetAddress: string,
  amountToBridge: bigint,
  decimals: number,
): BridgeParams {
  const recipientAddress = signerAddress;

  console.log("\n📋 Bridge Details:");
  console.log("From: Coston2");
  console.log("To: Hyperliquid EVM Testnet");
  console.log(
    "Amount:",
    formatUnits(amountToBridge.toString(), decimals),
    "FXRP",
  );
  console.log("Recipient:", recipientAddress);

  return { amountToBridge, recipientAddress, signerAddress, fAssetAddress };
}

/**
 * Checks if user has sufficient balance to bridge
 */
async function checkBalance(
  params: BridgeParams,
  decimals: number,
): Promise<IERC20MetadataInstance> {
  const fAsset: IERC20MetadataInstance = await IERC20Metadata.at(
    params.fAssetAddress,
  );

  const balance = await fAsset.balanceOf(params.signerAddress);
  console.log(
    "\nYour FTestXRP balance:",
    formatUnits(balance.toString(), decimals),
  );

  if (BigInt(balance.toString()) < params.amountToBridge) {
    console.error("\n❌ Insufficient FTestXRP balance!");
    console.log("   Token address: " + params.fAssetAddress);
    throw new Error("Insufficient balance");
  }

  return fAsset;
}

/**
 * Approves OFT Adapter AND Composer to spend FTestXRP
 */
async function approveTokens(
  fAsset: IERC20MetadataInstance,
  amountToBridge: bigint,
  signerAddress: string,
  fAssetAddress: string,
  decimals: number,
): Promise<FAssetOFTAdapterInstance> {
  const oftAdapter: FAssetOFTAdapterInstance = await FAssetOFTAdapter.at(
    CONFIG.COSTON2_OFT_ADAPTER,
  );

  console.log("\n1️⃣ Checking OFT Adapter token address...");
  const underlyingToken = await oftAdapter.token();
  console.log("   OFT Adapter's underlying token:", underlyingToken);
  console.log("   Expected token:", fAssetAddress);
  console.log(
    "   Match:",
    underlyingToken.toLowerCase() === fAssetAddress.toLowerCase(),
  );

  console.log("\n   Approving FTestXRP for OFT Adapter...");
  console.log("   OFT Adapter address:", oftAdapter.address);
  console.log(
    "   Amount:",
    formatUnits(amountToBridge.toString(), decimals),
    "FXRP",
  );

  const amount = amountToBridge;
  await fAsset.approve(oftAdapter.address, amount.toString());
  console.log("✅ OFT Adapter approved");

  // Verify the allowance
  const allowance1 = await fAsset.allowance(signerAddress, oftAdapter.address);
  console.log(
    "   Verified allowance:",
    formatUnits(allowance1.toString(), decimals),
    "FXRP",
  );

  console.log("\n2️⃣ Approving FTestXRP for Composer...");
  console.log("   Composer address:", CONFIG.COSTON2_COMPOSER);
  await fAsset.approve(CONFIG.COSTON2_COMPOSER, amountToBridge.toString());
  console.log("✅ Composer approved");

  // Verify the allowance
  const allowance2 = await fAsset.allowance(
    signerAddress,
    CONFIG.COSTON2_COMPOSER,
  );
  console.log(
    "   Verified allowance:",
    formatUnits(allowance2.toString(), decimals),
    "FXRP",
  );

  return oftAdapter;
}

/**
 * Builds LayerZero send parameters
 */
function buildSendParams(params: BridgeParams): SendParams {
  const options = Options.newOptions().addExecutorLzReceiveOption(
    CONFIG.EXECUTOR_GAS,
    0,
  );

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
) {
  const result = await oftAdapter.quoteSend(sendParam, false);
  const nativeFee = BigInt(result.nativeFee.toString());
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
  nativeFee: bigint,
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
  // 1. Get fAsset address and amount from AssetManager
  const { fAssetAddress, amountToBridge } = await getAssetManagerInfo(
    BigInt(CONFIG.BRIDGE_LOTS),
  );

  // 2. Get signer and display account info
  const signerAddress = await getSigner(fAssetAddress);

  // 3. Get token decimals
  const fAssetToken: IERC20MetadataInstance =
    await IERC20Metadata.at(fAssetAddress);
  const decimals = Number(await fAssetToken.decimals());
  console.log("Token decimals:", decimals);

  // 4. Prepare bridge parameters
  const params = prepareBridgeParams(
    signerAddress,
    fAssetAddress,
    amountToBridge,
    decimals,
  );

  // 5. Check balance and get token contract
  const fAsset = await checkBalance(params, decimals);

  // 6. Approve tokens and get OFT adapter
  const oftAdapter = await approveTokens(
    fAsset,
    params.amountToBridge,
    signerAddress,
    fAssetAddress,
    decimals,
  );

  // 7. Build send parameters
  const sendParam = buildSendParams(params);

  // 8. Quote the fee
  const nativeFee = await quoteFee(oftAdapter, sendParam);

  // 9. Execute the bridge transaction
  await executeBridge(oftAdapter, sendParam, nativeFee, signerAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
