/**
 * Usage:
 * yarn hardhat run scripts/smartAccounts/bridgeViaSmartAccount.ts --network coston2
 */

import { web3, artifacts } from "hardhat";
import { formatUnits } from "ethers";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import { Client, Wallet as XrplWallet, xrpToDrops } from "xrpl";
import type { Payment } from "xrpl";
import { FXRPCollateralReservationInstruction } from "@flarenetwork/smart-accounts-encoder";
import { getAssetManagerFXRP } from "../utils/getters";
import { sleep } from "../utils/core";
import type { IAssetManagerInstance, IERC20Instance } from "../../typechain-types";
import * as fs from "fs";
import * as path from "path";

const IERC20 = artifacts.require("IERC20");

// ABIs
const MASTER_ACCOUNT_CONTROLLER_ABI = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../abi/MasterAccountController.json"),
    "utf-8",
  ),
).abi;

const FASSET_OFT_ADAPTER_ABI = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../abi/FAssetOFTAdapter.json"),
    "utf-8",
  ),
).abi;

type CustomInstruction = {
  targetContract: string;
  value: bigint;
  data: string;
};

// Configuration
const CONFIG = {
  MASTER_ACCOUNT_CONTROLLER: "0xa7bc2aC84DB618fde9fa4892D1166fFf75D36FA6",
  COSTON2_OFT_ADAPTER: "0xCd3d2127935Ae82Af54Fc31cCD9D3440dbF46639",
  XRPL_RPC: "wss://s.altnet.rippletest.net:51233",
  SEPOLIA_EID: EndpointId.SEPOLIA_V2_TESTNET,
  EXECUTOR_GAS: 400_000,
  BRIDGE_LOTS: 1, // Number of lots to bridge
  AUTO_MINT_IF_NEEDED: true,
  MINT_LOTS: 1,
} as const;

/**
 * Get the FXRP token address and calculate bridge amount from lots
 * @see https://dev.flare.network/fassets/developer-guides/fassets-fxrp-address
 */
async function getAssetManagerInfo(lots: number) {
  const assetManager = await getAssetManagerFXRP();
  const fxrpAddress = await assetManager.fAsset();
  const lotSizeBN = await assetManager.lotSize();
  const lotSize = BigInt(lotSizeBN.toString());
  const amountToBridge = lotSize * BigInt(lots);

  return {
    fxrpAddress,
    amountToBridge,
  };
}

async function getWallets() {
  const accounts = await web3.eth.getAccounts();
  const signerAddress = accounts[0];
  const xrplSecret = process.env.XRPL_SECRET;
  if (!xrplSecret) throw new Error("XRPL_SECRET not set in .env");
  const xrplWallet = XrplWallet.fromSeed(xrplSecret);

  console.log(`Flare EOA: ${signerAddress}`);
  console.log(`XRPL Wallet: ${xrplWallet.address}`);
  return { signerAddress, xrplWallet };
}

function getMasterController() {
  return new web3.eth.Contract(
    MASTER_ACCOUNT_CONTROLLER_ABI,
    CONFIG.MASTER_ACCOUNT_CONTROLLER,
  );
}

/**
 * Step 1: Register the Bridge Instruction on Flare
 * Creates an ATOMIC BATCH: [Approve Token, Send Token]
 */
async function registerBridgeInstruction(
  recipientAddress: string,
  amountToBridge: bigint,
  fxrpAddress: string,
) {
  console.log("\n=== Step 1: Registering Atomic Bridge Instruction ===");

  const oftAdapter = new web3.eth.Contract(
    FASSET_OFT_ADAPTER_ABI,
    CONFIG.COSTON2_OFT_ADAPTER,
  );
  const ftestxrp = new web3.eth.Contract(IERC20.abi, fxrpAddress);

  // 1. Prepare APPROVE Call (Personal Account -> OFT Adapter)
  const approveCallData = ftestxrp.methods
    .approve(CONFIG.COSTON2_OFT_ADAPTER, amountToBridge.toString())
    .encodeABI();

  const instructionApprove: CustomInstruction = {
    targetContract: fxrpAddress,
    value: 0n,
    data: approveCallData,
  };

  // 2. Prepare SEND Call (Personal Account -> LayerZero)
  const options = Options.newOptions().addExecutorLzReceiveOption(
    CONFIG.EXECUTOR_GAS,
    0,
  );
  const sendParam = {
    dstEid: CONFIG.SEPOLIA_EID,
    to: web3.utils.padLeft(recipientAddress, 64),
    amountLD: amountToBridge.toString(),
    minAmountLD: amountToBridge.toString(),
    extraOptions: options.toHex(),
    composeMsg: "0x",
    oftCmd: "0x",
  };

  const quoteResult = await oftAdapter.methods
    .quoteSend(sendParam, false)
    .call();
  const nativeFee = BigInt(quoteResult.nativeFee);
  console.log(
    `LayerZero Fee: ${formatUnits(nativeFee, 18)} C2FLR required in personal account`,
  );

  const feeStruct = { nativeFee: nativeFee.toString(), lzTokenFee: "0" };
  const sendCallData = oftAdapter.methods
    .send(sendParam, feeStruct, recipientAddress)
    .encodeABI();

  const instructionBridge: CustomInstruction = {
    targetContract: CONFIG.COSTON2_OFT_ADAPTER,
    value: nativeFee, // Gas needed for this specific step
    data: sendCallData,
  };

  // 3. Bundle & Register
  const atomicInstruction: CustomInstruction[] = [
    instructionApprove,
    instructionBridge,
  ];
  const masterController = getMasterController();
  const accounts = await web3.eth.getAccounts();

  console.log("Submitting registration tx...");
  // Note: In a real app, check if this exact hash is already registered to save gas
  await masterController.methods
    .registerCustomInstruction(atomicInstruction)
    .send({ from: accounts[0] });

  const encodedInstructionBN = await masterController.methods
    .encodeCustomInstruction(atomicInstruction)
    .call();
  let instructionHash = BigInt(encodedInstructionBN).toString(16);
  if (instructionHash.length % 2 !== 0) instructionHash = "0" + instructionHash;

  console.log("✅ Instruction Registered.");

  const finalMemo = "99" + instructionHash.padStart(60, "0");
  console.log("Final XRPL Memo:", finalMemo);

  return { memo: finalMemo, requiredGas: nativeFee };
}

