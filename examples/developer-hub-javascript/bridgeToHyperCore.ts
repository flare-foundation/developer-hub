/**
 * Bridge FXRP from Coston2 to Hyperliquid HyperCore
 *
 * This script bridges FXRP from Coston2 to HyperEVM with a compose message
 * that triggers automatic transfer to HyperCore (the trading layer).
 *
 * Flow:
 * 1. Send FXRP via LayerZero from Coston2 to HyperEVM
 * 2. LayerZero delivers to HyperliquidComposer on HyperEVM
 * 3. Composer transfers tokens to system address, crediting them on HyperCore
 *
 * Prerequisites:
 * - FTestXRP tokens on Coston2
 * - CFLR on Coston2 for gas
 * - HyperliquidComposer deployed on HyperEVM
 *
 * Usage:
 * yarn hardhat run scripts/fassets/bridgeToHyperCore.ts --network coston2
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
  HYPERLIQUID_COMPOSER: process.env.HYPERLIQUID_COMPOSER || "",
  HYPERLIQUID_EID: EndpointId.HYPERLIQUID_V2_TESTNET,
  EXECUTOR_GAS: 200_000,
  COMPOSE_GAS: 300_000,
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

/**
 * Validates that required configuration is set
 */
function validateConfig() {
  if (!CONFIG.HYPERLIQUID_COMPOSER) {
    throw new Error(
      "HYPERLIQUID_COMPOSER not set in .env!\n" +
        "   Deploy HyperliquidComposer first on HyperEVM:\n" +
        "   yarn hardhat run scripts/fassets/deployHyperliquidComposer.ts --network hyperliquidTestnet",
    );
  }
  console.log("✓ HyperliquidComposer configured:", CONFIG.HYPERLIQUID_COMPOSER);
}

/**
 * Gets fAsset address and calculates amount from AssetManager
 */
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
  console.log("To: Hyperliquid HyperCore (via HyperEVM)");
  console.log(
    "Amount:",
    formatUnits(amountToBridge.toString(), decimals),
    "FXRP",
  );
  console.log("HyperCore Recipient:", recipientAddress);

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
 * Approves OFT Adapter to spend FTestXRP
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

  await fAsset.approve(oftAdapter.address, amountToBridge.toString());
  console.log("✅ OFT Adapter approved");

  // Verify the allowance
  const allowance = await fAsset.allowance(signerAddress, oftAdapter.address);
  console.log(
    "   Verified allowance:",
    formatUnits(allowance.toString(), decimals),
    "FXRP",
  );

  return oftAdapter;
}

/**
 * Encodes the compose message for HyperCore transfer
 * Format: (amount, recipientAddress)
 */
function encodeComposeMessage(params: BridgeParams): string {
  // Encode: (amount, recipient) - recipient will receive tokens on HyperCore
  const composeMsg = web3.eth.abi.encodeParameters(
    ["uint256", "address"],
    [params.amountToBridge.toString(), params.recipientAddress],
  );

  console.log("\n2️⃣ Compose message encoded for HyperCore transfer");

  return composeMsg;
}

/**
 * Builds LayerZero options with compose support
 */
function buildComposeOptions(): string {
  const options = Options.newOptions()
    .addExecutorLzReceiveOption(CONFIG.EXECUTOR_GAS, 0)
    .addExecutorComposeOption(0, CONFIG.COMPOSE_GAS, 0);

  return options.toHex();
}

/**
 * Builds LayerZero send parameters with compose message
 */
function buildSendParams(
  params: BridgeParams,
  composeMsg: string,
  options: string,
): SendParams {
  return {
    dstEid: CONFIG.HYPERLIQUID_EID as EndpointId,
    to: web3.utils.padLeft(CONFIG.HYPERLIQUID_COMPOSER, 64), // Send to composer, not recipient
    amountLD: params.amountToBridge.toString(),
    minAmountLD: params.amountToBridge.toString(),
    extraOptions: options,
    composeMsg: composeMsg,
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
 * Executes the bridge transaction with compose
 */
async function executeBridge(
  oftAdapter: FAssetOFTAdapterInstance,
  sendParam: SendParams,
  nativeFee: bigint,
  signerAddress: string,
): Promise<void> {
  console.log("\n4️⃣ Sending FXRP to Hyperliquid HyperCore...");
  console.log("   Via HyperliquidComposer:", CONFIG.HYPERLIQUID_COMPOSER);

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
    "\n🎉 Success! Your FXRP is on the way to Hyperliquid HyperCore!",
  );
  console.log("\nTrack your transaction:");
  console.log(`https://testnet.layerzeroscan.com/tx/${tx.tx}`);
  console.log(
    "\n⏳ The tokens will be automatically transferred to HyperCore once they arrive on HyperEVM.",
  );
  console.log("You can then trade them on the Hyperliquid DEX.");
}

async function main() {
  // 0. Validate configuration
  validateConfig();

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

  // 7. Encode compose message
  const composeMsg = encodeComposeMessage(params);

  // 8. Build LayerZero options with compose
  const options = buildComposeOptions();

  // 9. Build send parameters
  const sendParam = buildSendParams(params, composeMsg, options);

  // 10. Quote the fee
  const nativeFee = await quoteFee(oftAdapter, sendParam);

  // 11. Execute the bridge transaction
  await executeBridge(oftAdapter, sendParam, nativeFee, signerAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
