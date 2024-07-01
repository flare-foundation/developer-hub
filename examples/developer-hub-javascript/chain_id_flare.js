import { Web3 } from "web3";

const web3 = new Web3("https://rpc.ankr.com/flare");
web3.eth.getChainId().then(console.log);
// 14
