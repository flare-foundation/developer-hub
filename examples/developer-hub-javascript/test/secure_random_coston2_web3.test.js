import { Web3 } from "web3";
jest.mock("web3");

// Mock data

describe("Relay Contract Test", () => {
  let mockContract;
  let consoleSpy;
  const mockRandomNumber = 987654321;
  const mockIsSecureRandom = true;
  const mockTimestamp = 1690329600;

  beforeEach(() => {
    // Mock the contract and its methods
    mockContract = {
      methods: {
        getRandomNumber: jest.fn().mockReturnThis(),
        call: jest
          .fn()
          .mockResolvedValue([
            mockRandomNumber,
            mockIsSecureRandom,
            mockTimestamp,
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
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch a secure random number and log the results", async () => {
    // Require the main function and await its execution
    await require("../secure_random_coston2_web3");

    // Check that Web3 was initialized with the correct RPC URL
    expect(Web3).toHaveBeenCalledWith(
      "https://coston2-api.flare.network/ext/C/rpc",
    );

    // Check that the getFeedConfigurations method was called
    expect(mockContract.methods.getRandomNumber).toHaveBeenCalled();
    expect(mockContract.methods.call).toHaveBeenCalled();
  });
});
