import { useReadContract } from "wagmi";
import { abi } from "@site/src/abis/FlareContractRegistry";

export function useFlareContractRegistry(contractName: string) {
  const result = useReadContract({
    abi: abi,
    address: "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
    functionName: "getContractAddressByName",
    args: [contractName],
  });
  return result;
}
