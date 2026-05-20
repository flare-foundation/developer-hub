import { encodeAbiParameters, encodeFunctionData, formatUnits, keccak256, parseAbi, type Address } from "viem";
import { Client, Wallet } from "xrpl";
import { abi as ERC20Abi } from "../abis/ERC20";
import { abi as MorphoBlueAbi } from "../abis/MorphoBlue";
import { account, publicClient, walletClient } from "../utils/client";
import { sendMemoFieldInstruction } from "../utils/smart-accounts";

// Coston2 Morpho Blue test stack (mock tokens, mock oracle, mock IRM).
export const MORPHO_BLUE_ADDRESS = "0x8aE0b3CE90F16E88063516f2d88C8ac2ab552d95" as Address;
export const LOAN_TOKEN_ADDRESS = "0x4984B127c3065f4348858fAFdBa020f2c8633905" as Address;
export const COLLATERAL_TOKEN_ADDRESS = "0x98bf2F2fF322d5eb61D6aE04Df50856525a85D16" as Address;
export const ORACLE_ADDRESS = "0x1e80830e9903c839Db803442c976DD2360D47FE0" as Address;
export const IRM_ADDRESS = "0xDC275701300865D882D44ffe7cb1153535636d1a" as Address;
export const LLTV = 860000000000000000n; // 86 %

// MorphoMarketShim deployed on Coston2 — see flare-hardhat-starter/scripts/morpho/deploys.ts.
export const MORPHO_MARKET_SHIM_ADDRESS = "0x33d81a1d7986bB3AbAB4F67Ad6117233ADd6F87A" as Address;

export const WAD = 10n ** 18n;
export const MAX_UINT256 = 2n ** 256n - 1n;
// Allowance >= this counts as "approved unlimited" for setup-skip purposes.
const APPROVAL_THRESHOLD = 2n ** 255n;

// The mock collateral and loan tokens expose an unauthenticated setBalance(account, amount).
export const MOCK_ERC20_ABI = parseAbi(["function setBalance(address account, uint256 amount)"]);
export const ORACLE_ABI = parseAbi(["function price() view returns (uint256)"]);
export const POSITION_ABI = parseAbi([
  "function position(bytes32 id, address user) view returns (uint256 supplyShares, uint128 borrowShares, uint128 collateral)",
]);

export const marketParams = {
  loanToken: LOAN_TOKEN_ADDRESS,
  collateralToken: COLLATERAL_TOKEN_ADDRESS,
  oracle: ORACLE_ADDRESS,
  irm: IRM_ADDRESS,
  lltv: LLTV,
} as const;

// Id = keccak256(abi.encode(marketParams)) — matches MarketParamsLib.id() in morpho-blue.
export const marketId = keccak256(
  encodeAbiParameters(
    [
      {
        type: "tuple",
        components: [
          { name: "loanToken", type: "address" },
          { name: "collateralToken", type: "address" },
          { name: "oracle", type: "address" },
          { name: "irm", type: "address" },
          { name: "lltv", type: "uint256" },
        ],
      },
    ],
    [marketParams]
  )
);

// Reads the loan and collateral token decimals and derives the oracle's price
// scale per Morpho Blue's IOracle convention: 10 ** (36 + loanDecimals - collateralDecimals).
// The Coston2 example mock tokens are minimal and don't implement decimals() —
// fall back to 18 there (matches the values they're actually scaled to).
async function readDecimalsOrDefault(tokenAddress: Address): Promise<number> {
  try {
    return (await publicClient.readContract({
      address: tokenAddress,
      abi: ERC20Abi,
      functionName: "decimals",
    })) as number;
  } catch {
    return 18;
  }
}

export async function fetchMarketDecimals() {
  const [loanDecimals, collateralDecimals] = await Promise.all([
    readDecimalsOrDefault(LOAN_TOKEN_ADDRESS),
    readDecimalsOrDefault(COLLATERAL_TOKEN_ADDRESS),
  ]);
  const oraclePriceScale = 10n ** (36n + BigInt(loanDecimals) - BigInt(collateralDecimals));
  return { loanDecimals, collateralDecimals, oraclePriceScale };
}

export async function mintMock(tokenAddress: Address, recipient: Address, amount: bigint) {
  const { request } = await publicClient.simulateContract({
    account,
    address: tokenAddress,
    abi: MOCK_ERC20_ABI,
    functionName: "setBalance",
    args: [recipient, amount],
  });
  const transactionHash = await walletClient.writeContract(request);
  await publicClient.waitForTransactionReceipt({ hash: transactionHash });
}

