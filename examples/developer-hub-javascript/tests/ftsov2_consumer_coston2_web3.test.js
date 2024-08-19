import { main } from "../ftsov2_consumer_coston2_web3";

describe("Fetch Current Feeds Configurations", () => {
  test("should fetch current feed configurations", async () => {
    // Require the main function and await its execution
    const res = await main();
    expect(res).toEqual(
      expect.objectContaining({
        _feeds: expect.anything(Array),
        _decimals: expect.anything(Array),
        _timestamp: expect.anything(Number),
      }),
    );
  });
});
