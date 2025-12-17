import React, { useState } from "react";
import styles from "../cardStyles.module.css";
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
    <div className={styles.card}>
      <Heading as="h3" className={styles.title}>
        To Hex Converter
      </Heading>
      <input
        type="text"
        placeholder="Enter string to convert to hex"
        value={data}
        onChange={(e) => setData(e.target.value)}
        className={styles.input}
      />
      <button
        onClick={handleClick}
        className={styles.button}
        aria-label="Encode to hex"
        title="Encode to hex"
      >
        Encode
      </button>
      <p className={styles.result}>
        Encoded string:
        {encodedData ? <b>{encodedData}</b> : <b style={{ opacity: 0.6 }}>—</b>}
      </p>
    </div>
  );
}
