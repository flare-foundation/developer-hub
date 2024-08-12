import Web3 from "web3";

jest.mock("web3");

describe("Fetch Feed Configurations", () => {
  let mockContract;
  let consoleSpy;

  beforeEach(() => {
    // Mock the contract and its methods
    mockContract = {
      methods: {
        getFeedConfigurations: jest.fn().mockReturnThis(),
        call: jest.fn().mockResolvedValue([
          {
            feedId: "0x666565646964", // "feedid" in hex
            rewardBandValue: 1000n,
            inflationShare: 500n,
          },
        ]),
      },
    };

    // Mock the Web3 instance and Contract constructor
    Web3.mockImplementation(() => ({
      eth: {
        Contract: jest.fn().mockImplementation(() => mockContract),
      },
    }));

    // Spy on console.log
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch feed configurations and log them", async () => {
    // Require the main function and await its execution
    await require("../ftsov2_config_coston2_web3.js");

    // Check that Web3 was initialized with the correct RPC URL
    expect(Web3).toHaveBeenCalledWith(
      "https://coston2-api.flare.network/ext/C/rpc",
    );

    // Check that the getFeedConfigurations method was called
    expect(mockContract.methods.getFeedConfigurations).toHaveBeenCalled();
    expect(mockContract.methods.call).toHaveBeenCalled();

    // Check that console.log was called with the expected values
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
