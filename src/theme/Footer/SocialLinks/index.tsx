import React from "react";
import Link from "@docusaurus/Link";

import GitHub from "@site/static/img/social-icons/github.svg";
import YouTube from "@site/static/img/social-icons/youtube.svg";
import LinkedIn from "@site/static/img/social-icons/linkedin.svg";
import Discord from "@site/static/img/social-icons/discord.svg";
import X from "@site/static/img/social-icons/X.svg";
import Telegram from "@site/static/img/social-icons/Telegram.svg";
import Discourse from "@site/static/img/social-icons/discourse.svg";

import styles from "./styles.module.css";

type SocialLink = {
  href: string;
  Icon: React.ComponentType<React.ComponentProps<"svg">>;
  label: string;
};

const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://github.com/flare-foundation",
    Icon: GitHub,
    label: "GitHub",
  },
  {
    href: "https://www.youtube.com/c/Flare_Networks",
    Icon: YouTube,
    label: "YouTube",
  },
  {
    href: "https://www.linkedin.com/company/flarenetwork/",
    Icon: LinkedIn,
    label: "LinkedIn",
  },
  {
    href: "https://discord.com/invite/flarenetwork",
    Icon: Discord,
    label: "Discord",
  },
  {
    href: "https://x.com/FlareNetworks",
    Icon: X,
    label: "X",
  },
  {
    href: "https://t.me/FlareNetwork",
    Icon: Telegram,
    label: "Telegram",
  },
  {
    href: "https://forum.flare.network",
    Icon: Discourse,
    label: "Discourse Forum",
  },
];

export default function SocialLinks() {
  return (
    <div className={styles.list}>
      {SOCIAL_LINKS.map(({ href, Icon, label }) => (
        <Link
          key={href}
          to={href}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
        >
          <span className={styles.iconWrap} aria-hidden="true">
            <Icon className={styles.icon} focusable="false" />
          </span>
        </Link>
      ))}
    </div>
  );
}
