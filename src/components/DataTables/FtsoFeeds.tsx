// Feeds.tsx
import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import CopyButton from "../CopyButton";
import tableData from "../../../automations/ftso_feeds.json";

type FeedRow = {
  feed_name: string;
  feed_id: string;
  base_asset: string;
  category: string;
  feed_index?: number;
  risk: 0 | 1 | 2 | 3 | 4;
};

const getRiskIcon = (value: FeedRow["risk"]) => {
  const riskMap: Record<FeedRow["risk"], { icon: string; tooltip: string }> = {
    0: { icon: "🟢", tooltip: "Low risk: Feeds demonstrating low volatility and generally stable price trends." },
    1: { icon: "🟢", tooltip: "Low risk: Feeds demonstrating low volatility and generally stable price trends." },
    2: { icon: "🟡", tooltip: "Medium risk: Feeds demonstrating moderate price fluctuations." },
    3: { icon: "🔴", tooltip: "High risk: Feeds demonstrating high volatility with frequent price swings." },
    4: { icon: "⚫", tooltip: "New Feed: Recently launched feeds with high volatility risk. Users must verify reliability." },
  };
  return riskMap[value];
};

export type FeedsProps = {
  /** If you want to pass your own data, provide it; otherwise defaults to ftso_feeds.json */
  data?: FeedRow[];
  /** Show the `Index` column (uses `feed_index`) */
  showIndex?: boolean;
};

const FtsoFeeds: React.FC<FeedsProps> = ({ data = tableData as FeedRow[], showIndex = false }) => (
  <table className="data-table">
    <thead>
      <tr className="table-header">
        <th>Name</th>
        {showIndex && <th>Index</th>}
        <th>Feed ID</th>
        <th>Details</th>
        <th>Risk</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) => {
        const { icon, tooltip } = getRiskIcon(row.risk);
        return (
          <tr key={`${row.feed_id}-${i}`} className="table-row">
            <td className="regular-font">{row.feed_name}</td>

            {showIndex && (
              <td className="mono-font feed-index">
                <span className="feed-index-text">{row.feed_index ?? ""}</span>
              </td>
            )}

            <td className="feed-id mono-font">
              <div className="feed-id-container">
                <span className="feed-id-text">{row.feed_id}</span>
                <CopyButton textToCopy={row.feed_id} />
              </div>
            </td>

            <td className="regular-font">
              Base Asset: {row.base_asset} <br />
              Category: {row.category}
            </td>

            <td className="regular-font">
              <Tippy content={tooltip} theme="custom" arrow animation="fade" maxWidth={250} interactive>
                <span className="pointer">{icon}</span>
              </Tippy>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default FtsoFeeds;
