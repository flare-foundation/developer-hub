import json
from pathlib import Path

CURRENT_DIR = Path(__file__).resolve().parent


def load_contract(name: str) -> str:
    """Load contract from Solidity file."""
    with (CURRENT_DIR / f"{name}.sol").open() as file:
        return file.read()


def save_compiled_contract(name: str, compiled_contract: dict) -> None:
    """Save compiled contract to JSON file."""
    with (CURRENT_DIR / f"{name}.json").open("w") as file:
        json.dump(compiled_contract, file)


def load_contract_interface(name: str) -> dict:
    """Load contract interface from JSON."""
    with (CURRENT_DIR / f"{name}.json").open() as file:
        compiled_contract = json.load(file)
    return compiled_contract["contracts"][f"{name}.sol"][f"{name}"]
