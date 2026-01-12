/**
 * FirelightVault Withdraw Script
 * 
 * This script creates a withdrawal request from the FirelightVault (ERC-4626).
 * Withdrawals are delayed and must be claimed after the period ends.
 * 
 * Usage:
 *   yarn hardhat run scripts/firelight/withdraw.ts --network coston2
 */

import { ethers } from "hardhat";
import { bnToBigInt } from "../utils/core";
import { IFirelightVaultInstance } from "../../typechain-types/contracts/firelight/IFirelightVault";

export const FIRELIGHT_VAULT_ADDRESS = "0x91Bfe6A68aB035DFebb6A770FFfB748C03C0E40B";

export const IFirelightVault = artifacts.require("IFirelightVault");

const tokensToWithdraw = 1; // Number of tokens to withdraw

// @ts-expect-error - Type definitions issue, but works at runtime
const IERC20 = artifacts.require("@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20");

async function getAccount() {
    const [signer] = await ethers.getSigners();
    return { signer, account: signer.address };
}

async function getVaultAndAsset() {
    const vault = await IFirelightVault.at(FIRELIGHT_VAULT_ADDRESS) as IFirelightVaultInstance;
    const assetAddress = await vault.asset();
    const assetToken = await IERC20.at(assetAddress);
    return { vault, assetAddress, assetToken };
}

async function getAssetInfo(assetToken: any) {
    const symbol = await assetToken.symbol();
    const assetDecimals = await assetToken.decimals();
    return { symbol, assetDecimals };
}

function logWithdrawInfo(account: string, assetAddress: string, symbol: string, assetDecimals: any, withdrawAmount: bigint) {
    console.log("=== Withdraw (ERC-4626) ===");
    console.log("Sender:", account);
    console.log("Vault:", FIRELIGHT_VAULT_ADDRESS);
    console.log("Asset:", assetAddress, `(${symbol}, decimals=${assetDecimals})`);
    console.log("Withdraw amount:", withdrawAmount.toString(), `(= ${tokensToWithdraw} ${symbol})`);
}

async function validateWithdraw(vault: IFirelightVaultInstance, account: string, withdrawAmount: bigint) {
    const maxWithdraw = bnToBigInt(await vault.maxWithdraw(account));
    console.log("Max withdraw:", maxWithdraw);
    if (withdrawAmount > maxWithdraw) {
        console.error(`Cannot withdraw ${withdrawAmount.toString()} assets. Max allowed: ${maxWithdraw.toString()}`);
        process.exit(1);
    }
}

async function checkUserBalance(vault: IFirelightVaultInstance, account: string, withdrawAmount: bigint, assetDecimals: any) {
    const userBalance = await vault.balanceOf(account);
    const assetDecimalsNum = Number(assetDecimals);
    const formattedUserBalance = (Number(userBalance.toString()) / Math.pow(10, assetDecimalsNum)).toFixed(assetDecimalsNum);
    console.log("User balance (shares):", userBalance.toString(), `(= ${formattedUserBalance} shares)`);
    
    // Use previewWithdraw to calculate how many shares are needed for this withdrawal
    const sharesNeeded = await vault.previewWithdraw(withdrawAmount.toString());
    if (bnToBigInt(userBalance) < bnToBigInt(sharesNeeded)) {
        console.error(`Insufficient balance. Need ${sharesNeeded.toString()} shares for withdrawal, have ${userBalance.toString()}`);
        process.exit(1);
    }
}

async function executeWithdraw(vault: IFirelightVaultInstance, withdrawAmount: bigint, account: string) {
    const withdrawTx = await vault.withdraw(withdrawAmount.toString(), account, account, { from: account });
    console.log("Withdraw tx:", withdrawTx.tx);
}

async function main() {
    // 1. Get the account
    const { account } = await getAccount();

    // 2. Get the vault and asset token
    const { vault, assetAddress, assetToken } = await getVaultAndAsset();

    // 3. Get asset info (symbol, decimals)
    const { symbol, assetDecimals } = await getAssetInfo(assetToken);

    // 4. Calculate the withdrawal amount
    const withdrawAmount = BigInt(tokensToWithdraw * (10 ** Number(assetDecimals)));

    // 5. Log withdraw info
    logWithdrawInfo(account, assetAddress, symbol, assetDecimals, withdrawAmount);

    // 6. Validate the withdrawal (check max withdraw)
    await validateWithdraw(vault, account, withdrawAmount);

    // 7. Check user balance and shares needed
    await checkUserBalance(vault, account, withdrawAmount, assetDecimals);

    // 8. Execute the withdrawal
    await executeWithdraw(vault, withdrawAmount, account);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

