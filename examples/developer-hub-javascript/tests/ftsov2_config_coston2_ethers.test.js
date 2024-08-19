import { main } from "../ftsov2_config_coston2_ethers";

const mockedResponse = [
  ["0x01464c522f55534400000000000000000000000000", 5000n, 10000n],
  ["0x014254432f55534400000000000000000000000000", 5000n, 10000n],
  ["0x015852502f55534400000000000000000000000000", 5000n, 10000n],
];

describe("Fetch Feed Configurations", () => {
  test("should fetch feed configurations and log them", async () => {
    // Require the main function and await its execution
    const res = await main();
    expect(res).toEqual(expect.arrayContaining(mockedResponse));
  });
});
