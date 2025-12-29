/**
 * FirelightVault Status Script
 *
 * This script displays information about a FirelightVault contract.
 * It shows vault metrics, period configuration, user balances, and withdrawal information etc.
 *
 */

import { fmtTs } from "../utils/core";

// 1. Script Setup
export const FIRELIGHT_VAULT_ADDRESS =
  "0x91Bfe6A68aB035DFebb6A770FFfB748C03C0E40B";

export const IFirelightVault = artifacts.require("IFirelightVault");

// @ts-expect-error - Type definitions issue, but works at runtime
const IERC20 = artifacts.require(
  "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
);

async function main() {
  const vault = await IFirelightVault.at(FIRELIGHT_VAULT_ADDRESS);

  // Get the first account
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  // Get basic vault info
  const asset = await vault.asset();
  const totalAssets = await vault.totalAssets();
  const totalSupply = await vault.totalSupply();
  const currentPeriod = await vault.currentPeriod();
  const currentPeriodStart = await vault.currentPeriodStart();
  const currentPeriodEnd = await vault.currentPeriodEnd();
  const nextPeriodEnd = await vault.nextPeriodEnd();
  const pcLen = await vault.periodConfigurationsLength();
  const currentPeriodConfig = await vault.currentPeriodConfiguration();

  // 2. Asset Information
  // Get asset token info
  const assetToken = await IERC20.at(asset);
  const assetSymbol = await assetToken.symbol();
  const assetDecimals = await assetToken.decimals();

  console.log("\n=== Asset ===");
  console.log("Asset address:", asset);
  console.log("Asset symbol:", assetSymbol);
  console.log("Asset decimals:", assetDecimals.toString());

  // 3. Vault Balances
  console.log("\n=== Vault Balances ===");
  const assetDecimalsNum = Number(assetDecimals);
  const formattedTotalAssets = (
    Number(totalAssets.toString()) / Math.pow(10, assetDecimalsNum)
  ).toFixed(assetDecimalsNum);
  const formattedTotalSupply = (
    Number(totalSupply.toString()) / Math.pow(10, assetDecimalsNum)
  ).toFixed(assetDecimalsNum);
  console.log(
    "Total assets (excl. pending withdrawals):",
    totalAssets.toString(),
    `(${formattedTotalAssets} ${assetSymbol})`,
  );
  console.log(
    "Total supply (shares):",
    totalSupply.toString(),
    `(${formattedTotalSupply} shares)`,
  );

  // Calculate exchange rate (assets per share)
  const totalAssetsBN = BigInt(totalAssets.toString());
  const totalSupplyBN = BigInt(totalSupply.toString());
  if (totalSupplyBN !== 0n) {
    // Calculate: (totalAssets * 10^assetDecimals) / totalSupply for precision
    const precision = BigInt(10) ** BigInt(assetDecimalsNum);
    const rateBN = (totalAssetsBN * precision) / totalSupplyBN;
    const formattedRate = (
      Number(rateBN.toString()) / Math.pow(10, assetDecimalsNum)
    ).toFixed(assetDecimalsNum);
    console.log("Exchange rate:", formattedRate, `${assetSymbol}/share`);
  } else {
    console.log("Exchange rate: N/A (no shares minted)");
  }

  // 4. Period Configuration
  console.log("\n=== Period Configuration ===");
  console.log("Period configurations count:", pcLen.toString());
  console.log("Current period:", currentPeriod.toString());
  console.log("Current period start:", fmtTs(currentPeriodStart));
  console.log("Current period end:", fmtTs(currentPeriodEnd));
  console.log("Next period end:", fmtTs(nextPeriodEnd));
  console.log("Current period config:", {
    epoch: currentPeriodConfig.epoch.toString(),
    duration: currentPeriodConfig.duration.toString(),
    startingPeriod: currentPeriodConfig.startingPeriod.toString(),
  });

  console.log("\n=== User Info ===");
  console.log("Account:", account);

  // 5. User Information
  // Get user balance and related info
  const userBalance = await vault.balanceOf(account);
  const userMaxDeposit = await vault.maxDeposit(account);
  const userMaxMint = await vault.maxMint(account);
  const userMaxWithdraw = await vault.maxWithdraw(account);
  const userMaxRedeem = await vault.maxRedeem(account);

  const userBalanceAssets = await vault.convertToAssets(userBalance);
  const formattedUserBalance = (
    Number(userBalance.toString()) / Math.pow(10, assetDecimalsNum)
  ).toFixed(assetDecimalsNum);
  const formattedUserBalanceAssets = (
    Number(userBalanceAssets.toString()) / Math.pow(10, assetDecimalsNum)
  ).toFixed(assetDecimalsNum);

  console.log(
    "User balance (shares):",
    userBalance.toString(),
    `(${formattedUserBalance} shares)`,
  );
  console.log(
    "User balance (assets):",
    userBalanceAssets.toString(),
    `(${formattedUserBalanceAssets} ${assetSymbol})`,
  );
  console.log("Max deposit:", userMaxDeposit.toString());
  console.log("Max mint:", userMaxMint.toString());
  console.log("Max withdraw:", userMaxWithdraw.toString());
  console.log("Max redeem:", userMaxRedeem.toString());

  // 6. User Withdrawals and Redemptions
  // Check withdrawals for current and previous periods
  console.log("\n=== User Withdrawals ===");
  const currentPeriodBN = BigInt(currentPeriod.toString());
  const periodsToCheck = [currentPeriodBN];

  if (currentPeriodBN !== 0n) {
    periodsToCheck.push(currentPeriodBN - 1n);
  }

  for (const period of periodsToCheck) {
    try {
      const withdrawals = await vault.withdrawalsOf(period, account, {
        from: account,
      });
      if (!withdrawals.isZero()) {
        const formattedWithdrawals = (
          Number(withdrawals.toString()) / Math.pow(10, assetDecimalsNum)
        ).toFixed(assetDecimalsNum);
        console.log(
          `Period ${period.toString()}: ${withdrawals.toString()} (${formattedWithdrawals} ${assetSymbol})`,
        );
      }
    } catch {
      // Silently skip if period doesn't exist or other error
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
