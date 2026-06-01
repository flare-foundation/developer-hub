import { encodeFunctionData, erc20Abi, formatUnits, type Address } from "viem";
import { Client, Wallet, xrpToDrops } from "xrpl";
import { account, publicClient, sepoliaPublicClient } from "./utils/client";
import {
  getPersonalAccountAddress,
  sendMemoFieldInstruction,
  type Call,
} from "./utils/smart-accounts";
import {
  computeDirectMintingPaymentAmountXrp,
  getFxrpDecimals,
} from "./utils/fassets";
import { getFxrpAddress } from "./utils/flare-contract-registry";
import { abi as fxrpLzBridgeShimAbi } from "./abis/FxrpLzBridgeShim";
import { abi as fxrpOftAbi } from "./abis/FXRPOFT";

const CONFIG = {
  FXRP_LZ_BRIDGE_SHIM: (process.env.FXRP_LZ_BRIDGE_SHIM ??
    "0x525CCe1C6d053B0e7f41A2011B536aA992200Be0") as Address,
  SEPOLIA_FXRP_OFT: process.env.SEPOLIA_FXRP_OFT as Address | undefined,
  FXRP_MINT_AMOUNT_XRP: 10,
} as const;

const SEPOLIA_ARRIVAL_TIMEOUT_MS = 10 * 60 * 1000;
const SEPOLIA_ARRIVAL_POLL_INTERVAL_MS = 10_000;

async function waitForOftReceivedOnSepolia({
  oftAddress,
  toAddress,
  fromBlock,
}: {
  oftAddress: Address;
  toAddress: Address;
  fromBlock: bigint;
}) {
  const deadline = Date.now() + SEPOLIA_ARRIVAL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const logs = await sepoliaPublicClient.getContractEvents({
      address: oftAddress,
      abi: fxrpOftAbi,
      eventName: "OFTReceived",
      args: { toAddress },
      fromBlock,
      strict: true,
    });
    if (logs.length > 0) {
      return logs[0]!;
    }
    await new Promise((resolve) =>
      setTimeout(resolve, SEPOLIA_ARRIVAL_POLL_INTERVAL_MS),
    );
  }
  throw new Error(
    `OFTReceived event not observed on Sepolia within ${SEPOLIA_ARRIVAL_TIMEOUT_MS}ms`,
  );
}

// For this example to work, you first need to faucet C2FLR to your personal account address.
// FxrpLzBridgeShim resolves the FXRP token address on-chain from the AssetManagerFXRP
// registry entry, so only the route-specific params need to be passed in at deploy time:
//   oftAdapter=0xCd3d2127935Ae82Af54Fc31cCD9D3440dbF46639
//   dstEid=40161 (SEPOLIA_V2_TESTNET)
//   executorGas=200000
async function main() {
  if (!CONFIG.SEPOLIA_FXRP_OFT) {
    throw new Error(
      "SEPOLIA_FXRP_OFT env var is required (address of the FXRP OFT on Sepolia)",
    );
  }
  const shim = CONFIG.FXRP_LZ_BRIDGE_SHIM;
  const sepoliaOft = CONFIG.SEPOLIA_FXRP_OFT;

  const xrplClient = new Client(process.env.XRPL_TESTNET_RPC_URL!);
  const xrplWallet = Wallet.fromSeed(process.env.XRPL_SEED!);
  const recipient = account.address;

  const [
    personalAccount,
    fxrpAddress,
    fxrpDecimals,
    paymentAmountXrp,
    memoOnlyAmountXrp,
  ] = await Promise.all([
    getPersonalAccountAddress(xrplWallet.address),
    getFxrpAddress(),
    getFxrpDecimals(),
    computeDirectMintingPaymentAmountXrp({
      netMintAmountXrp: CONFIG.FXRP_MINT_AMOUNT_XRP,
    }),
    computeDirectMintingPaymentAmountXrp({ netMintAmountXrp: 0 }),
  ]);

  const amountToBridge = BigInt(xrpToDrops(CONFIG.FXRP_MINT_AMOUNT_XRP));

  const nativeFee = await publicClient.readContract({
    address: shim,
    abi: fxrpLzBridgeShimAbi,
    functionName: "quote",
    args: [amountToBridge, recipient],
  });

  console.log("Personal account:", personalAccount);
  console.log("FXRP token:", fxrpAddress);
  console.log("Bridge shim:", shim);

  console.log("\nCross-chain mint details:");
  console.log("From (XRPL):", xrplWallet.address);
  console.log("Via (Coston2 personal account):", personalAccount);
  console.log("To (Sepolia):", recipient);
  console.log(
    "Net FXRP to mint & bridge:",
    formatUnits(amountToBridge, fxrpDecimals),
    "FXRP",
  );
  console.log("XRPL payment amount (mint + fees):", paymentAmountXrp, "XRP");
  console.log("LayerZero native fee:", formatUnits(nativeFee, 18), "C2FLR");

  // XRPL caps each memo at ~1024 bytes. Even with the thin shim calldata, a
  // combined approve+bridge UserOperation overflows (~1098 bytes), so split
  // into two memo-field instructions.
  const approveShimCustomInstruction: Call[] = [
    {
      target: fxrpAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [shim, amountToBridge],
      }),
    },
  ];

  const bridgeCustomInstruction: Call[] = [
    {
      target: shim,
      value: nativeFee,
      data: encodeFunctionData({
        abi: fxrpLzBridgeShimAbi,
        functionName: "bridge",
        args: [amountToBridge, recipient],
      }),
    },
  ];

  await sendMemoFieldInstruction({
    label: "mint-and-approve-shim",
    customInstruction: approveShimCustomInstruction,
    amountXrp: paymentAmountXrp,
    personalAccount,
    xrplClient,
    xrplWallet,
  });

  const startSepoliaBlock = await sepoliaPublicClient.getBlockNumber();

  const bridgeEvent = await sendMemoFieldInstruction({
    label: "bridge",
    customInstruction: bridgeCustomInstruction,
    amountXrp: memoOnlyAmountXrp,
    personalAccount,
    xrplClient,
    xrplWallet,
  });

  console.log("\nTrack your cross-chain transaction:");
  console.log(
    `https://testnet.layerzeroscan.com/tx/${bridgeEvent.transactionHash}`,
  );
  console.log(
    "\nWaiting for FXRP to arrive on Sepolia (this can take a few minutes)...",
  );

  const arrivalEvent = await waitForOftReceivedOnSepolia({
    oftAddress: sepoliaOft,
    toAddress: recipient,
    fromBlock: startSepoliaBlock,
  });

  console.log("\nFXRP arrived on Sepolia:");
  console.log("  Tx hash:", arrivalEvent.transactionHash);
  console.log(
    "  Amount received:",
    formatUnits(arrivalEvent.args.amountReceivedLD, fxrpDecimals),
    "FXRP",
  );
  console.log("  Recipient:", arrivalEvent.args.toAddress);
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
