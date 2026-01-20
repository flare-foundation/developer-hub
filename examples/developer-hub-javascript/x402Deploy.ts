/**
 * x402 Demo Deployment Script
 *
 * Deploys MockUSDT0 and X402Facilitator contracts.
 *
 * Usage:
 * yarn hardhat run scripts/x402/deploy.ts --network coston2
 */

import { run, web3, artifacts } from "hardhat";

const MockUSDT0 = artifacts.require("MockUSDT0");
const X402Facilitator = artifacts.require("X402Facilitator");

async function deployAndVerify() {
  const [deployer] = await web3.eth.getAccounts();

  console.log("═".repeat(60));
  console.log("x402 Demo Deployment");
  console.log("═".repeat(60));
  console.log(`Deployer: ${deployer}`);
  const balance = await web3.eth.getBalance(deployer);
  console.log(`Balance:  ${web3.utils.fromWei(balance, "ether")} C2FLR`);
  console.log("─".repeat(60));

  // Deploy MockUSDT0
  console.log("\n📦 Deploying MockUSDT0...");
  const mockUSDT0 = await MockUSDT0.new();
  console.log(`   MockUSDT0 deployed to: ${mockUSDT0.address}`);

  // Get token info
  const name = await mockUSDT0.name();
  const symbol = await mockUSDT0.symbol();
  const decimals = await mockUSDT0.decimals();
  const totalSupply = await mockUSDT0.totalSupply();
  console.log(`   Name: ${name}`);
  console.log(`   Symbol: ${symbol}`);
  console.log(`   Decimals: ${decimals}`);
  console.log(
    `   Initial Supply: ${web3.utils.fromWei(totalSupply.toString(), "mwei")}`,
  );

  // Deploy X402Facilitator
  console.log("\n📦 Deploying X402Facilitator...");
  const feeBps = 0; // No fees for demo
  const facilitatorArgs = [deployer, feeBps];
  const facilitator = await X402Facilitator.new(deployer, feeBps);
  console.log(`   X402Facilitator deployed to: ${facilitator.address}`);

  // Add token as supported
  console.log("\n⚙️  Configuring facilitator...");
  await facilitator.addSupportedToken(mockUSDT0.address);
  console.log(`   Added MockUSDT0 as supported token`);

  // Summary
  console.log("\n" + "═".repeat(60));
  console.log("Deployment Summary");
  console.log("═".repeat(60));
  console.log(`MockUSDT0:       ${mockUSDT0.address}`);
  console.log(`X402Facilitator: ${facilitator.address}`);
  console.log(`Payee Address:   ${deployer}`);
  console.log("─".repeat(60));
  console.log("\n📝 Add these to your .env file:");
  console.log(`X402_TOKEN_ADDRESS=${mockUSDT0.address}`);
  console.log(`X402_FACILITATOR_ADDRESS=${facilitator.address}`);
  console.log(`X402_PAYEE_ADDRESS=${deployer}`);
  console.log("─".repeat(60));

  // Verify contracts
  console.log("\n🔍 Verifying contracts on explorer...");

  try {
    await run("verify:verify", {
      address: mockUSDT0.address,
      constructorArguments: [],
    });
    console.log("   MockUSDT0 verified");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message.slice(0, 100) : String(e);
    console.log(`   MockUSDT0 verification: ${msg}`);
  }

  try {
    await run("verify:verify", {
      address: facilitator.address,
      constructorArguments: facilitatorArgs,
    });
    console.log("   X402Facilitator verified");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message.slice(0, 100) : String(e);
    console.log(`   X402Facilitator verification: ${msg}`);
  }

  console.log("\n✅ Deployment complete!");
}

void deployAndVerify().then(() => {
  process.exit(0);
});
