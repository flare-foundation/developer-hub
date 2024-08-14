from pathlib import Path

from pycoingecko import CoinGeckoAPI

feed_ids = [
    {"category": 1, "name": "FLR/USD"},
    {"category": 1, "name": "SGB/USD"},
    {"category": 1, "name": "BTC/USD"},
    {"category": 1, "name": "XRP/USD"},
    {"category": 1, "name": "LTC/USD"},
    {"category": 1, "name": "XLM/USD"},
    {"category": 1, "name": "DOGE/USD"},
    {"category": 1, "name": "ADA/USD"},
    {"category": 1, "name": "ALGO/USD"},
    {"category": 1, "name": "ETH/USD"},
    {"category": 1, "name": "FIL/USD"},
    {"category": 1, "name": "ARB/USD"},
    {"category": 1, "name": "AVAX/USD"},
    {"category": 1, "name": "BNB/USD"},
    {"category": 1, "name": "MATIC/USD"},
    {"category": 1, "name": "SOL/USD"},
    {"category": 1, "name": "USDC/USD"},
    {"category": 1, "name": "USDT/USD"},
    {"category": 1, "name": "XDC/USD"},
    {"category": 1, "name": "TRX/USD"},
    {"category": 1, "name": "LINK/USD"},
    {"category": 1, "name": "ATOM/USD"},
    {"category": 1, "name": "DOT/USD"},
    {"category": 1, "name": "TON/USD"},
    {"category": 1, "name": "ICP/USD"},
    {"category": 1, "name": "SHIB/USD"},
    {"category": 1, "name": "DAI/USD"},
    {"category": 1, "name": "BCH/USD"},
    {"category": 1, "name": "NEAR/USD"},
    {"category": 1, "name": "LEO/USD"},
    {"category": 1, "name": "UNI/USD"},
    {"category": 1, "name": "ETC/USD"},
    {"category": 1, "name": "WIF/USD"},
    {"category": 1, "name": "BONK/USD"},
    {"category": 1, "name": "JUP/USD"},
    {"category": 1, "name": "ETHFI/USD"},
    {"category": 1, "name": "ENA/USD"},
    {"category": 1, "name": "PYTH/USD"},
]
CURRENT_FEEDS = [feed["name"].split("/")[0] for feed in feed_ids]

header = """---
title: "[auto_req]: Potential New Feeds"
assignees: dineshpinto
labels: "enhancement"
---
"""


def format_dict_to_str(coin_item: dict) -> str:
    newdict = {
        "name": coin_item["name"],
        "symbol": coin_item["symbol"],
        "coingecko_id": coin_item["id"],
        "price_change_percentage_24h": coin_item["data"]["price_change_percentage_24h"][
            "usd"
        ],
        "total_volume": coin_item["data"]["total_volume"],
        "coingecko_link": f"https://www.coingecko.com/en/coins/{coin_item["id"]}",
        "description": coin_item["data"]["content"]["description"]
        if coin_item["data"]["content"]
        else "",
    }
    return "\n".join(f"{k}: {v}" for k, v in newdict.items())


if __name__ == "__main__":
    MAX_MARKET_CAP_RANK = 100

    cg = CoinGeckoAPI()
    trending = cg.get_search_trending()

    with Path.open("issues.md", "w") as f:
        f.write(header)
        selected_coin_data = []
        f.write("Coins matching criteria:" + "\n\n")
        for coin in trending["coins"]:
            if (
                coin["item"]["market_cap_rank"] < MAX_MARKET_CAP_RANK
                and coin["item"]["symbol"] not in CURRENT_FEEDS
            ):
                item_data = coin["item"]
                selected_coin_data.append(coin["item"])
                f.write(f"## {coin["item"]["name"]}" + "\n")
                f.write(format_dict_to_str(coin["item"]))
                f.write("\n\n")
