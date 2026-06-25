import { encodeFunctionData, formatUnits } from "viem";
import { Client, Wallet } from "xrpl";
import { abi as MorphoMarketShimAbi } from "../abis/MorphoMarketShim";
import { account, publicClient } from "../utils/client";
import {
  getPersonalAccountAddress,
  sendMemoFieldInstruction,
} from "../utils/smart-accounts";
import { computeDirectMintingPaymentAmountXrp } from "../utils/fassets";
import {
  LLTV,
  MORPHO_MARKET_SHIM_ADDRESS,
  ORACLE_ABI,
  ORACLE_ADDRESS,
  WAD,
  fetchMarketDecimals,
  getAndLogState,
  marketId,
} from "./utils";

// NOTE:(Nik) Run src/morpho/setup.ts once before this script — it funds the
// smart account with mock collateral and loan tokens, approves the shim for
// both, and authorizes the shim on Morpho. Without setup, this script's op
// memo will revert.
//
// Architecture: the smart account is the actor end-to-end. A MorphoMarketShim
// pins the 5-field MarketParams in immutable state, so each shim call fits
// inside an XRPL memo (~842 bytes vs the 1024-byte cap). The shim's
// `supplyAndBorrow` bundles both Morpho ops on-chain so a full open step is
// a single memo — two separate Morpho ops in one memo would exceed the cap.
// Borrowed loan tokens go to the smart account itself (receiver=personalAccount),
// keeping the position fully self-contained.
//
// Run src/morpho/repay.ts afterwards to close the position.
async function main() {
  // 1. Connect to XRPL testnet with the wallet that controls the personal account.
  const xrplClient = new Client(process.env.XRPL_TESTNET_RPC_URL!);
  const xrplWallet = Wallet.fromSeed(process.env.XRPL_SEED!);

  // 2. Resolve the personal account, memo-only XRP fee, market decimals, and oracle price in parallel.
  const [personalAccount, memoOnlyAmountXrp, marketDecimals, oraclePrice] =
    await Promise.all([
      getPersonalAccountAddress(xrplWallet.address),
      computeDirectMintingPaymentAmountXrp({ netMintAmountXrp: 0 }),
      fetchMarketDecimals(),
      publicClient.readContract({
        address: ORACLE_ADDRESS,
        abi: ORACLE_ABI,
        functionName: "price",
      }),
    ]);
  const { loanDecimals, collateralDecimals, oraclePriceScale } = marketDecimals;

  // 3. Fix collateral supply at 100 whole units (scaled by token decimals).
  const collateralAssets = 100n * 10n ** BigInt(collateralDecimals);

  // 4. Log the addresses involved in this run.
  console.log("Personal account:", personalAccount, "\n");
  console.log("Operator EOA:    ", account.address, "\n");
  console.log("Morpho market id:", marketId, "\n");
  console.log("Shim address:    ", MORPHO_MARKET_SHIM_ADDRESS, "\n");

  // 5. Snapshot Morpho position and token balances before opening the position.
  await getAndLogState("Before borrow", personalAccount, marketDecimals);

  // 6. Compute max borrow off-chain via Morpho Blue's health formula, then borrow 99% for a safety margin.
  const maxBorrowAssets =
    (collateralAssets * oraclePrice * LLTV) / (oraclePriceScale * WAD);
  const borrowAssets = (maxBorrowAssets * 99n) / 100n;
  console.log("Oracle price:", oraclePrice.toString());
  console.log(
    "Max borrowable:",
    formatUnits(maxBorrowAssets, loanDecimals),
    "→ borrowing:",
    formatUnits(borrowAssets, loanDecimals),
    "\n",
  );

  // 7. Supply collateral and borrow loan tokens in one XRPL memo via the shim.
  await sendMemoFieldInstruction({
    label: "supply-and-borrow",
    calls: [
      {
        target: MORPHO_MARKET_SHIM_ADDRESS,
        value: 0n,
        data: encodeFunctionData({
          abi: MorphoMarketShimAbi,
          functionName: "supplyAndBorrow",
          args: [collateralAssets, borrowAssets, personalAccount],
        }),
      },
    ],
    amountXrp: memoOnlyAmountXrp,
    personalAccount,
    xrplClient,
    xrplWallet,
  });

  // 8. Snapshot state again to confirm the position opened and loan tokens arrived.
  await getAndLogState("After borrow", personalAccount, marketDecimals);
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
