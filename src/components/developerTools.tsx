import React, { useState } from "react";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";

// Tool descriptions
const toolDescriptions = {
  QuickNode:
    "A blockchain infrastructure platform providing APIs for fast querying, transaction management, and cross-chain support.",
  Ankr: "A distributed computing platform that provides infrastructure and tools for building and deploying blockchain applications.",
  Thirdweb:
    "A developer toolkit for building, deploying, and managing Web3 applications with ease.",
  ChainList:
    "A directory of EVM networks, providing information to connect to various EVM compatible chains.",
  "LayerZero V2":
    "An omnichain protocol enabling seamless communication and interoperability across multiple blockchains.",
  "Stargate V2":
    "A cross-chain liquidity transfer protocol built on LayerZero, enabling seamless asset transfers across multiple blockchains.",
  "Omnichain Fungible Tokens (OFTs)":
    "Omnichain fungible tokens available on Flare through Stargate V2",
  zkBridge:
    "A trustless and efficient cross-chain interoperability protocol that enables secure asset transfers using zero-knowledge proofs.",
  Goldsky:
    "A real-time blockchain data platform offering APIs and tools for seamless analytics and integration. Goldsky also offers high-performance subgraph hosting and real-time data replication pipelines (Mirror).",
  SubQuery:
    "An indexing protocol for querying networks and applications, processing and querying data efficiently.",
  sqd: "A data indexing solution for blockchain networks, offering fast and reliable data processing.",
  Web3Auth:
    "A simple authentication solution for Web3 apps, combining OAuth logins with non-custodial key management.",
  "Etherspot Prime SDK":
    "A smart contract wallet platform simplifying user interactions with dApps through seamless integration.",
  Wagmi:
    "A collection of React Hooks for working with Ethereum, making it easy to build Web3 experiences.",
  RainbowKit:
    "A React library that makes it easy to add wallet connection to your dApp with a customizable UI.",
  Tenderly:
    "A debugging and monitoring tool for smart contracts, offering real-time insights into EVM applications. Tenderly also provides a highly performant production infrastructure with custom RPC methods for gas price prediction, simulations, tracing, and more.",
};

// Define the type for tool items
type ToolItem = {
  name: string;
  link: string;
  subtext?: string;
  external?: boolean;
};

// Define the type for categories
type ToolCategories = {
  [category: string]: ToolItem[];
};

// Define the type for network data
type NetworkData = {
  name: string;
  categories: ToolCategories;
};

// Define the type for network tools
type NetworkTools = {
  [network: string]: NetworkData;
};

