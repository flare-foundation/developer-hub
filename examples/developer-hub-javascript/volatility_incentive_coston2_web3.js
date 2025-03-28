// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
import { Web3 } from "web3";

import { interfaceToAbi } from "@flarenetwork/flare-periphery-contract-artifacts";

// FastUpdatesIncentiveManager address (Flare Testnet Coston2)
// See https://dev.flare.network/ftso/solidity-reference
const INCENTIVE_ADDRESS = "0x58fb598EC6DB6901aA6F26a9A2087E9274128E59";
const RPC_URL = "https://coston2-api.flare.network/ext/C/rpc";

// ABI for FastUpdatesIncentiveManager contract
const abi = interfaceToAbi("IFastUpdateIncentiveManager", "coston2");

async function main() {
  // Connect to an RPC node
  const w3 = new Web3(RPC_URL);
  const privateKey = process.env.ACCOUNT_PRIVATE_KEY.toString();
  const wallet = w3.eth.accounts.wallet.add(privateKey);
  // Set up contract instance
  const incentive = new w3.eth.Contract(abi, INCENTIVE_ADDRESS);
  // Get the current sample size, sample size increase price, precision, and scale
  const sampleSizeIncreasePrice = await incentive.methods
    .getCurrentSampleSizeIncreasePrice()
    .call();
  console.log(
    "Sample Size Increase Price: %i, Current Sample Size: %i, Current Precision %i, Current Scale %i",
    sampleSizeIncreasePrice,
    await incentive.methods.getExpectedSampleSize().call(),
    await incentive.methods.getPrecision().call(),
    await incentive.methods.getScale().call(),
  );

  // Offer the incentive
  const tx = await incentive.methods
    .offerIncentive({ rangeIncrease: 0, rangeLimit: 0 })
    .send({
      from: wallet[0].address,
      nonce: await w3.eth.getTransactionCount(wallet[0].address),
      gasPrice: await w3.eth.getGasPrice(),
      value: sampleSizeIncreasePrice,
    });
  console.log("Transaction hash:", tx.transactionHash);

  // Log the new sample size, precision, and scale
  console.log(
    "New Sample Size: %i, New Precision %i, New Scale %i",
    await incentive.methods.getExpectedSampleSize().call(),
    await incentive.methods.getPrecision().call(),
    await incentive.methods.getScale().call(),
  );
}

main();
