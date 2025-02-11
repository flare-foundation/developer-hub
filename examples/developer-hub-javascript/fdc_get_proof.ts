const DA_LAYER_URL = "DA_LAYER_URL";
const TARGET_ROUND_ID = 123; // The round id we want to get the proof for (the one we calculated when we submitted the request)

async function getProof(roundId: number) {
  const request = await prepareRequest();
  const proofAndData = await fetch(
    `${DA_LAYER_URL}api/v0/fdc/get-proof-round-id-bytes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
      body: JSON.stringify({
        votingRoundId: roundId,
        requestBytes: request.abiEncodedRequest,
      }),
    },
  );
  return await proofAndData.json();
}

getProof(TARGET_ROUND_ID)
  .then((data) => {
    console.log("Proof and data:");
    console.log(JSON.stringify(data, undefined, 2));
  })
  .catch((e) => {
    console.error(e);
  });
