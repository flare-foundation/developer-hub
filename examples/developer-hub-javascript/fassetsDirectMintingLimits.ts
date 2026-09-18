import { dropsToXrp, xrpToDrops } from "xrpl";
import { getContractAddressByName } from "./utils/flare-contract-registry";
import {
  getAssetManagerSettings,
  getDirectMintingDailyLimitUBA,
  getDirectMintingDailyLimiterState,
  getDirectMintingHourlyLimitUBA,
  getDirectMintingHourlyLimiterState,
  getDirectMintingLargeMintingDelaySeconds,
  getDirectMintingLargeMintingThresholdUBA,
  getDirectMintingsUnblockUntilTimestamp,
  getFAssetTotalSupply,
  getLatestBlock,
} from "./utils/fassets";

// 1. Window sizes are clock-aligned tumbling, not rolling. Hourly snaps to
//    UTC hour boundaries; daily snaps to 00:00 UTC. Both are fixed at asset
//    manager initialization (`1 hours` / `1 days`) and have no getter.
const HOURLY_WINDOW_SECONDS = 3600n;
const DAILY_WINDOW_SECONDS = 86400n;

// Underlying XRP amount to pre-flight: what the payment delivers to the Core
// Vault, before minting and executor fees. Override with MINT_PREFLIGHT_XRP.
const DEFAULT_PREFLIGHT_MINT_XRP = 10;

// 2. Format helpers.
function formatUba(uba: bigint): string {
  return `${uba.toString()} UBA (${dropsToXrp(uba.toString())} XRP)`;
}

function formatDuration(seconds: number): string {
  const total = Math.abs(seconds);
  const parts = [
    { unit: "d", value: Math.floor(total / 86400) },
    { unit: "h", value: Math.floor((total % 86400) / 3600) },
    { unit: "m", value: Math.floor((total % 3600) / 60) },
    { unit: "s", value: total % 60 },
  ];

  // Drop leading zero units, then keep everything through seconds so interior
  // zeros survive (7200s is "2h 0m 0s", not "2h 0s") and "0s" stays readable.
  const firstNonZero = parts.findIndex((part) => part.value > 0);
  const kept =
    firstNonZero === -1 ? parts.slice(-1) : parts.slice(firstNonZero);
  return kept.map((part) => `${part.value}${part.unit}`).join(" ");
}

function formatTimestamp(secondsSinceEpoch: bigint, now: bigint): string {
  const iso = new Date(Number(secondsSinceEpoch) * 1000).toISOString();
  const delta = Number(secondsSinceEpoch - now);
  const relative =
    delta >= 0 ? `in ${formatDuration(delta)}` : `${formatDuration(delta)} ago`;
  return `${iso} (${relative})`;
}

function bigintMin(a: bigint, b: bigint): bigint {
  return a < b ? a : b;
}

function bigintMax(a: bigint, b: bigint): bigint {
  return a > b ? a : b;
}

function subOrZero(a: bigint, b: bigint): bigint {
  return a > b ? a - b : 0n;
}

// 3. Replay the limiter slide off-chain. Reading state alone returns stale
//    `(windowStart, minted)` values until the next write touches the limiter,
//    so we re-anchor the window and drain `mintedInCurrentWindow` using the
//    same window-advancement logic as MintingRateLimiter.sol.
function computeWindowState({
  now,
  windowStartTimestamp,
  mintedInCurrentWindowUBA,
  limitUBA,
  windowSizeSeconds,
  amgGranularityUBA,
}: {
  now: bigint;
  windowStartTimestamp: bigint;
  mintedInCurrentWindowUBA: bigint;
  limitUBA: bigint;
  windowSizeSeconds: bigint;
  amgGranularityUBA: bigint;
}) {
  let effectiveStart = windowStartTimestamp;
  let usedUBA = mintedInCurrentWindowUBA;

  if (
    windowStartTimestamp > 0n &&
    now >= windowStartTimestamp + windowSizeSeconds
  ) {
    const windowsElapsed = (now - windowStartTimestamp) / windowSizeSeconds;
    effectiveStart = windowStartTimestamp + windowsElapsed * windowSizeSeconds;
    usedUBA = subOrZero(usedUBA, windowsElapsed * limitUBA);
  }

  const remainingUBA = subOrZero(limitUBA, usedUBA);
  // `recordMinting` delays as soon as `minted >= maxMintingPerWindow`, so the
  // largest mint that still executes immediately is one AMG below the headroom.
  const maxWithoutDelayUBA = subOrZero(remainingUBA, amgGranularityUBA);
  const nextResetAt = effectiveStart + windowSizeSeconds;

  return {
    effectiveStart,
    usedUBA,
    remainingUBA,
    maxWithoutDelayUBA,
    nextResetAt,
  };
}

