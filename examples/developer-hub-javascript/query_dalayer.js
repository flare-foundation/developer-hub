import "dotenv/config";

const { DA_API_URL, API_KEY } = process.env;

async function queryDALayer(feedIds, votingRoundId) {
  return await (
    await fetch(
      DA_API_URL +
        `ftso/anchor-feeds-with-proof?voting_round_id=${votingRoundId}`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feed_ids: [feedIds],
        }),
      },
    )
  ).json();
}

queryDALayer("0x014254432f55534400000000000000000000000000", 802550).then(
  (data) => {
    console.log("Data received:", data);
    process.exit(0);
  },
);
