import React from "react";
import "tippy.js/dist/tippy.css";
import CopyButton from "../CopyButton";
import tableData from "../../../automations/custom_feeds.json";

const CustomFeeds = () => {
  return (
    <table className="data-table">
      <thead>
        <tr className="table-header">
          <th>Name</th>
          <th>Index</th>
          <th>Feed ID</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => {
          return (
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
                Base Asset: {row.base_asset} <br />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CustomFeeds;
