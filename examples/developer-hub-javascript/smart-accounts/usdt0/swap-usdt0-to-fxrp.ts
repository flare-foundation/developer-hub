import { encodeFunctionData, formatUnits } from "viem";
import { Client, Wallet } from "xrpl";
import { abi as ERC20Abi } from "../abis/ERC20";
import { abi as swapRouterAbi } from "../abis/ISwapRouter";
import {
  computeDirectMintingPaymentAmountXrp,
  getFxrpBalance,
  getFxrpDecimals,
} from "../utils/fassets";
import { getFxrpAddress } from "../utils/flare-contract-registry";
import {
  executeDirectMintingWithData,
  findUserOperationExecuted,
  getPersonalAccountAddress,
  sendHashInstruction,
  type Call,
} from "../utils/smart-accounts";
import {
  DEFAULT_AMOUNT_IN_UNITS,
  DEFAULT_AMOUNT_OUT_MINIMUM_UNITS,
  POOL_FEE,
  SWAP_DEADLINE_SECONDS,
  SWAP_ROUTER_ADDRESS,
  USDT0_ADDRESS,
} from "./config";
import { readUsdt0Balance, readUsdt0Decimals, toTokenAmount } from "./utils";

// NOTE: For this example to work, faucet C2FLR and USDT0 to your personal
// account address (https://faucet.flare.network/coston2). Use balance.ts or
// state-lookup.ts to print the personal account EVM address.
//
// Swaps USDT0 to FXRP via SparkDEX's Uniswap V3 router. The XRPL payment
// carries only direct-minting fees (no FXRP mint); the swap itself is a
// batched 0xFE UserOp: USDT0.approve(router) then router.exactInputSingle.
// Both calls run atomically from the personal account.
//
// 0xFE is a three-step protocol; this script runs all three steps inline.
async function main() {
  const deadline = BigInt(Math.floor(Date.now() / 1000) + SWAP_DEADLINE_SECONDS);

  const xrplClient = new Client(process.env.XRPL_TESTNET_RPC_URL!);
  const xrplWallet = Wallet.fromSeed(process.env.XRPL_SEED!);

  const [personalAccount, fxrpAddress, memoOnlyAmountXrp, usdt0Decimals, fxrpDecimals] =
    await Promise.all([
      getPersonalAccountAddress(xrplWallet.address),
      getFxrpAddress(),
      computeDirectMintingPaymentAmountXrp({ netMintAmountXrp: 0 }),
      readUsdt0Decimals(),
      getFxrpDecimals(),
    ]);
  const amountIn = toTokenAmount(DEFAULT_AMOUNT_IN_UNITS, usdt0Decimals);
  const amountOutMinimum = toTokenAmount(DEFAULT_AMOUNT_OUT_MINIMUM_UNITS, fxrpDecimals);

  console.log("Personal account address:", personalAccount, "\n");
  console.log("FXRP address:", fxrpAddress, "\n");
  console.log("USDT0 address:", USDT0_ADDRESS, "\n");
  console.log("USDT0 decimals:", usdt0Decimals, "\n");
  console.log("FXRP decimals:", fxrpDecimals, "\n");
  console.log("Swap router:", SWAP_ROUTER_ADDRESS, "\n");
  console.log("Memo-only amount (XRP, fees only):", memoOnlyAmountXrp, "\n");
  console.log("Amount in:", formatUnits(amountIn, usdt0Decimals), "USDT0");
  console.log("Amount out minimum:", formatUnits(amountOutMinimum, fxrpDecimals), "FXRP\n");

  const [usdt0Before, fxrpBefore] = await Promise.all([
    readUsdt0Balance(personalAccount),
    getFxrpBalance(personalAccount),
  ]);
  console.log("USDT0 before:", formatUnits(usdt0Before, usdt0Decimals), "\n");
  console.log("FXRP before:", formatUnits(fxrpBefore, fxrpDecimals), "\n");

  if (usdt0Before < amountIn) {
    throw new Error(
      `Insufficient USDT0 on ${personalAccount}: have ${formatUnits(usdt0Before, usdt0Decimals)}, need ${formatUnits(amountIn, usdt0Decimals)}`
    );
  }

  const customInstruction: Call[] = [
    {
      target: USDT0_ADDRESS,
      value: 0n,
      data: encodeFunctionData({
        abi: ERC20Abi,
        functionName: "approve",
        args: [SWAP_ROUTER_ADDRESS, amountIn],
      }),
    },
    {
      target: SWAP_ROUTER_ADDRESS,
      value: 0n,
      data: encodeFunctionData({
        abi: swapRouterAbi,
        functionName: "exactInputSingle",
        args: [
          {
            tokenIn: USDT0_ADDRESS,
            tokenOut: fxrpAddress,
            fee: POOL_FEE,
            recipient: personalAccount,
            deadline,
            amountIn,
            amountOutMinimum,
            sqrtPriceLimitX96: 0n,
          },
        ],
      }),
    },
  ];

  // --- 1. USER SIDE -------------------------------------------------------
  const userSide = await sendHashInstruction({
    label: "swap-usdt0-to-fxrp",
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
    label: "swap-usdt0-to-fxrp",
  });

  // --- 3. CONFIRMATION ----------------------------------------------------
  const event = findUserOperationExecuted(receipt, personalAccount, userSide.nonce);
  console.log("UserOperationExecuted:", event, "\n");

  const [usdt0After, fxrpAfter] = await Promise.all([
    readUsdt0Balance(personalAccount),
    getFxrpBalance(personalAccount),
  ]);
  console.log("USDT0 after:", formatUnits(usdt0After, usdt0Decimals), "\n");
  console.log("FXRP after:", formatUnits(fxrpAfter, fxrpDecimals), "\n");
  console.log("USDT0 spent:", formatUnits(usdt0Before - usdt0After, usdt0Decimals), "\n");
  console.log("FXRP received:", formatUnits(fxrpAfter - fxrpBefore, fxrpDecimals), "\n");
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
