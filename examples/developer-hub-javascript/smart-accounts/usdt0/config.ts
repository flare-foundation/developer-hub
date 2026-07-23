import type { Address } from "viem";

/** USDT0 on Coston2. Mainnet: 0xe7cd86e13AC4309349F30B3435a9d337750fC82D */
export const USDT0_ADDRESS =
  "0xC1A5B41512496B80903D1f32d6dEa3a73212E71F" as Address;

/** SparkDEX Uniswap V3 SwapRouter. See https://dev.flare.network/fxrp/token-interactions/usdt0-fxrp-swap */
export const SWAP_ROUTER_ADDRESS =
  "0x8a1E35F5c98C4E85B36B7B253222eE17773b2781" as Address;

/** USDT0/FXRP pool fee tier (0.05%). */
export const POOL_FEE = 500;

/** Default swap / transfer size in whole USDT0 units (scaled by on-chain decimals). */
export const DEFAULT_AMOUNT_IN_UNITS = 1;

/**
 * Minimum FXRP out in whole FXRP units. Conservative floor for demo swaps —
 * tune against current pool price before running on mainnet-sized amounts.
 */
export const DEFAULT_AMOUNT_OUT_MINIMUM_UNITS = "0.3";

/** Swap deadline offset from now (seconds). */
export const SWAP_DEADLINE_SECONDS = 20 * 60;

/** Hardcoded EVM recipient for the transfer demo. */
export const DEFAULT_TRANSFER_RECIPIENT =
  "0x1cdacde0c68e0a508ae85279375070a88554871b" as Address;
