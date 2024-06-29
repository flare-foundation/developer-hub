import { Web3 } from "web3";

const w3 = new Web3();
w3.eth.accounts.wallet.create(1);
console.log(
  `Account: ${w3.eth.accounts.wallet[0].address}, Private key: ${w3.eth.accounts.wallet[0].privateKey}`,
);
