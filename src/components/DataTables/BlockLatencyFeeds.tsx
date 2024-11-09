import React from "react";
import CopyButton from "../CopyButton";
import tableData from "../../../automations/block_latency_feeds.json";

const BlockLatencyFeeds = () => {
  return (
    <table className="data-table">
      <thead>
        <tr className="table-header">
          <th>Feed Name</th>
          <th>Feed Index</th>
          <th>Feed ID</th>
          <th>Base Asset</th>
          <th>Decimals</th>
          <th>Category</th>
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
            <td className="regular-font">{row.base_asset}</td>
            <td className="regular-font">{row.decimals}</td>
            <td className="regular-font">{row.category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BlockLatencyFeeds;
