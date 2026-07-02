import { dropsToXrp, xrpToDrops } from "xrpl";
import { getContractAddressByName } from "./utils/flare-contract-registry";
import {
  getAssetMintingGranularityUBA,
  getDirectMintingDailyLimitUBA,
  getDirectMintingDailyLimiterState,
  getDirectMintingHourlyLimitUBA,
  getDirectMintingHourlyLimiterState,
  getDirectMintingLargeMintingDelaySeconds,
  getDirectMintingLargeMintingThresholdUBA,
  getDirectMintingsUnblockUntilTimestamp,
} from "./utils/fassets";

// 1. Window sizes are clock-aligned tumbling, not rolling. Hourly snaps to
//    UTC hour boundaries; daily snaps to 00:00 UTC.
const HOURLY_WINDOW_SECONDS = 3600n;
const DAILY_WINDOW_SECONDS = 86400n;

// Example mint to pre-flight (net FXRP, before fees). Override with MINT_PREFLIGHT_XRP.
const DEFAULT_PREFLIGHT_MINT_XRP = 10;

// 2. Format helpers.
function formatUba(uba: bigint): string {
  return `${uba.toString()} UBA (${dropsToXrp(uba.toString())} XRP)`;
}

function formatTimestamp(secondsSinceEpoch: bigint, now: bigint): string {
  const iso = new Date(Number(secondsSinceEpoch) * 1000).toISOString();
  const delta = Number(secondsSinceEpoch - now);
  const relative = delta >= 0 ? `in ${delta}s` : `${-delta}s ago`;
  return `${iso} (${relative})`;
}

function bigintMin(a: bigint, b: bigint): bigint {
  return a < b ? a : b;
}

function bigintMax(a: bigint, b: bigint): bigint {
  return a > b ? a : b;
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
}: {
  now: bigint;
  windowStartTimestamp: bigint;
  mintedInCurrentWindowUBA: bigint;
  limitUBA: bigint;
  windowSizeSeconds: bigint;
}) {
  let effectiveStart = windowStartTimestamp;
  let usedUBA = mintedInCurrentWindowUBA;

  if (
    windowStartTimestamp > 0n &&
    now >= windowStartTimestamp + windowSizeSeconds
  ) {
    const windowsElapsed = (now - windowStartTimestamp) / windowSizeSeconds;
    effectiveStart = windowStartTimestamp + windowsElapsed * windowSizeSeconds;
    const drained = windowsElapsed * limitUBA;
    usedUBA = drained >= usedUBA ? 0n : usedUBA - drained;
  }

  const remainingUBA = limitUBA > usedUBA ? limitUBA - usedUBA : 0n;
  const nextResetAt = effectiveStart + windowSizeSeconds;

  return { effectiveStart, usedUBA, remainingUBA, nextResetAt };
}

// 4. Window delay mirrors MintingRateLimiter: overflow is scheduled into the
//    current tumbling window proportionally to accumulated minted volume.
function computeWindowExecutionAllowedAt({
  now,
  effectiveStart,
  usedUBA,
  proposedAmountUBA,
  limitUBA,
  windowSizeSeconds,
  limiterDisabled,
}: {
  now: bigint;
  effectiveStart: bigint;
  usedUBA: bigint;
  proposedAmountUBA: bigint;
  limitUBA: bigint;
  windowSizeSeconds: bigint;
  limiterDisabled: boolean;
}): bigint {
  if (limiterDisabled || limitUBA === 0n || proposedAmountUBA === 0n) {
    return now;
  }

  const mintedAfter = usedUBA + proposedAmountUBA;
  if (mintedAfter <= limitUBA) {
    return now;
  }

  return effectiveStart + (windowSizeSeconds * mintedAfter) / limitUBA;
}

// 5. Large-mint delay is independent of the hourly/daily windows. Amounts
//    strictly above the threshold are held for a fixed duration from `now`.
function computeLargeMintExecutionAllowedAt({
  now,
  proposedAmountUBA,
  largeThresholdUBA,
  largeDelaySeconds,
}: {
  now: bigint;
  proposedAmountUBA: bigint;
  largeThresholdUBA: bigint;
  largeDelaySeconds: bigint;
}): bigint {
  if (proposedAmountUBA > largeThresholdUBA) {
    return now + largeDelaySeconds;
  }
  return now;
}

function computeDirectMintingExecutionAllowedAt({
  now,
  proposedAmountUBA,
  hourly,
  daily,
  largeThresholdUBA,
  largeDelaySeconds,
  limiterDisabled,
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
  limiterDisabled: boolean;
}) {
  const hourlyAt = computeWindowExecutionAllowedAt({
    now,
    effectiveStart: hourly.effectiveStart,
    usedUBA: hourly.usedUBA,
    proposedAmountUBA,
    limitUBA: hourly.limitUBA,
    windowSizeSeconds: hourly.windowSizeSeconds,
    limiterDisabled,
  });
  const dailyAt = computeWindowExecutionAllowedAt({
    now,
    effectiveStart: daily.effectiveStart,
    usedUBA: daily.usedUBA,
    proposedAmountUBA,
    limitUBA: daily.limitUBA,
    windowSizeSeconds: daily.windowSizeSeconds,
    limiterDisabled,
  });
  const largeAt = computeLargeMintExecutionAllowedAt({
    now,
    proposedAmountUBA,
    largeThresholdUBA,
    largeDelaySeconds,
  });

  const executionAllowedAt = bigintMax(hourlyAt, bigintMax(dailyAt, largeAt));
  const delayed = executionAllowedAt > now;
  const delayReasons: string[] = [];
  if (hourlyAt === executionAllowedAt && hourlyAt > now) {
    delayReasons.push("hourly window");
  }
  if (dailyAt === executionAllowedAt && dailyAt > now) {
    delayReasons.push("daily window");
  }
  if (largeAt === executionAllowedAt && largeAt > now) {
    delayReasons.push("large-mint threshold");
  }

  return {
    executionAllowedAt,
    delayed,
    delayReasons,
    hourlyAt,
    dailyAt,
    largeAt,
  };
}

