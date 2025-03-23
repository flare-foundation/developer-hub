import React from "react";

interface NetworkParams {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

interface EthereumRequest {
  method: string;
  params?: unknown[];
}

type EthereumEventCallback = (args: unknown[]) => void;

// Type declaration for ethereum in window object
declare global {
  interface Window {
    ethereum: {
      request: (args: EthereumRequest) => Promise<unknown>;
      on: (event: string, callback: EthereumEventCallback) => void;
      removeAllListeners: (event: string) => void;
    };
  }
}

const ConnectWallet: React.FC = () => {
  const networks: Record<"flare" | "coston2", NetworkParams> = {
    flare: {
      chainId: "0xe",
      chainName: "Flare Mainnet",
      rpcUrls: ["https://rpc.ankr.com/flare"],
      blockExplorerUrls: ["https://flare-explorer.flare.network"],
      nativeCurrency: {
        name: "Flare",
        symbol: "FLR",
        decimals: 18,
      },
    },
    coston2: {
      chainId: "0x72",
      chainName: "Flare Testnet Coston2",
      rpcUrls: ["https://coston2-api.flare.network/ext/C/rpc"],
      blockExplorerUrls: ["https://coston2-explorer.flare.network"],
      nativeCurrency: {
        name: "Coston2 Flare",
        symbol: "C2FLR",
        decimals: 18,
      },
    },
  };

  const addNetwork = async (networkKey: "flare" | "coston2") => {
    if (typeof window.ethereum === "undefined") {
      alert(
        "No Ethereum wallet detected. Please install MetaMask or another Ethereum wallet.",
      );
      return;
    }

    const networkConfig = networks[networkKey];

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networkConfig],
      });
    } catch (error: unknown) {
      console.error(`Failed to add ${networkConfig.chainName}:`, error);
      alert(
        `Failed to add ${networkConfig.chainName}. Please check your wallet and try again.`,
      );
    }
  };

  return (
    <div className="wallet-container">
      <div className="network-buttons">
        <button
          className="network-button testnet"
          onClick={() => addNetwork("coston2")}
        >
          <span className="fox-icon">🦊</span>
          <span className="button-text">Add Coston2 Testnet</span>
        </button>

        <button
          className="network-button mainnet"
          onClick={() => addNetwork("flare")}
        >
          <span className="fox-icon">🦊</span>
          <span className="button-text">Add Flare Mainnet</span>
        </button>
      </div>
    </div>
  );
};

export default ConnectWallet;
