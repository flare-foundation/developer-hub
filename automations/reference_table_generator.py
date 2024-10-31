import json
import logging
import sys
from pathlib import Path
from web3 import Web3

logging.basicConfig(level=logging.INFO)

networks = {
    "Flare Mainnet": {
        "rpc_url": "https://flare-api.flare.network/ext/C/rpc",
        "contract_address": "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019"
    },
        "Flare Testnet Coston2": {
        "rpc_url": "https://coston2-api.flare.network/ext/C/rpc",
        "contract_address": "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019"  
    },
    "Songbird Canary Network": {
        "rpc_url": "https://songbird-api.flare.network/ext/C/rpc",
        "contract_address": "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019"  
    },
    "Songbird Testnet Coston": {
        "rpc_url": "https://coston-api.flare.network/ext/C/rpc",
        "contract_address": "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019"  
    }

}

network_data = {}

contract_abi = [
    {
        "inputs": [],
        "name": "getAllContracts",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            },
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

for network_name, config in networks.items():
    logging.info(f"Connecting to {network_name}...")
    web3 = Web3(Web3.HTTPProvider(config["rpc_url"]))

    if not web3.is_connected():
        logging.error(f"Could not connect to the {network_name}")
        continue

    contract = web3.eth.contract(address=config["contract_address"], abi=contract_abi)

    try:
        result = contract.functions.getAllContracts().call()
        contract_names = result[0]
        contract_addresses = result[1]

        network_data[network_name] = []
        for name, address in zip(contract_names, contract_addresses):
            network_data[network_name].append({'Contract Name': name, 'Address': address})

    except Exception as e:
        logging.error(f"An error occurred while fetching data from {network_name}: {e}")

output_file = Path("contract_data.json")
with output_file.open('w') as f:
    json.dump(network_data, f, indent=4)

logging.info(f"Data successfully saved to {output_file}")
