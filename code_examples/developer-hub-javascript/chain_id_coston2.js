import { Web3 } from "web3";

const web3 = new Web3("https://rpc.ankr.com/flare_coston2");
web3.eth.getChainId().then(console.log);
// 114