/**
 * Example script to send FXRP from Hyperliquid EVM Testnet to Coston2 with automatic redemption
 *
 * This demonstrates how to:
 * 1. Send OFT tokens from Hyperliquid EVM Testnet (where FXRP is an OFT)
 * 2. Use LayerZero compose to trigger automatic redemption on Hyperliquid
 * 3. Redeem the underlying asset (XRP) to a specified address
 *
 * Usage:
 * yarn hardhat run scripts/fassets/autoRedeemFromHyperEVM.ts --network hyperliquidTestnet
 */

import { web3 } from "hardhat";
import { formatUnits } from "ethers";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import type { FXRPOFTInstance } from "../../typechain-types";
import { calculateAmountToSend } from "../utils/fassets";

const FXRPOFT = artifacts.require("FXRPOFT");

// Configuration - using existing deployed contracts
const CONFIG = {
    HYPERLIQUID_FXRP_OFT: process.env.HYPERLIQUID_FXRP_OFT || "0x14bfb521e318fc3d5e92A8462C65079BC7d4284c",
    COSTON2_COMPOSER: process.env.COSTON2_COMPOSER || "0x5051E8db650E9e0E2a3f03010Ee5c60e79CF583E",
    COSTON2_EID: EndpointId.FLARE_V2_TESTNET,
    EXECUTOR_GAS: 1_000_000,
    COMPOSE_GAS: 1_000_000,
    SEND_LOTS: "1",
    XRP_ADDRESS: "rpHuw4bKSjonKRrKKVYUZYYVedg1jyPrmp",
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
    amountLD: string;
    minAmountLD: string;
    extraOptions: string;
    composeMsg: string;
    oftCmd: string;
};

/**
 * Gets the signer and validates composer is deployed
 */
async function validateSetup() {
    const accounts = await web3.eth.getAccounts();
    const signerAddress = accounts[0];

    console.log("Using account:", signerAddress);

    if (!CONFIG.COSTON2_COMPOSER) {
        throw new Error(
            "HYPERLIQUID_COMPOSER not set in .env!\n" +
                "   Deploy FAssetRedeemComposer first on Hyperliquid:\n" +
                "   npx hardhat deploy --network hyperliquid --tags FAssetRedeemComposer"
        );
    }

    console.log("✓ Composer configured:", CONFIG.COSTON2_COMPOSER);

    return signerAddress;
}

/**
 * Prepares redemption parameters
 */
function prepareRedemptionParams(signerAddress: string, decimals: number): RedemptionParams {
    const amountToSend = calculateAmountToSend(BigInt(CONFIG.SEND_LOTS));
    const underlyingAddress = CONFIG.XRP_ADDRESS;
    const redeemer = signerAddress;

    console.log("\n📋 Redemption Parameters:");
    console.log("Amount:", formatUnits(amountToSend.toString(), decimals), "FXRP");
    console.log("XRP Address:", underlyingAddress);
    console.log("Redeemer:", redeemer);

    const executor = "0x0000000000000000000000000000000000000000";

    return { amountToSend, underlyingAddress, redeemer, signerAddress, executor };
}

/**
 * Connects to the OFT contract on Hyperliquid EVM
 */
async function connectToOFT(): Promise<FXRPOFTInstance> {
    console.log("Connecting to FXRP OFT on Hyperliquid EVM:", CONFIG.HYPERLIQUID_FXRP_OFT);
    const oft = await FXRPOFT.at(CONFIG.HYPERLIQUID_FXRP_OFT);

    console.log("\n✓ Connected to FXRP OFT:", CONFIG.HYPERLIQUID_FXRP_OFT);
    console.log("OFT address:", oft.address);

    return oft;
}

/**
 * Encodes the compose message with redemption details
 * Format: (amountToRedeem, underlyingAddress, redeemer)
 */
