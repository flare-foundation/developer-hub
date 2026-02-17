/**
 * FXRP Gasless Payment Relayer Service
 *
 * This service accepts signed payment requests from users and submits them
 * to the blockchain, paying gas fees on behalf of users.
 *
 * Usage:
 *   npx ts-node relayer/index.ts
 *
 * Environment variables required:
 *   RELAYER_PRIVATE_KEY - Private key of the relayer wallet
 *   FORWARDER_ADDRESS - Address of the deployed GaslessPaymentForwarder contract
 *   RPC_URL - Flare network RPC URL (optional, defaults to Coston2 testnet)
 */

// 1. Import the necessary libraries
import { ethers, Contract, Wallet, JsonRpcProvider } from "ethers";
import {
  erc20Abi,
  recoverTypedDataAddress,
  type TypedDataDomain,
  type TypedData,
} from "viem";
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import type { GaslessPaymentForwarder } from "../typechain-types/contracts/GaslessPaymentForwarder";
import { GaslessPaymentForwarder__factory } from "../typechain-types/factories/contracts/GaslessPaymentForwarder__factory";

// 2. Define the network configurations

// EIP-712 domain and types (viem format, must match contract)
const EIP712_DOMAIN: TypedDataDomain = {
  name: "GaslessPaymentForwarder",
  version: "1",
};

const PAYMENT_REQUEST_TYPES = {
  PaymentRequest: [
    { name: "from", type: "address" as const },
    { name: "to", type: "address" as const },
    { name: "amount", type: "uint256" as const },
    { name: "fee", type: "uint256" as const },
    { name: "nonce", type: "uint256" as const },
    { name: "deadline", type: "uint256" as const },
  ],
} satisfies TypedData;

// Network configurations
const NETWORKS: Record<string, { rpc: string; chainId: number }> = {
  flare: {
    rpc: "https://flare-api.flare.network/ext/C/rpc",
    chainId: 14,
  },
  coston2: {
    rpc: "https://coston2-api.flare.network/ext/C/rpc",
    chainId: 114,
  },
  songbird: {
    rpc: "https://songbird-api.flare.network/ext/C/rpc",
    chainId: 19,
  },
};

// 3. Define the type definitions
export interface RelayerConfig {
  relayerPrivateKey: string;
  forwarderAddress: string;
  rpcUrl?: string;
}

export interface PaymentRequest {
  from: string;
  to: string;
  amount: string;
  fee: string;
  deadline: number;
  signature: string;
}

export interface ExecuteResult {
  success: boolean;
  transactionHash: string;
  blockNumber: number | null;
  gasUsed: string;
}

// 4. Define the GaslessRelayer class
export class GaslessRelayer {
  private config: RelayerConfig;
  private provider: JsonRpcProvider;
  private wallet: Wallet;
  private forwarder: GaslessPaymentForwarder;

  constructor(config: RelayerConfig) {
    this.config = config;

    // Setup provider and wallet
    const rpcUrl = config.rpcUrl || NETWORKS.coston2.rpc;
    this.provider = new JsonRpcProvider(rpcUrl);
    this.wallet = new Wallet(config.relayerPrivateKey, this.provider);

    // Setup contract (generated ABI from typechain-types)
    this.forwarder = GaslessPaymentForwarder__factory.connect(
      config.forwarderAddress,
      this.wallet,
    );

    console.log(`Relayer initialized`);
    console.log(`  Relayer address: ${this.wallet.address}`);
    console.log(`  Forwarder contract: ${config.forwarderAddress}`);
  }

