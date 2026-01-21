/**
 * x402 Payment Agent
 *
 * Interactive CLI agent for making x402 payments with EIP-3009.
 *
 * Run: npx ts-node scripts/x402/agent.ts
 */

// full walkthrough of x402 payment process including authorization and payment.

import { ethers } from "ethers";
import * as readline from "readline";
import "dotenv/config";

// Configuration
const COSTON2_RPC =
  process.env.COSTON2_RPC_URL || "https://coston2-api.flare.network/ext/C/rpc";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const TOKEN_ADDRESS = process.env.X402_TOKEN_ADDRESS || "";
const FACILITATOR_ADDRESS = process.env.X402_FACILITATOR_ADDRESS || "";
const BACKEND_URL = process.env.X402_BACKEND_URL || "http://localhost:3402";

// ABIs
const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function DOMAIN_SEPARATOR() view returns (bytes32)",
  "function authorizationState(address, bytes32) view returns (bool)",
  "function mint(address to, uint256 amount)",
];

const FACILITATOR_ABI = [
  "function verifyPayment((address from, address to, address token, uint256 value, uint256 validAfter, uint256 validBefore, bytes32 nonce, uint8 v, bytes32 r, bytes32 s)) view returns (bytes32 paymentId, bool valid)",
];

// EIP-712 Types for transferWithAuthorization
const EIP712_TYPES = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
};

interface PaymentRequirement {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  payTo: string;
  extra: {
    tokenAddress: string;
    facilitatorAddress: string;
    chainId: number;
  };
}

interface AuthorizationParams {
  from: string;
  to: string;
  value: bigint;
  validAfter: number;
  validBefore: number;
  nonce: string;
}

interface SignedAuthorization extends AuthorizationParams {
  v: number;
  r: string;
  s: string;
  signature: string;
}

