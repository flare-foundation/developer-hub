/**
 * Example: How to use the FXRP Gasless Payment System
 *
 * This script demonstrates the complete flow:
 * 1. Check user's FXRP balance and allowance
 * 2. Approve the forwarder (if needed)
 * 3. Create and sign a gasless payment request
 * 4. Submit to the relayer
 *
 * Prerequisites:
 * - Deploy the GaslessPaymentForwarder contract
 * - Set the FORWARDER_ADDRESS in the environment variables
 * - Start the relayer service
 * - Have FXRP in your wallet
 *
 * Usage: npm run example
 */

// 1. Import the necessary libraries
import { Wallet, JsonRpcProvider } from "ethers";
import {
  createPaymentRequest,
  approveFXRP,
  checkUserStatus,
} from "../utils/payment";
import "dotenv/config";

// 2. Configuration from environment
const RPC_URL = process.env.RPC_URL;
const RELAYER_URL = process.env.RELAYER_URL;
const FORWARDER_ADDRESS = process.env.FORWARDER_ADDRESS;
const USER_PRIVATE_KEY = process.env.USER_PRIVATE_KEY;

// Relayer /execute API response type
interface RelayerResponse {
  success?: boolean;
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: string;
  error?: string;
}

async function main(): Promise<void> {
  console.log("=== FXRP Gasless Payment Example ===\n");

  // 3. Validate configuration
  if (!FORWARDER_ADDRESS) {
    console.error("Error: FORWARDER_ADDRESS not set in environment");
    process.exit(1);
  }
  if (!USER_PRIVATE_KEY) {
    console.error("Error: USER_PRIVATE_KEY not set in environment");
    process.exit(1);
  }

  // 4. Setup provider and wallet
  const provider = new JsonRpcProvider(RPC_URL);
  const wallet = new Wallet(USER_PRIVATE_KEY, provider);

  console.log(`User address: ${wallet.address}`);
  console.log(`Forwarder: ${FORWARDER_ADDRESS}`);
  console.log(`Relayer: ${RELAYER_URL}\n`);

  // 5. Check user FXRP balance and allowance
  console.log("Step 1: Checking FXRP balance and allowance...");
  const status = await checkUserStatus(
    provider,
    FORWARDER_ADDRESS,
    wallet.address,
  );

  console.log(`  FXRP Token: ${status.fxrpAddress}`);
  console.log(`  Balance: ${status.balanceFormatted}`);
  console.log(`  Allowance: ${status.allowanceFormatted}`);
  console.log(`  Nonce: ${status.nonce}`);

  // 6. Approve FXRP for forwarder (if needed)
  if (status.needsApproval) {
    console.log("\nStep 2: Approving FXRP for gasless payments...");
    const approvalResult = await approveFXRP(wallet, FORWARDER_ADDRESS);
    console.log(`  Approved! TX: ${approvalResult.transactionHash}`);
  } else {
    console.log("\nStep 2: Already approved, skipping...");
  }

  // 7. Create and sign the payment request
  const recipientAddress =
    process.env.RECIPIENT_ADDRESS ||
    "0x0000000000000000000000000000000000000001";
  const amountFXRP = "0.1"; // 0.1 FXRP
  const feeFXRP = "0.01"; // 0.01 FXRP relayer fee

  console.log(`\nStep 3: Creating payment request...`);
  console.log(`  To: ${recipientAddress}`);
  console.log(`  Amount: ${amountFXRP} FXRP`);
  console.log(`  Fee: ${feeFXRP} FXRP`);

  const paymentRequest = await createPaymentRequest(
    wallet,
    FORWARDER_ADDRESS,
    recipientAddress,
    amountFXRP,
    feeFXRP,
  );

  console.log(`\n  Signed request created:`);
  console.log(`    From: ${paymentRequest.from}`);
  console.log(`    To: ${paymentRequest.to}`);
  console.log(`    Amount: ${paymentRequest.meta.amountFormatted}`);
  console.log(`    Fee: ${paymentRequest.meta.feeFormatted}`);
  console.log(
    `    Deadline: ${new Date(paymentRequest.deadline * 1000).toISOString()}`,
  );
  console.log(`    Signature: ${paymentRequest.signature.slice(0, 20)}...`);

  // 8. Submit the payment request to the relayer
  console.log(`\nStep 4: Submitting to relayer...`);

  try {
    const response = await fetch(`${RELAYER_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentRequest),
    });

    const result = (await response.json()) as RelayerResponse;

    if (result.success) {
      console.log(`  Payment executed successfully!`);
      console.log(`  Transaction: ${result.transactionHash}`);
      console.log(`  Block: ${result.blockNumber}`);
      console.log(`  Gas used: ${result.gasUsed}`);
    } else {
      console.log(`  Payment failed: ${result.error}`);
    }
  } catch (error) {
    const err = error as Error;
    console.log(`  Failed to reach relayer: ${err.message}`);
    console.log(`\n  Make sure the relayer is running at ${RELAYER_URL}`);

    // Output the request for manual submission
    console.log(`\n  You can manually submit this request:`);
    console.log(JSON.stringify(paymentRequest, null, 2));
  }
}

// 9. Main entry point for the example usage script
main().catch(console.error);
