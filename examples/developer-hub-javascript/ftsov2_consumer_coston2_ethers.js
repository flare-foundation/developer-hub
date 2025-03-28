// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
import { ethers } from "ethers";

import { interfaceToAbi } from "@flarenetwork/flare-periphery-contract-artifacts";

// FtsoV2 address (Flare Testnet Coston2)
// See https://dev.flare.network/ftso/solidity-reference
const FTSOV2_ADDRESS = "0x3d893C53D9e8056135C26C8c638B76C8b60Df726";
const RPC_URL = "https://coston2-api.flare.network/ext/C/rpc";
const FEED_IDS = [
  "0x01464c522f55534400000000000000000000000000", // FLR/USD
  "0x014254432f55534400000000000000000000000000", // BTC/USD
  "0x014554482f55534400000000000000000000000000", // ETH/USD
];

// ABI for FtsoV2
const abi = interfaceToAbi("FtsoV2Interface", "coston2");

export async function main() {
  // Connect to an RPC node
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  // Set up contract instance
  const ftsov2 = new ethers.Contract(FTSOV2_ADDRESS, abi, provider);
  // Fetch current feeds
  const res = await ftsov2.getFeedsById.staticCall(FEED_IDS);
  // Log results
  console.log("Feeds:", res[0]);
  console.log("Decimals:", res[1]);
  console.log("Timestamp:", res[2]);
  return res;
}

main();
