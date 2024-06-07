import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Flare Developer Hub",
  tagline:
    "The decentralized origin for Flare builders. Written by builders, for builders.",
  favicon: "/img/favicon.ico",

  // Set the production url of your site here
  url: "https://dev.flare.network",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "flare-foundation", // Usually your GitHub org/user name.
  projectName: "developer-hub", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
        },
        blog: {
          path: "guides",
          routeBasePath: "guides",
          showReadingTime: true,
          feedOptions: {
            type: "all",
            copyright: `Copyright © Flare Networks ${new Date().getFullYear()}.`,
          },
          blogDescription: "Guides",
          blogSidebarCount: "ALL",
          blogSidebarTitle: "All guides",
          onInlineTags: "throw",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: "Developer Hub",
      hideOnScroll: false,
      logo: {
        alt: "Flare Icon",
        src: "img/flare_icon.svg",
        width: 32,
        height: 32,
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "networkSidebar",
          position: "left",
          label: "Flare ☀️",
        },
        { to: "/guides", label: "Guides", position: "left" },
        {
          href: "https://github.com/flare-foundation/developer-hub",
          className: "header-github-link",
          "aria-label": "GitHub repository",
          position: "right",
        },
      ],
    },
    footer: {
      style: "light",
      logo: {
        alt: "Flare Logo",
        src: "img/flare_tbfd_light.svg",
        srcDark: "img/flare_tbfd_dark.svg",
        href: "https://flare.network/",
        width: 300,
        height: 25,
      },
      links: [
        {
          title: "Support",
          items: [
            {
              label: "FAQs",
              to: "docs/support/faqs",
            },
            {
              label: "Terminology",
              to: "docs/support/terminology",
            },
            {
              label: "Audits",
              to: "docs/support/audits",
            },
            {
              label: "Bug Bounty",
              href: "https://flare.network/start-building/#bugbounty",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "X",
              href: "https://x.com/FlareNetworks",
            },
            {
              label: "Telegram",
              href: "https://t.me/FlareNetwork",
            },
            {
              label: "Discord",
              href: "https://discord.com/invite/flarenetwork",
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/company/flarenetwork/",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/flare-foundation/",
            },
            {
              label: "YouTube",
              href: "https://www.youtube.com/channel/UCDyqyTWHYMWY5ie6xOCgG0w",
            },
            {
              label: "Medium",
              href: "https://medium.com/flarenetwork",
            },
            {
              label: "Terms & Privacy",
              href: "https://flare.network/privacy-policy/",
            },
          ],
        },
        {
          title: "Explorers",
          items: [
            {
              label: "Flarescan",
              href: "https://flarescan.com/",
            },
            {
              label: "Flare Systems Explorer",
              href: "https://coston-systems-explorer.flare.rocks/",
            },
            {
              label: "Flare FTSO Monitor",
              href: "https://flare-ftso-monitor.flare.network/data-providers",
            },
            {
              label: "Flare P-Chain Explorer",
              href: "https://flare.space/dapp/p-chain-explorer/validators",
            },
          ],
        },
      ],
      copyright: `Copyright © Flare Networks ${new Date().getFullYear()}.`,
    },
    prism: {
      additionalLanguages: ["solidity", "bash", "json", "toml"],
      theme: prismThemes.oneDark,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,
  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        // `hashed` is recommended as long-term-cache of index file is possible
        language: ["en"],
        indexDocs: true,
        indexBlog: true,
        docsRouteBasePath: "/docs",
        blogRouteBasePath: "/guides",
      },
    ],
  ],
};

export default config;
