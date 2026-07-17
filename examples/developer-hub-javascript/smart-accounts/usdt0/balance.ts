import { formatUnits } from "viem";
import { Wallet } from "xrpl";
import { getPersonalAccountAddress } from "../utils/smart-accounts";
import { SWAP_ROUTER_ADDRESS, USDT0_ADDRESS } from "./config";
import { readUsdt0Allowance, readUsdt0Balance, readUsdt0Decimals } from "./utils";

// Read-only: prints the personal account's USDT0 balance and allowance to the
// SparkDEX SwapRouter. Faucet USDT0 to the personal account EVM address via
// https://faucet.flare.network/coston2 if the balance is zero.
async function main() {
  const xrplWallet = Wallet.fromSeed(process.env.XRPL_SEED!);
  const personalAccount = await getPersonalAccountAddress(xrplWallet.address);
  const decimals = await readUsdt0Decimals();

  console.log("Personal account address:", personalAccount, "\n");
  console.log("USDT0 address:", USDT0_ADDRESS, "\n");
  console.log("USDT0 decimals:", decimals, "\n");
  console.log("Spender (SwapRouter):", SWAP_ROUTER_ADDRESS, "\n");

  const [balance, allowance] = await Promise.all([
    readUsdt0Balance(personalAccount),
    readUsdt0Allowance(personalAccount, SWAP_ROUTER_ADDRESS),
  ]);

  console.log("USDT0 balance:", formatUnits(balance, decimals), "\n");
  console.log("USDT0 allowance (→ SwapRouter):", formatUnits(allowance, decimals), "\n");
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
