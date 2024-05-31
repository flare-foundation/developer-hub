const base_url = "https://flare-explorer.flare.network/api";
const params =
  "?module=contract&action=getabi&address=0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";

const response = await fetch(base_url + params);
const abi = (await response.json())["result"];
console.log(abi);
