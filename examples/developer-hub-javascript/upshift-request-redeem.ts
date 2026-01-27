/**
 * Upshift Tokenized Vault Request Redeem Script
 *
 * This script requests a delayed redemption of LP shares from the Upshift Tokenized Vault.
 * After the lag duration passes, use the claim script to receive assets.
 *
 */

import { web3 } from "hardhat";
import { parseUnits, formatUnits } from "ethers";

import { ITokenizedVaultInstance } from "../../typechain-types/contracts/upshift/ITokenizedVault";
import { IERC20Instance } from "../../typechain-types/@openzeppelin/contracts/token/ERC20/IERC20";

const VAULT_ADDRESS = "0x24c1a47cD5e8473b64EAB2a94515a196E10C7C81";
const SHARES_TO_REDEEM = "1";

const ITokenizedVault = artifacts.require("ITokenizedVault");
const IERC20 = artifacts.require("IERC20");
const IFAsset = artifacts.require("IFAsset");

async function getReferenceAssetInfo(vault: ITokenizedVaultInstance) {
  const referenceAsset = await vault.asset();
  const refAsset = await IFAsset.at(referenceAsset);
  const decimals = Number(await refAsset.decimals());
  const symbol = await refAsset.symbol();

  console.log("Reference Asset (asset receiving):", referenceAsset);

  return { referenceAsset, refAsset, decimals, symbol };
}

async function getLPTokenInfo(
  vault: ITokenizedVaultInstance,
  userAddress: string,
  decimals: number,
) {
  const lpTokenAddress = await vault.lpTokenAddress();
  const lpToken: IERC20Instance = await IERC20.at(lpTokenAddress);
  const lpBalance = await lpToken.balanceOf(userAddress);

  console.log(`\nLP Balance: ${formatUnits(lpBalance.toString(), decimals)}`);

  return { lpToken, lpBalance };
}

function checkLPBalance(lpBalance: any, sharesToRedeem: bigint) {
  if (BigInt(lpBalance.toString()) < sharesToRedeem) {
    console.log("Insufficient LP balance!");
    return false;
  }
  return true;
}

async function checkAndApproveLPAllowance(
  lpToken: IERC20Instance,
  userAddress: string,
  sharesToRedeem: bigint,
  decimals: number,
) {
  const lpAllowance = await lpToken.allowance(userAddress, VAULT_ADDRESS);
  console.log(
    `\nCurrent LP Allowance: ${formatUnits(lpAllowance.toString(), decimals)}`,
  );

  if (BigInt(lpAllowance.toString()) < sharesToRedeem) {
    console.log(`\nApproving vault to spend ${SHARES_TO_REDEEM} LP tokens...`);
    const approveTx = await lpToken.approve(
      VAULT_ADDRESS,
      sharesToRedeem.toString(),
    );
    console.log("Approval Tx:", approveTx.tx);
  }
}

async function checkVaultConfiguration(
  vault: ITokenizedVaultInstance,
  sharesToRedeem: bigint,
  decimals: number,
  symbol: string,
) {
  const lagDuration = await vault.lagDuration();
  const withdrawalFee = await vault.withdrawalFee();
  const withdrawalsPaused = await vault.withdrawalsPaused();
  const maxWithdrawalAmount = await vault.maxWithdrawalAmount();

  console.log(`\nLag Duration: ${lagDuration.toString()} seconds`);
  console.log(`Withdrawal Fee: ${formatUnits(withdrawalFee.toString(), 16)}%`);
  console.log(`Withdrawals Paused: ${withdrawalsPaused}`);
  console.log(
    `Max Withdrawal Amount: ${formatUnits(maxWithdrawalAmount.toString(), decimals)} ${symbol}`,
  );

  if (withdrawalsPaused) {
    console.log("\nError: Withdrawals are currently paused!");
    return false;
  }

  if (
    BigInt(maxWithdrawalAmount.toString()) > 0n &&
    sharesToRedeem > BigInt(maxWithdrawalAmount.toString())
  ) {
    console.log("\nError: Shares to redeem exceeds max withdrawal amount!");
    return false;
  }

  return true;
}

