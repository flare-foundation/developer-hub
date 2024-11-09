import React, { useMemo } from "react";
import Link from "@docusaurus/Link";
import tableData from "../../../automations/solidity_reference.json";

interface ContractData {
  name: string;
  address: string;
}

interface DisplayedDataItem {
  name: string;
  address: string;
  abiLink: string;
}

interface NetworkLinks {
  addressLinkPrefix: string;
  abiLinkPrefix: string;
}

interface NetworkLinksMap {
  [network: string]: NetworkLinks;
}

interface SolidityReferenceProps {
  network: string;
  contractNames: string[];
}

const networkLinks: NetworkLinksMap = {
  FlareMainnet: {
    addressLinkPrefix: "https://flarescan.com/address/",
    abiLinkPrefix:
      "https://api.routescan.io/v2/network/mainnet/evm/14/etherscan/api?module=contract&action=getabi&address=",
  },
  FlareTestnetCoston2: {
    addressLinkPrefix: "https://coston2.testnet.flarescan.com/address/",
    abiLinkPrefix:
      "https://api.routescan.io/v2/network/testnet/evm/114/etherscan/api?module=contract&action=getabi&address=",
  },
  SongbirdCanaryNetwork: {
    addressLinkPrefix: "https://songbird.flarescan.com/address/",
    abiLinkPrefix:
      "https://api.routescan.io/v2/network/mainnet/evm/19/etherscan/api?module=contract&action=getabi&address=",
  },
  SongbirdTestnetCoston: {
    addressLinkPrefix: "https://coston.testnet.flarescan.com/address/",
    abiLinkPrefix:
      "https://api.routescan.io/v2/network/testnet/evm/16/etherscan/api?module=contract&action=getabi&address=",
  },
};

const SolidityReference: React.FC<SolidityReferenceProps> = ({
  network,
  contractNames,
}) => {
  const links = networkLinks[network];
  const networkData: ContractData[] = tableData[network] || [];

  // Handle unsupported networks
  if (!links) {
    return (
      <div className="unsupported-network">
        Network <strong>{network}</strong> is not supported.
      </div>
    );
  }

  // Memoize the displayed data to avoid unnecessary recomputations
  const displayedData: DisplayedDataItem[] = useMemo(() => {
    return contractNames.map((name) => {
      const contract = networkData.find((contract) => contract.name === name);
      return contract
        ? {
            name: contract.name,
            address: contract.address,
            abiLink: `${links.abiLinkPrefix}${contract.address}&format=raw`,
          }
        : { name, address: "-", abiLink: "-" };
    });
  }, [links, contractNames, networkData]);

  const renderAddress = (address: string) =>
    address !== "-" ? (
      <Link
        href={`${links.addressLinkPrefix}${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="feed-address-link"
      >
        <code>{address}</code>
      </Link>
    ) : (
      <span className="no-address">-</span>
    );

  const renderAbiLink = (abiLink: string) =>
    abiLink !== "-" ? (
      <Link
        href={abiLink}
        target="_blank"
        rel="noopener noreferrer"
        className="abi-link"
      >
        ABI
      </Link>
    ) : (
      <span className="no-abi">-</span>
    );

  return (
    <table className="data-table">
      <thead>
        <tr className="table-header">
          <th>Contract</th>
          <th>Address</th>
          <th>ABI</th>
        </tr>
      </thead>
      <tbody>
        {displayedData.length > 0 ? (
          displayedData.map((row, index) => (
            <tr key={index} className="table-row">
              <td className="contract-name">{row.name}</td>
              <td className="contract-address">{renderAddress(row.address)}</td>
              <td className="contract-abi">{renderAbiLink(row.abiLink)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="no-data" colSpan={3}>
              No data available for the specified contracts in this network.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default SolidityReference;
