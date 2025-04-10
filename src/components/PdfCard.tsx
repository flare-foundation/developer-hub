import React from "react";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import Heading from "@theme/Heading";

export default function PdfCard({
  title,
  href,
  description,
  date,
  newTab = true,
}) {
  if (!title || !href) {
    console.error("PdfCard requires at least a title and href prop.");
    return null;
  }

  return (
    <Link
      href={href}
      className={clsx("whitepapers-card", "pdf-card-link")}
      {...(newTab && { target: "_blank", rel: "noopener noreferrer" })}
    >
      <div className="whitepapers-card-content">
        <Heading as="h3" className="whitepapers-card-title">
          {title}
        </Heading>
        {description && (
          <p className="cardDescription pdf-card-description">{description}</p>
        )}
        {date && <p className="whitepapers-card-date pdf-card-date">{date}</p>}
      </div>

      <span className="whitepapers-arrow-icon" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
