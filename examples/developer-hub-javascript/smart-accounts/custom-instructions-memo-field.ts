import { encodeFunctionData } from "viem";
import { Client, Wallet } from "xrpl";
import { abi as checkpointAbi } from "./abis/Checkpoint";
import { abi as piggyBankAbi } from "./abis/PiggyBank";
import { abi as noticeBoardAbi } from "./abis/NoticeBoard";
import {
  getPersonalAccountAddress,
  sendMemoFieldInstruction,
  type Call,
} from "./utils/smart-accounts";
import { computeDirectMintingPaymentAmountXrp } from "./utils/fassets";
import { getXrpBalance } from "./utils/xrpl";

// NOTE:(Nik) For this example to work, you first need to faucet C2FLR to your personal account address.
async function main() {
  // Net FXRP amount to mint in XRP. Minting + executor fees are fetched from
  // AssetManagerFXRP and added on top to form the XRPL payment amount.
  const fxrpMintAmount = 10;

  const checkpointAddress = "0xEE6D54382aA623f4D16e856193f5f8384E487002";
  const piggyBankAddress = "0x42Ccd4F0aB1C6Fa36BfA37C9e30c4DC4DD94dE42";
  const noticeBoardAddress = "0x59D57652BF4F6d97a6e555800b3920Bd775661Dc";

  const depositAmount = 1 * 10 ** 18;
  const pinNoticeAmount = 1 * 10 ** 18;
  const pinNoticeMessage = "Hello World!";

  // XRPL caps each memo at ~1024 bytes. `pinNotice` has a string arg that pushes
  // the 3-call version over the limit, so it goes in its own batch.
  const checkpointAndDepositCustomInstruction: Call[] = [
    {
      target: checkpointAddress,
      value: BigInt(0),
      data: encodeFunctionData({
        abi: checkpointAbi,
        functionName: "passCheckpoint",
        args: [],
      }),
    },
    {
      target: piggyBankAddress,
      value: BigInt(depositAmount),
      data: encodeFunctionData({
        abi: piggyBankAbi,
        functionName: "deposit",
        args: [],
      }),
    },
  ];
  const pinNoticeCustomInstruction: Call[] = [
    {
      target: noticeBoardAddress,
      value: BigInt(pinNoticeAmount),
      data: encodeFunctionData({
        abi: noticeBoardAbi,
        functionName: "pinNotice",
        args: [pinNoticeMessage],
      }),
    },
  ];

  const xrplClient = new Client(process.env.XRPL_TESTNET_RPC_URL!);
  const xrplWallet = Wallet.fromSeed(process.env.XRPL_SEED!);

  const [personalAccount, paymentAmountXrp, memoOnlyAmountXrp] =
    await Promise.all([
      getPersonalAccountAddress(xrplWallet.address),
      computeDirectMintingPaymentAmountXrp({
        netMintAmountXrp: fxrpMintAmount,
      }),
      computeDirectMintingPaymentAmountXrp({ netMintAmountXrp: 0 }),
    ]);
  console.log("Personal account address:", personalAccount, "\n");
  console.log("Payment amount (XRP, net mint + fees):", paymentAmountXrp, "\n");
  console.log("Memo-only amount (XRP, fees only):", memoOnlyAmountXrp, "\n");

  const totalRequiredXrp = paymentAmountXrp + memoOnlyAmountXrp;
  const xrpBalance = await getXrpBalance(xrplWallet.address, xrplClient);
  console.log("XRPL wallet XRP balance:", xrpBalance, "\n");
  if (xrpBalance < totalRequiredXrp) {
    throw new Error(
      `Insufficient XRP balance on ${xrplWallet.address}: have ${xrpBalance} XRP, need ${totalRequiredXrp} XRP (both payments)`,
    );
  }

  await sendMemoFieldInstruction({
    label: "checkpoint-and-deposit",
    customInstruction: checkpointAndDepositCustomInstruction,
    amountXrp: paymentAmountXrp,
    personalAccount,
    xrplClient,
    xrplWallet,
  });

  await sendMemoFieldInstruction({
    label: "pin-notice",
    customInstruction: pinNoticeCustomInstruction,
    amountXrp: memoOnlyAmountXrp,
    personalAccount,
    xrplClient,
    xrplWallet,
  });
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
