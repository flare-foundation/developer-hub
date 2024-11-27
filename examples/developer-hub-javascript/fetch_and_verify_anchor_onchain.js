// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
import { artifacts } from "hardhat";
import { fetchAnchorFeeds } from "./fetch_anchor_feeds";

const FtsoV2AnchorFeedConsumer = artifacts.require(
  "FtsoV2AnchorFeedConsumer.sol",
);

// Feed IDs, see https://dev.flare.network/ftso/scaling/anchor-feeds for full list
const BTC_USD_FEED_ID = "0x014254432f55534400000000000000000000000000";
const TARGET_VOTING_ROUND = 823402;

async function main() {
  // Deploy FtsoV2AnchorFeedConsumer contract
  const feedConsumer = await FtsoV2AnchorFeedConsumer.new();

  // Fetch price from DA Layer
  const feedData = await fetchAnchorFeeds(
    [BTC_USD_FEED_ID],
    TARGET_VOTING_ROUND,
  );

  // Save fetched price to contract
  await feedConsumer.savePrice({
    proof: feedData[0].proof,
    body: feedData[0].data,
  });

  // Query saved price from contract
  const savedPrice = await feedConsumer.provenFeeds.call(
    TARGET_VOTING_ROUND,
    BTC_USD_FEED_ID,
  );
  const formattedPrice = savedPrice.value * Math.pow(10, -savedPrice.decimals);
  console.log(
    `Saved price: ${formattedPrice} USD at voting round: ${savedPrice.votingRoundId.toString()}`,
  );
}

main();
