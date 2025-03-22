import { artifacts, ethers } from "hardhat";
import { FtsoV2FeedConsumerInstance } from "../typechain-types";

const FtsoV2FeedConsumer = artifacts.require("FtsoV2FeedConsumer");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy FtsoV2FeedConsumer
  const ftsoConsumer: FtsoV2FeedConsumerInstance = await FtsoV2FeedConsumer.new(
    "0x01464c522f55534400000000000000000000000000",
  );
  console.log("FtsoV2FeedConsumer deployed to:", ftsoConsumer.address);

  // Test the contract functions
  try {
    // Test getFLRUSDPrice
    const result = await ftsoConsumer.getFlrUsdPrice();
    console.log("\nFLR/USD Price Data:");
    console.log("Price:", result[0].toString());
    console.log("Decimals:", result[1].toString());
    console.log(
      "Timestamp:",
      new Date(result[2].toNumber() * 1000).toISOString(),
    );

    // Test checkFees
    const fees = await ftsoConsumer.checkFees();
    console.log("\nFees:", fees.toString());
  } catch (error) {
    console.error("Error testing contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
