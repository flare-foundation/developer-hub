import { coston2 } from "@flarenetwork/flare-wagmi-periphery-package";
import { account, publicClient, walletClient } from "./utils/client";
import { getMintingTagManagerAddress } from "./utils/smart-accounts";

const MINTING_TAG = 72n;
const MINTING_TAG_RECIPIENT = "0x4F2E3d23BdFc554185fd06CC599c98D3A540d60A";

async function main() {
  // 1. Set the tag to transfer and the recipient that should become the new owner.
  const tag = MINTING_TAG;
  const recipient = MINTING_TAG_RECIPIENT;
  const sender = account.address;

  // 2. Resolve MintingTagManager and log the transfer context.
  const mintingTagManagerAddress = await getMintingTagManagerAddress();
  console.log("MintingTagManager:", mintingTagManagerAddress, "\n");
  console.log("Tag:", tag, "\n");
  console.log("Sender:", sender, "\n");
  console.log("Recipient:", recipient, "\n");

  // 3. Read the current tag owner and configured minting recipient before transfer.
  const [ownerBefore, mintingRecipientBefore] = await Promise.all([
    publicClient.readContract({
      address: mintingTagManagerAddress,
      abi: coston2.iMintingTagManagerAbi,
      functionName: "ownerOf",
      args: [tag],
    }),
    publicClient.readContract({
      address: mintingTagManagerAddress,
      abi: coston2.iMintingTagManagerAbi,
      functionName: "mintingRecipient",
      args: [tag],
    }),
  ]);

  console.log("Owner before:", ownerBefore, "\n");
  console.log("Minting recipient before:", mintingRecipientBefore, "\n");

  // 4. Guard against accidental sends: only the current owner can transfer.
  if (ownerBefore.toLowerCase() !== sender.toLowerCase()) {
    throw new Error(
      `Tag ${tag} is owned by ${ownerBefore}, but script sender is ${sender}. ` +
        "Run this script with the owner's PRIVATE_KEY.",
    );
  }

  // 5. Simulate transferFrom to build a validated request payload.
  const { request } = await publicClient.simulateContract({
    account,
    address: mintingTagManagerAddress,
    abi: coston2.iMintingTagManagerAbi,
    functionName: "transferFrom",
    args: [sender, recipient, tag],
  });

  // 6. Broadcast transferFrom and wait for confirmation.
  const txHash = await walletClient.writeContract(request);
  console.log("transferFrom tx:", txHash, "\n");
  await publicClient.waitForTransactionReceipt({ hash: txHash });

  // 7. Re-read owner and minting recipient to verify post-transfer state.
  const [ownerAfter, mintingRecipientAfter] = await Promise.all([
    publicClient.readContract({
      address: mintingTagManagerAddress,
      abi: coston2.iMintingTagManagerAbi,
      functionName: "ownerOf",
      args: [tag],
    }),
    publicClient.readContract({
      address: mintingTagManagerAddress,
      abi: coston2.iMintingTagManagerAbi,
      functionName: "mintingRecipient",
      args: [tag],
    }),
  ]);

  console.log("Owner after:", ownerAfter, "\n");
  console.log("Minting recipient after:", mintingRecipientAfter, "\n");
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
