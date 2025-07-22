import json
import logging
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, ClassVar, Final

import requests
from pycoingecko import CoinGeckoAPI  # pyright: ignore[reportMissingTypeStubs]
from tenacity import retry, stop_after_attempt, wait_exponential_jitter
from web3 import Web3
from web3.contract import Contract


@dataclass(frozen=True)
class NetworkConfig:
    name: str
    rpc_url: str
    explorer_api_url: str
    by_name: ClassVar[dict[str, "NetworkConfig"]]

    @classmethod
    def get(cls, name: str) -> "NetworkConfig":
        return cls.by_name[name]


REGISTRY_ADDRESS: Final[str] = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019"

NETWORKS: list[NetworkConfig] = [
    NetworkConfig(
        name="FlareMainnet",
        rpc_url="https://flare-api.flare.network/ext/C/rpc",
        explorer_api_url="https://flare-explorer.flare.network/api",
    ),
    NetworkConfig(
        name="FlareTestnetCoston2",
        rpc_url="https://coston2-api.flare.network/ext/C/rpc",
        explorer_api_url="https://coston2-explorer.flare.network/api",
    ),
    NetworkConfig(
        name="SongbirdCanaryNetwork",
        rpc_url="https://songbird-api.flare.network/ext/C/rpc",
        explorer_api_url="https://songbird-explorer.flare.network/api",
    ),
    NetworkConfig(
        name="SongbirdTestnetCoston",
        rpc_url="https://coston-api.flare.network/ext/C/rpc",
        explorer_api_url="https://coston-explorer.flare.network/api",
    ),
]

NetworkConfig.by_name = {net.name: net for net in NETWORKS}


# Configuration
ISSUES_FILE: Final[Path] = Path("issues.md")
MAX_MARKET_CAP_RANK: Final[int] = 100
HEADER_TEMPLATE: Final[str] = """---
title: "[auto_req]: Potential New Feeds"
assignees: dineshpinto
labels: "enhancement"
---
"""

# Logging
logging.basicConfig(
    encoding="utf-8",
    level=logging.INFO,
    handlers=[logging.StreamHandler(stream=sys.stdout)],
)
logger = logging.getLogger(__name__)


class ExplorerError(RuntimeError):
    """Raised when the chain explorer cannot provide a contract ABI."""


@retry(stop=stop_after_attempt(3), wait=wait_exponential_jitter(initial=1, max=8))
def _get(
    session: requests.Session, **kwargs: dict[str, str] | str
) -> requests.Response:
    """`requests.get` with automatic retry and logging."""
    logger.debug("GET %s", kwargs.get("url") or kwargs.get("url"))
    resp = session.get(**kwargs, timeout=10)  # pyright: ignore[reportArgumentType]
    resp.raise_for_status()
    return resp


def get_contract_abi(
    contract_address: str, session: requests.Session
) -> list[dict[str, Any]]:
    """Return ABI for `contract_address` from the explorer API."""
    params = {"module": "contract", "action": "getabi", "address": contract_address}
    try:
        r = _get(
            session,
            url=NetworkConfig.get("FlareMainnet").explorer_api_url,
            params=params,
            headers={"accept": "application/json"},
        )
        return json.loads(r.json()["result"])
    except (requests.RequestException, json.JSONDecodeError, KeyError) as exc:
        msg = f"Could not fetch ABI for {contract_address}"
        raise ExplorerError(msg) from exc


def decode_feed_name(feed: bytes) -> str:
    """Convert feed bytes (returned by contract) to a plain symbol."""
    return feed[1:].decode().rstrip("\x00").split("/")[0]


def get_current_feeds(contract: Contract) -> set[str]:
    """Return a **set** of existing feed symbols."""
    feeds: list[bytes] = contract.functions.fetchAllCurrentFeeds().call()[0]
    return {decode_feed_name(f) for f in feeds}


def prettify_coin(coin: dict[str, Any]) -> str:
    """Convert `coin` dict into a readable block of Markdown."""
    d = coin.get("data", {})
    change_24h = d.get("price_change_percentage_24h", {}).get("usd", "N/A")
    total_vol = d.get("total_volume", "N/A")

    return (
        f"name: {coin.get('name', 'N/A')}\n"
        f"symbol: {coin.get('symbol', 'N/A')}\n"
        f"coingecko_id: {coin.get('id', 'N/A')}\n"
        f"price_change_percentage_24h: {change_24h}\n"
        f"total_volume: {total_vol}\n"
        f"coingecko_link: https://www.coingecko.com/en/coins/{coin.get('id', '')}\n"
    )


def write_issue(coins: list[dict[str, Any]]) -> None:
    """Write the Markdown issue file."""
    body = ["Coins matching criteria:\n"]
    body += [f"## {c['name']}\n{prettify_coin(c)}\n" for c in coins]
    ISSUES_FILE.write_text(HEADER_TEMPLATE + "\n".join(body), encoding="utf-8")
    logger.info("Wrote %d coin(s) to %s", len(coins), ISSUES_FILE)


def main() -> None:
    cg = CoinGeckoAPI()
    session = requests.Session()

    rpc_url = NetworkConfig.get("FlareMainnet").rpc_url
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    if not w3.is_connected():
        msg = f"Cannot reach RPC at {rpc_url}"
        raise ConnectionError(msg)
    logger.info("Connected to RPC %s", rpc_url)

    registry = w3.eth.contract(
        address=Web3.to_checksum_address(REGISTRY_ADDRESS),
        abi=get_contract_abi(REGISTRY_ADDRESS, session),
    )
    updater_addr = registry.functions.getContractAddressByName("FastUpdater").call()
    fast_updater = w3.eth.contract(
        address=Web3.to_checksum_address(updater_addr),
        abi=get_contract_abi(updater_addr, session),
    )
    logger.info("FastUpdater contract %s", fast_updater.address)

    current_feeds = get_current_feeds(fast_updater)

    trending = cg.get_search_trending()["coins"]  # pyright: ignore[reportUnknownMemberType]
    logger.info("Found potential coins %s", [f"{c['item']['name']}" for c in trending])
    candidates = [
        c["item"]
        for c in trending
        if c["item"].get("market_cap_rank", float("inf")) < MAX_MARKET_CAP_RANK
        and c["item"]["symbol"] not in current_feeds
    ]
    if not candidates:
        sys.exit(78)  # Skips GitHub workflow 'if' steps
    write_issue(candidates)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        logger.exception("Fatal error")
        sys.exit(1)
