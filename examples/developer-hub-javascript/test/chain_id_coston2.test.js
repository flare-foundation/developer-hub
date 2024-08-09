import {Web3} from "web3"

//Mock the Web3 constructor and its methods
jest.mock("web3", () => {
    return {
        Web3: jest.fn().mockImplementation(() => ({
            eth: {
                getChainId: jest.fn().mockResolvedValue(114),
            },
        })),
    };
});

describe("Web3 initialization", () => {
    it("should create a Web3 instance and get the chain ID", async () => {
        const web3 = new Web3("https://coston2-api.flare.network/ext/C/rpc");

        // Ensure the Web3 constructor was called with the correct argument
        expect(Web3).toHaveBeenCalledWith("https://coston2-api.flare.network/ext/C/rpc");

        const chainId = await web3.eth.getChainId();

        // Ensure getChainId was called
        expect(web3.eth.getChainId).toHaveBeenCalled();

        // Ensure the correct chain ID is returned
        expect(chainId).toBe(114);
    });
});