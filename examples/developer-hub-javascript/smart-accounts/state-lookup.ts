import { Wallet } from "xrpl";
import {
  getAgentVaults,
  getOperatorXrplAddresses,
  getPersonalAccountAddress,
  getVaults,
} from "./utils/smart-accounts";
import { getFxrpBalance } from "./utils/fassets";
import { publicClient } from "./utils/client";
import { erc4626Abi } from "viem";
import type { Address } from "viem";

async function getVaultBalance(vaultAddress: Address, accountAddress: Address) {
  const vaultBalance = await publicClient.readContract({
    address: vaultAddress,
    abi: erc4626Abi,
    functionName: "balanceOf",
    args: [accountAddress],
  });
  return vaultBalance;
}

async function main() {
  const xrplWallet = Wallet.fromSeed(process.env.XRPL_SEED!);

  const operatorXrplAddress = await getOperatorXrplAddresses();
  console.log("Operator XRPL addresses:", operatorXrplAddress, "\n");

  const personalAccountAddress = await getPersonalAccountAddress(
    xrplWallet.address,
  );
  console.log("Personal account address:", personalAccountAddress, "\n");

  const fxrpBalance = await getFxrpBalance(personalAccountAddress);
  console.log("Personal account FXRP balance:", fxrpBalance, "\n");

  const vaults = await getVaults();
  console.log("Vaults:", vaults, "\n");

  for (const vault of vaults) {
    const vaultBalance = await getVaultBalance(
      vault.address,
      personalAccountAddress,
    );
    console.log(`Vault ${vault.id} balance:`, vaultBalance, "\n");
  }

  const agentVaults = await getAgentVaults();
  console.log("Agent vaults:", agentVaults, "\n");
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
