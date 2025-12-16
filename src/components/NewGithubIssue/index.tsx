import React, { type ReactNode, useMemo } from "react";
import Link from "@docusaurus/Link";
import clsx from "clsx";

type IssueType =
  | "development_issue"
  | "feature_request"
  | "feed_request"
  | "default";

interface IssueConfig {
  labels: string[];
  template?: string;
  titlePrefix?: string;
}

interface NewGithubIssueProps {
  children: ReactNode;
  issueType?: string;
  title?: string;
  owner?: string;
  repo?: string;

  className?: string;
  newTab?: boolean;
}

const DEFAULT_OWNER = "flare-foundation";
const DEFAULT_REPO = "developer-hub";

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
    labels: ["enhancement"],
    template: "feed_request.yml",
    titlePrefix: "[req]: ",
  },
  default: {
    labels: [],
  },
};

function isKnownIssueType(
  value: string,
): value is Exclude<IssueType, "default"> {
  return (
    Object.prototype.hasOwnProperty.call(issueTypeConfig, value) &&
    value !== "default"
  );
}

function buildNewIssueUrl(
  owner: string,
  repo: string,
  config: IssueConfig,
  title?: string,
) {
  const base = `https://github.com/${owner}/${repo}/issues/new`;
  const params = new URLSearchParams();

  if (config.labels?.length) params.set("labels", config.labels.join(","));
  if (config.template) params.set("template", config.template);

  const prefixedTitle = `${config.titlePrefix ?? ""}${title ?? ""}`.trim();
  if (prefixedTitle) params.set("title", prefixedTitle);

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

const NewGithubIssue: React.FC<NewGithubIssueProps> = ({
  children,
  issueType,
  title,
  owner = DEFAULT_OWNER,
  repo = DEFAULT_REPO,
  className,
  newTab = true,
}) => {
  const { config, resolvedIssueType } = useMemo(() => {
    if (issueType && isKnownIssueType(issueType)) {
      return {
        config: issueTypeConfig[issueType],
        resolvedIssueType: issueType,
      };
    }
    return {
      config: issueTypeConfig.default,
      resolvedIssueType: "default" as const,
    };
  }, [issueType]);

  const finalUrl = useMemo(
    () => buildNewIssueUrl(owner, repo, config, title),
    [owner, repo, config, title],
  );

  if (
    process.env.NODE_ENV !== "production" &&
    issueType &&
    resolvedIssueType === "default"
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      `Unknown issueType "${issueType}" passed to NewGithubIssue. Falling back to default new-issue link.`,
    );
  }

  return (
    <div>
      <Link
        className={clsx("button button--primary", className)}
        href={finalUrl}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        aria-label="Open a new GitHub issue"
      >
        {children}
      </Link>
    </div>
  );
};

export default NewGithubIssue;
