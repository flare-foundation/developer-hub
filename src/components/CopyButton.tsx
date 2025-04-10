import React, { useState, useEffect, useRef } from "react";

// Define props type
interface CopyButtonProps {
  textToCopy: string;
  /** Tooltip/aria-label for the default state */
  defaultLabel?: string;
  /** Tooltip/aria-label when successfully copied */
  copiedLabel?: string;
  /** Message announced to screen readers on success */
  successMessage?: string;
  /** Message announced to screen readers on failure */
  failureMessage?: string;
  /** Duration in ms to show the copied state */
  copiedDuration?: number;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  defaultLabel = "Copy",
  copiedLabel = "Copied!",
  successMessage = "Copied.",
  failureMessage = "Failed to copy.",
  copiedDuration = 2000,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState(""); // For ARIA live region
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null); // Ref to store timeout ID

  // Cleanup timeout on unmount or if copying again before timeout finishes
  useEffect(() => {
    // Return cleanup function
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []); // Empty dependency array ensures this runs only once for cleanup setup

  const handleCopy = async () => {
    // Clear any existing timeout if user clicks again quickly
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setStatusMessage(successMessage); // Announce success

      // Set timeout to reset state
      timeoutIdRef.current = setTimeout(() => {
        setIsCopied(false);
        setStatusMessage(""); // Clear message after duration
        timeoutIdRef.current = null;
      }, copiedDuration);
    } catch (err) {
      console.error("Failed to copy:", err);
      setStatusMessage(failureMessage); // Announce failure
      setIsCopied(false); // Ensure state is not "copied" on error

      // Optional: Clear error message after a delay
      // setTimeout(() => setStatusMessage(''), copiedDuration);
    }
  };

  const currentLabel = isCopied ? copiedLabel : defaultLabel;

  return (
    <>
      <button
        type="button" // Prevent form submission issues
        onClick={handleCopy}
        style={{
          cursor: "pointer",
          background: "none",
          border: "none",
          padding: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label={currentLabel}
        title={currentLabel} // Basic tooltip
      >
        {isCopied ? (
          // Tick mark icon when copied
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="22px"
            height="22px"
            style={{ fill: "#00d600" }}
            aria-hidden="true" // Icon is decorative, label provides info
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19l12-12-1.41-1.41z" />
          </svg>
        ) : (
          // Copy icon when not copied
          <svg
            viewBox="0 0 24 24"
            width="22px"
            height="22px"
            style={{ fill: "currentColor" }} // Inherits text color
            aria-hidden="true" // Icon is decorative, label provides info
          >
            <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
          </svg>
        )}
      </button>
      {/* ARIA Live Region for Screen Reader Announcements */}
      {/* Using 'assertive' might be better for errors, but 'polite' is generally preferred */}
      <div
        aria-live="polite"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {statusMessage}
      </div>
    </>
  );
};

export default CopyButton;
