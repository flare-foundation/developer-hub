"use client";

import { useDeferredValue, useState } from "react";
import classes from "../HomepageFeatures/featureCard.module.css";
import Heading from "@theme/Heading";
import { useFlareContractRegistry } from "@site/src/hooks/useFlareContractRegistry";
import { WagmiProvider } from "wagmi";
import { getConfig } from "./wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function GetAddressCard() {
  const [data, setData] = useState("");
  const contractName = useDeferredValue(data);
  const [contractAddress, setContractAddress] = useState("");
  const result = useFlareContractRegistry(contractName);

  return (
    <div className={`${classes.card} input-card margin-bottom--md`}>
      <Heading as="h3" className="input-card-title">
        Get the address of an official Flare contract
      </Heading>
      <input
        type="text"
        placeholder="Enter contract name"
        value={data}
        onChange={(e) => setData(e.target.value)}
        className="input-card-input"
      />
      <button
        onClick={() => {
          setContractAddress(result.data as string);
        }}
        className="input-card-button"
        aria-label="Get contract address"
        title="Get contract address"
      >
        Get Address
      </button>
      <p className="input-card-result">
        Contract address: <b>{contractAddress}</b>
      </p>
    </div>
  );
}

export function GetAddressApp() {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <GetAddressCard />
      </WagmiProvider>
    </QueryClientProvider>
  );
}
