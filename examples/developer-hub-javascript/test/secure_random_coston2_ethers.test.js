import { ethers } from "ethers";
jest.mock("ethers");
describe("Relay contract test", () => {
  // Mock data
  const mockRandomNumber =
    31777911215569926936530057423697261920211490587424043377377441646384320413800n;
  const mockIsSecureRandom = true;
  const mockTimestamp = 1723574250n;
  let mockProvider;
  let mockContract;
  let consoleSpy;

  beforeEach(() => {
    // Mock the provider
    mockProvider = jest.fn();
    ethers.JsonRpcProvider.mockImplementation(() => mockProvider);

    // Mock the contract
    mockContract = {
      getRandomNumber: jest
        .fn()
        .mockResolvedValue([
          mockRandomNumber,
          mockIsSecureRandom,
          mockTimestamp,
        ]),
    };
    ethers.Contract.mockImplementation(() => mockContract);

    // Spy on console.log
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch a secure random number and log the results", async () => {
    await require("../secure_random_coston2_ethers");
    expect(ethers.JsonRpcProvider).toHaveBeenCalledWith(
      "https://coston2-api.flare.network/ext/C/rpc",
    );
    expect(ethers.Contract).toHaveBeenCalledWith(
      "0x5CdF9eAF3EB8b44fB696984a1420B56A7575D250",
      expect.any(Array),
      mockProvider,
    );
    // Assertions
    expect(consoleSpy).toHaveBeenCalledWith("Random Number:", mockRandomNumber);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Is secure random:",
      mockIsSecureRandom,
    );
    expect(consoleSpy).toHaveBeenCalledWith("Timestamp:", mockTimestamp);
  });
});
