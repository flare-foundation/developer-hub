from web3 import Web3

w3 = Web3()
acc = w3.eth.account.create()
print(f"Account: {acc.address}, Private Key: {w3.to_hex(acc.key)}")
