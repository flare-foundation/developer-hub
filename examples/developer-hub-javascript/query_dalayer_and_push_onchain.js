import "dotenv/config";
import { artifacts } from "hardhat";
import { queryDALayer } from "./query_dalayer";

const FTSOV2FeedConsumerScaling = artifacts.require(
  "FTSOV2FeedConsumerScaling.sol",
);

const BTC_USD_FEED_ID = "0x014254432f55534400000000000000000000000000";
const TARGET_VOTING_ROUND = 802550;

async function main() {
  const feedConsumer = await FTSOV2FeedConsumerScaling.new();

  const data = await queryDALayer(BTC_USD_FEED_ID, TARGET_VOTING_ROUND);

  await feedConsumer.savePrice({
    proof: data[0].proof,
    body: data[0].data,
  });

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
