import React, { type JSX } from "react";
import { useThemeConfig } from "@docusaurus/theme-common";
import FooterLinks from "@theme/Footer/Links";
import FooterLogo from "@theme/Footer/Logo";
import FooterCopyright from "@theme/Footer/Copyright";
import FooterLayout from "@theme/Footer/Layout";
import CustomFooter from "./CustomFooter/customFooter";

function Footer(): JSX.Element | null {
  const { footer } = useThemeConfig();
  if (!footer) {
    return null;
  }
  const { copyright, links, logo, style } = footer;

  return (
    <>
      {links.find((link) => link.title == "Flare") &&
      links.find((link) => link.title == "Resources") &&
      links.find((link) => link.title == "Explore") &&
      links.find((link) => link.title == "Governance") ? (
        <CustomFooter
          // @ts-expect-error: We are sure the footer links have the expected structure
          links={links && links.length > 0 && links}
          logo={logo && <FooterLogo logo={logo} />}
          copyright={copyright && <FooterCopyright copyright={copyright} />}
        />
      ) : (
        <FooterLayout
          style={style}
          links={links && links.length > 0 && <FooterLinks links={links} />}
          logo={logo && <FooterLogo logo={logo} />}
          copyright={copyright && <FooterCopyright copyright={copyright} />}
        />
      )}
    </>
  );
}

export default React.memo(Footer);
