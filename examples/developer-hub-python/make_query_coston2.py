import asyncio
import json

import aiohttp
from web3 import AsyncHTTPProvider, AsyncWeb3
from web3.middleware.geth_poa import async_geth_poa_middleware


async def main() -> str:
    registry_addr = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019"
    w3 = AsyncWeb3(
        AsyncHTTPProvider("https://coston2-api.flare.network/ext/C/rpc"),
        middlewares=[async_geth_poa_middleware],
    )
    params = {
        "module": "contract",
        "action": "getabi",
        "address": registry_addr,
    }
    async with (
        aiohttp.ClientSession() as session,
        session.get(
            "https://coston2-explorer.flare.network/api", params=params
        ) as response,
    ):
        res = await response.json()
        abi = json.loads(res["result"])
    registry = w3.eth.contract(address=w3.to_checksum_address(registry_addr), abi=abi)
    res = await registry.functions.getContractAddressByName("WNat").call()
    print(f"WNat address: {res}")
    # WNat address: 0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273
    return res


if __name__ == "__main__":
    asyncio.run(main())
