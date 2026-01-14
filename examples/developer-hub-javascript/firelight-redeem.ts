/**
 * FirelightVault Redeem Script
 *
 * This script creates a redemption request from the FirelightVault (ERC-4626).
 * Redeem burns shares to withdraw assets. Redemptions are delayed and must be claimed after the period ends.
 */

import { ethers } from "hardhat";
import type { IFirelightVaultInstance } from "../../typechain-types/contracts/firelight/IFirelightVault";
import type { ERC20Instance } from "../../typechain-types/@openzeppelin/contracts/token/ERC20/ERC20";
import { bnToBigInt } from "../utils/core";

export const FIRELIGHT_VAULT_ADDRESS =
  "0x91Bfe6A68aB035DFebb6A770FFfB748C03C0E40B";

export const IFirelightVault = artifacts.require("IFirelightVault");

const sharesToRedeem = 1; // Number of shares to redeem

// @ts-expect-error - Type definitions issue, but works at runtime
const IERC20 = artifacts.require(
  "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
);

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

function logRedeemInfo(
  account: string,
  assetAddress: string,
  symbol: string,
  assetDecimals: number,
  sharesAmount: bigint,
) {
  console.log("=== Redeem (ERC-4626) ===");
  console.log("Sender:", account);
  console.log("Vault:", FIRELIGHT_VAULT_ADDRESS);
  console.log("Asset:", assetAddress, `(${symbol}, decimals=${assetDecimals})`);
  console.log(
    "Shares to redeem:",
    sharesAmount.toString(),
    `(= ${sharesToRedeem} share${sharesToRedeem > 1 ? "s" : ""})`,
  );
}

async function validateRedeem(
  vault: IFirelightVaultInstance,
  account: string,
  sharesAmount: bigint,
) {
  const maxRedeem = bnToBigInt(await vault.maxRedeem(account));
  console.log("Max redeem:", maxRedeem);
  if (sharesAmount > maxRedeem) {
    console.error(
      `Cannot redeem ${sharesAmount.toString()} shares. Max allowed: ${maxRedeem.toString()}`,
    );
    process.exit(1);
  }
}

async function checkUserBalance(
  vault: IFirelightVaultInstance,
  account: string,
  sharesAmount: bigint,
  assetDecimals: number,
) {
  const userBalance = await vault.balanceOf(account);
  const formattedUserBalance = (
    Number(userBalance.toString()) / Math.pow(10, assetDecimals)
  ).toFixed(assetDecimals);
  console.log(
    "User balance (shares):",
    userBalance.toString(),
    `(= ${formattedUserBalance} shares)`,
  );
  if (bnToBigInt(userBalance) < sharesAmount) {
    console.error(
      `Insufficient balance. Need ${sharesAmount.toString()} shares, have ${userBalance.toString()}`,
    );
    process.exit(1);
  }
}

async function executeRedeem(
  vault: IFirelightVaultInstance,
  sharesAmount: bigint,
  account: string,
) {
  const redeemTx = await vault.redeem(
    sharesAmount.toString(),
    account,
    account,
    { from: account },
  );
  console.log("Redeem tx:", redeemTx.tx);
}

async function main() {
  // 1. Get the account
  const { account } = await getAccount();

  // 2. Get the vault and asset token
  const { vault, assetAddress, assetToken } = await getVaultAndAsset();

  // 3. Get asset info (symbol, decimals)
  const { symbol, assetDecimals } = await getAssetInfo(assetToken);

  // 4. Calculate the shares amount to redeem
  const sharesAmount = BigInt(sharesToRedeem * 10 ** assetDecimals);

  // 5. Log redeem info
  logRedeemInfo(account, assetAddress, symbol, assetDecimals, sharesAmount);

  // 6. Validate the redeem (check max redeem)
  await validateRedeem(vault, account, sharesAmount);

  // 7. Check user balance
  await checkUserBalance(vault, account, sharesAmount, assetDecimals);

  // 8. Execute the redemption
  await executeRedeem(vault, sharesAmount, account);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
