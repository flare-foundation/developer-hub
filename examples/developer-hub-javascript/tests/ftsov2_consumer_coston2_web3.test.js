import { main } from "../ftsov2_consumer_coston2_web3";

describe("Fetch Current Feeds Configurations", () => {
  test("should fetch current feed configurations", async () => {
    // Require the main function and await its execution
    const res = await main();
    expect(res).toEqual(
      expect.objectContaining({
        0: expect.anything(Array),
        1: expect.anything(Array),
        2: expect.anything(Number),
      }),
    );
  });
});
