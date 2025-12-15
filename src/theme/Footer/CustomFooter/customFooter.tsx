import type { ReactNode } from "react";
import classes from "./customFooter.module.css";
import Link from "@docusaurus/Link";
import SocialLinks from "../SocialLinks/SocialLinks";
import { type Props } from "@theme/Footer/LinkItem";
import clsx from "clsx";

type CustomFooterProps = {
  links?: {
    title: string;
    items: Props["item"][];
  }[];
  logo?: ReactNode;
  copyright?: ReactNode;
};

export default function CustomFooter({
  links,
  logo,
  copyright,
}: CustomFooterProps) {
  const flareLinks = links.find((link) => link.title == "Flare");
  const resourcesLinks = links.find((link) => link.title == "Resources");
  const exploreLinks = links.find((link) => link.title == "Explore");
  const governanceLinks = links.find((link) => link.title == "Governance");

  return (
    <footer className={classes.footerRoot}>
      <div className={clsx(classes.footerContainer, "container")}>
        <div className={classes.brandSection}>
          {/* Logo first */}
          <div className={classes.logoWrapper}>{logo}</div>

          {/* Navigation links */}
          {flareLinks && (
            <div className={classes.horizontalLinks}>
              {flareLinks.items.map(({ label, to, href }, index) => (
                <>
                  {index > 0 && <span className={classes.divider}>|</span>}
                  <Link
                    className={classes.horizLink}
                    key={label}
                    to={href || to}
                    target={href ? "_blank" : undefined}
                  >
                    {label}
                  </Link>
                </>
              ))}
            </div>
          )}

          {/* Social icons */}
          <SocialLinks />

          {/* Copyright at the bottom */}
          <div className={classes.copyrightWrapper}>{copyright}</div>
        </div>

        <div className={classes.columnsSection}>
          {resourcesLinks && (
            <div className={classes.footerColumn}>
              <div className={classes.columnTitle}>
                {resourcesLinks.title.toUpperCase()}
              </div>
              <div className={classes.columnLinks}>
                {resourcesLinks.items.map(({ label, to, href }) => (
                  <Link
                    className={classes.columnLink}
                    key={label}
                    to={href || to}
                    target={href ? "_blank" : undefined}
                  >
                    <div>{label}</div>
                    {href && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-up-right"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M17 7l-10 10" />
                        <path d="M8 7l9 0l0 9" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {exploreLinks && (
            <div className={classes.footerColumn}>
              <div className={classes.columnTitle}>
                {exploreLinks.title.toUpperCase()}
              </div>
              <div className={classes.columnLinks}>
                {exploreLinks.items.map(({ label, to, href }) => (
                  <Link
                    className={classes.columnLink}
                    key={label}
                    to={href || to}
                    target={href ? "_blank" : undefined}
                  >
                    <div>{label}</div>
                    {href && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-up-right"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M17 7l-10 10" />
                        <path d="M8 7l9 0l0 9" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {governanceLinks && (
            <div className={classes.footerColumn}>
              <div className={classes.columnTitle}>
                {governanceLinks.title.toUpperCase()}
              </div>
              <div className={classes.columnLinks}>
                {governanceLinks.items.map(({ label, to, href }) => (
                  <Link
                    className={classes.columnLink}
                    key={label}
                    to={href || to}
                    target={href ? "_blank" : undefined}
                  >
                    <div>{label}</div>
                    {href && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-up-right"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M17 7l-10 10" />
                        <path d="M8 7l9 0l0 9" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
