/**
 * x402 Payment Demo Server
 *
 * Run: npx ts-node scripts/x402/server.ts
 *
 * This implements the x402 HTTP payment protocol with EIP-3009 support.
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";
import rateLimit from "express-rate-limit";

const app = express();
app.use(cors());

const rootRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(express.json());

// Configuration
const PORT = process.env.X402_PORT || 3402;
const COSTON2_RPC =
  process.env.COSTON2_RPC_URL || "https://coston2-api.flare.network/ext/C/rpc";
const TOKEN_ADDRESS = process.env.X402_TOKEN_ADDRESS || "";
const FACILITATOR_ADDRESS = process.env.X402_FACILITATOR_ADDRESS || "";
const PAYEE_ADDRESS = process.env.X402_PAYEE_ADDRESS || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// ABIs (minimal)
const FACILITATOR_ABI = [
  "function verifyPayment((address from, address to, address token, uint256 value, uint256 validAfter, uint256 validBefore, bytes32 nonce, uint8 v, bytes32 r, bytes32 s)) view returns (bytes32 paymentId, bool valid)",
  "function settlePayment((address from, address to, address token, uint256 value, uint256 validAfter, uint256 validBefore, bytes32 nonce, uint8 v, bytes32 r, bytes32 s)) returns (bytes32)",
];

// Provider setup
const provider = new ethers.JsonRpcProvider(COSTON2_RPC);

// x402 Payment requirement structure
interface PaymentRequirement {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  resource: string;
  description: string;
  mimeType: string;
  payTo: string;
  maxTimeoutSeconds: number;
  asset: string;
  extra: {
    tokenAddress: string;
    facilitatorAddress: string;
    chainId: number;
  };
}

// x402 Payment payload from client
interface PaymentPayload {
  from: string;
  to: string;
  token: string;
  value: string;
  validAfter: string;
  validBefore: string;
  nonce: string;
  v: number;
  r: string;
  s: string;
}

// Resources that require payment
const PAID_RESOURCES: Record<string, { price: bigint; content: () => object }> =
  {
    "/api/premium-data": {
      price: BigInt(100000), // 0.1 USDT0 (6 decimals)
      content: () => ({
        message: "Premium data accessed successfully!",
        data: {
          flarePrice: 0.0234,
          timestamp: Date.now(),
          secret: "This is premium content only available after payment",
        },
      }),
    },
    "/api/report": {
      price: BigInt(500000), // 0.5 USDT0
      content: () => ({
        message: "Detailed report generated",
        report: {
          title: "Market Analysis Report",
          sections: ["Overview", "Technical Analysis", "Predictions"],
          generatedAt: new Date().toISOString(),
        },
      }),
    },
  };

// Middleware to check x402 payment
async function x402Middleware(req: Request, res: Response, next: NextFunction) {
  const resource = req.path;
  const paidResource = PAID_RESOURCES[resource];

  if (!paidResource) {
    return next();
  }

  // Check for PAYMENT header
  const paymentHeader = req.headers["x-payment"] as string;

  if (!paymentHeader) {
    // Return 402 Payment Required
    const paymentRequirement: PaymentRequirement = {
      scheme: "exact",
      network: "flare-coston2",
      maxAmountRequired: paidResource.price.toString(),
      resource: resource,
      description: `Payment required to access ${resource}`,
      mimeType: "application/json",
      payTo: PAYEE_ADDRESS,
      maxTimeoutSeconds: 300,
      asset: "USDT0",
      extra: {
        tokenAddress: TOKEN_ADDRESS,
        facilitatorAddress: FACILITATOR_ADDRESS,
        chainId: 114,
      },
    };

    res.status(402).json({
      error: "Payment Required",
      x402Version: "1",
      accepts: [paymentRequirement],
    });
    return;
  }

  // Parse and verify payment
  try {
    const paymentPayload: PaymentPayload = JSON.parse(
      Buffer.from(paymentHeader, "base64").toString("utf-8"),
    );

    // Verify payment amount
    if (BigInt(paymentPayload.value) < paidResource.price) {
      res.status(402).json({
        error: "Insufficient payment",
        required: paidResource.price.toString(),
        received: paymentPayload.value,
      });
      return;
    }

    // Verify with facilitator contract
    const facilitator = new ethers.Contract(
      FACILITATOR_ADDRESS,
      FACILITATOR_ABI,
      provider,
    );

    const [paymentId, isValid] = await facilitator.verifyPayment({
      from: paymentPayload.from,
      to: paymentPayload.to,
      token: paymentPayload.token,
      value: paymentPayload.value,
      validAfter: paymentPayload.validAfter,
      validBefore: paymentPayload.validBefore,
      nonce: paymentPayload.nonce,
      v: paymentPayload.v,
      r: paymentPayload.r,
      s: paymentPayload.s,
    });

    if (!isValid) {
      res.status(402).json({
        error: "Invalid payment authorization",
        paymentId: paymentId,
      });
      return;
    }

    // Settle the payment
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const facilitatorWithSigner = new ethers.Contract(
      FACILITATOR_ADDRESS,
      FACILITATOR_ABI,
      wallet,
    );

    const settlePayment = facilitatorWithSigner.getFunction("settlePayment");
    const tx = await settlePayment({
      from: paymentPayload.from,
      to: paymentPayload.to,
      token: paymentPayload.token,
      value: paymentPayload.value,
      validAfter: paymentPayload.validAfter,
      validBefore: paymentPayload.validBefore,
      nonce: paymentPayload.nonce,
      v: paymentPayload.v,
      r: paymentPayload.r,
      s: paymentPayload.s,
    });

    const receipt = await tx.wait();

    // Add payment response header
    res.setHeader(
      "X-Payment-Response",
      Buffer.from(
        JSON.stringify({
          paymentId: paymentId,
          transactionHash: receipt.hash,
          settled: true,
        }),
      ).toString("base64"),
    );

    // Store payment info for the request
    (req as unknown as { paymentInfo: object }).paymentInfo = {
      paymentId,
      transactionHash: receipt.hash,
      amount: paymentPayload.value,
    };

    next();
  } catch (error: unknown) {
    console.error("Payment verification error:", error);
    res.status(402).json({
      error: "Payment verification failed",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

// Apply rate limiting and x402 middleware to all routes
app.use(rootRateLimiter, (req, res, next) => {
  void x402Middleware(req, res, next);
});

// Public endpoint (no payment required)
app.get("/api/public", (req: Request, res: Response) => {
  res.json({
    message: "This is free public data",
    timestamp: Date.now(),
  });
});

// Protected endpoints (payment required)
app.get("/api/premium-data", (req: Request, res: Response) => {
  const content = PAID_RESOURCES["/api/premium-data"].content();
  (content as unknown as { paymentInfo: object }).paymentInfo = (
    req as unknown as { paymentInfo: object }
  ).paymentInfo;
  res.json(content);
});

app.get("/api/report", (req: Request, res: Response) => {
  const content = PAID_RESOURCES["/api/report"].content();
  (content as unknown as { paymentInfo: object }).paymentInfo = (
    req as unknown as { paymentInfo: object }
  ).paymentInfo;
  res.json(content);
});

// Get payment requirements without triggering 402
app.get("/api/payment-info/:resource", (req: Request, res: Response) => {
  const resource = "/api/" + req.params.resource;
  const paidResource = PAID_RESOURCES[resource];

  if (!paidResource) {
    res.status(404).json({ error: "Resource not found" });
    return;
  }

  res.json({
    resource,
    price: paidResource.price.toString(),
    priceFormatted: `${Number(paidResource.price) / 1e6} USDT0`,
    tokenAddress: TOKEN_ADDRESS,
    facilitatorAddress: FACILITATOR_ADDRESS,
    payeeAddress: PAYEE_ADDRESS,
    chainId: 114,
  });
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    config: {
      token: TOKEN_ADDRESS,
      facilitator: FACILITATOR_ADDRESS,
      payee: PAYEE_ADDRESS,
    },
  });
});

// Serve frontend - inject config into HTML
app.get("/", rootRateLimiter, (req: Request, res: Response) => {
  const frontendPath = path.join(__dirname, "frontend.html");
  let html = fs.readFileSync(frontendPath, "utf-8");

  // Inject token address into the HTML
  html = html.replace(
    'placeholder="MockUSDT0 address"',
    `placeholder="MockUSDT0 address" value="${TOKEN_ADDRESS}"`,
  );

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

// Start server
function startServer() {
  if (!TOKEN_ADDRESS || !FACILITATOR_ADDRESS || !PAYEE_ADDRESS) {
    console.error("❌ Missing required environment variables:");
    console.error(
      "   X402_TOKEN_ADDRESS, X402_FACILITATOR_ADDRESS, X402_PAYEE_ADDRESS",
    );
    console.error(
      "\nRun deployment first: yarn hardhat run scripts/x402/deploy.ts --network coston2",
    );
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log("═".repeat(60));
    console.log("x402 Demo Server");
    console.log("═".repeat(60));
    console.log(`Frontend:    http://localhost:${PORT}/`);
    console.log(`Token:       ${TOKEN_ADDRESS}`);
    console.log(`Facilitator: ${FACILITATOR_ADDRESS}`);
    console.log(`Payee:       ${PAYEE_ADDRESS}`);
    console.log("─".repeat(60));
    console.log("Endpoints:");
    console.log("  GET /                   - Frontend UI");
    console.log("  GET /api/public         - Free");
    console.log("  GET /api/premium-data   - 0.1 USDT0");
    console.log("  GET /api/report         - 0.5 USDT0");
    console.log("  GET /health             - Health check");
    console.log("═".repeat(60));
  });
}

startServer();
