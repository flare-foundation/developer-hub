global.fetch = jest.fn();
const mockedAbi = [
  {
    inputs: [[Object]],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "getAddressUpdater",
    outputs: [[Object]],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllContracts",
    outputs: [[Object], [Object]],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [[Object]],
    name: "getContractAddressByHash",
    outputs: [[Object]],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [[Object]],
    name: "getContractAddressByName",
    outputs: [[Object]],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [[Object]],
    name: "getContractAddressesByHash",
    outputs: [[Object]],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [[Object]],
    name: "getContractAddressesByName",
    outputs: [[Object]],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [[Object], [Object]],
    name: "updateContractAddresses",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

beforeEach(() => {
  fetch.mockResolvedValue(mockedAbi);
});

afterEach(() => {
  jest.clearAllMocks();
});
describe("Fetch  and log coston2 ABI", () => {
  test("Should Fetch Abi", async () => {
    const response = await fetch(
      "https://coston2-explorer.flare.network/api?module=contract&action=getabi&address=0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
    );
    expect(fetch).toHaveBeenCalledWith(
      "https://coston2-explorer.flare.network/api?module=contract&action=getabi&address=0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
    );
    expect(response).toBe(mockedAbi);
  });
});
