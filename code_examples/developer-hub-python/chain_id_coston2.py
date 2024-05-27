import asyncio

from web3 import AsyncHTTPProvider, AsyncWeb3
from web3.middleware.geth_poa import async_geth_poa_middleware


async def main():
    # Inject middleware to handle testnet PoA consensus
    w3 = AsyncWeb3(
        AsyncHTTPProvider("https://rpc.ankr.com/flare_coston2"),
        middlewares=[async_geth_poa_middleware],
    )
    print(f"Chain ID: {await w3.eth.chain_id}")
    # Chain ID: 114


if __name__ == "__main__":
    asyncio.run(main())
