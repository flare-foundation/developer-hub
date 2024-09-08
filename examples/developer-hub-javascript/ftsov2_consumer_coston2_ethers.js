// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
import { ethers } from "ethers";

// FtsoV2 address (Flare Testnet Coston2)
// See https://dev.flare.network/ftso/solidity-reference
const FTSOV2_ADDRESS = "0x3d893C53D9e8056135C26C8c638B76C8b60Df726";
const RPC_URL = "https://coston2-api.flare.network/ext/C/rpc";
const FEED_IDS = [
  "0x01464c522f55534400000000000000000000000000", // FLR/USD
  "0x014254432f55534400000000000000000000000000", // BTC/USD
  "0x014554482f55534400000000000000000000000000", // ETH/USD
];
// ABI for FtsoV2
const ABI =
  '[{"inputs":[{"internalType":"address","name":"_addressUpdater","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"FTSO_PROTOCOL_ID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fastUpdater","outputs":[{"internalType":"contract IFastUpdater","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fastUpdatesConfiguration","outputs":[{"internalType":"contract IFastUpdatesConfiguration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAddressUpdater","outputs":[{"internalType":"address","name":"_addressUpdater","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes21","name":"_feedId","type":"bytes21"}],"name":"getFeedById","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"int8","name":"","type":"int8"},{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes21","name":"_feedId","type":"bytes21"}],"name":"getFeedByIdInWei","outputs":[{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"uint64","name":"_timestamp","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getFeedByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"int8","name":"","type":"int8"},{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getFeedByIndexInWei","outputs":[{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"uint64","name":"_timestamp","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getFeedId","outputs":[{"internalType":"bytes21","name":"","type":"bytes21"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes21","name":"_feedId","type":"bytes21"}],"name":"getFeedIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes21[]","name":"_feedIds","type":"bytes21[]"}],"name":"getFeedsById","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"int8[]","name":"","type":"int8[]"},{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes21[]","name":"_feedIds","type":"bytes21[]"}],"name":"getFeedsByIdInWei","outputs":[{"internalType":"uint256[]","name":"_values","type":"uint256[]"},{"internalType":"uint64","name":"_timestamp","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"_indices","type":"uint256[]"}],"name":"getFeedsByIndex","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"int8[]","name":"","type":"int8[]"},{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"_indices","type":"uint256[]"}],"name":"getFeedsByIndexInWei","outputs":[{"internalType":"uint256[]","name":"_values","type":"uint256[]"},{"internalType":"uint64","name":"_timestamp","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"relay","outputs":[{"internalType":"contract IRelay","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"_contractNameHashes","type":"bytes32[]"},{"internalType":"address[]","name":"_contractAddresses","type":"address[]"}],"name":"updateContractAddresses","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"},{"components":[{"internalType":"uint32","name":"votingRoundId","type":"uint32"},{"internalType":"bytes21","name":"id","type":"bytes21"},{"internalType":"int32","name":"value","type":"int32"},{"internalType":"uint16","name":"turnoutBIPS","type":"uint16"},{"internalType":"int8","name":"decimals","type":"int8"}],"internalType":"struct FtsoV2Interface.FeedData","name":"body","type":"tuple"}],"internalType":"struct FtsoV2Interface.FeedDataWithProof","name":"_feedData","type":"tuple"}],"name":"verifyFeedData","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]';

export async function main() {
  // Connect to an RPC node
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  // Set up contract instance
  const ftsov2 = new ethers.Contract(FTSOV2_ADDRESS, JSON.parse(ABI), provider);
  // Fetch current feeds
  const res = await ftsov2.getFeedsById.staticCall(FEED_IDS);
  // Log results
  console.log("Feeds:", res[0]);
  console.log("Decimals:", res[1]);
  console.log("Timestamp:", res[2]);
  return res;
}

main();
