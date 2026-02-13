/**
 * Example: full FXRP gasless payment flow
 *
 * Copy to scripts/example-usage.ts. Usage: npx ts-node scripts/example-usage.ts
 * Prerequisites: Deploy forwarder, set FORWARDER_ADDRESS, start relayer, have FXRP.
 */

import { Wallet, JsonRpcProvider } from "ethers";
import { createPaymentRequest, approveFXRP, checkUserStatus } from "../utils/payment";
import "dotenv/config";

const RPC_URL = process.env.RPC_URL;
const RELAYER_URL = process.env.RELAYER_URL ?? "http://localhost:3000";
const FORWARDER_ADDRESS = process.env.FORWARDER_ADDRESS;
const USER_PRIVATE_KEY = process.env.USER_PRIVATE_KEY;

async function main(): Promise<void> {
  if (!FORWARDER_ADDRESS || !USER_PRIVATE_KEY) {
    console.error("FORWARDER_ADDRESS and USER_PRIVATE_KEY required");
    process.exit(1);
  }

  const provider = new JsonRpcProvider(RPC_URL);
  const wallet = new Wallet(USER_PRIVATE_KEY, provider);

  console.log("Step 1: Checking FXRP balance and allowance...");
  const status = await checkUserStatus(provider, FORWARDER_ADDRESS, wallet.address);
  console.log(`  Balance: ${status.balanceFormatted}, Allowance: ${status.allowanceFormatted}, Nonce: ${status.nonce}`);

  if (status.needsApproval) {
    console.log("\nStep 2: Approving FXRP...");
    const approval = await approveFXRP(wallet, FORWARDER_ADDRESS);
    console.log(`  TX: ${approval.transactionHash}`);
  } else {
    console.log("\nStep 2: Already approved.");
  }

  const recipient = process.env.RECIPIENT_ADDRESS ?? "0x0000000000000000000000000000000000000001";
  const amountFXRP = "0.1";
  const feeFXRP = "0.01";

  console.log("\nStep 3: Creating payment request...");
  const paymentRequest = await createPaymentRequest(
    wallet,
    FORWARDER_ADDRESS,
    recipient,
    amountFXRP,
    feeFXRP
  );
  console.log(`  Amount: ${paymentRequest.meta.amountFormatted}, Fee: ${paymentRequest.meta.feeFormatted}`);

  console.log("\nStep 4: Submitting to relayer...");
  try {
    const response = await fetch(`${RELAYER_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentRequest),
    });
    const result = (await response.json()) as { success?: boolean; transactionHash?: string; error?: string };
    if (result.success) {
      console.log(`  Success. TX: ${result.transactionHash}`);
    } else {
      console.log(`  Failed: ${result.error}`);
    }
  } catch (error) {
    console.log(`  Error: ${(error as Error).message}. Is the relayer running at ${RELAYER_URL}?`);
  }
}

main().catch(console.error);
