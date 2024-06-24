import { ReactNode } from "react";
import classes from "./customFooter.module.css";
import type { Props } from "@theme/Footer/Links/MultiColumn";
import Link from "@docusaurus/Link";
import SocialLinks from "../SocialLinks/SocialLinks";

type CustomFooterProps = {
  links?: any[];
  logo?: ReactNode;
  copyright?: ReactNode;
};

export default function CustomFooter({
  links,
  logo,
  copyright,
}: CustomFooterProps) {
  const developerLinks = links.find((link) => link.title == "Developer links");
  const supportLinks = links.find((link) => link.title == "Support");
  return (
    <footer>
      <div className={classes.footerContainer}>
        <div className={classes.developerLinks}>
          <div className={classes.developerLinksTitle}>DEVELOPER LINKS</div>
          <div className={classes.displayedLinks}>
            {developerLinks.items.map(({ label, href }) => (
              <Link
                className={classes.devExternalLink}
                key={label}
                to={href}
                target="_blank"
              >
                <div>{label}</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
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
              </Link>
            ))}
          </div>
        </div>
        <div className={classes.supportLinks}>
          <div>{logo}</div>
          <div className={classes.supportDisplayedLinks}>
            {supportLinks.items.map(({ label, to }, index) => (
              <>
                {index != 0 && <div>|</div>}
                <Link
                  key={label}
                  to={to}
                  className={classes.supportExternalLink}
                >
                  {label}
                </Link>
              </>
            ))}
            <div>|</div>
            <div>{copyright}</div>
          </div>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