async function previewRedemption(
  vault: ITokenizedVaultInstance,
  sharesToRedeem: bigint,
  decimals: number,
  symbol: string,
) {
  const preview = await vault.previewRedemption(
    sharesToRedeem.toString(),
    false,
  );
  const assetsAmount = preview[0];
  const assetsAfterFee = preview[1];

  console.log(
    `\nExpected Assets (before fee): ${formatUnits(assetsAmount.toString(), decimals)} ${symbol}`,
  );
  console.log(
    `Expected Assets (after fee): ${formatUnits(assetsAfterFee.toString(), decimals)} ${symbol}`,
  );
}

async function printWithdrawalEpoch(vault: ITokenizedVaultInstance) {
  const epochInfo = await vault.getWithdrawalEpoch();
  console.log(
    `\nCurrent Epoch - Year: ${epochInfo[0].toString()}, Month: ${epochInfo[1].toString()}, Day: ${epochInfo[2].toString()}`,
  );
  console.log(`Claimable Epoch: ${epochInfo[3].toString()}`);
}

async function executeRequestRedeem(
  vault: ITokenizedVaultInstance,
  sharesToRedeem: bigint,
  userAddress: string,
) {
  const requestTx = await vault.requestRedeem(
    sharesToRedeem.toString(),
    userAddress,
  );
  console.log(
    "\nRequest Redeem: (tx:",
    requestTx.tx,
    ", block:",
    requestTx.receipt.blockNumber,
    ")",
  );
}

async function verifyRequest(
  vault: ITokenizedVaultInstance,
  lpToken: IERC20Instance,
  userAddress: string,
  lpBalanceBefore: any,
  decimals: number,
) {
  const lpBalanceAfter = await lpToken.balanceOf(userAddress);
  const sharesLocked =
    BigInt(lpBalanceBefore.toString()) - BigInt(lpBalanceAfter.toString());

  console.log(
    `LP Balance After: ${formatUnits(lpBalanceAfter.toString(), decimals)}`,
  );
  console.log(
    `Shares Locked: ${formatUnits(sharesLocked.toString(), decimals)}`,
  );

  const newEpochInfo = await vault.getWithdrawalEpoch();
  console.log(
    `\nClaim your assets after: ${newEpochInfo[0].toString()}/${newEpochInfo[1].toString()}/${newEpochInfo[2].toString()}`,
  );
}

async function main() {
  // 1. Initialize: Get user account from Hardhat network
  const accounts = await web3.eth.getAccounts();
  const userAddress = accounts[0];

  console.log("REQUEST REDEEM FROM VAULT\n");
  console.log("Vault Address:", VAULT_ADDRESS);
  console.log("User Address:", userAddress);

  // 2. Connect to the vault contract instance
  const vault: ITokenizedVaultInstance =
    await ITokenizedVault.at(VAULT_ADDRESS);

  // 3. Get reference asset info
  const { decimals, symbol } = await getReferenceAssetInfo(vault);

  // 4. Get LP token info
  const { lpToken, lpBalance } = await getLPTokenInfo(
    vault,
    userAddress,
    decimals,
  );

  // 5. Convert shares amount and validate balance
  const sharesToRedeem = parseUnits(SHARES_TO_REDEEM, decimals);
  console.log(
    `Shares to Redeem: ${SHARES_TO_REDEEM} (${sharesToRedeem.toString()})`,
  );

  const hasBalance = checkLPBalance(lpBalance, sharesToRedeem);
  if (!hasBalance) return;

  // 6. Check and approve LP allowance
  await checkAndApproveLPAllowance(
    lpToken,
    userAddress,
    sharesToRedeem,
    decimals,
  );

  // 7. Check vault configuration
  const canProceed = await checkVaultConfiguration(
    vault,
    sharesToRedeem,
    decimals,
    symbol,
  );
  if (!canProceed) return;

  // 8. Preview redemption
  await previewRedemption(vault, sharesToRedeem, decimals, symbol);

  // 9. Print withdrawal epoch info
  await printWithdrawalEpoch(vault);

  // 10. Execute request redeem
  await executeRequestRedeem(vault, sharesToRedeem, userAddress);

  // 11. Verify request
  await verifyRequest(vault, lpToken, userAddress, lpBalance, decimals);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
