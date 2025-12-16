import React, { useState } from "react";
import Heading from "@theme/Heading";
import styles from "../cardStyles.module.css";

export default function RoundCalculator() {
  const [timestamp, setTimestamp] = useState("");
  const [roundId, setRoundId] = useState("");

  function calculateRoundId(blockTimestamp: number) {
    const firstVotingRoundStartTs = 1658430000;
    const votingEpochDurationSeconds = 90;

    return Math.floor(
      (blockTimestamp - firstVotingRoundStartTs) / votingEpochDurationSeconds,
    );
  }

  function handleClick() {
    const ts = Number(timestamp);
    if (!Number.isFinite(ts)) return;

    const result = calculateRoundId(ts);
    setRoundId(result.toString());
  }

  return (
    <div className={styles.card}>
      <Heading as="h3" className={styles.title}>
        Voting Round ID Calculator
      </Heading>

      <input
        type="number"
        placeholder="Enter block timestamp"
        value={timestamp}
        onChange={(e) => setTimestamp(e.target.value)}
        className={styles.input}
      />

      <button
        onClick={handleClick}
        className={styles.button}
        aria-label="Calculate Round ID"
        title="Calculate Round ID"
      >
        Calculate Round ID
      </button>

      <p className={styles.result}>
        Round ID: <b>{roundId || "—"}</b>
      </p>
    </div>
  );
}
