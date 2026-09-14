/**
 * ★ Configuration: version and operation identifiers.
 *
 * Mirrors go/internal/config/config.go. The op-type and op-command strings MUST
 * match the bytes32 constants in contracts/InstructionSender.sol exactly, or
 * actions fall through to "unsupported op type".
 */

export const VERSION = "0.1.0";

export const OP_TYPE_GREETING = "GREETING";
export const OP_COMMAND_SAY_HELLO = "SAY_HELLO";
export const OP_COMMAND_SAY_GOODBYE = "SAY_GOODBYE";
