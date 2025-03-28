// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
import { ethers } from "ethers";

import { interfaceToAbi } from "@flarenetwork/flare-periphery-contract-artifacts";

// FastUpdatesIncentiveManager address (Flare Testnet Coston2)
// See https://dev.flare.network/ftso/solidity-reference
const INCENTIVE_ADDRESS = "0x003e9bD18f73e0B25BED0DC8382Bde6aa999525c";
const RPC_URL = "https://coston2-api.flare.network/ext/C/rpc";

// ABI for FastUpdatesIncentiveManager contract
const abi = interfaceToAbi("IFastUpdateIncentiveManager", "coston2");

async function main() {
  // Connect to an RPC node
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const privateKey = process.env.ACCOUNT_PRIVATE_KEY.toString();
  const signer = new ethers.Wallet(privateKey, provider);
  // Set up contract instance
  const incentive = new ethers.Contract(INCENTIVE_ADDRESS, abi, signer);
  // Get the sample size increase price, sample size, precision, and scale
  const sampleSizeIncreasePrice =
    await incentive.getCurrentSampleSizeIncreasePrice();
  console.log(
    "Sample Size Increase Price: %i, Current Sample Size: %i, Current Precision %i, Current Scale %i",
    sampleSizeIncreasePrice,
    await incentive.getExpectedSampleSize(),
    await incentive.getPrecision(),
    await incentive.getScale(),
  );

  // Offer the incentive
  const tx = await incentive.offerIncentive(
    { rangeIncrease: 0, rangeLimit: 0 },
    {
      nonce: await provider.getTransactionCount(signer.address),
      value: sampleSizeIncreasePrice,
    },
  );

  console.log("Transaction hash:", tx.hash);
  await tx.wait();

  // Log the new sample size, precision, and scale
  console.log(
    "Current Sample Size: %i, Current Precision %i, Current Scale %i",
    await incentive.getExpectedSampleSize(),
    await incentive.getPrecision(),
    await incentive.getScale(),
  );
}

main();
