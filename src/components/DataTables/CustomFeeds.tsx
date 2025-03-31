import React from "react";
import "tippy.js/dist/tippy.css";
import Link from "@docusaurus/Link";
import CopyButton from "../CopyButton";
import tableData from "../../../automations/custom_feeds.json";

const CustomFeeds = () => {
  return (
    <table className="data-table">
      <thead>
        <tr className="table-header">
          <th>Name</th>
          <th>Feed ID</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => {
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
                Base Asset: {row.base_asset} (
                <Link
                  to={row.provider_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${row.provider_name}`}
                </Link>
                ) <br />
                {row.contract && (
                  <>
                    Contract:{" "}
                    <Link
                      to={`https://flarescan.com/address/${row.contract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {`${row.contract}`}
                    </Link>
                  </>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CustomFeeds;
