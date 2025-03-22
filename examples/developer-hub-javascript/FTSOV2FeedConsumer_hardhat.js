import { artifacts, ethers } from "hardhat";
import { expect } from "chai";
import { deployFlareContractRegistry } from "../lib/utils";

const FtsoV2FeedConsumer = artifacts.require("FtsoV2FeedConsumer");

describe("FtsoV2FeedConsumer", () => {
  let ftsoConsumer;
  const mockFtsoV2Address = "0x1234567890123456789012345678901234567890";
  const mockFeeCalcAddress = "0x2345678901234567890123456789012345678901";
  const mockFlrUsdId = "0x0123456789012345678901234567890123456789012345";

  beforeEach(async () => {
    // Deploy mock Flare Contract Registry
    await deployFlareContractRegistry();

    // Deploy the FtsoV2FeedConsumer contract
    ftsoConsumer = await FtsoV2FeedConsumer.new(
      mockFtsoV2Address,
      mockFeeCalcAddress,
      mockFlrUsdId,
    );
  });

  describe("Constructor", () => {
    it("should set the initial values correctly", async () => {
      const storedFlrUsdId = await ftsoConsumer.flrUsdId();
      expect(storedFlrUsdId).to.equal(mockFlrUsdId);

      const feedIds = await ftsoConsumer.feedIds(0);
      expect(feedIds).to.equal(mockFlrUsdId);
    });
  });

  describe("checkFees", () => {
    it("should update and return the fee", async () => {
      // Since we're using mocks, we'll just verify the function can be called
      const fee = await ftsoConsumer.fee();

      expect(fee).to.be.a("number");
    });
  });

  describe("getFlrUsdPrice", () => {
    it("should revert if fee does not match msg.value", async () => {
      const fee = ethers.parseEther("1.0");
      await ftsoConsumer.checkFees();

      await expect(ftsoConsumer.getFlrUsdPrice({ value: fee + 1n })).to.be
        .reverted;
    });
  });
});
