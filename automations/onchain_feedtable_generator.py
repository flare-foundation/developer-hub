import logging
from pathlib import Path

from web3 import Web3

from feed_table_generator import (
    find_coin_by_symbol,
    get_coins_list,
    get_contract_abi,
    read_data_from_file,
    write_data_to_file,
)

# Configuration
RPC_URL = "https://flare-api.flare.network/ext/C/rpc"
COSTON2_RPC_URL = "https://coston2-api.flare.network/ext/C/rpc"
REGISTRY_ADDRESS = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019"
EXPLORER_API_URL = "https://flare-explorer.flare.network/api"
BLOCK_LATENCY_RISK_PATH = Path("block_latency_risk.json")
BLOCK_LATENCY_FEEDS_PATH = Path("onchain_block_latency_feeds.json")
ANCHOR_RISK_PATH = Path("anchor_risk.json")
ANCHOR_FEEDS_PATH = Path("onchain_anchor_feeds.json")
GET_FEED_ID_BY_NAME_CONTRACT_ADDRESS = "0xD855c6DDc776dDC21151C5FFE172aAd5ec1bbCe7"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

HARD_CODED_FEEDS = {
    "FTM/USD": {"name": "Fantom", "decimals": 6, "category": "Crypto"},
    "USDX/USD": {"name": "Hex Trust USD", "decimals": 5, "category": "Crypto"},
}

feed_id_by_name_contract_abi = [
    {"inputs": [], "stateMutability": "nonpayable", "type": "constructor"},
    {
        "inputs": [{"internalType": "string", "name": "_name", "type": "string"}],
        "name": "getFeedId",
        "outputs": [{"internalType": "bytes21", "name": "", "type": "bytes21"}],
        "stateMutability": "view",
        "type": "function",
    },
]


class FeedRiskNotFoundError(Exception):
    pass


def generate_feed_data(
    feed_names: list[str],
    feed_risk: list[dict[str, int]],
    decimals: list[int],
    coins: list[dict],
    *,
    include_index: bool = False,
) -> list[dict]:
    """Generate structured feed data."""
    w3 = Web3(Web3.HTTPProvider(COSTON2_RPC_URL))
    logger.debug("Connected to RPC `%s`", COSTON2_RPC_URL)
    feed_id_contract = w3.eth.contract(
        address=Web3.to_checksum_address(GET_FEED_ID_BY_NAME_CONTRACT_ADDRESS),
        abi=feed_id_by_name_contract_abi,
    )

    data = []
    for idx, (name, decimal) in enumerate(zip(feed_names, decimals, strict=True)):
        feed_id = feed_id_contract.functions.getFeedId(name).call()

        # Convert feed ID from bytes to hex
        feed_id = feed_id.hex() if isinstance(feed_id, bytes) else feed_id

        coin = find_coin_by_symbol(coins, name.split("/")[0]) or HARD_CODED_FEEDS.get(
            name
        )
        if not coin:
            logger.warning("Coin %s not found in CoinGecko data", name)
            continue

        risk = feed_risk[idx].get("volatility", -1) if idx < len(feed_risk) else -1

        feed_data = {
            "feed_name": name,
            "feed_id": feed_id,
            "decimals": decimal,
            "base_asset": coin.get("name"),
            "category": coin.get("category", "Crypto"),
            "risk": risk,
        }
        if include_index:
            feed_data["feed_index"] = idx

        data.append(feed_data)
    return data


if __name__ == "__main__":
    logger.info("Running Feed Table automation...")

    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    logger.debug("Connected to RPC `%s`", RPC_URL)

    registry = w3.eth.contract(
        address=Web3.to_checksum_address(REGISTRY_ADDRESS),
        abi=get_contract_abi(REGISTRY_ADDRESS),
    )

    fast_updater_address = registry.functions.getContractAddressByName(
        "FastUpdater"
    ).call()
    fast_updater = w3.eth.contract(
        address=Web3.to_checksum_address(fast_updater_address),
        abi=get_contract_abi(fast_updater_address),
    )
    logger.debug("Connected to FastUpdater contract `%s`", fast_updater_address)

    # Fetch block latency feeds
    block_latency_feeds = fast_updater.functions.fetchAllCurrentFeeds().call()
    feed_names = [
        feed[1:].decode("utf-8").rstrip("\x00") for feed in block_latency_feeds[0]
    ]
    decimals = block_latency_feeds[2]
    logger.debug("Found %d block-latency feeds", len(feed_names))

    # Fetch CoinGecko data
    coins_list = get_coins_list(num_pages=8)

    # Generate and save block latency feeds
    block_latency_risk = read_data_from_file(BLOCK_LATENCY_RISK_PATH)
    block_latency_data = generate_feed_data(
        feed_names, block_latency_risk, decimals, coins_list, include_index=True
    )
    write_data_to_file(BLOCK_LATENCY_FEEDS_PATH, block_latency_data)

    # Generate and save anchor feeds
    anchor_risk = read_data_from_file(ANCHOR_RISK_PATH)
    anchor_data = generate_feed_data(feed_names, anchor_risk, decimals, coins_list)
    write_data_to_file(ANCHOR_FEEDS_PATH, anchor_data)

    logger.info("Feed Table automation completed successfully.")
