import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Link from "@docusaurus/Link";

import { operationalParameters } from "./operational-parameters";

export default function OperationalParameters({
  sectionTitle,
  hideXrp = false,
  hideBtc = false,
  hideDoge = false,
}: {
  sectionTitle: string;
  hideXrp?: boolean;
  hideBtc?: boolean;
  hideDoge?: boolean;
}) {
  const operationalParametersSection = operationalParameters.find(
    (section) => section.title === sectionTitle,
  );

  function ParameterTable({
    network,
    parameters,
  }: {
    network: "songbird" | "coston";
    parameters: (typeof operationalParameters)[number]["parameters"];
  }) {
    return (
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            {!hideXrp && <th>XRP</th> }
            { !hideBtc && <th>BTC</th> }
            { !hideDoge && <th>DOGE</th> }
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
                &nbsp;{" "}
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
        { label: "Songbird Canary-Network", value: "songbird" },
        { label: "Songbird Testnet Coston", value: "coston" },
      ]}
    >
      <TabItem value="songbird">
        <ParameterTable
          network="songbird"
          parameters={operationalParametersSection.parameters}
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
