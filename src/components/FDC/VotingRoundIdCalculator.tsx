import React, { useState } from "react";
import "@site/src/css/custom.css";
import classes from "./inputCard.module.css";
import Heading from "@theme/Heading";

export default function RoundCalculator() {
  const [timestamp, setTimestamp] = useState("");
  const [roundId, setRoundId] = useState("");

  async function calculateRoundId(blockTimestamp) {
    const firsVotingRoundStartTs = 1658430000;
    const votingEpochDurationSeconds = 90;
    return Math.floor(
      (blockTimestamp - firsVotingRoundStartTs) / votingEpochDurationSeconds,
    );
  }

  async function handleClick() {
    const result = await calculateRoundId(parseInt(timestamp));
    setRoundId(result.toString());
  }

  return (
    <div className={`${classes.card} input-card`}>
      <Heading as="h3" className="input-card-title">
        Voting Round ID Calculator
      </Heading>
      <input
        type="number"
        placeholder="Enter block timestamp"
        value={timestamp}
        onChange={(e) => setTimestamp(e.target.value)}
        className="input-card-input"
      />
      <button
        onClick={handleClick}
        className="input-card-button"
        aria-label="Calculate Round ID"
        title="Calculate Round ID"
      >
        Calculate Round ID
      </button>
      <p className="input-card-result">
        Round ID: <b>{roundId}</b>
      </p>
    </div>
  );
}
