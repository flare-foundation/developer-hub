import React, { useState } from "react";
import "@site/src/css/custom.css";
import classes from "./inputCard.module.css";
import Heading from "@theme/Heading";

export default function ToHexConverter() {
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
    <div className={`${classes.card} input-card`}>
      <Heading as="h3" className="input-card-title">
        To Hex Converter
      </Heading>
      <input
        type="text"
        placeholder="Enter string to convert to hex"
        value={data}
        onChange={(e) => setData(e.target.value)}
        className="input-card-input"
      />
      <button
        onClick={handleClick}
        className="input-card-button"
        aria-label="Encode to hex"
        title="Encode to hex"
      >
        Encode
      </button>
      <p className="input-card-result">
        Encoded string: <b>{encodedData}</b>
      </p>
    </div>
  );
}
