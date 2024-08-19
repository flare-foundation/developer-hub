import { main } from "../ftsov2_config_coston2_web3";

const mockedResponse = [
  {
    0: "0x01464c522f55534400000000000000000000000000",
    1: 5000n,
    2: 10000n,
    __length__: 3,
    feedId: "0x01464c522f55534400000000000000000000000000",
    rewardBandValue: 5000n,
    inflationShare: 10000n,
  },
  {
    0: "0x015347422f55534400000000000000000000000000",
    1: 5000n,
    2: 10000n,
    __length__: 3,
    feedId: "0x015347422f55534400000000000000000000000000",
    rewardBandValue: 5000n,
    inflationShare: 10000n,
  },
  {
    0: "0x014254432f55534400000000000000000000000000",
    1: 5000n,
    2: 10000n,
    __length__: 3,
    feedId: "0x014254432f55534400000000000000000000000000",
    rewardBandValue: 5000n,
    inflationShare: 10000n,
  },
  {
    0: "0x015852502f55534400000000000000000000000000",
    1: 5000n,
    2: 10000n,
    __length__: 3,
    feedId: "0x015852502f55534400000000000000000000000000",
    rewardBandValue: 5000n,
    inflationShare: 10000n,
  },
  {
    0: "0x014c54432f55534400000000000000000000000000",
    1: 5000n,
    2: 10000n,
    __length__: 3,
    feedId: "0x014c54432f55534400000000000000000000000000",
    rewardBandValue: 5000n,
    inflationShare: 10000n,
  },
];

describe("Fetch Feed Configurations", () => {
  test("should fetch feed configurations and log them", async () => {
    // Require the main function and await its execution
    const res = await main();
    expect(res).toEqual(expect.arrayContaining(mockedResponse));
  });
});
