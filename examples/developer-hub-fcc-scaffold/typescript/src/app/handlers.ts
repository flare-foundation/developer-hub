/**
 * ★ MAIN CUSTOMIZATION POINT: your extension's handlers.
 *
 * Mirrors go/internal/extension/extension.go. Each handler follows the same
 * 4-step pattern: decode, validate, execute, respond.
 *
 * Handler contract:
 *   (originalMessageHex) => [dataHexOrNull, status, errorOrNull]
 *   status 0 = error, 1 = success. See docs/extension-contract.md §4.6.
 *
 * The framework serializes handler calls, so plain module-level state is safe.
 */

import { bytesToHex, hexToBytes } from "../base/encoding.js";
import type { Framework, HandlerResult } from "../base/types.js";

import { decodeSayGoodbye } from "./abi.js";
import {
  OP_COMMAND_SAY_GOODBYE,
  OP_COMMAND_SAY_HELLO,
  OP_TYPE_GREETING,
} from "./config.js";

// --- Extension state ---------------------------------------------------------
// Serialized by the framework; no locking needed here.
let greetingCount = 0;
let lastGreeting = "";
let farewellCount = 0;
let lastFarewell = "";

/** Reset all state. Used by tests; not part of the wire contract. */
export function resetState(): void {
  greetingCount = 0;
  lastGreeting = "";
  farewellCount = 0;
  lastFarewell = "";
}

/** Wire handlers to (opType, opCommand) pairs. */
export function register(framework: Framework): void {
  framework.handle(OP_TYPE_GREETING, OP_COMMAND_SAY_HELLO, handleSayHello);
  framework.handle(OP_TYPE_GREETING, OP_COMMAND_SAY_GOODBYE, handleSayGoodbye);
}

/** Snapshot returned by GET /state. Mirrors the Go State struct. */
export function reportState(): unknown {
  return {
    greetingCount,
    lastGreeting,
    farewellCount,
    lastFarewell,
  };
}

/** GREETING/SAY_HELLO — JSON payload {"name": "..."}. */
export function handleSayHello(msg: string): HandlerResult {
  // 1. Decode
  let raw: Uint8Array;
  try {
    raw = hexToBytes(msg);
  } catch (e) {
    return [null, 0, `decoding request: invalid hex: ${String(e)}`];
  }

  let req: unknown;
  try {
    req = JSON.parse(Buffer.from(raw).toString("utf-8"));
  } catch (e) {
    return [null, 0, `decoding request: ${String(e)}`];
  }

  if (typeof req !== "object" || req === null || Array.isArray(req)) {
    return [null, 0, "decoding request: expected a JSON object"];
  }

  // Match Go's DisallowUnknownFields.
  const unknown = Object.keys(req)
    .filter((k) => k !== "name")
    .sort();
  if (unknown.length > 0) {
    return [null, 0, `decoding request: unknown field "${unknown[0]}"`];
  }

  // 2. Validate
  const name = (req as { name?: unknown }).name;
  if (typeof name !== "string" || name === "") {
    return [null, 0, "name must not be empty"];
  }

  // 3. Execute
  greetingCount++;
  const greeting = `Hello, ${name}! Welcome to Flare Confidential Compute.`;
  lastGreeting = greeting;

  // 4. Respond
  const resp = { greeting, greetingNumber: greetingCount };
  return [bytesToHex(Buffer.from(JSON.stringify(resp), "utf-8")), 1, null];
}

/** GREETING/SAY_GOODBYE — ABI-encoded (string name, string reason). */
export function handleSayGoodbye(msg: string): HandlerResult {
  // 1. Decode
  let hex: string;
  try {
    // Normalize through hexToBytes so malformed input fails here, not in viem.
    hex = bytesToHex(hexToBytes(msg));
  } catch (e) {
    return [null, 0, `decoding request: invalid hex: ${String(e)}`];
  }

  let decoded: { name: string; reason: string };
  try {
    decoded = decodeSayGoodbye(hex as `0x${string}`);
  } catch (e) {
    return [
      null,
      0,
      `decoding request: ${e instanceof Error ? e.message : String(e)}`,
    ];
  }

  // 2. Validate
  if (!decoded.name) {
    return [null, 0, "name must not be empty"];
  }

  // 3. Execute
  farewellCount++;
  const farewell = `Goodbye, ${decoded.name}! Reason: ${decoded.reason}`;
  lastFarewell = farewell;

  // 4. Respond
  const resp = { farewell, farewellNumber: farewellCount };
  return [bytesToHex(Buffer.from(JSON.stringify(resp), "utf-8")), 1, null];
}
