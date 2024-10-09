import json
import logging
import sys
from pathlib import Path

import requests
from pycoingecko import CoinGeckoAPI
from web3 import Web3

RPC_URL = "https://songbird-api.flare.network/ext/C/rpc"
FAST_UPDATER_ADDRESS = "0x70e8870ef234EcD665F96Da4c669dc12c1e1c116"
FTSO_FEED_ID_CONVERTER_ADDRESS = "0x9c20c3F1fC39F14ad0D09DE91B74a16c12a36C61"
EXPLORER_API_URL = "https://songbird-explorer.flare.network/api"
BLOCK_LATENCY_FEEDS_PATH = "_block_latency_feeds.md"
ANCHOR_FEEDS_PATH = "_anchor_feeds.md"
TABLE_HEADERS = {
    "block_latency": "| **Feed Name** | **Feed Index** | **Feed ID** | **Base Asset** | **Decimals** | **Category** |\n"
    "| ------------- | -------------- | ----------- | -------------- | ------------ | ------------ |\n",
    "anchor": "| **Feed Name** | **Feed ID** | **Base Asset** | **Decimals** | **Category** |\n"
    "| ------------- | ----------- | -------------- | ------------ | ------------ |\n",
}

logging.basicConfig(
    encoding="utf-8",
    level=logging.INFO,
    handlers=[logging.StreamHandler(stream=sys.stdout)],
)
logger = logging.getLogger(__name__)


def get_contract_abi(contract_address: str) -> dict:
    """Get the ABI for a contract from the Chain Explorer API."""
    params = {"module": "contract", "action": "getabi", "address": contract_address}
    headers = {"accept": "application/json"}

    try:
        response = requests.get(
            EXPLORER_API_URL, params=params, headers=headers, timeout=10
        )
        response.raise_for_status()
        result = response.json().get("result")
        return json.loads(result)
    except (requests.RequestException, ValueError, json.JSONDecodeError):
        logger.exception("Error fetching ABI for contract")
        sys.exit(1)


def get_feed_id(category: str, feed_name: str) -> str:
    """Convert a feed name to its structured encoded feed ID."""
    hex_feed_name = feed_name.encode("utf-8").hex()
    padded_hex_string = (category + hex_feed_name).ljust(42, "0")
    return f"0x{padded_hex_string}"


def write_table_to_file(file_path: str, header: str, rows: list[str]) -> None:
    """Write a markdown table to a file."""
    try:
        with Path(file_path).open("w", encoding="utf-8") as f:
            f.write(header)
            f.writelines(rows)
        logger.info("Successfully wrote data to %s", file_path)
    except OSError:
        logger.exception("Failed to write to %s: ", file_path)


def get_coins_list() -> list[dict]:
    """Get the top 500 coins from CoinGecko."""
    cg = CoinGeckoAPI()
    coins = []
    try:
        for page in [1, 2]:
            coins += cg.get_coins_markets(vs_currency="usd", per_page=250, page=page)
    except Exception:
        logger.exception("Error fetching coins from CoinGecko")
        sys.exit(1)
    else:
        return coins


def find_coin_by_symbol(coins: list[dict], symbol: str) -> dict | None:
    """Find a coin in the list by its symbol."""
    return next(
        (coin for coin in coins if coin["symbol"].lower() == symbol.lower()), None
    )


def generate_feed_rows(
    feed_names: list[str],
    decimals: list[int],
    coins: list[dict],
    include_index: bool = False,  # noqa: FBT001,FBT002
) -> list[str]:
    """Generate rows for markdown table based on feed data."""
    rows = []
    for idx, (name, decimal) in enumerate(zip(feed_names, decimals, strict=True)):
        feed_id = get_feed_id("01", name)
        coin = find_coin_by_symbol(coins, name.split("/")[0])
        if not coin:
            logger.warning("Coin %s not found in CoinGecko data", name)
            continue

        if include_index:
            row = f"| {name} | `{idx}` | `{feed_id}` | {coin['name']} | {decimal} | Crypto |\n"
        else:
            row = f"| {name} | `{feed_id}` | {coin['name']} | {decimal} | Crypto |\n"
        rows.append(row)
    return rows


if __name__ == "__main__":
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    logger.info("Connected to RPC `%s`", RPC_URL)

    # Set up contract
    fast_updater = w3.eth.contract(
        address=Web3.to_checksum_address(FAST_UPDATER_ADDRESS),
        abi=get_contract_abi(FAST_UPDATER_ADDRESS),
    )
    logger.info("Connected to FastUpdater contract `%s`", FAST_UPDATER_ADDRESS)

    # Query block latency feeds
    block_latency_feeds = fast_updater.functions.fetchAllCurrentFeeds().call()
    feed_names = [
        feed[1:].decode("utf-8").rstrip("\x00") for feed in block_latency_feeds[0]
    ]
    decimals = block_latency_feeds[2]
    logger.info("Found %d block-latency feeds", len(feed_names))

    # Query CoinGecko for top 500 coins
    coins_list = get_coins_list()

    # Write block-latency feeds to file
    block_latency_rows = generate_feed_rows(
        feed_names, decimals, coins_list, include_index=True
    )
    write_table_to_file(
        BLOCK_LATENCY_FEEDS_PATH, TABLE_HEADERS["block_latency"], block_latency_rows
    )

    # Write anchor feeds to file
    anchor_rows = generate_feed_rows(feed_names, decimals, coins_list)
    write_table_to_file(ANCHOR_FEEDS_PATH, TABLE_HEADERS["anchor"], anchor_rows)
