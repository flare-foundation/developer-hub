import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Link from "@docusaurus/Link";

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
    const getNetworkValue = (
      parameter: OperationalParameter,
      asset: "xrp" | "btc" | "doge",
    ) => {
      const value = parameter.values?.[network]?.[asset];
      return typeof value === "string" && value.trim().length > 0 ? value : "-";
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
              {!hideXrp && (
                <td
                  dangerouslySetInnerHTML={{
                    __html: getNetworkValue(parameter, "xrp"),
                  }}
                />
              )}
              {!hideBtc && (
                <td
                  dangerouslySetInnerHTML={{
                    __html: getNetworkValue(parameter, "btc"),
                  }}
                />
              )}
              {!hideDoge && (
                <td
                  dangerouslySetInnerHTML={{
                    __html: getNetworkValue(parameter, "doge"),
                  }}
                />
              )}
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
