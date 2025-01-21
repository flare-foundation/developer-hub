// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
const BASE_URL = "https://flr-data-availability.flare.network/";
const API_KEY = "<your-api-key>";
// Feed IDs, see https://dev.flare.network/ftso/scaling/anchor-feeds for full list
const FEED_IDS = [
  "0x01464c522f55534400000000000000000000000000", // FLR/USD
  "0x014254432f55534400000000000000000000000000", // BTC/USD
  "0x014554482f55534400000000000000000000000000", // ETH/USD
];

async function fetchAnchorFeeds(feedIds, votingRoundId = null) {
  const url = votingRoundId
    ? `${BASE_URL}api/v0/ftso/anchor-feeds-with-proof?voting_round_id=${votingRoundId}`
    : `${BASE_URL}api/v0/ftso/anchor-feeds-with-proof`;

  return await (
    await fetch(url, {
      method: "POST",
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feed_ids: feedIds,
      }),
    })
  ).json();
}

fetchAnchorFeeds(FEED_IDS).then((data) => {
  console.log("Anchor feeds data:", data);
});
