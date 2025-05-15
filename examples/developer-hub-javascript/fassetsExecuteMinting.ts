import { artifacts, ethers } from "hardhat";

import { prepareAttestationRequestBase } from "../fdcExample/Base";
import {
  IAssetManagerInstance,
  IAssetManagerContract,
} from "../../typechain-types";

// 1. Environment variables
const { COSTON_DA_LAYER_URL, VERIFIER_URL_TESTNET, VERIFIER_API_KEY_TESTNET } =
  process.env;

// 2. AssetManager address on Songbird Testnet Coston network
const ASSET_MANAGER_ADDRESS = "0x56728e46908fB6FcC5BCD2cc0c0F9BB91C3e4D34";

// 3. Collateral reservation ID
const COLLATERAL_RESERVATION_ID = 18615047;

// 4. Data to get the proof for
const TARGET_ROUND_ID = 987510;

const attestationTypeBase = "Payment";
const sourceIdBase = "testXRP";
const verifierUrlBase = VERIFIER_URL_TESTNET;
const urlTypeBase = "xrp";

// XRP transaction
const transactionId =
  "65520665BB83D582E01D6813DA8B5ECB041F613F9891F9BE90EE2668AAC30543";
const inUtxo = "0";
const utxo = "0";

// 5. Prepare FDC request
async function prepareFdcRequest(
  transactionId: string,
  inUtxo: string,
  utxo: string,
) {
  const requestBody = {
    transactionId: transactionId,
    inUtxo: inUtxo,
    utxo: utxo,
  };

  const url = `${verifierUrlBase}verifier/${urlTypeBase}/Payment/prepareRequest`;

  return await prepareAttestationRequestBase(
    url,
    VERIFIER_API_KEY_TESTNET,
    attestationTypeBase,
    sourceIdBase,
    requestBody,
  );
}

// 6. Get proof from FDC
async function getProof(roundId: number) {
  const request = await prepareFdcRequest(transactionId, inUtxo, utxo);
  const proofAndData = await fetch(
    `${COSTON_DA_LAYER_URL}api/v0/fdc/get-proof-round-id-bytes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": VERIFIER_API_KEY_TESTNET,
      },
      body: JSON.stringify({
        votingRoundId: roundId,
        requestBytes: request.abiEncodedRequest,
      }),
    },
  );

  return await proofAndData.json();
}

async function parseEvents(receipt) {
  console.log("\nParsing events...", receipt.rawLogs);

  const assetManager = (await ethers.getContractAt(
    "IAssetManager",
    ASSET_MANAGER_ADDRESS,
  )) as IAssetManagerContract;

  for (const log of receipt.rawLogs) {
    try {
      const parsedLog = assetManager.interface.parseLog({
        topics: log.topics,
        data: log.data,
      });

      if (!parsedLog) continue;

      const collateralReservedEvents = [
        "RedemptionTicketCreated",
        "MintingExecuted",
      ];
      if (!collateralReservedEvents.includes(parsedLog.name)) continue;

      console.log(`\nEvent: ${parsedLog.name}`);
      console.log("Arguments:", parsedLog.args);
    } catch (e) {
      console.log("Error parsing event:", e);
    }
  }
}

async function main() {
  // 7. Get proof from FDC
  const proof = await getProof(TARGET_ROUND_ID);

  // FAssets FXRP asset manager on Songbird Testnet Coston network
  const AssetManager = artifacts.require("IAssetManager");
  const assetManager: IAssetManagerInstance = await AssetManager.at(
    ASSET_MANAGER_ADDRESS,
  );

  // 8. Execute minting with the proof
  const tx = await assetManager.executeMinting(
    {
      merkleProof: proof.proof,
      data: proof.response,
    },
    COLLATERAL_RESERVATION_ID,
  );
  console.log("Transaction successful:", tx);

  // 9. Parse execute minting log events
  await parseEvents(tx.receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
