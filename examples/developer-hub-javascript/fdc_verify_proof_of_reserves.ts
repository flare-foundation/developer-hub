import hre from "hardhat";
import { ProofOfReservesInstance, IRelayInstance } from "../../typechain-types";
import {
  prepareAttestationRequestBase,
  getFdcHub,
  getFdcRequestFee,
  getRelay,
  calculateRoundId,
  postRequestToDALayer,
  sleep,
} from "../fdcExample/Base";
import {
  tokenAddresses,
  readerAddresses,
  proofOfReservesAddress,
  transactionHashes,
} from "./config";

const ProofOfReserves = artifacts.require("ProofOfReserves");

const {
  VERIFIER_URL_TESTNET,
  VERIFIER_API_KEY_TESTNET,
  WEB2JSON_VERIFIER_URL_TESTNET,
  COSTON2_DA_LAYER_URL,
} = process.env;

// yarn hardhat run scripts/proofOfReserves/verifyProofOfReserves.ts --network coston2

type AttestationRequest = {
  source: string;
  sourceIdBase: string;
  verifierUrlBase: string;
  verifierApiKey: string;
  urlTypeBase: string;
  data: Record<string, unknown>;
};

const requests: AttestationRequest[] = [
  {
    source: "web2json",
    sourceIdBase: "PublicWeb2",
    verifierUrlBase: WEB2JSON_VERIFIER_URL_TESTNET,
    verifierApiKey: VERIFIER_API_KEY_TESTNET,
    urlTypeBase: "",
    data: {
      apiUrl:
        "https://api.htdigitalassets.com/alm-stablecoin-db/metrics/current_reserves_amount",
      httpMethod: "GET",
      headers: "{}",
      queryParams: "{}",
      body: "{}",
      postProcessJq: `{reserves: .value | gsub(",";"") | sub("\\\\.\\\\d*";"")}`,
      abiSignature: `{"components": [{"internalType": "uint256","name": "reserves","type": "uint256"}],"internalType": "struct DataTransportObject","name": "dto","type": "tuple"}`,
    },
  },
  {
    source: "coston",
    sourceIdBase: "testSGB",
    verifierUrlBase: VERIFIER_URL_TESTNET,
    verifierApiKey: VERIFIER_API_KEY_TESTNET,
    urlTypeBase: "sgb",
    data: {
      transactionHash: transactionHashes.get("coston"),
    },
  },
  {
    source: "coston2",
    sourceIdBase: "testFLR",
    verifierUrlBase: VERIFIER_URL_TESTNET,
    verifierApiKey: VERIFIER_API_KEY_TESTNET,
    urlTypeBase: "flr",
    data: {
      transactionHash: transactionHashes.get("coston2"),
    },
  },
];

async function prepareWeb2JsonAttestationRequest(
  transaction: AttestationRequest,
) {
  const attestationTypeBase = "Web2Json";

  const requestBody = {
    url: transaction.data.apiUrl,
    httpMethod: transaction.data.httpMethod,
    headers: transaction.data.headers,
    queryParams: transaction.data.queryParams,
    body: transaction.data.body,
    postProcessJq: transaction.data.postProcessJq,
    abiSignature: transaction.data.abiSignature,
  };

  const url = `${transaction.verifierUrlBase}Web2Json/prepareRequest`;
  const apiKey = transaction.verifierApiKey;

  return await prepareAttestationRequestBase(
    url,
    apiKey,
    attestationTypeBase,
    transaction.sourceIdBase,
    requestBody,
  );
}

async function prepareTransactionAttestationRequest(
  transaction: AttestationRequest,
) {
  const attestationTypeBase = "EVMTransaction";

  const requiredConfirmations = "1";
  const provideInput = true;
  const listEvents = true;
  const logIndices: string[] = [];

  const requestBody = {
    transactionHash: transaction.data.transactionHash,
    requiredConfirmations: requiredConfirmations,
    provideInput: provideInput,
    listEvents: listEvents,
    logIndices: logIndices,
  };

  const url = `${transaction.verifierUrlBase}verifier/${transaction.urlTypeBase}/EVMTransaction/prepareRequest`;
  const apiKey = transaction.verifierApiKey;

  return await prepareAttestationRequestBase(
    url,
    apiKey,
    attestationTypeBase,
    transaction.sourceIdBase,
    requestBody,
  );
}

