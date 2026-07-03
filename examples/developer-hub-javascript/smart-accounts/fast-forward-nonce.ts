/**
 * Fast-forward the personal account's memo-instruction nonce using opcode `0xE1`.
 *
 * `0xE1` advances `getNonce(personalAccount)` when it is stuck after a partial or
 * abandoned direct-mint flow — for example after `0xE0` skip-memo recovery, which
 * mints FXRP without running the original UserOp and leaves the nonce unchanged.
 *
 * Memo layout (42 bytes):
 *   [0xE1 | walletId(1B) | executorFeeUBA(8B) | newNonce(32B)]
 *
 * On-chain rules:
 *   - `newNonce` must be strictly greater than the current nonce.
 *   - The jump `newNonce - currentNonce` must not exceed `type(uint32).max`.
 *   - Emits `NonceIncreased(personalAccount, newNonce)` — no UserOp runs.
 *
 * Canonical flow:
 *   1. USER SIDE      — XRPL payment with 0xE1 memo (requires positive net mint).
 *   2. EXECUTOR SIDE  — finalize via `executeDirectMintingWithData(proof, "0x")`.
 *
 * When to use `0xE1` vs `0xE0`:
 *   - Stuck payment not yet minted (`isTransactionIdUsed == false`) → use
 *     `recover-direct-mint-transaction.ts` (`0xE0`) first, not this script.
 *   - After `0xE0` recovery, nonce still points at an abandoned UserOp → use `0xE1`
 *     to skip past it before sending a fresh `0xFE`/`0xFF` instruction.
 *   - Nonce already advanced by a successful `UserOperationExecuted` → just read
 *     `getNonce` and build the next UserOp; `0xE1` is not needed.
 *
 * Usage:
 *   # Full demo: create abandoned 0xFE payment → 0xE0 recover → 0xE1 fast-forward
 *   pnpm run script src/fast-forward-nonce.ts
 *
 *   # 0xE1 only (no demo setup; advances current nonce by 1)
 *   E1_ONLY=1 pnpm run script src/fast-forward-nonce.ts
 *
 *   # Resume with an existing stuck payment (runs 0xE0 then 0xE1)
 *   STUCK_XRPL_TX_HASH=<hash> STUCK_USER_OP_DATA=0x... pnpm run script src/fast-forward-nonce.ts
 *
 *   # Resume after the 0xE0 recovery payment was already sent
 *   STUCK_XRPL_TX_HASH=<hash> RECOVERY_XRPL_TX_HASH=<hash> pnpm run script src/fast-forward-nonce.ts
 *
 *   # Resume 0xE1 only (0xE0 already completed)
 *   FAST_FORWARD_XRPL_TX_HASH=<hash> TARGET_NEW_NONCE=<n> pnpm run script src/fast-forward-nonce.ts
 *
 * Required in .env: XRPL_SEED, XRPL_TESTNET_RPC_URL, PRIVATE_KEY (executor calls on Flare).
 */

import { encodeFunctionData, type Address } from "viem";
import { Client, Wallet } from "xrpl";
import { abi as checkpointAbi } from "./abis/Checkpoint";
import { computeDirectMintingPaymentAmountXrp } from "./utils/fassets";
import { getXrpBalance } from "./utils/xrpl";
import {
  assertValidNonceIncrease,
  diagnoseStuckDirectMint,
  executeDirectMintingWithData,
  findDirectMintingReceiptForTransactionId,
  findIgnoreMemoSet,
  findNonceIncreased,
  getNonce,
  getPersonalAccountAddress,
  isStuckTransactionIdUsed,
  logPersonalAccountFxrpCredit,
  normalizeXrplTransactionId,
  sendFastForwardNonceInstruction,
  sendHashInstruction,
  sendSkipMemoInstruction,
  type Call,
} from "./utils/smart-accounts";

