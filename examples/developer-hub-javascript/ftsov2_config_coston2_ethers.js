// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
import { ethers } from "ethers";

import { interfaceToAbi } from "@flarenetwork/flare-periphery-contract-artifacts";

// FastUpdatesConfiguration address (Flare Testnet Coston2)
// See https://dev.flare.network/ftso/solidity-reference
const ADDRESS = "0xE7d1D5D58cAE01a82b84989A931999Cb34A86B14";
const RPC_URL = "https://coston2-api.flare.network/ext/C/rpc";

// ABI for FastUpdatesConfiguration contract
const abi = interfaceToAbi("IFastUpdatesConfiguration", "coston2");

export async function main() {
  // Connect to an RPC node
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  // Set up contract instance
  const ftsov2Config = new ethers.Contract(ADDRESS, abi, provider);
  // Fetch feed configurations
  const res = await ftsov2Config.getFeedConfigurations();
  // Log results
  for (const feed of res) {
    console.log(
      "feedId:",
      Buffer.from(feed["feedId"].slice(2), "hex").toString("utf-8"),
      "rewardBandValue:",
      feed["rewardBandValue"],
      "inflationShare:",
      feed["inflationShare"],
    );
  }
  return res;
}
