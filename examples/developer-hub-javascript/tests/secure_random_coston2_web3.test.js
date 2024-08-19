import { main } from "../secure_random_coston2_web3";

describe("Fetch Random Number", () => {
  test("should fetch contract address", async () => {
    // Require the main function and await its execution
    const res = await main();
    expect(res).toEqual(
      expect.objectContaining({
        _randomNumber: expect.anything(Number),
        _isSecureRandom: expect.anything(Boolean),
        _randomTimestamp: expect.anything(Number),
      }),
    );
  });
});
