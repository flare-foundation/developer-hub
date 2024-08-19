import { main } from "../secure_random_coston2_ethers";

describe("Fetch Random Number", () => {
  test("should fetch contract address", async () => {
    // Require the main function and await its execution
    const res = await main();
    expect(res.length).toEqual(3);
  });
});
