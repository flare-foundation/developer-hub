import {
  encodeAbiParameters,
  formatUnits,
  pad,
  zeroAddress,
  type Address,
} from "viem";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import { coston2 } from "@flarenetwork/flare-wagmi-periphery-package";
import {
  account,
  sepoliaPublicClient,
  sepoliaWalletClient,
  publicClient,
} from "./utils/client";
import { abi as fxrpOftAbi } from "./abis/FXRPOFT";
import { calculateAmountToSend } from "./utils/fassets";
import type { SendParam } from "./types";

const CONFIG = {
  SEPOLIA_FXRP_OFT: process.env.SEPOLIA_FXRP_OFT as Address | undefined,
  COSTON2_COMPOSER: (process.env.COSTON2_COMPOSER ??
    "0xa10569DFb38FE7Be211aCe4E4A566Cea387023b0") as Address,
  COSTON2_EID: EndpointId.FLARE_V2_TESTNET,
  EXECUTOR_GAS: 1_000_000,
  COMPOSE_GAS: 1_000_000,
  SEND_LOTS: process.env.SEND_LOTS ?? "1",
  XRP_ADDRESS: process.env.XRP_ADDRESS ?? "rpHuw4bKSjonKRrKKVYUZYYVedg1jyPrmp",
  // XRPL destination tag pre-registered on the MintingTagManager and bound to a recipient.
  // The tag must first be reserved (via `MintingTagManager.reserve()`) and tied to the
  // redeemer using `setMintingRecipient(tag, recipient)` before this script can use it.
  // See the "Redeem with Tag" section of the Redemption guide for the registration flow:
  //   https://dev.flare.network/fassets/redemption#redeem-with-tag
  REDEMPTION_DESTINATION_TAG: BigInt(
    process.env.REDEMPTION_DESTINATION_TAG ?? "72",
  ),
} as const;

const REDEMPTION_TIMEOUT_MS = 5 * 60 * 1000;
const REDEMPTION_POLL_INTERVAL_MS = 10_000;
// Coston2 RPC caps eth_getLogs to a 30-block range; chunk lookups to stay under it.
const MAX_BLOCK_RANGE = 25n;

// Mirrors `IFAssetRedeemComposer.RedeemComposeMessage`.
const redeemComposeMessageAbi = [
  {
    type: "tuple",
    components: [
      { name: "redeemer", type: "address" },
      { name: "redeemerUnderlyingAddress", type: "string" },
      { name: "redeemWithTag", type: "bool" },
      { name: "destinationTag", type: "uint256" },
      { name: "executor", type: "address" },
      { name: "executorFee", type: "uint256" },
    ],
  },
] as const;

function encodeComposeMessage(
  redeemer: Address,
  underlyingAddress: string,
  destinationTag: bigint,
): `0x${string}` {
  return encodeAbiParameters(redeemComposeMessageAbi, [
    {
      redeemer,
      redeemerUnderlyingAddress: underlyingAddress,
      redeemWithTag: true,
      destinationTag,
      executor: zeroAddress,
      executorFee: 0n,
    },
  ]);
}

function buildComposeOptions(): `0x${string}` {
  return Options.newOptions()
    .addExecutorLzReceiveOption(CONFIG.EXECUTOR_GAS, 0)
    .addExecutorComposeOption(0, CONFIG.COMPOSE_GAS, 0)
    .toHex() as `0x${string}`;
}

function buildSendParam(
  amountToSend: bigint,
  composeMsg: `0x${string}`,
  extraOptions: `0x${string}`,
): SendParam {
  return {
    dstEid: CONFIG.COSTON2_EID,
    to: pad(CONFIG.COSTON2_COMPOSER, { size: 32 }),
    amountLD: amountToSend,
    minAmountLD: amountToSend,
    extraOptions,
    composeMsg,
    oftCmd: "0x",
  };
}

async function checkBalance(
  oftAddress: Address,
  signerAddress: Address,
  amountToSend: bigint,
  decimals: number,
) {
  const balance = await sepoliaPublicClient.readContract({
    address: oftAddress,
    abi: fxrpOftAbi,
    functionName: "balanceOf",
    args: [signerAddress],
  });
  console.log("\nCurrent FXRP balance:", formatUnits(balance, decimals));

  if (balance < amountToSend) {
    console.error("\nInsufficient FXRP balance!");
    console.log("   Required:", formatUnits(amountToSend, decimals), "FXRP");
    console.log("   Available:", formatUnits(balance, decimals), "FXRP");
    throw new Error("Insufficient FXRP balance");
  }
}

async function quoteFee(oftAddress: Address, sendParam: SendParam) {
  const { nativeFee, lzTokenFee } = await sepoliaPublicClient.readContract({
    address: oftAddress,
    abi: fxrpOftAbi,
    functionName: "quoteSend",
    args: [sendParam, false],
  });
  console.log("\nLayerZero Fee:", formatUnits(nativeFee, 18), "ETH");
  return { nativeFee, lzTokenFee };
}

