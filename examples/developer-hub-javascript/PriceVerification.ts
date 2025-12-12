import { artifacts, web3, run } from "hardhat";
import type {
  PriceVerifierCustomFeedInstance,
  IRelayInstance,
} from "../../typechain-types";
import {
  prepareAttestationRequestBase,
  getFdcHub,
  getFdcRequestFee,
  calculateRoundId,
  toUtf8HexString,
  getRelay,
  postRequestToDALayer,
  sleep,
} from "../fdcExample/Base";

const PriceVerifierCustomFeed = artifacts.require("PriceVerifierCustomFeed");

const {
  WEB2JSON_VERIFIER_URL_TESTNET,
  VERIFIER_API_KEY_TESTNET,
  COSTON2_DA_LAYER_URL,
} = process.env;

type AttestationRequest = {
  source: string;
  sourceIdBase: string;
  verifierUrlBase: string;
  verifierApiKey: string;
  urlTypeBase: string;
  data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

const priceSymbol = "BTC";
const priceDecimals = 2;
const coinGeckoIds: { [key: string]: string } = {
  BTC: "bitcoin",
  ETH: "ethereum",
};

// --- CoinGecko BTC Price Request Data ---
const symbolForRequest = priceSymbol;
const decimalsForRequest = priceDecimals;
const coinGeckoId = coinGeckoIds[symbolForRequest];
if (!coinGeckoId)
  throw new Error(`CoinGecko ID not found for symbol: ${symbolForRequest}`);
const dateToFetch = new Date();
dateToFetch.setDate(dateToFetch.getDate() - 2);
const day = String(dateToFetch.getDate()).padStart(2, "0");
const month = String(dateToFetch.getMonth() + 1).padStart(2, "0");
const year = dateToFetch.getFullYear();
const dateString = `${day}-${month}-${year}`;
const fullApiUrl = `https://api.coingecko.com/api/v3/coins/${coinGeckoId}/history`;
const postprocessJq = `{price: (.market_data.current_price.usd * ${10 ** decimalsForRequest} | floor)}`;
const abiSig = `{"components": [{"internalType": "uint256","name": "price","type": "uint256"}],"internalType": "struct PriceData","name": "priceData","type": "tuple"}`;
const stringifiedQueryParams = JSON.stringify({
  date: dateString,
  localization: "false",
});

const requests: AttestationRequest[] = [
  {
    source: "web2json",
    sourceIdBase: "PublicWeb2",
    verifierUrlBase: WEB2JSON_VERIFIER_URL_TESTNET!,
    verifierApiKey: VERIFIER_API_KEY_TESTNET!,
    urlTypeBase: "",
    data: {
      apiUrl: fullApiUrl,
      httpMethod: "GET",
      headers: "{}",
      queryParams: stringifiedQueryParams,
      body: "",
      postProcessJq: postprocessJq,
      abiSignature: abiSig,
      logDisplayUrl: fullApiUrl,
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

async function prepareAttestationRequests(transactions: AttestationRequest[]) {
  console.log("\nPreparing data...\n");
  const data: Map<string, string> = new Map();
  for (const transaction of transactions) {
    console.log(`(${transaction.source})\n`);
    const responseData = await prepareWeb2JsonAttestationRequest(transaction);
    console.log("Data:", responseData, "\n");
    data.set(transaction.source, responseData.abiEncodedRequest);
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
      `Check round progress at: https://${hre.network.name}-systems-explorer.flare.rocks/voting-round/${roundId}?tab=fdc\n`,
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
  const proofs: Map<string, any> = new Map(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const url = `${COSTON2_DA_LAYER_URL}api/v1/fdc/proof-by-request-round-raw`;
  console.log("Url:", url, "\n");
  for (const [source, roundId] of roundIds.entries()) {
    console.log(`(${source})\n`);
    console.log("Waiting for the round to finalize...");
    const relay: IRelayInstance = await getRelay();
    const protocolId = 200;
    console.log("Protocol ID:", protocolId);
    while (!(await relay.isFinalized(protocolId, roundId))) {
      await sleep(10000);
    }
    console.log("Round finalized!\n");
    const request = { votingRoundId: roundId, requestBytes: data.get(source) };
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

async function retrieveDataAndProofsWithRetry(
  data: Map<string, string>,
  roundIds: Map<string, number>,
  attempts: number = 10,
) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await retrieveDataAndProofs(data, roundIds);
    } catch (error) {
      console.log(
        "Error:",
        error,
        "\n",
        "Remaining attempts:",
        attempts - i,
        "\n",
      );
      await sleep(20000);
    }
  }
  throw new Error(
    `Failed to retrieve data and proofs after ${attempts} attempts`,
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function prepareDataAndProofs(data: Map<string, any>) {
  const IWeb2JsonVerification = await artifacts.require(
    "IWeb2JsonVerification",
  );
  const proof = data.get("web2json");
  console.log(IWeb2JsonVerification._json.abi[0].inputs[0].components);
  return {
    merkleProof: proof.merkleProof,
    data: web3.eth.abi.decodeParameter(
      IWeb2JsonVerification._json.abi[0].inputs[0].components[1],
      proof.data || proof.response_hex,
    ),
  };
}

async function deployAndVerifyContract(): Promise<PriceVerifierCustomFeedInstance> {
  const feedIdString = `${priceSymbol}/USD-HIST`;
  const feedIdHex = toUtf8HexString(feedIdString).substring(2);
  const truncatedFeedIdHex = feedIdHex.substring(0, 40);
  const finalFeedIdHex = `0x21${truncatedFeedIdHex}`;
  if (finalFeedIdHex.length !== 44) {
    throw new Error(
      `Generated feed ID has incorrect length: ${finalFeedIdHex.length}. Expected 44 characters (0x + 42 hex). Feed string: ${feedIdString}`,
    );
  }
  const customFeedArgs: any[] = [finalFeedIdHex, priceSymbol, priceDecimals]; // eslint-disable-line @typescript-eslint/no-explicit-any
  const customFeed: PriceVerifierCustomFeedInstance =
    await PriceVerifierCustomFeed.new(...customFeedArgs);
  console.log(`PriceVerifierCustomFeed deployed to: ${customFeed.address}\n`);
  console.log(
    "Waiting 10 seconds before attempting verification on explorer...",
  );
  await sleep(10000);

  try {
    await run("verify:verify", {
      address: customFeed.address,
      constructorArguments: customFeedArgs,
      contract:
        "contracts/customFeeds/PriceVerifierCustomFeed.sol:PriceVerifierCustomFeed",
    });
    console.log("Contract verification successful.\n");
  } catch (error) {
    console.log("Contract verification failed:", error);
  }
  return customFeed;
}

async function submitDataAndProofsToCustomFeed(
  customFeed: PriceVerifierCustomFeedInstance,
  proof: any, // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  console.log("Proof from submitDataAndProofsToCustomFeed:", proof);
  const tx = await customFeed.verifyPrice(proof);
  console.log(
    `Proof for ${priceSymbol}Price submitted successfully. Transaction hash:`,
    tx.transactionHash,
  );
}

async function getLatestVerifiedPrice(
  customFeed: PriceVerifierCustomFeedInstance,
) {
  console.log("\nRetrieving latest verified price from the contract...");
  const { _value, _decimals } = await customFeed.getFeedDataView();
  const formattedPrice = Number(_value) / 10 ** Number(_decimals);
  console.log(
    `Latest verified price for ${priceSymbol}/USD: ${formattedPrice} (raw value: ${_value.toString()}, decimals: ${_decimals})`,
  );
  return formattedPrice;
}

async function main() {
  if (
    !WEB2JSON_VERIFIER_URL_TESTNET ||
    !VERIFIER_API_KEY_TESTNET ||
    !COSTON2_DA_LAYER_URL
  ) {
    throw new Error(
      "Missing one or more required environment variables: WEB2JSON_VERIFIER_URL_TESTNET, VERIFIER_API_KEY_TESTNET, COSTON2_DA_LAYER_URL",
    );
  }
  const customFeed = await deployAndVerifyContract();
  const data = await prepareAttestationRequests(requests);
  const roundIds = await submitAttestationRequests(data);
  const proofs = await retrieveDataAndProofsWithRetry(data, roundIds);
  const decodedData = await prepareDataAndProofs(proofs);
  const proof = {
    merkleProof: proofs.get("web2json").proof,
    data: decodedData.data,
  };
  await submitDataAndProofsToCustomFeed(customFeed, proof);
  await getLatestVerifiedPrice(customFeed);
  console.log("Price verification process completed successfully.");
}

void main().then(() => {
  process.exit(0);
});
