/**
 * Upshift Tokenized Vault Claim Script
 *
 * This script claims assets from a previously requested redemption.
 * Use requestRedeem.ts first to schedule a redemption.
 *
 */

import { web3 } from "hardhat";
import { formatUnits } from "ethers";

import { ITokenizedVaultInstance } from "../../typechain-types/contracts/upshift/ITokenizedVault";
import { IERC20Instance } from "../../typechain-types/@openzeppelin/contracts/token/ERC20/IERC20";

const VAULT_ADDRESS = "0x24c1a47cD5e8473b64EAB2a94515a196E10C7C81";
const RECEIVER_ADDRESS = ""; // Leave empty to use sender's address

// Update these with the date from your requestRedeem call
const YEAR = 2026;
const MONTH = 1;
const DAY = 23;

const ITokenizedVault = artifacts.require("ITokenizedVault");
const IERC20 = artifacts.require("IERC20");
const IERC20Metadata = artifacts.require("IERC20Metadata");
const IFAsset = artifacts.require("IFAsset");

async function getReferenceAssetInfo(vault: ITokenizedVaultInstance) {
  const referenceAsset = await vault.asset();
  const refAsset = await IFAsset.at(referenceAsset);
  const refDecimals = Number(await refAsset.decimals());
  const refSymbol = await refAsset.symbol();

  return { referenceAsset, refAsset, refDecimals, refSymbol };
}

async function checkPendingRedemption(
  vault: ITokenizedVaultInstance,
  year: number,
  month: number,
  day: number,
  receiverAddr: string,
) {
  console.log("\n1. Checking pending redemption...");
  const shares = await vault.getBurnableAmountByReceiver(
    year,
    month,
    day,
    receiverAddr,
  );

  if (BigInt(shares.toString()) === 0n) {
    console.log("No shares found for this date and receiver address");
    return null;
  }

  return shares;
}

async function getLPTokenInfo(vault: ITokenizedVaultInstance) {
  const lpTokenAddress = await vault.lpTokenAddress();
  const lpToken = await IERC20Metadata.at(lpTokenAddress);
  const lpDecimals = Number(await lpToken.decimals());
  const lpSymbol = await lpToken.symbol();

  return { lpTokenAddress, lpDecimals, lpSymbol };
}

async function previewRedemption(
  vault: ITokenizedVaultInstance,
  shares: any,
  refDecimals: number,
  refSymbol: string,
) {
  console.log("\n2. Previewing redemption...");
  const preview = await vault.previewRedemption(shares.toString(), false);
  const assetsAmount = preview[0];
  const assetsAfterFee = preview[1];

  console.log(
    `Assets (before fee): ${formatUnits(assetsAmount.toString(), refDecimals)} ${refSymbol}`,
  );
  console.log(
    `Assets (after fee): ${formatUnits(assetsAfterFee.toString(), refDecimals)} ${refSymbol}`,
  );
  const fee =
    BigInt(assetsAmount.toString()) - BigInt(assetsAfterFee.toString());
  console.log(`Fee: ${formatUnits(fee.toString(), refDecimals)} ${refSymbol}`);

  return { assetsAmount, assetsAfterFee };
}

async function checkIfClaimable(year: number, month: number, day: number) {
  console.log("\n3. Checking if claimable...");
  const block = await web3.eth.getBlock("latest");
  const blockTimestamp = BigInt(block.timestamp);
  const claimableDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const claimableEpoch = BigInt(Math.floor(claimableDate.getTime() / 1000));
  const TIMESTAMP_MANIPULATION_WINDOW = 300n; // 5 minutes

  console.log(`Current Timestamp: ${blockTimestamp.toString()}`);
  console.log(`Claimable Epoch: ${claimableEpoch.toString()}`);

  const canClaim =
    blockTimestamp + TIMESTAMP_MANIPULATION_WINDOW >= claimableEpoch;

  if (!canClaim) {
    const timeUntil =
      claimableEpoch - blockTimestamp - TIMESTAMP_MANIPULATION_WINDOW;
    const hoursUntil = Number(timeUntil) / 3600;
    console.log("Cannot claim yet!");
    console.log(`Wait approximately ${hoursUntil.toFixed(2)} more hours`);
    console.log(
      `Claimable after: ${new Date(Number(claimableEpoch) * 1000).toISOString()}`,
    );
    return false;
  }
  console.log("Ready to claim!");
  return true;
}

