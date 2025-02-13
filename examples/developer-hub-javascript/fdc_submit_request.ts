import { ethers } from "hardhat";

// In production get the data directly from FlareSystemsManager
const firstVotingRoundStartTs = 1658429955;
const votingEpochDurationSeconds = 90;

// Valid only on coston. In production get the address from the ContractRegistry
const FDC_HUB_ADDRESS = "0x1c78A073E3BD2aCa4cc327d55FB0cD4f0549B55b";

async function submitRequest() {
  const requestData = await prepareRequest();

  const fdcHub = await ethers.getContractAt(
    [
      {
        inputs: [
          {
            internalType: "bytes",
            name: "_data",
            type: "bytes",
          },
        ],
        name: "requestAttestation",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    FDC_HUB_ADDRESS,
  );

  // Call to the FDC Hub protocol to provide attestation.
  const tx = await fdcHub.requestAttestation(requestData.abiEncodedRequest, {
    value: ethers.parseEther("1"),
  });
  const receipt = await tx.wait();

  // Get block number of the block containing contract call
  const blockNumber = receipt.blockNumber;
  const block = await ethers.provider.getBlock(blockNumber);

  // Calculate roundId
  const roundId = Math.floor(
    (block!.timestamp - firstVotingRoundStartTs) / votingEpochDurationSeconds,
  );
  console.log(
    `Check round progress at: https://coston-systems-explorer.flare.rocks/voting-epoch/${roundId}?tab=fdc`,
  );
  return roundId;
}

submitRequest();
