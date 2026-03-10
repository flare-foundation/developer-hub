import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client, Wallet } from "xrpl";
import { type MPTokenMetadata, MPTokenIssuanceCreateFlags, encodeMPTokenMetadata } from "xrpl";
import { sendMptToAccount } from "./utils";

/**
 * Writes the MPT issuance ID to src/flare-lending/config.ts as export const MPT_ISSUANCE_ID.
 */
function storeMptIssuanceIdToConfig(mptIssuanceId: string): void {
  const dir = join(fileURLToPath(import.meta.url), "..");
  const configPath = join(dir, "config.ts");
  const content = `/** Set by issue-mint-mpt script when an MPT is issued. */\nexport const MPT_ISSUANCE_ID = "${mptIssuanceId}";\n`;
  writeFileSync(configPath, content);
}

/**
 * Issues a Multi-Purpose Token (MPT) on the XRPL testnet.
 * Requires the MPTokensV1 amendment (available on devnet; testnet may vary).
 *
 * @see https://xrpl.org/docs/references/protocol/transactions/types/mptokenissuancecreate
 * @see https://xrpl.org/docs/tutorials/how-tos/use-tokens/issue-a-multi-purpose-token
 */
async function issueMptOnXrpl(
  xrplRpcUrl: string,
  issuerXrplSeed: string,
  mptMetadata: MPTokenMetadata
): Promise<string> {
  const xrplClient = new Client(xrplRpcUrl);
  const issuerXrplWallet = Wallet.fromSeed(issuerXrplSeed);

  await xrplClient.connect();

  try {
    const mptMetadataHex = encodeMPTokenMetadata(mptMetadata);

    const mptIssuanceCreate = {
      TransactionType: "MPTokenIssuanceCreate" as const,
      Account: issuerXrplWallet.address,
      AssetScale: 6,
      MaximumAmount: "1000000000000",
      TransferFee: 0,
      Flags: MPTokenIssuanceCreateFlags.tfMPTCanTransfer | MPTokenIssuanceCreateFlags.tfMPTCanTrade,
      MPTokenMetadata: mptMetadataHex,
    };

    const preparedTransaction = await xrplClient.autofill(mptIssuanceCreate);
    const signedTransaction = issuerXrplWallet.sign(preparedTransaction);
    const result = await xrplClient.submitAndWait(signedTransaction.tx_blob);

    const meta = result.result.meta as { TransactionResult?: string; mpt_issuance_id?: string } | string;
    if (typeof meta === "string") {
      throw new Error(`Transaction failed: ${meta}`);
    }

    const resultCode = meta.TransactionResult;
    if (resultCode !== "tesSUCCESS") {
      console.error("Transaction failed with result:", resultCode);
      process.exit(1);
    }

    const issuanceId = meta.mpt_issuance_id ?? "";
    console.log("MPT issued successfully.");
    console.log("Issuer:", issuerXrplWallet.address);
    console.log("MPT Issuance ID:", issuanceId);
    console.log("Transaction hash:", result.result.hash, "\n");
    return issuanceId;
  } finally {
    await xrplClient.disconnect();
  }
}

async function main() {
  const xrplRpcUrl = process.env.XRPL_TESTNET_RPC_URL;
  const issuerXrplSeed = process.env.MPT_ISSUER_SEED;
  const vaultSeed = process.env.VAULT_SEED;

  if (!xrplRpcUrl || !issuerXrplSeed || !vaultSeed) {
    throw new Error("Missing XRPL_TESTNET_RPC_URL, MPT_ISSUER_SEED, or VAULT_SEED in .env");
  }

  const mptMetadata = {
    ticker: "DEMO",
    name: "Demo MPT",
    desc: "Example multi-purpose token issued from flare-smart-accounts-viem",
    icon: "https://example.org/icon.png",
    asset_class: "defi",
    issuer_name: "Flare Lending Demo",
  };

  const mptIssuanceId = await issueMptOnXrpl(xrplRpcUrl, issuerXrplSeed, mptMetadata);
  storeMptIssuanceIdToConfig(mptIssuanceId);

  await sendMptToAccount(xrplRpcUrl, issuerXrplSeed, vaultSeed, mptIssuanceId, "10000000000");
}

void main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
