import { dropsToXrp } from "xrpl";
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

// 4. Print one window.
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
  // 5. Resolve `AssetManagerFXRP` through the Flare Contract Registry.
  const assetManagerAddress =
    await getContractAddressByName("AssetManagerFXRP");
  console.log("AssetManagerFXRP address:", assetManagerAddress, "\n");

  // 6. Read AMG granularity, hourly and daily caps, raw limiter state, the
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

  // 7. Limiter state is returned as raw AMG (uint64); convert to UBA via
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

  // 8. Honor the unblock flag. While `directMintingsUnblockUntilTimestamp`
  //    is in the future, governance has temporarily disabled the limiter
  //    and the full caps are available.
  console.log("=== Other flags ===");
  if (limiterDisabled) {
    console.log(
      "Limiter DISABLED until:",
      formatTimestamp(unblockUntilTimestamp, now),
      "— hourly/daily caps are not enforced right now.",
    );
  } else {
    console.log(
      "Limiter active (unblockUntilTimestamp =",
      unblockUntilTimestamp.toString() + ")",
    );
  }
  console.log("Large minting threshold:", formatUba(largeThresholdUBA));
  console.log("Large minting delay:    ", `${largeDelaySeconds.toString()}s`);
  console.log();

  // 9. Pre-flight gate: how much can a single mint safely request right now
  //    without being delayed? It must fit both the hourly and daily windows.
  const hourlyHeadroomUBA = limiterDisabled
    ? hourlyLimitUBA
    : hourly.remainingUBA;
  const dailyHeadroomUBA = limiterDisabled ? dailyLimitUBA : daily.remainingUBA;
  const safeRemainingUBA = bigintMin(hourlyHeadroomUBA, dailyHeadroomUBA);
  console.log(
    "Maximum single mint that fits both windows:",
    formatUba(safeRemainingUBA),
  );
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
