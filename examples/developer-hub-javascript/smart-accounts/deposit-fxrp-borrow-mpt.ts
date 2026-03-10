import { encodeFunctionData } from "viem";
import { Client, Wallet } from "xrpl";
import { MPT_ISSUANCE_ID } from "./config";
import { abi as BridgeAbi } from "../abis/DummyBridge";
import { abi as LendingAbi } from "../abis/DummyLending";
import { abi as ERC20Abi } from "../abis/ERC20";
import {
  encodeCustomInstruction,
  getPersonalAccountAddress,
  registerCustomInstruction,
  sendCustomInstruction,
  waitForCustomInstructionExecutedEvent,
  type CustomInstruction,
} from "../utils/smart-accounts";
import {
  findLatestInitiateBridgeEventInLast30Blocks,
  transferEventAmountMptToXrplAddress,
} from "./utils";

// NOTE:(Nik) For this example to work, you first need to faucet C2FLR to your personal account address.
async function main() {
  const xrplClient = new Client(process.env.XRPL_TESTNET_RPC_URL!);
  const xrplWallet = Wallet.fromSeed(process.env.XRPL_SEED!);
  const vaultWallet = Wallet.fromSeed(process.env.VAULT_SEED!);

  const walletId = 0;

  const loanContractAddress = "0xa5B3E70376B6CdbBfD33bd2af656f3Fada8f017f";
  const dummyUSDTAddress = "0x8A6a67b3edf7A876E107090485681ec71cAdf3bA";
  const bridgeAddress = "0x620864B25471EFEbBd27bFc3239AEB1888fc35b9";

  const FXRPAddress = "0x0b6A3645c240605887a5532109323A3E12273dc7";

  const amountToDeposit = 100; // In wei
  const amountToBorrow = 10n; // In wei

  // NOTE:(Filip) Allow + call deposit + take Loan + approve bridge + withdraw from bridge
  const allowInstructionFXRP = {
    targetContract: FXRPAddress,
    value: BigInt(0),
    data: encodeFunctionData({
      abi: ERC20Abi,
      functionName: "approve",
      args: [loanContractAddress, amountToDeposit],
    }),
  };

  const depositCollateral = {
    targetContract: loanContractAddress,
    value: BigInt(0),
    data: encodeFunctionData({
      abi: LendingAbi,
      functionName: "depositCollateral",
      args: [amountToDeposit],
    }),
  };

  const takeLoanInstruction = {
    targetContract: loanContractAddress,
    value: BigInt(0),
    data: encodeFunctionData({
      abi: LendingAbi,
      functionName: "takeLoan",
      args: [amountToBorrow],
    }),
  };

  const allowInstructionUSDT = {
    targetContract: dummyUSDTAddress,
    value: BigInt(0),
    data: encodeFunctionData({
      abi: ERC20Abi,
      functionName: "approve",
      args: [bridgeAddress, amountToBorrow],
    }),
  };

  const startBridgeInstruction = {
    targetContract: bridgeAddress,
    value: BigInt(0),
    data: encodeFunctionData({
      abi: BridgeAbi,
      functionName: "initiateBridge",
      args: [xrplWallet.address, amountToBorrow],
    }),
  };

  const customInstructions = [
    allowInstructionFXRP,
    depositCollateral,
    takeLoanInstruction,
    allowInstructionUSDT,
    startBridgeInstruction,
  ] as CustomInstruction[];
  console.log("Custom instructions:", customInstructions, "\n");

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

  const initiateBridgeEvent = await findLatestInitiateBridgeEventInLast30Blocks(
    {
      bridgeAddress: bridgeAddress as `0x${string}`,
      personalAccountAddress,
    },
  );
  console.log("InitiateBridge event:", initiateBridgeEvent, "\n");

  await transferEventAmountMptToXrplAddress({
    initiateBridgeEvent,
    xrplClient,
    vaultWallet,
    mptIssuanceId: MPT_ISSUANCE_ID,
    assetScale: 6,
    recipientXrplWallet: xrplWallet,
  });
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
