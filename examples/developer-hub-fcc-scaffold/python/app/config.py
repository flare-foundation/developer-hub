"""★ Configuration: version and operation identifiers.

Mirrors go/internal/config/config.go. The op-type and op-command strings MUST
match the bytes32 constants in contracts/InstructionSender.sol exactly, or
actions fall through to "unsupported op type".
"""

VERSION = "0.1.0"

OP_TYPE_GREETING = "GREETING"
OP_COMMAND_SAY_HELLO = "SAY_HELLO"
OP_COMMAND_SAY_GOODBYE = "SAY_GOODBYE"
