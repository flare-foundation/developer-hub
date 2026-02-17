/**
 * Mermaid Flare theme variables per color mode.
 * Docusaurus config cannot set different themeVariables for light/dark, so this component is required.
 */

import React, { useEffect, useRef, useMemo, type ReactNode } from "react";
import ErrorBoundary from "@docusaurus/ErrorBoundary";
import { ErrorBoundaryErrorMessageFallback } from "@docusaurus/theme-common";
import { useColorMode } from "@docusaurus/theme-common";
import {
  MermaidContainerClassName,
  useMermaidRenderResult,
  useMermaidThemeConfig,
} from "@docusaurus/theme-mermaid/client";
import type { Props } from "@theme/Mermaid";
import type { RenderResult } from "mermaid";

import styles from "./styles.module.css";

// Minimal theme variables (Flare light/dark). Base theme derives the rest.
const LIGHT_VARS = {
  darkMode: false,
  background: "#f4f4f4",
  primaryColor: "#f4f4f4",
  primaryTextColor: "#000000",
  primaryBorderColor: "#595959",
  lineColor: "#595959",
  textColor: "#000000",
  actorBkg: "#f4f4f4",
  actorBorder: "#595959",
  actorTextColor: "#000000",
  signalColor: "#595959",
  signalTextColor: "#000000",
  activationBkgColor: "#e62058",
  activationBorderColor: "#595959",
};

const DARK_VARS = {
  darkMode: true,
  background: "#1a1a1a",
  primaryColor: "#2a2a2a",
  primaryTextColor: "#ffffff",
  primaryBorderColor: "#5a5a5a",
  lineColor: "#5a5a5a",
  textColor: "#ffffff",
  actorBkg: "#2a2a2a",
  actorBorder: "#5a5a5a",
  actorTextColor: "#ffffff",
  signalColor: "#5a5a5a",
  signalTextColor: "#ffffff",
  activationBkgColor: "#8b4d65",
  activationBorderColor: "#8b4d65",
};

function MermaidRenderResult({
  renderResult,
}: {
  renderResult: RenderResult;
}): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const div = ref.current!;
    renderResult.bindFunctions?.(div);
  }, [renderResult]);
  return (
    <div
      ref={ref}
      className={`${MermaidContainerClassName} ${styles.container}`}
      dangerouslySetInnerHTML={{ __html: renderResult.svg }}
    />
  );
}

export default function Mermaid({ value }: Props): ReactNode {
  const { colorMode } = useColorMode();
  const themeConfig = useMermaidThemeConfig();
  const config = useMemo(
    () => ({
      startOnLoad: false,
      ...themeConfig?.options,
      theme: "base" as const,
      themeVariables: colorMode === "dark" ? DARK_VARS : LIGHT_VARS,
    }),
    [colorMode, themeConfig?.options],
  );
  const renderResult = useMermaidRenderResult({ text: value, config });

  return (
    <ErrorBoundary
      fallback={(params) => <ErrorBoundaryErrorMessageFallback {...params} />}
    >
      {renderResult === null ? null : (
        <MermaidRenderResult renderResult={renderResult} />
      )}
    </ErrorBoundary>
  );
}
