import { main } from "../make_query_coston2";

describe("Fetch Contract Address", () => {
  test("should fetch contract address", async () => {
    // Require the main function and await its execution
    const res = await main();
    expect(res).toEqual("0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273");
  });
});
