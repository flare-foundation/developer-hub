/**
 * Upshift Tokenized Vault Deposit Script
 *
 * This script deposits assets into the Upshift Tokenized Vault.
 *
 */

import { web3 } from "hardhat";
import { parseUnits, formatUnits } from "ethers";

import type { ITokenizedVaultInstance } from "../../typechain-types/contracts/upshift/ITokenizedVault";
import type { IERC20Instance } from "../../typechain-types/@openzeppelin/contracts/token/ERC20/IERC20";

const VAULT_ADDRESS = "0x24c1a47cD5e8473b64EAB2a94515a196E10C7C81";
const DEPOSIT_AMOUNT = "1";

const ITokenizedVault = artifacts.require("ITokenizedVault");
const IERC20 = artifacts.require("IERC20");
const IFAsset = artifacts.require("IFAsset");

async function getReferenceAssetInfo(vault: ITokenizedVaultInstance) {
  const referenceAsset = await vault.asset();
  const refAsset = await IFAsset.at(referenceAsset);
  const decimals = Number(await refAsset.decimals());
  const symbol = await refAsset.symbol();

  console.log("\nReference Asset (asset depositing):", referenceAsset);

  return { referenceAsset, refAsset, decimals, symbol };
}

async function checkBalance(
  refAsset: IERC20Instance,
  userAddress: string,
  depositAmount: bigint,
  decimals: number,
  symbol: string,
) {
  const balance = await refAsset.balanceOf(userAddress);
  console.log(
    `Balance: ${formatUnits(balance.toString(), decimals)} ${symbol}`,
  );

  if (BigInt(balance.toString()) < depositAmount) {
    console.log("Insufficient balance!");
    return false;
  }
  return true;
}

async function checkAndApproveAllowance(
  refAsset: IERC20Instance,
  userAddress: string,
  depositAmount: bigint,
  decimals: number,
  symbol: string,
) {
  const allowance = await refAsset.allowance(userAddress, VAULT_ADDRESS);
  console.log(
    `Current Allowance: ${formatUnits(allowance.toString(), decimals)} ${symbol}`,
  );

  if (BigInt(allowance.toString()) < depositAmount) {
    console.log(
      `\nApproving vault to spend ${DEPOSIT_AMOUNT} ${symbol} tokens`,
    );
    const approveTx = await refAsset.approve(
      VAULT_ADDRESS,
      depositAmount.toString(),
    );
    console.log("Approval Tx:", approveTx.tx);
  }
}

async function previewDeposit(
  vault: ITokenizedVaultInstance,
  referenceAsset: string,
  depositAmount: bigint,
  decimals: number,
) {
  const preview = await vault.previewDeposit(
    referenceAsset,
    depositAmount.toString(),
  );
  const expectedShares = preview[0];
  const amountInRefTokens = preview[1];

  console.log(
    `\nExpected Shares: ${formatUnits(expectedShares.toString(), decimals)}`,
  );
  console.log(
    `Amount in Reference Tokens: ${formatUnits(amountInRefTokens.toString(), decimals)}`,
  );

  return { expectedShares };
}

async function getLPTokenInfo(
  vault: ITokenizedVaultInstance,
  userAddress: string,
  decimals: number,
) {
  const lpTokenAddress = await vault.lpTokenAddress();
  const lpToken: IERC20Instance = await IERC20.at(lpTokenAddress);
  const lpBalanceBefore = await lpToken.balanceOf(userAddress);

  console.log(
    `LP Balance Before: ${formatUnits(lpBalanceBefore.toString(), decimals)}`,
  );

  return { lpToken, lpBalanceBefore };
}

async function executeDeposit(
  vault: ITokenizedVaultInstance,
  referenceAsset: string,
  depositAmount: bigint,
  userAddress: string,
) {
  const depositTx = await vault.deposit(
    referenceAsset,
    depositAmount.toString(),
    userAddress,
  );
  console.log(
    "\nDeposit: (tx:",
    depositTx.tx,
    ", block:",
    depositTx.receipt.blockNumber,
    ")",
  );
}

async function verifyDeposit(
  lpToken: IERC20Instance,
  userAddress: string,
  lpBalanceBefore: { toString(): string },
  decimals: number,
) {
  console.log("\nVerifying deposit...");

  const lpBalanceAfter = await lpToken.balanceOf(userAddress);
  const sharesReceived =
    BigInt(lpBalanceAfter.toString()) - BigInt(lpBalanceBefore.toString());

  console.log(
    `LP Balance After: ${formatUnits(lpBalanceAfter.toString(), decimals)}`,
  );
  console.log(
    `Shares Received: ${formatUnits(sharesReceived.toString(), decimals)}`,
  );
}

async function main() {
  // 1. Initialize: Get user account from Hardhat network
  const accounts = await web3.eth.getAccounts();
  const userAddress = accounts[0];

  console.log("DEPOSIT TO VAULT\n");
  console.log("Vault Address:", VAULT_ADDRESS);
  console.log("User Address:", userAddress);

  // 2. Connect to the vault contract instance
  const vault: ITokenizedVaultInstance =
    await ITokenizedVault.at(VAULT_ADDRESS);

  // 3. Get reference asset info
  const { referenceAsset, refAsset, decimals, symbol } =
    await getReferenceAssetInfo(vault);

  // 4. Convert deposit amount from human-readable to token units
  const depositAmount = parseUnits(DEPOSIT_AMOUNT, decimals);
  console.log(
    `\nDeposit Amount: ${DEPOSIT_AMOUNT} ${symbol} (${depositAmount.toString()})`,
  );

  // 5. Check user balance
  const hasBalance = await checkBalance(
    refAsset,
    userAddress,
    depositAmount,
    decimals,
    symbol,
  );
  if (!hasBalance) return;

  // 6. Check and approve allowance
  await checkAndApproveAllowance(
    refAsset,
    userAddress,
    depositAmount,
    decimals,
    symbol,
  );

  // 7. Preview deposit
  await previewDeposit(vault, referenceAsset, depositAmount, decimals);

  // 8. Get LP token info before deposit
  const { lpToken, lpBalanceBefore } = await getLPTokenInfo(
    vault,
    userAddress,
    decimals,
  );

  // 9. Execute deposit
  await executeDeposit(vault, referenceAsset, depositAmount, userAddress);

  // 10. Verify deposit
  await verifyDeposit(lpToken, userAddress, lpBalanceBefore, decimals);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