// Data structure for tools by network and category
const networkTools: NetworkTools = {
  flare: {
    name: "Flare Mainnet",
    categories: {
      RPCs: [
        { name: "QuickNode", link: "https://www.quicknode.com/chains/flare" },
        { name: "Ankr", link: "https://www.ankr.com/rpc/flare/" },
        { name: "Thirdweb", link: "https://14.rpc.thirdweb.com" },
        {
          name: "ChainList",
          link: "https://ChainList.org/chain/14",
        },
      ],
      Bridging: [
        {
          name: "LayerZero V2",
          link: "https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts#flare",
        },
        {
          name: "Stargate V2",
          link: "https://stargateprotocol.gitbook.io/stargate/v/v2-developer-docs/technical-reference/mainnet-contracts#flare",
        },
        {
          name: "Omnichain Fungible Tokens (OFTs)",
          link: "https://stargateprotocol.gitbook.io/stargate/v2-developer-docs/technical-reference/mainnet-contracts#flare",
        },
        {
          name: "zkBridge",
          link: "https://docs.zkbridge.com/layerzero-zklightclient-configurations/layerzero-v2-zklightclient-dvn-addresses",
        },
      ],
      Indexers: [
        { name: "Goldsky", link: "https://docs.goldsky.com/chains/flare" },
        {
          name: "SubQuery",
          link: "https://github.com/subquery/flare-subql-starter/tree/main/Flare/flare-starter",
        },
        {
          name: "sqd",
          link: "https://docs.sqd.dev/subsquid-network/reference/networks/#evm--ethereum-compatible",
        },
      ],
      "OAuth Login": [
        {
          name: "Web3Auth",
          link: "https://web3auth.io/docs/connect-blockchain/evm/flare",
        },
      ],
      "Account Abstraction": [
        {
          name: "Etherspot Prime SDK",
          link: "https://etherspot.fyi/prime-sdk/intro",
        },
      ],
      "Wallet SDK": [
        { name: "Wagmi", link: "https://wagmi.sh/react/chains" },
        {
          name: "RainbowKit",
          link: "https://www.rainbowkit.com/docs/introduction",
        },
      ],
      "Full-stack Dev Infra": [
        { name: "Tenderly", link: "https://tenderly.co" },
      ],
    },
  },
  coston2: {
    name: "Flare Testnet Coston2",
    categories: {
      RPCs: [
        { name: "QuickNode", link: "https://www.quicknode.com/chains/flare" },
        { name: "Ankr", link: "https://www.ankr.com/rpc/flare/" },
        { name: "Thirdweb", link: "https://114.rpc.thirdweb.com" },
        {
          name: "ChainList",
          link: "https://ChainList.org/chain/114",
        },
      ],
      Bridging: [
        {
          name: "LayerZero V2",
          link: "https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts#flare-testnet",
        },
        {
          name: "Omnichain Fungible Tokens (OFTs)",
          link: "https://stargateprotocol.gitbook.io/stargate/v2-developer-docs/technical-reference/mainnet-contracts#flare",
        },
      ],
      Indexers: [
        { name: "Goldsky", link: "https://docs.goldsky.com/chains/flare" },
      ],
      "OAuth Login": [
        {
          name: "Web3Auth",
          link: "https://web3auth.io/docs/connect-blockchain/evm/flare",
        },
      ],
      "Account Abstraction": [
        {
          name: "Etherspot Prime SDK",
          link: "https://etherspot.fyi/prime-sdk/intro",
        },
      ],
      "Wallet SDK": [
        { name: "Wagmi", link: "https://wagmi.sh/react/chains" },
        {
          name: "RainbowKit",
          link: "https://www.rainbowkit.com/docs/introduction",
        },
      ],
      "Full-stack Dev Infra": [
        { name: "Tenderly", link: "https://tenderly.co" },
      ],
    },
  },
  songbird: {
    name: "Songbird Canary-Network",
    categories: {
      RPCs: [
        { name: "Ankr", link: "https://www.ankr.com/rpc/flare/" },
        { name: "Thirdweb", link: "https://19.rpc.thirdweb.com" },
        {
          name: "ChainList",
          link: "https://ChainList.org/chain/19",
        },
      ],
      Bridging: [],
      Indexers: [
        {
          name: "SubQuery",
          link: "https://github.com/subquery/flare-subql-starter/tree/main/Flare/songbird-starter",
        },
      ],
      "OAuth Login": [
        {
          name: "Web3Auth",
          link: "https://web3auth.io/docs/connect-blockchain/evm/songbird/",
        },
      ],
      "Account Abstraction": [],
      "Wallet SDK": [
        { name: "Wagmi", link: "https://wagmi.sh/react/chains" },
        {
          name: "RainbowKit",
          link: "https://www.rainbowkit.com/docs/introduction",
        },
      ],
      "Full-stack Dev Infra": [
        { name: "Tenderly", link: "https://tenderly.co" },
      ],
    },
  },
  coston: {
    name: "Songbird Testnet Coston",
    categories: {
      RPCs: [
        { name: "Ankr", link: "https://www.ankr.com/rpc/flare/" },
        { name: "Thirdweb", link: "https://16.rpc.thirdweb.com" },
        {
          name: "ChainList",
          link: "https://ChainList.org/chain/16",
        },
      ],
      Bridging: [],
      Indexers: [],
      "OAuth Login": [
        {
          name: "Web3Auth",
          link: "https://web3auth.io/docs/connect-blockchain/evm/songbird/",
        },
      ],
      "Account Abstraction": [],
      "Wallet SDK": [
        { name: "Wagmi", link: "https://wagmi.sh/react/chains" },
        {
          name: "RainbowKit",
          link: "https://www.rainbowkit.com/docs/introduction",
        },
      ],
      "Full-stack Dev Infra": [
        { name: "Tenderly", link: "https://tenderly.co" },
      ],
    },
  },
};

const DeveloperTools = () => {
  const [activeNetwork, setActiveNetwork] = useState("flare");
  const [isClient, setIsClient] = useState(false);

  // Handle client-side only rendering for Next.js compatibility
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const networkData = networkTools[activeNetwork];

  return (
    <div className="developer-tools-container">
      <div className="developer-tools-header">
        <p>
          Developer tools for Flare built by the community including RPCs,
          bridges, indexers, account abstraction, wallet SDKs, and more.
        </p>

        <div className="network-selector-container">
          <div className="network-selector">
            <label htmlFor="network-select">Network:</label>
            <select
              id="network-select"
              value={activeNetwork}
              onChange={(e) => setActiveNetwork(e.target.value)}
              className="network-select"
              aria-label="Select a network"
            >
              {Object.keys(networkTools).map((networkKey) => (
                <option key={networkKey} value={networkKey}>
                  {networkTools[networkKey].name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="tools-grid">
        {Object.entries(networkData.categories).map(([category, tools]) => (
          <div key={category} className="category-section">
            <Heading as="h2" className="category-title">
              {category}
            </Heading>
            <div className="tools-cards">
              {Array.isArray(tools) && tools.length === 0 ? (
                <div className="empty-category">
                  No tools available in this category
                </div>
              ) : (
                Array.isArray(tools) &&
                tools.map((tool) => (
                  <Link
                    key={tool.name}
                    to={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tool-card"
                  >
                    <div className="tool-info">
                      <Heading as="h3" className="tool-name">
                        {tool.name}
                        {tool.subtext && (
                          <span className="tool-subtext"> {tool.subtext}</span>
                        )}
                        {tool.external && (
                          <span className="external-icon">↗</span>
                        )}
                      </Heading>
                      <p className="tool-description">
                        {toolDescriptions[tool.name] ||
                          "A tool for Flare ecosystem development."}
                      </p>
                    </div>
                    <div className="tool-arrow" aria-hidden="true">
                      →
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperTools;
