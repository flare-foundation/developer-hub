/**
 * Auto-redeem FXRP from Hyperliquid HyperCore to native XRP
 *
 * This script demonstrates the complete flow:
 * 1. Transfer FXRP from HyperCore spot to HyperEVM (via Hyperliquid spotSend API)
 * 2. Send FXRP from HyperEVM to Coston2 via LayerZero with compose
 * 3. FAssetRedeemComposer on Coston2 automatically redeems to native XRP
 *
 * Prerequisites:
 * - FXRP tokens on HyperCore spot wallet
 * - HYPE on HyperEVM for LayerZero fees
 * - FAssetRedeemComposer deployed on Coston2
 *
 * Usage:
 * yarn hardhat run scripts/fassets/autoRedeemFromHyperCore.ts --network hyperliquidTestnet
 */

import { web3 } from "hardhat";
import { formatUnits } from "ethers";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import type { FXRPOFTInstance } from "../../typechain-types";
import { calculateAmountToSend } from "../utils/fassets";

const FXRPOFT = artifacts.require("FXRPOFT");

// Configuration
const CONFIG = {
  // Testnet config
  HYPERLIQUID_API:
    process.env.HYPERLIQUID_API || "https://api.hyperliquid-testnet.xyz",
  HYPERLIQUID_FXRP_OFT:
    process.env.HYPERLIQUID_FXRP_OFT ||
    "0x14bfb521e318fc3d5e92A8462C65079BC7d4284c",
  // System address for FXRP on testnet (token index 1443 = 0x5A3)
  FXRP_SYSTEM_ADDRESS: "0x20000000000000000000000000000000000005a3",
  FXRP_TOKEN_ID: "FXRP:0x2af78df5b575b45eea8a6a1175026dd6",
  COSTON2_COMPOSER:
    process.env.COSTON2_COMPOSER ||
    "0x80c5ebBD65b4857CA2f917EAB1e9F83bcC947c52",
  COSTON2_EID: EndpointId.FLARE_V2_TESTNET,
  EXECUTOR_GAS: 1_000_000,
  COMPOSE_GAS: 1_000_000,
  // Native value forwarded to FAssetRedeemerAccount to cover executor fee on Coston2
  COMPOSE_VALUE: BigInt("1000000000000000"), // 0.001 HYPE
  SEND_LOTS: "1",
  XRP_ADDRESS: process.env.XRP_ADDRESS || "rpHuw4bKSjonKRrKKVYUZYYVedg1jyPrmp",
  HYPERLIQUID_CHAIN: "Testnet",
} as const;

type RedemptionParams = {
  amountToSend: bigint;
  underlyingAddress: string;
  redeemer: string;
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

/**
 * EIP-712 domain for Hyperliquid signing.
 * Note: Hyperliquid's API requires Arbitrum's chainId (42161) for all EIP-712 signatures,
 * regardless of the actual chain. This is a legacy requirement from when Hyperliquid settled on Arbitrum.
 */
const EIP712_DOMAIN = {
  name: "HyperliquidSignTransaction",
  version: "1",
  chainId: 42161,
  verifyingContract: "0x0000000000000000000000000000000000000000",
};

/**
 * EIP-712 types for spotSend action
 */
const SPOT_SEND_TYPES = {
  "HyperliquidTransaction:SpotSend": [
    { name: "hyperliquidChain", type: "string" },
    { name: "destination", type: "string" },
    { name: "token", type: "string" },
    { name: "amount", type: "string" },
    { name: "time", type: "uint64" },
  ],
};

/**
 * Validates the setup
 */
async function validateSetup() {
  const accounts = await web3.eth.getAccounts();
  const signerAddress = accounts[0];

  console.log("Using account:", signerAddress);

  if (!CONFIG.COSTON2_COMPOSER) {
    throw new Error(
      "COSTON2_COMPOSER not set in .env!\n" +
        "   Deploy FAssetRedeemComposer first on Coston2:\n" +
        "   yarn hardhat run scripts/fassets/deployFassetRedeemComposer.ts --network coston2",
    );
  }

  console.log("✓ Coston2 Composer configured:", CONFIG.COSTON2_COMPOSER);

  return signerAddress;
}

/**
 * Queries HyperCore spot balance for FXRP
 */
async function getHyperCoreBalance(address: string): Promise<string> {
  const response = await fetch(CONFIG.HYPERLIQUID_API + "/info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "spotClearinghouseState",
      user: address,
    }),
  });

  const data = await response.json();
  const balances = data.balances || [];

  // Find FXRP balance
  const fxrpBalance = balances.find(
    (b: { coin: string; hold: string }) => b.coin === "FXRP",
  );
  return fxrpBalance ? fxrpBalance.hold : "0";
}

/**
 * Transfers FXRP from HyperCore to HyperEVM using spotSend API
 */
