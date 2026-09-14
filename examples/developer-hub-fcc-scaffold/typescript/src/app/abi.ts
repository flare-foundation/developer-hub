/**
 * ★ ABI decoding for operations whose payload is ABI-encoded rather than JSON.
 *
 * SAY_GOODBYE's contract passes abi.encode((string name, string reason)),
 * matching SayGoodbyeMessageArg in go/pkg/types/types.go. SAY_HELLO uses plain
 * JSON and needs nothing here.
 */

import { decodeAbiParameters, type Hex } from "viem";

/** A single tuple argument, matching Solidity's abi.encode of a struct. */
const SAY_GOODBYE_PARAMS = [
  {
    type: "tuple",
    components: [
      { name: "name", type: "string" },
      { name: "reason", type: "string" },
    ],
  },
] as const;

export interface SayGoodbyeMessage {
  name: string;
  reason: string;
}

/**
 * Decode ABI-encoded (string name, string reason).
 * Throws if the payload does not match the expected layout.
 */
export function decodeSayGoodbye(data: Hex): SayGoodbyeMessage {
  try {
    const [decoded] = decodeAbiParameters(SAY_GOODBYE_PARAMS, data);
    return { name: decoded.name, reason: decoded.reason };
  } catch (e) {
    throw new Error(
      `ABI decode failed: ${e instanceof Error ? e.message : String(e)}`,
    );
  }
}