// Net XRP for demo stuck payment only (ignored when STUCK_XRPL_TX_HASH is set).
const DEMO_STUCK_MINT_XRP = 10;
// Net XRP for the 0xE0 recovery payment.
const RECOVERY_NET_MINT_XRP = 1;
// Net XRP for the 0xE1 fast-forward payment.
const NET_MINT_XRP = 1;
const XRPL_SEED = process.env.XRPL_SEED!;

function parseTargetNewNonce(
  envValue: string | undefined,
  currentNonce: bigint,
): bigint {
  if (envValue?.trim()) {
    return BigInt(envValue.trim());
  }
  console.warn(
    "TARGET_NEW_NONCE not set — using current nonce + 1. " +
      "This costs a small XRP direct mint plus executor gas on Flare.\n",
  );
  return currentNonce + 1n;
}

async function runE0Recovery({
  stuckXrplTxHash,
  stuckUserOpData,
  personalAccount,
  xrplClient,
  xrplWallet,
  recoveryNetMintAmountXrp,
}: {
  stuckXrplTxHash: string;
  stuckUserOpData: `0x${string}` | undefined;
  personalAccount: Address;
  xrplClient: Client;
  xrplWallet: Wallet;
  recoveryNetMintAmountXrp: number;
}): Promise<void> {
  const diagnosis = await diagnoseStuckDirectMint({
    stuckXrplTxHash,
    personalAccount,
  });
  if (diagnosis.transactionIdUsed) {
    console.log(
      "Stuck transaction already minted on Flare — skipping 0xE0 (nonce may already be recoverable via 0xE1).\n",
    );
    return;
  }

  const recoveryPaymentAmountXrp = await computeDirectMintingPaymentAmountXrp({
    netMintAmountXrp: recoveryNetMintAmountXrp,
  });
  const xrpBalance = await getXrpBalance(xrplWallet.address, xrplClient);
  const existingRecoveryXrplTxHash = process.env.RECOVERY_XRPL_TX_HASH?.trim();
  if (!existingRecoveryXrplTxHash && xrpBalance < recoveryPaymentAmountXrp) {
    throw new Error(
      `Insufficient XRP for 0xE0 recovery payment on ${xrplWallet.address}: ` +
        `have ${xrpBalance} XRP, need ${recoveryPaymentAmountXrp} XRP`,
    );
  }

  console.log("=== RECOVERY: 0xE0 skip-memo flow ===\n");
  console.log(
    "0xE0 recovers FXRP from the stuck payment but does not run the UserOp — " +
      "the memo nonce stays at",
    diagnosis.nonce,
    "\n",
  );

  let skipMemo: { xrplTransactionHash: string; targetTxId: `0x${string}` };

  if (existingRecoveryXrplTxHash) {
    console.log(
      "Using existing recovery XRPL payment from RECOVERY_XRPL_TX_HASH:",
      existingRecoveryXrplTxHash,
      "\n",
    );
    skipMemo = {
      xrplTransactionHash: existingRecoveryXrplTxHash,
      targetTxId: normalizeXrplTransactionId(stuckXrplTxHash),
    };
  } else {
    skipMemo = await sendSkipMemoInstruction({
      label: "skip-memo",
      targetXrplTxHash: stuckXrplTxHash,
      personalAccount,
      xrplClient,
      xrplWallet,
      recoveryNetMintAmountXrp,
    });
  }

  const targetTxId = skipMemo.targetTxId;
  const recoveryPaymentTxId = normalizeXrplTransactionId(
    skipMemo.xrplTransactionHash,
  );
  const skipMemoExecutorLabel = "skip-memo-executor";
  let recoveryReceipt;

  if (await isStuckTransactionIdUsed(recoveryPaymentTxId)) {
    console.log(
      "Recovery XRPL payment already minted on Flare — loading existing receipt.\n",
    );
    recoveryReceipt = await findDirectMintingReceiptForTransactionId(
      recoveryPaymentTxId,
      {
        label: skipMemoExecutorLabel,
      },
    );
  } else {
    ({ receipt: recoveryReceipt } = await executeDirectMintingWithData({
      xrplTransactionHash: skipMemo.xrplTransactionHash,
      data: "0x",
      value: 0n,
      xrplClient,
      label: skipMemoExecutorLabel,
      reuseExistingMint: true,
    }));
  }

  const ignoreMemoSet = findIgnoreMemoSet(
    recoveryReceipt,
    personalAccount,
    targetTxId,
  );
  console.log("IgnoreMemoSet event:", ignoreMemoSet, "\n");

  logPersonalAccountFxrpCredit({
    label: skipMemoExecutorLabel,
    receipt: recoveryReceipt,
    personalAccount,
    xrplTransactionId: recoveryPaymentTxId,
  });

  const stillStuck = !(await isStuckTransactionIdUsed(diagnosis.targetTxId));
  if (!stillStuck) {
    console.log(
      "Stuck transaction was minted during recovery — loading existing receipt.\n",
    );
    const stuckReceipt = await findDirectMintingReceiptForTransactionId(
      diagnosis.targetTxId,
      {
        label: "stuck-retry",
      },
    );
    logPersonalAccountFxrpCredit({
      label: "stuck-retry",
      receipt: stuckReceipt,
      personalAccount,
      xrplTransactionId: diagnosis.targetTxId,
    });
  } else {
    const { receipt: stuckReceipt } = await executeDirectMintingWithData({
      xrplTransactionHash: stuckXrplTxHash,
      data: stuckUserOpData ?? "0x",
      value: 0n,
      xrplClient,
      label: "stuck-retry",
      reuseExistingMint: true,
    });

    logPersonalAccountFxrpCredit({
      label: "stuck-retry",
      receipt: stuckReceipt,
      personalAccount,
      xrplTransactionId: diagnosis.targetTxId,
    });
  }

  const nonceAfterE0 = await getNonce(personalAccount);
  console.log(
    "Memo nonce after 0xE0 recovery (unchanged — UserOp was skipped):",
    nonceAfterE0,
    "\n",
  );
}

