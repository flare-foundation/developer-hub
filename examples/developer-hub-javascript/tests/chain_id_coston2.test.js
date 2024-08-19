import { main } from "../chain_id_coston2";

describe("Web3 initialization", () => {
  it("should get the chain ID", async () => {
    const chainId = await main();

    // Ensure the correct chain ID is returned
    expect(chainId).toBe(114n);
  });
});
