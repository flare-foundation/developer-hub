import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import stabilityData from "@site/automations/feed_stability.json";
import riskData from "@site/automations/ftso_risk.json";
import styles from "../tableStyles.module.css";

type StabilityRow = {
  name: string;
  stability: number;
};

type RiskRow = {
  name: string;
  risk: 0 | 1 | 2 | 3 | 4;
};

const getStabilityIcon = (value: number) => {
  if (value >= 99) {
    return {
      icon: "🟢",
      tooltip:
        "Excellent stability: Feed maintains ≥99% accuracy within 0.2% of reference.",
    };
  } else if (value >= 97) {
    return {
      icon: "🟢",
      tooltip:
        "Good stability: Feed maintains 97-99% accuracy within 0.2% of reference.",
    };
  } else if (value >= 94) {
    return {
      icon: "🟡",
      tooltip:
        "Moderate stability: Feed maintains 94-97% accuracy within 0.2% of reference.",
    };
  } else if (value >= 80) {
    return {
      icon: "🔴",
      tooltip:
        "Low stability: Feed maintains 80-94% accuracy within 0.2% of reference.",
    };
  } else {
    return {
      icon: "⚫",
      tooltip:
        "Very low stability: Feed maintains <80% accuracy within 0.2% of reference. Exercise caution.",
    };
  }
};

const getRiskIcon = (risk: RiskRow["risk"]) => {
  const riskMap: Record<RiskRow["risk"], { icon: string; tooltip: string }> = {
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
  return riskMap[risk];
};

export type FeedStabilityProps = {
  data?: StabilityRow[];
  showRisk?: boolean;
};

const FeedStability: React.FC<FeedStabilityProps> = ({
  data = stabilityData as StabilityRow[],
  showRisk = true,
}) => {
  const riskMap = new Map((riskData as RiskRow[]).map((r) => [r.name, r.risk]));

  const sortedData = [...data].sort((a, b) => b.stability - a.stability);

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.header}>
          <th>Feed</th>
          <th>Stability (0.2%)</th>
          <th>Status</th>
          {showRisk && <th>Risk</th>}
        </tr>
      </thead>

      <tbody>
        {sortedData.map((row) => {
          const { icon: stabilityIcon, tooltip: stabilityTooltip } =
            getStabilityIcon(row.stability);
          const risk = riskMap.get(row.name) ?? 2;
          const { icon: riskIcon, tooltip: riskTooltip } = getRiskIcon(
            risk as RiskRow["risk"],
          );

          return (
            <tr key={row.name} className={styles.row}>
              <td className={styles.regularFont}>{row.name}</td>

              <td className={styles.monoFont}>{row.stability.toFixed(2)}%</td>

              <td className={styles.regularFont}>
                <Tippy
                  content={stabilityTooltip}
                  theme="custom"
                  arrow
                  animation="fade"
                  maxWidth={250}
                  interactive
                >
                  <span className={styles.pointer}>{stabilityIcon}</span>
                </Tippy>
              </td>

              {showRisk && (
                <td className={styles.regularFont}>
                  <Tippy
                    content={riskTooltip}
                    theme="custom"
                    arrow
                    animation="fade"
                    maxWidth={250}
                    interactive
                  >
                    <span className={styles.pointer}>{riskIcon}</span>
                  </Tippy>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default FeedStability;
