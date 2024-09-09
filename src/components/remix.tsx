import React from "react";
import Link from "@docusaurus/Link";

export default function Remix({ children, fileName }): JSX.Element {
  const baseUrl = "https://remix.ethereum.org/";
  const githubUrl =
    "#url=https://github.com/flare-foundation/developer-hub/blob/main/examples/developer-hub-solidity/" +
    fileName;
  const parameters =
    "&version=builtin&evmVersion=london&optimize=true&runs=200";
  return (
    <div>
      <Link
        className="button button--primary"
        href={baseUrl + githubUrl + parameters}
      >
        {children}
      </Link>
    </div>
  );
}
