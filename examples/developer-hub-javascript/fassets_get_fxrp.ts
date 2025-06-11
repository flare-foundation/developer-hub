// yarn hardhat run scripts/fassets/getFXRP.ts --network coston2

// AssetManager address on Flare Testnet Coston2 network
const ASSET_MANAGER_ADDRESS = "0xDeD50DA9C3492Bee44560a4B35cFe0e778F41eC5";

const IAssetManager = artifacts.require("IAssetManager");

async function main() {
  const assetManager = await IAssetManager.at(ASSET_MANAGER_ADDRESS);
  const fasset = await assetManager.fAsset();

  console.log("FXRP address", fasset);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