async function runE1FastForward({
  targetNewNonce,
  personalAccount,
  xrplClient,
  xrplWallet,
  netMintAmountXrp,
}: {
  targetNewNonce: bigint;
  personalAccount: Address;
  xrplClient: Client;
  xrplWallet: Wallet;
  netMintAmountXrp: number;
}): Promise<void> {
  const currentNonce = await getNonce(personalAccount);
  console.log("Current memo nonce:", currentNonce, "\n");
  console.log("Target new nonce:", targetNewNonce, "\n");
  assertValidNonceIncrease(currentNonce, targetNewNonce);

  const paymentAmountXrp = await computeDirectMintingPaymentAmountXrp({
    netMintAmountXrp,
  });
  const xrpBalance = await getXrpBalance(xrplWallet.address, xrplClient);
  console.log("XRPL wallet XRP balance:", xrpBalance, "\n");

  const existingFastForwardXrplTxHash =
    process.env.FAST_FORWARD_XRPL_TX_HASH?.trim();
  if (!existingFastForwardXrplTxHash && xrpBalance < paymentAmountXrp) {
    throw new Error(
      `Insufficient XRP for 0xE1 payment on ${xrplWallet.address}: ` +
        `have ${xrpBalance} XRP, need ${paymentAmountXrp} XRP`,
    );
  }

  console.log("=== FAST-FORWARD NONCE: 0xE1 flow ===\n");

  let fastForward: { xrplTransactionHash: string; newNonce: bigint };

  if (existingFastForwardXrplTxHash) {
    console.log(
      "Using existing XRPL payment from FAST_FORWARD_XRPL_TX_HASH:",
      existingFastForwardXrplTxHash,
      "\n",
    );
    fastForward = {
      xrplTransactionHash: existingFastForwardXrplTxHash,
      newNonce: targetNewNonce,
    };
  } else {
    fastForward = await sendFastForwardNonceInstruction({
      label: "fast-forward-nonce",
      newNonce: targetNewNonce,
      personalAccount,
      xrplClient,
      xrplWallet,
      netMintAmountXrp,
    });
  }

  const fastForwardTxId = normalizeXrplTransactionId(
    fastForward.xrplTransactionHash,
  );
  const executorLabel = "fast-forward-executor";
  let receipt;

  if (await isStuckTransactionIdUsed(fastForwardTxId)) {
    console.log(
      "0xE1 XRPL payment already minted on Flare — loading existing receipt.\n",
    );
    receipt = await findDirectMintingReceiptForTransactionId(fastForwardTxId, {
      label: executorLabel,
    });
  } else {
    ({ receipt } = await executeDirectMintingWithData({
      xrplTransactionHash: fastForward.xrplTransactionHash,
      data: "0x",
      value: 0n,
      xrplClient,
      label: executorLabel,
      reuseExistingMint: true,
    }));
  }

  const nonceIncreased = findNonceIncreased(
    receipt,
    personalAccount,
    targetNewNonce,
  );
  console.log("NonceIncreased event:", nonceIncreased, "\n");

  const nonceAfter = await getNonce(personalAccount);
  console.log("Memo nonce after fast-forward:", nonceAfter, "\n");

  if (nonceAfter !== targetNewNonce) {
    throw new Error(
      `Expected nonce ${targetNewNonce} after 0xE1, but getNonce returned ${nonceAfter}`,
    );
  }

  console.log(
    "Nonce fast-forward complete. Build your next 0xFE or 0xFF UserOp with nonce:",
    nonceAfter,
    "\n",
  );
}

