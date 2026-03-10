import { Client, dropsToXrp, Wallet } from "xrpl";
import { UpshiftCollateralReservationAndDepositInstruction } from "@flarenetwork/smart-accounts-encoder";
import { sendXrplPayment } from "./utils/xrpl";
import { coston2 } from "@flarenetwork/flare-wagmi-periphery-package";
import { publicClient } from "./utils/client";
import type { Address, Log } from "viem";
import { erc4626Abi } from "viem";
import {
  getInstructionFee,
  getOperatorXrplAddresses,
  getPersonalAccountAddress,
  getVaults,
  MASTER_ACCOUNT_CONTROLLER_ADDRESS,
  type Vault,
} from "./utils/smart-accounts";
import type {
  CollateralReservedEventType,
  DepositedEventType,
} from "./utils/event-types";
import { getContractAddressByName } from "./utils/flare-contract-registry";
import { getFxrpBalance } from "./utils/fassets";

async function sendInstruction({
  collateralReservationInstruction: collateralReservationAndDepositInstruction,
  personalAccountAddress,
  xrplClient,
  xrplWallet,
}: {
  collateralReservationInstruction: UpshiftCollateralReservationAndDepositInstruction;
  personalAccountAddress: string;
  xrplClient: Client;
  xrplWallet: Wallet;
}) {
  const operatorXrplAddress = (await getOperatorXrplAddresses())[0] as string;

  const encodedInstruction =
    collateralReservationAndDepositInstruction.encode();
  const instructionFee = await getInstructionFee(encodedInstruction);
  console.log("Instruction fee:", instructionFee, "\n");

  const instructionTransaction = await sendXrplPayment({
    destination: operatorXrplAddress,
    amount: instructionFee,
    memos: [{ Memo: { MemoData: encodedInstruction.slice(2) } }],
    wallet: xrplWallet,
    client: xrplClient,
  });
  console.log(
    "collateral reservation transaction hash:",
    instructionTransaction.result.hash,
    "\n",
  );

  let collateralReservationEvent: CollateralReservedEventType | undefined;
  let collateralReservationEventFound = false;

  const assetManagerFXRPAddress =
    await getContractAddressByName("AssetManagerFXRP");

  const unwatchCollateralReserved = publicClient.watchContractEvent({
    address: assetManagerFXRPAddress,
    abi: coston2.iAssetManagerAbi,
    eventName: "CollateralReserved",
    onLogs: (logs) => {
      for (const log of logs) {
        collateralReservationEvent = log as CollateralReservedEventType;
        if (
          collateralReservationEvent.args.minter.toLowerCase() !==
          personalAccountAddress.toLowerCase()
        ) {
          continue;
        }
        collateralReservationEventFound = true;
        break;
      }
    },
  });

  console.log("Waiting for CollateralReserved event...");
  while (!collateralReservationEventFound) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
  unwatchCollateralReserved();

  return collateralReservationEvent;
}

async function sendMintPayment({
  collateralReservationEvent,
  xrplClient,
  xrplWallet,
}: {
  collateralReservationEvent: CollateralReservedEventType;
  xrplClient: Client;
  xrplWallet: Wallet;
}) {
  const valueUBA = collateralReservationEvent.args.valueUBA;
  const feeUBA = collateralReservationEvent.args.feeUBA;
  const paymentAddress = collateralReservationEvent.args.paymentAddress;
  const paymentReference = collateralReservationEvent.args.paymentReference;
  const collateralReservationId =
    collateralReservationEvent.args.collateralReservationId;

  console.log("valueUBA:", valueUBA, "\n");
  console.log("feeUBA:", feeUBA, "\n");
  console.log("paymentAddress:", paymentAddress, "\n");
  console.log("paymentReference:", paymentReference, "\n");
  console.log("collateralReservationId:", collateralReservationId, "\n");

  const mintTransaction = await sendXrplPayment({
    destination: paymentAddress,
    amount: dropsToXrp(valueUBA + feeUBA),
    memos: [{ Memo: { MemoData: paymentReference.slice(2) } }],
    wallet: xrplWallet,
    client: xrplClient,
  });
  console.log("mint transaction hash:", mintTransaction.result.hash, "\n");

  let mintingExecutedEvent: Log | undefined;
  let mintingExecutedEventFound = false;

  const assetManagerFXRPAddress =
    await getContractAddressByName("AssetManagerFXRP");

  console.log("Waiting for MintingExecuted event...");
  const unwatchMintingExecuted = publicClient.watchContractEvent({
    address: assetManagerFXRPAddress,
    abi: coston2.iAssetManagerAbi,
    eventName: "MintingExecuted",
    onLogs: (logs) => {
      for (const log of logs) {
        if (log.args.collateralReservationId !== collateralReservationId) {
          continue;
        }
        mintingExecutedEvent = log;
        mintingExecutedEventFound = true;
        return;
      }
    },
  });

  while (!mintingExecutedEventFound) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
  unwatchMintingExecuted();

  return mintingExecutedEvent;
}

