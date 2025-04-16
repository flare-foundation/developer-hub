import { artifacts, ethers, run } from "hardhat";
import { FtsoV2ConsumerContract } from "../typechain-types";

const FtsoV2Consumer = artifacts.require("FtsoV2Consumer");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy FtsoV2Consumer
  const ftsoV2Consumer: FtsoV2ConsumerContract = await FtsoV2Consumer.new(
    "0x01464c522f55534400000000000000000000000000",
  );
  console.log("FtsoV2Consumer deployed to:", ftsoV2Consumer.address);

  // Verify the contract
  try {
    await run("verify:verify", {
      address: ftsoV2Consumer.address,
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }

  // Test the contract functions
  try {
    // Test getFLRUSDPrice
    const result = await ftsoV2Consumer.getFlrUsdPrice();
    console.log("\nFLR/USD Price Data:");
    console.log("Price:", result[0].toString());
    console.log("Decimals:", result[1].toString());
    console.log(
      "Timestamp:",
      new Date(result[2].toNumber() * 1000).toISOString(),
    );
  } catch (error) {
    console.error("Error testing getFlrUsdPrice:", error);
  }

  try {
    // Test getFlrUsdPriceWei
    const resultWei = await ftsoV2Consumer.getFlrUsdPriceWei();
    console.log("\nFLR/USD Price Data (Wei):");
    console.log("Price (Wei):", resultWei[0].toString());
    console.log(
      "Timestamp:",
      new Date(resultWei[1].toNumber() * 1000).toISOString(),
    );
  } catch (error) {
    console.error("Error testing getFlrUsdPriceWei:", error);
  }

  try {
    // Test getFtsoV2CurrentFeedValues
    const feedValuesResult = await ftsoV2Consumer.getFtsoV2CurrentFeedValues();
    console.log("\nCurrent Feed Values (FLR/USD, BTC/USD, ETH/USD):");
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
    console.error("Error testing getFtsoV2CurrentFeedValues:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
