import { Web3 } from "web3";

export async function main() {
  const web3 = new Web3("https://coston2-api.flare.network/ext/C/rpc");
  const chainId = await web3.eth.getChainId();
  console.log(chainId);
  // 114n
  return chainId;
}
