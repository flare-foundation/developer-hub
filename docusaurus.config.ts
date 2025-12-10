import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const config: Config = {
  title: "Flare Developer Hub",
  tagline: "Official documentation for Flare.",
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

  markdown: {
    hooks: {
      onBrokenMarkdownImages: "throw",
      onBrokenMarkdownLinks: "throw",
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // Experimental features in preparation for Docusaurus v4 upgrade
  // rspack is disabled currently due to bundling performance issues
  future: {
    v4: true,
    experimental_faster: {
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      rspackBundler: false,
      rspackPersistentCache: false,
      ssgWorkerThreads: true,
      mdxCrossCompilerCache: true,
    },
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
          ignorePatterns: ["/tags/**", "/**/*.pdf"],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/landing/dev_hub_ani_noblur.png",
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: true,
    },
    headTags: [
      {
        tagName: "meta",
        attributes: {
          name: "google-site-verification",
          content: "S7ko-mhGTnZdYIIAcKUa-IsjtF8x-0wvleX2uDUg0NU",
        },
      },
      {
        tagName: "link",
        attributes: {
          rel: "preload",
          href: "/fonts/Satoshi/Satoshi-Variable.woff2",
          as: "font",
          type: "font/woff2",
          crossorigin: "anonymous",
        },
      },
    ],
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
          title: "Flare",
          items: [
            {
              label: "Support",
              href: "https://flare.network/resources/technical-support",
            },
            {
              label: "Brand Kit",
              href: "https://drive.google.com/drive/u/1/folders/1mPrtIBb2k88E4f1fguEm3eAXLW74xOry",
            },
            {
              label: "Terms & Conditions",
              href: "https://flare.network/privacy-policy/",
            },
            {
              label: "UK Disclaimer",
              href: "https://flare.network/uk-disclaimer",
            },
          ],
        },
        {
          title: "Resources",
          items: [
            {
              label: "Whitepapers",
              to: "/support/whitepapers",
            },

            {
              label: "Audits",
              to: "/support/audits",
            },
            {
              label: "FAQs",
              to: "/support/faqs",
            },
            {
              label: "FLR",
              to: "/support/flr",
            },
          ],
        },
        {
          title: "Explore",
          items: [
            {
              label: "Flare Explorer",
              href: "https://flare-explorer.flare.network",
            },
            {
              label: "Systems Explorer",
              href: "https://flare-systems-explorer.flare.network",
            },
            {
              label: "Bug Bounty",
              href: "https://immunefi.com/bug-bounty/flarenetwork/information/",
            },
            {
              label: "Grants",
              href: "https://flare.network/grants",
            },
          ],
        },
        {
          title: "Governance",
          items: [
            {
              label: "Flare Portal",
              href: "https://portal.flare.network/",
            },
            {
              label: "Governance Proposals",
              href: "https://proposals.flare.network",
            },
          ],
        },
      ],
      copyright: `© Flare ${new Date().getFullYear()}`,
    },
    prism: {
      additionalLanguages: ["solidity", "bash", "json", "toml", "diff"],
      theme: prismThemes.oneDark,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,
  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
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
      href: "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP",
      crossorigin: "anonymous",
    },
  ],
  plugins: [
    require.resolve("./webpack.config.js"),
    [
      "docusaurus-plugin-llms",
      {
        // scope
        docsDir: "docs",
        // outputs
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        llmsTxtFilename: "llms.txt",
        llmsFullTxtFilename: "llms-full.txt",
        // curation
        includeOrder: [
          "**/network/**/*.mdx",
          "**/network/**/*.md",
          "**/ftso/**/*.mdx",
          "**/ftso/**/*.md",
          "**/fdc/**/*.mdx",
          "**/fdc/**/*.md",
          "**/fassets/**/*.mdx",
          "**/fassets/**/*.md",
          "**/run-node/**/*.mdx",
          "**/run-node/**/*.md",
          "**/support/**/*.mdx",
          "**/support/**/*.md",
        ],
        ignoreFiles: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.docusaurus/**",
          "**/build/**",
          "**/*.txt",
        ],
        includeUnmatchedLast: false,
        // cleaning
        excludeImports: true,
        removeDuplicateHeadings: true,
        // consolidate bundles for better retrieval
        // no file larger than 250k tokens
        customLLMFiles: [
          {
            filename: "llms-network.txt",
            includePatterns: ["**/network/**/*.mdx", "**/network/**/*.md"],
            fullContent: true,
            title: "Network Documentation",
            description:
              "Flare Network concepts, integration guides, SDKs, and API/Solidity references",
          },
          {
            filename: "llms-ftso.txt",
            includePatterns: ["**/ftso/**/*.mdx", "**/ftso/**/*.md"],
            fullContent: true,
            title: "FTSO Documentation",
            description:
              "Flare Time Series Oracle (FTSO) concepts, integration guides, and API/Solidity references",
          },
          {
            filename: "llms-fdc.txt",
            includePatterns: ["**/fdc/**/*.mdx", "**/fdc/**/*.md"],
            fullContent: true,
            title: "FDC Documentation",
            description:
              "Flare Data Connector (FDC) concepts, integration guides, and API/Solidity references",
          },
          {
            filename: "llms-fassets.txt",
            includePatterns: ["**/fassets/**/*.mdx", "**/fassets/**/*.md"],
            fullContent: true,
            title: "FAssets Documentation",
            description:
              "FAssets concepts, integration guides, and API/Solidity references",
          },
          {
            filename: "llms-node-operators.txt",
            includePatterns: ["**/run-node/**/*.mdx", "**/run-node/**/*.md"],
            fullContent: true,
            title: "Flare Node Documentation",
            description: "Runbooks and guides for Flare node operators",
          },
          {
            filename: "llms-reference.txt",
            includePatterns: [
              "**/solidity-reference/**/*.mdx",
              "**/solidity-reference/**/*.md",
              "**/reference/**/*.mdx",
              "**/reference/**/*.md",
            ],
            fullContent: true,
            title: "API and Solidity Reference (All Modules)",
            description:
              "Consolidated interfaces and API references across Network, FTSO, FDC and FAssets.",
          },
        ],
      },
    ],
  ],
  scripts: [
    // Optimized cookie script loading - defer until after page load
    {
      src: "/js/cookie-loader.js",
      defer: true,
    },
  ],
};

export default config;
