# THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
import asyncio

from web3 import AsyncHTTPProvider, AsyncWeb3

# FtsoV2 address (Flare Testnet Coston2)
# See https://dev.flare.network/ftso/solidity-reference
FTSOV2_ADDRESS = "0x3d893C53D9e8056135C26C8c638B76C8b60Df726"
RPC_URL = "https://coston2-api.flare.network/ext/C/rpc"
FEED_IDS = [
    "0x01464c522f55534400000000000000000000000000",  # FLR/USD
    "0x014254432f55534400000000000000000000000000",  # BTC/USD
    "0x014554482f55534400000000000000000000000000",  # ETH/USD
]
# ABI for FtsoV2
ABI = '[{"inputs":[{"internalType":"address","name":"_addressUpdater","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"FTSO_PROTOCOL_ID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fastUpdater","outputs":[{"internalType":"contract IFastUpdater","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fastUpdatesConfiguration","outputs":[{"internalType":"contract IFastUpdatesConfiguration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAddressUpdater","outputs":[{"internalType":"address","name":"_addressUpdater","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes21","name":"_feedId","type":"bytes21"}],"name":"getFeedById","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"int8","name":"","type":"int8"},{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes21","name":"_feedId","type":"bytes21"}],"name":"getFeedByIdInWei","outputs":[{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"uint64","name":"_timestamp","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getFeedByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"int8","name":"","type":"int8"},{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getFeedByIndexInWei","outputs":[{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"uint64","name":"_timestamp","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getFeedId","outputs":[{"internalType":"bytes21","name":"","type":"bytes21"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes21","name":"_feedId","type":"bytes21"}],"name":"getFeedIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes21[]","name":"_feedIds","type":"bytes21[]"}],"name":"getFeedsById","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"int8[]","name":"","type":"int8[]"},{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes21[]","name":"_feedIds","type":"bytes21[]"}],"name":"getFeedsByIdInWei","outputs":[{"internalType":"uint256[]","name":"_values","type":"uint256[]"},{"internalType":"uint64","name":"_timestamp","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"_indices","type":"uint256[]"}],"name":"getFeedsByIndex","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"int8[]","name":"","type":"int8[]"},{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"_indices","type":"uint256[]"}],"name":"getFeedsByIndexInWei","outputs":[{"internalType":"uint256[]","name":"_values","type":"uint256[]"},{"internalType":"uint64","name":"_timestamp","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"relay","outputs":[{"internalType":"contract IRelay","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"_contractNameHashes","type":"bytes32[]"},{"internalType":"address[]","name":"_contractAddresses","type":"address[]"}],"name":"updateContractAddresses","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"},{"components":[{"internalType":"uint32","name":"votingRoundId","type":"uint32"},{"internalType":"bytes21","name":"id","type":"bytes21"},{"internalType":"int32","name":"value","type":"int32"},{"internalType":"uint16","name":"turnoutBIPS","type":"uint16"},{"internalType":"int8","name":"decimals","type":"int8"}],"internalType":"struct FtsoV2Interface.FeedData","name":"body","type":"tuple"}],"internalType":"struct FtsoV2Interface.FeedDataWithProof","name":"_feedData","type":"tuple"}],"name":"verifyFeedData","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]'  # noqa: E501


async def main() -> tuple[list, list, int]:
    # Connect to an RPC node
    w3 = AsyncWeb3(
        AsyncHTTPProvider(RPC_URL),
    )
    # Set up contract instance
    ftsov2 = w3.eth.contract(address=w3.to_checksum_address(FTSOV2_ADDRESS), abi=ABI)
    # Fetch current feeds
    feeds, decimals, timestamp = await ftsov2.functions.getFeedsById(FEED_IDS).call()
    # Print results
    print("Feeds:", feeds)
    print("Decimals:", decimals)
    print("Timestamp:", timestamp)
    return feeds, decimals, timestamp


if __name__ == "__main__":
    asyncio.run(main())
