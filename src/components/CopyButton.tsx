import React, { useState } from "react";

const CopyButton = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset to copy icon after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      style={{ cursor: "pointer", background: "none", border: "none" }}
    >
      {isCopied ? (
        // Tick mark icon when copied
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="22px"
          height="22px"
          style={{ fill: "#00d600" }}
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19l12-12-1.41-1.41z" />
        </svg>
      ) : (
        // Copy icon when not copied
        <svg viewBox="0 0 24 24" width="22px" height="22px">
          <path
            fill="currentColor"
            d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
          />
        </svg>
      )}
    </button>
  );
};

export default CopyButton;
