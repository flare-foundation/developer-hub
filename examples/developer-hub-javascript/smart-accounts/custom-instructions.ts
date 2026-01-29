import { encodeFunctionData, toHex } from "viem";
import { abi as checkpointAbi } from "./abis/Checkpoint";
import { abi as piggyBankAbi } from "./abis/PiggyBank";
import { abi as noticeBoardAbi } from "./abis/NoticeBoard";
import { abi as iInstructionsFacetAbi } from "./abis/IInstructionsFacet";
import {
  getInstructionFee,
  getOperatorXrplAddresses,
  getPersonalAccountAddress,
  MASTER_ACCOUNT_CONTROLLER_ADDRESS,
  registerCustomInstruction,
  type CustomInstruction,
} from "./utils/smart-accounts";
import { publicClient } from "./utils/client";
import { sendXrplPayment } from "./utils/xrpl";
import { Client, Wallet } from "xrpl";
import type { CustomInstructionExecutedEventType } from "./utils/event-types";

export function encodeCustomInstruction(
  instructionHash: `0x${string}`,
  walletId: number,
) {
  // NOTE:(Nik) We cut off the `0x` prefix and the first 2 bytes to get the length down to 30 bytes
  return ("0xff" +
    toHex(walletId, { size: 1 }).slice(2) +
    instructionHash.slice(6)) as `0x${string}`;
}

async function sendCustomInstruction({
  encodedInstruction,
  xrplClient,
  xrplWallet,
}: {
  encodedInstruction: `0x${string}`;
  xrplClient: Client;
  xrplWallet: Wallet;
}) {
  const operatorXrplAddress = (await getOperatorXrplAddresses())[0] as string;

  const instructionFee = await getInstructionFee(encodedInstruction);
  console.log("Instruction fee:", instructionFee, "\n");

  const customInstructionTransaction = await sendXrplPayment({
    destination: operatorXrplAddress,
    amount: instructionFee,
    memos: [{ Memo: { MemoData: encodedInstruction.slice(2) } }],
    wallet: xrplWallet,
    client: xrplClient,
  });

  return customInstructionTransaction;
}

async function waitForCustomInstructionExecutedEvent({
  encodedInstruction,
  personalAccountAddress,
}: {
  encodedInstruction: `0x${string}`;
  personalAccountAddress: string;
}) {
  let customInstructionExecutedEvent:
    | CustomInstructionExecutedEventType
    | undefined;
  let customInstructionExecutedEventFound = false;

  const unwatchCustomInstructionExecuted = publicClient.watchContractEvent({
    address: MASTER_ACCOUNT_CONTROLLER_ADDRESS,
    abi: iInstructionsFacetAbi,
    eventName: "CustomInstructionExecuted",
    onLogs: (logs) => {
      for (const log of logs) {
        customInstructionExecutedEvent =
          log as CustomInstructionExecutedEventType;
        if (
          customInstructionExecutedEvent.args.callHash.slice(6) !==
            encodedInstruction.slice(6) ||
          customInstructionExecutedEvent.args.personalAccount.toLowerCase() !==
            personalAccountAddress.toLowerCase()
        ) {
          continue;
        }
        customInstructionExecutedEventFound = true;
        break;
      }
    },
  });

  console.log("Waiting for CustomInstructionExecuted event...");
  while (!customInstructionExecutedEventFound) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
  unwatchCustomInstructionExecuted();

  return customInstructionExecutedEvent;
}

// NOTE:(Nik) For this example to work, you first need to faucet C2FLR to your personal account address.
async function main() {
  const walletId = 0;

  const checkpointAddress = "0xEE6D54382aA623f4D16e856193f5f8384E487002";
  const piggyBankAddress = "0x42Ccd4F0aB1C6Fa36BfA37C9e30c4DC4DD94dE42";
  const noticeBoardAddress = "0x59D57652BF4F6d97a6e555800b3920Bd775661Dc";

  const depositAmount = 1 * 10 ** 18;
  const pinNoticeAmount = 1 * 10 ** 18;
  const pinNoticeMessage = "Hello World!";

  const customInstructions = [
    {
      targetContract: checkpointAddress,
      value: BigInt(0),
      data: encodeFunctionData({
        abi: checkpointAbi,
        functionName: "passCheckpoint",
        args: [],
      }),
    },
    {
      targetContract: piggyBankAddress,
      value: BigInt(depositAmount),
      data: encodeFunctionData({
        abi: piggyBankAbi,
        functionName: "deposit",
        args: [],
      }),
    },
    {
      targetContract: noticeBoardAddress,
      value: BigInt(pinNoticeAmount),
      data: encodeFunctionData({
        abi: noticeBoardAbi,
        functionName: "pinNotice",
        args: [pinNoticeMessage],
      }),
    },
  ] as CustomInstruction[];
  console.log("Custom instructions:", customInstructions, "\n");

  const xrplClient = new Client(process.env.XRPL_TESTNET_RPC_URL!);
  const xrplWallet = Wallet.fromSeed(process.env.XRPL_SEED!);

  const personalAccountAddress = await getPersonalAccountAddress(
    xrplWallet.address,
  );
  console.log("Personal account address:", personalAccountAddress, "\n");

  const customInstructionHash =
    await registerCustomInstruction(customInstructions);
  const encodedInstruction = encodeCustomInstruction(
    customInstructionHash,
    walletId,
  );
  console.log("Encoded instructions:", encodedInstruction, "\n");

  const customInstructionTransaction = await sendCustomInstruction({
    encodedInstruction,
    xrplClient,
    xrplWallet,
  });
  console.log(
    "Custom instruction transaction hash:",
    customInstructionTransaction.result.hash,
    "\n",
  );

  const customInstructionExecutedEvent =
    await waitForCustomInstructionExecutedEvent({
      encodedInstruction,
      personalAccountAddress,
    });
  console.log(
    "CustomInstructionExecuted event:",
    customInstructionExecutedEvent,
    "\n",
  );
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
