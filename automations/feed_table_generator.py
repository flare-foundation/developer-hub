import json
import logging
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, ClassVar, Final

import requests
from pycoingecko import CoinGeckoAPI  # pyright: ignore[reportMissingTypeStubs]
from tqdm import tqdm
from web3 import Web3


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
FTSO_RISK_PATH: Final[Path] = Path("ftso_risk.json")
REPO_ROOT: Final[Path] = Path(__file__).resolve().parents[1]
FTSO_FEEDS_PATH: Final[Path] = (
    REPO_ROOT / "src" / "features" / "DataTables" / "FtsoFeeds" / "ftso_feeds.json"
)

HARD_CODED_FEEDS: Final[dict[str, dict[str, str]]] = {
    "FTM/USD": {
        "name": "Fantom",
        "category": "Crypto",
    },
    "USDX/USD": {
        "name": "Hex Trust USD",
        "category": "Crypto",
    },
    "JOULE/USD": {
        "name": "Joule",
        "category": "Crypto",
    },
}

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FeedRiskNotFoundError(RuntimeError):
    """Raised when expected risk data for a feed is missing."""


def get_contract_abi(contract_address: str) -> dict[str, Any]:
    """Fetch contract ABI from the explorer API."""
    params = {"module": "contract", "action": "getabi", "address": contract_address}
    headers = {"accept": "application/json"}

    try:
        response = requests.get(
            NetworkConfig.get("FlareMainnet").explorer_api_url,
            params=params,
            headers=headers,
            timeout=10,
        )
        response.raise_for_status()
        result = response.json().get("result")
        return json.loads(result)
    except (requests.RequestException, ValueError, json.JSONDecodeError):
        logger.exception("Error fetching ABI for contract")
        sys.exit(1)


def get_feed_id(category: str, feed_name: str) -> str:
    """Encode feed name into a 42-byte hex ID."""
    hex_feed_name = feed_name.encode("utf-8").hex()
    padded_hex_string = (category + hex_feed_name).ljust(42, "0")
    return f"0x{padded_hex_string}"


def read_json(path: Path) -> list[dict[str, Any]]:
    """Load JSON data from a file."""
    try:
        return json.loads(path.read_text())
    except Exception:
        logger.exception("Could not read %s", path)
        raise


def write_json(path: Path, data: list[dict[str, Any]]) -> None:
    """Write data as pretty JSON to a file."""
    try:
        path.write_text(json.dumps(data, indent=4))
        logger.debug(
            "Wrote %d items to %s", len(data) if hasattr(data, "__len__") else 1, path
        )
    except Exception:
        logger.exception("Could not write to %s", path)
        raise


def get_coins_list(pages: int = 2) -> list[dict[str, Any]]:
    """Retrieve top coins from CoinGecko (250 per page)."""
    cg = CoinGeckoAPI()
    coins: list[dict[str, Any]] = []
    for page in tqdm(range(1, pages + 1), desc="Fetching coins"):
        coins.extend(cg.get_coins_markets(vs_currency="usd", per_page=250, page=page))  # pyright: ignore[reportUnknownMemberType]
        time.sleep(1)
    return coins


def find_coin_by_symbol(
    coins: list[dict[str, Any]], symbol: str
) -> dict[str, Any] | None:
    """Find a coin dict by its symbol (case-insensitive)."""
    return next(
        (c for c in coins if c.get("symbol", "").lower() == symbol.lower()), None
    )


def generate_feed_data(
    feed_names: list[str],
    feed_risk: list[dict[str, int]],
    coins: list[dict[str, Any]],
    include_index: bool = False,  # noqa: FBT001,FBT002
) -> list[dict[str, Any]]:
    """Combine feed names, risk, and coin info into structured records."""
    data: list[dict[str, Any]] = []
    for idx, name in enumerate(feed_names):
        try:
            risk = feed_risk[idx].get("risk", -1)
        except IndexError as e:
            msg = f"Unable to find risk for {name}"
            raise FeedRiskNotFoundError(msg) from e

        coin = HARD_CODED_FEEDS.get(name) or find_coin_by_symbol(
            coins, name.split("/")[0]
        )
        if not coin:
            logger.warning("Coin %s not found in CoinGecko data", name)
            continue

        record: dict[str, Any] = {
            "feed_name": name,
            "feed_id": get_feed_id("01", name),
            "base_asset": coin.get("name"),
            "category": coin.get("category", "Crypto"),
            "risk": risk,
        }
        if include_index:
            record["feed_index"] = idx
        data.append(record)
    return data


def main() -> None:
    """Orchestrate fetching feeds, enriching with risk and coin data, and writing outputs."""
    try:
        w3 = Web3(Web3.HTTPProvider(NetworkConfig.get("FlareMainnet").rpc_url))
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

        raw_feeds = fast_updater.functions.fetchAllCurrentFeeds().call()[0]
        feed_names = [f[1:].decode("utf-8").rstrip("\x00") for f in raw_feeds]
        logger.debug("Found %d block-latency feeds", len(feed_names))

        coins = get_coins_list(pages=8)

        risks = read_json(FTSO_RISK_PATH)
        enriched = generate_feed_data(feed_names, risks, coins, include_index=True)
        write_json(FTSO_FEEDS_PATH, enriched)
        logger.info("Saved %d records to %s", len(enriched), FTSO_FEEDS_PATH)

    except Exception:
        logger.exception("Feed Table automation failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
