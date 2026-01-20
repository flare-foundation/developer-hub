/**
 * FirelightVault Claim Script
 *
 * This script claims pending withdrawals from the FirelightVault.
 * Withdrawals must be requested first using withdraw/redeem, then claimed after the period ends.
 *
 * Usage:
 *   yarn hardhat run scripts/firelight/claim.ts --network coston2
 */

import { ethers } from "hardhat";
import { bnToBigInt, formatTimestamp } from "../utils/core";
import type { IFirelightVaultInstance } from "../../typechain-types/contracts/firelight/IFirelightVault";
import type { ERC20Instance } from "../../typechain-types/@openzeppelin/contracts/token/ERC20/ERC20";

export const FIRELIGHT_VAULT_ADDRESS =
  "0x91Bfe6A68aB035DFebb6A770FFfB748C03C0E40B";

export const IFirelightVault = artifacts.require("IFirelightVault");

// @ts-expect-error - Type definitions issue, but works at runtime
const IERC20 = artifacts.require(
  "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
);

// Period to claim (0 means auto-detect claimable periods)
const periodToClaim = 0;

async function getAccount() {
  const [signer] = await ethers.getSigners();
  return { signer, account: signer.address };
}

async function getVaultAndAsset() {
  const vault = (await IFirelightVault.at(
    FIRELIGHT_VAULT_ADDRESS,
  )) as IFirelightVaultInstance;
  const assetAddress = await vault.asset();
  const assetToken = (await IERC20.at(assetAddress)) as ERC20Instance;
  return { vault, assetAddress, assetToken };
}

async function getAssetInfo(assetToken: ERC20Instance) {
  const symbol = await assetToken.symbol();
  const assetDecimals = (await assetToken.decimals()).toNumber();
  return { symbol, assetDecimals };
}

function logClaimInfo(
  account: string,
  assetAddress: string,
  symbol: string,
  assetDecimals: number,
) {
  console.log("=== Claim Withdrawals (ERC-4626) ===");
  console.log("Sender:", account);
  console.log("Vault:", FIRELIGHT_VAULT_ADDRESS);
  console.log("Asset:", assetAddress, `(${symbol}, decimals=${assetDecimals})`);
}

async function getClaimableAssets(
  vault: IFirelightVaultInstance,
  period: bigint,
  account: string,
): Promise<bigint | null> {
  try {
    const withdrawals = bnToBigInt(
      await vault.withdrawalsOf(period.toString(), account),
    );
    if (withdrawals === 0n) return null;

    const claimableAssets = await vault.claimWithdraw.call(period.toString(), {
      from: account,
    });
    const assets = bnToBigInt(claimableAssets);
    return assets > 0n ? assets : null;
  } catch {
    return null;
  }
}

/**
 * Checks if a withdrawal for a specific period has been claimed.
 *
 * @param vault - The FirelightVault instance
 * @param period - The period number to check
 * @param account - The account address to check
 * @returns true if the withdrawal has been claimed (no pending withdrawals), false if still pending
 */
export async function isWithdrawClaimed(
  vault: IFirelightVaultInstance,
  period: bigint,
  account: string,
): Promise<boolean> {
  const withdrawals = bnToBigInt(
    await vault.withdrawalsOf(period.toString(), account),
  );
  return withdrawals === 0n;
}

async function findClaimablePeriods(
  vault: IFirelightVaultInstance,
  account: string,
  currentPeriod: bigint,
) {
  const claimablePeriods: { period: bigint; claimableAssets: bigint }[] = [];

  for (let period = 0n; period < currentPeriod; period++) {
    const claimableAssets = await getClaimableAssets(vault, period, account);
    if (claimableAssets) {
      claimablePeriods.push({ period, claimableAssets });
    }
  }

  return claimablePeriods;
}

async function logPeriodInfo(vault: IFirelightVaultInstance) {
  const currentPeriod = bnToBigInt(await vault.currentPeriod());
  const currentPeriodEnd = bnToBigInt(await vault.currentPeriodEnd());

  console.log("\n=== Period Info ===");
  console.log("Current period:", currentPeriod.toString());
  console.log("Current period ends:", formatTimestamp(currentPeriodEnd));

  return currentPeriod;
}

function logClaimablePeriods(
  claimablePeriods: { period: bigint; claimableAssets: bigint }[],
  symbol: string,
  assetDecimals: number,
) {
  console.log("\n=== Claimable Withdrawals ===");

  if (claimablePeriods.length === 0) {
    console.log("No claimable withdrawals found.");
    return;
  }

  let totalAssets = 0n;
  for (const { period, claimableAssets } of claimablePeriods) {
    const formattedAssets = (
      Number(claimableAssets) / Math.pow(10, assetDecimals)
    ).toFixed(assetDecimals);
    console.log(
      `Period ${period.toString()}: ${claimableAssets.toString()} (${formattedAssets} ${symbol})`,
    );
    totalAssets += claimableAssets;
  }

  const formattedTotal = (
    Number(totalAssets) / Math.pow(10, assetDecimals)
  ).toFixed(assetDecimals);
  console.log(
    `Total claimable: ${totalAssets.toString()} (${formattedTotal} ${symbol})`,
  );
}

async function executeClaim(period: bigint) {
  const [signer] = await ethers.getSigners();
  const vaultContract = new ethers.Contract(
    FIRELIGHT_VAULT_ADDRESS,
    ["function claimWithdraw(uint256 period) external returns (uint256)"],
    signer,
  );

  const tx = await vaultContract.claimWithdraw(period.toString());
  const receipt = await tx.wait();
  console.log(`Claim tx (period ${period.toString()}):`, receipt.hash);
  return receipt;
}

async function main() {
  // 1. Get the account
  const { account } = await getAccount();

  // 2. Get the vault and asset token
  const { vault, assetAddress, assetToken } = await getVaultAndAsset();

  // 3. Get asset info (symbol, decimals)
  const { symbol, assetDecimals } = await getAssetInfo(assetToken);

  // 4. Log claim info
  logClaimInfo(account, assetAddress, symbol, assetDecimals);

  // 5. Get current period info
  const currentPeriod = await logPeriodInfo(vault);

  // 6. Find claimable periods (only past periods can be claimed)
  const claimablePeriods = await findClaimablePeriods(
    vault,
    account,
    currentPeriod,
  );

  // 7. Log claimable periods
  logClaimablePeriods(claimablePeriods, symbol, assetDecimals);

  // 8. Execute claims
  // If a specific period is set, only claim that one
  if (periodToClaim > 0) {
    const targetPeriod = BigInt(periodToClaim);
    const found = claimablePeriods.find((p) => p.period === targetPeriod);
    if (found) {
      await executeClaim(targetPeriod);
    } else {
      console.log(`\nPeriod ${periodToClaim} has no claimable withdrawals.`);
    }
  } else {
    // Claim all claimable periods
    for (const { period } of claimablePeriods) {
      await executeClaim(period);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
