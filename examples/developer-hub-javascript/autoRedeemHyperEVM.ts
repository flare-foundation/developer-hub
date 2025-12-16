/**
 * Example script to send FXRP from Hyperliquid EVM Testnet to Coston2 with automatic redemption
 *
 * This demonstrates how to:
 * 1. Send OFT tokens from Hyperliquid EVM Testnet (where FXRP is an OFT)
 * 2. Use LayerZero compose to trigger automatic redemption on Hyperliquid
 * 3. Redeem the underlying asset (XRP) to a specified address
 *
 * Usage:
 * yarn hardhat run scripts/fassets/autoRedeemHyperEVM.ts --network hyperliquidTestnet
 */

import { ethers } from "hardhat";
import { formatUnits, zeroPadValue, AbiCoder, Contract } from "ethers";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { EndpointId } from "@layerzerolabs/lz-definitions";

import { getAssetManagerFXRP } from "../utils/getters";

// Configuration - using existing deployed contracts
const CONFIG = {
  HYPERLIQUID_FXRP_OFT:
    process.env.HYPERLIQUID_FXRP_OFT ||
    "0x14bfb521e318fc3d5e92A8462C65079BC7d4284c",
  COSTON2_COMPOSER: process.env.COSTON2_COMPOSER || "",
  COSTON2_EID: EndpointId.FLARE_V2_TESTNET, // Coston2 EID (destination)
  EXECUTOR_GAS: 400_000,
  COMPOSE_GAS: 700_000,
  SEND_LOTS: "10",
  XRP_ADDRESS: "rpHuw4bKSjonKRrKKVYUZYYVedg1jyPrmp", // Change this to the XRP address you are auto-redeeming to
} as const;

type RedemptionParams = {
  amountToSend: bigint;
  underlyingAddress: string;
  redeemer: string;
  signerAddress: string;
  executor: string;
};

type SendParams = {
  dstEid: EndpointId;
  to: string;
  amountLD: bigint;
  minAmountLD: bigint;
  extraOptions: string;
  composeMsg: string;
  oftCmd: string;
};

async function calculateAmountToSend(lots: bigint) {
  const assetManager = await getAssetManagerFXRP();
  const lotSize = BigInt(await assetManager.lotSize());

  return lotSize * lots;
}

/**
 * Gets the signer and validates composer is deployed
 */
async function validateSetup() {
  const [signer] = await ethers.getSigners();

  console.log("Using account:", signer.address);

  if (!CONFIG.COSTON2_COMPOSER) {
    throw new Error(
      "❌ HYPERLIQUID_COMPOSER not set in .env!\n" +
        "   Deploy FAssetRedeemComposer first on Hyperliquid:\n" +
        "   npx hardhat deploy --network hyperliquid --tags FAssetRedeemComposer",
    );
  }

  console.log("✓ Composer configured:", CONFIG.COSTON2_COMPOSER);

  return signer;
}

/**
 * Prepares redemption parameters
 */
async function prepareRedemptionParams(
  signerAddress: string,
): Promise<RedemptionParams> {
  const amountToSend = await calculateAmountToSend(BigInt(CONFIG.SEND_LOTS));
  const underlyingAddress = CONFIG.XRP_ADDRESS;
  const redeemer = signerAddress;

  console.log("\n📋 Redemption Parameters:");
  console.log("Amount:", formatUnits(amountToSend.toString(), 6), "FXRP");
  console.log("XRP Address:", underlyingAddress);
  console.log("Redeemer:", redeemer);

  const executor = "0x0000000000000000000000000000000000000000";

  return { amountToSend, underlyingAddress, redeemer, signerAddress, executor };
}

/**
 * Connects to the OFT contract on Hyperliquid EVM
 */
async function connectToOFT() {
  console.log(
    "Connecting to FXRP OFT on Hyperliquid EVM:",
    CONFIG.HYPERLIQUID_FXRP_OFT,
  );
  const oft = await ethers.getContractAt(
    "FXRPOFT",
    CONFIG.HYPERLIQUID_FXRP_OFT,
  );

  console.log("\n✓ Connected to FXRP OFT:", CONFIG.HYPERLIQUID_FXRP_OFT);
  console.log("OFT address:", oft.target);

  return oft;
}

/**
 * Encodes the compose message with redemption details
 * Format: (amountToRedeem, underlyingAddress, redeemer)
 */
