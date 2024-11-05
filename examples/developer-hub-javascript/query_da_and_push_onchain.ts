import "dotenv/config";
import { artifacts } from "hardhat";
import { FtsoV2FeedConsumerDAContract } from "../typechain-types";
const FtsoV2FeedConsumerDA: FtsoV2FeedConsumerDAContract = artifacts.require(
  "FtsoV2FeedConsumerDA",
);

const { DA_API_URL, API_KEY } = process.env;

const BTC_USD_FEED_ID = "0x014254432f55534400000000000000000000000000";
const TARGET_VOTING_ROUND = 802550;

async function getDALayerData(feedIds: string, voting_round_id: number) {
  return await (
    await fetch(
      DA_API_URL +
        `ftso/anchor-feeds-with-proof?voting_round_id=${voting_round_id}`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": API_KEY as string,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feed_ids: [feedIds],
        }),
      },
    )
  ).json();
}

async function main() {
  const feedConsumer = await FtsoV2FeedConsumerDA.new();

  const data = await getDALayerData(BTC_USD_FEED_ID, TARGET_VOTING_ROUND);

  await feedConsumer.savePrice({
    proof: data[0].proof,
    body: data[0].data,
  });

  const savedPrice = await feedConsumer.provenFeeds.call(
    TARGET_VOTING_ROUND,
    BTC_USD_FEED_ID,
  );
  const nicePrice = savedPrice.value * Math.pow(10, -savedPrice.decimals);
  console.log(
    `Saved price: ${nicePrice}$ at voting round: ${savedPrice.votingRoundId.toString()}`,
  );
}

main().then(() => process.exit(0));
