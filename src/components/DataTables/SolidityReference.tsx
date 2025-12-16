import React, { useMemo } from "react";
import Link from "@docusaurus/Link";
import tableDataRaw from "../../../automations/solidity_reference.json";

type ContractData = Readonly<{
  name: string;
  address: string;
}>;

type SolidityReferenceJson = Partial<Record<string, ContractData[]>>;

const tableData = tableDataRaw as unknown as SolidityReferenceJson;

const networkLinks = {
  FlareMainnet: {
    label: "Flare Mainnet",
    addressPrefix: "https://flare-explorer.flare.network/address/",
    abiSuffix: "?tab=contract_abi",
  },
  FlareTestnetCoston2: {
    label: "Flare Coston2",
    addressPrefix: "https://coston2-explorer.flare.network/address/",
    abiSuffix: "?tab=contract_abi",
  },
  SongbirdCanaryNetwork: {
    label: "Songbird",
    addressPrefix: "https://songbird-explorer.flare.network/address/",
    abiSuffix: "?tab=contract_abi",
  },
  SongbirdTestnetCoston: {
    label: "Songbird Coston",
    addressPrefix: "https://coston-explorer.flare.network/address/",
    abiSuffix: "?tab=contract_abi",
  },
} as const;

type NetworkKey = keyof typeof networkLinks;

interface SolidityReferenceProps {
  network: NetworkKey;
  contractNames: readonly string[];
  renderAbi?: boolean;
}

const normalizeContractName = (name: string): string => name.trim();

const isHexAddress = (value: string): boolean =>
  /^0x[a-fA-F0-9]{40}$/.test(value);

const SolidityReference: React.FC<SolidityReferenceProps> = ({
  network,
  contractNames,
  renderAbi = true,
}) => {
  const links = networkLinks[network];

  // JSON may be malformed per-network.
  const rawNetworkData = useMemo(() => {
    const rows = tableData?.[network];
    return Array.isArray(rows) ? rows : [];
  }, [network]);

  const dataMap = useMemo(() => {
    // If JSON contains duplicate names, the last one wins.
    const map = new Map<string, string>();
    for (const c of rawNetworkData) {
      if (!c?.name || !c?.address) continue;
      map.set(normalizeContractName(c.name), c.address);
    }
    return map;
  }, [rawNetworkData]);

  const rows = useMemo(() => {
    // Preserve input order; de-dupe exact repeats after trim.
    const seen = new Set<string>();
    const orderedUniqueNames: string[] = [];

    for (const raw of contractNames) {
      const name = normalizeContractName(raw);
      if (!name || seen.has(name)) continue;
      seen.add(name);
      orderedUniqueNames.push(name);
    }

    return orderedUniqueNames.map((name) => {
      const addressRaw = dataMap.get(name);
      const address =
        addressRaw && isHexAddress(addressRaw) ? addressRaw : null;

      return {
        name,
        address,
        addressHref: address ? `${links.addressPrefix}${address}` : null,
        abiHref: address
          ? `${links.addressPrefix}${address}${links.abiSuffix}`
          : null,
      };
    });
  }, [contractNames, dataMap, links.addressPrefix, links.abiSuffix]);

  const colSpan = 2 + (renderAbi ? 1 : 0);

  return (
    <table
      className="data-table"
      aria-label={`Solidity reference (${links.label})`}
    >
      <thead>
        <tr className="table-header">
          <th scope="col">Contract</th>
          <th scope="col">Address</th>
          {renderAbi && <th scope="col">ABI</th>}
        </tr>
      </thead>

      <tbody>
        {rows.length > 0 ? (
          rows.map((row) => (
            <tr key={row.name} className="table-row">
              <td className="contract-name">
                <code>{row.name}</code>
              </td>

              <td className="contract-address">
                {row.addressHref ? (
                  <Link
                    href={row.addressHref}
                    className="contract-address-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open in explorer (${links.label})`}
                  >
                    <code>{row.address}</code>
                  </Link>
                ) : (
                  <span
                    className="no-address"
                    title="No valid address found for this contract"
                  >
                    —
                  </span>
                )}
              </td>

              {renderAbi && (
                <td className="contract-abi">
                  {row.abiHref ? (
                    <Link
                      href={row.abiHref}
                      className="abi-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View contract ABI in explorer"
                    >
                      ABI
                    </Link>
                  ) : (
                    <span
                      className="no-abi"
                      title="ABI link unavailable without a valid address"
                    >
                      —
                    </span>
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
