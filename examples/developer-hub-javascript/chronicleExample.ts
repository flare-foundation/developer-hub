import { artifacts, run, web3 } from "hardhat";
import type { DynamicNftMinterInstance } from "../../typechain-types";

// --- Configuration ---
const DynamicNftMinter: DynamicNftMinterInstance =
  artifacts.require("DynamicNftMinter");

// FTSO Feed ID for FLR / USD (bytes21)
const FTSO_FEED_ID = "0x01464c522f55534400000000000000000000000000";
// A human-readable description for the Chronicle 'wat' identifier.
const DESCRIPTION = "FTSO FLR/USD";

/**
 * Deploys the integrated DynamicNftMinter contract.
 */
async function deployContracts(): Promise<{
  minter: DynamicNftMinterInstance;
}> {
  const minterArgs: string[] = [FTSO_FEED_ID, DESCRIPTION];

  console.log(
    "\nDeploying integrated DynamicNftMinter contract with arguments:",
  );
  console.log(`  - FTSO Feed ID: ${minterArgs[0]}`);
  console.log(`  - Description: ${minterArgs[1]}`);

  const minter = await DynamicNftMinter.new(...minterArgs);
  console.log("\n✅ DynamicNftMinter deployed to:", minter.address);

  try {
    console.log("\nVerifying DynamicNftMinter on block explorer...");
    await run("verify:verify", {
      address: minter.address,
      constructorArguments: minterArgs,
    });
    console.log("Minter verification successful.");
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Minter verification failed:", e.message);
    } else {
      console.error("An unknown error occurred during verification:", e);
    }
  }

  return { minter };
}

/**
 * Simulates a user minting a dynamic NFT.
 * @param minter The deployed DynamicNftMinter instance.
 */
async function interactWithMinter(minter: DynamicNftMinterInstance) {
  const accounts = await web3.eth.getAccounts();
  const user = accounts[0]; // The account that will mint the NFT.
  const mintFee = BigInt(await minter.MINT_FEE());

  console.log(`\n--- Simulating Dynamic NFT Mint ---`);
  console.log(`  - Minter Contract: ${minter.address}`);
  console.log(`  - User Account: ${user}`);
  console.log(`  - Mint Fee: ${web3.utils.fromWei(mintFee.toString())} CFLR`);

  // Step 1: Refresh the FTSO price on the contract.
  console.log("\nStep 1: Refreshing the FTSO price on the contract...");
  await minter.refresh({ from: user });
  console.log("✅ Price has been updated on the minter contract.");

  // Step 2: Read the price to see what tier the NFT will be.
  console.log("\nStep 2: Reading the current price from the contract...");
  const tryReadResult = await minter.tryRead();
  const isValid = tryReadResult[0];
  const currentPrice = tryReadResult[1];
  if (!isValid) {
    throw new Error("Price feed is not valid after refresh. Exiting.");
  }
  const priceFormatted =
    Number(BigInt(currentPrice.toString()) / 10n ** 16n) / 100;
  console.log(`✅ Current asset price is ${priceFormatted.toFixed(4)} USD.`);

  // Step 3: User mints the NFT.
  console.log("\nStep 3: Submitting mint transaction...");
  const mintTx = await minter.mint({ from: user, value: mintFee.toString() });

  // Step 4: Decode the event to find out which tier was minted.
  const mintedEvent = mintTx.logs.find((e) => e.event === "NftMinted");
  if (!mintedEvent) {
    throw new Error("NftMinted event not found in transaction logs.");
  }

  const tokenId = mintedEvent.args.tokenId.toString();
  const tierEnum = Number(mintedEvent.args.tier);

  const tierToString = (tierNum: number): string => {
    if (tierNum === 1) return "Bronze";
    if (tierNum === 2) return "Silver";
    if (tierNum === 3) return "Gold";
    return "None";
  };

  console.log(`✅ Mint successful! Transaction Hash: ${mintTx.tx}`);
  console.log(`  - Token ID: ${tokenId}`);
  console.log(`  - Minted Tier: ${tierToString(tierEnum)}`);
}

async function main() {
  console.log("🚀 Starting Dynamic NFT Minter Management Script 🚀");
  const { minter } = await deployContracts();
  await interactWithMinter(minter);
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
