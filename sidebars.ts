import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  networkSidebar: [
    "intro",
    {
      type: "category",
      label: "Network",
      collapsed: true,
      link: { type: "doc", id: "network/overview" },
      items: [
        "network/getting-started",
        "network/developer-tools",
        "network/governance",
        "network/consensus",
        {
          type: "category",
          label: "Network Guides",
          collapsed: true,
          link: {
            slug: "/network/guides",
            type: "generated-index",
            description:
              "Learn how to interact with Flare onchain and offchain.",
          },
          items: [{ type: "autogenerated", dirName: "network/guides" }],
        },
        {
          type: "category",
          label: "Network Reference",
          collapsed: true,
          link: { type: "doc", id: "network/solidity-reference" },
          items: [
            { type: "autogenerated", dirName: "network/solidity-reference" },
          ],
        },

        {
          type: "category",
          label: "Flare Systems Protocol",
          collapsed: true,
          link: { type: "doc", id: "network/fsp" },
          items: [
            "network/fsp/weights-and-signing",
            "network/fsp/rewarding",
            "network/fsp/system-protocols",
            "network/fsp/offchain-services",
            {
              type: "category",
              label: "FSP Reference",
              collapsed: true,
              link: { type: "doc", id: "network/fsp/solidity-reference" },
              items: [
                {
                  type: "autogenerated",
                  dirName: "network/fsp/solidity-reference",
                },
              ],
            },
          ],
        },
        "network/flare-tx-sdk",
      ],
    },
    {
      type: "category",
      label: "FTSOv2",
      collapsed: true,
      link: { type: "doc", id: "ftso/overview" },
      items: [
        "ftso/getting-started",
        "ftso/feeds",
        {
          type: "category",
          label: "FTSOv2 Guides",
          collapsed: true,
          link: {
            slug: "/ftso/guides",
            type: "generated-index",
            description:
              "Learn how to interact with FTSOv2 onchain and offchain.",
          },
          items: [{ type: "autogenerated", dirName: "ftso/guides" }],
        },
        {
          type: "category",
          label: "FTSOv2 Reference",
          collapsed: true,
          link: { type: "doc", id: "ftso/solidity-reference" },
          items: [
            { type: "autogenerated", dirName: "ftso/solidity-reference" },
          ],
        },
        {
          type: "category",
          label: "Scaling",
          collapsed: true,
          link: { type: "doc", id: "ftso/scaling/overview" },
          items: [
            "ftso/scaling/getting-started",
            "ftso/scaling/anchor-feeds",
            {
              type: "category",
              label: "Scaling Reference",
              collapsed: true,
              link: {
                type: "doc",
                id: "ftso/scaling/solidity-reference",
              },
              items: [
                {
                  type: "autogenerated",
                  dirName: "ftso/scaling/solidity-reference",
                },
              ],
            },
          ],
        },
        "ftso/migration",
      ],
    },
    {
      type: "category",
      label: "FDC",
      collapsed: true,
      link: { type: "doc", id: "fdc/overview" },
      items: [
        "fdc/getting-started",
        {
          type: "category",
          label: "Attestation Types",
          collapsed: true,
          link: { type: "doc", id: "fdc/attestation-types" },
          items: [{ type: "autogenerated", dirName: "fdc/attestation-types" }],
        },
        {
          type: "category",
          label: "FDC Guides",
          collapsed: false,
          link: {
            slug: "/fdc/guides",
            type: "generated-index",
          },
          items: [
            {
              type: "category",
              label: "Hardhat",
              collapsed: true,
              link: {
                slug: "/fdc/guides/hardhat",
                type: "generated-index",
              },
              items: [
                {
                  type: "autogenerated",
                  dirName: "fdc/guides/hardhat",
                },
              ],
            },
            {
              type: "category",
              label: "Foundry",
              collapsed: true,
              link: {
                slug: "/fdc/guides/foundry",
                type: "generated-index",
              },
              items: [
                {
                  type: "autogenerated",
                  dirName: "fdc/guides/foundry",
                },
              ],
            },
            "fdc/guides/fdc-by-hand",
          ],
        },
        {
          type: "category",
          label: "FDC Reference",
          collapsed: true,
          link: { type: "doc", id: "fdc/reference" },
          items: [{ type: "autogenerated", dirName: "fdc/reference" }],
        },
      ],
    },
    {
      type: "category",
      label: "FAssets",
      collapsed: true,
      link: { type: "doc", id: "fassets/overview" },
      items: [
        "fassets/collateral",
        "fassets/minting",
        "fassets/redemption",
        "fassets/liquidation",
        "fassets/core-vault",
        "fassets/operational-parameters",
        "fassets/songbird",
        {
          type: "category",
          label: "Developer Guides",
          collapsed: true,
          link: {
            slug: "/fassets/developer-guides",
            type: "generated-index",
          },
          items: [
            { type: "autogenerated", dirName: "fassets/developer-guides" },
          ],
        },
        {
          type: "category",
          label: "Infrastructure Guides",
          collapsed: true,
          link: {
            slug: "/fassets/guides",
            type: "generated-index",
          },
          items: [{ type: "autogenerated", dirName: "fassets/guides" }],
        },
        {
          type: "category",
          label: "FAssets Reference",
          collapsed: true,
          link: {
            type: "doc",
            id: "fassets/reference",
          },
          items: [{ type: "autogenerated", dirName: "fassets/reference" }],
        },
      ],
    },
    {
      type: "category",
      label: "Run a Node",
      link: {
        type: "doc",
        id: "run-node",
      },
      collapsed: true,
      items: [{ type: "autogenerated", dirName: "run-node" }],
    },
  ],
};

export default sidebars;
