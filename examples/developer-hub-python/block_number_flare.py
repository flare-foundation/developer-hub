from web3 import Web3

w3 = Web3("https://flare-api.flare.network/ext/C/rpc")
print(w3.eth.block_number)
