import asyncio

from web3 import AsyncHTTPProvider, AsyncWeb3
from web3.middleware import ExtraDataToPOAMiddleware


async def main() -> int:
    # Inject middleware to handle testnet PoA consensus
    w3 = AsyncWeb3(
        AsyncHTTPProvider("https://coston2-api.flare.network/ext/C/rpc"),
        middleware=[ExtraDataToPOAMiddleware],
    )
    chain_id = await w3.eth.chain_id
    print(f"Chain ID: {chain_id}")
    # Chain ID: 114
    return chain_id


if __name__ == "__main__":
    asyncio.run(main())
