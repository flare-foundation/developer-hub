// 1. Import the function that gets the AssetManager XRP contract
import { getAssetManagerFXRP } from "../utils/getters";

async function main() {
  // 2. Get the AssetManager contract
  const assetManager = await getAssetManagerFXRP();

  // 3. Get the settings
  const settings = await assetManager.getSettings();

  // 4. Get the max redeemed tickets
  const maxRedeemedTickets = settings.maxRedeemedTickets;

  // 5. Get the lot size
  const lotSizeAMG = settings.lotSizeAMG;

  // 6. Get the redemption queue
  const redemptionQueueResult = await assetManager.redemptionQueue(
    0,
    maxRedeemedTickets,
  );
  const redemptionQueue = redemptionQueueResult._queue;

  // 7. Sum all ticket values in the redemption queue
  const totalValueUBA = redemptionQueue.reduce((sum, ticket) => {
    return sum + BigInt(ticket.ticketValueUBA);
  }, BigInt(0));

  console.log(
    "\nTotal value in redemption queue (UBA):",
    totalValueUBA.toString(),
  );

  // 8. Calculate total lots in the redemption queue
  const totalLots = totalValueUBA / BigInt(lotSizeAMG);
  console.log("\nTotal lots in redemption queue:", totalLots.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
