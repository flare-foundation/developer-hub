import { Client, Wallet } from "xrpl";
import type { Address } from "viem";
import { sendXrplPayment } from "./utils/xrpl";
import { account, publicClient, walletClient } from "./utils/client";
import { getPersonalAccountAddress } from "./utils/smart-accounts";
import {
  getContractAddressByName,
  getDirectMintingPaymentAddress,
  getMintingTagManagerAddress,
} from "./utils/flare-contract-registry";
import {
  computeDirectMintingPaymentAmountXrp,
  getFxrpBalance,
  waitForDirectMintingOutcome,
} from "./utils/fassets";
import { coston2 } from "@flarenetwork/flare-wagmi-periphery-package";

// 1. Reserve a new tag from MintingTagManager. The reservation fee is paid in
//    native currency (FLR/SGB). The contract returns the next available tag.
async function reserveTag(mintingTagManagerAddress: Address): Promise<bigint> {
  const reservationFee = await publicClient.readContract({
    address: mintingTagManagerAddress,
    abi: coston2.iMintingTagManagerAbi,
    functionName: "reservationFee",
  });
  console.log("Tag reservation fee (wei):", reservationFee, "\n");

  const { result, request } = await publicClient.simulateContract({
    account,
    address: mintingTagManagerAddress,
    abi: coston2.iMintingTagManagerAbi,
    functionName: "reserve",
    value: reservationFee,
  });

  const txHash = await walletClient.writeContract(request);
  await publicClient.waitForTransactionReceipt({ hash: txHash });

  const tag = result;
  console.log("Reserved tag:", tag, "\n");

  return tag;
}

// 2. Bind the reserved tag to the Flare recipient that should receive FXRP
//    when payments arrive at the Core Vault with this destination tag.
async function setMintingRecipient(
  mintingTagManagerAddress: Address,
  tag: bigint,
  recipient: Address,
): Promise<void> {
  const { request } = await publicClient.simulateContract({
    account,
    address: mintingTagManagerAddress,
    abi: coston2.iMintingTagManagerAbi,
    functionName: "setMintingRecipient",
    args: [tag, recipient],
  });

  const txHash = await walletClient.writeContract(request);
  await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log("Set minting recipient for tag", tag, "to", recipient, "\n");
}

// 3. Read the configured minting recipient for a tag.
async function getMintingRecipient(
  mintingTagManagerAddress: Address,
  tag: bigint,
): Promise<Address> {
  return publicClient.readContract({
    address: mintingTagManagerAddress,
    abi: coston2.iMintingTagManagerAbi,
    functionName: "mintingRecipient",
    args: [tag],
  });
}

// 4. Reuse MINTING_TAG from the .env if set, otherwise reserve a new tag and
//    bind it to the recipient. Tags are ERC-721 NFTs and can be reused.
async function getOrReserveTag(
  mintingTagManagerAddress: Address,
  recipient: Address,
): Promise<bigint> {
  if (process.env.MINTING_TAG) {
    const tag = BigInt(process.env.MINTING_TAG);
    console.log("Using existing minting tag from .env:", tag, "\n");
    return tag;
  }

  const tag = await reserveTag(mintingTagManagerAddress);
  await setMintingRecipient(mintingTagManagerAddress, tag, recipient);
  console.log(
    "Add MINTING_TAG=" + tag.toString() + " to your .env to reuse this tag.\n",
  );
  return tag;
}

async function main() {
  // 5. Net FXRP amount to mint in XRP. Minting + executor fees are added on top
  //    by computeDirectMintingPaymentAmountXrp to form the XRPL payment amount.
  const fxrpMintAmount = 10;

  // 6. Connect to the XRPL Testnet and load the sender wallet from XRPL_SEED.
  const xrplClient = new Client(process.env.XRPL_TESTNET_RPC_URL!);
  const xrplWallet = Wallet.fromSeed(process.env.XRPL_SEED!);

  // 7. Resolve the Flare smart-account recipient and the AssetManagerFXRP address.
  const [personalAccountAddress, assetManagerAddress] = await Promise.all([
    getPersonalAccountAddress(xrplWallet.address),
    getContractAddressByName("AssetManagerFXRP"),
  ]);
  console.log("Personal account address:", personalAccountAddress, "\n");

  // 8. Resolve the MintingTagManager contract address from the AssetManager.
  const mintingTagManagerAddress =
    await getMintingTagManagerAddress(assetManagerAddress);
  console.log("MintingTagManager address:", mintingTagManagerAddress, "\n");

  // 9. Reserve a new tag (or reuse one from MINTING_TAG) and confirm the recipient.
  const tag = await getOrReserveTag(
    mintingTagManagerAddress,
    personalAccountAddress,
  );
  const configuredRecipient = await getMintingRecipient(
    mintingTagManagerAddress,
    tag,
  );
  console.log("Minting recipient for tag:", configuredRecipient, "\n");

  // 10. Read the Core Vault XRPL payment address, the recipient's initial FXRP
  //     balance, and the gross XRP amount (net mint + minting fee + executor fee).
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

  // 11. Send the XRPL payment with the destination tag (no memo needed).
  const transaction = await sendXrplPayment({
    destination: coreVaultXrplAddress,
    amount: paymentAmountXrp,
    destinationTag: Number(tag),
    wallet: xrplWallet,
    client: xrplClient,
  });
  console.log(
    "Direct mint XRPL transaction hash:",
    transaction.result.hash,
    "\n",
  );

  // 12. Wait for direct minting to finish. Rate limits may emit DirectMintingDelayed
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

  // 13. Read the final FXRP balance and log the delta.
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
