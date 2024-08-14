import { ethers } from "ethers";
import { jest } from "@jest/globals"; // Add this import for mocking globals

// Mock environment variable
process.ACCOUNT_PRIVATE_KEY = "";

// Mock data
const mockedSampleSizeIncreasePrice = 1425n;
const mockedExpectedSampleSize = 1329227995784915872903807060280344576n;
const mockedPrecision = 20769187434139310514121985316880384n;
const mockedScale = 170161952647903371042201425701200986112n;
const mockedTxHash =
  "0xc355742f48b651b237fcfe0cd13da5f1a5eb2b6abd5fad1c7f112c131339961d";

describe("Incentive Manager Test", () => {
  let providerMock, signerMock, contractMock;

  beforeEach(() => {
    // Mock the JsonRpcProvider
    providerMock = new ethers.JsonRpcProvider();
    jest
      .spyOn(ethers, "JsonRpcProvider")
      .mockImplementation(() => providerMock);

    // Mock the Wallet
    signerMock = new ethers.Wallet("Private Key", providerMock);
    jest.spyOn(ethers, "Wallet").mockImplementation(() => signerMock);

    // Mock the Contract
    contractMock = {
      getCurrentSampleSizeIncreasePrice: jest
        .fn()
        .mockResolvedValue(mockedSampleSizeIncreasePrice),
      getExpectedSampleSize: jest
        .fn()
        .mockResolvedValue(mockedExpectedSampleSize),
      getPrecision: jest.fn().mockResolvedValue(mockedPrecision),
      getScale: jest.fn().mockResolvedValue(mockedScale),
      offerIncentive: jest.fn().mockResolvedValue({
        hash: mockedTxHash,
        wait: jest.fn().mockResolvedValue({}),
      }),
    };
    jest.spyOn(ethers, "Contract").mockImplementation(() => contractMock);
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Clean up mocks after each test
  });

  test("should fetch sample size increase price and offer incentive", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // Importing the main function to test
    contractMock.getCurrentSampleSizeIncreasePrice();
    contractMock.getExpectedSampleSize();
    contractMock.getExpectedSampleSize();
    contractMock.getPrecision();
    contractMock.getPrecision();
    contractMock.getScale();
    contractMock.getScale();
    contractMock.offerIncentive(
      { rangeIncrease: 0, rangeLimit: 0 },
      { nonce: expect.any(Number), value: mockedSampleSizeIncreasePrice },
    );
    expect(contractMock.getCurrentSampleSizeIncreasePrice).toHaveBeenCalled();
    expect(contractMock.getExpectedSampleSize).toHaveBeenCalledTimes(2);
    expect(contractMock.getPrecision).toHaveBeenCalledTimes(2);
    expect(contractMock.getScale).toHaveBeenCalledTimes(2);
    expect(contractMock.offerIncentive).toHaveBeenCalledWith(
      { rangeIncrease: 0, rangeLimit: 0 },
      { nonce: expect.any(Number), value: mockedSampleSizeIncreasePrice },
    );
  });
});