async function watchForDepositEvent({
  personalAccountAddress,
  vaultId,
}: {
  personalAccountAddress: string;
  vaultId: number;
}) {
  const vaultAddress = (
    (await getVaults()).find((vault) => vault.id === BigInt(vaultId)) as Vault
  ).address;

  let depositedEvent: DepositedEventType | undefined;
  let depositedEventFound = false;

  const unwatchCollateralReserved = publicClient.watchContractEvent({
    address: MASTER_ACCOUNT_CONTROLLER_ADDRESS,
    abi: coston2.iMasterAccountControllerAbi,
    eventName: "Deposited",
    onLogs: (logs) => {
      for (const log of logs) {
        depositedEvent = log as DepositedEventType;
        if (
          depositedEvent.args.personalAccount.toLowerCase() !==
            personalAccountAddress.toLowerCase() ||
          depositedEvent.args.vault.toLowerCase() !== vaultAddress.toLowerCase()
        ) {
          continue;
        }
        depositedEventFound = true;
        break;
      }
    },
  });

  console.log("Waiting for Deposited event...");
  while (!depositedEventFound) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
  unwatchCollateralReserved();

  return depositedEvent;
}

async function getVaultBalance(vaultAddress: Address, accountAddress: Address) {
  const vaultBalance = await publicClient.readContract({
    address: vaultAddress,
    abi: erc4626Abi,
    functionName: "balanceOf",
    args: [accountAddress],
  });
  return vaultBalance;
}

async function logBalances(personalAccountAddress: Address) {
  const personalAccountFxrpBalance = await getFxrpBalance(
    personalAccountAddress,
  );
  console.log(
    "Personal account FXRP balance:",
    personalAccountFxrpBalance,
    "\n",
  );

  const vaults = await getVaults();
  for (const vault of vaults) {
    const vaultBalance = await getVaultBalance(
      vault.address,
      personalAccountAddress,
    );
    console.log(`Vault ${vault.id} balance:`, vaultBalance, "\n");
  }
}

async function main() {
  const collateralReservationAndDepositData = {
    walletId: 0,
    value: 1,
    agentVaultId: 1,
    vaultId: 2,
  };

  const xrplClient = new Client(process.env.XRPL_TESTNET_RPC_URL!);
  const xrplWallet = Wallet.fromSeed(process.env.XRPL_SEED!);

  const personalAccountAddress = await getPersonalAccountAddress(
    xrplWallet.address,
  );
  console.log("Personal account address:", personalAccountAddress, "\n");

  await logBalances(personalAccountAddress);

  const collateralReservationAndDepositInstruction =
    new UpshiftCollateralReservationAndDepositInstruction(
      collateralReservationAndDepositData,
    );

  console.log(
    "Encoded collateral reservation and deposit instruction:",
    collateralReservationAndDepositInstruction.encode().slice(2),
    "\n",
  );

  const collateralReservationEvent = await sendInstruction({
    collateralReservationInstruction:
      collateralReservationAndDepositInstruction,
    personalAccountAddress,
    xrplClient,
    xrplWallet,
  });

  if (
    typeof collateralReservationEvent === "undefined" ||
    !collateralReservationEvent
  ) {
    throw new Error("CollateralReserved event not found");
  }

  const mintingExecutedEvent = await sendMintPayment({
    collateralReservationEvent,
    xrplClient,
    xrplWallet,
  });
  console.log("MintingExecuted event:", mintingExecutedEvent, "\n");

  await watchForDepositEvent({
    personalAccountAddress: personalAccountAddress,
    vaultId: collateralReservationAndDepositData.vaultId,
  });

  await logBalances(personalAccountAddress);
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
