import { ethers } from "hardhat";
import { IWNatInstance } from "../../typechain-types/@flarenetwork/flare-periphery-contracts/coston/IWNat";

const WNAT_ADDRESS = "0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273";

async function main() {
  const IWNat = (await ethers.getContractAt(
    "@flarenetwork/flare-periphery-contracts/coston2/IWNat.sol:IWNat",
    WNAT_ADDRESS,
  )) as unknown as IWNatInstance;

  // Deposit 0.1 ETH (or whatever amount you want)
  const depositAmount = ethers.parseEther("0.1").toString();
  const tx = await IWNat.deposit({ value: depositAmount });
  console.log("Deposited native token to WNAT", tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
