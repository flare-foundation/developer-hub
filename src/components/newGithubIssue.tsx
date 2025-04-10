import React from "react";
import Link from "@docusaurus/Link";

// Define the possible issue types explicitly
type IssueType =
  | "development_issue"
  | "feature_request"
  | "feed_request"
  | "default";

// Define the structure for issue type configuration
interface IssueConfig {
  labels: string[]; // Use array for potentially multiple labels
  template: string;
  titlePrefix: string;
}

// Define the props for the component
interface NewGithubIssueProps {
  children: React.ReactNode; // Content of the button/link
  issueType?: IssueType | string; // Allow known types or any string (with fallback)
}

// --- Configuration ---
const GITHUB_REPO_OWNER = "flare-foundation";
const GITHUB_REPO_NAME = "developer-hub";
const GITHUB_NEW_ISSUE_BASE_URL = `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues/new`;

// Map issue types to their specific parameters
const issueTypeConfig: Record<IssueType, IssueConfig> = {
  development_issue: {
    labels: ["bug"],
    template: "development_issue.yml",
    titlePrefix: "[dev]: ",
  },
  feature_request: {
    labels: ["enhancement"],
    template: "feature_request.yml",
    titlePrefix: "[feat]: ",
  },
  feed_request: {
    labels: ["enhancement"], // Or maybe a specific 'feed request' label?
    template: "feed_request.yml",
    titlePrefix: "[req]: ",
  },
  // Default/fallback configuration if type is unknown or not specified
  default: {
    labels: [],
    template: "", // No specific template
    titlePrefix: "",
  },
};
// --- Component ---

const NewGithubIssue: React.FC<NewGithubIssueProps> = ({
  children,
  issueType,
}) => {
  // Determine the configuration to use, falling back to default
  const config =
    issueType && issueType in issueTypeConfig
      ? issueTypeConfig[issueType as IssueType] // Type assertion safe due to check
      : issueTypeConfig.default;

  // Use URLSearchParams for robust query parameter handling & encoding
  const params = new URLSearchParams();

  // Add parameters based on the selected config
  if (config.labels.length > 0) {
    params.set("labels", config.labels.join(",")); // Join labels with comma
  }
  if (config.template) {
    params.set("template", config.template);
  }
  if (config.titlePrefix) {
    params.set("title", config.titlePrefix);
  }

  // Add other potential default parameters if needed (assignees, projects are often better left blank)
  // params.set('assignees', '');
  // params.set('projects', '');

  // Construct the final URL
  const finalUrl = `${GITHUB_NEW_ISSUE_BASE_URL}?${params.toString()}`;

  // Optional: Log a warning in development if an unknown type was used
  if (
    process.env.NODE_ENV === "development" &&
    issueType &&
    !(issueType in issueTypeConfig)
  ) {
    console.warn(
      `Unknown issueType "${issueType}" passed to NewGithubIssue. Falling back to default link.`,
    );
  }

  return (
    <div>
      {/* Using Docusaurus Link component */}
      <Link className="button button--primary" href={finalUrl}>
        {children}
      </Link>
    </div>
  );
};

export default NewGithubIssue;
