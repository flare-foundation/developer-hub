import json
import logging
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, ClassVar, Final

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
REPO_ROOT: Final[Path] = Path(__file__).resolve().parents[1]
OUTPUT_PATH: Final[Path] = (
    REPO_ROOT / "src" / "features" / "DataTables" / "SolidityReference" / "solidity_reference.json"
)

REGISTRY_ABI: Final[list[dict[str, Any]]] = [
    {
        "inputs": [],
        "name": "getAllContracts",
        "outputs": [
            {"internalType": "string[]", "name": "", "type": "string[]"},
            {"internalType": "address[]", "name": "", "type": "address[]"},
        ],
        "stateMutability": "view",
        "type": "function",
    }
]

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def fetch_contracts(
    web3: Web3, address: str, abi: list[dict[str, Any]]
) -> list[dict[str, str]]:
    """Retrieve all contract names and addresses from the registry."""
    contract = web3.eth.contract(address=Web3.to_checksum_address(address), abi=abi)
    names, addresses = contract.functions.getAllContracts().call()
    return [
        {"name": name, "address": addr}
        for name, addr in zip(names, addresses, strict=False)
    ]


def build_solidity_reference(
    registry_address: str,
    registry_abi: list[dict[str, str]],
) -> dict[str, list[dict[str, str]]]:
    """Connect to each network and collect its registry contracts."""
    reference: dict[str, list[dict[str, str]]] = {}

    for network in NETWORKS:
        w3 = Web3(Web3.HTTPProvider(network.rpc_url))
        if not w3.is_connected():
            logger.error("Connection failed for %s (%s)", network, network.rpc_url)
            continue

        try:
            contracts = fetch_contracts(w3, registry_address, registry_abi)
            reference[network.name] = contracts
            logger.info("Fetched %d contracts from %s", len(contracts), network)
        except Exception:
            logger.exception("Error fetching from %s", network)

    return reference


def main() -> None:
    """Run the automation: fetch and save the solidity registry reference."""
    try:
        ref = build_solidity_reference(REGISTRY_ADDRESS, REGISTRY_ABI)
        OUTPUT_PATH.write_text(json.dumps(ref, indent=2) + "\n")
        logger.info("Data successfully saved to %s", OUTPUT_PATH)
    except Exception:
        logger.exception("Solidity reference automation failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
