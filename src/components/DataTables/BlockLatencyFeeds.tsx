import React from "react";
import CopyButton from "../CopyButton";
import tableData from "../../../automations/block_latency_feeds.json";

const getRiskIcon = (value: number): string => {
  const riskMap: Record<number, string> = {
    0: "🟢",
    1: "🟢",
    2: "🟡",
    3: "🔴",
  };
  return riskMap[value];
};

const BlockLatencyFeeds = () => {
  return (
    <table className="data-table">
      <thead>
        <tr className="table-header">
          <th>Name</th>
          <th>Index</th>
          <th>Feed ID</th>
          <th>Details</th>
          <th>Risk</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index} className="table-row">
            <td className="regular-font">{row.feed_name}</td>
            <td className="mono-font feed-index">
              <span className="feed-index-text">{row.feed_index}</span>
            </td>
            <td className="feed-id mono-font">
              <div className="feed-id-container">
                <span className="feed-id-text">{row.feed_id}</span>
                <CopyButton textToCopy={row.feed_id} />
              </div>
            </td>
            <td className="regular-font">
              Base Asset: {row.base_asset} <br></br> Decimals: {row.decimals}{" "}
              <br></br> Category: {row.category}
            </td>
            <td className="regular-font">{getRiskIcon(row.risk)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BlockLatencyFeeds;
