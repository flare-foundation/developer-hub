import { ethers } from "ethers";

jest.mock("ethers");

describe("Fetch Feed Configurations", () => {
  let mockProvider;
  let mockContract;
  let consoleSpy;

  beforeEach(() => {
    // Mock the provider
    mockProvider = jest.fn();
    ethers.JsonRpcProvider.mockImplementation(() => mockProvider);

    // Mock the contract
    mockContract = {
      getFeedConfigurations: jest.fn().mockResolvedValue([
        {
          feedId: "0x666565646964", // "feedid" in hex
          rewardBandValue: 1000n,
          inflationShare: 500n,
        },
      ]),
    };
    ethers.Contract.mockImplementation(() => mockContract);

    // Spy on console.log
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch feed configurations and log them", async () => {
    // Require the main function and await its execution
    await require("../ftsov2_config_coston2_ethers");

    expect(ethers.JsonRpcProvider).toHaveBeenCalledWith(
      "https://coston2-api.flare.network/ext/C/rpc",
    );
    expect(ethers.Contract).toHaveBeenCalledWith(
      "0xE7d1D5D58cAE01a82b84989A931999Cb34A86B14",
      expect.any(Array),
      mockProvider,
    );
    expect(mockContract.getFeedConfigurations).toHaveBeenCalled();

    expect(consoleSpy).toHaveBeenCalledWith(
      "feedId:",
      "feedid", // Convert hex to UTF-8 string
      "rewardBandValue:",
      1000n,
      "inflationShare:",
      500n,
    );
  });
});
