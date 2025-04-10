import React, { useState, useEffect, useMemo } from "react";
import Heading from "@theme/Heading";
import toolsDataRaw from "@site/src/data/developerTools.json";
import CustomCard from "./CustomCard";

type ToolItem = {
  name: string;
  link: string;
  subtext?: string;
};

type ToolCategories = {
  [category: string]: ToolItem[]; // A dictionary mapping category names to tool lists
};

type NetworkData = {
  name: string; // Display name for the network (e.g., "Flare")
  categories: ToolCategories;
};

type NetworkTools = {
  [networkKey: string]: NetworkData; // Key is the network identifier (e.g., "flare")
};

type ToolsData = {
  toolDescriptions: { [key: string]: string }; // Descriptions keyed by tool name
  networkTools: NetworkTools;
};

const DEFAULT_NETWORK = "flare";
const DEFAULT_TOOL_DESCRIPTION = "A tool for Flare ecosystem development.";
const SCROLL_DELAY_MS = 100; // Delay for scrolling to anchor

const DeveloperTools: React.FC = () => {
  const [activeNetwork, setActiveNetwork] = useState<string>(DEFAULT_NETWORK);
  const [isClient, setIsClient] = useState<boolean>(false);

  const toolsData = toolsDataRaw as ToolsData;
  const { toolDescriptions, networkTools } = toolsData;

  // Memoize network keys to avoid recalculating on every render if networkTools doesn't change
  const networkKeys = useMemo(() => Object.keys(networkTools), [networkTools]);

  // Memoize the currently selected network's data
  const networkData = useMemo(
    () => networkTools[activeNetwork],
    [networkTools, activeNetwork],
  );

  // --- Effects ---
  useEffect(() => {
    // Component has mounted, safe to access window/document
    setIsClient(true);

    // Handle scrolling to anchor link if present on initial load
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      // Use timeout to allow the DOM to potentially settle after initial render
      const timerId = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, SCROLL_DELAY_MS);

      // Cleanup timeout if component unmounts before it fires
      return () => clearTimeout(timerId);
    }
    // No cleanup needed if there's no hash
    return undefined;
  }, []); // Empty dependency array: runs only once after initial mount

  // --- Render Logic ---

  // Don't render on the server or until client is ready, or if network data is missing
  if (!isClient || !networkData) {
    // Render nothing or a placeholder/spinner if preferred
    return null;
  }

  // Generate category IDs safely
  const generateCategoryId = (category: string): string => {
    return category
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  return (
    <div className="developer-tools-container">
      {/* Header Section */}
      <div className="developer-tools-header">
        <p>
          Developer tools for Flare including RPCs, bridges, indexers, account
          abstraction, wallet SDKs, and more.
        </p>
        {/* Network Selector */}
        <div className="network-selector-container">
          <div className="network-selector">
            <label htmlFor="network-select">Network</label>
            <select
              id="network-select"
              value={activeNetwork}
              onChange={(e) => setActiveNetwork(e.target.value)}
              className="network-select"
              aria-label="Select a network"
            >
              {networkKeys.map((networkKey) => (
                <option key={networkKey} value={networkKey}>
                  {networkTools[networkKey]?.name || networkKey}{" "}
                  {/* Fallback to key if name missing */}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tools Grid Section */}
      <div className="tools-grid">
        {Object.entries(networkData.categories).map(([category, tools]) => (
          <div key={category} className="category-section">
            {/* Category Heading */}
            <Heading
              as="h2"
              className="category-title"
              id={generateCategoryId(category)} // Generate ID for anchor links
            >
              {category}
            </Heading>
            {/* Tool Cards within Category */}
            <div className="tools-cards">
              {/* Check if tools array exists and is empty */}
              {tools?.length === 0 ? (
                <div className="empty-category">
                  No tools listed in this category
                </div>
              ) : (
                /* Map over tools if array has items */
                tools?.map((tool) => (
                  <CustomCard
                    key={tool.name}
                    title={tool.name}
                    href={tool.link}
                    description={
                      toolDescriptions[tool.name] || DEFAULT_TOOL_DESCRIPTION
                    }
                    newTab={true}
                    date=""
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperTools;
