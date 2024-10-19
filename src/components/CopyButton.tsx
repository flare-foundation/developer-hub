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
          width="25px"
          height="25px"
          fill="currentColor"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19l12-12-1.41-1.41z" />
        </svg>
      ) : (
        // Copy icon when not copied
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="25px"
          height="25px"
          fill="currentColor"
        >
          <path d="M19 9h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zm-6 8v-6h6v6h-6zm4-15h-10c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h2v-2h-2v-10h10v2h2v-2c0-1.1-.9-2-2-2z" />
        </svg>
      )}
    </button>
  );
};

export default CopyButton;
