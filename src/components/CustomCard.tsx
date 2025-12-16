import React from "react";
import Link from "@docusaurus/Link";
import clsx from "clsx";

type CustomCardProps = {
  title: string;
  href: string;
  description?: string;
  date?: string;
  newTab?: boolean;
  className?: string;
};

/**
 * Treats absolute URLs (http/https) as external.
 * Everything else is assumed to be internal (relative path).
 */
function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

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

  const external = isExternalUrl(href);
  const openInNewTab = Boolean(newTab && external);

  const linkProps = external ? { href } : { to: href }; // internal navigation

  const ariaLabel = openInNewTab ? `${title} (opens in a new tab)` : title;

  return (
    <Link
      {...linkProps}
      className={clsx("custom-card", className)}
      aria-label={ariaLabel}
      {...(openInNewTab
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      <div className="custom-card-content">
        <span className="custom-card-title">{title}</span>

        {description ? (
          <p className="custom-card-description">{description}</p>
        ) : null}

        {date ? <p className="custom-card-date">{date}</p> : null}
      </div>

      <span className="custom-card-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
