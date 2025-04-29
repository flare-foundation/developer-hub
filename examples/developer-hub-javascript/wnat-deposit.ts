import { ethers } from "hardhat";
import { IWNatInstance } from "typechain-types/@flarenetwork/flare-periphery-contracts/coston/IWNat";

const WNAT_ADDRESS = "0x767b25A658E8FC8ab6eBbd52043495dB61b4ea91";

const iWNatArtifact = artifacts.require("IWNat");

// Run with command
// npx hardhat run scripts/wnat/deposit.ts --network coston
async function main() {
  const IWNatInstance: IWNatInstance = await iWNatArtifact.at(WNAT_ADDRESS);

  // Deposit 0.1 ETH
  const depositAmount = ethers.parseEther("0.1").toString();
  const tx = await IWNatInstance.deposit({ value: depositAmount });
  console.log("Deposited native token to WNAT", tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