function encodeComposeMessage(params: RedemptionParams): string {
    // redeem(uint256 _lots, string memory _redeemerUnderlyingAddressString, executor address)
    const composeMsg = web3.eth.abi.encodeParameters(
        ["uint256", "string", "address"],
        [params.amountToSend.toString(), params.underlyingAddress, params.redeemer]
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
function buildSendParams(params: RedemptionParams, composeMsg: string, options: string): SendParams {
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
 * Checks if user has sufficient FXRP balance
 */
async function checkBalance(
    oft: FXRPOFTInstance,
    signerAddress: string,
    amountToSend: bigint,
    decimals: number
): Promise<void> {
    const balance = await oft.balanceOf(signerAddress);
    console.log("\n💰 Current FXRP balance:", formatUnits(balance.toString(), decimals));

    if (BigInt(balance.toString()) < amountToSend) {
        console.error("\n❌ Insufficient FXRP balance!");
        console.log("   Required:", formatUnits(amountToSend.toString(), decimals), "FXRP");
        console.log("   Available:", formatUnits(balance.toString(), decimals), "FXRP");
        throw new Error("Insufficient FXRP balance");
    }

    console.log("Sufficient balance");
}

/**
 * Quotes the LayerZero fee for the send transaction
 */
async function quoteFee(oft: FXRPOFTInstance, sendParam: SendParams) {
    const result = await oft.quoteSend(sendParam, false);
    const nativeFee = BigInt(result.nativeFee.toString());
    const lzTokenFee = BigInt(result.lzTokenFee.toString());

    console.log("\n💵 LayerZero Fee:", formatUnits(nativeFee.toString(), 18), "HYPE");

    return { nativeFee, lzTokenFee };
}

/**
 * Executes the send with auto-redeem
 */
async function executeSendAndRedeem(
    oft: FXRPOFTInstance,
    sendParam: SendParams,
    nativeFee: bigint,
    lzTokenFee: bigint,
    params: RedemptionParams,
    decimals: number
): Promise<void> {
    console.log(
        "\n🚀 Sending",
        formatUnits(params.amountToSend.toString(), decimals),
        "FXRP to Coston2 with auto-redeem..."
    );
    console.log("Target composer:", CONFIG.COSTON2_COMPOSER);
    console.log("Underlying address:", params.underlyingAddress);

    const tx = await oft.send(
        sendParam,
        { nativeFee: nativeFee.toString(), lzTokenFee: lzTokenFee.toString() },
        params.signerAddress,
        { value: nativeFee.toString() }
    );

    console.log("\n✓ Transaction sent:", tx.tx);
    console.log("✅ Confirmed in block:", tx.receipt.blockNumber);

    console.log("\n🎉 Success! Your FXRP is on the way to Coston2!");
    console.log("\n📊 Track your cross-chain transaction:");
    console.log(`https://testnet.layerzeroscan.com/tx/${tx.tx}`);
    console.log("\n⏳ The auto-redeem will execute once the message arrives on Coston2.");
    console.log("XRP will be sent to:", params.underlyingAddress);
}

async function main() {
    // 1. Validate setup and get signer
    const signerAddress = await validateSetup();

    // 2. Connect to OFT contract
    const oft = await connectToOFT();

    // 3. Get token decimals
    const decimals = Number(await oft.decimals());
    console.log("Token decimals:", decimals);

    // 4. Prepare redemption parameters
    const params = prepareRedemptionParams(signerAddress, decimals);

    // 5. Encode compose message
    const composeMsg = encodeComposeMessage(params);

    // 6. Build LayerZero options
    const options = buildComposeOptions();

    // 7. Build send parameters
    const sendParam = buildSendParams(params, composeMsg, options);

    // 8. Check balance
    await checkBalance(oft, params.signerAddress, params.amountToSend, decimals);

    // 9. Quote fee
    const { nativeFee, lzTokenFee } = await quoteFee(oft, sendParam);

    // 10. Execute send with auto-redeem
    await executeSendAndRedeem(oft, sendParam, nativeFee, lzTokenFee, params, decimals);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
