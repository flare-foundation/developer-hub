import { artifacts, run, web3 } from "hardhat";
import type { AssetVaultInstance } from "../../typechain-types";

// --- Configuration ---
const AssetVault: AssetVaultInstance = artifacts.require("AssetVault");

// FTSO Feed ID for FLR / USD (bytes21) on the Coston2 network.
const FTSO_FEED_ID = "0x01464c522f55534400000000000000000000000000";
// The number of decimals the adapted Chainlink feed will expose (8 is common for crypto pairs).
const CHAINLINK_DECIMALS = 8;
// A human-readable description for the price feed adapter.
const DESCRIPTION = "FTSOv2 FLR/USD adapted for Chainlink";
// A staleness check; the adapter will revert if the price hasn't been refreshed in this many seconds.
const MAX_AGE_SECONDS = 3600; // 1 hour

/**
 * Deploys and verifies the AssetVault contract.
 */
async function deployContracts(): Promise<{ vault: AssetVaultInstance }> {
  // 1. Deploy the AssetVault, linking it to the adapter
  const vaultArgs: (string | number)[] = [
    FTSO_FEED_ID,
    CHAINLINK_DECIMALS,
    DESCRIPTION,
    MAX_AGE_SECONDS,
  ];
  console.log("\nDeploying AssetVault with arguments:");
  console.log(`  - Price Feed Address: ${vaultArgs[0]}`);
  console.log(`  - Chainlink Decimals: ${vaultArgs[1]}`);
  console.log(`  - Description: ${vaultArgs[2]}`);
  console.log(`  - Max Age (seconds): ${vaultArgs[3]}`);

  const vault = await AssetVault.new(
    ...(vaultArgs as [string, number, string, number]),
  );
  console.log("\n✅ AssetVault deployed to:", vault.address);

  // 2. Verify contracts on a live network
  try {
    console.log("\nVerifying AssetVault on block explorer...");
    await run("verify:verify", {
      address: vault.address,
      constructorArguments: vaultArgs,
    });
    console.log("Vault verification successful.");
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Vault verification failed:", e.message);
    } else {
      console.error("An unknown error occurred during verification:", e);
    }
  }

  return { vault };
}

/**
 * Simulates a user's full lifecycle with the AssetVault.
 * @param vault The deployed AssetVault instance.
 */
async function interactWithVault(vault: AssetVaultInstance) {
  const [user] = await web3.eth.getAccounts();
  const depositAmount = 100n * 10n ** 18n; // 100 native tokens (e.g., CFLR)

  console.log(`\n--- Simulating user flow with account: ${user} ---`);
  console.log(
    `Initial collateral in vault: ${(await vault.collateral(user)).toString()}`,
  );

  // Step 1: User deposits collateral
  console.log(
    `\nStep 1: Depositing ${web3.utils.fromWei(depositAmount.toString())} native tokens as collateral...`,
  );
  await vault.deposit({ from: user, value: depositAmount.toString() });
  console.log("✅ Deposit successful.");

  // Step 2: Refresh the price feed on the adapter
  console.log("\nStep 2: Refreshing the FTSO price on the adapter...");
  await vault.refresh({ from: user });
  console.log("✅ Price feed refreshed.");

  // Step 3: Check the value of the deposited collateral
  const collateralValueUSD = await vault.getCollateralValueInUsd(user);
  const collateralValueFormatted =
    Number(BigInt(collateralValueUSD.toString()) / 10n ** 16n) / 100;
  console.log(`\nStep 3: Checking collateral value...`);
  console.log(
    `✅ User's 100 native tokens are worth ${collateralValueFormatted.toFixed(2)} USD.`,
  );

  // Step 4: Borrow MUSD against collateral (40% of LTV)
  const borrowAmount = (BigInt(collateralValueUSD.toString()) * 40n) / 100n; // Borrow 40% of value
  console.log(
    `\nStep 4: Borrowing ${web3.utils.fromWei(borrowAmount.toString())} MUSD...`,
  );
  await vault.borrow(borrowAmount.toString(), { from: user });
  const musdBalance = await vault.balanceOf(user);
  console.log(
    `✅ Borrow successful. User now has ${web3.utils.fromWei(musdBalance.toString())} MUSD.`,
  );

  // Step 5: Repay the MUSD loan
  console.log(
    `\nStep 5: Repaying the ${web3.utils.fromWei(borrowAmount.toString())} MUSD loan...`,
  );
  // First, user must approve the vault to spend their MUSD
  await vault.approve(vault.address, borrowAmount.toString(), { from: user });
  console.log("  - ERC20 approval successful.");
  await vault.repay(borrowAmount.toString(), { from: user });
  console.log(
    "✅ Repayment successful. User MUSD balance is now:",
    (await vault.balanceOf(user)).toString(),
  );

  // Step 6: Withdraw the original collateral
  console.log(
    `\nStep 6: Withdrawing the initial ${web3.utils.fromWei(depositAmount.toString())} native tokens...`,
  );
  await vault.withdraw(depositAmount.toString(), { from: user });
  const finalCollateral = await vault.collateral(user);
  console.log(
    `✅ Withdrawal successful. User's final collateral in vault: ${finalCollateral.toString()}`,
  );
}

async function main() {
  console.log("🚀 Starting Asset Vault Management Script 🚀");
  const { vault } = await deployContracts();
  await interactWithVault(vault);
  console.log("\n🎉 Script finished successfully! 🎉");
}

void main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