async function prepareAttestationRequests(transactions: AttestationRequest[]) {
  console.log("\nPreparing data...\n");
  const data: Map<string, string> = new Map();

  for (const transaction of transactions) {
    console.log(`(${transaction.source})\n`);

    if (transaction.source === "web2json") {
      const responseData = await prepareWeb2JsonAttestationRequest(transaction);
      console.log("Data:", responseData, "\n");
      data.set(transaction.source, responseData.abiEncodedRequest);
    } else {
      const responseData =
        await prepareTransactionAttestationRequest(transaction);
      console.log("Data:", responseData, "\n");
      data.set(transaction.source, responseData.abiEncodedRequest);
    }
  }

  return data;
}

async function submitAttestationRequests(data: Map<string, string>) {
  console.log("\nSubmitting attestation requests...\n");

  const fdcHub = await getFdcHub();
  const roundIds: Map<string, number> = new Map();

  for (const [source, abiEncodedRequest] of data.entries()) {
    console.log(`(${source})\n`);

    const requestFee = await getFdcRequestFee(abiEncodedRequest);
    const transaction = await fdcHub.requestAttestation(abiEncodedRequest, {
      value: requestFee,
    });
    console.log("Submitted request:", transaction.tx, "\n");

    const roundId = await calculateRoundId(transaction);
    console.log(
      `Check round progress at: https://${hre.network.name}-systems-explorer.flare.rocks/voting-epoch/${roundId}?tab=fdc\n`,
    );
    roundIds.set(source, roundId);
  }

  return roundIds;
}

async function retrieveDataAndProofs(
  data: Map<string, string>,
  roundIds: Map<string, number>,
) {
  console.log("\nRetrieving data and proofs...\n");

  const proofs: Map<string, unknown> = new Map();

  const url = `${COSTON2_DA_LAYER_URL}api/v1/fdc/proof-by-request-round-raw`;
  console.log("Url:", url, "\n");
  for (const [source, roundId] of roundIds.entries()) {
    console.log(`(${source})\n`);

    console.log("Waiting for the round to finalize...");
    // We check every 10 seconds if the round is finalized
    const relay: IRelayInstance = await getRelay();
    while (!(await relay.isFinalized(200, roundId))) {
      await sleep(10000);
    }
    console.log("Round finalized!\n");

    const request = {
      votingRoundId: roundId,
      requestBytes: data.get(source),
    };
    console.log("Prepared request:\n", request, "\n");

    let proof = await postRequestToDALayer(url, request, true);
    console.log("Waiting for the DA Layer to generate the proof...");
    while (proof.response_hex == undefined) {
      await sleep(10000);
      proof = await postRequestToDALayer(url, request, false);
    }
    console.log("Proof generated!\n");

    console.log("Proof:", proof, "\n");
    proofs.set(source, proof);
  }
  return proofs;
}

async function prepareDataAndProofs(data: Map<string, unknown>) {
  const IWeb2JsonVerification = await artifacts.require(
    "IWeb2JsonVerification",
  );
  const IEVMTransactionVerification = await artifacts.require(
    "IEVMTransactionVerification",
  );

  const jsonProof = {
    merkleProof: data.get("web2json").proof,
    data: web3.eth.abi.decodeParameter(
      IWeb2JsonVerification._json.abi[0].inputs[0].components[1],
      data.get("web2json").response_hex,
    ),
  };
  const transactionProofs: Array<Record<string, unknown>> = [];
  for (const [source, proof] of data.entries()) {
    if (source !== "web2json") {
      const decodedProof = web3.eth.abi.decodeParameter(
        IEVMTransactionVerification._json.abi[0].inputs[0].components[1],
        proof.response_hex,
      );
      transactionProofs.push({
        merkleProof: proof.proof,
        data: decodedProof,
      });
    }
  }

  return [jsonProof, transactionProofs];
}

async function submitDataAndProofsToProofOfReserves(
  data: Map<string, Record<string, unknown>>,
) {
  const proofOfReserves: ProofOfReservesInstance = await ProofOfReserves.at(
    proofOfReservesAddress,
  );

  for (const source of tokenAddresses.keys()) {
    await proofOfReserves.updateAddress(
      readerAddresses.get(source),
      tokenAddresses.get(source),
    );
  }

  const [jsonProof, transactionProofs] = await prepareDataAndProofs(data);

  const sufficientReserves: boolean = await proofOfReserves.verifyReserves(
    jsonProof,
    transactionProofs,
  );
  return sufficientReserves;
}

async function main() {
  const data = await prepareAttestationRequests(requests);
  const roundIds = await submitAttestationRequests(data);
  const proofs = await retrieveDataAndProofs(data, roundIds);
  const sufficientReserves = await submitDataAndProofsToProofOfReserves(proofs);
  console.log("Sufficient reserves:", sufficientReserves);
}

void main().then(() => {
  process.exit(0);
});