function encodeComposeMessage(params: RedemptionParams): string {
  const abiCoder = AbiCoder.defaultAbiCoder();
  // redeem(uint256 _lots, string memory _redeemerUnderlyingAddressString, executor address)
  const composeMsg = abiCoder.encode(
    ["uint256", "string", "address"],
    [params.amountToSend, params.underlyingAddress, params.redeemer],
  );

  console.log("Compose message encoded");

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
 * Builds the send parameters for LayerZero
 */
function buildSendParams(
  params: RedemptionParams,
  composeMsg: string,
  options: string,
): SendParams {
  return {
    dstEid: CONFIG.COSTON2_EID,
    to: zeroPadValue(CONFIG.COSTON2_COMPOSER, 32),
    amountLD: params.amountToSend,
    minAmountLD: params.amountToSend,
    extraOptions: options,
    composeMsg: composeMsg,
    oftCmd: "0x",
  };
}

/**
 * Checks if user has sufficient FXRP balance
 */
async function checkBalance(
  oft: Contract,
  signerAddress: string,
  amountToSend: bigint,
): Promise<void> {
  console.log("signer address", signerAddress);
  console.log("oft.address", oft.address);
  const balance = await oft.balanceOf(signerAddress);
  console.log("signer address", signerAddress);
  console.log("\n💰 Current FXRP balance:", formatUnits(balance, 6));

  if (balance < amountToSend) {
    console.error("\n❌ Insufficient FXRP balance!");
    console.log("   Required:", formatUnits(amountToSend, 6), "FXRP");
    console.log("   Available:", formatUnits(balance, 6), "FXRP");
    throw new Error("Insufficient FXRP balance");
  }

  console.log("Sufficient balance");
}

/**
 * Quotes the LayerZero fee for the send transaction
 */
async function quoteFee(
  oft: Contract,
  sendParam: SendParams,
): Promise<{ nativeFee: bigint; lzTokenFee: bigint }> {
  const result = await oft.quoteSend(sendParam, false);
  const nativeFee = result.nativeFee;
  const lzTokenFee = result.lzTokenFee;

  console.log("\n💵 LayerZero Fee:", formatUnits(nativeFee, 18), "HYPE");

  return { nativeFee, lzTokenFee };
}

/**
 * Executes the send with auto-redeem
 */
async function executeSendAndRedeem(
  oft: Contract,
  sendParam: SendParams,
  nativeFee: bigint,
  lzTokenFee: bigint,
  params: RedemptionParams,
): Promise<void> {
  console.log(
    "\n🚀 Sending",
    formatUnits(params.amountToSend, 6),
    "FXRP to Coston2 with auto-redeem...",
  );
  console.log("Target composer:", CONFIG.COSTON2_COMPOSER);
  console.log("Underlying address:", params.underlyingAddress);

  const tx = await oft.send(
    sendParam,
    { nativeFee, lzTokenFee },
    params.signerAddress,
    { value: nativeFee },
  );

  console.log("\n✓ Transaction sent:", tx.hash);
  console.log("Waiting for confirmation...");

  const receipt = await tx.wait();
  console.log("✅ Confirmed in block:", receipt?.blockNumber);

  console.log("\n🎉 Success! Your FXRP is on the way to Coston2!");
  console.log("\n📊 Track your cross-chain transaction:");
  console.log(`https://testnet.layerzeroscan.com/tx/${tx.hash}`);
  console.log(
    "\n⏳ The auto-redeem will execute once the message arrives on Coston2.",
  );
  console.log("XRP will be sent to:", params.underlyingAddress);
}

async function main() {
  // 1. Validate setup and get signer
  const signer = await validateSetup();

  // 2. Prepare redemption parameters
  const params = await prepareRedemptionParams(signer.address);

  // 3. Connect to OFT contract
  const oft = await connectToOFT();
  console.log("3. oft.address", oft.address);

  // 4. Encode compose message
  const composeMsg = encodeComposeMessage(params);

  // 5. Build LayerZero options
  const options = buildComposeOptions();

  // 6. Build send parameters
  const sendParam = buildSendParams(params, composeMsg, options);

  console.log("7. oft.address", oft.address);
  // 7. Check balance
  await checkBalance(oft, params.signerAddress, params.amountToSend);

  // 8. Quote fee
  const { nativeFee, lzTokenFee } = await quoteFee(oft, sendParam);

  // 9. Execute send with auto-redeem
  await executeSendAndRedeem(oft, sendParam, nativeFee, lzTokenFee, params);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
