import { artifacts, ethers } from "hardhat";
import type {
  IFlareContractRegistryInstance,
  IWNatInstance,
} from "typechain-types";

// Canonical FlareContractRegistry address on every Flare-family network
const FLARE_CONTRACT_REGISTRY = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";

const FlareContractRegistry = artifacts.require("IFlareContractRegistry");
const IWNatArtifact = artifacts.require("IWNat");

// Run with: yarn hardhat run scripts/wnat/withdraw.ts --network coston2
async function main() {
  const registry: IFlareContractRegistryInstance =
    await FlareContractRegistry.at(FLARE_CONTRACT_REGISTRY);
  const wnatAddress = await registry.getContractAddressByName("WNat");
  const wnat: IWNatInstance = await IWNatArtifact.at(wnatAddress);

  // Withdraw 0.1 C2FLR
  const withdrawAmount = ethers.parseEther("0.1").toString();
  const tx = await wnat.withdraw(withdrawAmount);
  console.log("Withdrew from WNAT to native token", tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
