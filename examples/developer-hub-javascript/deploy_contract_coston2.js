// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
import { Web3 } from "web3";
import fs from "fs";

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://coston2-api.flare.network/ext/C/rpc",
  ),
);

const bytecode = fs.readFileSync("./build/FtsoV2FeedConsumer.bin", "utf8");
import abi from "./build/FtsoV2FeedConsumer.json" assert { type: "json" };
const FtsoV2FeedConsumer = new web3.eth.Contract(abi);

FtsoV2FeedConsumer.handleRevert = true;

async function deploy() {
  const privateKey = process.env.ACCOUNT_PRIVATE_KEY.toString();
  const wallet = web3.eth.accounts.wallet.add(privateKey);

  const contractDeployer = FtsoV2FeedConsumer.deploy({
    data: "0x" + bytecode,
  });

  const tx = await contractDeployer.send({
    from: wallet[0].address,
    nonce: await web3.eth.getTransactionCount(wallet[0].address),
    gasPrice: await web3.eth.getGasPrice(),
  });
  console.log("Contract deployed at address: " + tx.options.address);
}

deploy();
