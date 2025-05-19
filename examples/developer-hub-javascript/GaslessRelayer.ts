import express from "express";
import cors from "cors";
import { JsonRpcProvider, Wallet, Contract } from "ethers";
import USD0Abi from "./USD0.json" with { type: "json" };
import "dotenv/config";

// 1) Load + validate env
const {
  FLARE_RPC_URL,
  USD0_ADDRESS,
  RELAYER_PRIVATE_KEY,
  PORT = "3000"
} = process.env;

if (!FLARE_RPC_URL || !USD0_ADDRESS || !RELAYER_PRIVATE_KEY) {
  console.error("❌ Missing FLARE_RPC_URL, USD0_ADDRESS or RELAYER_PRIVATE_KEY");
  process.exit(1);
}

// 2) Set up ethers.js
const provider      = new JsonRpcProvider(FLARE_RPC_URL);
const relayerWallet = new Wallet(RELAYER_PRIVATE_KEY, provider);
const usd0          = new Contract(USD0_ADDRESS, USD0Abi, relayerWallet);

// 3) Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// 4) Health-check
app.get("/", (_req, res) => {
  res.send("✅ Gasless relayer up and running");
});

// 5) Gasless transfer route
app.post("/relay-transfer", async (req, res) => {
  try {
    const { payload, v, r, s } = req.body;
    const tx = await usd0.transferWithAuthorization(
      payload.from,
      payload.to,
      payload.value,
      payload.validAfter,
      payload.validBefore,
      payload.nonce,
      v, r, s,
      { gasLimit: 120_000 }
    );
    const receipt = await tx.wait();
    res.json({ txHash: tx.hash });
  } catch (err: any) {
    console.error("Relayer error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 6) Start server
app.listen(Number(PORT), () => {
  console.log(`✅ Relayer listening on http://localhost:${PORT}`);
});