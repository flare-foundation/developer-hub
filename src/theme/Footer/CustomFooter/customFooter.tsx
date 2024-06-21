import { ReactNode } from "react";
import classes from "./customFooter.module.css";
import type { Props } from "@theme/Footer/Links/MultiColumn";

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
          <div>DEVELOPER LINKS</div>
          <div className={classes.displayedLinks}>
            {developerLinks.items.map(({ label, href }) => (
              <div key={label}>{label}</div>
            ))}
          </div>
        </div>
        <div className={classes.supportLinks}>
          <div>{logo}</div>
          <div className={classes.supportDisplayedLinks}>
            {supportLinks.items.map(({ label, href }, index) => (
              <>
                {index != 0 && <div>|</div>}
                <div>{label}</div>
              </>
            ))}
            <div>|</div>
            <div>{copyright}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
