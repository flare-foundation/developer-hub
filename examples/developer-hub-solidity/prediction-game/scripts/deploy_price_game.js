import { ethers } from "ethers";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { join } from "path";

dotenv.config();

const __dirname = fileURLToPath(new URL(".", import.meta.url));

async function main() {
  try {
    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log("\nDeploying PricePredictionGame contract...");
    console.log("Deployer address:", deployer.address);

    // Get deployer balance
    const balance = await provider.getBalance(deployer.address);
    console.log("Deployer balance:", ethers.formatEther(balance), "FLR");

    // Load contract artifact
    const contractPath = join(
      __dirname,
      "../artifacts/contracts/PricePredictionGame.sol/PricePredictionGame.json",
    );
    const contractArtifact = JSON.parse(readFileSync(contractPath, "utf8"));

    // Create contract factory
    const PricePredictionGame = new ethers.ContractFactory(
      contractArtifact.abi,
      contractArtifact.bytecode,
      deployer,
    );

    // Set minimum bet to 0.01 FLR
    const minimumBet = ethers.parseEther("1");

    // Deploy contract
    console.log(
      "\nDeploying with minimum bet:",
      ethers.formatEther(minimumBet),
      "FLR",
    );
    const duration = BigInt(90);
    const contract = await PricePredictionGame.deploy(minimumBet);

    // Wait for deployment to complete
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();

    // Verify contract state
    const owner = await contract.owner();
    const minBet = await contract.minimumBet();
    const roundId = await contract.roundId();

    // Log deployment info
    console.log("\nDeployment successful!");
    console.log("Contract address:", contractAddress);
    console.log("Owner address:", owner);
    console.log("Minimum bet:", ethers.formatEther(minBet), "FLR");
    console.log("Initial round:", roundId.toString());
    console.log("Transaction hash:", contract.deploymentTransaction().hash);

    // Save deployment info
    const deploymentInfo = {
      network: process.env.RPC_URL,
      contractAddress: contractAddress,
      owner: owner,
      minimumBet: ethers.formatEther(minBet),
      deploymentTime: new Date().toISOString(),
      transactionHash: contract.deploymentTransaction().hash,
    };

    // Start initial round
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
