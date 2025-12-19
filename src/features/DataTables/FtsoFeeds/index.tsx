import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import CopyButton from "@site/src/components/CopyButton";
import tableData from "./ftso_feeds.generated.json";
import Link from "@docusaurus/Link";
import styles from "../tableStyles.module.css";

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
    4: {
      icon: "⚫",
      tooltip:
        "New Feed: Recently launched feeds with high volatility risk. Users must verify reliability.",
    },
  };
  return riskMap[value];
};

export type FeedsProps = {
  /** If you want to pass your own data, provide it; otherwise defaults to ftso_feeds.json */
  data?: FeedRow[];
  /** Show the `Index` column (uses `feed_index`) */
  showIndex?: boolean;
};

const FtsoFeeds: React.FC<FeedsProps> = ({
  data = tableData as FeedRow[],
  showIndex = false,
}) => (
  <table className={styles.table}>
    <thead>
      <tr className={styles.header}>
        <th>Name</th>
        {showIndex && <th>Index</th>}
        <th>Feed ID</th>
        <th>Details</th>
        <th>Risk</th>
      </tr>
    </thead>

    <tbody>
      {data.map((row) => {
        const { icon, tooltip } = getRiskIcon(row.risk);
        const feedUrl = `https://flare-systems-explorer.flare.network/price-feeds/ftso?feed=${encodeURIComponent(
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

            {showIndex && (
              <td className={styles.monoFont}>
                <span className={styles.feedIndexText}>
                  {row.feed_index ?? ""}
                </span>
              </td>
            )}

            <td className={styles.monoFont}>
              <div className={styles.feedIdContainer}>
                <span className={styles.feedIdText}>{row.feed_id}</span>
                <CopyButton textToCopy={row.feed_id} />
              </div>
            </td>

            <td className={styles.regularFont}>
              Base Asset: {row.base_asset} <br />
              Category: {row.category}
            </td>

            <td className={styles.regularFont}>
              <Tippy
                content={tooltip}
                theme="custom"
                arrow
                animation="fade"
                maxWidth={250}
                interactive
              >
                <span className={styles.pointer}>{icon}</span>
              </Tippy>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default FtsoFeeds;
