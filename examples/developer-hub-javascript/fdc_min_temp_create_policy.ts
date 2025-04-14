import { agencyAddress } from "./config";
import { MinTempAgencyInstance } from "../../../typechain-types";

const MinTempAgency = artifacts.require("MinTempAgency");

// yarn hardhat run scripts/weatherInsurance/minTemp/createPolicy.ts --network coston2

const latitude = 46.419402127862405;
const longitude = 15.587079308221126;
const apiId = process.env.OPEN_WEATHER_API_KEY ?? "";

const units = "metric";

const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiId}&units=${units}`;

const startTimestamp = Math.round(Date.now() / 1000) + 30;
const expirationTimestamp = startTimestamp + 60 * 60;
const minTempThreshold = 20 * 10 ** 6;
const premium = 10;
const coverage = 1000;

async function getWeatherStationCoordinates(apiUrl: string) {
  const response = await fetch(apiUrl, { method: "GET" });
  const json = await response.json();
  console.log("Response:", json, "\n");
  return json.coord;
}

interface PolicyParameters {
  latitude: number;
  longitude: number;
  startTimestamp: number;
  expirationTimestamp: number;
  minTempThreshold: number;
  premium: number;
  coverage: number;
}

async function createPolicy(
  agency: MinTempAgencyInstance,
  policyParameters: PolicyParameters,
) {
  const transaction = await agency.createPolicy(
    policyParameters.latitude,
    policyParameters.longitude,
    policyParameters.startTimestamp,
    policyParameters.expirationTimestamp,
    policyParameters.minTempThreshold,
    policyParameters.coverage,
    { value: policyParameters.premium },
  );
  console.log("Transaction:", transaction.tx, "\n");
}

async function main() {
  const coordinates = await getWeatherStationCoordinates(apiUrl);
  console.log("Coordinates:", coordinates, "\n");

  const policyParameters: PolicyParameters = {
    latitude: coordinates.lat * 10 ** 6,
    longitude: coordinates.lon * 10 ** 6,
    startTimestamp,
    expirationTimestamp,
    minTempThreshold,
    coverage,
    premium,
  };

  console.log("Policy parameters:", policyParameters, "\n");

  const agency: MinTempAgencyInstance = await MinTempAgency.at(agencyAddress);
  console.log("MinTempAgency:", agency.address, "\n");

  await createPolicy(agency, policyParameters);
}

main().then(() => {
  process.exit(0);
});