class X402Agent {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private tokenContract: ethers.Contract;
  private facilitatorContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(COSTON2_RPC);
    this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
    this.tokenContract = new ethers.Contract(
      TOKEN_ADDRESS,
      TOKEN_ABI,
      this.wallet,
    );
    this.facilitatorContract = new ethers.Contract(
      FACILITATOR_ADDRESS,
      FACILITATOR_ABI,
      this.wallet,
    );
  }

  async getBalance(): Promise<string> {
    const balance = await this.tokenContract.balanceOf(this.wallet.address);
    const decimals = await this.tokenContract.decimals();
    const symbol = await this.tokenContract.symbol();
    return `${ethers.formatUnits(balance, decimals)} ${symbol}`;
  }

  async fetchPaymentRequirements(
    resourcePath: string,
  ): Promise<PaymentRequirement | null> {
    const response = await fetch(`${BACKEND_URL}${resourcePath}`);

    if (response.status !== 402) {
      console.log("Resource is free or already accessible");
      const data = await response.json();
      console.log("Response:", JSON.stringify(data, null, 2));
      return null;
    }

    const paymentData = await response.json();
    return paymentData.accepts[0];
  }

  async createAuthorization(
    params: AuthorizationParams,
  ): Promise<SignedAuthorization> {
    const tokenName = await this.tokenContract.name();

    const domain = {
      name: tokenName,
      version: "1",
      chainId: 114,
      verifyingContract: TOKEN_ADDRESS,
    };

    const message = {
      from: params.from,
      to: params.to,
      value: params.value,
      validAfter: params.validAfter,
      validBefore: params.validBefore,
      nonce: params.nonce,
    };

    console.log("\n📝 EIP-712 Authorization Details:");
    console.log("─".repeat(50));
    console.log(`From:         ${params.from}`);
    console.log(`To:           ${params.to}`);
    console.log(`Value:        ${ethers.formatUnits(params.value, 6)} USDT0`);
    console.log(
      `Valid After:  ${new Date(params.validAfter * 1000).toISOString()}`,
    );
    console.log(
      `Valid Before: ${new Date(params.validBefore * 1000).toISOString()}`,
    );
    console.log(`Nonce:        ${params.nonce}`);
    console.log("─".repeat(50));

    const signature = await this.wallet.signTypedData(
      domain,
      EIP712_TYPES,
      message,
    );
    const sig = ethers.Signature.from(signature);

    return {
      ...params,
      v: sig.v,
      r: sig.r,
      s: sig.s,
      signature,
    };
  }

  async verifyAuthorization(
    auth: SignedAuthorization,
  ): Promise<{ paymentId: string; valid: boolean }> {
    const payload = {
      from: auth.from,
      to: auth.to,
      token: TOKEN_ADDRESS,
      value: auth.value,
      validAfter: auth.validAfter,
      validBefore: auth.validBefore,
      nonce: auth.nonce,
      v: auth.v,
      r: auth.r,
      s: auth.s,
    };

    const [paymentId, valid] =
      await this.facilitatorContract.verifyPayment(payload);
    return { paymentId, valid };
  }

  async executePaymentAndFetch(
    resourcePath: string,
    auth: SignedAuthorization,
  ): Promise<{ data: unknown; paymentResponse: unknown }> {
    const paymentPayload = {
      from: auth.from,
      to: auth.to,
      token: TOKEN_ADDRESS,
      value: auth.value.toString(),
      validAfter: auth.validAfter.toString(),
      validBefore: auth.validBefore.toString(),
      nonce: auth.nonce,
      v: auth.v,
      r: auth.r,
      s: auth.s,
    };

    const paymentHeader = Buffer.from(JSON.stringify(paymentPayload)).toString(
      "base64",
    );

    const response = await fetch(`${BACKEND_URL}${resourcePath}`, {
      headers: {
        "X-Payment": paymentHeader,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      const paymentResponseHeader = response.headers.get("X-Payment-Response");
      if (paymentResponseHeader) {
        data.x402PaymentResponse = JSON.parse(
          Buffer.from(paymentResponseHeader, "base64").toString(),
        );
      }
    }

    return { status: response.status, data };
  }

  async processPayment(resourcePath: string): Promise<void> {
    console.log(`\n🔍 Checking payment requirements for ${resourcePath}...`);

    // Step 1: Fetch payment requirements
    const requirement = await this.fetchPaymentRequirements(resourcePath);
    if (!requirement) {
      return;
    }

    console.log("\n💰 Payment Required:");
    console.log(
      `   Amount: ${ethers.formatUnits(requirement.maxAmountRequired, 6)} USDT0`,
    );
    console.log(`   Payee:  ${requirement.payTo}`);

    // Step 2: Check balance
    const balance = await this.getBalance();
    console.log(`\n💳 Your Balance: ${balance}`);

    // Step 3: Prompt for confirmation
    const confirmed = await this.promptConfirmation(
      `Do you want to authorize payment of ${ethers.formatUnits(requirement.maxAmountRequired, 6)} USDT0?`,
    );

    if (!confirmed) {
      console.log("❌ Payment cancelled");
      return;
    }

    // Step 4: Create authorization
    console.log("\n✍️  Creating EIP-3009 authorization...");

    const nonce = ethers.hexlify(ethers.randomBytes(32));
    const validAfter = Math.floor(Date.now() / 1000) - 60;
    const validBefore = Math.floor(Date.now() / 1000) + 300;

    const authParams: AuthorizationParams = {
      from: this.wallet.address,
      to: requirement.payTo,
      value: BigInt(requirement.maxAmountRequired),
      validAfter,
      validBefore,
      nonce,
    };

    const signedAuth = await this.createAuthorization(authParams);
    console.log("✅ Authorization signed");

    // Step 5: Verify authorization
    console.log("\n🔐 Verifying authorization with facilitator...");
    const { paymentId, valid } = await this.verifyAuthorization(signedAuth);
    console.log(`   Payment ID: ${paymentId}`);
    console.log(`   Valid: ${valid}`);

    if (!valid) {
      console.log("❌ Authorization verification failed");
      return;
    }

    // Step 6: Execute payment and fetch resource
    console.log("\n📤 Submitting payment and fetching resource...");
    const result = await this.executePaymentAndFetch(resourcePath, signedAuth);

    if (result.status === 200) {
      console.log("\n✅ Payment successful!");
      console.log("─".repeat(50));
      console.log("📦 Resource Data:");
      console.log(JSON.stringify(result.data, null, 2));

      if (result.data.x402PaymentResponse) {
        console.log("\n🧾 Payment Receipt:");
        console.log(
          `   Transaction: ${result.data.x402PaymentResponse.transactionHash}`,
        );
        console.log(
          `   Payment ID:  ${result.data.x402PaymentResponse.paymentId}`,
        );
      }
    } else {
      console.log(`\n❌ Payment failed (${result.status}):`);
      console.log(JSON.stringify(result.data, null, 2));
    }
  }

  private promptConfirmation(question: string): Promise<boolean> {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(`\n${question} (y/n): `, (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
      });
    });
  }

  private prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  async interactiveMode(): Promise<void> {
    console.log("\n🤖 x402 Payment Agent");
    console.log("═".repeat(50));
    console.log(`Wallet:      ${this.wallet.address}`);
    console.log(`Token:       ${TOKEN_ADDRESS}`);
    console.log(`Facilitator: ${FACILITATOR_ADDRESS}`);
    console.log(`Backend:     ${BACKEND_URL}`);
    console.log("═".repeat(50));

    const balance = await this.getBalance();
    console.log(`Balance:     ${balance}`);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log("\n📋 Available Commands:");
      console.log("  1. Fetch /api/public (free)");
      console.log("  2. Fetch /api/premium-data (0.1 USDT0)");
      console.log("  3. Fetch /api/report (0.5 USDT0)");
      console.log("  4. Check balance");
      console.log("  5. Mint test tokens");
      console.log("  6. Exit");

      const choice = await this.prompt("\nSelect option: ");

      switch (choice) {
        case "1":
          await this.fetchPaymentRequirements("/api/public");
          break;
        case "2":
          await this.processPayment("/api/premium-data");
          break;
        case "3":
          await this.processPayment("/api/report");
          break;
        case "4": {
          const bal = await this.getBalance();
          console.log(`\n💳 Balance: ${bal}`);
          break;
        }
        case "5": {
          console.log("\n🪙 Minting test tokens...");
          const tx = await this.tokenContract.mint(
            this.wallet.address,
            ethers.parseUnits("1000", 6),
          );
          await tx.wait();
          console.log("✅ Minted 1000 test tokens");
          break;
        }
        case "6":
          console.log("\n👋 Goodbye!");
          process.exit(0);
          break;
        default:
          console.log("Invalid option");
      }
    }
  }
}

// Run agent
async function main() {
  if (!PRIVATE_KEY) {
    console.error("❌ PRIVATE_KEY not set in environment");
    process.exit(1);
  }

  if (!TOKEN_ADDRESS) {
    console.error("❌ X402_TOKEN_ADDRESS not set in environment");
    console.error(
      "\nRun deployment first: yarn hardhat run scripts/x402/deploy.ts --network coston2",
    );
    process.exit(1);
  }

  if (!FACILITATOR_ADDRESS) {
    console.error("❌ X402_FACILITATOR_ADDRESS not set in environment");
    console.error(
      "\nRun deployment first: yarn hardhat run scripts/x402/deploy.ts --network coston2",
    );
    process.exit(1);
  }

  const agent = new X402Agent();
  await agent.interactiveMode();
}

main().catch(console.error);
