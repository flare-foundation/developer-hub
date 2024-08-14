from pathlib import Path

from pycoingecko import CoinGeckoAPI

CURRENT_FEEDS = [
    "FLR",
    "SGB",
    "BTC",
    "XRP",
    "LTC",
    "XLM",
    "DOGE",
    "ADA",
    "ALGO",
    "ETH",
    "FIL",
    "ARB",
    "AVAX",
    "BNB",
    "MATIC",
    "SOL",
    "USDC",
    "USDT",
    "XDC",
]

header = """---
title: New Feed Request
assignees: dineshpinto
labels: "enhancement"
title: "[auto_req]: New Feed"
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
        "thumbnail": coin_item["thumb"],
        "description": coin_item["data"]["content"]["description"]
        if coin_item["data"]["content"]
        else "",
        "total_volume": coin_item["data"]["total_volume"],
    }
    return "\n".join(f"{k}: {v}" for k, v in newdict.items())


if __name__ == "__main__":
    MAX_MARKET_CAP_RANK = 100

    cg = CoinGeckoAPI()
    trending = cg.get_search_trending()

    with Path.open("issues.md", "w") as f:
        f.write(header)
        selected_coin_data = []
        f.write("Coins that meet criteria:" + "\n\n")
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
