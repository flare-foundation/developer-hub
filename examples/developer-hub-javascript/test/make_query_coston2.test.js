import { Web3 } from "web3";

// Mock data
const mockAbi = [
  {
    inputs: [[Array]],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "getAddressUpdater",
    outputs: [[Array]],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllContracts",
    outputs: [[Array], [Array]],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [[Array]],
    name: "getContractAddressByHash",
    outputs: [[Array]],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [[Array]],
    name: "getContractAddressByName",
    outputs: [[Array]],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [[Array]],
    name: "getContractAddressesByHash",
    outputs: [[Array]],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [[Array]],
    name: "getContractAddressesByName",
    outputs: [[Array]],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [[Array], [Array]],
    name: "updateContractAddresses",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const mockAddress = "0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273";

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
    const base_url = "https://coston2-explorer.flare.network/api";
    const params = `?module=contract&action=getabi&address=${registry_addr}`;
    const response = await fetch(base_url + params);
    const abi = JSON.parse((await response.json())["result"]);

    // Query contract
    const w3 = new Web3("https://coston2-api.flare.network/ext/C/rpc");
    const registry = new w3.eth.Contract(abi, registry_addr);
    const res = await registry.methods.getContractAddressByName("WNat").call();
    expect(res).toBe(mockAddress);
  });
});
