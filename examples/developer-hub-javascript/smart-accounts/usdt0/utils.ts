import { erc20Abi, parseUnits, type Address } from "viem";
import { publicClient } from "../utils/client";
import { USDT0_ADDRESS } from "./config";

export async function readUsdt0Decimals() {
  return publicClient.readContract({
    address: USDT0_ADDRESS,
    abi: erc20Abi,
    functionName: "decimals",
  });
}

export async function readUsdt0Balance(address: Address) {
  return publicClient.readContract({
    address: USDT0_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  });
}

export async function readUsdt0Allowance(owner: Address, spender: Address) {
  return publicClient.readContract({
    address: USDT0_ADDRESS,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner, spender],
  });
}

/** Scale a human-readable token amount by on-chain decimals. */
export function toTokenAmount(units: number | string, decimals: number) {
  return parseUnits(String(units), decimals);
}
