import { ethers } from "hardhat";
import { IWNatInstance } from "../../typechain-types/@flarenetwork/flare-periphery-contracts/coston/IWNat";

const WNAT_ADDRESS = "0x767b25A658E8FC8ab6eBbd52043495dB61b4ea91";

const iWNatArtifact = artifacts.require("IWNat");


// Run with command
// npx hardhat run scripts/wnat/withdraw.ts --network coston
async function main() {
  const IWNatInstance: IWNatInstance = await iWNatArtifact.at(WNAT_ADDRESS);

  // Withdraw 0.1 ETH
  const withdrawAmount = ethers.parseEther("0.1").toString();
  const tx = await IWNatInstance.withdraw(withdrawAmount);
  console.log("Withdrew from WNAT to native token", tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

