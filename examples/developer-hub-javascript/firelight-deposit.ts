/**
 * FirelightVault Deposit Script
 *
 * This script deposits assets into the FirelightVault (ERC-4626).
 * It approves tokens and deposits the specified amount, receiving vault shares in return.
 *
 * Usage:
 *   yarn hardhat run scripts/firelight/deposit.ts --network coston2
 */

// 1. Script Setup
export const FIRELIGHT_VAULT_ADDRESS =
  "0x91Bfe6A68aB035DFebb6A770FFfB748C03C0E40B";

export const IFirelightVault = artifacts.require("IFirelightVault");

const DEPOSIT_AMOUNT = 1; // Number of tokens to deposit

// @ts-expect-error - Type definitions issue, but works at runtime
const IERC20 = artifacts.require(
  "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
);

async function main() {
  // Get the first account
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  const vault = await IFirelightVault.at(FIRELIGHT_VAULT_ADDRESS);

  // Get asset address from vault
  const assetAddress = await vault.asset();
  const assetToken = await IERC20.at(assetAddress);

  const symbol = await assetToken.symbol();
  const assetDecimals = await assetToken.decimals();

  // 2. Calculate Deposit Amount
  const amount = DEPOSIT_AMOUNT * 10 ** assetDecimals;

  console.log("=== Deposit (ERC-4626) ===");
  console.log("Sender:", account);
  console.log("Vault:", FIRELIGHT_VAULT_ADDRESS);
  console.log("Asset:", assetAddress, `(${symbol}, decimals=${assetDecimals})`);
  console.log(
    "Deposit amount:",
    amount.toString(),
    `(= ${DEPOSIT_AMOUNT} ${symbol})`,
  );

  // 3. Check Maximum Deposit Capacity
  // Check max deposit capacity
  const maxDeposit = await vault.maxDeposit(account);
  console.log("Max deposit:", maxDeposit.toString());
  if (BigInt(amount.toString()) > BigInt(maxDeposit.toString())) {
    console.error(
      `Cannot deposit ${amount.toString()} assets. Max allowed: ${maxDeposit.toString()}`,
    );
    process.exit(1);
  }

  // 4. Approve Token Transfer
  // Approve + deposit.
  const approveTx = await assetToken.approve(vault.address, amount, {
    from: account,
  });
  console.log("Approve tx:", approveTx.tx);

  // 5. Deposit Assets
  const depositTx = await vault.deposit(amount, account, { from: account });
  console.log("Deposit tx:", depositTx.tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
