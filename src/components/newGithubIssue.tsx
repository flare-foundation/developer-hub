import React from "react";
import Link from "@docusaurus/Link";

export default function NewGithubIssue({ children, issueType }): JSX.Element {
  let baseUrl = "https://github.com/flare-foundation/developer-hub/issues/new?";
  if (issueType == "development_issue") {
    baseUrl +=
      "assignees=&labels=bug&projects=&template=development_issue.yml&title=%5Bdev%5D%3A+";
  } else if (issueType == "feature_request") {
    baseUrl +=
      "assignees=&labels=enhancement&projects=&template=feature_request.yml&title=%5Bfeat%5D%3A+";
  } else if (issueType == "feed_request") {
    baseUrl +=
      "assignees=&labels=enhancement&projects=&template=feed_request.yml&title=%5Breq%5D%3A+";
  }
  return (
    <div>
      <Link className="button button--primary" href={baseUrl}>
        {children}
      </Link>
    </div>
  );
}
