import { ethers } from "hardhat";

const EVENT_COLLECTOR_ABI = "...";
const EVENT_COLLECTOR_ADDRESS = "...";

async function submitProof() {
  const dataAndProof = await getProof(TARGET_ROUND_ID);
  const transferEventListener = await ethers.getContractAt(
    EVENT_COLLECTOR_ABI,
    EVENT_COLLECTOR_ADDRESS,
  );

  const tx = await transferEventListener.collectTransferEvents({
    merkleProof: dataAndProof.proof,
    data: dataAndProof.response,
  });
  console.log(tx.hash);
  console.log(await transferEventListener.getTokenTransfers());
}

submitProof()
  .then(() => {
    console.log("Submitted proof");
  })
  .catch((e) => {
    console.error(e);
  });