// 6. Print one window.
function printWindow(
  label: string,
  opts: {
    limitUBA: bigint;
    usedUBA: bigint;
    remainingUBA: bigint;
    effectiveStart: bigint;
    nextResetAt: bigint;
    now: bigint;
  },
) {
  const { limitUBA, usedUBA, remainingUBA, effectiveStart, nextResetAt, now } =
    opts;
  const usedPct =
    limitUBA === 0n ? 0 : Number((usedUBA * 10000n) / limitUBA) / 100;
  const row = (key: string, value: string) =>
    console.log(`${key.padEnd(17)} ${value}`);
  console.log(`=== ${label} ===`);
  row("Limit:", formatUba(limitUBA));
  row("Used:", `${formatUba(usedUBA)} (${usedPct.toFixed(2)}%)`);
  row("Remaining:", formatUba(remainingUBA));
  row("Window started:", formatTimestamp(effectiveStart, now));
  row("Window resets at:", formatTimestamp(nextResetAt, now));
  console.log();
}

async function main() {
  // 7. Resolve `AssetManagerFXRP` through the Flare Contract Registry.
  const assetManagerAddress =
    await getContractAddressByName("AssetManagerFXRP");
  console.log("AssetManagerFXRP address:", assetManagerAddress, "\n");

  // 8. Read AMG granularity, hourly and daily caps, raw limiter state, the
  //    unblock flag, and the large-minting threshold and delay in parallel.
  const [
    amgGranularityUBA,
    hourlyLimitUBA,
    dailyLimitUBA,
    hourlyState,
    dailyState,
    unblockUntilTimestamp,
    largeThresholdUBA,
    largeDelaySeconds,
  ] = await Promise.all([
    getAssetMintingGranularityUBA(assetManagerAddress),
    getDirectMintingHourlyLimitUBA(assetManagerAddress),
    getDirectMintingDailyLimitUBA(assetManagerAddress),
    getDirectMintingHourlyLimiterState(assetManagerAddress),
    getDirectMintingDailyLimiterState(assetManagerAddress),
    getDirectMintingsUnblockUntilTimestamp(assetManagerAddress),
    getDirectMintingLargeMintingThresholdUBA(assetManagerAddress),
    getDirectMintingLargeMintingDelaySeconds(assetManagerAddress),
  ]);

  const now = BigInt(Math.floor(Date.now() / 1000));
  const limiterDisabled = unblockUntilTimestamp > now;

  // 9. Limiter state is returned as raw AMG (uint64); convert to UBA via
  //    `assetMintingGranularityUBA` before passing into the window math.
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

  // 10. Honor the unblock flag. While `directMintingsUnblockUntilTimestamp`
  //     is in the future, governance has temporarily disabled the hourly/daily
  //     limiter. Large-mint delay still applies.
  console.log("=== Other flags ===");
  if (limiterDisabled) {
    console.log(
      "Hourly/daily limiter DISABLED until:",
      formatTimestamp(unblockUntilTimestamp, now),
      "— window caps are not enforced right now.",
    );
    console.log(
      "Large-mint delay is still enforced above",
      formatUba(largeThresholdUBA) + ".",
    );
  } else {
    console.log(
      "Hourly/daily limiter active (unblockUntilTimestamp =",
      unblockUntilTimestamp.toString() + ")",
    );
  }
  console.log("Large minting threshold:", formatUba(largeThresholdUBA));
  console.log("Large minting delay:    ", `${largeDelaySeconds.toString()}s`);
  console.log();

  // 11. Pre-flight gate: largest single mint with no delay from any mechanism.
  const hourlyHeadroomUBA = limiterDisabled
    ? hourlyLimitUBA
    : hourly.remainingUBA;
  const dailyHeadroomUBA = limiterDisabled ? dailyLimitUBA : daily.remainingUBA;
  const safeRemainingUBA = bigintMin(
    bigintMin(hourlyHeadroomUBA, dailyHeadroomUBA),
    largeThresholdUBA,
  );
  console.log(
    "Maximum single mint with no delay (hourly, daily, and large-mint):",
    formatUba(safeRemainingUBA),
  );
  console.log();

  // 12. Pre-flight a concrete mint amount, including large-mint delay.
  const preflightMintXrp = Number(
    process.env.MINT_PREFLIGHT_XRP ?? DEFAULT_PREFLIGHT_MINT_XRP,
  );
  const proposedAmountUBA = BigInt(xrpToDrops(preflightMintXrp.toString()));
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
    limiterDisabled,
  });

  console.log(`=== Pre-flight: ${preflightMintXrp} XRP mint ===`);
  if (!preflight.delayed) {
    console.log("Result: executes immediately (no rate-limit delay).");
  } else {
    console.log(
      "Result: would emit DirectMintingDelayed with executionAllowedAt",
      formatTimestamp(preflight.executionAllowedAt, now),
    );
    console.log(
      "Binding delay:",
      preflight.delayReasons.length > 0
        ? preflight.delayReasons.join(", ")
        : "unknown",
    );
    console.log(
      "Hourly window would allow at:",
      formatTimestamp(preflight.hourlyAt, now),
    );
    console.log(
      "Daily window would allow at:",
      formatTimestamp(preflight.dailyAt, now),
    );
    console.log(
      "Large-mint rule would allow at:",
      formatTimestamp(preflight.largeAt, now),
    );
    console.log(
      "The executor must wait, then call executeDirectMinting again with the same FDC proof.",
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
