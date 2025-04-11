import hre, { run } from "hardhat";
import { MinTempAgencyInstance } from "../../../typechain-types";

const MinTempAgency = artifacts.require("MinTempAgency");

// yarn hardhat run scripts/weatherInsurance/minTemp/deployAgency.ts --network coston2

async function deployAndVerify() {
  const args: any[] = [];
  const agency: MinTempAgencyInstance = await MinTempAgency.new(...args);
  try {
    await run("verify:verify", {
      address: agency.address,
      constructorArguments: args,
    });
  } catch (e: any) {
    console.log(e);
  }
  console.log(
    `(${hre.network.name}) MinTempAgency deployed to`,
    agency.address,
    "\n"
  );
}

deployAndVerify().then((data) => {
  process.exit(0);
});