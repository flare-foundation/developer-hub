import React from "react";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import Heading from "@theme/Heading";

export default function CustomCard({
  title,
  href,
  description,
  date,
  newTab = true,
}) {
  if (!title || !href) {
    console.error("CustomCard requires at least a title and href prop.");
    return null;
  }

  return (
    <Link
      href={href}
      className={clsx("custom-card")}
      {...(newTab && { target: "_blank", rel: "noopener noreferrer" })}
    >
      <div className="custom-card-content">
        <Heading as="h3" className="custom-card-title">
          {title}
        </Heading>
        {description && (
          <p className="custom-card-description">{description}</p>
        )}
        {date && <p className="custom-card-date">{date}</p>}
      </div>

      <span className="custom-card-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
