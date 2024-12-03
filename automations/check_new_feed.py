import json
import logging
import sys
from pathlib import Path
from typing import Any

import requests
from pycoingecko import CoinGeckoAPI
from web3 import Web3
from web3.contract import Contract

# Configuration
RPC_URL = "https://songbird-api.flare.network/ext/C/rpc"
REGISTRY_ADDRESS = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019"
EXPLORER_API_URL = "https://songbird-explorer.flare.network/api"
ISSUES_FILE = Path("issues.md")
MAX_MARKET_CAP_RANK = 100
HEADER_TEMPLATE = """---
title: "[auto_req]: Potential New Feeds"
assignees: dineshpinto
labels: "enhancement"
---
"""
logging.basicConfig(
    encoding="utf-8",
    level=logging.INFO,
    handlers=[logging.StreamHandler(stream=sys.stdout)],
)
logger = logging.getLogger(__name__)


def get_contract_abi(contract_address: str) -> dict[str, Any]:
    """Fetch the ABI for a contract from the Chain Explorer API."""
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


def format_coin_info(coin_data: dict[str, Any]) -> str:
    """Format coin data dictionary to a readable string."""
    coin_info = {
        "name": coin_data.get("name", "N/A"),
        "symbol": coin_data.get("symbol", "N/A"),
        "coingecko_id": coin_data.get("id", "N/A"),
        "price_change_percentage_24h": coin_data.get("data", {})
        .get("price_change_percentage_24h", {})
        .get("usd", "N/A"),
        "total_volume": coin_data.get("data", {}).get("total_volume", "N/A"),
        "coingecko_link": f"https://www.coingecko.com/en/coins/{coin_data.get('id', '')}",
        "description": coin_data.get("data", {}).get("content", {}).get("description")
        if coin_data.get("data", {}).get("content", {})
        else "",
    }

    return "\n".join(f"{key}: {value}" for key, value in coin_info.items())


def get_current_feeds(contract: Contract) -> list[str]:
    """Fetch the current block latency feeds from the contract."""
    try:
        feeds = contract.functions.fetchAllCurrentFeeds().call()
        return [
            feed[1:].decode("utf-8").rstrip("\x00").split("/")[0] for feed in feeds[0]
        ]
    except Exception:
        logger.exception("Error fetching current feeds")
        sys.exit(1)


def write_issues_file(path: Path, header: str, coins: list[dict[str, Any]]) -> None:
    """Write coin data to the issues.md file."""
    with path.open("w", encoding="utf-8") as file:
        file.write(header)
        file.write("Coins matching criteria:\n\n")
        for coin in coins:
            file.write(f"## {coin['name']}\n")
            file.write(format_coin_info(coin))
            file.write("\n\n")
    logger.info("New feeds written to %s", path)


if __name__ == "__main__":
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    logger.info("Connected to RPC `%s`", RPC_URL)

    # Get contract registry
    registry = w3.eth.contract(
        address=Web3.to_checksum_address(REGISTRY_ADDRESS),
        abi=get_contract_abi(REGISTRY_ADDRESS),
    )

    # Set up contract
    fast_updater_address = registry.functions.getContractAddressByName(
        "FastUpdater"
    ).call()
    fast_updater = w3.eth.contract(
        address=Web3.to_checksum_address(fast_updater_address),
        abi=get_contract_abi(fast_updater_address),
    )
    logger.info("Connected to FastUpdater contract `%s`", fast_updater_address)

    # Query block latency feeds
    current_feeds = get_current_feeds(fast_updater)

    # Fetch trending coins
    cg = CoinGeckoAPI()
    trending = cg.get_search_trending()

    # Filter coins based on criteria
    selected_coins = [
        coin["item"]
        for coin in trending["coins"]
        if coin["item"].get("market_cap_rank", float("inf")) < MAX_MARKET_CAP_RANK
        and coin["item"].get("symbol") not in current_feeds
    ]

    # Write results to issues file
    write_issues_file(ISSUES_FILE, HEADER_TEMPLATE, selected_coins)