// 4. Window delay mirrors MintingRateLimiter: overflow is scheduled into the
//    current tumbling window proportionally to accumulated minted volume.
//    Note the on-chain comparison is `minted < limit`, so landing exactly on
//    the cap is already delayed.
function computeWindowExecutionAllowedAt({
  now,
  effectiveStart,
  usedUBA,
  proposedAmountUBA,
  limitUBA,
  windowSizeSeconds,
}: {
  now: bigint;
  effectiveStart: bigint;
  usedUBA: bigint;
  proposedAmountUBA: bigint;
  limitUBA: bigint;
  windowSizeSeconds: bigint;
}): bigint {
  // A zero cap is not a valid deployed configuration (`recordMinting` would
  // divide by zero); treat it as "no window throttle" for display purposes.
  if (limitUBA === 0n) {
    return now;
  }

  const mintedAfter = usedUBA + proposedAmountUBA;
  if (mintedAfter < limitUBA) {
    return now;
  }

  return effectiveStart + (windowSizeSeconds * mintedAfter) / limitUBA;
}

// 5. Large mintings take a separate branch in `_checkRateLimits`: an amount at
//    or above the threshold is delayed by a fixed duration and never touches
//    the hourly/daily limiter (so it also consumes no window capacity).
//    The comparison is `>=`, so minting exactly at the threshold is delayed.
function isLargeMinting(
  proposedAmountUBA: bigint,
  largeThresholdUBA: bigint,
): boolean {
  return proposedAmountUBA >= largeThresholdUBA;
}

// 6. Combine the two branches the way `_checkRateLimits` does: the large
//    branch on its own, otherwise the later of the hourly and daily windows.
function computeDirectMintingExecutionAllowedAt({
  now,
  proposedAmountUBA,
  hourly,
  daily,
  largeThresholdUBA,
  largeDelaySeconds,
}: {
  now: bigint;
  proposedAmountUBA: bigint;
  hourly: {
    effectiveStart: bigint;
    usedUBA: bigint;
    limitUBA: bigint;
    windowSizeSeconds: bigint;
  };
  daily: {
    effectiveStart: bigint;
    usedUBA: bigint;
    limitUBA: bigint;
    windowSizeSeconds: bigint;
  };
  largeThresholdUBA: bigint;
  largeDelaySeconds: bigint;
}) {
  // Large branch: the hourly and daily windows are not consulted at all.
  if (isLargeMinting(proposedAmountUBA, largeThresholdUBA)) {
    return {
      executionAllowedAt: now + largeDelaySeconds,
      // The contract records the delayed minting and returns before minting,
      // so a large minting always needs a second `executeDirectMinting` call.
      delayed: true,
      delayReason: "large-mint threshold",
      event: "LargeDirectMintingDelayed",
      hourlyAt: undefined,
      dailyAt: undefined,
    };
  }

  const hourlyAt = computeWindowExecutionAllowedAt({
    now,
    effectiveStart: hourly.effectiveStart,
    usedUBA: hourly.usedUBA,
    proposedAmountUBA,
    limitUBA: hourly.limitUBA,
    windowSizeSeconds: hourly.windowSizeSeconds,
  });
  const dailyAt = computeWindowExecutionAllowedAt({
    now,
    effectiveStart: daily.effectiveStart,
    usedUBA: daily.usedUBA,
    proposedAmountUBA,
    limitUBA: daily.limitUBA,
    windowSizeSeconds: daily.windowSizeSeconds,
  });

  const executionAllowedAt = bigintMax(hourlyAt, dailyAt);
  const delayReasons: string[] = [];
  if (hourlyAt > now) delayReasons.push("hourly window");
  if (dailyAt > now) delayReasons.push("daily window");

  return {
    executionAllowedAt,
    delayed: executionAllowedAt > now,
    delayReason: delayReasons.join(" + "),
    event: "DirectMintingDelayed",
    hourlyAt,
    dailyAt,
  };
}

