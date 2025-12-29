/**
 * FirelightVault Redeem Script
 *
 * This script creates a redemption request from the FirelightVault (ERC-4626).
 * Redeem burns shares to withdraw assets. Redemptions are delayed and must be claimed after the period ends.
 *
 * Usage:
 *   yarn hardhat run scripts/firelight/redeem.ts --network coston2
 */

// 1. Script Setup
export const FIRELIGHT_VAULT_ADDRESS =
  "0x91Bfe6A68aB035DFebb6A770FFfB748C03C0E40B";

export const IFirelightVault = artifacts.require("IFirelightVault");

const SHARES_TO_REDEEM = 1; // Number of shares to redeem

async function main() {
  // Get the first account
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  const vault = await IFirelightVault.at(FIRELIGHT_VAULT_ADDRESS);

  // 2. Get Asset Information
  // Get asset address from vault
  const assetAddress = await vault.asset();

  // @ts-expect-error - Type definitions issue, but works at runtime
  const IERC20 = artifacts.require(
    "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
  );
  const assetToken = await IERC20.at(assetAddress);

  const symbol = await assetToken.symbol();
  const assetDecimals = await assetToken.decimals();
  const assetDecimalsNum = Number(assetDecimals);

  // 3. Calculate Shares to Redeem
  const sharesToRedeem = SHARES_TO_REDEEM * 10 ** assetDecimalsNum;

  console.log("=== Redeem (ERC-4626) ===");
  console.log("Sender:", account);
  console.log("Vault:", FIRELIGHT_VAULT_ADDRESS);
  console.log("Asset:", assetAddress, `(${symbol}, decimals=${assetDecimals})`);
  console.log(
    "Shares to redeem:",
    sharesToRedeem.toString(),
    `(= ${SHARES_TO_REDEEM} share${SHARES_TO_REDEEM > 1 ? "s" : ""})`,
  );

  // 4. Check Maximum Redemption Capacity
  // Check max redeem capacity
  const maxRedeem = await vault.maxRedeem(account);
  console.log("Max redeem:", maxRedeem.toString());
  if (BigInt(sharesToRedeem.toString()) > BigInt(maxRedeem.toString())) {
    console.error(
      `Cannot redeem ${sharesToRedeem.toString()} shares. Max allowed: ${maxRedeem.toString()}`,
    );
    process.exit(1);
  }

  // 5. Check User Balance
  // Check user balance
  const userBalance = await vault.balanceOf(account);
  const formattedUserBalance = (
    Number(userBalance.toString()) / Math.pow(10, assetDecimalsNum)
  ).toFixed(assetDecimalsNum);
  console.log(
    "User balance (shares):",
    userBalance.toString(),
    `(= ${formattedUserBalance} shares)`,
  );
  if (BigInt(userBalance.toString()) < BigInt(sharesToRedeem.toString())) {
    console.error(
      `Insufficient balance. Need ${sharesToRedeem.toString()} shares, have ${userBalance.toString()}`,
    );
    process.exit(1);
  }

  // 6. Create Redemption Request
  // Redeem creates a withdrawal request (no immediate asset transfer)
  const redeemTx = await vault.redeem(sharesToRedeem, account, account, {
    from: account,
  });
  console.log("Redeem tx:", redeemTx.tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