async function sendXrplMemoPayment(
  xrplWallet: XrplWallet,
  destination: string,
  amountXrp: string,
  memoHex: string,
) {
  const client = new Client(CONFIG.XRPL_RPC);
  await client.connect();
  try {
    const payment: Payment = {
      TransactionType: "Payment",
      Account: xrplWallet.address,
      Destination: destination,
      Amount: xrpToDrops(amountXrp),
      Memos: [{ Memo: { MemoData: memoHex.toUpperCase() } }],
    };
    console.log(
      `Sending ${amountXrp} XRP to ${destination} with Memo ${memoHex}...`,
    );
    const prepared = await client.autofill(payment);
    const signed = xrplWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    if (
      result.result.meta &&
      typeof result.result.meta === "object" &&
      result.result.meta.TransactionResult !== "tesSUCCESS"
    ) {
      throw new Error(
        `XRPL Payment Failed: ${result.result.meta.TransactionResult}`,
      );
    }
    console.log(`Tx Hash: ${result.result.hash}`);
  } finally {
    await client.disconnect();
  }
}

async function checkPersonalAccount(
  xrplAddress: string,
  requiredAmountFXRP: bigint,
  requiredGas: bigint,
  fxrpAddress: string,
) {
  console.log("\n=== Checking Smart Account Balance ===");
  const masterController = getMasterController();

  const personalAccountAddr = await masterController.methods
    .getPersonalAccount(xrplAddress)
    .call();

  const hasAccount =
    personalAccountAddr !== "0x0000000000000000000000000000000000000000";

  let fxrpBalance = 0n;
  let nativeBalance = 0n;

  if (hasAccount) {
    const ftestxrp: IERC20Instance = await IERC20.at(fxrpAddress);
    fxrpBalance = BigInt(await ftestxrp.balanceOf(personalAccountAddr));
    nativeBalance = BigInt(await web3.eth.getBalance(personalAccountAddr));

    console.log(`Personal Account: ${personalAccountAddr}`);
    console.log(`FXRP Balance: ${formatUnits(fxrpBalance, 18)}`);
    console.log(`C2FLR Balance: ${formatUnits(nativeBalance, 18)}`);
  } else {
    console.log("Personal Account: Not created yet");
  }

  return {
    personalAccountAddr,
    hasAccount,
    needsMint: fxrpBalance < requiredAmountFXRP,
    needsGas: nativeBalance < requiredGas,
    currentNative: nativeBalance,
  };
}

async function waitForReservationEvent(
  assetManager: IAssetManagerInstance,
  agentVault: string,
  startBlock: number,
) {
  console.log("⏳ Waiting for Operator to Execute Reservation...");
  let currentFrom = startBlock;
  const MAX_BLOCK_RANGE = 25;
  const MAX_DURATION = 15 * 60 * 1000;
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_DURATION) {
    const latest = await web3.eth.getBlockNumber();
    while (currentFrom <= latest) {
      const currentTo = Math.min(currentFrom + MAX_BLOCK_RANGE, latest);
      const events = await assetManager.getPastEvents("CollateralReserved", {
        fromBlock: currentFrom,
        toBlock: currentTo,
        filter: { agentVault: agentVault },
      });

      if (events.length > 0) {
        const evt = events[events.length - 1];
        console.log("\n✅ Event Detected in block", evt.blockNumber);
        return {
          valueUBA: BigInt(evt.returnValues.valueUBA),
          paymentReference: evt.returnValues.paymentReference,
        };
      }
      currentFrom = currentTo + 1;
    }
    process.stdout.write(".");
    await sleep(5000);
  }
  throw new Error("Timeout waiting for reservation event.");
}

