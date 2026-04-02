import { encodeFunctionData } from "viem";
import { abi as checkpointAbi } from "./abis/Checkpoint";
import { abi as piggyBankAbi } from "./abis/PiggyBank";
import { abi as noticeBoardAbi } from "./abis/NoticeBoard";
import {
  encodeCustomInstruction,
  getPersonalAccountAddress,
  registerCustomInstruction,
  sendCustomInstruction,
  waitForCustomInstructionExecutedEvent,
  type CustomInstruction,
} from "./utils/smart-accounts";
import { Client, Wallet } from "xrpl";

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

  const customInstructionCallHash =
    await registerCustomInstruction(customInstructions);
  console.log("Custom instruction call hash:", customInstructionCallHash, "\n");
  const encodedInstruction = await encodeCustomInstruction(
    customInstructions,
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
