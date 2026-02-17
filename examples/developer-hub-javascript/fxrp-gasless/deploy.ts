/**
 * Deploy the GaslessPaymentForwarder contract
 *
 * Usage: npm run deploy:coston2
 */

// 1. Import the necessary libraries
import hre from "hardhat";
import type { GaslessPaymentForwarder } from "../typechain-types/contracts/GaslessPaymentForwarder";

async function main(): Promise<string> {
  const network = hre.network.name;
  console.log(`\nDeploying GaslessPaymentForwarder to ${network}...`);

  // 2. Get deployer account and balance
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${hre.ethers.formatEther(balance)} FLR`);

  console.log(`\nFXRP address will be fetched from Flare Contract Registry`);
  console.log(
    `  ContractRegistry.getAssetManagerFXRP() -> AssetManager.fAsset()`,
  );

  // 3. Deploy the GaslessPaymentForwarder contract (FXRP fetched from registry)
  const GaslessPaymentForwarder = await hre.ethers.getContractFactory(
    "GaslessPaymentForwarder",
  );
  const forwarder =
    (await GaslessPaymentForwarder.deploy()) as unknown as GaslessPaymentForwarder;

  await forwarder.waitForDeployment();
  const forwarderAddress = await forwarder.getAddress();

  // 4. Get FXRP token address from forwarder (for display)
  const fxrpAddress = await forwarder.fxrp();

  console.log(`\nGaslessPaymentForwarder deployed to: ${forwarderAddress}`);
  console.log("\n--- Deployment Summary ---");
  console.log(`Network: ${network}`);
  console.log(`Contract: ${forwarderAddress}`);
  console.log(`FXRP Token: ${fxrpAddress}`);
  console.log(`Owner: ${deployer.address}`);

  // 5. Verify contract on block explorer
  console.log("\nVerifying contract...");
  try {
    await hre.run("verify:verify", {
      address: forwarderAddress,
      constructorArguments: [],
    });
    console.log("Contract verified successfully.");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Already Verified") || msg.includes("already verified")) {
      console.log("Contract already verified.");
    } else {
      console.warn("Verification failed:", msg);
      console.log(
        `\nTo verify manually: npx hardhat verify --network ${network} ${forwarderAddress}`,
      );
    }
  }

  return forwarderAddress;
}

// 6. Main entry point for the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
