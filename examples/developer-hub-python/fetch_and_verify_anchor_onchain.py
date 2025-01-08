# THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
import asyncio

from web3 import AsyncHTTPProvider, AsyncWeb3

from fetch_anchor_feeds import fetch_anchor_feeds

RPC_URL = "https://coston2-api.flare.network/ext/C/rpc"

contract_abi = [
    {
        "inputs": [
            {"internalType": "uint32", "name": "", "type": "uint32"},
            {"internalType": "bytes21", "name": "", "type": "bytes21"},
        ],
        "name": "provenFeeds",
        "outputs": [
            {"internalType": "uint32", "name": "votingRoundId", "type": "uint32"},
            {"internalType": "bytes21", "name": "id", "type": "bytes21"},
            {"internalType": "int32", "name": "value", "type": "int32"},
            {"internalType": "uint16", "name": "turnoutBIPS", "type": "uint16"},
            {"internalType": "int8", "name": "decimals", "type": "int8"},
        ],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [
            {
                "components": [
                    {"internalType": "bytes32[]", "name": "proof", "type": "bytes32[]"},
                    {
                        "components": [
                            {
                                "internalType": "uint32",
                                "name": "votingRoundId",
                                "type": "uint32",
                            },
                            {
                                "internalType": "bytes21",
                                "name": "id",
                                "type": "bytes21",
                            },
                            {"internalType": "int32", "name": "value", "type": "int32"},
                            {
                                "internalType": "uint16",
                                "name": "turnoutBIPS",
                                "type": "uint16",
                            },
                            {
                                "internalType": "int8",
                                "name": "decimals",
                                "type": "int8",
                            },
                        ],
                        "internalType": "struct FtsoV2Interface.FeedData",
                        "name": "body",
                        "type": "tuple",
                    },
                ],
                "internalType": "struct FtsoV2Interface.FeedDataWithProof",
                "name": "data",
                "type": "tuple",
            }
        ],
        "name": "savePrice",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
]

contract_address = "0x069227C6A947d852c55655e41C6a382868627920"
w3 = AsyncWeb3(
    AsyncHTTPProvider(RPC_URL),
)

# Create contract instance
contract = w3.eth.contract(address=contract_address, abi=contract_abi)

# Feed IDs and target voting round
BTC_USD_FEED_ID = "0x014254432f55534400000000000000000000000000"
TARGET_VOTING_ROUND = 823402


async def main() -> None:
    try:
        feed_data = await fetch_anchor_feeds([BTC_USD_FEED_ID], TARGET_VOTING_ROUND)

        proof = feed_data[0]["proof"]
        body = feed_data[0]["body"]

        # Create transaction
        txn_hash = await contract.functions.savePrice(
            {"proof": proof, "body": body}
        ).transact()
        tx_receipt = await w3.eth.wait_for_transaction_receipt(txn_hash)

        print(f"Transaction sent with hash: {tx_receipt}")

        saved_price = await contract.functions.provenFeeds(
            TARGET_VOTING_ROUND, BTC_USD_FEED_ID
        ).call()
        formatted_price = saved_price[2] * (10 ** -saved_price[4])
        print(f"Saved price: {formatted_price} USD at voting round: {saved_price[0]}")
    except Exception as err:
        print(f"Error: {err}")


# Run the main function
if __name__ == "__main__":
    asyncio.run(main())
