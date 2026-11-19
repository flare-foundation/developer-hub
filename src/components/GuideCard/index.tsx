import { type ReactNode, type JSX } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";

import styles from "./styles.module.css";

type GuideCardProps = {
  title: string;
  href: string;
  description: ReactNode;
  children?: ReactNode;
  className?: string;
};

export default function GuideCard({
  title,
  href,
  description,
  children,
  className,
}: GuideCardProps): JSX.Element {
  return (
    <Link href={href} className={clsx(styles.card, className)}>
      <div className={styles.header}>
        <Heading as="h3" className={styles.title}>
          {title}
        </Heading>
        <svg
          className={styles.arrow}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12.627 8.75H0.5V7.25H12.627L6.93075 1.55375L8 0.5L15.5 8L8 15.5L6.93075 14.4462L12.627 8.75Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <p className={styles.description}>{description}</p>
      {children ? <ul className={styles.points}>{children}</ul> : null}
    </Link>
  );
}
