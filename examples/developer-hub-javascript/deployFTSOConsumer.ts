import { ethers, run } from "hardhat";
import type { FtsoV2ConsumerContract } from "../typechain-types";

const FtsoV2Consumer = artifacts.require("FtsoV2Consumer");

async function verifyContract(address: string) {
  console.log("\nVerifying contract...");
  try {
    await run("verify:verify", { address });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
}

async function callGetFlrUsdPrice(ftsoV2Consumer: FtsoV2ConsumerContract) {
  console.log("\nCalling getFlrUsdPrice...");
  try {
    const result = await ftsoV2Consumer.getFlrUsdPrice();
    console.log("FLR/USD Price Data:");
    console.log("  Price:", result[0].toString());
    console.log("  Decimals:", result[1].toString());
    console.log(
      "  Timestamp:",
      new Date(result[2].toNumber() * 1000).toISOString(),
    );
  } catch (error) {
    console.error("Error calling getFlrUsdPrice:", error);
  }
}

async function callGetFlrUsdPriceWei(ftsoV2Consumer: FtsoV2ConsumerContract) {
  console.log("\nCalling getFlrUsdPriceWei...");
  try {
    const resultWei = await ftsoV2Consumer.getFlrUsdPriceWei();
    console.log("FLR/USD Price Data (Wei):");
    console.log("  Price (Wei):", resultWei[0].toString());
    console.log(
      "  Timestamp:",
      new Date(resultWei[1].toNumber() * 1000).toISOString(),
    );
  } catch (error) {
    console.error("Error calling getFlrUsdPriceWei:", error);
  }
}

async function callFtsoV2CurrentFeedValues(
  ftsoV2Consumer: FtsoV2ConsumerContract,
) {
  console.log("\nCalling getFtsoV2CurrentFeedValues...");
  try {
    const feedValuesResult = await ftsoV2Consumer.getFtsoV2CurrentFeedValues();
    console.log("Current Feed Values (FLR/USD, BTC/USD, ETH/USD):");
    const feedIds = ["FLR/USD", "BTC/USD", "ETH/USD"]; // Match order in contract
    for (let i = 0; i < feedValuesResult[0].length; i++) {
      console.log(`  Feed ${feedIds[i]}:`);
      console.log(`    Price: ${feedValuesResult[0][i].toString()}`);
      console.log(`    Decimals: ${feedValuesResult[1][i].toString()}`);
    }
    console.log(
      `  Timestamp: ${new Date(feedValuesResult[2].toNumber() * 1000).toISOString()}`,
    );
  } catch (error) {
    console.error("Error calling getFtsoV2CurrentFeedValues:", error);
  }
}

async function callContractFunctions(ftsoV2Consumer: FtsoV2ConsumerContract) {
  await callGetFlrUsdPrice(ftsoV2Consumer);
  await callGetFlrUsdPriceWei(ftsoV2Consumer);
  await callFtsoV2CurrentFeedValues(ftsoV2Consumer);
}

// --- Main Deployment Script ---

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy FtsoV2Consumer
  const ftsoV2Consumer: FtsoV2ConsumerContract = await FtsoV2Consumer.new(
    "0x01464c522f55534400000000000000000000000000", // Deploying contract with FLR Feed (see more feeds here: https://dev.flare.network/ftso/feeds)
  );
  await ftsoV2Consumer.deployed();
  console.log("FtsoV2Consumer deployed to:", ftsoV2Consumer.address);

  // Verify the contract
  await verifyContract(ftsoV2Consumer.address);

  // Call the contract functions
  await callContractFunctions(ftsoV2Consumer);

  console.log("\nDeployment and calling script finished.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unhandled error in main execution:", error);
    process.exit(1);
  });
