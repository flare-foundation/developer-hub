# THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
import asyncio

import aiohttp

BASE_URL = "https://flr-data-availability.flare.network/"
API_KEY = "<your-api-key>"
FEED_IDS = [
    "0x01464c522f55534400000000000000000000000000",  # FLR/USD
    "0x014254432f55534400000000000000000000000000",  # BTC/USD
    "0x014554482f55534400000000000000000000000000",  # ETH/USD
]


async def fetch_anchor_feeds(
    feed_ids: list[str], voting_round_id: int | None = None
) -> list[dict]:
    url = f"{BASE_URL}api/v0/ftso/anchor-feeds-with-proof"
    if voting_round_id:
        url += f"?voting_round_id={voting_round_id}"

    async with (
        aiohttp.ClientSession() as session,
        session.post(
            url,
            headers={
                "X-API-KEY": API_KEY,
                "Content-Type": "application/json",
            },
            json={"feed_ids": feed_ids},
        ) as response,
    ):
        return await response.json()


async def main() -> None:
    data = await fetch_anchor_feeds(FEED_IDS)
    print("Anchor feeds data:", data)


asyncio.run(main())
