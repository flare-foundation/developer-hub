import { Client, Wallet } from "xrpl";
import { account } from "../utils/client";
import { getPersonalAccountAddress } from "../utils/smart-accounts";
import { computeDirectMintingPaymentAmountXrp } from "../utils/fassets";
import {
  COLLATERAL_TOKEN_ADDRESS,
  LOAN_TOKEN_ADDRESS,
  MORPHO_MARKET_SHIM_ADDRESS,
  ensureShimSetup,
  fetchMarketDecimals,
  getAndLogState,
  marketId,
  mintMock,
} from "./utils";

// One-shot init for the Morpho cycle: fund the smart account with mock tokens,
// then approve and authorize the MorphoMarketShim. Safe to re-run — each step
// reads on-chain state and skips work already done.
async function main() {
  // 1. Choose how many whole token units to fund (scaled by decimals in step 6).
  //    100 collateral matches borrow.ts; 1000 loan token covers interest across cycles.
  const collateralFundingUnits = 100n;
  const loanFundingUnits = 1000n;

  // 2. Connect to XRPL testnet with the wallet that controls the personal account.
  const xrplClient = new Client(process.env.XRPL_TESTNET_RPC_URL!);
  const xrplWallet = Wallet.fromSeed(process.env.XRPL_SEED!);

  // 3. Resolve the personal account, memo-only XRP fee, and market decimals in parallel.
  const [personalAccount, memoOnlyAmountXrp, marketDecimals] = await Promise.all([
    getPersonalAccountAddress(xrplWallet.address),
    computeDirectMintingPaymentAmountXrp({ netMintAmountXrp: 0 }),
    fetchMarketDecimals(),
  ]);

  // 4. Log the addresses involved in this run.
  console.log("Personal account:", personalAccount, "\n");
  console.log("Operator EOA:    ", account.address, "\n");
  console.log("Morpho market id:", marketId, "\n");
  console.log("Shim address:    ", MORPHO_MARKET_SHIM_ADDRESS, "\n");

  // 5. Snapshot Morpho position and token balances before funding and setup.
  await getAndLogState("Before setup", personalAccount, marketDecimals);

  // 6. Fund the smart account with mock collateral and loan tokens (EOA-signed on Flare).
  await mintMock(
    COLLATERAL_TOKEN_ADDRESS,
    personalAccount,
    collateralFundingUnits * 10n ** BigInt(marketDecimals.collateralDecimals)
  );
  await mintMock(LOAN_TOKEN_ADDRESS, personalAccount, loanFundingUnits * 10n ** BigInt(marketDecimals.loanDecimals));
  console.log("Funded smart account with collateral and loan tokens.\n");

  // 7. Approve the shim for both tokens and authorize it on Morpho Blue (XRPL memos).
  await ensureShimSetup({ personalAccount, xrplClient, xrplWallet, amountXrp: memoOnlyAmountXrp });

  // 8. Snapshot state again to confirm balances and that setup memos succeeded.
  await getAndLogState("After setup", personalAccount, marketDecimals);
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
