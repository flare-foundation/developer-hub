import { coston2 } from "@flarenetwork/flare-wagmi-periphery-package";
import { parseEventLogs, type Address } from "viem";
import { account, publicClient, walletClient } from "./utils/client";
import { getContractAddressByName } from "./utils/flare-contract-registry";

// 1. Amount to redeem in UBA (underlying base units; 1 XRP = 1_000_000 UBA).
const REDEEM_AMOUNT_UBA = 5000000n;
// 2. Redeemer underlying (XRPL) address that will receive the redeemed XRP.
const REDEEMER_UNDERLYING_ADDRESS_STRING = "rSHYuiEvsYsKR8uUHhBTuGP5zjRcGt4nm";
// 3. Executor (not used here, so the zero address).
const EXECUTOR_ZERO_ADDRESS: Address =
  "0x0000000000000000000000000000000000000000";
// 4. XRPL destination tag the agent must include in the redemption payment
//    (must fit in 32 bits; e.g. an exchange deposit tag).
const REDEMPTION_DESTINATION_TAG = 72n;

async function main() {
  // 5. Resolve the AssetManagerFXRP address from the Flare Contract Registry.
  const assetManagerAddress =
    await getContractAddressByName("AssetManagerFXRP");
  console.log("AssetManagerFXRP address:", assetManagerAddress, "\n");

  // 6. Read the protocol-wide minimum redemption amount and assert that the
  //    requested amount is above it. Smaller redemptions are rejected on-chain.
  const minimumRedeemAmountUBA = await publicClient.readContract({
    address: assetManagerAddress,
    abi: coston2.iAssetManagerAbi,
    functionName: "minimumRedeemAmountUBA",
  });
  console.log(
    "minimumRedeemAmountUBA:",
    minimumRedeemAmountUBA.toString(),
    "\n",
  );
  console.log(
    "Requested redeem amount UBA:",
    REDEEM_AMOUNT_UBA.toString(),
    "\n",
  );
  console.log(
    "Redemption destination tag:",
    REDEMPTION_DESTINATION_TAG.toString(),
    "\n",
  );

  if (REDEEM_AMOUNT_UBA < minimumRedeemAmountUBA) {
    throw new Error(
      `Redeem amount (${REDEEM_AMOUNT_UBA.toString()}) must be greater than minimumRedeemAmountUBA (${minimumRedeemAmountUBA.toString()}).`,
    );
  }

  // 7. Simulate the redeemWithTag call to validate args and produce a request
  //    that walletClient can submit.
  const { request } = await publicClient.simulateContract({
    account,
    address: assetManagerAddress,
    abi: coston2.iAssetManagerAbi,
    functionName: "redeemWithTag",
    args: [
      REDEEM_AMOUNT_UBA,
      REDEEMER_UNDERLYING_ADDRESS_STRING,
      EXECUTOR_ZERO_ADDRESS,
      REDEMPTION_DESTINATION_TAG,
    ],
  });

  // 8. Submit the redemption request transaction on Flare.
  const txHash = await walletClient.writeContract(request);
  console.log("redeemWithTag tx hash:", txHash, "\n");

  // 9. Wait for the transaction receipt.
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  console.log("redeemWithTag status:", receipt.status, "\n");

  // 10. Decode RedemptionWithTagRequested events from the receipt logs and
  //     pick the one that belongs to this redeemer.
  const redemptionLogs = parseEventLogs({
    abi: coston2.iAssetManagerAbi,
    eventName: "RedemptionWithTagRequested",
    logs: receipt.logs,
  });

  const redemptionEvent = redemptionLogs.find(
    (log) => log.args.redeemer.toLowerCase() === account.address.toLowerCase(),
  );

  if (!redemptionEvent) {
    throw new Error(
      "RedemptionWithTagRequested event not found for this transaction and redeemer",
    );
  }

  console.log("RedemptionWithTagRequested event:", redemptionEvent, "\n");
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
