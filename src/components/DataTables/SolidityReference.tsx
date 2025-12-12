import React, { useMemo } from "react";
import Link from "@docusaurus/Link";
import tableDataRaw from "../../../automations/solidity_reference.json";

interface ContractData {
  name: string;
  address: string;
}

const tableData = tableDataRaw as Record<string, ContractData[]>;

const networkLinks = {
  FlareMainnet: {
    prefix: "https://flare-explorer.flare.network/address/",
  },
  FlareTestnetCoston2: {
    prefix: "https://coston2-explorer.flare.network/address/",
  },
  SongbirdCanaryNetwork: {
    prefix: "https://songbird-explorer.flare.network/address/",
  },
  SongbirdTestnetCoston: {
    prefix: "https://coston-explorer.flare.network/address/",
  },
} as const;

type NetworkKey = keyof typeof networkLinks;

interface SolidityReferenceProps {
  network: NetworkKey;
  contractNames: string[];
  renderAbi?: boolean;
}

const SolidityReference: React.FC<SolidityReferenceProps> = ({
  network,
  contractNames,
  renderAbi = true,
}) => {
  const links = networkLinks[network];
  const rawNetworkData = tableData[network] || [];

  if (!links) {
    return (
      <div className="unsupported-network">
        Network <strong>{network}</strong> is not supported.
      </div>
    );
  }

  const dataMap = useMemo(() => {
    return new Map(rawNetworkData.map((c) => [c.name, c.address]));
  }, [rawNetworkData]);

  const rows = useMemo(() => {
    return contractNames.map((name) => {
      const address = dataMap.get(name);
      return {
        name,
        address: address || "-",
        abiLink: address ? `${links.prefix}${address}?tab=contract_abi` : "-",
      };
    });
  }, [contractNames, dataMap, links]);

  const colSpan = 2 + (renderAbi ? 1 : 0);

  return (
    <table className="data-table">
      <thead>
        <tr className="table-header">
          <th>Contract</th>
          <th>Address</th>
          {renderAbi && <th>ABI</th>}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((row) => (
            <tr key={row.name} className="table-row">
              <td className="contract-name">{row.name}</td>
              <td className="contract-address">
                {row.address !== "-" ? (
                  <Link
                    href={`${links.prefix}${row.address}`}
                    className="feed-address-link"
                  >
                    <code>{row.address}</code>
                  </Link>
                ) : (
                  <span className="no-address">-</span>
                )}
              </td>
              {renderAbi && (
                <td className="contract-abi">
                  {row.abiLink !== "-" ? (
                    <Link href={row.abiLink} className="abi-link">
                      ABI
                    </Link>
                  ) : (
                    <span className="no-abi">-</span>
                  )}
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td className="no-data" colSpan={colSpan}>
              No data available for the specified contracts in this network.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default SolidityReference;
