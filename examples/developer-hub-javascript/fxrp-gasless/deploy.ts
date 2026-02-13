/**
 * Deploy GaslessPaymentForwarder
 *
 * Copy to scripts/deploy.ts. Usage: npx hardhat run scripts/deploy.ts --network coston2
 */

import hre from "hardhat";
import { erc20Abi } from "viem";
import type { GaslessPaymentForwarder } from "../typechain-types/contracts/GaslessPaymentForwarder";
import type { IERC20Metadata } from "../typechain-types/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata";

const DEFAULT_RELAYER_FEE = 10000n;

async function main(): Promise<string> {
  const network = hre.network.name;
  console.log(`\nDeploying GaslessPaymentForwarder to ${network}...`);

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${hre.ethers.formatEther(balance)} FLR`);

  const GaslessPaymentForwarder = await hre.ethers.getContractFactory("GaslessPaymentForwarder");
  const forwarder = (await GaslessPaymentForwarder.deploy(DEFAULT_RELAYER_FEE)) as unknown as GaslessPaymentForwarder;

  await forwarder.waitForDeployment();
  const forwarderAddress = await forwarder.getAddress();

  const fxrpAddress = await forwarder.fxrp();
  const fxrp = new hre.ethers.Contract(
    fxrpAddress,
    erc20Abi as unknown as string[],
    hre.ethers.provider
  ) as unknown as IERC20Metadata;
  const decimals = await fxrp.decimals();
  const relayerFeeFormatted = hre.ethers.formatUnits(DEFAULT_RELAYER_FEE, decimals);

  console.log(`\nGaslessPaymentForwarder deployed to: ${forwarderAddress}`);
  console.log(`FXRP Token: ${fxrpAddress}`);
  console.log(`Relayer Fee: ${relayerFeeFormatted} FXRP`);

  return forwarderAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
