import { encodeFunctionData, formatUnits } from "viem";
import { Client, Wallet } from "xrpl";
import { abi as ERC20Abi } from "../abis/ERC20";
import { computeDirectMintingPaymentAmountXrp } from "../utils/fassets";
import {
  executeDirectMintingWithData,
  findUserOperationExecuted,
  getPersonalAccountAddress,
  sendHashInstruction,
  type Call,
} from "../utils/smart-accounts";
import {
  DEFAULT_AMOUNT_IN_UNITS,
  DEFAULT_TRANSFER_RECIPIENT,
  USDT0_ADDRESS,
} from "./config";
import { readUsdt0Balance, readUsdt0Decimals, toTokenAmount } from "./utils";

// NOTE: For this example to work, faucet C2FLR and USDT0 to your personal
// account address (https://faucet.flare.network/coston2). Use balance.ts or
// state-lookup.ts to print the personal account EVM address.
//
// Transfers USDT0 from the personal account via a fee-only 0xFE UserOp
// (no FXRP mint). 0xFE is a three-step protocol; this script runs all three
// steps inline.
async function main() {
  const recipient = DEFAULT_TRANSFER_RECIPIENT;

  const xrplClient = new Client(process.env.XRPL_TESTNET_RPC_URL!);
  const xrplWallet = Wallet.fromSeed(process.env.XRPL_SEED!);

  const [personalAccount, memoOnlyAmountXrp, decimals] = await Promise.all([
    getPersonalAccountAddress(xrplWallet.address),
    computeDirectMintingPaymentAmountXrp({ netMintAmountXrp: 0 }),
    readUsdt0Decimals(),
  ]);
  const amount = toTokenAmount(DEFAULT_AMOUNT_IN_UNITS, decimals);

  console.log("Personal account address:", personalAccount, "\n");
  console.log("USDT0 address:", USDT0_ADDRESS, "\n");
  console.log("USDT0 decimals:", decimals, "\n");
  console.log("Recipient:", recipient, "\n");
  console.log("Memo-only amount (XRP, fees only):", memoOnlyAmountXrp, "\n");
  console.log("Transfer amount:", formatUnits(amount, decimals), "USDT0\n");

  const [usdt0Before, recipientBefore] = await Promise.all([
    readUsdt0Balance(personalAccount),
    readUsdt0Balance(recipient),
  ]);
  console.log(
    "Personal USDT0 before:",
    formatUnits(usdt0Before, decimals),
    "\n",
  );
  console.log(
    "Recipient USDT0 before:",
    formatUnits(recipientBefore, decimals),
    "\n",
  );

  if (usdt0Before < amount) {
    throw new Error(
      `Insufficient USDT0 on ${personalAccount}: have ${formatUnits(usdt0Before, decimals)}, need ${formatUnits(amount, decimals)}`,
    );
  }

  const customInstruction: Call[] = [
    {
      target: USDT0_ADDRESS,
      value: 0n,
      data: encodeFunctionData({
        abi: ERC20Abi,
        functionName: "transfer",
        args: [recipient, amount],
      }),
    },
  ];

  // --- 1. USER SIDE -------------------------------------------------------
  const userSide = await sendHashInstruction({
    label: "transfer-usdt0",
    customInstruction,
    amountXrp: memoOnlyAmountXrp,
    personalAccount,
    xrplClient,
    xrplWallet,
  });

  // --- 2. EXECUTOR SIDE ---------------------------------------------------
  const { receipt } = await executeDirectMintingWithData({
    xrplTransactionHash: userSide.xrplTransactionHash,
    data: userSide.data,
    value: userSide.totalCallValue,
    xrplClient,
    label: "transfer-usdt0",
  });

  // --- 3. CONFIRMATION ----------------------------------------------------
  const event = findUserOperationExecuted(
    receipt,
    personalAccount,
    userSide.nonce,
  );
  console.log("UserOperationExecuted:", event, "\n");

  const [usdt0After, recipientAfter] = await Promise.all([
    readUsdt0Balance(personalAccount),
    readUsdt0Balance(recipient),
  ]);
  console.log("Personal USDT0 after:", formatUnits(usdt0After, decimals), "\n");
  console.log(
    "Recipient USDT0 after:",
    formatUnits(recipientAfter, decimals),
    "\n",
  );
  console.log(
    "USDT0 sent:",
    formatUnits(usdt0Before - usdt0After, decimals),
    "\n",
  );
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
