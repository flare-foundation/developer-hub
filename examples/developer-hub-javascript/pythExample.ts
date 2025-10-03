import { artifacts, run } from "hardhat";
import { PythNftMinterInstance } from "../../typechain-types";

// --- Configuration ---
const PythNftMinter: PythNftMinterInstance = artifacts.require("PythNftMinter");

// FTSO Feed ID for BTC / USD (bytes21)
const FTSO_FEED_ID = "0x014254432f55534400000000000000000000000000";
// Pyth Price ID for the same feed (bytes32)
const PYTH_PRICE_ID =
  "0x4254432f55534400000000000000000000000000000000000000000000000001";
// Description for the adapter functionality
const DESCRIPTION = "FTSOv2 BTC/USD adapted for Pyth";

// --- Types ---
interface PriceData {
  price: { toString(): string };
  expo: { toString(): string };
  publishTime: { toString(): string };
}

/**
 * Deploys and verifies the integrated PythNftMinter contract.
 */
async function deployMinter(): Promise<{ minter: PythNftMinterInstance }> {
  // The constructor arguments are now for the PythNftMinter itself.
  const minterArgs: string[] = [FTSO_FEED_ID, PYTH_PRICE_ID, DESCRIPTION];
  console.log("Deploying integrated PythNftMinter with arguments:");
  console.log(`  - FTSO Feed ID: ${minterArgs[0]}`);
  console.log(`  - Pyth Price ID: ${minterArgs[1]}`);
  console.log(`  - Description: ${minterArgs[2]}`);

  const minter = await PythNftMinter.new(...minterArgs);
  console.log("\n✅ PythNftMinter deployed to:", minter.address);

  // Verify the single contract on a live network.
  try {
    console.log("\nVerifying PythNftMinter on block explorer...");
    await run("verify:verify", {
      address: minter.address,
      constructorArguments: minterArgs,
    });
    console.log("Minter verification successful.");
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Minter verification failed:", e.message);
    } else {
      console.error("An unknown error occurred during verification:", e);
    }
  }
  return { minter };
}

/**
 * Interacts with the deployed minter contract to refresh the price and mint an NFT.
 * @param minter The deployed PythNftMinter instance.
 */
async function interactWithMinter(minter: PythNftMinterInstance) {
  console.log(`\n--- Interacting with PythNftMinter at ${minter.address} ---`);

  // 1. Refresh the price from the FTSO on the minter contract itself.
  console.log("\nCalling refresh() to update the price from the FTSO...");
  const refreshResult = await minter.refresh();
  console.log(`Refresh transaction successful! Hash: ${refreshResult.tx}`);

  // 2. Fetch and log the latest price data from the minter contract.
  const latestPriceData = await minter.getPriceUnsafe(PYTH_PRICE_ID);
  logFtsoPriceData("Fetched FTSO price data from minter", latestPriceData);

  // 3. Calculate the required fee and mint the NFT.
  console.log(
    "\nCalculating $1 worth of native token using the refreshed price...",
  );

  const price = BigInt(latestPriceData.price.toString());
  const expo = BigInt(latestPriceData.expo.toString());
  const ether = 10n ** 18n;
  const ten = 10n;
  const absoluteExpo = expo < 0n ? -expo : expo;
  const assetPrice18Decimals = (price * ether) / ten ** absoluteExpo;
  const oneDollarInWei = (ether * ether) / assetPrice18Decimals;

  console.log(`Required payment in wei: ${oneDollarInWei.toString()}`);

  console.log("\nSubmitting mint() transaction...");
  const mintResult = await minter.mint({ value: oneDollarInWei.toString() });
  console.log(`NFT minted successfully! Hash: ${mintResult.tx}`);

  const tokenCounter = await minter.getTokenCounter();
  console.log(`Total NFTs minted: ${tokenCounter.toString()}`);
}

/**
 * Logs the FTSO price data in a human-readable format.
 */
function logFtsoPriceData(label: string, data: PriceData) {
  const { price, expo, publishTime } = data;
  const priceStr = price.toString();
  const expoStr = expo.toString();
  const timestamp = Number(publishTime.toString()) * 1000;
  const decimalPrice = Number(priceStr) * 10 ** Number(expoStr);

  console.log(`\n${label}:`);
  console.log(`  - Raw Price: ${priceStr}`);
  console.log(`  - Exponent: ${expoStr}`);
  console.log(`  - Adjusted Price: ${decimalPrice.toFixed(4)}`);
  console.log(`  - Publish Time: ${new Date(timestamp).toISOString()}`);
}

async function main() {
  console.log("🚀 Starting NFT Minter Management Script 🚀");
  const { minter } = await deployMinter();
  await interactWithMinter(minter);
  console.log("\n🎉 Script finished successfully! 🎉");
}

void main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