async function transferFromHyperCoreToHyperEVM(
  signerAddress: string,
  amount: string,
): Promise<void> {
  console.log("\n📤 Step 1: Transferring FXRP from HyperCore to HyperEVM...");
  console.log("   Amount:", amount, "FXRP");
  console.log("   Destination (system address):", CONFIG.FXRP_SYSTEM_ADDRESS);

  const timestamp = Date.now();

  // Prepare the message for EIP-712 signing
  const message = {
    hyperliquidChain: CONFIG.HYPERLIQUID_CHAIN,
    destination: CONFIG.FXRP_SYSTEM_ADDRESS,
    token: CONFIG.FXRP_TOKEN_ID,
    amount: amount,
    time: timestamp,
  };

  // Sign with EIP-712 using web3
  const typedData = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      ...SPOT_SEND_TYPES,
    },
    primaryType: "HyperliquidTransaction:SpotSend" as const,
    domain: EIP712_DOMAIN,
    message: message,
  };

  const signature = await web3.eth.signTypedData(signerAddress, typedData);

  // Prepare the action payload
  const action = {
    type: "spotSend",
    hyperliquidChain: CONFIG.HYPERLIQUID_CHAIN,
    signatureChainId: "0xa4b1", // Arbitrum chainId (42161) in hex - required by Hyperliquid API
    destination: CONFIG.FXRP_SYSTEM_ADDRESS.toLowerCase(),
    token: CONFIG.FXRP_TOKEN_ID,
    amount: amount,
    time: timestamp,
  };

  // Send to Hyperliquid exchange API
  const response = await fetch(CONFIG.HYPERLIQUID_API + "/exchange", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: action,
      nonce: timestamp,
      signature: signature,
    }),
  });

  const result = await response.json();

  if (result.status === "err") {
    throw new Error(`HyperCore transfer failed: ${result.response}`);
  }

  console.log("✅ HyperCore → HyperEVM transfer initiated");
  console.log("   Response:", JSON.stringify(result));

  // Wait for transfer to complete (typically ~2 seconds for HyperEVM block)
  console.log("   Waiting for transfer to settle on HyperEVM...");
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

/**
 * Prepares redemption parameters
 */
function prepareRedemptionParams(
  signerAddress: string,
  decimals: number,
): RedemptionParams {
  const amountToSend = calculateAmountToSend(BigInt(CONFIG.SEND_LOTS));
  const underlyingAddress = CONFIG.XRP_ADDRESS;
  const redeemer = signerAddress;

  console.log("\n📋 Redemption Parameters:");
  console.log(
    "Amount:",
    formatUnits(amountToSend.toString(), decimals),
    "FXRP",
  );
  console.log("XRP Address:", underlyingAddress);
  console.log("Redeemer:", redeemer);

  return { amountToSend, underlyingAddress, redeemer, signerAddress };
}

/**
 * Connects to the OFT contract on HyperEVM
 */
async function connectToOFT(): Promise<FXRPOFTInstance> {
  console.log(
    "\nConnecting to FXRP OFT on HyperEVM:",
    CONFIG.HYPERLIQUID_FXRP_OFT,
  );
  const oft = await FXRPOFT.at(CONFIG.HYPERLIQUID_FXRP_OFT);

  console.log("✓ Connected to FXRP OFT");

  return oft;
}

/**
 * Encodes the compose message for auto-redemption
 */
function encodeComposeMessage(params: RedemptionParams): string {
  // Matches the RedeemComposeData struct on the shared FAssetRedeemComposer
  const composeMsg = web3.eth.abi.encodeParameters(
    ["address", "string"],
    [params.redeemer, params.underlyingAddress],
  );

  console.log("Compose message encoded for auto-redemption");

  return composeMsg;
}

/**
 * Builds LayerZero options with compose
 */
function buildComposeOptions(): string {
  const options = Options.newOptions()
    .addExecutorLzReceiveOption(CONFIG.EXECUTOR_GAS, 0)
    .addExecutorComposeOption(
      0,
      CONFIG.COMPOSE_GAS,
      CONFIG.COMPOSE_VALUE.toString(),
    );

  return options.toHex();
}

/**
 * Builds send parameters for LayerZero
 */
function buildSendParams(
  params: RedemptionParams,
  composeMsg: string,
  options: string,
): SendParams {
  return {
    dstEid: CONFIG.COSTON2_EID,
    to: web3.utils.padLeft(CONFIG.COSTON2_COMPOSER, 64),
    amountLD: params.amountToSend.toString(),
    minAmountLD: params.amountToSend.toString(),
    extraOptions: options,
    composeMsg: composeMsg,
    oftCmd: "0x",
  };
}

/**
 * Checks HyperEVM balance
 */
