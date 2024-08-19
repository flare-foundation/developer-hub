import { main } from "../fetch_abi_flare";

const mockedAbi = [
  {
    inputs: [
      { internalType: "address", name: "_addressUpdater", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
];

describe("Fetch  ABI", () => {
  test("Should Fetch Abi", async () => {
    const responseAbi = await main();
    expect(responseAbi).toEqual(expect.arrayContaining(mockedAbi));
  });
});