// 7. Print one window.
function printWindow(
  label: string,
  opts: {
    limitUBA: bigint;
    usedUBA: bigint;
    remainingUBA: bigint;
    maxWithoutDelayUBA: bigint;
    effectiveStart: bigint;
    nextResetAt: bigint;
    now: bigint;
  },
) {
  const {
    limitUBA,
    usedUBA,
    remainingUBA,
    maxWithoutDelayUBA,
    effectiveStart,
    nextResetAt,
    now,
  } = opts;
  const usedPct =
    limitUBA === 0n ? 0 : Number((usedUBA * 10000n) / limitUBA) / 100;
  const row = (key: string, value: string) =>
    console.log(`${key.padEnd(21)} ${value}`);
  console.log(`=== ${label} ===`);
  row("Limit:", formatUba(limitUBA));
  row("Used:", `${formatUba(usedUBA)} (${usedPct.toFixed(2)}%)`);
  row("Remaining:", formatUba(remainingUBA));
  row("Max without delay:", formatUba(maxWithoutDelayUBA));
  row("Window started:", formatTimestamp(effectiveStart, now));
  row("Window resets at:", formatTimestamp(nextResetAt, now));
  console.log();
}

async function main() {
  // 8. Resolve `AssetManagerFXRP` through the Flare Contract Registry.
  const assetManagerAddress =
    await getContractAddressByName("AssetManagerFXRP");
  console.log("AssetManagerFXRP address:", assetManagerAddress, "\n");

  // 9. Pin every read to one block and take `now` from that block. Using the
  //    local clock would drift from `block.timestamp`, which is what the
  //    contract compares the window timestamps against.
  const block = await getLatestBlock();
  const blockNumber = block.number;
  const now = block.timestamp;

  // 10. Read the settings (AMG granularity, FAsset address, global minting cap),
  //     the hourly and daily caps, the raw limiter state, the unblock timestamp,
  //     and the large-minting threshold and delay in parallel.
  const [
    settings,
    hourlyLimitUBA,
    dailyLimitUBA,
    hourlyState,
    dailyState,
    unblockUntilTimestamp,
    largeThresholdUBA,
    largeDelaySeconds,
  ] = await Promise.all([
    getAssetManagerSettings(assetManagerAddress, blockNumber),
    getDirectMintingHourlyLimitUBA(assetManagerAddress, blockNumber),
    getDirectMintingDailyLimitUBA(assetManagerAddress, blockNumber),
    getDirectMintingHourlyLimiterState(assetManagerAddress, blockNumber),
    getDirectMintingDailyLimiterState(assetManagerAddress, blockNumber),
    getDirectMintingsUnblockUntilTimestamp(assetManagerAddress, blockNumber),
    getDirectMintingLargeMintingThresholdUBA(assetManagerAddress, blockNumber),
    getDirectMintingLargeMintingDelaySeconds(assetManagerAddress, blockNumber),
  ]);

  const amgGranularityUBA = BigInt(settings.assetMintingGranularityUBA);

  // 11. Limiter state is returned as raw AMG (uint64); convert to UBA via
  //     `assetMintingGranularityUBA` before passing into the window math.
  const computeAndPrint = (
    label: string,
    limitUBA: bigint,
    state: readonly [bigint, bigint],
    sizeSeconds: bigint,
  ) => {
    const [windowStart, mintedAmg] = state;
    const result = computeWindowState({
      now,
      windowStartTimestamp: windowStart,
      mintedInCurrentWindowUBA: mintedAmg * amgGranularityUBA,
      limitUBA,
      windowSizeSeconds: sizeSeconds,
      amgGranularityUBA,
    });
    printWindow(label, { ...result, limitUBA, now });
    return result;
  };

  const hourly = computeAndPrint(
    "Hourly window",
    hourlyLimitUBA,
    hourlyState,
    HOURLY_WINDOW_SECONDS,
  );
  const daily = computeAndPrint(
    "Daily window",
    dailyLimitUBA,
    dailyState,
    DAILY_WINDOW_SECONDS,
  );

  // 12. The global minting cap is checked *before* the rate limits and it
  //     reverts with `MintingCapExceeded` instead of delaying. Reserved
  //     capacity (`totalReservedCollateralAMG`, which covers collateral
  //     reservations and already-delayed direct mintings) has no getter, so
  //     the headroom computed here is an upper bound.
  const mintingCapAMG = BigInt(settings.mintingCapAMG);
  const mintingCapEnabled = mintingCapAMG !== 0n;
  const mintingCapUBA = mintingCapAMG * amgGranularityUBA;
  const totalSupplyUBA = mintingCapEnabled
    ? await getFAssetTotalSupply(settings.fAsset, blockNumber)
    : 0n;
  // `checkMintingCap` compares AMG, and `convertUBAToAmg` floors, so floor the
  // supply the same way instead of subtracting raw UBA.
  const totalSupplyAMG = totalSupplyUBA / amgGranularityUBA;
  const capHeadroomUBA =
    subOrZero(mintingCapAMG, totalSupplyAMG) * amgGranularityUBA;

  console.log("=== Global minting cap ===");
  if (mintingCapEnabled) {
    console.log("Minting cap:   ", formatUba(mintingCapUBA));
    console.log("Total supply:  ", formatUba(totalSupplyUBA));
    console.log("Headroom (max):", formatUba(capHeadroomUBA));
    console.log(
      "Above the headroom executeDirectMinting reverts with MintingCapExceeded (no delay).",
    );
  } else {
    console.log("Minting cap disabled (mintingCapAMG = 0).");
  }
  console.log();

  // 13. `unblockDirectMintingsUntil` only accepts timestamps in the past: it
  //     retroactively releases mintings that were already delayed and started
  //     before that timestamp - including large-minting delays. It does not
  //     exempt new mintings from the hourly/daily limiter, so it plays no part
  //     in the pre-flight below.
  console.log("=== Other flags ===");
  if (unblockUntilTimestamp > 0n) {
    console.log(
      "Delayed mintings started before",
      formatTimestamp(unblockUntilTimestamp, now),
      "have been released by governance.",
    );
  } else {
    console.log("No governance unblock recorded (unblockUntilTimestamp = 0).");
  }
  console.log(
    "Large minting threshold:",
    formatUba(largeThresholdUBA),
    "(inclusive)",
  );
  console.log(
    "Large minting delay:    ",
    formatDuration(Number(largeDelaySeconds)),
  );
  console.log();

  // 14. Pre-flight gate: largest single mint that is neither delayed nor
  //     rejected - one AMG below the large-mint threshold, one AMG below each
  //     window cap, and within the global cap headroom.
  const largestNonLargeUBA = subOrZero(largeThresholdUBA, amgGranularityUBA);
  let safeRemainingUBA = bigintMin(
    bigintMin(hourly.maxWithoutDelayUBA, daily.maxWithoutDelayUBA),
    largestNonLargeUBA,
  );
  if (mintingCapEnabled) {
    safeRemainingUBA = bigintMin(safeRemainingUBA, capHeadroomUBA);
  }
  console.log(
    "Maximum single mint with no delay and no revert:",
    formatUba(safeRemainingUBA),
  );
  console.log();

  // 15. Pre-flight a concrete mint amount.
  const preflightMintXrp = Number(
    process.env.MINT_PREFLIGHT_XRP ?? DEFAULT_PREFLIGHT_MINT_XRP,
  );
  // The contract floors the underlying amount to whole AMG before comparing it
  // against the thresholds, so mirror that here.
  const receivedAmountUBA = BigInt(xrpToDrops(preflightMintXrp.toString()));
  const proposedAmountUBA =
    (receivedAmountUBA / amgGranularityUBA) * amgGranularityUBA;

  console.log(`=== Pre-flight: ${preflightMintXrp} XRP mint ===`);

  if (mintingCapEnabled && proposedAmountUBA > capHeadroomUBA) {
    console.log(
      "Result: would revert with MintingCapExceeded - the global minting cap has no headroom.",
    );
    console.log(
      "The minting cap is checked before the rate limits, so no delay event is emitted.",
    );
    console.log();
    return;
  }

  const preflight = computeDirectMintingExecutionAllowedAt({
    now,
    proposedAmountUBA,
    hourly: {
      effectiveStart: hourly.effectiveStart,
      usedUBA: hourly.usedUBA,
      limitUBA: hourlyLimitUBA,
      windowSizeSeconds: HOURLY_WINDOW_SECONDS,
    },
    daily: {
      effectiveStart: daily.effectiveStart,
      usedUBA: daily.usedUBA,
      limitUBA: dailyLimitUBA,
      windowSizeSeconds: DAILY_WINDOW_SECONDS,
    },
    largeThresholdUBA,
    largeDelaySeconds,
  });

  if (!preflight.delayed) {
    console.log("Result: executes immediately (no rate-limit delay).");
  } else {
    console.log(
      `Result: would emit ${preflight.event} with executionAllowedAt`,
      formatTimestamp(preflight.executionAllowedAt, now),
    );
    console.log("Binding delay:", preflight.delayReason);
    if (preflight.hourlyAt !== undefined && preflight.dailyAt !== undefined) {
      console.log(
        "Hourly window would allow at:",
        formatTimestamp(preflight.hourlyAt, now),
      );
      console.log(
        "Daily window would allow at: ",
        formatTimestamp(preflight.dailyAt, now),
      );
    } else {
      console.log(
        "Large mintings skip the hourly/daily limiter entirely and consume no window capacity.",
      );
    }
    console.log(
      "Execution needs a second executeDirectMinting call with the same FDC proof, at or after executionAllowedAt.",
    );
  }
  console.log();
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
