/**
 * FXRP Gasless Payment Utilities
 *
 * This module provides utilities for users to sign gasless payment requests
 * using EIP-712 typed data signatures.
 *
 */

// 1. Import the necessary libraries
import { ethers, Contract, Wallet, Provider } from "ethers";
import { erc20Abi, type TypedDataDomain, type TypedData } from "viem";
import { GaslessPaymentForwarder__factory } from "../typechain-types/factories/contracts/GaslessPaymentForwarder__factory";

// 2. Define the default deadline, EIP-712 domain and types

// Default deadline: 30 minutes from now
const DEFAULT_DEADLINE_SECONDS = 30 * 60;

// EIP-712 domain (viem TypedDataDomain format)
export const EIP712_DOMAIN: TypedDataDomain = {
  name: "GaslessPaymentForwarder",
  version: "1",
};

// EIP-712 types (viem TypedData format - compatible with ethers signTypedData)
export const PAYMENT_REQUEST_TYPES = {
  PaymentRequest: [
    { name: "from", type: "address" as const },
    { name: "to", type: "address" as const },
    { name: "amount", type: "uint256" as const },
    { name: "fee", type: "uint256" as const },
    { name: "nonce", type: "uint256" as const },
    { name: "deadline", type: "uint256" as const },
  ],
} satisfies TypedData;

// Type definitions
export interface SignPaymentParams {
  forwarderAddress: string;
  to: string;
  amount: bigint;
  fee: bigint;
  nonce: bigint;
  deadline: number;
  chainId: bigint;
}

export interface PaymentRequest {
  from: string;
  to: string;
  amount: string;
  fee: string;
  deadline: number;
  signature: string;
  meta: {
    amountFormatted: string;
    feeFormatted: string;
    nonce: string;
    chainId: string;
  };
}

export interface ApprovalResult {
  transactionHash: string;
  blockNumber: number | null;
  fxrpAddress: string;
  approved: string;
}

export interface UserStatus {
  fxrpAddress: string;
  balance: string;
  balanceFormatted: string;
  allowance: string;
  allowanceFormatted: string;
  nonce: string;
  needsApproval: boolean;
}

// 3. Parse amount from human-readable string using token decimals
export function parseAmount(amount: string | number, decimals: number): bigint {
  return ethers.parseUnits(amount.toString(), decimals);
}

// 4. Format amount from raw units to human-readable string
export function formatAmount(drops: bigint | string, decimals: number): string {
  return ethers.formatUnits(drops, decimals);
}

// 5. Get FXRP token decimals from the forwarder contract using the provider
export async function getTokenDecimals(
  provider: Provider,
  forwarderAddress: string,
): Promise<number> {
  const forwarder = GaslessPaymentForwarder__factory.connect(
    forwarderAddress,
    provider,
  );
  const fxrpAddress: string = await forwarder.fxrp();
  const fxrp = new Contract(
    fxrpAddress,
    erc20Abi as ethers.InterfaceAbi,
    provider,
  );
  return (await fxrp.decimals()) as number;
}

// 6. Get the current nonce for a user from the forwarder contract
export async function getNonce(
  provider: Provider,
  forwarderAddress: string,
  userAddress: string,
): Promise<bigint> {
  const forwarder = GaslessPaymentForwarder__factory.connect(
    forwarderAddress,
    provider,
  );
  return await forwarder.getNonce(userAddress);
}

// 7. Get the minimum relayer fee from the forwarder contract
export async function getRelayerFee(
  provider: Provider,
  forwarderAddress: string,
): Promise<bigint> {
  const forwarder = GaslessPaymentForwarder__factory.connect(
    forwarderAddress,
    provider,
  );
  return await forwarder.relayerFee();
}

// 8. Sign a payment request using EIP-712
export async function signPaymentRequest(
  wallet: Wallet,
  params: SignPaymentParams,
): Promise<string> {
  const { forwarderAddress, to, amount, fee, nonce, deadline, chainId } =
    params;

  // Build the EIP-712 domain
  const domain = {
    ...EIP712_DOMAIN,
    chainId: chainId,
    verifyingContract: forwarderAddress,
  };

  // Build the message
  const message = {
    from: wallet.address,
    to: to,
    amount: amount,
    fee: fee,
    nonce: nonce,
    deadline: deadline,
  };

  // Sign the typed data
  const signature = await wallet.signTypedData(
    domain,
    PAYMENT_REQUEST_TYPES,
    message,
  );

  return signature;
}

