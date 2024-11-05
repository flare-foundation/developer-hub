async function getDataProviderData(feedId, voting_round_id) {
  return await (
    await fetch(
      DATA_PROVIDER_URL + `specific-feed/${feedIds}/${voting_round_id}`,
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
  const feedConsumer = await FtsoV2FeedConsumerDA.new();

  const data = await getDataProviderData(BTC_USD_FEED_ID, TARGET_VOTING_ROUND);

  await feedConsumer.savePrice(data.feedWithProof);

  const savedPrice = await feedConsumer.provenFeeds.call(
    TARGET_VOTING_ROUND,
    BTC_USD_FEED_ID,
  );
  const nicePrice = savedPrice.value * Math.pow(10, -savedPrice.decimals);
  console.log(
    `Saved price: ${nicePrice}$ at voting round: ${savedPrice.votingRoundId.toString()}`,
  );
}

main();
