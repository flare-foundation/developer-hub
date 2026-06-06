import { encodeFunctionData } from "viem";
import { Client, Wallet } from "xrpl";
import { abi as checkpointAbi } from "./abis/Checkpoint";
import { abi as piggyBankAbi } from "./abis/PiggyBank";
import { abi as noticeBoardAbi } from "./abis/NoticeBoard";
import {
  executeDirectMintingWithData,
  findUserOperationExecuted,
  getPersonalAccountAddress,
  sendHashInstruction,
  type Call,
} from "./utils/smart-accounts";
import { computeDirectMintingPaymentAmountXrp } from "./utils/fassets";
import { getXrpBalance } from "./utils/xrpl";

// NOTE:(Nik) For this example to work, you first need to faucet C2FLR to your personal account address.
//
// The 0xFE flow is a three-step protocol. This script runs all three steps
// itself for end-to-end demo purposes, but in production they map to two
// independent actors:
//   1. USER SIDE      - encode the UserOp, commit `keccak256(userOp)` in the
//                       42-byte XRPL memo, send the XRPL Payment.
//   2. EXECUTOR SIDE  - fetch an FDC Payment proof for the XRPL transaction
//                       and call AssetManagerFXRP.executeDirectMintingWithData
//                       with the proof and the full UserOp bytes.
//   3. CONFIRMATION   - the MasterAccountController executes the UserOp inside the executor tx,
//                       so the receipt's logs already contain
//                       UserOperationExecuted; no separate watcher needed.
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

  // With 0xFE the XRPL memo is always 42 bytes regardless of call-batch size,
  // so all three calls fit into a single payment.
  const customInstruction: Call[] = [
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

  const [personalAccount, paymentAmountXrp] = await Promise.all([
    getPersonalAccountAddress(xrplWallet.address),
    computeDirectMintingPaymentAmountXrp({ netMintAmountXrp: fxrpMintAmount }),
  ]);
  console.log("Personal account address:", personalAccount, "\n");
  console.log("Payment amount (XRP, net mint + fees):", paymentAmountXrp, "\n");

  const xrpBalance = await getXrpBalance(xrplWallet.address, xrplClient);
  console.log("XRPL wallet XRP balance:", xrpBalance, "\n");
  if (xrpBalance < paymentAmountXrp) {
    throw new Error(
      `Insufficient XRP balance on ${xrplWallet.address}: have ${xrpBalance} XRP, need ${paymentAmountXrp} XRP`,
    );
  }

  // --- 1. USER SIDE -------------------------------------------------------
  // Send the XRPL Payment carrying the 32-byte UserOp hash in the memo. The
  // full PackedUserOperation bytes (returned as `data`) never go onto XRPL.
  const userSide = await sendHashInstruction({
    label: "hash-instruction-batch",
    customInstruction,
    amountXrp: paymentAmountXrp,
    personalAccount,
    xrplClient,
    xrplWallet,
  });

  // --- 2. EXECUTOR SIDE ---------------------------------------------------
  // Fetch the FDC Payment proof for the XRPL transaction and submit it to
  // AssetManagerFXRP together with `data`. `totalCallValue` is forwarded as
  // msg.value (AssetManager -> MasterAccountController.handleMintedFAssets -> PersonalAccount.call).
  const { receipt } = await executeDirectMintingWithData({
    xrplTransactionHash: userSide.xrplTransactionHash,
    data: userSide.data,
    value: userSide.totalCallValue,
    xrplClient,
    label: "hash-instruction-batch",
  });

  // --- 3. CONFIRMATION ----------------------------------------------------
  // The MasterAccountController executes the UserOp inside the executor transaction, so the
  // receipt's logs already contain UserOperationExecuted.
  const event = findUserOperationExecuted(
    receipt,
    personalAccount,
    userSide.nonce,
  );
  console.log("UserOperationExecuted:", event, "\n");
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
