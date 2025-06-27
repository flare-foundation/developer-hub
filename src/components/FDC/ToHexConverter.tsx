import React, { useState } from "react";

export default function RoundCalculator() {
  const [data, setData] = useState("");
  const [encodedData, setEncodedData] = useState("");

  function toHex(data) {
    let result = "";
    for (let i = 0; i < data.length; i++) {
      result += data.charCodeAt(i).toString(16);
    }
    return "0x" + result.padEnd(64, "0");
  }

  async function handleClick() {
    const result = await toHex(data);
    setEncodedData(result);
  }

  return (
    <>
      <input
        type="string"
        placeholder="Enter string to convert to hex"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      <button onClick={handleClick}>Encode</button>
      <p>Encoded string: {encodedData}</p>
    </>
  );
}
