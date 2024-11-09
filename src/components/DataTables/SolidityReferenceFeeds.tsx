import React from "react";
import Link from "@docusaurus/Link";
import tableData from "../../../automations/solidity_reference.json";

const SolidityReferenceFeeds = ({ network, contractNames = [] }) => {
  const networkLinks = {
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

  const networkData = tableData[network] || [];

  const displayedData = contractNames.map((name) => {
    const contract = networkData.find((contract) => contract.name === name);
    return contract
      ? {
          name: contract.name,
          address: contract.address,
          abiLink: `${networkLinks[network]?.abiLinkPrefix}${contract.address}&format=raw`,
        }
      : { name, address: "-", abiLink: "-" };
  });

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
              <td className="regular-font">{row.name}</td>
              <td className="feed-id mono-font">
                {row.address !== "-" ? (
                  <Link
                    href={`${networkLinks[network]?.addressLinkPrefix}${row.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="feed-id-text light-theme-text"
                  >
                    {row.address}
                  </Link>
                ) : (
                  <span className="center-text">-</span>
                )}
              </td>
              <td className="regular-font">
                {row.abiLink !== "-" ? (
                  <Link
                    href={row.abiLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="abi-link"
                  >
                    ABI
                  </Link>
                ) : (
                  <span>-</span>
                )}
              </td>
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

export default SolidityReferenceFeeds;
