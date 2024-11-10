import json
import logging
from pathlib import Path

from web3 import Web3

logging.basicConfig(level=logging.INFO)


NETWORK_RPCS = {
    "FlareMainnet": "https://flare-api.flare.network/ext/C/rpc",
    "FlareTestnetCoston2": "https://coston2-api.flare.network/ext/C/rpc",
    "SongbirdCanaryNetwork": "https://songbird-api.flare.network/ext/C/rpc",
    "SongbirdTestnetCoston": "https://coston-api.flare.network/ext/C/rpc",
}
# Flare Contract Registry is the same address on all networks
REGISTRY_ADDRESS = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019"
REGISTRY_ABI = [
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


def get_solidity_reference(
    network_rpcs: dict[str, str],
    registry_address: str,
    registry_abi: list[dict],
) -> dict[str, list]:
    solidity_reference = {}

    for network_name, rpc_url in network_rpcs.items():
        web3 = Web3(Web3.HTTPProvider(rpc_url))

        if not web3.is_connected():
            logging.error(
                "Could not connect to the %s with RPC: %s", network_name, rpc_url
            )
            continue

        contract = web3.eth.contract(
            address=Web3.to_checksum_address(registry_address), abi=registry_abi
        )

        try:
            res = contract.functions.getAllContracts().call()
            contract_names, contract_addresses = res[0], res[1]

            solidity_reference[network_name] = []
            for name, address in zip(contract_names, contract_addresses, strict=True):
                solidity_reference[network_name].append(
                    {"name": name, "address": address}
                )
        except Exception:
            logging.exception("Error fetching data from %s", network_name)

    return solidity_reference


if __name__ == "__main__":
    logging.info("Running Solidity Reference automation...")

    solidity_reference = get_solidity_reference(
        NETWORK_RPCS, REGISTRY_ADDRESS, REGISTRY_ABI
    )

    output_file = Path("solidity_reference.json")
    with output_file.open("w") as f:
        json.dump(solidity_reference, f, indent=4)

    logging.info(
        "Solidity Reference automation: Data successfully saved to %s", output_file
    )