async function getBalanceBefore(
  referenceAsset: string,
  receiverAddr: string,
  refDecimals: number,
  refSymbol: string,
) {
  console.log("\n4. Checking receiver balance before...");
  const refToken: IERC20Instance = await IERC20.at(referenceAsset);
  const balanceBefore = await refToken.balanceOf(receiverAddr);
  console.log(
    `Balance: ${formatUnits(balanceBefore.toString(), refDecimals)} ${refSymbol}`,
  );

  return { refToken, balanceBefore };
}

async function executeClaim(
  vault: ITokenizedVaultInstance,
  year: number,
  month: number,
  day: number,
  receiverAddr: string,
) {
  console.log("\n5. Claiming...");
  const claimTx = await vault.claim(year, month, day, receiverAddr);
  console.log(
    "Claim: (tx:",
    claimTx.tx,
    ", block:",
    claimTx.receipt.blockNumber,
    ")",
  );
}

async function verifyClaim(
  refToken: IERC20Instance,
  receiverAddr: string,
  balanceBefore: any,
  assetsAfterFee: any,
  refDecimals: number,
  refSymbol: string,
) {
  console.log("\n6. Verifying claim...");
  const balanceAfter = await refToken.balanceOf(receiverAddr);
  const received =
    BigInt(balanceAfter.toString()) - BigInt(balanceBefore.toString());
  console.log(
    `Balance After: ${formatUnits(balanceAfter.toString(), refDecimals)} ${refSymbol}`,
  );
  console.log(
    `Received: ${formatUnits(received.toString(), refDecimals)} ${refSymbol}`,
  );

  if (received === BigInt(assetsAfterFee.toString())) {
    console.log("Claim successful!");
  } else {
    console.log(
      "Received amount differs from expected (may be due to rounding)",
    );
  }
}

async function main() {
  // 1. Initialize: Get user account from Hardhat network
  const accounts = await web3.eth.getAccounts();
  const userAddress = accounts[0];
  const receiverAddr = RECEIVER_ADDRESS || userAddress;

  console.log("CLAIM REDEMPTION\n");
  console.log("Vault Address:", VAULT_ADDRESS);
  console.log("User Address:", userAddress);
  console.log("Receiver Address:", receiverAddr);
  console.log(
    `Redemption Date: ${YEAR}-${String(MONTH).padStart(2, "0")}-${String(DAY).padStart(2, "0")}`,
  );

  // 2. Connect to the vault contract instance
  const vault: ITokenizedVaultInstance =
    await ITokenizedVault.at(VAULT_ADDRESS);

  // 3. Get reference asset info
  const { referenceAsset, refDecimals, refSymbol } =
    await getReferenceAssetInfo(vault);

  // 4. Check pending redemption
  const shares = await checkPendingRedemption(
    vault,
    YEAR,
    MONTH,
    DAY,
    receiverAddr,
  );
  if (!shares) return;

  // 5. Get LP token info
  const { lpTokenAddress, lpDecimals, lpSymbol } = await getLPTokenInfo(vault);
  console.log(
    `Shares to claim: ${formatUnits(shares.toString(), lpDecimals)} ${lpSymbol}`,
  );
  console.log(`LP Token Address: ${lpTokenAddress}`);

  // 6. Preview redemption
  const { assetsAfterFee } = await previewRedemption(
    vault,
    shares,
    refDecimals,
    refSymbol,
  );

  // 7. Check if claimable
  const canClaim = await checkIfClaimable(YEAR, MONTH, DAY);
  if (!canClaim) return;

  // 8. Get balance before
  const { refToken, balanceBefore } = await getBalanceBefore(
    referenceAsset,
    receiverAddr,
    refDecimals,
    refSymbol,
  );

  // 9. Execute claim
  await executeClaim(vault, YEAR, MONTH, DAY, receiverAddr);

  // 10. Verify claim
  await verifyClaim(
    refToken,
    receiverAddr,
    balanceBefore,
    assetsAfterFee,
    refDecimals,
    refSymbol,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
