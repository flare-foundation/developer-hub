import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Link from "@docusaurus/Link";

import { reference } from "./reference-data";

export default function Reference() {
  function ReferenceTable({
    network,
  }: {
    network: "songbird" | "coston" | "coston2" | "flare";
  }) {
    return (
      <table>
        <thead>
          <tr>
            <th>Contract</th>
            <th>Address</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {reference.map((item) => (
            <tr key={item.name[network]}>
              <td>{item.name[network]}</td>
              <td>
                {item.address[network] ? (
                  <Link
                    to={`https://${network}-explorer.flare.network/address/${item.address[network]}`}
                  >
                    <code>{item.address[network]}</code>
                  </Link>
                ) : (
                  "-"
                )}
              </td>
              <td>{item.description}</td>
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
        { label: "Flare Mainnet", value: "flare" },
        { label: "Flare Testnet Coston2", value: "coston2" },
        { label: "Songbird Canary-Network", value: "songbird" },
        { label: "Songbird Testnet Coston", value: "coston" },
      ]}
    >
      <TabItem value="flare">
        <ReferenceTable network="flare" />
      </TabItem>
      <TabItem value="coston2">
        <ReferenceTable network="coston2" />
      </TabItem>
      <TabItem value="songbird">
        <ReferenceTable network="songbird" />
      </TabItem>
      <TabItem value="coston">
        <ReferenceTable network="coston" />
      </TabItem>
    </Tabs>
  );
}
