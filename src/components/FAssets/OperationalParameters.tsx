import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Link from "@docusaurus/Link";

import { operationalParameters } from "./operational-parameters";

export default function OperationalParameters({
  sectionTitle,
}: {
  sectionTitle: string;
}) {
  const operationalParametersSection = operationalParameters.find(
    (section) => section.title === sectionTitle,
  );

  function ParameterTable({
    network,
    parameters,
    hideXrp = false,
    hideBtc = false,
    hideDoge = false,
  }: {
    network: "songbird" | "coston" | "coston2";
    parameters: (typeof operationalParameters)[number]["parameters"];
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
            <tr key={parameter.settingName}>
              <td>
                {parameter.link ? (
                  <Link to={parameter.link}>
                    <b>{parameter.name}</b>
                  </Link>
                ) : (
                  <b>{parameter.name}</b>
                )}
                &nbsp; <br />
                {parameter.settingName && parameter.interfaceLink && (
                  <>
                    <Link to={parameter.interfaceLink}>
                      {parameter.settingName}
                    </Link>
                    &nbsp;
                  </>
                )}
                {parameter.interfaceLink && parameter.functionName && (
                  <>
                    <Link to={parameter.interfaceLink}>
                      {parameter.functionName}
                    </Link>
                    &nbsp;
                  </>
                )}
                {parameter.settingName && <code>{parameter.settingName}</code>}
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
      defaultValue="songbird"
      values={[
        { label: "Flare Testnet Coston2", value: "coston2" },
        { label: "Songbird Canary-Network", value: "songbird" },
        { label: "Songbird Testnet Coston", value: "coston" },
      ]}
    >
      <TabItem value="coston2">
        <ParameterTable
          network="coston2"
          parameters={operationalParametersSection.parameters}
          hideBtc
          hideDoge
        />
      </TabItem>
      <TabItem value="songbird">
        <ParameterTable
          network="songbird"
          parameters={operationalParametersSection.parameters}
          hideBtc
          hideDoge
        />
      </TabItem>
      <TabItem value="coston">
        <ParameterTable
          network="coston"
          parameters={operationalParametersSection.parameters}
        />
      </TabItem>
    </Tabs>
  );
}