// Brings the smart account → shim authorization state to "fully set up": the
// shim is approved for both tokens and authorized on Morpho. Each action is
// emitted as its own XRPL memo because two of these calls do not fit in a
// single 1024-byte memo together (a single call already runs ~810 bytes).
// Idempotent: reads on-chain state first and skips any action already done.
export async function ensureShimSetup({
  personalAccount,
  xrplClient,
  xrplWallet,
  amountXrp,
}: {
  personalAccount: Address;
  xrplClient: Client;
  xrplWallet: Wallet;
  amountXrp: number;
}) {
  const [collateralAllowance, loanAllowance, morphoAuthorized] = (await Promise.all([
    publicClient.readContract({
      address: COLLATERAL_TOKEN_ADDRESS,
      abi: ERC20Abi,
      functionName: "allowance",
      args: [personalAccount, MORPHO_MARKET_SHIM_ADDRESS],
    }),
    publicClient.readContract({
      address: LOAN_TOKEN_ADDRESS,
      abi: ERC20Abi,
      functionName: "allowance",
      args: [personalAccount, MORPHO_MARKET_SHIM_ADDRESS],
    }),
    publicClient.readContract({
      address: MORPHO_BLUE_ADDRESS,
      abi: MorphoBlueAbi,
      functionName: "isAuthorized",
      args: [personalAccount, MORPHO_MARKET_SHIM_ADDRESS],
    }),
  ])) as [bigint, bigint, boolean];

  if (collateralAllowance >= APPROVAL_THRESHOLD && loanAllowance >= APPROVAL_THRESHOLD && morphoAuthorized) {
    console.log("Smart account → shim setup already complete — skipping setup memos.\n");
    return;
  }

  const sharedMemoFields = { amountXrp, personalAccount, xrplClient, xrplWallet };

  if (collateralAllowance < APPROVAL_THRESHOLD) {
    await sendMemoFieldInstruction({
      ...sharedMemoFields,
      label: "approve-collateral",
      calls: [
        {
          target: COLLATERAL_TOKEN_ADDRESS,
          value: 0n,
          data: encodeFunctionData({
            abi: ERC20Abi,
            functionName: "approve",
            args: [MORPHO_MARKET_SHIM_ADDRESS, MAX_UINT256],
          }),
        },
      ],
    });
  }
  if (loanAllowance < APPROVAL_THRESHOLD) {
    await sendMemoFieldInstruction({
      ...sharedMemoFields,
      label: "approve-loan",
      calls: [
        {
          target: LOAN_TOKEN_ADDRESS,
          value: 0n,
          data: encodeFunctionData({
            abi: ERC20Abi,
            functionName: "approve",
            args: [MORPHO_MARKET_SHIM_ADDRESS, MAX_UINT256],
          }),
        },
      ],
    });
  }
  if (!morphoAuthorized) {
    await sendMemoFieldInstruction({
      ...sharedMemoFields,
      label: "set-authorization",
      calls: [
        {
          target: MORPHO_BLUE_ADDRESS,
          value: 0n,
          data: encodeFunctionData({
            abi: MorphoBlueAbi,
            functionName: "setAuthorization",
            args: [MORPHO_MARKET_SHIM_ADDRESS, true],
          }),
        },
      ],
    });
  }
}

export async function getAndLogState(
  label: string,
  smartAccount: Address,
  marketDecimals: { loanDecimals: number; collateralDecimals: number }
) {
  const [position, collateralBalance, loanBalance] = await Promise.all([
    publicClient.readContract({
      address: MORPHO_BLUE_ADDRESS,
      abi: POSITION_ABI,
      functionName: "position",
      args: [marketId, smartAccount],
    }),
    publicClient.readContract({
      address: COLLATERAL_TOKEN_ADDRESS,
      abi: ERC20Abi,
      functionName: "balanceOf",
      args: [smartAccount],
    }) as Promise<bigint>,
    publicClient.readContract({
      address: LOAN_TOKEN_ADDRESS,
      abi: ERC20Abi,
      functionName: "balanceOf",
      args: [smartAccount],
    }) as Promise<bigint>,
  ]);
  const [supplyShares, borrowShares, collateral] = position;

  // Morpho Blue's VIRTUAL_SHARES = 1e6: at market init `shares = assets * 1e6`,
  // so loan-token-denominated supply/borrow are recovered by formatUnits with
  // (loanDecimals + 6). The conversion drifts slightly as interest accrues.
  const sharesScale = marketDecimals.loanDecimals + 6;
  console.log(`=== ${label} ===`);
  console.log("  position supply (≈loan tokens):  ", formatUnits(supplyShares, sharesScale));
  console.log("  position borrow (≈loan tokens):  ", formatUnits(borrowShares, sharesScale));
  console.log("  position collateral:             ", formatUnits(collateral, marketDecimals.collateralDecimals));
  console.log("  smart-account collateral balance:", formatUnits(collateralBalance, marketDecimals.collateralDecimals));
  console.log("  smart-account loan-token balance:", formatUnits(loanBalance, marketDecimals.loanDecimals));
  console.log("");

  return { supplyShares, borrowShares, collateral };
}
