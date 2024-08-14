import Web3 from "web3";

jest.mock("web3");

describe("Fetch Feed Configurations", () => {
  let mockContract;
  let consoleSpy;

  beforeEach(() => {
    // Mock the contract and its methods
    mockContract = {
      methods: {
        fetchCurrentFeeds: jest.fn().mockReturnThis(),
        call: jest.fn().mockResolvedValue([
          [153346n, 5909247n, 2646316n], // Example feed values
          ,
          [7n, 2n, 3n], // Example decimals
          ,
          1723460739n, // Example timestamp
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
    await require("../ftsov2_consumer_coston2_web3");

    // Check that Web3 was initialized with the correct RPC URL
    expect(Web3).toHaveBeenCalledWith(
      "https://coston2-api.flare.network/ext/C/rpc",
    );

    expect(mockContract.methods.fetchCurrentFeeds).toHaveBeenCalled();
    expect(mockContract.methods.call).toHaveBeenCalled();
  });
});
