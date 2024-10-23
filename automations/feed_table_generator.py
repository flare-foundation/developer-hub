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
block_latency_json_path = "block_latency_feeds.json"
anchor_json_path = "anchor_feeds.json"

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

    # Prepare JSON data for block-latency feeds
    block_latency_data = []

    # Write block-latency feeds to file and JSON
    logger.info("Writing block-latency feeds to `%s`", block_latency_feeds_path)
    with Path.open(block_latency_feeds_path, "w") as f:
        f.write(
            "| **Feed Name** | **Feed Index** | **Feed ID** | **Base Asset** | **Decimals** | **Category** |\n"
        )
        f.write(
            "| ------------- | -------------- | ----------- |--------------- | ------------ | ------------ |\n"
        )
        for idx, (name, decimal) in enumerate(zip(feed_names, decimals, strict=True)):
            feed_id = (
                "0x" + ftso_feedid_converter.functions.getFeedId(1, name).call().hex()
            )
            feed_data = {
                "feed_name": name,
                "feed_index": idx,
                "feed_id": feed_id,
                "decimals": decimal,
            }
            # Patch for tokens not returned by CoinGecko
            if name == "SGB/USD":
                feed_data["base_asset"] = "Songbird"
                feed_data["category"] = "Crypto"
                f.write(
                    f"| {name} | `{idx}` | `{feed_id}` | Songbird | {decimal} | Crypto |\n"
                )
            elif name == "XDC/USD":
                feed_data["base_asset"] = "XDC Network"
                feed_data["category"] = "Crypto"
                f.write(
                    f"| {name} | `{idx}` | `{feed_id}` | XDC Network | {decimal} | Crypto |\n"
                )
            elif name == "ETHFI/USD":
                feed_data["base_asset"] = "Ether.fi"
                feed_data["category"] = "Crypto"
                f.write(
                    f"| {name} | `{idx}` | `{feed_id}` | Ether.fi | {decimal} | Crypto |\n"
                )
            elif name == "ENA/USD":
                feed_data["base_asset"] = "Ethena"
                feed_data["category"] = "Crypto"
                f.write(
                    f"| {name} | `{idx}` | `{feed_id}` | Ethena | {decimal} | Crypto |\n"
                )

            elif name == "FLR/USD":
                feed_data["base_asset"] = "Flare"
                feed_data["category"] = "Crypto"
                f.write(
                    f"| {name} | `{idx}` | `{feed_id}` | Flare | {decimal} | Crypto |\n"
                )
            else:
                for coin in coins_list:
                    symbol = name.split("/")[0].lower()
                    if symbol == coin["symbol"]:
                        feed_data["base_asset"] = coin["name"]
                        feed_data["category"] = "Crypto"
                        f.write(
                            f"| {name} | `{idx}` | `{feed_id}` | {coin['name']} | {decimal} | Crypto |\n"
                        )
                        break
            block_latency_data.append(feed_data)

    # Write block-latency feeds to JSON file
    with Path.open(block_latency_json_path, "w") as json_file:
        json.dump(block_latency_data, json_file, indent=4)
    logger.info("Block-latency feeds written to `%s`", block_latency_json_path)

    # Prepare JSON data for anchor feeds
    anchor_data = []

    # Write anchor feeds to file and JSON
    logger.info("Writing anchor feeds to `%s`", anchor_feeds_path)
    with Path.open(anchor_feeds_path, "w") as f:
        f.write(
            "| **Feed Name** | **Feed ID** | **Base Asset** | **Decimals** | **Category** |\n"
        )
        f.write(
            "| ------------- | ----------- | -------------- | ------------ | ------------ |\n"
        )
        for name, decimal in zip(feed_names, decimals, strict=True):
            feed_id = (
                "0x" + ftso_feedid_converter.functions.getFeedId(1, name).call().hex()
            )
            feed_data = {
                "feed_name": name,
                "feed_id": feed_id,
                "decimals": decimal,
            }
            if name == "SGB/USD":
                feed_data["base_asset"] = "Songbird"
                feed_data["category"] = "Crypto"
                f.write(f"| {name} | `{feed_id}` | Songbird | {decimal} | Crypto |\n")
            elif name == "XDC/USD":
                feed_data["base_asset"] = "XDC Network"
                feed_data["category"] = "Crypto"
                f.write(
                    f"| {name} | `{feed_id}` | XDC Network | {decimal} | Crypto |\n"
                )
            elif name == "ETHFI/USD":
                feed_data["base_asset"] = "Ether.fi"
                feed_data["category"] = "Crypto"
                f.write(f"| {name} | `{feed_id}` | Ether.fi | {decimal} | Crypto |\n")
            elif name == "ENA/USD":
                feed_data["base_asset"] = "Ethena"
                feed_data["category"] = "Crypto"
                f.write(f"| {name} | `{feed_id}` | Ethena | {decimal} | Crypto |\n")

            elif name == "FLR/USD":
                feed_data["base_asset"] = "Flare"
                feed_data["category"] = "Crypto"
                f.write(f"| {name} | `{feed_id}` | Flare | {decimal} | Crypto |\n")

            else:
                for coin in coins_list:
                    symbol = name.split("/")[0].lower()
                    if symbol == coin["symbol"]:
                        feed_data["base_asset"] = coin["name"]
                        feed_data["category"] = "Crypto"
                        f.write(
                            f"| {name} | `{feed_id}` | {coin['name']} | {decimal} | Crypto |\n"
                        )
                        break
            anchor_data.append(feed_data)

    # Write anchor feeds to JSON file
    with Path.open(anchor_json_path, "w") as json_file:
        json.dump(anchor_data, json_file, indent=4)
    logger.info("Anchor feeds written to `%s`", anchor_json_path)
