/**
 * FirelightVault Deposit Script
 * 
 * This script deposits assets into the FirelightVault (ERC-4626).
 * It approves tokens and deposits the specified amount, receiving vault shares in return.
 */

import { ethers } from "hardhat";
import { IFirelightVaultInstance } from "../../typechain-types/contracts/firelight/IFirelightVault";
import { bnToBigInt } from "../utils/core";

export const FIRELIGHT_VAULT_ADDRESS = "0x91Bfe6A68aB035DFebb6A770FFfB748C03C0E40B";

export const IFirelightVault = artifacts.require("IFirelightVault");

const tokensToDeposit = 1; // Number of tokens to deposit

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

function logDepositInfo(account: string, assetAddress: string, symbol: string, assetDecimals: any, amount: bigint) {
    console.log("=== Deposit (ERC-4626) ===");
    console.log("Sender:", account);
    console.log("Vault:", FIRELIGHT_VAULT_ADDRESS);
    console.log("Asset:", assetAddress, `(${symbol}, decimals=${assetDecimals})`);
    console.log("Deposit amount:", amount.toString(), `(= ${tokensToDeposit} ${symbol})`);
}

async function validateDeposit(vault: IFirelightVaultInstance, account: string, amount: bigint) {
    const maxDeposit = bnToBigInt(await vault.maxDeposit(account));
    console.log("Max deposit:", maxDeposit.toString());
    if (amount > maxDeposit) {
        console.error(`Cannot deposit ${amount.toString()} assets. Max allowed: ${maxDeposit.toString()}`);
        process.exit(1);
    }
}

async function approveTokens(assetToken: any, vault: any, amount: bigint, account: string) {
    const approveTx = await assetToken.approve(vault.address, amount, { from: account });
    console.log("Approve tx:", approveTx.tx);
}

async function executeDeposit(vault: any, amount: bigint, account: string) {
    const depositTx = await vault.deposit(amount, account, { from: account });
    console.log("Deposit tx:", depositTx.tx);
}

async function main() {
    // 1. Get the account
    const { account } = await getAccount();

    // 2. Get the vault and asset token
    const { vault, assetAddress, assetToken } = await getVaultAndAsset();

    // 3. Get asset info (symbol, decimals)
    const { symbol, assetDecimals } = await getAssetInfo(assetToken);

    // 4. Calculate the deposit amount
    const depositAmount = BigInt(tokensToDeposit * (10 ** Number(assetDecimals)));

    // 5. Log deposit info
    logDepositInfo(account, assetAddress, symbol, assetDecimals, depositAmount);

    // 6. Validate the deposit (check max deposit)
    await validateDeposit(vault, account, depositAmount);

    // 7. Approve tokens for transfer
    await approveTokens(assetToken, vault, depositAmount, account);

    // 8. Execute the deposit
    await executeDeposit(vault, depositAmount, account);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

