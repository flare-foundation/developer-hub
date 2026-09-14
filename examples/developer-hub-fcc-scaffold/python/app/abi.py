"""★ ABI decoding for operations whose payload is ABI-encoded rather than JSON.

SAY_GOODBYE's contract passes abi.encode((string name, string reason)), matching
SayGoodbyeMessageArg in go/pkg/types/types.go. SAY_HELLO uses plain JSON and
needs nothing here.
"""

from __future__ import annotations

from eth_abi import decode as abi_decode

# A single tuple argument, matching Solidity's abi.encode of a struct.
SAY_GOODBYE_TYPES = ["(string,string)"]


def decode_say_goodbye(data: bytes) -> tuple[str, str]:
    """Decode ABI-encoded (string name, string reason).

    Raises ValueError if the payload does not match the expected layout.
    """
    try:
        (decoded,) = abi_decode(SAY_GOODBYE_TYPES, data)
    except Exception as e:  # eth_abi raises a variety of decoding errors
        raise ValueError(f"ABI decode failed: {e}") from e

    name, reason = decoded
    return name, reason
