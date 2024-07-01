import React from "react";
import Link from "@docusaurus/Link";

export default function Remix({ children, gist }): JSX.Element {
  const baseUrl =
    "https://remix.ethereum.org/#version=builtin&evmVersion=london&optimize=true&runs=200&gist=";
  return (
    <div>
      <Link className="button button--primary" href={baseUrl + gist}>
        {children}
      </Link>
    </div>
  );
}
