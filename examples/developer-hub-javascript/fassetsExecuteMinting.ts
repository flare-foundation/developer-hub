import { ethers } from "hardhat";

import {
  IAssetManagerInstance,
  IAssetManagerContract,
} from "../../typechain-types";

// 1. AssetManager address on Songbird Testnet Coston network
const ASSET_MANAGER_ADDRESS = "0x56728e46908fB6FcC5BCD2cc0c0F9BB91C3e4D34";

async function parseExecutemintingEvents(receipt: any) {
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

      if (parsedLog) {
        const collateralReservedEvents = [
          "RedemptionTicketCreated",
          "MintingExecuted",
        ];

        if (collateralReservedEvents.includes(parsedLog.name)) {
          console.log(`\nEvent: ${parsedLog.name}`);
          console.log("Arguments:", parsedLog.args);
        }
      }
    } catch (e) {
      console.log("Error parsing event:", e);
    }
  }
}

async function main() {
  // 2. Specify the collateral reservation ID
  const collateralReservationId = 11025320;

  // 3. Data from FDC Payment example scripts/fdcExample/Payment.ts
  const merkleProof = [
    "0x992077253840bf8d4df7937f475f5d90b70ab3c3d95043155a6f44c7392ecf24",
    "0x203d6451187233ebde0af574b1ed42af96927b64d528deb41e3483d8c0d7b181",
    "0x06167bf952797ebc7b526178edfde3ccf846fe36542b9262a550f23af5d63acd",
    "0x73f922d76253697fcd71c6649fd29daac678c67e4a06039cfd425bb2288e1ea0",
  ];

  const response = {
    attestationType:
      "0x5061796d656e7400000000000000000000000000000000000000000000000000",
    sourceId:
      "0x7465737458525000000000000000000000000000000000000000000000000000",
    votingRound: 980098,
    lowestUsedTimestamp: 2693323601,
    requestBody: {
      transactionId:
        "0xa51db0a7856a8c74a14739fe5ec1507e81b151fd26e677d6e9ca076c09b2365c",
      inUtxo: "0",
      utxo: "0",
    },
    responseBody: {
      blockNumber: "7121783",
      blockTimestamp: "1746638801",
      sourceAddressHash:
        "0x0f2dac8dcd85fba13e76bb89eeb2e1099184c2f1e2582a12e3ed5beca1993df4",
      sourceAddressesRoot:
        "0x66e27dc2250e5f3d0a64af0d6657e3d971c5300c1b4b7ae410b9c4fe09007be0",
      receivingAddressHash:
        "0x3ed5711322ac905de71f00c4b3759dc03fdcee936ff711f463075fe27da87af1",
      intendedReceivingAddressHash:
        "0x3ed5711322ac905de71f00c4b3759dc03fdcee936ff711f463075fe27da87af1",
      spentAmount: "22000012",
      intendedSpentAmount: "22000012",
      receivedAmount: "22000000",
      intendedReceivedAmount: "22000000",
      standardPaymentReference:
        "0x4642505266410001000000000000000000000000000000000000000000a83ba8",
      oneToOne: true,
      status: "0",
    },
  };

  const proof = {
    merkleProof,
    data: response,
  };

  console.log("Executing minting with proof:", JSON.stringify(proof, null, 2));
  console.log("Collateral reservation ID:", collateralReservationId);

  // FAssets FXRP asset manager on Songbird Testnet Coston network
  const AssetManager = artifacts.require("IAssetManager");
  const assetManager: IAssetManagerInstance = await AssetManager.at(
    ASSET_MANAGER_ADDRESS,
  );

  // 4. Execute minting
  const tx = await assetManager.executeMinting(proof, collateralReservationId);
  console.log("Transaction successful:", tx);

  // 5. Parse execute minting log events
  await parseExecutemintingEvents(tx.receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
