import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Link from "@docusaurus/Link";

import { operationalParameters } from "./operational-parameters";

export default function OperationalParameters({
  sectionTitle,
  filterParameters,
}: {
  sectionTitle: string;
  filterParameters?: string[];
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
                    __html: parameter.values[network].xrp,
                  }}
                />
              )}
              {!hideBtc && (
                <td
                  dangerouslySetInnerHTML={{
                    __html: parameter.values[network].btc,
                  }}
                />
              )}
              {!hideDoge && (
                <td
                  dangerouslySetInnerHTML={{
                    __html: parameter.values[network].doge,
                  }}
                />
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <Tabs
      defaultValue="flare"
      values={[
        { label: "Flare Mainnet", value: "flare" },
        { label: "Flare Testnet Coston2", value: "coston2" },
        { label: "Songbird Canary-Network", value: "songbird" },
        { label: "Songbird Testnet Coston", value: "coston" },
      ]}
    >
      <TabItem value="flare">
        <ParameterTable
          network="flare"
          parameters={parameters}
          hideBtc
          hideDoge
        />
      </TabItem>
      <TabItem value="coston2">
        <ParameterTable
          network="coston2"
          parameters={parameters}
          hideBtc
          hideDoge
        />
      </TabItem>
      <TabItem value="songbird">
        <ParameterTable
          network="songbird"
          parameters={parameters}
          hideBtc
          hideDoge
        />
      </TabItem>
      <TabItem value="coston">
        <ParameterTable network="coston" parameters={parameters} />
      </TabItem>
    </Tabs>
  );
}
