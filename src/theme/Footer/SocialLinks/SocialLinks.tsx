import GitHub from "@site/static/img/social-icons/github.svg";

import Link from "@docusaurus/Link";

type SocialLinkProps = {
  href: string;
  icon: React.ComponentType<React.ComponentProps<"svg">>;
};

const socialLinks: Array<SocialLinkProps> = [
  {
    href: "/github",
    icon: GitHub,
  },
];

export default function SocialLinks() {
  return (
    <div>
      {socialLinks.map((social) => (
        <Link to={social.href} target="_blank">
          <social.icon />
        </Link>
      ))}
    </div>
  );
}
