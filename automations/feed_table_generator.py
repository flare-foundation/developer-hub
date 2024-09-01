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
block_latency_feeds_path = "_block_latency_feeds.md"
anchor_feeds_path = "_anchor_feeds.md"

logging.basicConfig(
    encoding="utf-8",
    level=logging.INFO,
    handlers=[
        logging.StreamHandler(stream=sys.stdout),
    ],
)
logger = logging.getLogger(__name__)


def get_contract_abi(contract_address: str) -> dict:
    """Get the ABI for a contract from the Chain Explorer API.

    :param contract_address: Address of the contract
    :return: Contract ABI
    """
    params = {"module": "contract", "action": "getabi", "address": contract_address}
    headers = {"accept": "application/json"}
    response = requests.get(
        EXPLORER_API_URL, params=params, headers=headers, timeout=10
    )
    return json.loads(response.json()["result"])


if __name__ == "__main__":
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    logger.info("Connected to RPC `%s`", RPC_URL)
    cg = CoinGeckoAPI()

    # Set up contracts
    fast_updater = w3.eth.contract(
        address=Web3.to_checksum_address(FAST_UPDATER_ADDRESS),
        abi=get_contract_abi(FAST_UPDATER_ADDRESS),
    )
    logger.info("Connected to FastUpdater contract `%s`", FAST_UPDATER_ADDRESS)

    ftso_feedid_converter = w3.eth.contract(
        address=Web3.to_checksum_address(FTSO_FEED_ID_CONVERTER_ADDRESS),
        abi=get_contract_abi(FTSO_FEED_ID_CONVERTER_ADDRESS),
    )
    logger.info("Connected to FtsoFeedIdConverter `%s`", FTSO_FEED_ID_CONVERTER_ADDRESS)

    # Query block latency feeds
    block_latency_feeds = fast_updater.functions.fetchAllCurrentFeeds().call()
    feed_names = block_latency_feeds[0]
    feed_names = [
        feed_name[1:].decode("utf-8").rstrip("\x00") for feed_name in feed_names
    ]
    decimals = block_latency_feeds[2]
    logger.info("Found %d block-latency feeds", len(feed_names))

    # Query CoinGecko
    coins_list = cg.get_coins_markets(vs_currency="usd")

    # Write block-latency feeds to file
    logger.info("Writing block-latency feeds to `%s`", block_latency_feeds_path)
    with Path.open(block_latency_feeds_path, "w") as f:
        f.write(
            "| **Feed Name** | **Feed Index** | **Feed ID** | **Base Asset** | **Decimals** | **Category** |\n"
        )
        f.write(
            "| ------------- | -------------- | ----------- |--------------- | ------------ | ------------ |\n"
        )
        for idx, (name, decimal) in enumerate(zip(feed_names, decimals)):
            feed_id = (
                "0x" + ftso_feedid_converter.functions.getFeedId(1, name).call().hex()
            )
            # Patch for tokens not returned by CoinGecko
            if name == "SGB/USD":
                f.write(
                    f"| {name} | `{idx}` | `{feed_id}` | Songbird | {decimal} | Crypto |\n"
                )
                continue
            if name == "XDC/USD":
                f.write(
                    f"| {name} | `{idx}` | `{feed_id}` | XDC Network | {decimal} | Crypto |\n"
                )
                continue
            if name == "ETHFI/USD":
                f.write(
                    f"| {name} | `{idx}` | `{feed_id}` | Ether.fi | {decimal} | Crypto |\n"
                )
                continue
            if name == "ENA/USD":
                f.write(
                    f"| {name} | `{idx}` | `{feed_id}` | Ethena | {decimal} | Crypto |\n"
                )
                continue
            for coin in coins_list:
                symbol = name.split("/")[0].lower()
                if symbol == coin["symbol"]:
                    f.write(
                        f"| {name} | `{idx}` | `{feed_id}` | {coin['name']} | {decimal} | Crypto |\n"
                    )
                    break

    # Write anchor feeds to file
    logger.info("Writing anchor feeds to `%s`", anchor_feeds_path)
    with Path.open(anchor_feeds_path, "w") as f:
        f.write(
            "| **Feed Name** | **Feed ID** | **Base Asset** | **Decimals** | **Category** |\n"
        )
        f.write(
            "| ------------- | ----------- | -------------- | ------------ | ------------ |\n"
        )
        for name, decimal in zip(feed_names, decimals):
            feed_id = (
                "0x" + ftso_feedid_converter.functions.getFeedId(1, name).call().hex()
            )
            # Path for tokens not returned by CoinGecko
            if name == "SGB/USD":
                f.write(f"| {name} | `{feed_id}` | Songbird | {decimal} | Crypto |\n")
                continue
            if name == "XDC/USD":
                f.write(
                    f"| {name} | `{feed_id}` | XDC Network | {decimal} | Crypto |\n"
                )
                continue
            if name == "ETHFI/USD":
                f.write(f"| {name} | `{feed_id}` | Ether.fi | {decimal} | Crypto |\n")
                continue
            if name == "ENA/USD":
                f.write(f"| {name} | `{feed_id}` | Ethena | {decimal} | Crypto |\n")
                continue
            for coin in coins_list:
                symbol = name.split("/")[0].lower()
                if symbol == coin["symbol"]:
                    f.write(
                        f"| {name} | `{feed_id}` | {coin['name']} | {decimal} | Crypto |\n"
                    )
                    break
