import { getAssetManagerFXRP } from "../utils/fassets";
import { IAssetManagerInstance } from "../../typechain-types";
import { logEvents } from "../../scripts/utils/core";

// 1. Define constants

// Number of lots to reserve
const LOTS_TO_MINT = 1;

// Executor address
const EXECUTOR_ADDRESS = "0xb292348a4Cb9f5F008589B3596405FBba6986c55";

// 2. Get the AssetManager artifact
const AssetManager = artifacts.require("IAssetManager");

// 3. Function to find the best agent with enough free collateral lots

// Function from FAssets Bot repository
// https://github.com/flare-foundation/fasset-bots/blob/main/packages/fasset-bots-core/src/commands/InfoBotCommands.ts#L83
async function findBestAgent(
  assetManager: IAssetManagerInstance,
  minAvailableLots = 1,
) {
  // get max 100 agents
  const agents = (await assetManager.getAvailableAgentsDetailedList(0, 100))
    ._agents;

  // filter agents with enough free collateral lots
  let agentsWithLots = agents.filter(
    (agent) => agent.freeCollateralLots > minAvailableLots,
  );

  if (agentsWithLots.length === 0) {
    return undefined;
  }

  // sort by lowest fee
  agentsWithLots.sort((a, b) => a.feeBIPS - b.feeBIPS);

  while (agentsWithLots.length > 0) {
    const lowestFee = agentsWithLots[0].feeBIPS;

    // get all agents with the lowest fee
    let optimal = agentsWithLots.filter((a) => a.feeBIPS == lowestFee);

    while (optimal.length > 0) {
      // const agentVault = (requireNotNull(randomChoice(optimal)) as any).agentVault;  // list must be nonempty

      // get a random agent from the list
      const agentVault =
        optimal[Math.floor(Math.random() * optimal.length)].agentVault;
      // const agentVault = (randomChoice(optimal) as any).agentVault;

      const info = await assetManager.getAgentInfo(agentVault);
      // 0 = NORMAL
      if (Number(info.status) === 0) {
        return agentVault;
      }
      // If not found remote this agent and do another round
      optimal = optimal.filter((a) => a.agentVault !== agentVault);
      agentsWithLots = agentsWithLots.filter(
        (a) => a.agentVault !== agentVault,
      );
    }
  }
}

// 4. Function to parse the CollateralReserved event
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function parseCollateralReservedEvent(transactionReceipt: any) {
  console.log("\nParsing events...", transactionReceipt.rawLogs);

  // The logEvents function is included in the Flare starter kit
  const collateralReservedEvents = logEvents(
    transactionReceipt.rawLogs,
    "CollateralReserved",
    AssetManager.abi,
  );

  return collateralReservedEvents[0].decoded;
}

// 5. Main function
async function main() {
  // 6. Get the AssetManager contract from the Flare Contract Registry
  const assetManager: IAssetManagerInstance = await getAssetManagerFXRP();

  // 7. Find the best agent with enough free collateral lots
  const agentVaultAddress = await findBestAgent(assetManager, LOTS_TO_MINT);
  if (!agentVaultAddress) {
    throw new Error("No suitable agent found with enough free collateral lots");
  }
  console.log(agentVaultAddress);

  // 8. Get the agent info
  const agentInfo = await assetManager.getAgentInfo(agentVaultAddress);
  console.log("Agent info:", agentInfo);

  // 9. Get the collateral reservation fee according to the number of lots to reserve
  // https://dev.flare.network/fassets/minting/#collateral-reservation-fee
  const collateralReservationFee =
    await assetManager.collateralReservationFee(LOTS_TO_MINT);
  console.log(
    "Collateral reservation fee:",
    collateralReservationFee.toString(),
  );

  // 10. To make this example simpler we're using the same fee for the executor and the agent
  const executorFee = collateralReservationFee;
  const totalFee = collateralReservationFee.add(executorFee);

  console.log("Total reservation fee:", totalFee.toString());

  console.log("agentVaultAddress", agentVaultAddress);
  console.log("LOTS_TO_MINT", LOTS_TO_MINT);
  console.log("agentInfo.feeBIPS", agentInfo.feeBIPS);
  console.log("EXECUTOR_ADDRESS", EXECUTOR_ADDRESS);

  console.log("collateralReservationFee", collateralReservationFee);

  // 11. Reserve collateral
  // https://dev.flare.network/fassets/reference/IAssetManager#reservecollateral
  const tx = await assetManager.reserveCollateral(
    agentVaultAddress,
    LOTS_TO_MINT,
    agentInfo.feeBIPS,
    // Not using the executor
    EXECUTOR_ADDRESS,
    // Sending the collateral reservation fee as native tokens
    { value: totalFee },
  );

  console.log("Collateral reservation successful:", tx);

  // 112 Get the asset decimals
  const decimals = await assetManager.assetMintingDecimals();

  // 13. Parse the CollateralReserved event
  const collateralReservedEvent = await parseCollateralReservedEvent(
    tx.receipt,
  );

  // 14. Get the collateral reservation info
  const collateralReservationInfo =
    await assetManager.collateralReservationInfo(
      collateralReservedEvent.collateralReservationId,
    );
  console.log("Collateral reservation info:", collateralReservationInfo);

  // 14. Calculate the total XRP value required for payment
  const valueUBA = BigInt(collateralReservedEvent.valueUBA.toString());
  const feeUBA = BigInt(collateralReservedEvent.feeUBA.toString());
  const totalUBA = valueUBA + feeUBA;
  const totalXRP = Number(totalUBA) / 10 ** decimals;
  console.log(`You need to pay ${totalXRP} XRP`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
