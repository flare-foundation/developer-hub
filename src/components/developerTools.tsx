import React, { useState, useEffect } from "react";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import toolsDataRaw from "@site/src/data/developerTools.json";

// Define the type for tool items
type ToolItem = {
  name: string;
  link: string;
  subtext?: string;
};

// Define the type for categories
type ToolCategories = {
  [category: string]: ToolItem[];
};

// Define the type for network data
type NetworkData = {
  name: string;
  categories: ToolCategories;
};

// Define the type for network tools
type NetworkTools = {
  [network: string]: NetworkData;
};

// Define the type for the complete tools data
type ToolsData = {
  toolDescriptions: { [key: string]: string };
  networkTools: NetworkTools;
};

const DeveloperTools = () => {
  const [activeNetwork, setActiveNetwork] = useState("flare");
  const [isClient, setIsClient] = useState(false);

  // Parse the imported JSON file
  const toolsData = toolsDataRaw as ToolsData;
  const { toolDescriptions, networkTools } = toolsData;

  // Handle client-side only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !networkTools[activeNetwork]) {
    return null;
  }

  const networkData = networkTools[activeNetwork];

  return (
    <div className="developer-tools-container">
      <div className="developer-tools-header">
        <p>
          Developer tools for Flare built by the community including RPCs,
          bridges, indexers, account abstraction, wallet SDKs, and more.
        </p>

        <div className="network-selector-container">
          <div className="network-selector">
            <label htmlFor="network-select">Network:</label>
            <select
              id="network-select"
              value={activeNetwork}
              onChange={(e) => setActiveNetwork(e.target.value)}
              className="network-select"
              aria-label="Select a network"
            >
              {Object.keys(networkTools).map((networkKey) => (
                <option key={networkKey} value={networkKey}>
                  {networkTools[networkKey].name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="tools-grid">
        {Object.entries(networkData.categories).map(([category, tools]) => (
          <div key={category} className="category-section">
            <Heading
              as="h2"
              className="category-title"
              id={`category-${category.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <a
                className="anchor-link"
                href={`#category-${category.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {category}
              </a>
            </Heading>
            <div className="tools-cards">
              {Array.isArray(tools) && tools.length === 0 ? (
                <div className="empty-category">
                  No tools available in this category
                </div>
              ) : (
                Array.isArray(tools) &&
                tools.map((tool) => (
                  <Link
                    key={tool.name}
                    to={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tool-card"
                  >
                    <div className="tool-info">
                      <Heading as="h3" className="tool-name">
                        {tool.name}
                        {tool.subtext && (
                          <span className="tool-subtext"> {tool.subtext}</span>
                        )}
                      </Heading>
                      <p className="tool-description">
                        {toolDescriptions[tool.name] ||
                          "A tool for Flare ecosystem development."}
                      </p>
                    </div>
                    <div className="tool-arrow" aria-hidden="true">
                      →
                    </div>
                  </Link>
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
