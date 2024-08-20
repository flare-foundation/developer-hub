import { Web3 } from "web3";

const registry_addr = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";
const base_url = "https://flare-explorer.flare.network/api";

export async function main() {
  // Fetch ABI
  const params = `?module=contract&action=getabi&address=${registry_addr}`;
  const response = await fetch(base_url + params);
  const abi = JSON.parse((await response.json())["result"]);

  // Query contract
  const w3 = new Web3("https://flare-api.flare.network/ext/C/rpc");
  const registry = new w3.eth.Contract(abi, registry_addr);
  const res = await registry.methods.getContractAddressByName("WNat").call();
  console.log("WNat address: ", res);
  // WNat address: 0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d

  return res;
}
