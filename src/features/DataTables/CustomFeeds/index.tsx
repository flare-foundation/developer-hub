import React from "react";
import "tippy.js/dist/tippy.css";
import Link from "@docusaurus/Link";
import CopyButton from "@site/src/components/CopyButton";
import tableData from "./custom_feeds.json";
import styles from "../tableStyles.module.css";

const CustomFeeds = () => {
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.header}>
          <th>Name</th>
          <th>Feed ID</th>
          <th>Details</th>
        </tr>
      </thead>

      <tbody>
        {tableData.map((row) => {
          const feedUrl = `https://flare-systems-explorer.flare.network/price-feeds/custom?feed=${encodeURIComponent(
            row.feed_id,
          )}`;

          return (
            <tr key={row.feed_id} className={styles.row}>
              <td className={styles.regularFont}>
                <Link
                  href={feedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open ${row.feed_name} in Flare Systems Explorer`}
                >
                  {row.feed_name}
                </Link>
              </td>

              <td className={styles.monoFont}>
                <div className={styles.feedIdContainer}>
                  <span className={styles.feedIdText}>{row.feed_id}</span>
                  <CopyButton textToCopy={row.feed_id} />
                </div>
              </td>

              <td className={styles.regularFont}>
                Base Asset: {row.base_asset} (
                <Link
                  to={row.provider_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {row.provider_name}
                </Link>
                ) <br />
                {row.contract && (
                  <>
                    Contract:{" "}
                    <Link
                      to={`https://flare-explorer.flare.network/address/${row.contract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {row.contract}
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
