import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Flare Developer Hub',
  tagline: 'The decentralized origin for Flare builders. Written by builders, for builders.',
  favicon: '/img/favicon.ico', // TODO: This should be an ICO file

  // Set the production url of your site here
  url: 'https://dineshpinto.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/developer-hub/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'dineshpinto', // Usually your GitHub org/user name.
  projectName: 'developer-hub', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: 'all',
            copyright: `Copyright © Flare Networks ${new Date().getFullYear()}.`,
          },
          blogDescription: 'Guides',
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All guides',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/flare_tbfd_pink.jpg',
    defaultMode: 'light',
    respectPrefersColorScheme: true,
    navbar: {
      title: 'Developer Hub',
      hideOnScroll: true,
      logo: {
        alt: 'Flare Icon',
        src: 'img/flare_icon.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'flareSidebar',
          position: 'left',
          label: 'Flare',
        },
        {
          type: 'docSidebar',
          sidebarId: 'ftsoSidebar',
          position: 'left',
          label: 'FTSO',
        },
        {
          type: 'docSidebar',
          sidebarId: 'fdcSidebar',
          position: 'left',
          label: 'FDC',
        },
        {
          type: 'docSidebar',
          sidebarId: 'fassetsSidebar',
          position: 'left',
          label: 'FAssets',
        },
        {to: '/blog', label: 'Guides', position: 'left'},
        {
          href: 'https://github.com/dineshpinto/developer-hub',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      logo: {
        alt: 'Flare Logo',
        src: 'img/flare_tbfd_light.svg',
        srcDark: 'img/flare_tbfd_dark.svg',
        width: 300
      },
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'X',
              href: 'https://x.com/FlareNetworks',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/FlareNetwork',
            },
            {
              label: 'Discord',
              href: 'https://discord.com/invite/flarenetwork',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/company/flarenetwork/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/channel/UCDyqyTWHYMWY5ie6xOCgG0w',
            },
            {
              label: 'Medium',
              href: 'https://medium.com/flarenetwork',
            },
            {
              label: 'Terms & Privacy',
              href: 'https://flare.network/privacy-policy/',
            },
          ],
        },
      ],
      copyright: `Copyright © Flare Networks ${new Date().getFullYear()}.`,
    },
    prism: {
      additionalLanguages: ['solidity', 'bash', 'json', 'toml'],
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
