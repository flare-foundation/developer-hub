/**
 * Get all LayerZero peers for the FXRP OFT Adapter on Coston2
 *
 * Usage:
 * yarn hardhat run scripts/layerzero/getOFTPeers.ts --network coston2
 */

import { web3 } from "hardhat";
import { EndpointId } from "@layerzerolabs/lz-definitions";

// FXRP OFT Adapter on Coston2
const OFT_ADAPTER_ADDRESS = "0xCd3d2127935Ae82Af54Fc31cCD9D3440dbF46639";

// Minimal OApp ABI for peers function
const OAPP_ABI = [
  {
    inputs: [{ internalType: "uint32", name: "eid", type: "uint32" }],
    name: "peers",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
];

// Get ALL V2 Testnet endpoints dynamically from the EndpointId enum
function getAllV2TestnetEndpoints(): { name: string; eid: number }[] {
  const endpoints: { name: string; eid: number }[] = [];

  for (const [key, value] of Object.entries(EndpointId)) {
    // Only include V2 testnet endpoints (they end with _V2_TESTNET and have numeric values)
    if (key.endsWith("_V2_TESTNET") && typeof value === "number") {
      // Convert key like "SEPOLIA_V2_TESTNET" to "Sepolia"
      const name = key
        .replace("_V2_TESTNET", "")
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ");
      endpoints.push({ name, eid: value });
    }
  }

  // Sort by EID for consistent output
  return endpoints.sort((a, b) => a.eid - b.eid);
}

const V2_TESTNET_ENDPOINTS = getAllV2TestnetEndpoints();

const ZERO_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

async function main() {
  console.log("=== FXRP OFT Adapter Peers Discovery ===\n");
  console.log(`OFT Adapter: ${OFT_ADAPTER_ADDRESS}`);
  console.log(`Network: Coston2 (Flare Testnet)\n`);

  const oftAdapter = new web3.eth.Contract(OAPP_ABI, OFT_ADAPTER_ADDRESS);

  const configuredPeers: { name: string; eid: number; peer: string }[] = [];
  const errors: { name: string; eid: number; error: string }[] = [];

  console.log(
    `Scanning ${V2_TESTNET_ENDPOINTS.length} LayerZero V2 Testnet endpoints...\n`,
  );

  for (const endpoint of V2_TESTNET_ENDPOINTS) {
    try {
      const peer = await oftAdapter.methods.peers(endpoint.eid).call();

      if (peer && peer !== ZERO_BYTES32) {
        // Convert bytes32 to address (last 20 bytes)
        const peerAddress = "0x" + peer.slice(-40);
        configuredPeers.push({
          name: endpoint.name,
          eid: endpoint.eid,
          peer: peerAddress,
        });
        console.log(
          `✅ ${endpoint.name} (EID: ${endpoint.eid}): ${peerAddress}`,
        );
      }
    } catch (error: unknown) {
      // Some endpoints might not exist or the contract might revert
      const errorMessage =
        error instanceof Error ? error.message.slice(0, 50) : "Unknown error";
      errors.push({
        name: endpoint.name,
        eid: endpoint.eid,
        error: errorMessage,
      });
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY: Configured Peers");
  console.log("=".repeat(60) + "\n");

  if (configuredPeers.length === 0) {
    console.log("No peers configured for the FXRP OFT Adapter.\n");
  } else {
    console.log(`Found ${configuredPeers.length} configured peer(s):\n`);

    console.log("| Chain | EID | Peer Address |");
    console.log("|-------|-----|--------------|");
    for (const peer of configuredPeers) {
      console.log(`| ${peer.name} | ${peer.eid} | ${peer.peer} |`);
    }

    console.log("\n--- Available Routes ---");
    console.log("You can bridge FXRP to/from the following chains:\n");
    for (const peer of configuredPeers) {
      console.log(`  • ${peer.name}`);
    }
  }

  if (errors.length > 0) {
    console.log(
      `\n(${errors.length} endpoints had errors or are not available)`,
    );
  }

  // Export as JSON for programmatic use
  console.log("\n--- JSON Output ---");
  console.log(JSON.stringify(configuredPeers, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
