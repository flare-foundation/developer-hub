/**
 * Upshift Tokenized Vault Instant Redeem Script
 *
 * This script performs an instant redemption of LP shares from the Upshift Tokenized Vault.
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

async function previewRedemption(
  vault: ITokenizedVaultInstance,
  sharesToRedeem: bigint,
  decimals: number,
  symbol: string,
) {
  const instantRedemptionFee = await vault.instantRedemptionFee();
  console.log(
    `\nInstant Redemption Fee: ${formatUnits(instantRedemptionFee.toString(), 16)}%`,
  );

  const preview = await vault.previewRedemption(
    sharesToRedeem.toString(),
    true,
  );
  const assetsAmount = preview[0];
  const assetsAfterFee = preview[1];

  console.log(
    `Expected Assets (before fee): ${formatUnits(assetsAmount.toString(), decimals)} ${symbol}`,
  );
  console.log(
    `Expected Assets (after fee): ${formatUnits(assetsAfterFee.toString(), decimals)} ${symbol}`,
  );
}

async function getAssetBalanceBefore(
  refAsset: any,
  userAddress: string,
  decimals: number,
  symbol: string,
) {
  const assetBalanceBefore = await refAsset.balanceOf(userAddress);
  console.log(
    `\nAsset Balance Before: ${formatUnits(assetBalanceBefore.toString(), decimals)} ${symbol}`,
  );

  return { assetBalanceBefore };
}

async function executeInstantRedeem(
  vault: ITokenizedVaultInstance,
  sharesToRedeem: bigint,
  userAddress: string,
) {
  const redeemTx = await vault.instantRedeem(
    sharesToRedeem.toString(),
    userAddress,
  );
  console.log(
    "\nInstant Redeem: (tx:",
    redeemTx.tx,
    ", block:",
    redeemTx.receipt.blockNumber,
    ")",
  );
}

async function verifyRedemption(
  lpToken: IERC20Instance,
  refAsset: any,
  userAddress: string,
  lpBalanceBefore: any,
  assetBalanceBefore: any,
  decimals: number,
  symbol: string,
) {
  console.log("\nVerifying redemption...");

  const lpBalanceAfter = await lpToken.balanceOf(userAddress);
  const assetBalanceAfter = await refAsset.balanceOf(userAddress);

  const sharesRedeemed =
    BigInt(lpBalanceBefore.toString()) - BigInt(lpBalanceAfter.toString());
  const assetsReceived =
    BigInt(assetBalanceAfter.toString()) -
    BigInt(assetBalanceBefore.toString());

  console.log(
    `LP Balance After: ${formatUnits(lpBalanceAfter.toString(), decimals)}`,
  );
  console.log(
    `Shares Redeemed: ${formatUnits(sharesRedeemed.toString(), decimals)}`,
  );
  console.log(
    `Assets Received: ${formatUnits(assetsReceived.toString(), decimals)} ${symbol}`,
  );
}

async function main() {
  // 1. Initialize: Get user account from Hardhat network
  const accounts = await web3.eth.getAccounts();
  const userAddress = accounts[0];

  console.log("INSTANT REDEEM FROM VAULT\n");
  console.log("Vault Address:", VAULT_ADDRESS);
  console.log("User Address:", userAddress);

  // 2. Connect to the vault contract instance
  const vault: ITokenizedVaultInstance =
    await ITokenizedVault.at(VAULT_ADDRESS);

  // 3. Get reference asset info
  const { refAsset, decimals, symbol } = await getReferenceAssetInfo(vault);

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

  // 6. Preview redemption
  await previewRedemption(vault, sharesToRedeem, decimals, symbol);

  // 7. Get asset balance before redemption
  const { assetBalanceBefore } = await getAssetBalanceBefore(
    refAsset,
    userAddress,
    decimals,
    symbol,
  );

  // 8. Execute instant redemption
  await executeInstantRedeem(vault, sharesToRedeem, userAddress);

  // 9. Verify redemption
  await verifyRedemption(
    lpToken,
    refAsset,
    userAddress,
    lpBalance,
    assetBalanceBefore,
    decimals,
    symbol,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
