import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Flare Developer Hub',
  tagline: 'The decentralized origin for Flare builders. Written by builders, for builders.',
  favicon: 'img/favicon.ico', // TODO: This should be an ICO file

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/dineshpinto/developer-hub/tree/main/packages/create-docusaurus/templates/shared/',
          feedOptions: {
            type: 'all',
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
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
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
          sidebarId: 'networkSidebar',
          position: 'left',
          label: 'Network',
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
        {to: '/blog', label: 'Guides', position: 'left'},
        {
          href: 'https://github.com/dineshpinto/developer-hub',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {
              label: 'Flare Network',
              to: '/docs/network/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
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
              label: 'Guides',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
        {
          title: 'Legal',
          // Please don't remove the privacy and terms, it's a legal
          // requirement.
          items: [
            {
              label: 'Terms & Privacy',
              href: 'https://flare.network/privacy-policy/',
            },
          ],
        },
      ],
      copyright: `Copyright © Flare Networks ${new Date().getFullYear()}. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
