import { Client, Wallet } from "xrpl";
import type { Address } from "viem";
import { sendXrplPayment } from "./utils/xrpl";
import { getPersonalAccountAddress } from "./utils/smart-accounts";
import {
  getContractAddressByName,
  getDirectMintingPaymentAddress,
} from "./utils/flare-contract-registry";
import {
  computeDirectMintingPaymentAmountXrp,
  getFxrpBalance,
  waitForDirectMintingOutcome,
} from "./utils/fassets";

// 1. Direct minting prefix
const DIRECT_MINTING_PREFIX = "4642505266410018";

// 2. Build the 32-byte direct-minting PaymentReference memo:
//    [8-byte prefix][4-byte zero padding][20-byte recipient address]
function buildDirectMintingMemo(recipientAddress: Address): string {
  return (
    DIRECT_MINTING_PREFIX + "00000000" + recipientAddress.slice(2).toLowerCase()
  );
}

// 3. Send the XRPL payment to the Core Vault with the direct-minting memo
async function sendDirectMintPayment({
  coreVaultXrplAddress,
  recipientAddress,
  amountXrp,
  xrplClient,
  xrplWallet,
}: {
  coreVaultXrplAddress: string;
  recipientAddress: Address;
  amountXrp: number;
  xrplClient: Client;
  xrplWallet: Wallet;
}) {
  const memoData = buildDirectMintingMemo(recipientAddress);
  console.log("Direct minting memo (32 bytes):", memoData, "\n");

  const transaction = await sendXrplPayment({
    destination: coreVaultXrplAddress,
    amount: amountXrp,
    memos: [{ Memo: { MemoData: memoData } }],
    wallet: xrplWallet,
    client: xrplClient,
  });
  console.log(
    "Direct mint XRPL transaction hash:",
    transaction.result.hash,
    "\n",
  );

  return transaction;
}

async function main() {
  // 4. Net FXRP amount to mint in XRP. Minting + executor fees are added on top
  //    by computeDirectMintingPaymentAmountXrp to form the XRPL payment amount.
  const fxrpMintAmount = 10;

  // 5. Connect to the XRPL Testnet and load the sender wallet from XRPL_SEED.
  const xrplClient = new Client(process.env.XRPL_TESTNET_RPC_URL!);
  const xrplWallet = Wallet.fromSeed(process.env.XRPL_SEED!);

  // 6. Resolve the Flare smart-account recipient and the AssetManagerFXRP address.
  const [personalAccountAddress, assetManagerAddress] = await Promise.all([
    getPersonalAccountAddress(xrplWallet.address),
    getContractAddressByName("AssetManagerFXRP"),
  ]);
  console.log("Personal account address:", personalAccountAddress, "\n");

  // 7. Read the Core Vault XRPL payment address, the recipient's initial FXRP
  //    balance, and the gross XRP amount (net mint + minting fee + executor fee).
  const [coreVaultXrplAddress, initialBalance, paymentAmountXrp] =
    await Promise.all([
      getDirectMintingPaymentAddress(assetManagerAddress),
      getFxrpBalance(personalAccountAddress),
      computeDirectMintingPaymentAmountXrp({
        netMintAmountXrp: fxrpMintAmount,
      }),
    ]);
  console.log("Core Vault XRPL address:", coreVaultXrplAddress, "\n");
  console.log("AssetManagerFXRP address:", assetManagerAddress, "\n");
  console.log("Initial FXRP balance:", initialBalance, "\n");
  console.log("Payment amount (XRP, net mint + fees):", paymentAmountXrp, "\n");

  // 8. Send the XRPL payment that triggers direct minting on Flare.
  await sendDirectMintPayment({
    coreVaultXrplAddress,
    recipientAddress: personalAccountAddress,
    amountXrp: paymentAmountXrp,
    xrplClient,
    xrplWallet,
  });

  // 9. Wait for direct minting to finish. Rate limits may emit DirectMintingDelayed
  //    first; waitForDirectMintingOutcome logs executionAllowedAt and keeps polling
  //    until DirectMintingExecuted.
  const mintEvent = await waitForDirectMintingOutcome({
    assetManagerAddress,
    targetAddress: personalAccountAddress,
  });

  console.log("DirectMintingExecuted event:", mintEvent, "\n");
  console.log("Minted amount (UBA):", mintEvent.args.mintedAmountUBA, "\n");
  console.log("Minting fee (UBA):", mintEvent.args.mintingFeeUBA, "\n");
  console.log("Executor fee (UBA):", mintEvent.args.executorFeeUBA, "\n");

  // 10. Read the final FXRP balance and log the delta.
  const finalBalance = await getFxrpBalance(personalAccountAddress);
  console.log("Final FXRP balance:", finalBalance, "\n");
  console.log("FXRP minted:", finalBalance - initialBalance, "\n");
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
