import { agencyAddress } from "./config";
import { MinTempAgencyInstance } from "../../../typechain-types";

const MinTempAgency = artifacts.require("MinTempAgency");

// yarn hardhat run scripts/weatherInsurance/minTemp/claimPolicy.ts --network coston2

const policyId = 0;

async function getPolicyCoverage(
  agency: MinTempAgencyInstance,
  policyId: number
) {
  const policy = await agency.registeredPolicies(policyId);
  const policyCoverage = policy.coverage;
  console.log("Policy premium:", policyCoverage, "\n");
  return policyCoverage;
}

async function main() {
  const agency: MinTempAgencyInstance = await MinTempAgency.at(agencyAddress);
  console.log("MinTempAgency:", agency.address, "\n");

  const policyCoverage = await getPolicyCoverage(agency, policyId);

  const transaction = await agency.claimPolicy(policyId, {
    value: policyCoverage,
  });
  console.log("Transaction:", transaction.tx, "\n");
}

main().then((data) => {
  process.exit(0);
});
