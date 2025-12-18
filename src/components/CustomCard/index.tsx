import React from "react";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import styles from "./styles.module.css";

type CustomCardProps = {
  title: string;
  href: string;
  description?: string;
  date?: string;
  newTab?: boolean;
  className?: string;
};

export default function CustomCard({
  title,
  href,
  description,
  date,
  newTab = true,
  className,
}: CustomCardProps) {
  if (!title || !href) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("CustomCard requires `title` and `href` props.", {
        title,
        href,
      });
    }
    return null;
  }

  const ariaLabel = newTab ? `${title} (opens in a new tab)` : title;

  return (
    <Link
      href={href}
      className={clsx(styles.card, className)}
      aria-label={ariaLabel}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>

        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}

        {date ? <p className={styles.date}>{date}</p> : null}
      </div>

      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}
