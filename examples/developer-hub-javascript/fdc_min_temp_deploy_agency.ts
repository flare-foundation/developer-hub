import hre, { run } from "hardhat";
import type { MinTempAgencyInstance } from "../../../typechain-types";

const MinTempAgency = artifacts.require("MinTempAgency");

// yarn hardhat run scripts/weatherInsurance/minTemp/deployAgency.ts --network coston2

async function deployAndVerify() {
  const args: readonly unknown[] = [];
  const agency: MinTempAgencyInstance = await MinTempAgency.new(...args);

  try {
    await run("verify:verify", {
      address: agency.address,
      constructorArguments: args,
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Verification error:", e.message);
    } else {
      console.error("Unknown verification error:", e);
    }
  }

  console.log(
    `(${hre.network.name}) MinTempAgency deployed to`,
    agency.address,
    "\n",
  );
}

deployAndVerify().then(() => {
  process.exit(0);
});
