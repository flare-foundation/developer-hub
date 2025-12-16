import React, { useCallback, useEffect, useMemo, useState } from "react";
import Heading from "@theme/Heading";
import { useHistory, useLocation } from "@docusaurus/router";
import toolsDataRaw from "@site/src/data/developerTools.json";
import CustomCard from "./CustomCard";

type ToolItem = {
  name: string;
  link: string;
  subtext?: string;
};

type ToolCategories = Record<string, ToolItem[]>;

type NetworkData = {
  name: string;
  categories: ToolCategories;
};

type NetworkTools = Record<string, NetworkData>;

type ToolsData = {
  toolDescriptions: Record<string, string>;
  networkTools: NetworkTools;
};

const DEFAULT_NETWORK = "flare";
const DEFAULT_TOOL_DESCRIPTION = "A tool for Flare ecosystem development.";

// Anchor IDs
const CATEGORY_IDS: Record<string, string> = {
  Bridges: "bridges",
  RPCs: "rpcs",
  OFTs: "ofts",
  Indexers: "indexers",
  "Wallet SDKs": "wallet-sdks",
  "Full-stack infra": "full-stack-infra",
  Analytics: "analytics",
  Explorers: "explorers",
};

const CATEGORY_ORDER = [
  "Bridges",
  "RPCs",
  "OFTs",
  "Indexers",
  "Wallet SDKs",
  "Full-stack infra",
  "Analytics",
  "Explorers",
] as const;

function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  if (!id) return;

  let attempts = 0;
  const maxAttempts = 12;

  const tick = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    attempts += 1;
    if (attempts < maxAttempts) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

const DeveloperTools: React.FC = () => {
  const toolsData = toolsDataRaw as unknown as ToolsData;
  const { toolDescriptions, networkTools } = toolsData;

  const location = useLocation();
  const history = useHistory();

  const networkKeys = useMemo(
    () => Object.keys(networkTools ?? {}),
    [networkTools],
  );

  const getInitialNetwork = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get("network");
    if (fromQuery && networkTools?.[fromQuery]) return fromQuery;

    if (networkTools?.[DEFAULT_NETWORK]) return DEFAULT_NETWORK;
    return networkKeys[0] ?? DEFAULT_NETWORK;
  }, [location.search, networkKeys, networkTools]);

  const [activeNetwork, setActiveNetwork] = useState<string>(getInitialNetwork);

  // Keep state aligned with browser nav
  useEffect(() => {
    const next = getInitialNetwork();
    setActiveNetwork(next);
  }, [getInitialNetwork]);

  const networkData = networkTools?.[activeNetwork];

  const orderedCategories = useMemo(() => {
    const cats = networkData?.categories ?? {};
    // Render known categories in a fixed order
    const known = CATEGORY_ORDER.filter((name) =>
      Object.prototype.hasOwnProperty.call(cats, name),
    ).map((name) => [name, cats[name]] as const);

    const unknown = Object.entries(cats).filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ([name]) => !CATEGORY_ORDER.includes(name as any),
    );

    return [...known, ...unknown];
  }, [networkData]);

  const setNetworkAndUrl = useCallback(
    (next: string) => {
      setActiveNetwork(next);

      const params = new URLSearchParams(location.search);
      params.set("network", next);

      history.replace({
        pathname: location.pathname,
        search: params.toString(),
        hash: location.hash,
      });
    },
    [history, location.hash, location.pathname, location.search],
  );

  // Scroll on hash changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!location.hash) return;
    scrollToHash(location.hash);
  }, [location.hash, activeNetwork]);

  // warn if toolDescriptions is missing keys
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!networkData) return;

    for (const [, tools] of Object.entries(networkData.categories ?? {})) {
      for (const tool of tools ?? []) {
        if (!toolDescriptions?.[tool.name]) {
          // eslint-disable-next-line no-console
          console.warn(
            `[DeveloperTools] Missing toolDescriptions entry for "${tool.name}".`,
          );
        }
      }
    }
  }, [networkData, toolDescriptions]);

  if (!networkData) {
    return (
      <div className="developer-tools-container">
        <p>
          Tools data unavailable. Ensure <code>networkTools</code> contains at
          least one network.
        </p>
      </div>
    );
  }

  return (
    <div className="developer-tools-container">
      <div className="developer-tools-header">
        <p>
          Developer tools for Flare including RPCs, bridges, wallet SDKs, and
          more.
        </p>

        <div className="network-selector-container">
          <div className="network-selector">
            <label htmlFor="network-select">Network</label>
            <select
              id="network-select"
              value={activeNetwork}
              onChange={(e) => setNetworkAndUrl(e.target.value)}
              className="network-select"
            >
              {networkKeys.map((networkKey) => (
                <option key={networkKey} value={networkKey}>
                  {networkTools[networkKey]?.name ?? networkKey}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="tools-grid">
        {orderedCategories.map(([category, tools]) => {
          const categoryId = CATEGORY_IDS[category] ?? category;

          return (
            <div key={category} className="category-section">
              <Heading as="h2" className="category-title" id={categoryId}>
                {category}
              </Heading>

              <div className="tools-cards">
                {!tools?.length ? (
                  <div className="empty-category">
                    No tools in this category
                  </div>
                ) : (
                  tools.map((tool) => {
                    const baseDescription =
                      toolDescriptions?.[tool.name] ?? DEFAULT_TOOL_DESCRIPTION;

                    const description = tool.subtext
                      ? `${baseDescription} — ${tool.subtext}`
                      : baseDescription;

                    return (
                      <CustomCard
                        key={`${tool.name}-${tool.link}`}
                        title={tool.name}
                        href={tool.link}
                        description={description}
                        newTab
                        date=""
                      />
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeveloperTools;
