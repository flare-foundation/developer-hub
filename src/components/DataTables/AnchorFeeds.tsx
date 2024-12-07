import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import CopyButton from "../CopyButton";
import tableData from "../../../automations/anchor_feeds.json";

const getRiskIcon = (value: number): { icon: string; tooltip: string } => {
  const riskMap: Record<number, { icon: string; tooltip: string }> = {
    0: {
      icon: "🟢",
      tooltip:
        "Low risk: Feeds demonstrating low volatility and generally stable price trends.",
    },
    1: {
      icon: "🟢",
      tooltip:
        "Low risk: Feeds demonstrating low volatility and generally stable price trends.",
    },
    2: {
      icon: "🟡",
      tooltip: "Medium risk: Feeds demonstrating moderate price fluctuations.",
    },
    3: {
      icon: "🔴",
      tooltip:
        "High risk: Feeds demonstrating high volatility with frequent price swings.",
    },
  };
  return riskMap[value];
};

const AnchorFeeds = () => {
  return (
    <table className="data-table">
      <thead>
        <tr className="table-header">
          <th>Name</th>
          <th>Feed ID</th>
          <th>Details</th>
          <th>Risk</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => {
          const { icon, tooltip } = getRiskIcon(row.risk);
          return (
            <tr key={index} className="table-row">
              <td className="regular-font">{row.feed_name}</td>

              <td className="feed-id mono-font">
                <div className="feed-id-container">
                  <span className="feed-id-text">{row.feed_id}</span>
                  <CopyButton textToCopy={row.feed_id} />
                </div>
              </td>
              <td className="regular-font">
                Base Asset: {row.base_asset} <br />
                Decimals: {row.decimals} <br />
                Category: {row.category}
              </td>

              <td className="regular-font">
                <Tippy
                  content={tooltip}
                  theme="custom"
                  arrow={true}
                  animation="fade"
                  maxWidth={250}
                  interactive={true}
                >
                  <span className="pointer">{icon}</span>
                </Tippy>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AnchorFeeds;
