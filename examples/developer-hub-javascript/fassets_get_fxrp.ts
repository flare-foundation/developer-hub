import { getFXRPAssetManagerAddress } from "../utils/fassets";

// yarn hardhat run scripts/fassets/getFXRP.ts --network coston2
const IAssetManager = artifacts.require("IAssetManager");

async function main() {
  // 1. Connect to the AssetManager contract using the IAssetManager interface
  const assetManager = await IAssetManager.at(
    await getFXRPAssetManagerAddress(),
  );

  // 2. Get the FXRP token address
  const fasset = await assetManager.fAsset();

  // 3. Log the FXRP token address
  console.log("FXRP address", fasset);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
