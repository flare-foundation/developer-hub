import { main } from "../make_query_flare";

describe("Fetch Contract Address", () => {
  test("should fetch contract address", async () => {
    // Require the main function and await its execution
    const res = await main();
    expect(res).toEqual("0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d");
  });
});
