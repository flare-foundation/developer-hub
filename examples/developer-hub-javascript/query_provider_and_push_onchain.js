import "dotenv/config";
import { artifacts } from "hardhat";

const FTSOV2FeedConsumerScaling = artifacts.require(
  "FTSOV2FeedConsumerScaling.sol",
);

const { DATA_PROVIDER_URL, API_KEY } = process.env;

const BTC_USD_FEED_ID = "0x014254432f55534400000000000000000000000000";
const TARGET_VOTING_ROUND = 802550;

async function queryDataProvider(feedId, votingRoundId) {
  return await (
    await fetch(
      DATA_PROVIDER_URL + `specific-feed/${feedId}/${votingRoundId}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": API_KEY,
          "Content-Type": "application/json",
        },
      },
    )
  ).json();
}

async function main() {
  const feedConsumer = await FTSOV2FeedConsumerScaling.new();

  const data = await queryDataProvider(BTC_USD_FEED_ID, TARGET_VOTING_ROUND);

  await feedConsumer.savePrice(data.feedWithProof);

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
