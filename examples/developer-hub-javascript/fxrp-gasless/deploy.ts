/**
 * Deploy the GaslessPaymentForwarder contract
 *
 * Usage: npm run deploy:coston2
 */

// 1. Import the necessary libraries
import hre from "hardhat";
import { erc20Abi } from "viem";
import type { GaslessPaymentForwarder } from "../typechain-types/contracts/GaslessPaymentForwarder";
import type { IERC20Metadata } from "../typechain-types/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata";

// 2. Define the default relayer fee (FXRP token base units)
const DEFAULT_RELAYER_FEE = 10000n;

async function main(): Promise<string> {
  const network = hre.network.name;
  console.log(`\nDeploying GaslessPaymentForwarder to ${network}...`);

  // 3. Get deployer account and balance
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${hre.ethers.formatEther(balance)} FLR`);

  console.log(`\nFXRP address will be fetched from Flare Contract Registry`);
  console.log(
    `  ContractRegistry.getAssetManagerFXRP() -> AssetManager.fAsset()`,
  );
  console.log(`Relayer fee: ${DEFAULT_RELAYER_FEE} (base units)`);

  // 4. Deploy the GaslessPaymentForwarder contract (FXRP fetched from registry)
  const GaslessPaymentForwarder = await hre.ethers.getContractFactory(
    "GaslessPaymentForwarder",
  );
  const forwarder = (await GaslessPaymentForwarder.deploy(
    DEFAULT_RELAYER_FEE,
  )) as unknown as GaslessPaymentForwarder;

  await forwarder.waitForDeployment();
  const forwarderAddress = await forwarder.getAddress();

  // 5. Get FXRP token address from forwarder (for display)
  const fxrpAddress = await forwarder.fxrp();
  const fxrp = new hre.ethers.Contract(
    fxrpAddress,
    erc20Abi as unknown as string[],
    hre.ethers.provider,
  ) as unknown as IERC20Metadata;
  const decimals = await fxrp.decimals();
  const relayerFeeFormatted = hre.ethers.formatUnits(
    DEFAULT_RELAYER_FEE,
    decimals,
  );

  console.log(`\nGaslessPaymentForwarder deployed to: ${forwarderAddress}`);
  console.log("\n--- Deployment Summary ---");
  console.log(`Network: ${network}`);
  console.log(`Contract: ${forwarderAddress}`);
  console.log(`FXRP Token: ${fxrpAddress}`);
  console.log(`Owner: ${deployer.address}`);
  console.log(
    `Relayer Fee: ${relayerFeeFormatted} FXRP (${DEFAULT_RELAYER_FEE} base units)`,
  );

  // 6. Verify contract on block explorer
  console.log("\nVerifying contract...");
  try {
    await hre.run("verify:verify", {
      address: forwarderAddress,
      constructorArguments: [DEFAULT_RELAYER_FEE.toString()],
    });
    console.log("Contract verified successfully.");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Already Verified") || msg.includes("already verified")) {
      console.log("Contract already verified.");
    } else {
      console.warn("Verification failed:", msg);
      console.log(
        `\nTo verify manually: npx hardhat verify --network ${network} ${forwarderAddress} "${DEFAULT_RELAYER_FEE}"`,
      );
    }
  }

  return forwarderAddress;
}

// 7. Main entry point for the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
