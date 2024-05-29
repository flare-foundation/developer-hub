import React from "react";
import Link from "@docusaurus/Link";

export default function Remix({ children, href }): JSX.Element {
  return (
    <div>
      <Link className="button button--primary" href={href}>
        {children}
      </Link>
    </div>
  );
}
