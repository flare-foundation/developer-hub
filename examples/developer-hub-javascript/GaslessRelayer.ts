import express from "express";
import cors from "cors";
import { JsonRpcProvider, Wallet, Contract } from "ethers";
import USD0Abi from "./USD0.json";

import "dotenv/config";

// 1) Load and validate environment variables
const {
  FLARE_RPC_URL,
  USD0_ADDRESS,
  RELAYER_PRIVATE_KEY,
  PORT = "3000", // Default port
  RELAYER_GAS_LIMIT = "120000", // Default gas limit, configurable
} = process.env;

if (!FLARE_RPC_URL || !USD0_ADDRESS || !RELAYER_PRIVATE_KEY) {
  console.error(
    "❌ Critical environment variable missing: Ensure FLARE_RPC_URL, USD0_ADDRESS, and RELAYER_PRIVATE_KEY are set.",
  );
  process.exit(1); // Exit if critical configs are missing
}

// 2) Set up ethers.js provider, wallet, and contract instance
const provider = new JsonRpcProvider(FLARE_RPC_URL);
const relayerWallet = new Wallet(RELAYER_PRIVATE_KEY, provider);
const usd0 = new Contract(USD0_ADDRESS, USD0Abi, relayerWallet);

// 3) Create and configure the Express application
const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON request bodies

// 4) Health-check endpoint
app.get("/", (_req, res) => {
  res.send(
    `✅ Gasless relayer is operational. Relayer account: ${relayerWallet.address}`,
  );
});

// 5) Gasless transfer endpoint
app.post("/relay-transfer", async (req, res) => {
  try {
    const { payload, v, r, s } = req.body;
    console.log(
      `[${new Date().toISOString()}] Received relay request: from=${payload.from}, to=${payload.to}, value=${payload.value}`,
    );

    const tx = await usd0.transferWithAuthorization(
      payload.from,
      payload.to,
      payload.value,
      payload.validAfter,
      payload.validBefore,
      payload.nonce,
      v,
      r,
      s,
      { gasLimit: Number(RELAYER_GAS_LIMIT) }, // Use configurable gas limit
    );

    console.log(
      `Transaction submitted with hash: ${tx.hash}. Waiting for confirmation...`,
    );
    const receipt = await tx.wait(); // Waits for 1 confirmation by default

    console.log(
      `Transaction ${tx.hash} confirmed in block ${receipt?.blockNumber}`,
    );
    res.json({ txHash: tx.hash, blockNumber: receipt?.blockNumber });

    await tx.wait();
    res.json({ txHash: tx.hash });
  } catch (err: unknown) {
    console.error(
      `[${new Date().toISOString()}] Relayer error processing request:`,
      err,
    );
    res.status(500).json({ error: err.message });
  }
});

// 6) Start the Express server
const portNumber = Number(PORT);
app.listen(portNumber, () => {
  console.log(`✅ Relayer service listening on http://localhost:${portNumber}`);
  console.log(`🔑 Relayer wallet address: ${relayerWallet.address}`);
  console.log(`⛽ Default Gas Limit for transactions: ${RELAYER_GAS_LIMIT}`);
});
