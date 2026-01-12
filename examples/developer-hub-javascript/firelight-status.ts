/**
 * FirelightVault Status Script
 * 
 * This script displays information about a FirelightVault contract.
 * It shows vault metrics, period configuration, user balances, and withdrawal information etc.
 */

import { ethers } from "hardhat";
import { formatTimestamp, bnToBigInt } from "../utils/core";
import { IFirelightVaultInstance } from "../../typechain-types/contracts/firelight/IFirelightVault";

export const FIRELIGHT_VAULT_ADDRESS = "0x91Bfe6A68aB035DFebb6A770FFfB748C03C0E40B";

export const IFirelightVault = artifacts.require("IFirelightVault");

// @ts-expect-error - Type definitions issue, but works at runtime
const IERC20 = artifacts.require("@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20");

async function getAccount() {
    const [signer] = await ethers.getSigners();
    return { signer, account: signer.address };
}

async function getVault() {
    return await IFirelightVault.at(FIRELIGHT_VAULT_ADDRESS) as IFirelightVaultInstance;
}

async function getVaultInfo(vault: IFirelightVaultInstance) {
    const asset = await vault.asset();
    const totalAssets = await vault.totalAssets();
    const totalSupply = await vault.totalSupply();
    const currentPeriod = await vault.currentPeriod();
    const currentPeriodStart = await vault.currentPeriodStart();
    const currentPeriodEnd = await vault.currentPeriodEnd();
    const nextPeriodEnd = await vault.nextPeriodEnd();
    const pcLen = await vault.periodConfigurationsLength();
    const currentPeriodConfig = await vault.currentPeriodConfiguration();
    return {
        asset,
        totalAssets,
        totalSupply,
        currentPeriod,
        currentPeriodStart,
        currentPeriodEnd,
        nextPeriodEnd,
        pcLen,
        currentPeriodConfig,
    };
}

async function getAssetInfo(assetToken: any) {
    const symbol = await assetToken.symbol();
    const assetDecimals = await assetToken.decimals();
    return { symbol, assetDecimals };
}

function logAssetInfo(asset: string, assetSymbol: string, assetDecimals: any) {
    console.log("\n=== Asset ===");
    console.log("Asset address:", asset);
    console.log("Asset symbol:", assetSymbol);
    console.log("Asset decimals:", assetDecimals.toString());
}

function logVaultBalances(totalAssets: any, totalSupply: any, assetSymbol: string, assetDecimals: any) {
    console.log("\n=== Vault Balances ===");
    const assetDecimalsNum = Number(assetDecimals);
    const formattedTotalAssets = (Number(totalAssets.toString()) / Math.pow(10, assetDecimalsNum)).toFixed(assetDecimalsNum);
    const formattedTotalSupply = (Number(totalSupply.toString()) / Math.pow(10, assetDecimalsNum)).toFixed(assetDecimalsNum);
    console.log("Total assets (excl. pending withdrawals):", totalAssets.toString(), `(${formattedTotalAssets} ${assetSymbol})`);
    console.log("Total supply (shares):", totalSupply.toString(), `(${formattedTotalSupply} shares)`);
    
    // Calculate exchange rate (assets per share)
    const totalAssetsBN = bnToBigInt(totalAssets);
    const totalSupplyBN = bnToBigInt(totalSupply);
    if (totalSupplyBN !== 0n) {
        // Calculate: (totalAssets * 10^assetDecimals) / totalSupply for precision
        const precision = BigInt(10) ** BigInt(assetDecimalsNum);
        const rateBN = (totalAssetsBN * precision) / totalSupplyBN;
        const formattedRate = (Number(rateBN.toString()) / Math.pow(10, assetDecimalsNum)).toFixed(assetDecimalsNum);
        console.log("Exchange rate:", formattedRate, `${assetSymbol}/share`);
    } else {
        console.log("Exchange rate: N/A (no shares minted)");
    }
}

function logPeriodConfiguration(
    pcLen: any,
    currentPeriod: any,
    currentPeriodStart: any,
    currentPeriodEnd: any,
    nextPeriodEnd: any,
    currentPeriodConfig: any
) {
    console.log("\n=== Period Configuration ===");
    console.log("Period configurations count:", pcLen.toString());
    console.log("Current period:", currentPeriod.toString());
    console.log("Current period start:", formatTimestamp(currentPeriodStart));
    console.log("Current period end:", formatTimestamp(currentPeriodEnd));
    console.log("Next period end:", formatTimestamp(nextPeriodEnd));
    console.log("Current period config:", {
        epoch: currentPeriodConfig.epoch.toString(),
        duration: currentPeriodConfig.duration.toString(),
        startingPeriod: currentPeriodConfig.startingPeriod.toString(),
    });
}

