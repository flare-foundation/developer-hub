import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const config: Config = {
  title: "Flare Developer Hub",
  tagline: "The decentralized origin for Flare builders.",
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

  onBrokenAnchors: "throw",
  onDuplicateRoutes: "throw",
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
          routeBasePath: "/",
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          editUrl:
            "https://github.com/flare-foundation/developer-hub/edit/main",
          onInlineTags: "throw",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        gtag: {
          trackingID: "G-E6JBVK9HQX",
          anonymizeIP: true,
        },
        googleTagManager: {
          containerId: "GTM-WX2D2TR",
        },
        sitemap: {
          lastmod: "date",
          ignorePatterns: ["/tags/**"],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // announcementBar: {
    //   content:
    //     'Flare Developer Hub v0.8. Track the latest updates on <a target="_blank" rel="noopener noreferrer" href="https://github.com/flare-foundation/developer-hub">GitHub</a>.',
    //   backgroundColor: "#fafbfc",
    //   textColor: "#091E42",
    //   isCloseable: true,
    // },
    image: "img/landing/dev_hub_ani_noblur.png",
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        autoCollapseCategories: false,
      },
    },
    navbar: {
      title: "Developer Hub",
      hideOnScroll: false,
      logo: {
        alt: "Flare Icon",
        src: "img/flare_icon.svg",
        srcDark: "img/flare_icon_dark.svg",
        width: 32,
        height: 32,
      },
      items: [
        // {
        //   type: "docSidebar",
        //   sidebarId: "networkSidebar",
        //   position: "left",
        //   label: "Flare ☀️",
        // },
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
        src: "img/logo/FooterLogoLight.svg",
        srcDark: "img/logo/FooterLogoDark.svg",
        href: "https://flare.network/",
        width: 405,
        height: 35.25,
        target: "_blank",
      },
      links: [
        {
          title: "Support",
          items: [
            {
              label: "FAQs",
              to: "/support/faqs",
            },
            {
              label: "Audits",
              to: "/support/audits",
            },
            {
              label: "Terms & Privacy",
              href: "https://flare.network/privacy-policy/",
            },
          ],
        },
        {
          title: "Developer links",
          items: [
            {
              label: "Flarescan",
              href: "https://flarescan.com/",
            },
            {
              label: "Flare Systems Explorer",
              href: "https://songbird-systems-explorer.flare.rocks",
            },
            {
              label: "FTSO Feed Explorer",
              href: "https://songbird-systems-explorer.flare.rocks/ftso-feeds",
            },
            {
              label: "Flare P-Chain Explorer",
              href: "https://flare.space/dapp/p-chain-explorer/",
            },
            {
              label: "Grants",
              href: "https://flare.network/grants/",
            },
          ],
        },
      ],
      copyright: `Copyright © Flare Networks ${new Date().getFullYear()}`,
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
        indexPages: true,
        indexBlog: false,
        docsRouteBasePath: "/",
      },
    ],
  ],
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],
  scripts: [
    {
      defer: true,
      src: "https://cdn-cookieyes.com/client_data/dedcd40fe7e8316d7512b294/script.js",
      id: "cookieyes",
    },
  ],
};

export default config;
