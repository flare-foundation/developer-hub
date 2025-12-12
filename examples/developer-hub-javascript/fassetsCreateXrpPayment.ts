// 1. install xrpl package
// https://www.npmjs.com/package/xrpl
import type { Payment, TxResponse } from "xrpl";
import { Client, Wallet, xrpToDrops } from "xrpl";

// 2. Define the constants
const AGENT_ADDRESS = "r4KgCNzn9ZuNjpf17DEHZnyyiqpuj599Wm"; // Agent underlying chain address
const AMOUNT_XRP = "10.025"; // XRP amount to send
const PAYMENT_REFERENCE =
  "4642505266410001000000000000000000000000000000000000000000f655fb"; // Reference

async function send20XrpWithReference() {
  // 3. Create a client to connect to the XRP Ledger Testnet
  const client = new Client("wss://s.altnet.rippletest.net:51233"); // Testnet
  await client.connect();

  // 4. XRP Ledger Testnet seed
  const wallet: Wallet = Wallet.fromSeed("s000000000000000000000000000000"); // Sender wallet seed

  // 5. Create a payment transaction
  const paymentTx: Payment = {
    TransactionType: "Payment",
    Account: wallet.classicAddress,
    // Agent underlying chain address
    Destination: AGENT_ADDRESS,
    // XRP amount to send
    Amount: xrpToDrops(AMOUNT_XRP),
    // Payment reference
    Memos: [
      {
        Memo: {
          MemoData: PAYMENT_REFERENCE,
        },
      },
    ],
  };

  console.log(paymentTx);

  // 6. Execute the transaction
  const prepared = await client.autofill(paymentTx);
  const signed = wallet.sign(prepared);
  const result: TxResponse = await client.submitAndWait(signed.tx_blob);

  console.log("Transaction hash:", signed.hash);
  console.log("Explorer: https://testnet.xrpl.org/transactions/" + signed.hash);
  console.log("Result:", result);

  await client.disconnect();
}

send20XrpWithReference().catch(console.error);
