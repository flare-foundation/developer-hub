"use client";

import { useState } from "react";
import { useReadContract, WagmiProvider } from "wagmi";
import { getConfig } from "./wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { abi } from "@site/src/abis/FlareContractRegistry";

export function ContractList({ contracts }: { contracts: string[] }) {
  if (contracts.length == 0) {
    return (
      <div>
        <p>Fetching...</p>
      </div>
    );
  }

  return (
    <div>
      <ul>
        {contracts.map((contractName: string) => {
          return <li key={contractName}>{contractName}</li>;
        })}
      </ul>
    </div>
  );
}

export function AllOfficialContractsTable() {
  const result = useReadContract({
    abi: abi,
    address: "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
    functionName: "getAllContracts",
    args: [],
    query: {},
  });

  const [allContracts, setAllContracts] = useState([] as string[]);

  if (result.isLoading) return <div>Loading...</div>;
  if (result.isError) return <div>Error: {result.error.message}</div>;

  if (result.isSuccess && allContracts.length === 0) {
    setAllContracts(result.data[0]);
  }

  return (
    <div>
      <ContractList contracts={allContracts} />
    </div>
  );
}

export function AllOfficialContractsTableApp() {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <AllOfficialContractsTable />
      </WagmiProvider>
    </QueryClientProvider>
  );
}
