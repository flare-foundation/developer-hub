import { main } from "../ftsov2_consumer_coston2_ethers";

describe("Fetch Current Feeds Configurations", () => {
  test("should fetch current feed configurations", async () => {
    // Require the main function and await its execution
    const res = await main();
    expect(res.length).toEqual(3);
  });
});
