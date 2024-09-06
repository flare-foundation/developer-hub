import GitHub from "@site/static/img/social-icons/github.svg";
import YouTube from "@site/static/img/social-icons/youtube.svg";
import LinkedIn from "@site/static/img/social-icons/linkedin.svg";
import Discord from "@site/static/img/social-icons/discord.svg";
import Medium from "@site/static/img/social-icons/Medium.svg";
import X from "@site/static/img/social-icons/X.svg";
import Telegram from "@site/static/img/social-icons/Telegram.svg";

import Link from "@docusaurus/Link";
import classes from "./socialLinks.module.css";

type SocialLinkProps = {
  href: string;
  icon: React.ComponentType<React.ComponentProps<"svg">>;
  label: string;
};

const socialLinks: Array<SocialLinkProps> = [
  {
    href: "https://github.com/flare-foundation",
    icon: GitHub,
    label: "GitHub",
  },
  {
    href: "https://www.youtube.com/c/Flare_Networks",
    icon: YouTube,
    label: "YouTube",
  },
  {
    href: "https://www.linkedin.com/company/flarenetwork/",
    icon: LinkedIn,
    label: "LinkedIn",
  },
  {
    href: "https://medium.com/flarenetwork",
    icon: Medium,
    label: "Medium",
  },
  {
    href: "https://discord.com/invite/flarenetwork",
    icon: Discord,
    label: "Discord",
  },
  {
    href: "https://twitter.com/FlareNetworks",
    icon: X,
    label: "X (formerly Twitter)",
  },
  {
    href: "https://t.me/FlareNetwork",
    icon: Telegram,
    label: "Telegram",
  },
];

export default function SocialLinks() {
  return (
    <div className={classes.socialLinksList}>
      {socialLinks.map((social) => (
        <Link
          to={social.href}
          className={classes.link}
          target="_blank"
          key={social.href}
          aria-label={social.label}
        >
          <social.icon
            role="img"
            aria-label={social.label}
            className={classes.socialSvg}
          />
        </Link>
      ))}
    </div>
  );
}
