import { encodeFunctionData } from "viem";
import { Client, Wallet } from "xrpl";
import { abi as MorphoMarketShimAbi } from "../abis/MorphoMarketShim";
import { account } from "../utils/client";
import {
  getPersonalAccountAddress,
  sendMemoFieldInstruction,
} from "../utils/smart-accounts";
import { computeDirectMintingPaymentAmountXrp } from "../utils/fassets";
import {
  MORPHO_MARKET_SHIM_ADDRESS,
  fetchMarketDecimals,
  getAndLogState,
  marketId,
} from "./utils";

// NOTE:(Nik) Run after src/morpho/borrow.ts has opened a position. Assumes
// src/morpho/setup.ts has already funded the smart account and configured
// shim approvals + authorization on Morpho. Closes the smart account's
// Morpho position via the shim's `repayAndWithdrawCollateral` (share-
// denominated repay + withdraw, atomic) with the collateral routed back to
// the smart account. See borrow.ts for architecture overview.
async function main() {
  // 1. Connect to XRPL — wallet signs memos that drive the smart account; operations are not standalone Flare EOA transactions.
  const xrplClient = new Client(process.env.XRPL_TESTNET_RPC_URL!);
  const xrplWallet = Wallet.fromSeed(process.env.XRPL_SEED!);

  // 2. Resolve on-chain inputs in parallel — personal account, XRPL memo fee, Morpho token decimals for logging.
  const [personalAccount, memoOnlyAmountXrp, marketDecimals] =
    await Promise.all([
      getPersonalAccountAddress(xrplWallet.address),
      computeDirectMintingPaymentAmountXrp({ netMintAmountXrp: 0 }),
      fetchMarketDecimals(),
    ]);

  // 3. Log addresses for this run.
  console.log("Personal account:", personalAccount, "\n");
  console.log("Operator EOA:    ", account.address, "\n");
  console.log("Morpho market id:", marketId, "\n");
  console.log("Shim address:    ", MORPHO_MARKET_SHIM_ADDRESS, "\n");

  // 4. Snapshot before repay — exit early if there is no open position.
  const { borrowShares, collateral } = await getAndLogState(
    "Before repay",
    personalAccount,
    marketDecimals,
  );

  if (borrowShares === 0n && collateral === 0n) {
    console.log("Nothing to repay or withdraw. Exiting.");
    return;
  }

  console.log(
    "Repaying full position, borrowShares:",
    borrowShares.toString(),
    "\n",
  );
  // 5. Send repay-and-withdraw memo — shim repays full borrow shares, withdraws all collateral atomically (receiver = smart account).
  await sendMemoFieldInstruction({
    label: "repay-and-withdraw",
    calls: [
      {
        target: MORPHO_MARKET_SHIM_ADDRESS,
        value: 0n,
        data: encodeFunctionData({
          abi: MorphoMarketShimAbi,
          functionName: "repayAndWithdrawCollateral",
          args: [borrowShares, collateral, personalAccount],
        }),
      },
    ],
    amountXrp: memoOnlyAmountXrp,
    personalAccount,
    xrplClient,
    xrplWallet,
  });

  // 6. Snapshot after repay — expect borrow shares and position collateral near zero (loan-token balance reflects interest paid).
  await getAndLogState(
    "After repay + withdraw",
    personalAccount,
    marketDecimals,
  );
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