  // 5. Execute a single gasless payment using the forwarder contract
  async executePayment(request: PaymentRequest): Promise<ExecuteResult> {
    // Normalize and validate request format
    const from = ethers.getAddress(request.from);
    const to = ethers.getAddress(request.to);
    const amount = BigInt(request.amount);
    const fee = BigInt(request.fee);
    const deadline = Number(request.deadline);
    const sig = request.signature;
    if (typeof sig !== "string" || sig.length < 130) {
      throw new Error("Invalid signature: must be a hex string");
    }
    const signature = sig.startsWith("0x") ? sig : "0x" + sig;

    const normalizedRequest: PaymentRequest = {
      from,
      to,
      amount: amount.toString(),
      fee: fee.toString(),
      deadline,
      signature,
    };

    // Verify EIP-712 signature off-chain (catches domain/nonce mismatches before submitting)
    const chainId = (await this.provider.getNetwork()).chainId;
    const nonce = await this.forwarder.getNonce(from);
    const domain: TypedDataDomain = {
      ...EIP712_DOMAIN,
      chainId: Number(chainId),
      verifyingContract: ethers.getAddress(
        this.config.forwarderAddress,
      ) as `0x${string}`,
    };
    const message = {
      from,
      to,
      amount,
      fee,
      nonce,
      deadline,
    };
    let recoveredAddress: string;
    try {
      recoveredAddress = await recoverTypedDataAddress({
        domain,
        types: PAYMENT_REQUEST_TYPES,
        primaryType: "PaymentRequest",
        message,
        signature: signature as `0x${string}`,
      });
    } catch (e) {
      throw new Error(
        `Invalid signature format: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
    if (recoveredAddress.toLowerCase() !== from.toLowerCase()) {
      throw new Error(
        `Signature invalid: recovered ${recoveredAddress} but expected ${from}. ` +
          `Check chainId (expected ${chainId}), forwarder address, and nonce (expected ${nonce}).`,
      );
    }

    // Validate the request
    await this.validateRequest(normalizedRequest);

    // Simulate first (fails fast, may yield better revert reason)
    try {
      await this.forwarder.executePayment.staticCall(
        from,
        to,
        amount,
        fee,
        deadline,
        signature,
      );
    } catch (simError) {
      const err = simError as Error & { reason?: string; data?: string };
      const msg =
        err.reason || (err.data ? `revert data: ${err.data}` : err.message);
      throw new Error(`Contract simulation failed: ${msg}`);
    }

    // Re-check nonce right before send (prevents race if another request executed first)
    const nonceNow = await this.forwarder.getNonce(from);
    if (nonceNow !== nonce) {
      throw new Error(
        `Nonce changed (was ${nonce}, now ${nonceNow}). ` +
          `Payment may have been submitted by another request. Please create a new payment request.`,
      );
    }

    // Estimate gas (staticCall uses block limit, so we must estimate for real tx)
    let gasLimit: bigint;
    try {
      const estimated = await this.forwarder.executePayment.estimateGas(
        from,
        to,
        amount,
        fee,
        deadline,
        signature,
      );
      gasLimit = (estimated * 130n) / 100n; // 30% buffer
    } catch (estError) {
      const err = estError as Error;
      throw new Error(
        `Gas estimation failed (contract would revert): ${err.message}`,
      );
    }

    // Execute the payment
    let tx: ethers.ContractTransactionResponse;
    try {
      tx = await this.forwarder.executePayment(
        from,
        to,
        amount,
        fee,
        deadline,
        signature,
        { gasLimit },
      );
    } catch (sendError) {
      throw sendError;
    }

    // Wait for confirmation
    let receipt: ethers.TransactionReceipt | null;
    try {
      receipt = await tx.wait();
    } catch (waitError) {
      throw waitError;
    }

    return {
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt?.blockNumber ?? null,
      gasUsed: receipt?.gasUsed?.toString() ?? "0",
    };
  }

  // 6. Validate a payment request before submission
  async validateRequest(request: PaymentRequest): Promise<void> {
    const { from, amount, fee, deadline } = request;

    // Check deadline against chain time (not local clock - avoids skew)
    const block = await this.provider.getBlock("latest");
    const chainTime = block?.timestamp ?? Math.floor(Date.now() / 1000);
    if (deadline <= chainTime) {
      throw new Error(
        `Payment request has expired (deadline: ${deadline}, chain: ${chainTime})`,
      );
    }

    // Get FXRP token from forwarder
    const fxrpAddress: string = await this.forwarder.fxrp();
    const fxrp = new Contract(
      fxrpAddress,
      erc20Abi as ethers.InterfaceAbi,
      this.provider,
    );
    const decimals = (await fxrp.decimals()) as number;

    // Check sender's FXRP balance
    const balance: bigint = await fxrp.balanceOf(from);
    const totalRequired = BigInt(amount) + BigInt(fee);
    if (balance < totalRequired) {
      throw new Error(
        `Insufficient FXRP balance. Required: ${ethers.formatUnits(totalRequired, decimals)}, Available: ${ethers.formatUnits(balance, decimals)}`,
      );
    }

    // Check allowance
    const allowance: bigint = await fxrp.allowance(
      from,
      this.config.forwarderAddress,
    );
    if (allowance < totalRequired) {
      throw new Error(
        `Insufficient FXRP allowance. Required: ${ethers.formatUnits(totalRequired, decimals)}, Approved: ${ethers.formatUnits(allowance, decimals)}`,
      );
    }

    // Check minimum fee
    const minFee: bigint = await this.forwarder.relayerFee();
    if (BigInt(fee) < minFee) {
      throw new Error(
        `Fee too low. Minimum: ${ethers.formatUnits(minFee, decimals)} FXRP`,
      );
    }
  }

  // 7. Get the current nonce for an address
  async getNonce(address: string): Promise<bigint> {
    return await this.forwarder.getNonce(address);
  }

  // 8. Get the minimum relayer fee
  async getRelayerFee(): Promise<bigint> {
    return await this.forwarder.relayerFee();
  }

  // 9. Get the FXRP token decimals
  async getTokenDecimals(): Promise<number> {
    const fxrpAddress: string = await this.forwarder.fxrp();
    const fxrp = new Contract(
      fxrpAddress,
      erc20Abi as ethers.InterfaceAbi,
      this.provider,
    );
    return (await fxrp.decimals()) as number;
  }

  // 10. Check relayer's FLR balance for gas
  async getRelayerBalance(): Promise<string> {
    const balance = await this.provider.getBalance(this.wallet.address);
    return ethers.formatEther(balance);
  }
}

// 11. Express server for receiving payment requests
async function startServer(
  relayer: GaslessRelayer,
  port: number = 3000,
): Promise<void> {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Get nonce for an address
  app.get(
    "/nonce/:addr",
    async (req: Request<{ addr: string }>, res: Response) => {
      try {
        const nonce = await relayer.getNonce(req.params.addr);
        res.json({ nonce: nonce.toString() });
      } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
      }
    },
  );

  // Get relayer fee
  app.get("/fee", async (_req: Request, res: Response) => {
    try {
      const [fee, decimals] = await Promise.all([
        relayer.getRelayerFee(),
        relayer.getTokenDecimals(),
      ]);
      res.json({
        fee: fee.toString(),
        feeFormatted: ethers.formatUnits(fee, decimals) + " FXRP",
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ error: err.message });
    }
  });

  // Execute payment
  app.post("/execute", async (req: Request, res: Response) => {
    try {
      const result = await relayer.executePayment(req.body);
      res.json(result);
    } catch (error) {
      const err = error as Error;
      console.error("Payment execution failed:", err.message);
      res.status(400).json({ error: err.message });
    }
  });

  app.listen(port, () => {
    console.log(`\nRelayer server running on http://localhost:${port}`);
    console.log(`\nEndpoints:`);
    console.log(`  GET  /nonce/:addr   - Get nonce for address`);
    console.log(`  GET  /fee           - Get relayer fee`);
    console.log(`  POST /execute       - Execute single payment`);
  });
}

// 12. Main entry point for the relayer server
async function main(): Promise<void> {
  const relayerPrivateKey = process.env.RELAYER_PRIVATE_KEY;
  const forwarderAddress = process.env.FORWARDER_ADDRESS;
  const rpcUrl = process.env.RPC_URL;
  const port = parseInt(process.env.PORT || "3000", 10);

  if (!relayerPrivateKey) {
    console.error("Error: RELAYER_PRIVATE_KEY environment variable required");
    process.exit(1);
  }

  if (!forwarderAddress) {
    console.error("Error: FORWARDER_ADDRESS environment variable required");
    process.exit(1);
  }

  const relayer = new GaslessRelayer({
    relayerPrivateKey,
    forwarderAddress,
    rpcUrl,
  });

  // Check relayer balance
  const balance = await relayer.getRelayerBalance();
  console.log(`Relayer FLR balance: ${balance} FLR`);

  if (parseFloat(balance) < 0.1) {
    console.warn(
      "Warning: Low relayer balance. Please fund the relayer wallet.",
    );
  }

  await startServer(relayer, port);
}

// 13. Run the server
main().catch(console.error);
