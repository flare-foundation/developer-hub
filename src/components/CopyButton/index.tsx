import React, { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

interface CopyButtonProps {
  textToCopy: string;
  defaultLabel?: string;
  copiedLabel?: string;
  successMessage?: string;
  failureMessage?: string;
  copiedDuration?: number;

  className?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

async function copyToClipboard(text: string) {
  if (typeof navigator === "undefined") {
    throw new Error("Clipboard unavailable in this environment.");
  }

  if (!navigator.clipboard?.writeText) {
    throw new Error("Clipboard API unavailable in this browser/context.");
  }

  await navigator.clipboard.writeText(text);
}

const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  defaultLabel = "Copy",
  copiedLabel = "Copied!",
  successMessage = "Copied.",
  failureMessage = "Failed to copy.",
  copiedDuration = 1000,
  className,
  disabled = false,
  size = "sm",
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (disabled) return;

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    // Force re-announce on repeated clicks (some SRs ignore identical messages).
    setStatusMessage("");
    setErrorMessage("");

    try {
      await copyToClipboard(textToCopy);
      if (!isMountedRef.current) return;

      setIsCopied(true);
      setStatusMessage(successMessage);

      timeoutIdRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        setIsCopied(false);
        setStatusMessage("");
        timeoutIdRef.current = null;
      }, copiedDuration);
    } catch {
      if (!isMountedRef.current) return;
      setIsCopied(false);
      setErrorMessage(failureMessage);
    }
  }, [copiedDuration, disabled, failureMessage, successMessage, textToCopy]);

  const currentLabel = isCopied ? copiedLabel : defaultLabel;

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className={clsx(styles.copyButton, styles[size], className)}
        disabled={disabled}
        aria-label={currentLabel}
        title={currentLabel}
        aria-pressed={isCopied}
      >
        {isCopied ? (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={styles.iconSuccess}
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19l12-12-1.41-1.41z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
            <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
          </svg>
        )}
      </button>

      <div className={styles.srOnly} role="status" aria-live="polite">
        {statusMessage}
      </div>
      <div className={styles.srOnly} role="alert" aria-live="assertive">
        {errorMessage}
      </div>
    </>
  );
};

export default CopyButton;
