/**
 * Upshift Tokenized Vault Status Script
 *
 * This script displays the current status of the vault and user balances.
 *
 */

import { web3 } from "hardhat";
import { formatUnits } from "ethers";

import type { ITokenizedVaultInstance } from "../../typechain-types/contracts/upshift/ITokenizedVault";
import type { IERC20Instance } from "../../typechain-types/@openzeppelin/contracts/token/ERC20/IERC20";

const VAULT_ADDRESS = "0x24c1a47cD5e8473b64EAB2a94515a196E10C7C81";

const ITokenizedVault = artifacts.require("ITokenizedVault");
const IERC20 = artifacts.require("IERC20");
const IFAsset = artifacts.require("IFAsset");

async function printReferenceAssetInfo(vault: ITokenizedVaultInstance) {
  const referenceAsset = await vault.asset();
  const refAsset = await IFAsset.at(referenceAsset);
  const decimals = Number(await refAsset.decimals());
  const symbol = await refAsset.symbol();

  console.log("\nReference Asset");
  console.log(`Address: ${referenceAsset}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Decimals: ${decimals}`);

  return { referenceAsset, refAsset, decimals, symbol };
}

async function printLPTokenInfo(vault: ITokenizedVaultInstance) {
  const lpTokenAddress = await vault.lpTokenAddress();
  const lpToken: IERC20Instance = await IERC20.at(lpTokenAddress);

  console.log("\nLP Token");
  console.log(`Address: ${lpTokenAddress}`);

  return { lpTokenAddress, lpToken };
}

async function printVaultConfiguration(
  vault: ITokenizedVaultInstance,
  decimals: number,
  symbol: string,
) {
  console.log("\nVault Configuration");

  const withdrawalsPaused = await vault.withdrawalsPaused();
  const lagDuration = await vault.lagDuration();
  const withdrawalFee = await vault.withdrawalFee();
  const instantRedemptionFee = await vault.instantRedemptionFee();
  const maxWithdrawalAmount = await vault.maxWithdrawalAmount();

  console.log(`Withdrawals Paused: ${withdrawalsPaused}`);
  console.log(`Lag Duration: ${lagDuration.toString()} seconds`);
  console.log(`Withdrawal Fee: ${formatUnits(withdrawalFee.toString(), 16)}%`);
  console.log(
    `Instant Redemption Fee: ${formatUnits(instantRedemptionFee.toString(), 16)}%`,
  );
  console.log(
    `Max Withdrawal Amount: ${formatUnits(maxWithdrawalAmount.toString(), decimals)} ${symbol}`,
  );
}

async function printWithdrawalEpoch(vault: ITokenizedVaultInstance) {
  console.log("\nWithdrawal Epoch");

  const epochInfo = await vault.getWithdrawalEpoch();
  console.log(
    `Year: ${epochInfo[0].toString()}, Month: ${epochInfo[1].toString()}, Day: ${epochInfo[2].toString()}`,
  );
  console.log(`Claimable Epoch: ${epochInfo[3].toString()}`);
}

async function printUserBalances(
  userAddress: string,
  refAsset: IERC20Instance,
  lpToken: IERC20Instance,
  decimals: number,
  symbol: string,
) {
  console.log("\nUser Balances");

  const refBalance = await refAsset.balanceOf(userAddress);
  const lpBalance = await lpToken.balanceOf(userAddress);

  console.log(
    `${symbol} Balance: ${formatUnits(refBalance.toString(), decimals)}`,
  );
  console.log(
    `LP Token Balance: ${formatUnits(lpBalance.toString(), decimals)}`,
  );
}

async function printAllowances(
  userAddress: string,
  refAsset: IERC20Instance,
  lpToken: IERC20Instance,
  decimals: number,
  symbol: string,
) {
  console.log("\nAllowances");

  const refAllowance = await refAsset.allowance(userAddress, VAULT_ADDRESS);
  const lpAllowance = await lpToken.allowance(userAddress, VAULT_ADDRESS);

  console.log(
    `${symbol} Allowance to Vault: ${formatUnits(refAllowance.toString(), decimals)}`,
  );
  console.log(
    `LP Token Allowance to Vault: ${formatUnits(lpAllowance.toString(), decimals)}`,
  );
}

async function main() {
  // 1. Initialize: Get user account from Hardhat network
  const accounts = await web3.eth.getAccounts();
  const userAddress = accounts[0];

  console.log("VAULT STATUS\n");
  console.log("Vault Address:", VAULT_ADDRESS);
  console.log("User Address:", userAddress);

  // 2. Connect to the vault contract instance
  const vault: ITokenizedVaultInstance =
    await ITokenizedVault.at(VAULT_ADDRESS);

  // 3. Get and print reference asset info
  const { refAsset, decimals, symbol } = await printReferenceAssetInfo(vault);

  // 4. Get and print LP token info
  const { lpToken } = await printLPTokenInfo(vault);

  // 5. Print vault configuration
  await printVaultConfiguration(vault, decimals, symbol);

  // 6. Print withdrawal epoch info
  await printWithdrawalEpoch(vault);

  // 7. Print user balances
  await printUserBalances(userAddress, refAsset, lpToken, decimals, symbol);

  // 8. Print allowances
  await printAllowances(userAddress, refAsset, lpToken, decimals, symbol);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
