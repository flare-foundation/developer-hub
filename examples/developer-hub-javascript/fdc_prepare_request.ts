// Simple hex encoding
function toHex(data) {
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += data.charCodeAt(i).toString(16);
  }
  return result.padEnd(64, "0");
}

const VERIFIER_BASE_URL = "https://fdc-verifiers-testnet.flare.network/";
const VERIFIER_API_KEY = "XXX"; // Your API key

const TX_ID =
  "0x4e636c6590b22d8dcdade7ee3b5ae5572f42edb1878f09b3034b2f7c3362ef3c";

async function prepareRequest() {
  const attestationType = "0x" + toHex("EVMTransaction");
  const sourceType = "0x" + toHex("testETH");
  const requestData = {
    attestationType: attestationType,
    sourceId: sourceType,
    requestBody: {
      transactionHash: TX_ID,
      requiredConfirmations: "1",
      provideInput: true,
      listEvents: true,
      logIndices: [],
    },
  };
  const response = await fetch(
    `${VERIFIER_BASE_URL}verifier/eth/EVMTransaction/prepareRequest`,
    {
      method: "POST",
      headers: {
        "X-API-KEY": VERIFIER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    },
  );
  const data = await response.json();
  console.log("Prepared request:", data);
  return data;
}

prepareRequest().then((data) => {
  console.log("Prepared request:", data);
  process.exit(0);
});
