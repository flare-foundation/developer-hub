import json
import logging
import re
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


# Configuration
ISSUES_FILE: Final[Path] = Path("issues.md")
MAX_MARKET_CAP_RANK: Final[int] = 100
MIN_USD_VOLUME: Final[int] = 100_000_000
GITHUB_NEUTRAL_EXIT: Final[int] = 78
HEADER_TEMPLATE: Final[str] = """---
title: "[auto_req]: Potential New Feeds"
assignees:
  - dineshpinto
labels:
  - enhancement
---
"""
_VOLUME_RE = re.compile(r"^\$?\s*([\d,]+(?:\.\d{1,2})?)$")
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
def _get(session: requests.Session, url: str, **kwargs: Any) -> requests.Response:  # noqa: ANN401
    """`requests.get` with automatic retry and logging."""
    logger.debug("GET %s params=%s", url, kwargs.get("params"))
    resp = session.get(url, timeout=10, **kwargs)
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


def _decode_feed_name(feed: bytes) -> str:
    """Convert feed bytes (returned by contract) to a plain symbol."""

    if not feed:
        return ""
    raw = feed[1:]
    return raw.decode(errors="ignore").rstrip("\x00").split("/")[0]


def get_current_feeds(contract: Contract) -> set[str]:
    feeds: list[bytes] = contract.functions.fetchAllCurrentFeeds().call()[0]
    return {_decode_feed_name(f).lower() for f in feeds}


def prettify_coin(coin: dict[str, Any]) -> str:
    """Convert `coin` dict into a readable block of Markdown."""
    d = coin.get("data", {})
    pct_24 = d.get("price_change_percentage_24h", {}).get("usd")
    change_24h = f"{round(pct_24, 2)}" if isinstance(pct_24, (int, float)) else "N/A"
    total_vol = d.get("total_volume", "N/A")

    return (
        f"Name: {coin.get('name', 'N/A')}\n"
        f"Symbol: {coin.get('symbol', 'N/A')}\n"
        f"Coingecko ID: {coin.get('id', 'N/A')}\n"
        f"24h Price Change: {change_24h}%\n"
        f"Total Volume: {total_vol}\n"
        f"Link: https://www.coingecko.com/en/coins/{coin.get('id', '')}\n"
    )


def parse_volume(vol_str: str) -> int:
    """Parse a USD volume string like '$123,456.78' -> 123456 (floor)."""
    m = _VOLUME_RE.match(vol_str.strip())
    if not m:
        msg = f"Invalid volume string: {vol_str!r}"
        raise ValueError(msg)
    num = m.group(1).replace(",", "")
    return int(float(num))


def write_issue(coins: list[dict[str, Any]]) -> None:
    lines = [
        "Coins matching [FIP.08](https://proposals.flare.network/FIP/FIP_8.html) criteria:\n"
    ]
    lines += [f"## {c.get('name', 'N/A')}\n{prettify_coin(c)}\n" for c in coins]
    content = HEADER_TEMPLATE + "\n".join(lines)
    tmp = ISSUES_FILE.with_suffix(".tmp")
    tmp.write_text(
        content if content.endswith("\n") else content + "\n", encoding="utf-8"
    )
    tmp.replace(ISSUES_FILE)
    logger.info("Wrote %d coin(s) to %s", len(coins), ISSUES_FILE)


@retry(stop=stop_after_attempt(3), wait=wait_exponential_jitter(initial=1, max=8))
def get_trending(cg: CoinGeckoAPI) -> list[dict[str, Any]]:
    data = cg.get_search_trending()  # pyright: ignore[reportUnknownMemberType]
    return data.get("coins", [])


def _safe_rank(c: dict[str, Any]) -> float:
    return c.get("item", {}).get("market_cap_rank") or float("inf")


def _safe_vol(c: dict[str, Any]) -> int:
    v = c.get("item", {}).get("data", {}).get("total_volume")
    return parse_volume(v) if isinstance(v, str) else 0


def filter_candidates(
    trending: list[dict[str, Any]],
    current_feeds: set[str],
    max_mcap_rank: int,
    min_volume: int,
) -> list[dict[str, Any]]:
    return [
        c["item"]
        for c in trending
        if _safe_rank(c) < max_mcap_rank
        and _safe_vol(c) > min_volume
        and c.get("item", {}).get("symbol", "").lower() not in current_feeds
    ]


def main() -> None:
    cg = CoinGeckoAPI()

    rpc_url = NetworkConfig.get("FlareMainnet").rpc_url
    w3 = Web3(Web3.HTTPProvider(rpc_url, request_kwargs={"timeout": 10}))
    if not w3.is_connected():
        msg = f"Cannot reach RPC at {rpc_url}"
        raise ConnectionError(msg)
    logger.info("Connected to %s", rpc_url, extra={"network": "FlareMainnet"})

    with requests.Session() as session:
        registry = w3.eth.contract(
            address=Web3.to_checksum_address(REGISTRY_ADDRESS),
            abi=get_contract_abi(REGISTRY_ADDRESS, session),
        )
        updater_addr = registry.functions.getContractAddressByName("FastUpdater").call()
        fast_updater = w3.eth.contract(
            address=Web3.to_checksum_address(updater_addr),
            abi=get_contract_abi(updater_addr, session),
        )
        logger.info("FastUpdater %s", fast_updater.address)

    current_feeds = get_current_feeds(fast_updater)
    logger.info("Existing feeds: %d", len(current_feeds))

    trending = get_trending(cg)
    logger.info(
        "Found potential coins %s",
        [c.get("item", {}).get("name", "N/A") for c in trending],
    )

    candidates = sorted(
        filter_candidates(
            trending,
            current_feeds,
            max_mcap_rank=MAX_MARKET_CAP_RANK,
            min_volume=MIN_USD_VOLUME,
        ),
        key=lambda x: (x.get("market_cap_rank") or float("inf"), x.get("name", "")),
    )
    logger.info("Filtered candidates: %s", [c["name"] for c in candidates])

    if not candidates:
        sys.exit(GITHUB_NEUTRAL_EXIT)
    write_issue(candidates)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        logger.exception("Fatal error")
        sys.exit(1)
