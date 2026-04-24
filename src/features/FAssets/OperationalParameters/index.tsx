import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Link from "@docusaurus/Link";
import CopyButton from "@site/src/components/CopyButton";

import { operationalParameters } from "./operational-parameters";

export default function OperationalParameters({
  sectionTitle,
  filterParameters,
  networks,
}: {
  sectionTitle: string;
  filterParameters?: string[];
  networks?: ("songbird" | "coston" | "coston2" | "flare")[];
}) {
  const operationalParametersSection = operationalParameters.find(
    (section) => section.title === sectionTitle,
  );

  const allParameters = operationalParametersSection?.parameters || [];

  const parameters = filterParameters?.length
    ? allParameters.filter(
        (param) =>
          "settingName" in param &&
          param.settingName &&
          filterParameters.includes(param.settingName),
      )
    : allParameters;

  type OperationalParameter =
    (typeof operationalParameters)[number]["parameters"][number];
  type Network = "songbird" | "coston" | "coston2" | "flare";
  type ValueType = "text" | "address";

  const networkAddressExplorerPrefix: Record<Network, string> = {
    flare: "https://flare-explorer.flare.network/address/",
    coston2: "https://coston2-explorer.flare.network/address/",
    songbird: "https://songbird-explorer.flare.network/address/",
    coston: "https://coston-explorer.flare.network/address/",
  };
  const networkExplorerLabel: Record<Network, string> = {
    flare: "Flare Mainnet",
    coston2: "Flare Testnet Coston2",
    songbird: "Songbird Canary-Network",
    coston: "Songbird Testnet Coston",
  };

  function ParameterTable({
    network,
    parameters,
    hideXrp = false,
    hideBtc = false,
    hideDoge = false,
  }: {
    network: "songbird" | "coston" | "coston2" | "flare";
    parameters: OperationalParameter[];
    hideXrp?: boolean;
    hideBtc?: boolean;
    hideDoge?: boolean;
  }) {
    const isAddress = (value: string) => /^0x[a-fA-F0-9]{40}$/.test(value);

    const getNetworkValue = (
      parameter: OperationalParameter,
      asset: "xrp" | "btc" | "doge",
    ) => {
      const value = parameter.values?.[network]?.[asset];
      return typeof value === "string" && value.trim().length > 0 ? value : "-";
    };

    const getValueType = (parameter: OperationalParameter): ValueType =>
      "valueType" in parameter && parameter.valueType === "address"
        ? "address"
        : "text";

    const renderValueCell = (
      parameter: OperationalParameter,
      asset: "xrp" | "btc" | "doge",
    ) => {
      const value = getNetworkValue(parameter, asset);
      const valueType = getValueType(parameter);

      if (valueType === "address" && value !== "-" && isAddress(value)) {
        const explorerNetwork = networkExplorerLabel[network];
        return (
          <>
            <Link
              href={`${networkAddressExplorerPrefix[network]}${value}`}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open address in ${explorerNetwork} explorer`}
            >
              <code>{value}</code>
            </Link>{" "}
            <CopyButton textToCopy={value} />
          </>
        );
      }

      return <span dangerouslySetInnerHTML={{ __html: value }} />;
    };

    return (
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            {!hideXrp && <th>XRP</th>}
            {!hideBtc && <th>BTC</th>}
            {!hideDoge && <th>DOGE</th>}
          </tr>
        </thead>
        <tbody>
          {parameters.map((parameter) => (
            <tr
              key={
                "settingName" in parameter && parameter.settingName
                  ? parameter.settingName
                  : "functionName" in parameter && parameter.functionName
                    ? `${parameter.name}-${parameter.functionName}`
                    : parameter.name
              }
            >
              <td>
                {"link" in parameter && parameter.link ? (
                  <Link to={parameter.link}>
                    <b>{parameter.name}</b>
                  </Link>
                ) : (
                  <b>{parameter.name}</b>
                )}
                &nbsp; <br />
                {"settingName" in parameter &&
                  parameter.settingName &&
                  "interfaceLink" in parameter &&
                  parameter.interfaceLink && (
                    <>
                      <Link to={parameter.interfaceLink}>
                        {parameter.settingName}
                      </Link>
                      &nbsp;
                    </>
                  )}
                {"interfaceLink" in parameter &&
                  parameter.interfaceLink &&
                  "functionName" in parameter &&
                  parameter.functionName && (
                    <>
                      <Link to={parameter.interfaceLink}>
                        {parameter.functionName}
                      </Link>
                      &nbsp;
                    </>
                  )}
                {"settingName" in parameter && parameter.settingName && (
                  <code>{parameter.settingName}</code>
                )}
                <br />
                {parameter.description}
              </td>
              {!hideXrp && <td>{renderValueCell(parameter, "xrp")}</td>}
              {!hideBtc && <td>{renderValueCell(parameter, "btc")}</td>}
              {!hideDoge && <td>{renderValueCell(parameter, "doge")}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  const networkTabs: {
    label: string;
    value: Network;
    hideBtc: boolean;
    hideDoge: boolean;
  }[] = [
    {
      label: "Flare Mainnet",
      value: "flare",
      hideBtc: true,
      hideDoge: true,
    },
    {
      label: "Flare Testnet Coston2",
      value: "coston2",
      hideBtc: true,
      hideDoge: true,
    },
    {
      label: "Songbird Canary-Network",
      value: "songbird",
      hideBtc: true,
      hideDoge: true,
    },
    {
      label: "Songbird Testnet Coston",
      value: "coston",
      hideBtc: false,
      hideDoge: false,
    },
  ];

  const visibleTabs = networks?.length
    ? networkTabs.filter((tab) => networks.includes(tab.value))
    : networkTabs;

  return (
    <Tabs
      defaultValue={visibleTabs[0]?.value ?? "flare"}
      values={visibleTabs.map((tab) => ({
        label: tab.label,
        value: tab.value,
      }))}
    >
      {visibleTabs.map((tab) => (
        <TabItem key={tab.value} value={tab.value}>
          <ParameterTable
            network={tab.value}
            parameters={parameters}
            hideBtc={tab.hideBtc}
            hideDoge={tab.hideDoge}
          />
        </TabItem>
      ))}
    </Tabs>
  );
}
