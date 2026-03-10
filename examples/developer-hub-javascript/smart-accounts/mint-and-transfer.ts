import { Client, dropsToXrp, Wallet } from "xrpl";
import {
  FXRPCollateralReservationInstruction,
  FXRPTransferInstruction,
} from "@flarenetwork/smart-accounts-encoder";
import { sendXrplPayment } from "./utils/xrpl";
import { coston2 } from "@flarenetwork/flare-wagmi-periphery-package";
import { publicClient } from "./utils/client";
import type { Address, Log } from "viem";
import {
  getInstructionFee,
  getOperatorXrplAddresses,
  getPersonalAccountAddress,
  MASTER_ACCOUNT_CONTROLLER_ADDRESS,
} from "./utils/smart-accounts";
import type {
  CollateralReservedEventType,
  FxrpTransferredEventType,
} from "./utils/event-types";
import { getContractAddressByName } from "./utils/flare-contract-registry";
import { getFxrpBalance, getFxrpDecimals } from "./utils/fassets";

const recipientAddress = "0x1cdacde0c68e0a508ae85279375070a88554871b";

async function reserveCollateral({
  collateralReservationInstruction,
  personalAccountAddress,
  xrplClient,
  xrplWallet,
}: {
  collateralReservationInstruction: FXRPCollateralReservationInstruction;
  personalAccountAddress: string;
  xrplClient: Client;
  xrplWallet: Wallet;
}) {
  const operatorXrplAddress = (await getOperatorXrplAddresses())[0] as string;

  const encodedInstruction = collateralReservationInstruction.encode();
  const instructionFee = await getInstructionFee(encodedInstruction);
  console.log("Instruction fee:", instructionFee, "\n");

  const collateralReservationTransaction = await sendXrplPayment({
    destination: operatorXrplAddress,
    amount: instructionFee,
    memos: [{ Memo: { MemoData: encodedInstruction.slice(2) } }],
    wallet: xrplWallet,
    client: xrplClient,
  });
  console.log(
    "collateral reservation transaction hash:",
    collateralReservationTransaction.result.hash,
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

async function transfer({
  transferInstruction,
  personalAccountAddress,
  xrplClient,
  xrplWallet,
}: {
  transferInstruction: FXRPTransferInstruction;
  personalAccountAddress: string;
  xrplClient: Client;
  xrplWallet: Wallet;
}) {
  const operatorXrplAddress = (await getOperatorXrplAddresses())[0] as string;

  const encodedInstruction = transferInstruction.encode();
  const instructionFee = await getInstructionFee(encodedInstruction);
  console.log("Instruction fee:", instructionFee, "\n");

  const transferTransaction = await sendXrplPayment({
    destination: operatorXrplAddress,
    amount: instructionFee,
    memos: [{ Memo: { MemoData: encodedInstruction.slice(2) } }],
    wallet: xrplWallet,
    client: xrplClient,
  });
  console.log(
    "transfer transaction hash:",
    transferTransaction.result.hash,
    "\n",
  );

  let fXrpTransferredEvent: FxrpTransferredEventType | undefined;
  let fXrpTransferredEventFound = false;

  const unwatchFxrpTransferred = publicClient.watchContractEvent({
    address: MASTER_ACCOUNT_CONTROLLER_ADDRESS,
    abi: coston2.iMasterAccountControllerAbi,
    eventName: "FXrpTransferred",
    onLogs: (logs) => {
      for (const log of logs) {
        console.log(log);
        fXrpTransferredEvent = log as FxrpTransferredEventType;
        if (
          fXrpTransferredEvent.args.personalAccount.toLowerCase() !==
            personalAccountAddress.toLowerCase() ||
          fXrpTransferredEvent.args.to.toLowerCase() !==
            recipientAddress.toLowerCase()
        ) {
          continue;
        }
        fXrpTransferredEventFound = true;
        break;
      }
    },
  });

  console.log("Waiting for FXrpTransferred event...");
  while (!fXrpTransferredEventFound) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
  unwatchFxrpTransferred();

  return fXrpTransferredEvent;
}

async function logBalances(
  personalAccountAddress: Address,
  recipientAddress: Address,
) {
  const personalAccountFxrpBalance = await getFxrpBalance(
    personalAccountAddress,
  );
  console.log(
    "Personal account FXRP balance:",
    personalAccountFxrpBalance,
    "\n",
  );

  const recipientAddressFxrpBalance = await getFxrpBalance(recipientAddress);
  console.log(
    "Recipient address FXRP balance:",
    recipientAddressFxrpBalance,
    "\n",
  );
}

async function main() {
  const collateralReservationData = {
    walletId: 0,
    value: 1,
    agentVaultId: 1,
  };

  const xrplClient = new Client(process.env.XRPL_TESTNET_RPC_URL!);
  const xrplWallet = Wallet.fromSeed(process.env.XRPL_SEED!);

  const personalAccountAddress = await getPersonalAccountAddress(
    xrplWallet.address,
  );
  console.log("Personal account address:", personalAccountAddress, "\n");

  const collateralReservationInstruction =
    new FXRPCollateralReservationInstruction(collateralReservationData);
  console.log(
    "Encoded collateral reservation instruction:",
    collateralReservationInstruction.encode().slice(2),
    "\n",
  );

  const collateralReservationEvent = await reserveCollateral({
    collateralReservationInstruction,
    personalAccountAddress,
    xrplClient,
    xrplWallet,
  });
  console.log("CollateralReserved event:", collateralReservationEvent, "\n");

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

  const decimals = await getFxrpDecimals();
  console.log("Decimals:", decimals, "\n");

  const transferData = {
    walletId: 0,
    value: 10 * 10 ** decimals,
    recipientAddress: recipientAddress.slice(2),
  };
  const transferInstruction = new FXRPTransferInstruction(transferData);
  console.log(
    "Encoded transfer instruction:",
    transferInstruction.encode().slice(2),
    "\n",
  );

  await logBalances(personalAccountAddress, recipientAddress);

  await transfer({
    transferInstruction,
    personalAccountAddress,
    xrplClient,
    xrplWallet,
  });

  await logBalances(personalAccountAddress, recipientAddress);
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