// 9. Create a complete payment request ready for submission to a relayer
export async function createPaymentRequest(
  wallet: Wallet,
  forwarderAddress: string,
  to: string,
  amount: string | number,
  fee: string | number | null = null,
  deadlineSeconds: number = DEFAULT_DEADLINE_SECONDS,
): Promise<PaymentRequest> {
  const provider = wallet.provider;
  if (!provider) {
    throw new Error("Wallet must be connected to a provider");
  }

  // Get chain ID and token decimals
  const [network, decimals] = await Promise.all([
    provider.getNetwork(),
    getTokenDecimals(provider, forwarderAddress),
  ]);
  const chainId = network.chainId;

  // Get current nonce
  const nonce = await getNonce(provider, forwarderAddress, wallet.address);

  // Get fee (use provided or contract default)
  let feeDrops: bigint;
  if (fee !== null) {
    feeDrops = parseAmount(fee, decimals);
  } else {
    feeDrops = await getRelayerFee(provider, forwarderAddress);
  }

  // Use chain block timestamp for deadline (avoids clock skew vs contract's block.timestamp)
  const block = await provider.getBlock("latest");
  const chainTime = block?.timestamp ?? Math.floor(Date.now() / 1000);
  const deadline = chainTime + deadlineSeconds;

  // Parse amount
  const amountDrops = parseAmount(amount, decimals);

  // Sign the request
  const signature = await signPaymentRequest(wallet, {
    forwarderAddress,
    to,
    amount: amountDrops,
    fee: feeDrops,
    nonce,
    deadline,
    chainId,
  });

  return {
    from: wallet.address,
    to: to,
    amount: amountDrops.toString(),
    fee: feeDrops.toString(),
    deadline: deadline,
    signature: signature,
    // Metadata (not part of signature)
    meta: {
      amountFormatted: formatAmount(amountDrops, decimals) + " FXRP",
      feeFormatted: formatAmount(feeDrops, decimals) + " FXRP",
      nonce: nonce.toString(),
      chainId: chainId.toString(),
    },
  };
}

// 10. Approve the forwarder contract to spend FXRP (one-time per user)
export async function approveFXRP(
  wallet: Wallet,
  forwarderAddress: string,
  amount: bigint = ethers.MaxUint256,
): Promise<ApprovalResult> {
  const provider = wallet.provider;
  if (!provider) {
    throw new Error("Wallet must be connected to a provider");
  }

  // Get FXRP token address from forwarder
  const forwarder = GaslessPaymentForwarder__factory.connect(
    forwarderAddress,
    provider,
  );
  const fxrpAddress: string = await forwarder.fxrp();

  // Approve
  const fxrp = new Contract(
    fxrpAddress,
    erc20Abi as ethers.InterfaceAbi,
    wallet,
  );
  const tx = await fxrp.approve(forwarderAddress, amount);
  const receipt = await tx.wait();

  return {
    transactionHash: tx.hash,
    blockNumber: receipt?.blockNumber ?? null,
    fxrpAddress: fxrpAddress,
    approved: amount.toString(),
  };
}

// 11. Check user's FXRP balance and allowance
export async function checkUserStatus(
  provider: Provider,
  forwarderAddress: string,
  userAddress: string,
): Promise<UserStatus> {
  const forwarder = GaslessPaymentForwarder__factory.connect(
    forwarderAddress,
    provider,
  );
  const fxrpAddress: string = await forwarder.fxrp();
  const fxrp = new Contract(
    fxrpAddress,
    erc20Abi as ethers.InterfaceAbi,
    provider,
  );

  const [balance, allowance, nonce, decimals] = await Promise.all([
    fxrp.balanceOf(userAddress) as Promise<bigint>,
    fxrp.allowance(userAddress, forwarderAddress) as Promise<bigint>,
    forwarder.getNonce(userAddress) as Promise<bigint>,
    fxrp.decimals() as Promise<number>,
  ]);

  return {
    fxrpAddress,
    balance: balance.toString(),
    balanceFormatted: formatAmount(balance, decimals) + " FXRP",
    allowance: allowance.toString(),
    allowanceFormatted: formatAmount(allowance, decimals) + " FXRP",
    nonce: nonce.toString(),
    needsApproval: allowance === 0n,
  };
}