async function checkHyperEVMBalance(
  oft: FXRPOFTInstance,
  signerAddress: string,
  amountToSend: bigint,
  decimals: number,
): Promise<void> {
  const balance = await oft.balanceOf(signerAddress);
  console.log(
    "\n💰 HyperEVM FXRP balance:",
    formatUnits(balance.toString(), decimals),
  );

  if (BigInt(balance.toString()) < amountToSend) {
    console.error("\n❌ Insufficient FXRP balance on HyperEVM!");
    console.log(
      "   Required:",
      formatUnits(amountToSend.toString(), decimals),
      "FXRP",
    );
    console.log(
      "   Available:",
      formatUnits(balance.toString(), decimals),
      "FXRP",
    );
    throw new Error(
      "Insufficient FXRP balance on HyperEVM. Transfer from HyperCore may still be pending.",
    );
  }

  console.log("✓ Sufficient balance on HyperEVM");
}

/**
 * Quotes LayerZero fee
 */
async function quoteFee(oft: FXRPOFTInstance, sendParam: SendParams) {
  const result = await oft.quoteSend(sendParam, false);
  const nativeFee = BigInt(result.nativeFee.toString());
  const lzTokenFee = BigInt(result.lzTokenFee.toString());

  console.log(
    "\n💵 LayerZero Fee:",
    formatUnits(nativeFee.toString(), 18),
    "HYPE",
  );

  return { nativeFee, lzTokenFee };
}

/**
 * Executes LayerZero send with auto-redeem
 */
async function executeSendAndRedeem(
  oft: FXRPOFTInstance,
  sendParam: SendParams,
  nativeFee: bigint,
  lzTokenFee: bigint,
  params: RedemptionParams,
  decimals: number,
): Promise<void> {
  console.log(
    "\n📤 Step 2: Sending FXRP from HyperEVM to Coston2 with auto-redeem...",
  );
  console.log(
    "   Amount:",
    formatUnits(params.amountToSend.toString(), decimals),
    "FXRP",
  );
  console.log("   Target composer:", CONFIG.COSTON2_COMPOSER);
  console.log("   XRP destination:", params.underlyingAddress);

  const tx = await oft.send(
    sendParam,
    { nativeFee: nativeFee.toString(), lzTokenFee: lzTokenFee.toString() },
    params.signerAddress,
    { value: nativeFee.toString() },
  );

  console.log("\n✓ Transaction sent:", tx.tx);
  console.log("✅ Confirmed in block:", tx.receipt.blockNumber);

  console.log("\n🎉 Success! Auto-redemption initiated!");
  console.log("\n📊 Track your cross-chain transaction:");
  console.log(`https://testnet.layerzeroscan.com/tx/${tx.tx}`);
  console.log(
    "\n⏳ The auto-redeem will execute once the message arrives on Coston2.",
  );
  console.log("XRP will be sent to:", params.underlyingAddress);
}

async function main() {
  console.log("=".repeat(60));
  console.log("FXRP Auto-Redemption from HyperCore");
  console.log("HyperCore → HyperEVM → Coston2 → XRP Ledger");
  console.log("=".repeat(60));

  // 1. Validate setup
  const signerAddress = await validateSetup();

  // 2. Check HyperCore balance
  console.log("\n📊 Checking HyperCore spot balance...");
  const hyperCoreBalance = await getHyperCoreBalance(signerAddress);
  console.log("   HyperCore FXRP balance:", hyperCoreBalance);

  const lotSize = 10; // 1 lot = 10 FXRP
  const requiredAmount = parseInt(CONFIG.SEND_LOTS) * lotSize;

  if (parseFloat(hyperCoreBalance) < requiredAmount) {
    throw new Error(
      `Insufficient FXRP on HyperCore. Have: ${hyperCoreBalance}, Need: ${requiredAmount}\n` +
        "Bridge FXRP to HyperCore first using bridgeToHyperCore.ts",
    );
  }

  // 3. Transfer from HyperCore to HyperEVM
  await transferFromHyperCoreToHyperEVM(
    signerAddress,
    requiredAmount.toString(),
  );

  // 4. Connect to OFT on HyperEVM
  const oft = await connectToOFT();

  // 5. Get token decimals
  const decimals = Number(await oft.decimals());
  console.log("Token decimals:", decimals);

  // 6. Prepare redemption parameters
  const params = prepareRedemptionParams(signerAddress, decimals);

  // 7. Check HyperEVM balance (should have tokens now)
  await checkHyperEVMBalance(
    oft,
    params.signerAddress,
    params.amountToSend,
    decimals,
  );

  // 8. Encode compose message
  const composeMsg = encodeComposeMessage(params);

  // 9. Build LayerZero options
  const options = buildComposeOptions();

  // 10. Build send parameters
  const sendParam = buildSendParams(params, composeMsg, options);

  // 11. Quote fee
  const { nativeFee, lzTokenFee } = await quoteFee(oft, sendParam);

  // 12. Execute send with auto-redeem
  await executeSendAndRedeem(
    oft,
    sendParam,
    nativeFee,
    lzTokenFee,
    params,
    decimals,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