async function mintFXRP(xrplWallet: XrplWallet, lots: number) {
  console.log(`\n=== Starting Mint for ${lots} Lot(s) ===`);
  const assetManager = await getAssetManagerFXRP();
  const masterController = getMasterController();
  const operatorAddress = await masterController.methods
    .xrplProviderWallet()
    .call();

  const agents = await assetManager.getAvailableAgentsDetailedList(0, 20);
  // Note: This is a proof of concept. In production, you can select your own agent.
  const agentIndex = agents._agents.findIndex(
    (a) => BigInt(a.freeCollateralLots) >= BigInt(lots),
  );
  if (agentIndex === -1) throw new Error("No agents available");
  const agent = agents._agents[agentIndex];
  console.log(`Selected Agent: ${agent.agentVault} (index: ${agentIndex})`);

  const agentInfo = await assetManager.getAgentInfo(agent.agentVault);
  const agentXrplAddress = agentInfo.underlyingAddressString;

  // Encode mint instruction using smart-accounts-encoder library
  const reservationInstruction = new FXRPCollateralReservationInstruction({
    walletId: 0,
    value: lots,
    agentVaultId: agentIndex,
  });
  const instructionMemo = reservationInstruction.encode().slice(2); // Remove '0x' prefix for XRPL memo

  const currentBlock = await web3.eth.getBlockNumber();
  console.log(`1. Sending Reservation Trigger...`);
  await sendXrplMemoPayment(xrplWallet, operatorAddress, "1", instructionMemo);

  const { valueUBA, paymentReference } = await waitForReservationEvent(
    assetManager,
    agent.agentVault,
    currentBlock,
  );
  const xrpAmount = Number(valueUBA) / 1_000_000;

  console.log(`\n✅ Reservation Confirmed.`);
  console.log(`2. Sending Underlying Collateral to Agent...`);
  const refClean = paymentReference.replace("0x", "");
  await sendXrplMemoPayment(
    xrplWallet,
    agentXrplAddress,
    xrpAmount.toString(),
    refClean,
  );

  console.log("⏳ Waiting for FXRP Mint Execution (60s)...");
  await sleep(60000);
}

async function executeBridge(xrplWallet: XrplWallet, bridgeMemo: string) {
  console.log("\n=== Bridging to Sepolia via Custom Instruction ===");
  const masterController = getMasterController();
  const operatorAddress = await masterController.methods
    .xrplProviderWallet()
    .call();

  console.log("Sending Bridge Trigger on XRPL...");
  await sendXrplMemoPayment(xrplWallet, operatorAddress, "0.1", bridgeMemo);
  console.log(
    "\n✅ Bridge Request Sent! (Asynchronous execution on Flare will follow)",
  );
}

/**
 * Main Flow
 */
async function main() {
  const { signerAddress, xrplWallet } = await getWallets();

  // Get FXRP address and calculate bridge amount from lots
  const { fxrpAddress, amountToBridge } = await getAssetManagerInfo(
    CONFIG.BRIDGE_LOTS,
  );
  console.log(
    `\nBridging ${CONFIG.BRIDGE_LOTS} lot(s) = ${formatUnits(amountToBridge, 6)} FXRP`,
  );

  // 1. Register custom instruction
  const { memo: bridgeMemo, requiredGas } = await registerBridgeInstruction(
    signerAddress,
    amountToBridge,
    fxrpAddress,
  );

  // 2. Check State
  const status = await checkPersonalAccount(
    xrplWallet.address,
    amountToBridge,
    requiredGas,
    fxrpAddress,
  );

  // 3. Fund Gas
  if (status.needsGas && status.hasAccount) {
    console.log(`\n⚠️ Personal Account needs Native Gas! Sending C2FLR...`);
    const accounts = await web3.eth.getAccounts();
    await web3.eth.sendTransaction({
      from: accounts[0],
      to: status.personalAccountAddr,
      value: (requiredGas - status.currentNative + BigInt(1e17)).toString(),
    });
    console.log("Gas funded.");
  }

  // 4. Mint (Skipped if balance exists!)
  if (status.needsMint) {
    if (!CONFIG.AUTO_MINT_IF_NEEDED) throw new Error("Insufficient Funds");
    await mintFXRP(xrplWallet, CONFIG.MINT_LOTS);
  } else {
    console.log("✅ Sufficient FXRP balance found. Skipping mint.");
  }

  // 5. Execute Bridge
  await executeBridge(xrplWallet, bridgeMemo);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
