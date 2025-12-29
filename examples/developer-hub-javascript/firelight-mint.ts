/**
 * FirelightVault Mint Script
 *
 * This script mints vault shares (ERC-4626) by depositing assets into the FirelightVault.
 * It checks max mint capacity, calculates required assets, approves tokens, and mints shares.
 *
 * Usage:
 *   yarn hardhat run scripts/firelight/mint.ts --network coston2
 */

// 1. Script Setup
export const FIRELIGHT_VAULT_ADDRESS =
  "0x91Bfe6A68aB035DFebb6A770FFfB748C03C0E40B";

const SHARES_TO_MINT = 1; // Number of shares to mint

// @ts-expect-error - Type definitions issue, but works at runtime
const IERC20 = artifacts.require(
  "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
);

const FirelightVault = artifacts.require("IFirelightVault");

async function main() {
  // Get the first account
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  const vault = await FirelightVault.at(FIRELIGHT_VAULT_ADDRESS);

  // 2. Get Asset Information
  // Get asset address from vault
  const assetAddress = await vault.asset();
  const assetToken = await IERC20.at(assetAddress);

  const symbol = await assetToken.symbol();
  const assetDecimals = await assetToken.decimals();
  const assetDecimalsNum = Number(assetDecimals);

  // 3. Calculate Shares to Mint
  const sharesToMint = SHARES_TO_MINT * 10 ** assetDecimalsNum;

  console.log("=== Mint vault shares (ERC-4626) ===");
  console.log("Sender:", account);
  console.log("Vault:", FIRELIGHT_VAULT_ADDRESS);
  console.log("Asset:", assetAddress, `(${symbol}, decimals=${assetDecimals})`);
  console.log(
    "Shares to mint:",
    sharesToMint.toString(),
    `(= ${SHARES_TO_MINT} share${SHARES_TO_MINT > 1 ? "s" : ""})`,
  );

  // 4. Check Maximum Mint Capacity
  // Check max mint capacity
  const maxMint = await vault.maxMint(account);
  console.log("Max mint:", maxMint.toString());
  if (BigInt(sharesToMint) > BigInt(maxMint.toString())) {
    console.error(
      `Cannot mint ${sharesToMint.toString()} shares. Max allowed: ${maxMint.toString()}`,
    );
    process.exit(1);
  }

  // 5. Calculate Required Assets
  // Use previewMint to calculate how much assets we need to approve
  const assetsNeeded = await vault.previewMint(sharesToMint);
  console.log("Assets needed (from previewMint):", assetsNeeded.toString());

  // 6. Approve Token Transfer
  // Approve + mint vault shares
  const approveTx = await assetToken.approve(vault.address, assetsNeeded, {
    from: account,
  });
  console.log("Approve tx:", approveTx.tx);

  // 7. Mint Vault Shares
  const mintTx = await vault.mint(sharesToMint, account, { from: account });
  console.log("Mint tx:", mintTx.tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