async function executeSendAndRedeem(
  oftAddress: Address,
  sendParam: SendParam,
  nativeFee: bigint,
  lzTokenFee: bigint,
  signerAddress: Address,
  underlyingAddress: string,
  destinationTag: bigint,
) {
  const { request } = await sepoliaPublicClient.simulateContract({
    account,
    address: oftAddress,
    abi: fxrpOftAbi,
    functionName: "send",
    args: [sendParam, { nativeFee, lzTokenFee }, signerAddress],
    value: nativeFee,
  });

  const txHash = await sepoliaWalletClient.writeContract(request);
  const receipt = await sepoliaPublicClient.waitForTransactionReceipt({
    hash: txHash,
  });

  console.log("\nTransaction sent:", txHash);
  console.log("Confirmed in block:", receipt.blockNumber);
  console.log("\nTrack your cross-chain transaction:");
  console.log(`https://testnet.layerzeroscan.com/tx/${txHash}`);
  console.log(
    "\nThe auto-redeem-with-tag will execute once the message arrives on Coston2.",
  );
  console.log("XRP will be sent to:", underlyingAddress);
  console.log("Destination tag:", destinationTag.toString());

  return txHash;
}

async function waitForFAssetRedeemedOnCoston2(
  redeemer: Address,
  fromBlock: bigint,
) {
  const deadline = Date.now() + REDEMPTION_TIMEOUT_MS;

  console.log("\nWaiting for FAssetRedeemed event on Coston2 composer...");

  let cursor = fromBlock;
  while (Date.now() < deadline) {
    const latest = await publicClient.getBlockNumber();
    while (cursor <= latest) {
      const chunkEnd = cursor + MAX_BLOCK_RANGE - 1n;
      const toBlock = chunkEnd > latest ? latest : chunkEnd;
      const logs = await publicClient.getContractEvents({
        address: CONFIG.COSTON2_COMPOSER,
        abi: coston2.ifAssetRedeemComposerAbi,
        eventName: "FAssetRedeemed",
        args: { redeemer },
        fromBlock: cursor,
        toBlock,
      });
      if (logs.length > 0) {
        return logs[0]!;
      }
      cursor = toBlock + 1n;
    }
    await new Promise((resolve) =>
      setTimeout(resolve, REDEMPTION_POLL_INTERVAL_MS),
    );
  }

  throw new Error(
    `FAssetRedeemed event not observed within ${REDEMPTION_TIMEOUT_MS}ms`,
  );
}

async function main() {
  if (!CONFIG.SEPOLIA_FXRP_OFT) {
    throw new Error(
      "SEPOLIA_FXRP_OFT env var is required (address of the FXRP OFT on Sepolia)",
    );
  }
  const oftAddress = CONFIG.SEPOLIA_FXRP_OFT;

  const signerAddress = account.address;
  console.log("Using account:", signerAddress);
  console.log("Composer configured:", CONFIG.COSTON2_COMPOSER);
  console.log("Connecting to FXRP OFT on Sepolia:", oftAddress);

  const [decimals, amountToSend, startBlock] = await Promise.all([
    sepoliaPublicClient.readContract({
      address: oftAddress,
      abi: fxrpOftAbi,
      functionName: "decimals",
    }),
    calculateAmountToSend(BigInt(CONFIG.SEND_LOTS)),
    publicClient.getBlockNumber(),
  ]);
  console.log("Token decimals:", decimals);

  console.log("\nRedemption Parameters:");
  console.log("Amount:", amountToSend.toString(), "FXRP base units");
  console.log("XRP Address:", CONFIG.XRP_ADDRESS);
  console.log("Redeemer:", signerAddress);
  console.log("Destination tag:", CONFIG.REDEMPTION_DESTINATION_TAG.toString());

  const composeMsg = encodeComposeMessage(
    signerAddress,
    CONFIG.XRP_ADDRESS,
    CONFIG.REDEMPTION_DESTINATION_TAG,
  );
  const extraOptions = buildComposeOptions();
  const sendParam = buildSendParam(amountToSend, composeMsg, extraOptions);

  await checkBalance(oftAddress, signerAddress, amountToSend, decimals);

  const { nativeFee, lzTokenFee } = await quoteFee(oftAddress, sendParam);

  console.log(
    "\nSending",
    formatUnits(amountToSend, decimals),
    "FXRP to Coston2 with auto-redeem-with-tag...",
  );
  console.log("Target composer:", CONFIG.COSTON2_COMPOSER);

  await executeSendAndRedeem(
    oftAddress,
    sendParam,
    nativeFee,
    lzTokenFee,
    signerAddress,
    CONFIG.XRP_ADDRESS,
    CONFIG.REDEMPTION_DESTINATION_TAG,
  );

  const redemptionEvent = await waitForFAssetRedeemedOnCoston2(
    signerAddress,
    startBlock,
  );
  console.log("\nFAssetRedeemed event observed on Coston2:");
  console.log(redemptionEvent);
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
