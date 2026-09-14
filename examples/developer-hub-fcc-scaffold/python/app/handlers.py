"""★ MAIN CUSTOMIZATION POINT: your extension's handlers.

Mirrors go/internal/extension/extension.go. Each handler follows the same
4-step pattern: decode, validate, execute, respond.

Handler contract:
    (original_message_hex) -> (data_hex_or_None, status, error_or_None)
    status 0 = error, 1 = success. See docs/extension-contract.md §4.6.

The framework serializes handler calls, so plain module-level state is safe.
"""

from __future__ import annotations

import json
import logging
from typing import Any, Optional

from base.encoding import bytes_to_hex, hex_to_bytes
from base.types import Framework

from .abi import decode_say_goodbye
from .config import (
    OP_COMMAND_SAY_GOODBYE,
    OP_COMMAND_SAY_HELLO,
    OP_TYPE_GREETING,
    VERSION,
)

logger = logging.getLogger(__name__)

# --- Extension state ---------------------------------------------------------
# Serialized by the framework; no locking needed here.
_greeting_count = 0
_last_greeting = ""
_farewell_count = 0
_last_farewell = ""


def reset_state() -> None:
    """Reset all state. Used by tests; not part of the wire contract."""
    global _greeting_count, _last_greeting, _farewell_count, _last_farewell
    _greeting_count = 0
    _last_greeting = ""
    _farewell_count = 0
    _last_farewell = ""


def register(framework: Framework) -> None:
    """Wire handlers to (opType, opCommand) pairs."""
    framework.handle(OP_TYPE_GREETING, OP_COMMAND_SAY_HELLO, handle_say_hello)
    framework.handle(OP_TYPE_GREETING, OP_COMMAND_SAY_GOODBYE, handle_say_goodbye)


def report_state() -> Any:
    """Snapshot returned by GET /state. Mirrors the Go State struct."""
    return {
        "greetingCount": _greeting_count,
        "lastGreeting": _last_greeting,
        "farewellCount": _farewell_count,
        "lastFarewell": _last_farewell,
    }


def handle_say_hello(msg: str) -> tuple[Optional[str], int, Optional[str]]:
    """GREETING/SAY_HELLO — JSON payload {"name": "..."}."""
    global _greeting_count, _last_greeting

    # 1. Decode
    try:
        raw = hex_to_bytes(msg)
    except ValueError as e:
        return None, 0, f"decoding request: invalid hex: {e}"

    try:
        req = json.loads(raw)
    except (json.JSONDecodeError, ValueError) as e:
        return None, 0, f"decoding request: {e}"

    if not isinstance(req, dict):
        return None, 0, "decoding request: expected a JSON object"

    # Match Go's DisallowUnknownFields.
    unknown = set(req) - {"name"}
    if unknown:
        return None, 0, f"decoding request: unknown field {sorted(unknown)[0]!r}"

    # 2. Validate
    name = req.get("name", "")
    if not name:
        return None, 0, "name must not be empty"

    # 3. Execute
    _greeting_count += 1
    greeting = f"Hello, {name}! Welcome to Flare Confidential Compute."
    _last_greeting = greeting

    # 4. Respond
    resp = {"greeting": greeting, "greetingNumber": _greeting_count}
    return bytes_to_hex(json.dumps(resp, separators=(",", ":")).encode("utf-8")), 1, None


def handle_say_goodbye(msg: str) -> tuple[Optional[str], int, Optional[str]]:
    """GREETING/SAY_GOODBYE — ABI-encoded (string name, string reason)."""
    global _farewell_count, _last_farewell

    # 1. Decode
    try:
        raw = hex_to_bytes(msg)
    except ValueError as e:
        return None, 0, f"decoding request: invalid hex: {e}"

    try:
        name, reason = decode_say_goodbye(raw)
    except ValueError as e:
        return None, 0, f"decoding request: {e}"

    # 2. Validate
    if not name:
        return None, 0, "name must not be empty"

    # 3. Execute
    _farewell_count += 1
    farewell = f"Goodbye, {name}! Reason: {reason}"
    _last_farewell = farewell

    # 4. Respond
    resp = {"farewell": farewell, "farewellNumber": _farewell_count}
    return bytes_to_hex(json.dumps(resp, separators=(",", ":")).encode("utf-8")), 1, None
