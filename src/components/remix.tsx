import React from "react";
import Link from "@docusaurus/Link";

export default function Remix({ children }): JSX.Element {
  return (
    <div>
      <Link
        className="button button--primary"
        href="https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.25+commit.b61c2a91.js"
      >
        {children}
      </Link>
    </div>
  );
}
