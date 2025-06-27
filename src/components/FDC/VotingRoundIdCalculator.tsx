import React, { useState } from "react";

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
    <>
      <input
        type="number"
        placeholder="Enter block timestamp"
        value={timestamp}
        onChange={(e) => setTimestamp(e.target.value)}
      />
      <button onClick={handleClick}>Calculate Round ID</button>
      <p>Round ID: {roundId}</p>
    </>
  );
}
