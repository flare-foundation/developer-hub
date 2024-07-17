# THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
import asyncio
import os

from web3 import AsyncHTTPProvider, AsyncWeb3
from web3.middleware.geth_poa import async_geth_poa_middleware

from utils import load_contract_interface


async def main() -> None:
    account, private_key = os.getenv("ACCOUNT"), os.getenv("ACCOUNT_PRIVATE_KEY")
    contract_interface = load_contract_interface("FtsoV2FeedConsumer")

    w3 = AsyncWeb3(
        AsyncHTTPProvider("https://coston2-api.flare.network/ext/C/rpc"),
        middlewares=[async_geth_poa_middleware],
    )
    account = w3.to_checksum_address(account)
    ftsoV2_feed_consumer = w3.eth.contract(
        abi=contract_interface["abi"],
        bytecode=contract_interface["evm"]["bytecode"]["object"],
    )

    tx = ftsoV2_feed_consumer.constructor().build_transaction(
        {
            "from": account,
            "nonce": await w3.eth.get_transaction_count(account),
            "gasPrice": await w3.eth.gas_price,
        }
    )
    signed_tx = await w3.eth.account.sign_transaction(tx, private_key=private_key)

    print("Deploying Contract...")
    tx_hash = await w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    tx_receipt = await w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Contract deployed at {tx_receipt['contractAddress']}")


if __name__ == "__main__":
    asyncio.run(main())
