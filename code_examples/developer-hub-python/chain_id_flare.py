import asyncio

from web3 import AsyncHTTPProvider, AsyncWeb3


async def main():
    # Inject middleware to handle testnet PoA consensus
    w3 = AsyncWeb3(
        AsyncHTTPProvider("https://rpc.ankr.com/flare"),
    )
    print(f"Chain ID: {await w3.eth.chain_id}") # Chain ID: 14


if __name__ == "__main__":
    asyncio.run(main())