async function getUserInfo(vault: IFirelightVaultInstance, account: string) {
    const userBalanceBN = await vault.balanceOf(account);
    const userBalance = bnToBigInt(userBalanceBN);
    const userMaxDeposit = bnToBigInt(await vault.maxDeposit(account));
    const userMaxMint = bnToBigInt(await vault.maxMint(account));
    const userMaxWithdraw = bnToBigInt(await vault.maxWithdraw(account));
    const userMaxRedeem = bnToBigInt(await vault.maxRedeem(account));
    const userBalanceAssets = bnToBigInt(await vault.convertToAssets(userBalanceBN));
    return {
        userBalance,
        userMaxDeposit,
        userMaxMint,
        userMaxWithdraw,
        userMaxRedeem,
        userBalanceAssets,
    };
}

function logUserInfo(account: string, userInfo: any, assetSymbol: string, assetDecimals: any) {
    console.log("\n=== User Info ===");
    console.log("Account:", account);
    
    const assetDecimalsNum = Number(assetDecimals);
    const formattedUserBalance = (Number(userInfo.userBalance.toString()) / Math.pow(10, assetDecimalsNum)).toFixed(assetDecimalsNum);
    const formattedUserBalanceAssets = (Number(userInfo.userBalanceAssets.toString()) / Math.pow(10, assetDecimalsNum)).toFixed(assetDecimalsNum);
    
    console.log("User balance (shares):", userInfo.userBalance.toString(), `(${formattedUserBalance} shares)`);
    console.log("User balance (assets):", userInfo.userBalanceAssets.toString(), `(${formattedUserBalanceAssets} ${assetSymbol})`);
    console.log("Max deposit:", userInfo.userMaxDeposit.toString());
    console.log("Max mint:", userInfo.userMaxMint.toString());
    console.log("Max withdraw:", userInfo.userMaxWithdraw.toString());
    console.log("Max redeem:", userInfo.userMaxRedeem.toString());
}

async function logUserWithdrawals(vault: IFirelightVaultInstance, account: string, currentPeriod: any, assetSymbol: string, assetDecimals: any) {
    console.log("\n=== User Withdrawals ===");
    const currentPeriodBN = bnToBigInt(currentPeriod);
    const periodsToCheck = [currentPeriodBN];
    
    if (currentPeriodBN !== 0n) {
        periodsToCheck.push(currentPeriodBN - 1n);
    }

    const assetDecimalsNum = Number(assetDecimals);
    for (const period of periodsToCheck) {
        try {
            const withdrawalsBN = await vault.withdrawalsOf(period.toString(), account, { from: account });
            const withdrawals = bnToBigInt(withdrawalsBN);
            if (withdrawals !== 0n) {
                const formattedWithdrawals = (Number(withdrawals.toString()) / Math.pow(10, assetDecimalsNum)).toFixed(assetDecimalsNum);
                console.log(`Period ${period.toString()}: ${withdrawals.toString()} (${formattedWithdrawals} ${assetSymbol})`);
            }
        } catch {
            // Silently skip if period doesn't exist or other error
        }
    }
}

async function main() {
    // 1. Get the account and vault instance
    const { account } = await getAccount();
    const vault = await getVault();

    // 2. Get vault information (asset, balances, period config)
    const vaultInfo = await getVaultInfo(vault);

    // 3. Get asset token information (symbol, decimals)
    const assetToken = await IERC20.at(vaultInfo.asset);
    const { symbol: assetSymbol, assetDecimals } = await getAssetInfo(assetToken);

    // 4. Log asset information
    logAssetInfo(vaultInfo.asset, assetSymbol, assetDecimals);

    // 5. Log vault balances and exchange rate
    logVaultBalances(vaultInfo.totalAssets, vaultInfo.totalSupply, assetSymbol, assetDecimals);

    // 6. Log period configuration
    logPeriodConfiguration(
        vaultInfo.pcLen,
        vaultInfo.currentPeriod,
        vaultInfo.currentPeriodStart,
        vaultInfo.currentPeriodEnd,
        vaultInfo.nextPeriodEnd,
        vaultInfo.currentPeriodConfig
    );

    // 7. Get and log user information (balances and limits)
    const userInfo = await getUserInfo(vault, account);
    logUserInfo(account, userInfo, assetSymbol, assetDecimals);

    // 8. Log user withdrawals for current and previous periods
    await logUserWithdrawals(vault, account, vaultInfo.currentPeriod, assetSymbol, assetDecimals);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
