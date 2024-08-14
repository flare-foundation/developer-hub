import { Web3 } from "web3";

// Mock data
const mockAbi = [
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
const mockAddress = "0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d";

// Mock the fetch function to return a resolved promise with the ABI
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ result: JSON.stringify(mockAbi) }),
  }),
);

// Mock the Web3.eth.Contract object and its methods
jest.mock("web3", () => {
  return {
    Web3: jest.fn().mockImplementation(() => {
      return {
        eth: {
          Contract: jest.fn().mockImplementation(() => {
            return {
              methods: {
                getContractAddressByName: jest.fn().mockReturnValue({
                  call: jest.fn().mockResolvedValue(mockAddress),
                }),
              },
            };
          }),
        },
      };
    }),
  };
});

describe("Web3 contract test", () => {
  it("should fetch the ABI and query the contract address", async () => {
    const registry_addr = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";

    // Fetch ABI
    const base_url = "https://flare-explorer.flare.network/api";
    const params = `?module=contract&action=getabi&address=${registry_addr}`;
    const response = await fetch(base_url + params);
    const abi = JSON.parse((await response.json())["result"]);

    // Query contract
    const w3 = new Web3("https://flare-api.flare.network/ext/C/rpc");
    const registry = new w3.eth.Contract(abi, registry_addr);
    const res = await registry.methods.getContractAddressByName("WNat").call();

    expect(res).toBe(mockAddress);
  });
});
