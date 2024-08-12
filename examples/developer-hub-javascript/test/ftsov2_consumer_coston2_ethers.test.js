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
      fetchCurrentFeeds: jest.fn().mockResolvedValue([
        [153346n, 5909247n, 2646316n], // Example feed values
        [7n, 2n, 3n], // Example decimals
        1723460739n, // Example timestamp
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
    await require("../ftsov2_consumer_coston2_ethers");

    expect(ethers.JsonRpcProvider).toHaveBeenCalledWith(
      "https://coston2-api.flare.network/ext/C/rpc",
    );
    expect(ethers.Contract).toHaveBeenCalledWith(
      "0x58fb598EC6DB6901aA6F26a9A2087E9274128E59",
      expect.any(Array),
      mockProvider,
    );

    expect(mockContract.fetchCurrentFeeds).toHaveBeenCalledWith(
      expect.any(Array),
    );

    expect(consoleSpy).toHaveBeenCalledWith("Feeds:", [
      153346n,
      5909247n,
      2646316n,
    ]);
    expect(consoleSpy).toHaveBeenCalledWith("Decimals:", [7n, 2n, 3n]);
    expect(consoleSpy).toHaveBeenCalledWith("Timestamp:", 1723460739n);
  });
});
