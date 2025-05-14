// 1. install xrpl package:
// npm install xrpl
import { Client, Wallet, xrpToDrops, Payment, TxResponse } from "xrpl";

// 2. Define the function to send XRP with a reference
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
        Destination: "r4KgCNzn9ZuNjpf17DEHZnyyiqpuj599Wm",
        // XRP amount to send
        Amount: xrpToDrops("20.05"),
        // Payment reference
        InvoiceID: "4642505266410001000000000000000000000000000000000000000000f655fb", // Reference
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
