import React, { type JSX, type ReactNode } from "react";
import Link from "@docusaurus/Link";

type RemixEmbedProps = {
  children: ReactNode;
  fileName: string;
};

const sanitizeFileName = (value: string) =>
  encodeURIComponent(value).replace(/%2F/g, "/");

export default function RemixEmbed({
  children,
  fileName,
}: RemixEmbedProps): JSX.Element {
  const baseUrl = "https://remix.ethereum.org/";
  const githubUrl =
    "#url=https://github.com/flare-foundation/developer-hub/blob/main/examples/developer-hub-solidity/" +
    sanitizeFileName(fileName);
  const parameters =
    "&version=builtin&evmVersion=cancun&optimize=true&runs=200";
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
