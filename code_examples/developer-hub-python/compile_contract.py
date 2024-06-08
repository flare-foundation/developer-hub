from solcx import compile_standard, install_solc

from utils import load_contract, save_compiled_contract

if __name__ == "__main__":
    contract_name = "FtsoV2FeedConsumer"
    contract_code = load_contract(contract_name)

    # Install the solc compiler
    # Versions >0.8.25 may work, but have not been tested
    solc_version = "0.8.25"
    install_solc(solc_version)
    compiled_sol = compile_standard(
        {
            "language": "Solidity",
            "sources": {f"{contract_name}.sol": {"content": contract_code}},
            "settings": {
                "outputSelection": {
                    "*": {
                        "*": [
                            "abi",
                            "metadata",
                            "evm.bytecode",
                            "evm.bytecode.sourceMap",
                        ],
                    }
                },
                "optimizer": {"enabled": True, "runs": 200},
                "evmVersion": "london",
            },
        },
        solc_version=solc_version,
    )
    save_compiled_contract(contract_name, compiled_sol)
