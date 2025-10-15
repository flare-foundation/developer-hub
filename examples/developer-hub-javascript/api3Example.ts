import { artifacts, run, web3 } from "hardhat";
import { PriceGuesserInstance } from "../../typechain-types";

// --- Configuration ---
const PriceGuesser: PriceGuesserInstance = artifacts.require("PriceGuesser");
const FTSO_FEED_ID = "0x01464c522f55534400000000000000000000000000";
const DESCRIPTION = "FTSOv2 FLR/USD adapted for API3";
const MAX_AGE_SECONDS = 3600;
const STRIKE_PRICE_USD = 0.025;
const ROUND_DURATION_SECONDS = 300;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function deployContracts(): Promise<{ guesser: PriceGuesserInstance }> {
  const strikePriceWei = BigInt(STRIKE_PRICE_USD * 1e18);
  const guesserArgs: (string | number)[] = [
    FTSO_FEED_ID,
    DESCRIPTION,
    MAX_AGE_SECONDS,
    strikePriceWei.toString(),
    ROUND_DURATION_SECONDS,
  ];
  console.log("\nDeploying integrated PriceGuesser contract with arguments:");
  console.log(`  - FTSO Feed ID: ${guesserArgs[0]}`);
  console.log(`  - Description: ${guesserArgs[1]}`);
  console.log(`  - Max Age (seconds): ${guesserArgs[2]}`);
  console.log(`  - Strike Price: ${STRIKE_PRICE_USD} (${guesserArgs[3]} wei)`);
  console.log(`  - Round Duration: ${guesserArgs[4]} seconds`);
  const guesser = await PriceGuesser.new(
    ...(guesserArgs as [string, string, number, string, number]),
  );
  console.log("\n✅ PriceGuesser deployed to:", guesser.address);

  try {
    console.log("\nVerifying PriceGuesser on block explorer...");
    await run("verify:verify", {
      address: guesser.address,
      constructorArguments: guesserArgs,
    });
    console.log("PriceGuesser verification successful.");
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("PriceGuesser verification failed:", e.message);
    } else {
      console.error("An unknown error occurred during verification:", e);
    }
  }

  return { guesser };
}

async function interactWithMarket(guesser: PriceGuesserInstance) {
  const accounts = await web3.eth.getAccounts();
  const deployer = accounts[0];
  const bettorAbove = accounts.length > 1 ? accounts[1] : deployer;
  const bettorBelow = accounts.length > 2 ? accounts[2] : deployer;
  const betAmountAbove = 10n * 10n ** 18n;
  const betAmountBelow = 20n * 10n ** 18n;

  console.log(`\n--- Simulating Prediction Market ---`);
  console.log(`  - Deployer/Settler: ${deployer}`);
  console.log(`  - Bettor "Above": ${bettorAbove}`);
  console.log(`  - Bettor "Below": ${bettorBelow}`);

  console.log("\nStep 1: Bettors are placing their bets...");
  await guesser.betAbove({
    from: bettorAbove,
    value: betAmountAbove.toString(),
  });
  console.log(
    `  - Bettor "Above" placed ${web3.utils.fromWei(betAmountAbove.toString())} tokens.`,
  );
  await guesser.betBelow({
    from: bettorBelow,
    value: betAmountBelow.toString(),
  });
  console.log(
    `  - Bettor "Below" placed ${web3.utils.fromWei(betAmountBelow.toString())} tokens.`,
  );

  console.log(
    `\nStep 2: Betting round is live. Waiting ${ROUND_DURATION_SECONDS} seconds for it to expire...`,
  );
  await wait(ROUND_DURATION_SECONDS * 1000);
  console.log("  - The betting round has now expired.");

  console.log(
    "\nStep 3: Refreshing the FTSO price on the contract post-expiry...",
  );
  await guesser.refresh({ from: deployer });
  console.log("  - Price has been updated on the PriceGuesser contract.");

  console.log("\nStep 4: Settling the prediction market...");
  const settleTx = await guesser.settle({ from: deployer });
  const settledEvent = settleTx.logs.find((e) => e.event === "MarketSettled");
  const finalPrice = BigInt(settledEvent.args.finalPrice.toString());
  const outcome = Number(settledEvent.args.outcome);
  const finalPriceFormatted = Number(finalPrice / 10n ** 14n) / 10000;
  const outcomeString = outcome === 1 ? "ABOVE" : "BELOW";
  console.log(
    `✅ Market settled! Final Price: ${finalPriceFormatted.toFixed(4)}`,
  );
  console.log(`✅ Outcome: The price was ${outcomeString} the strike price.`);

  console.log("\nStep 5: Distributing winnings...");
  const [winner, loser] =
    outcome === 1 ? [bettorAbove, bettorBelow] : [bettorBelow, bettorAbove];
  const prizePool = outcome === 1 ? betAmountBelow : betAmountAbove;
  const winnerBet = outcome === 1 ? betAmountAbove : betAmountBelow;

  if (prizePool > 0n || winnerBet > 0n) {
    console.log(`  - Attempting to claim for WINNER ("${outcomeString}")`);
    await guesser.claimWinnings({ from: winner });
    const totalWinnings = winnerBet + prizePool;
    console.log(
      `  - WINNER claimed their prize of ${web3.utils.fromWei(totalWinnings.toString())} tokens.`,
    );
  } else {
    console.log("  - WINNER's pool won, but no bets were placed to claim.");
  }

  if (winner !== loser) {
    try {
      await guesser.claimWinnings({ from: loser });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("NothingToClaim")) {
        console.log(
          "  - LOSER correctly failed to claim winnings as expected.",
        );
      } else if (error instanceof Error) {
        console.error(
          "  - An unexpected error occurred for the loser:",
          error.message,
        );
      } else {
        console.error("  - An unknown error occurred for the loser:", error);
      }
    }
  } else {
    console.log(
      "  - Skipping loser claim attempt as winner and loser are the same account.",
    );
  }
}

async function main() {
  console.log("🚀 Starting Prediction Market Management Script 🚀");
  const { guesser } = await deployContracts();
  await interactWithMarket(guesser);
  console.log("\n🎉 Script finished successfully! 🎉");
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
