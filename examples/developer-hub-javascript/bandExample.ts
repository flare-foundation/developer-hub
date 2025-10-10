import { artifacts, network, run, web3 } from "hardhat";
import { PriceTriggeredSafeInstance } from "../../typechain-types";

// --- Configuration ---
const PriceTriggeredSafe: PriceTriggeredSafeInstance =
  artifacts.require("PriceTriggeredSafe");

// --- Helper Functions ---
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches the prices stored in the contract and logs them to the console.
 * @param safe The deployed PriceTriggeredSafe instance.
 * @param label A descriptive label for the log output.
 */
async function logFTSOPrices(safe: PriceTriggeredSafeInstance, label: string) {
  console.log(`\n--- ${label} ---`);
  const assets = ["FLR", "BTC", "ETH"];
  for (const asset of assets) {
    const priceWei = await safe.lastCheckedPrices(asset);
    if (priceWei.toString() === "0") {
      console.log(`  - ${asset}/USD: (not yet recorded)`);
    } else {
      const priceFormatted = web3.utils.fromWei(priceWei.toString(), "ether");
      console.log(`  - ${asset}/USD: ${Number(priceFormatted).toFixed(4)}`);
    }
  }
}

/**
 * Deploys the PriceTriggeredSafe contract.
 */
async function deployContracts(): Promise<{
  safe: PriceTriggeredSafeInstance;
}> {
  console.log("\nDeploying PriceTriggeredSafe contract...");

  const safe = await PriceTriggeredSafe.new();
  console.log("\n✅ PriceTriggeredSafe deployed to:", safe.address);

  if (network.name !== "hardhat" && network.name !== "localhost") {
    try {
      console.log("\nVerifying PriceTriggeredSafe on block explorer...");
      await run("verify:verify", {
        address: safe.address,
        constructorArguments: [],
      });
      console.log("Safe verification successful.");
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("Safe verification failed:", e.message);
      } else {
        console.error("An unknown error occurred during verification:", e);
      }
    }
  }

  return { safe };
}

/**
 * Simulates a user and keeper interacting with the PriceTriggeredSafe.
 * @param safe The deployed PriceTriggeredSafe instance.
 */
async function interactWithSafe(safe: PriceTriggeredSafeInstance) {
  const [user] = await web3.eth.getAccounts();
  const depositAmount = 2n * 10n ** 18n;
  const withdrawalAmount = 1n * 10n ** 18n;

  console.log(`\n--- Simulating Price-Triggered Safe flow ---`);
  console.log(`  - User/Owner/Keeper Account: ${user}`);

  // Step 1: User deposits funds.
  console.log(
    `\nStep 1: User deposits ${web3.utils.fromWei(depositAmount.toString())} native tokens...`,
  );
  await safe.deposit({ from: user, value: depositAmount.toString() });
  console.log("✅ Deposit successful.");

  // Step 2: Set the baseline prices.
  console.log("\nStep 2: Performing initial price check to set baseline...");
  await safe.checkMarketVolatility({ from: user });
  console.log("✅ Baseline prices recorded on-chain.");
  await logFTSOPrices(safe, "Baseline Prices Recorded");

  // Step 3: User withdraws while unlocked.
  console.log(
    `\nStep 3: User withdraws ${web3.utils.fromWei(withdrawalAmount.toString())} tokens...`,
  );
  await safe.withdraw(withdrawalAmount.toString(), { from: user });
  console.log("✅ Initial withdrawal successful.");

  // Step 4: Wait for market prices to change.
  const waitTimeSeconds = 180; // 3 minutes
  console.log(
    `\nStep 4: Waiting ${waitTimeSeconds} seconds for market prices to update on the FTSO...`,
  );
  await wait(waitTimeSeconds * 1000);

  // Step 5: Perform the second volatility check.
  console.log("\nStep 5: Performing second volatility check...");
  await safe.checkMarketVolatility({ from: user });
  await logFTSOPrices(safe, "Updated FTSO Prices After Waiting");

  // Step 6: Check the contract's state and react.
  const isLocked = await safe.isLocked();
  if (isLocked) {
    console.log("\n🚨 VOLATILITY DETECTED! The safe is now LOCKED.");
    console.log(
      "\nStep 6a: User attempts to withdraw while locked (should fail)...",
    );
    try {
      await safe.withdraw(withdrawalAmount.toString(), { from: user });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.includes("Safe is currently locked due to volatility")
      ) {
        console.log("✅ Transaction correctly reverted as expected.");
      } else {
        throw error;
      }
    }

    console.log("\nStep 6b: Owner unlocks the safe...");
    await safe.unlockSafe({ from: user });
    console.log("✅ Safe has been manually unlocked.");

    console.log(
      "\nStep 6c: User attempts to withdraw again (should succeed)...",
    );
    await safe.withdraw(withdrawalAmount.toString(), { from: user });
    console.log("✅ Withdrawal successful after unlocking.");
  } else {
    console.log("\n✅ MARKET STABLE. The safe remains unlocked.");
    console.log("\nStep 6: User confirms they can still withdraw...");
    await safe.withdraw(withdrawalAmount.toString(), { from: user });
    console.log("✅ Subsequent withdrawal successful.");
  }

  const finalBalance = await safe.balances(user);
  console.log(
    `\nFinal user balance in safe: ${web3.utils.fromWei(finalBalance.toString())} CFLR`,
  );
}

async function main() {
  console.log("🚀 Starting Price-Triggered Safe Management Script 🚀");
  const { safe } = await deployContracts();
  await interactWithSafe(safe);
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
