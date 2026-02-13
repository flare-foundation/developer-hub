/**
 * FXRP Gasless Payment Relayer Service
 *
 * Copy this file to relayer/index.ts in your project.
 * Requires typechain-types (run "npx hardhat compile" after adding the contract).
 *
 * Environment: RELAYER_PRIVATE_KEY, FORWARDER_ADDRESS, RPC_URL (optional), PORT (optional).
 * Run: npx ts-node relayer/index.ts
 */

import { ethers, Contract, Wallet, JsonRpcProvider } from "ethers";
import { erc20Abi, recoverTypedDataAddress, type TypedDataDomain, type TypedData } from "viem";
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import type { GaslessPaymentForwarder } from "../typechain-types/contracts/GaslessPaymentForwarder";
import { GaslessPaymentForwarder__factory } from "../typechain-types/factories/contracts/GaslessPaymentForwarder__factory";

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

const NETWORKS: Record<string, { rpc: string; chainId: number }> = {
  flare: { rpc: "https://flare-api.flare.network/ext/C/rpc", chainId: 14 },
  coston2: { rpc: "https://coston2-api.flare.network/ext/C/rpc", chainId: 114 },
  songbird: { rpc: "https://songbird-api.flare.network/ext/C/rpc", chainId: 19 },
};

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

export class GaslessRelayer {
  private config: RelayerConfig;
  private provider: JsonRpcProvider;
  private wallet: Wallet;
  private forwarder: GaslessPaymentForwarder;

  constructor(config: RelayerConfig) {
    this.config = config;
    const rpcUrl = config.rpcUrl || NETWORKS.coston2.rpc;
    this.provider = new JsonRpcProvider(rpcUrl);
    this.wallet = new Wallet(config.relayerPrivateKey, this.provider);
    this.forwarder = GaslessPaymentForwarder__factory.connect(
      config.forwarderAddress,
      this.wallet
    );
  }

  async executePayment(request: PaymentRequest): Promise<ExecuteResult> {
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

    const chainId = (await this.provider.getNetwork()).chainId;
    const nonce = await this.forwarder.getNonce(from);
    const domain: TypedDataDomain = {
      ...EIP712_DOMAIN,
      chainId: Number(chainId),
      verifyingContract: ethers.getAddress(this.config.forwarderAddress) as `0x${string}`,
    };
    const message = { from, to, amount, fee, nonce, deadline };

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
        `Invalid signature format: ${e instanceof Error ? e.message : String(e)}`
      );
    }
    if (recoveredAddress.toLowerCase() !== from.toLowerCase()) {
      throw new Error(
        `Signature invalid: recovered ${recoveredAddress} but expected ${from}. Check chainId, forwarder address, and nonce.`
      );
    }

    await this.validateRequest({ from, to, amount: amount.toString(), fee: fee.toString(), deadline, signature });

    try {
      await this.forwarder.executePayment.staticCall(from, to, amount, fee, deadline, signature);
    } catch (simError) {
      const err = simError as Error & { reason?: string };
      throw new Error(`Contract simulation failed: ${err.reason || err.message}`);
    }

    const nonceNow = await this.forwarder.getNonce(from);
    if (nonceNow !== nonce) {
      throw new Error("Nonce changed. Create a new payment request.");
    }

    let gasLimit: bigint;
    try {
      const estimated = await this.forwarder.executePayment.estimateGas(
        from, to, amount, fee, deadline, signature
      );
      gasLimit = (estimated * 130n) / 100n;
    } catch (estError) {
      throw new Error(`Gas estimation failed: ${(estError as Error).message}`);
    }

    const tx = await this.forwarder.executePayment(
      from, to, amount, fee, deadline, signature,
      { gasLimit }
    );
    const receipt = await tx.wait();

    return {
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt?.blockNumber ?? null,
      gasUsed: receipt?.gasUsed?.toString() ?? "0",
    };
  }

  private async validateRequest(request: PaymentRequest): Promise<void> {
    const { from, amount, fee, deadline } = request;
    const block = await this.provider.getBlock("latest");
    const chainTime = block?.timestamp ?? Math.floor(Date.now() / 1000);
    if (deadline <= chainTime) {
      throw new Error("Payment request has expired");
    }
    const fxrpAddress: string = await this.forwarder.fxrp();
    const fxrp = new Contract(fxrpAddress, erc20Abi as ethers.InterfaceAbi, this.provider);
    const decimals = (await fxrp.decimals()) as number;
    const balance: bigint = await fxrp.balanceOf(from);
    const totalRequired = BigInt(amount) + BigInt(fee);
    if (balance < totalRequired) {
      throw new Error(
        `Insufficient FXRP balance. Required: ${ethers.formatUnits(totalRequired, decimals)}`
      );
    }
    const allowance: bigint = await fxrp.allowance(from, this.config.forwarderAddress);
    if (allowance < totalRequired) {
      throw new Error("Insufficient FXRP allowance. User must approve the forwarder.");
    }
    const minFee: bigint = await this.forwarder.relayerFee();
    if (BigInt(fee) < minFee) {
      throw new Error(`Fee too low. Minimum: ${ethers.formatUnits(minFee, decimals)} FXRP`);
    }
  }

  async getNonce(address: string): Promise<bigint> {
    return await this.forwarder.getNonce(address);
  }

  async getRelayerFee(): Promise<bigint> {
    return await this.forwarder.relayerFee();
  }

  async getTokenDecimals(): Promise<number> {
    const fxrpAddress: string = await this.forwarder.fxrp();
    const fxrp = new Contract(fxrpAddress, erc20Abi as ethers.InterfaceAbi, this.provider);
    return (await fxrp.decimals()) as number;
  }
}

async function main(): Promise<void> {
  const relayerPrivateKey = process.env.RELAYER_PRIVATE_KEY;
  const forwarderAddress = process.env.FORWARDER_ADDRESS;
  const rpcUrl = process.env.RPC_URL;
  const port = parseInt(process.env.PORT || "3000", 10);

  if (!relayerPrivateKey || !forwarderAddress) {
    console.error("RELAYER_PRIVATE_KEY and FORWARDER_ADDRESS are required");
    process.exit(1);
  }

  const relayer = new GaslessRelayer({ relayerPrivateKey, forwarderAddress, rpcUrl });
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/nonce/:addr", async (req: Request<{ addr: string }>, res: Response) => {
    try {
      const nonce = await relayer.getNonce(req.params.addr);
      res.json({ nonce: nonce.toString() });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

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
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/execute", async (req: Request, res: Response) => {
    try {
      const result = await relayer.executePayment(req.body);
      res.json(result);
    } catch (error) {
      console.error("Payment execution failed:", (error as Error).message);
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.listen(port, () => {
    console.log(`Relayer running on http://localhost:${port}`);
    console.log("  GET /nonce/:addr  GET /fee  POST /execute");
  });
}

main().catch(console.error);