async function main({
  demoStuckMintAmountXrp,
  recoveryNetMintAmountXrp,
  netMintAmountXrp,
  xrplSeed,
}: {
  demoStuckMintAmountXrp: number;
  recoveryNetMintAmountXrp: number;
  netMintAmountXrp: number;
  xrplSeed: string;
}) {
  // --- Step 1: Setup XRPL client, wallet, and personal account ---------------
  const xrplClient = new Client(process.env.XRPL_TESTNET_RPC_URL!);
  const xrplWallet = Wallet.fromSeed(xrplSeed);

  const personalAccount = await getPersonalAccountAddress(xrplWallet.address);
  console.log("Personal account address:", personalAccount, "\n");

  const e1Only = process.env.E1_ONLY === "1";
  const fastForwardResume = process.env.FAST_FORWARD_XRPL_TX_HASH?.trim();

  // --- Step 2: 0xE1-only shortcut (E1_ONLY or FAST_FORWARD_XRPL_TX_HASH) ---
  if (fastForwardResume || e1Only) {
    const currentNonce = await getNonce(personalAccount);
    const targetNewNonce = parseTargetNewNonce(
      process.env.TARGET_NEW_NONCE,
      currentNonce,
    );
    await runE1FastForward({
      targetNewNonce,
      personalAccount,
      xrplClient,
      xrplWallet,
      netMintAmountXrp,
    });
    return;
  }

  // --- Step 3: Resolve stuck payment (demo or STUCK_XRPL_TX_HASH) ------------
  let stuckXrplTxHash = process.env.STUCK_XRPL_TX_HASH?.trim();
  let stuckUserOpData = process.env.STUCK_USER_OP_DATA?.trim() as
    | `0x${string}`
    | undefined;
  const nonceBeforeDemo = await getNonce(personalAccount);
  console.log("Memo nonce before demo:", nonceBeforeDemo, "\n");

  if (!stuckXrplTxHash) {
    console.log("=== DEMO: creating abandoned 0xFE payment ===\n");
    console.log(
      "Sending a 0xFE direct-mint payment with UserOp nonce",
      nonceBeforeDemo,
      "but deliberately not calling the executor — XRP sits at the Core Vault.\n",
    );

    const checkpointAddress = "0xEE6D54382aA623f4D16e856193f5f8384E487002";
    const customInstruction: Call[] = [
      {
        target: checkpointAddress,
        value: 0n,
        data: encodeFunctionData({
          abi: checkpointAbi,
          functionName: "passCheckpoint",
          args: [],
        }),
      },
    ];

    const stuckPaymentAmountXrp = await computeDirectMintingPaymentAmountXrp({
      netMintAmountXrp: demoStuckMintAmountXrp,
    });
    const recoveryPaymentAmountXrp = await computeDirectMintingPaymentAmountXrp(
      {
        netMintAmountXrp: recoveryNetMintAmountXrp,
      },
    );
    const e1PaymentAmountXrp = await computeDirectMintingPaymentAmountXrp({
      netMintAmountXrp,
    });
    const totalXrpNeeded =
      stuckPaymentAmountXrp + recoveryPaymentAmountXrp + e1PaymentAmountXrp;

    const xrpBalance = await getXrpBalance(xrplWallet.address, xrplClient);
    console.log("XRPL wallet XRP balance:", xrpBalance, "\n");
    if (xrpBalance < totalXrpNeeded) {
      throw new Error(
        `Insufficient XRP for full demo on ${xrplWallet.address}: ` +
          `have ${xrpBalance} XRP, need ${totalXrpNeeded} XRP ` +
          `(stuck ${stuckPaymentAmountXrp} + recovery ${recoveryPaymentAmountXrp} + 0xE1 ${e1PaymentAmountXrp})`,
      );
    }

    const userSide = await sendHashInstruction({
      label: "abandoned-demo",
      customInstruction,
      amountXrp: stuckPaymentAmountXrp,
      personalAccount,
      xrplClient,
      xrplWallet,
    });
    stuckXrplTxHash = userSide.xrplTransactionHash;
    stuckUserOpData = userSide.data;

    console.log(
      "Abandoned XRPL transaction hash (save for resume):",
      stuckXrplTxHash,
      "\n",
    );
    console.log("UserOp nonce embedded in that payment:", userSide.nonce, "\n");
    if (userSide.nonce !== nonceBeforeDemo) {
      throw new Error(
        `Demo UserOp nonce ${userSide.nonce} does not match pre-demo nonce ${nonceBeforeDemo}`,
      );
    }
  } else {
    console.log(
      "=== Using existing stuck payment from STUCK_XRPL_TX_HASH ===\n",
    );
    console.log("Stuck XRPL transaction hash:", stuckXrplTxHash, "\n");
    if (!stuckUserOpData) {
      console.warn(
        "STUCK_USER_OP_DATA not set — assuming 0xFF stuck flow. " +
          "For 0xFE stuck payments, set STUCK_USER_OP_DATA to the original PackedUserOperation bytes.\n",
      );
    }
  }

  // --- Step 4: 0xE0 skip-memo recovery ---------------------------------------
  await runE0Recovery({
    stuckXrplTxHash,
    stuckUserOpData,
    personalAccount,
    xrplClient,
    xrplWallet,
    recoveryNetMintAmountXrp,
  });

  // --- Step 5: Compute target nonce for fast-forward ---------------------------
  const nonceAfterE0 = await getNonce(personalAccount);
  const targetNewNonce = process.env.TARGET_NEW_NONCE?.trim()
    ? BigInt(process.env.TARGET_NEW_NONCE.trim())
    : nonceAfterE0 + 1n;

  console.log(
    "After 0xE0 the nonce is still",
    nonceAfterE0,
    "— the abandoned UserOp at nonce",
    nonceBeforeDemo,
    "was never executed.",
    "Fast-forwarding to",
    targetNewNonce,
    "with 0xE1.\n",
  );

  // --- Step 6: 0xE1 fast-forward nonce ---------------------------------------
  await runE1FastForward({
    targetNewNonce,
    personalAccount,
    xrplClient,
    xrplWallet,
    netMintAmountXrp,
  });
}

void main({
  demoStuckMintAmountXrp: DEMO_STUCK_MINT_XRP,
  recoveryNetMintAmountXrp: RECOVERY_NET_MINT_XRP,
  netMintAmountXrp: NET_MINT_XRP,
  xrplSeed: XRPL_SEED,
})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
