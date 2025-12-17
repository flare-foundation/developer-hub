import React, { type ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import SocialLinks from "../SocialLinks";
import { type Props as FooterLinkItemProps } from "@theme/Footer/LinkItem";
import styles from "./styles.module.css";

type LinkItem = FooterLinkItemProps["item"];

type CustomFooterProps = {
  links?: {
    title: string;
    items: LinkItem[];
  }[];
  logo?: ReactNode;
  copyright?: ReactNode;
};

function isExternalHref(href?: string) {
  return Boolean(href);
}

function getLinkProps(item: LinkItem) {
  const href = item.href as string | undefined;
  const to = item.to as string | undefined;

  const external = isExternalHref(href);
  return {
    to: external ? href : to,
    external,
  };
}

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

function FooterColumn({ title, items }: { title: string; items: LinkItem[] }) {
  return (
    <nav className={styles.footerColumn} aria-label={title}>
      <div className={styles.columnTitle}>{title}</div>

      <ul className={styles.columnLinks} role="list">
        {items.map((item, idx) => {
          const label = item.label as string | undefined;
          if (!label) return null;

          const { to, external } = getLinkProps(item);

          // Fallback key if label isn't unique
          const key = `${title}:${label}:${to ?? "nolink"}:${idx}`;

          return (
            <li key={key} className={styles.columnLinkItem}>
              <Link
                className={styles.columnLink}
                to={to}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <span className={styles.columnLinkLabel}>{label}</span>
                {external && <ExternalIcon className={styles.externalIcon} />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function CustomFooter({
  links = [],
  logo,
  copyright,
}: CustomFooterProps) {
  const getSection = (title: string) =>
    links.find((l) => l.title === title) ?? null;

  const flareLinks = getSection("Flare");
  const resourcesLinks = getSection("Resources");
  const exploreLinks = getSection("Explore");
  const governanceLinks = getSection("Governance");

  return (
    <footer className={styles.footerRoot}>
      <div className={clsx(styles.footerContainer, "container")}>
        <div className={styles.brandSection}>
          <div className={styles.logoWrapper}>{logo}</div>

          {flareLinks?.items?.length ? (
            <nav className={styles.horizontalLinks} aria-label="Flare links">
              <ul className={styles.horizontalLinksList} role="list">
                {flareLinks.items
                  .filter((item) => Boolean(item.label))
                  .map((item, idx) => {
                    const label = item.label as string;
                    const { to, external } = getLinkProps(item);
                    const key = `Flare:${label}:${to ?? "nolink"}:${idx}`;

                    return (
                      <li key={key} className={styles.horizItem}>
                        <Link
                          className={styles.horizLink}
                          to={to}
                          {...(external
                            ? {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              }
                            : {})}
                        >
                          {label}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </nav>
          ) : null}

          <div className={styles.socialWrapper} aria-label="Social links">
            <SocialLinks />
          </div>

          <div className={styles.copyrightWrapper}>{copyright}</div>
        </div>

        <div className={styles.columnsSection}>
          {resourcesLinks?.items?.length ? (
            <FooterColumn
              title={resourcesLinks.title.toUpperCase()}
              items={resourcesLinks.items}
            />
          ) : null}

          {exploreLinks?.items?.length ? (
            <FooterColumn
              title={exploreLinks.title.toUpperCase()}
              items={exploreLinks.items}
            />
          ) : null}

          {governanceLinks?.items?.length ? (
            <FooterColumn
              title={governanceLinks.title.toUpperCase()}
              items={governanceLinks.items}
            />
          ) : null}
        </div>
      </div>
    </footer>
  );
}
