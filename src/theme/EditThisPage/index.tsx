import React, { type ReactNode } from "react";
import Translate from "@docusaurus/Translate";
import { ThemeClassNames } from "@docusaurus/theme-common";
import Link from "@docusaurus/Link";
import type { Props } from "@theme/EditThisPage";
import styles from "./styles.module.css";

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M17 7l-10 10" />
      <path d="M8 7l9 0l0 9" />
    </svg>
  );
}

export default function EditThisPage({ editUrl }: Props): ReactNode {
  return (
    <Link
      to={editUrl}
      className={`${ThemeClassNames.common.editThisPage} ${styles.editThisPageLink}`}
    >
      <Translate
        id="theme.common.editThisPage"
        description="The link label to view the raw source for the current page"
      >
        View page as Markdown
      </Translate>
      <ExternalIcon className={styles.externalIcon} />
    </Link>
  );
}
