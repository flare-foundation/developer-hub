/**
 * Read FXRP OFT transfer rate limits on the Coston2 OFT Adapter.
 *
 * Usage (from a project with viem and @layerzerolabs/lz-definitions):
 *   npx tsx getOftTransferLimits.ts
 *
 * No wallet or private key is required.
 */

import {
  createPublicClient,
  formatUnits,
  http,
  maxUint256,
  type Address,
} from "viem";
import { flareTestnet } from "viem/chains";
import { EndpointId } from "@layerzerolabs/lz-definitions";

const COSTON2_OFT_ADAPTER =
  "0xCd3d2127935Ae82Af54Fc31cCD9D3440dbF46639" as Address;
const DST_EID = EndpointId.SEPOLIA_V2_TESTNET;
const FXRP_DECIMALS = 6;

const transferLimitingAbi = [
  {
    type: "function",
    name: "outgoingRateLimit",
    stateMutability: "view",
    inputs: [{ name: "_dstEid", type: "uint32" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "consumedTransferCapacity", type: "uint192" },
          { name: "lastUpdated", type: "uint64" },
          { name: "limit", type: "uint192" },
          { name: "window", type: "uint64" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "incomingRateLimit",
    stateMutability: "view",
    inputs: [{ name: "_srcEid", type: "uint32" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "consumedTransferCapacity", type: "uint192" },
          { name: "lastUpdated", type: "uint64" },
          { name: "limit", type: "uint192" },
          { name: "window", type: "uint64" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "defaultOutgoingRateLimit",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "limit", type: "uint192" },
          { name: "window", type: "uint64" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "defaultIncomingRateLimit",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "limit", type: "uint192" },
          { name: "window", type: "uint64" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getAmountCanBeSent",
    stateMutability: "view",
    inputs: [{ name: "_dstEid", type: "uint32" }],
    outputs: [
      { name: "currentConsumedTransferCapacity", type: "uint256" },
      { name: "amountCanBeSent", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "getAmountCanBeReceived",
    stateMutability: "view",
    inputs: [{ name: "_srcEid", type: "uint32" }],
    outputs: [
      { name: "currentConsumedTransferCapacity", type: "uint256" },
      { name: "amountCanBeReceived", type: "uint256" },
    ],
  },
] as const;

type RateLimit = {
  consumedTransferCapacity: bigint;
  lastUpdated: bigint;
  limit: bigint;
  window: bigint;
};

type DefaultRateLimit = {
  limit: bigint;
  window: bigint;
};

const publicClient = createPublicClient({
  chain: flareTestnet,
  transport: http("https://coston2-api.flare.network/ext/C/rpc"),
});

function formatFxrp(amount: bigint): string {
  if (amount === maxUint256) {
    return "unlimited";
  }
  return `${amount.toString()} (${formatUnits(amount, FXRP_DECIMALS)} FXRP)`;
}

function formatWindow(
  windowSeconds: bigint,
  zeroMeans: "use default" | "limiting disabled",
): string {
  if (windowSeconds === 0n) {
    return `0s (${zeroMeans})`;
  }
  return `${windowSeconds.toString()}s`;
}

function printRateLimit(label: string, rl: RateLimit) {
  console.log(`${label}:`);
  console.log(`  consumed: ${formatFxrp(rl.consumedTransferCapacity)}`);
  console.log(`  lastUpdated: ${rl.lastUpdated.toString()}`);
  console.log(`  limit: ${formatFxrp(rl.limit)}`);
  console.log(`  window: ${formatWindow(rl.window, "use default")}`);
}

function printDefault(label: string, rl: DefaultRateLimit) {
  console.log(`${label}:`);
  console.log(`  limit: ${formatFxrp(rl.limit)}`);
  console.log(`  window: ${formatWindow(rl.window, "limiting disabled")}`);
}

async function main() {
  console.log("=== FXRP OFT Transfer Limits ===\n");
  console.log(`OFT Adapter: ${COSTON2_OFT_ADAPTER}`);
  console.log(`Network: Coston2`);
  console.log(`Remote EID: ${DST_EID} (Sepolia)\n`);

  const [outgoing, incoming, defaultOutgoing, defaultIncoming, sent, received] =
    await Promise.all([
      publicClient.readContract({
        address: COSTON2_OFT_ADAPTER,
        abi: transferLimitingAbi,
        functionName: "outgoingRateLimit",
        args: [DST_EID],
      }),
      publicClient.readContract({
        address: COSTON2_OFT_ADAPTER,
        abi: transferLimitingAbi,
        functionName: "incomingRateLimit",
        args: [DST_EID],
      }),
      publicClient.readContract({
        address: COSTON2_OFT_ADAPTER,
        abi: transferLimitingAbi,
        functionName: "defaultOutgoingRateLimit",
      }),
      publicClient.readContract({
        address: COSTON2_OFT_ADAPTER,
        abi: transferLimitingAbi,
        functionName: "defaultIncomingRateLimit",
      }),
      publicClient.readContract({
        address: COSTON2_OFT_ADAPTER,
        abi: transferLimitingAbi,
        functionName: "getAmountCanBeSent",
        args: [DST_EID],
      }),
      publicClient.readContract({
        address: COSTON2_OFT_ADAPTER,
        abi: transferLimitingAbi,
        functionName: "getAmountCanBeReceived",
        args: [DST_EID],
      }),
    ]);

  printRateLimit(`outgoingRateLimit(${DST_EID})`, outgoing);
  printDefault("defaultOutgoingRateLimit()", defaultOutgoing);
  printRateLimit(`incomingRateLimit(${DST_EID})`, incoming);
  printDefault("defaultIncomingRateLimit()", defaultIncoming);

  const [consumedOut, amountCanBeSent] = sent;
  const [consumedIn, amountCanBeReceived] = received;

  console.log(`\ngetAmountCanBeSent(${DST_EID}):`);
  console.log(`  consumed (after decay): ${formatFxrp(consumedOut)}`);
  console.log(`  remaining: ${formatFxrp(amountCanBeSent)}`);
  if (outgoing.window === 0n) {
    console.log(
      "  note: per-eid window is 0, so the default outgoing limit applies",
    );
  }

  console.log(`\ngetAmountCanBeReceived(${DST_EID}):`);
  console.log(`  consumed (after decay): ${formatFxrp(consumedIn)}`);
  console.log(`  remaining: ${formatFxrp(amountCanBeReceived)}`);
  if (incoming.window === 0n) {
    console.log(
      "  note: per-eid window is 0, so the default incoming limit applies",
    );
  }
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
