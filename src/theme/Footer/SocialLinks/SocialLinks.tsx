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
};

const socialLinks: Array<SocialLinkProps> = [
  {
    href: "https://github.com/flare-foundation",
    icon: GitHub,
  },
  {
    href: "https://www.youtube.com/c/Flare_Networks",
    icon: YouTube,
  },
  {
    href: "https://www.linkedin.com/company/flarenetwork/",
    icon: LinkedIn,
  },
  {
    href: "https://medium.com/flarenetwork",
    icon: Medium,
  },
  {
    href: "https://discord.com/invite/flarenetwork",
    icon: Discord,
  },
  {
    href: "https://twitter.com/FlareNetworks",
    icon: X,
  },

  {
    href: "https://t.me/FlareNetwork",
    icon: Telegram,
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
        >
          <social.icon role="img" className={classes.socialSvg} />
        </Link>
      ))}
    </div>
  );
}
