import { expect } from "chai";
import { ethers } from "hardhat";
import { FtsoV2Consumer } from "../typechain-types"; // Adjust the path based on your typechain output directory

describe("FtsoV2Consumer", function () {
  let ftsoV2Consumer: FtsoV2Consumer;

  // Deploy a new instance of the contract before each test
  beforeEach(async function () {
    const FtsoV2ConsumerFactory =
      await ethers.getContractFactory("FtsoV2Consumer");
    ftsoV2Consumer = await FtsoV2ConsumerFactory.deploy();
    await ftsoV2Consumer.waitForDeployment();
    // console.log("FtsoV2Consumer deployed to:", await ftsoV2Consumer.getAddress()); // Optional: log address
  });

  it("Should return the FLR/USD price, decimals, and timestamp", async function () {
    const [price, decimals, timestamp] = await ftsoV2Consumer.getFlrUsdPrice();

    // We can't know the exact price, but we can check the types and basic validity
    expect(price).to.be.a("bigint");
    expect(price).to.be.gt(0); // Price should be greater than 0

    expect(decimals).to.be.a("number");
    // Typical FTSO decimals are often 5 for USD pairs, but let's be flexible
    expect(decimals).to.be.within(-128, 127); // Check it's a valid int8

    expect(timestamp).to.be.a("bigint");
    expect(timestamp).to.be.gt(0); // Timestamp should be positive
    // Check if the timestamp is reasonably recent (e.g., within the last hour)
    const currentTimestamp = Math.floor(Date.now() / 1000);
    expect(Number(timestamp)).to.be.closeTo(currentTimestamp, 3600); // within 1 hour
  });

  it("Should return the FLR/USD price in Wei and timestamp", async function () {
    const [priceWei, timestamp] = await ftsoV2Consumer.getFlrUsdPriceWei();

    expect(priceWei).to.be.a("bigint");
    expect(priceWei).to.be.gt(0); // Price in Wei should be greater than 0

    expect(timestamp).to.be.a("bigint");
    expect(timestamp).to.be.gt(0); // Timestamp should be positive
    const currentTimestamp = Math.floor(Date.now() / 1000);
    expect(Number(timestamp)).to.be.closeTo(currentTimestamp, 3600); // within 1 hour
  });

  it("Should return current feed values for multiple feeds", async function () {
    const [feedValues, decimals, timestamp] =
      await ftsoV2Consumer.getFtsoV2CurrentFeedValues();

    // Get the expected number of feeds from the contract's public variable
    const expectedFeedCount = (await ftsoV2Consumer.feedIds()).length;

    expect(feedValues).to.be.an("array");
    expect(feedValues).to.have.lengthOf(expectedFeedCount);
    feedValues.forEach((value) => {
      expect(value).to.be.a("bigint");
      expect(value).to.be.gt(0);
    });

    expect(decimals).to.be.an("array");
    expect(decimals).to.have.lengthOf(expectedFeedCount);
    decimals.forEach((dec) => {
      expect(dec).to.be.a("number");
      expect(dec).to.be.within(-128, 127); // Check it's a valid int8
    });

    expect(timestamp).to.be.a("bigint");
    expect(timestamp).to.be.gt(0); // Timestamp should be positive
    const currentTimestamp = Math.floor(Date.now() / 1000);
    expect(Number(timestamp)).to.be.closeTo(currentTimestamp, 3600); // within 1 hour
  });

  it("Should have the correct constant flrUsdId", async function () {
    const expectedId = "0x01464c522f55534400000000000000000000000000"; // "FLR/USD"
    const actualId = await ftsoV2Consumer.flrUsdId();
    expect(actualId).to.equal(expectedId);
  });

  it("Should have the correct initial feedIds array", async function () {
    const expectedIds = [
      "0x01464c522f55534400000000000000000000000000", // FLR/USD
      "0x014254432f55534400000000000000000000000000", // BTC/USD
      "0x014554482f55534400000000000000000000000000", // ETH/USD
    ];
    const actualIds = await ftsoV2Consumer.feedIds();
    expect(actualIds).to.deep.equal(expectedIds);
  });
});
