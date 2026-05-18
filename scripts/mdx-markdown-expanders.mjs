#!/usr/bin/env node
/**
 * Expand MDX/React constructs into plain markdown for agent-facing .md routes.
 * Uses the same JSON/TS data sources as interactive doc components so markdown
 * parity with rendered HTML stays high.
 */

import fs from "fs";
import path from "path";

const ICON_GREEN = "\u{1F7E2}";
const ICON_YELLOW = "\u{1F7E1}";
const ICON_RED = "\u{1F534}";
const ICON_BLACK = "\u{26AB}";

const RISK_ICON = {
  0: ICON_GREEN,
  1: ICON_GREEN,
  2: ICON_YELLOW,
  3: ICON_RED,
  4: ICON_BLACK,
};

const PIPE = "|";

function escapeCell(value) {
  return String(value ?? "")
    .replace(/\n/g, " ")
    .trim()
    .split(PIPE)
    .join("\\|");
}

function markdownTable(headers, rows) {
  if (rows.length === 0) return "";
  const head = `| ${headers.map(escapeCell).join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows
    .map((row) => `| ${row.map(escapeCell).join(" | ")} |`)
    .join("\n");
  return `${head}\n${sep}\n${body}\n`;
}

function loadJson(rootDir, relPath) {
  const abs = path.join(rootDir, relPath);
  return JSON.parse(fs.readFileSync(abs, "utf8"));
}

function loadExportedArray(rootDir, relPath, exportName) {
  const src = fs.readFileSync(path.join(rootDir, relPath), "utf8");
  const marker = `export const ${exportName} = `;
  const start = src.indexOf(marker);
  if (start < 0) {
    throw new Error(`Could not find ${exportName} in ${relPath}`);
  }
  const slice = src.slice(start + marker.length);
  const end = slice.indexOf("\n];");
  if (end < 0) throw new Error(`Could not parse ${exportName} in ${relPath}`);
  // eslint-disable-next-line no-new-func
  return new Function(`return ${slice.slice(0, end + 2)}`)();
}

function parseJsxProps(tagSource) {
  const props = {};
  const attrRe = /([A-Za-z_][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/g;
  let m;
  while ((m = attrRe.exec(tagSource)) !== null) {
    const key = m[1];
    let value = m[2] ?? m[3] ?? m[4] ?? "";
    if (m[4]) {
      value = value.trim();
      if (value.startsWith("[") && value.endsWith("]")) {
        try {
          value = JSON.parse(value.replace(/'/g, '"'));
        } catch {
          value = value
            .slice(1, -1)
            .split(",")
            .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
            .filter(Boolean);
        }
      } else if (value === "true") value = true;
      else if (value === "false") value = false;
      else if (/^\d+$/.test(value)) value = Number(value);
    }
    props[key] = value;
  }
  return props;
}

function resolveSitePaths(text) {
  return text.replace(/@site\/static\//g, "/").replace(/@site\//g, "/");
}

function collectRawLoaderImports(body) {
  const imports = new Map();
  const re = /import\s+(\w+)\s+from\s+["']!!raw-loader!([^"']+)["'];?/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    imports.set(m[1], m[2]);
  }
  return imports;
}

function collectRelativeMdxImports(body, sourcePath, docsDir) {
  const imports = new Map();
  const dir = path.dirname(sourcePath);
  const re = /import\s+(\w+)\s+from\s+["']\.\/([^"']+\.mdx?)["'];?/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    imports.set(m[1], path.join(docsDir, dir, m[2]));
  }
  return imports;
}

function expandRawLoaderCodeBlocks(body, rootDir) {
  const imports = collectRawLoaderImports(body);
  let result = body;

  for (const [name, relImportPath] of imports) {
    const filePath = path.join(rootDir, relImportPath.replace(/^!?\/?/, ""));
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, "utf8").trimEnd();
    const ext = path.extname(filePath).slice(1);
    const lang =
      ext === "sol"
        ? "solidity"
        : ext === "py"
          ? "python"
          : ext === "rs"
            ? "rust"
            : ext === "go"
              ? "go"
              : ext;

    const blockRe = new RegExp(
      `<CodeBlock([^>]*)>\\s*\\{${name}\\}\\s*</CodeBlock>`,
      "gs",
    );
    result = result.replace(blockRe, (_, attrs) => {
      const titleMatch = attrs.match(/title=["']([^"']+)["']/);
      const title = titleMatch?.[1];
      const fence = title ? `\`\`\`${lang} title="${title}"` : `\`\`\`${lang}`;
      return `${fence}\n${content}\n\`\`\``;
    });
  }

  return result;
}

function expandTabs(body) {
  return body.replace(/<Tabs[^>]*>([\s\S]*?)<\/Tabs>/g, (_, inner) => {
    const items = [];
    const tabRe =
      /<TabItem[^>]*value=["']([^"']+)["'][^>]*(?:label=["']([^"']*)["'])?[^>]*>([\s\S]*?)<\/TabItem>/g;
    let m;
    while ((m = tabRe.exec(inner)) !== null) {
      const label = m[2] || m[1];
      items.push(`### ${label}\n\n${m[3].trim()}\n`);
    }
    return items.length > 0 ? `${items.join("\n")}\n` : inner;
  });
}

function expandFtsoFeeds(body, rootDir) {
  const data = loadJson(
    rootDir,
    "src/features/DataTables/FtsoFeeds/ftso_feeds.generated.json",
  );
  return body.replace(/<FtsoFeeds([^>]*)\/>/g, (_, attrs) => {
    const { showIndex } = parseJsxProps(`<x ${attrs}/>`);
    const headers = [
      "Name",
      ...(showIndex ? ["Index"] : []),
      "Feed ID",
      "Details",
      "Risk",
    ];
    const rows = data.map((row) => {
      const explorer = `https://flare-systems-explorer.flare.network/price-feeds/ftso?feed=${encodeURIComponent(row.feed_id)}`;
      return [
        `[${row.feed_name}](${explorer})`,
        ...(showIndex ? [row.feed_index ?? ""] : []),
        `\`${row.feed_id}\``,
        `Base Asset: ${row.base_asset}; Category: ${row.category}`,
        RISK_ICON[row.risk] ?? "",
      ];
    });
    return `\n${markdownTable(headers, rows)}\n`;
  });
}

function expandCustomFeeds(body, rootDir) {
  const data = loadJson(
    rootDir,
    "src/features/DataTables/CustomFeeds/custom_feeds.json",
  );
  return body.replace(/<CustomFeeds\s*\/>/g, () => {
    const rows = data.map((row) => {
      const explorer = `https://flare-systems-explorer.flare.network/price-feeds/custom?feed=${encodeURIComponent(row.feed_id)}`;
      const contract = row.contract
        ? `; Contract: [\`${row.contract}\`](https://flare-explorer.flare.network/address/${row.contract})`
        : "";
      return [
        `[${row.feed_name}](${explorer})`,
        `\`${row.feed_id}\``,
        `Base Asset: ${row.base_asset} ([${row.provider_name}](${row.provider_url}))${contract}`,
      ];
    });
    return `\n${markdownTable(["Name", "Feed ID", "Details"], rows)}\n`;
  });
}

function expandFeedStability(body, rootDir) {
  const stability = loadJson(rootDir, "automations/feed_stability.json");
  const risk = loadJson(rootDir, "automations/ftso_risk.json");
  const riskMap = new Map(risk.map((r) => [r.name, r.risk]));
  return body.replace(/<FeedStability([^>]*)\/>/g, (_, attrs) => {
    const { showRisk = true } = parseJsxProps(`<x ${attrs}/>`);
    const sorted = [...stability].sort((a, b) => b.stability - a.stability);
    const headers = ["Feed", "Stability (0.2%)", "Status"];
    if (showRisk) headers.push("Risk");
    const rows = sorted.map((row) => {
      const r = riskMap.get(row.name) ?? 2;
      const base = [
        row.name,
        `${row.stability.toFixed(2)}%`,
        row.stability >= 99
          ? ICON_GREEN
          : row.stability >= 97
            ? ICON_GREEN
            : row.stability >= 94
              ? ICON_YELLOW
              : row.stability >= 80
                ? ICON_RED
                : ICON_BLACK,
      ];
      if (showRisk) base.push(RISK_ICON[r] ?? "");
      return base;
    });
    return `\n${markdownTable(headers, rows)}\n`;
  });
}

function expandOperationalParameters(body, rootDir) {
  const operationalParameters = loadExportedArray(
    rootDir,
    "src/features/FAssets/OperationalParameters/operational-parameters.ts",
    "operationalParameters",
  );
  const networkTabs = [
    { label: "Flare Mainnet", value: "flare", hideBtc: true, hideDoge: true },
    {
      label: "Flare Testnet Coston2",
      value: "coston2",
      hideBtc: true,
      hideDoge: true,
    },
    {
      label: "Songbird Canary-Network",
      value: "songbird",
      hideBtc: true,
      hideDoge: true,
    },
    {
      label: "Songbird Testnet Coston",
      value: "coston",
      hideBtc: false,
      hideDoge: false,
    },
  ];

  return body.replace(/<OperationalParameters([^>]*)\/>/gs, (_, attrs) => {
    const props = parseJsxProps(`<OperationalParameters ${attrs}/>`);
    const section = operationalParameters.find(
      (s) => s.title === props.sectionTitle,
    );
    if (!section) return "";
    let parameters = section.parameters;
    if (
      Array.isArray(props.filterParameters) &&
      props.filterParameters.length
    ) {
      parameters = parameters.filter(
        (p) => p.settingName && props.filterParameters.includes(p.settingName),
      );
    }
    const visibleTabs = Array.isArray(props.networks)
      ? networkTabs.filter((t) => props.networks.includes(t.value))
      : networkTabs;

    const parts = [];
    for (const tab of visibleTabs) {
      const cols = ["Parameter", "XRP"];
      if (!tab.hideBtc) cols.push("BTC");
      if (!tab.hideDoge) cols.push("DOGE");
      const rows = parameters.map((param) => {
        const nameCell = param.link
          ? `**[${param.name}](${param.link})** - ${param.description}`
          : `**${param.name}** - ${param.description}`;
        const row = [nameCell];
        const assets = ["xrp"];
        if (!tab.hideBtc) assets.push("btc");
        if (!tab.hideDoge) assets.push("doge");
        for (const asset of assets) {
          const val = param.values?.[tab.value]?.[asset] ?? "-";
          row.push(String(val));
        }
        return row;
      });
      parts.push(`### ${tab.label}\n\n${markdownTable(cols, rows)}`);
    }
    return `\n${parts.join("\n\n")}\n`;
  });
}

function expandSolidityReference(body, rootDir) {
  const tableData = loadJson(
    rootDir,
    "src/features/DataTables/SolidityReference/solidity_reference.generated.json",
  );
  const networkLinks = {
    FlareMainnet: {
      label: "Flare Mainnet",
      prefix: "https://flare-explorer.flare.network/address/",
    },
    FlareTestnetCoston2: {
      label: "Flare Testnet Coston2",
      prefix: "https://coston2-explorer.flare.network/address/",
    },
    SongbirdCanaryNetwork: {
      label: "Songbird Canary-Network",
      prefix: "https://songbird-explorer.flare.network/address/",
    },
    SongbirdTestnetCoston: {
      label: "Songbird Testnet Coston",
      prefix: "https://coston-explorer.flare.network/address/",
    },
  };

  return body.replace(/<SolidityReference([^>]*)\/>/gs, (_, attrs) => {
    const props = parseJsxProps(`<SolidityReference ${attrs}/>`);
    const network = props.network;
    const links = networkLinks[network];
    if (!links) return "";
    const names = Array.isArray(props.contractNames) ? props.contractNames : [];
    const rows =
      tableData[network]
        ?.filter((row) => names.length === 0 || names.includes(row.name))
        .map((row) => [
          row.name,
          row.address
            ? `[\`${row.address}\`](${links.prefix}${row.address}?tab=contract_abi)`
            : "-",
        ]) ?? [];
    return `\n### ${links.label}\n\n${markdownTable(["Contract", "Address"], rows)}\n`;
  });
}

function expandReferenceComponent(
  body,
  rootDir,
  tagName,
  dataPath,
  exportName,
) {
  const reference = loadExportedArray(rootDir, dataPath, exportName);
  const networks = [
    { key: "flare", label: "Flare Mainnet", explorer: "flare" },
    { key: "coston2", label: "Flare Testnet Coston2", explorer: "coston2" },
    { key: "songbird", label: "Songbird Canary-Network", explorer: "songbird" },
    { key: "coston", label: "Songbird Testnet Coston", explorer: "coston" },
  ];
  const re = new RegExp(`<${tagName}\\s*\\/?>`, "g");
  return body.replace(re, () => {
    const parts = networks.map(({ key, label, explorer }) => {
      const rows = reference.map((item) => [
        item.name[key] ?? "-",
        item.address[key]
          ? `[\`${item.address[key]}\`](https://${explorer}-explorer.flare.network/address/${item.address[key]})`
          : "-",
        item.description +
          (item.guide ? ` [${item.guide.title}](${item.guide.link})` : ""),
      ]);
      return `### ${label}\n\n${markdownTable(["Contract", "Address", "Description"], rows)}`;
    });
    return `\n${parts.join("\n\n")}\n`;
  });
}

function inlineRelativeMdxImports(body, sourcePath, docsDir, rootDir) {
  const relImports = collectRelativeMdxImports(body, sourcePath, docsDir);
  let result = body;
  for (const [name, absPath] of relImports) {
    if (!fs.existsSync(absPath)) continue;
    const partial = fs.readFileSync(absPath, "utf8");
    const { body: partialBody } = parseFrontmatter(partial);
    const expanded = expandMdxBody(partialBody, {
      rootDir,
      docsDir,
      sourcePath: path.relative(docsDir, absPath),
    });
    result = result.replace(
      new RegExp(`<${name}\\s*\\/?>`, "g"),
      `\n${expanded}\n`,
    );
  }
  return result;
}

function expandEmbeds(body) {
  let result = body;
  result = result.replace(
    /<RemixEmbed[^>]*fileName=["']([^"']+)["'][^>]*>([^<]*)<\/RemixEmbed>/g,
    (_, file, label) =>
      `[${label.trim() || "Open in Remix"}](https://remix.ethereum.org/?#code=${encodeURIComponent(file)})`,
  );
  result = result.replace(
    /<YouTubeEmbed[^>]*videoId=["']([^"']+)["'][^>]*\/>/g,
    (_, id) => `[Watch on YouTube](https://www.youtube.com/watch?v=${id})`,
  );
  result = result.replace(
    /<NewGithubIssue[^>]*issueType=["']([^"']+)["'][^>]*>([^<]*)<\/NewGithubIssue>/g,
    (_, type, label) =>
      `[${label.trim()}](https://github.com/flare-foundation/developer-hub/issues/new?template=${type}.yml)`,
  );
  result = result.replace(/<br\s*\/?>\s*/gi, "\n");
  return result;
}

function stripRemainingJsx(body) {
  let cleaned = body
    .split(/\r?\n/)
    .filter((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("import ") && /from\s+['"]/.test(trimmed))
        return false;
      if (
        trimmed.startsWith("export ") &&
        !trimmed.startsWith("export const meta")
      )
        return false;
      return true;
    })
    .join("\n");

  cleaned = cleaned.replace(/^[ \t]*<[A-Z][A-Za-z0-9]*[^>]*\/>[ \t]*$/gm, "");
  cleaned = cleaned.replace(
    /<[A-Z][A-Za-z0-9]*[^>]*>[\s\S]*?<\/[A-Z][A-Za-z0-9]*>/g,
    "",
  );
  cleaned = cleaned.replace(/\{?\/\*[\s\S]*?\*\/\}?\n?/g, "");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  return cleaned.trimStart();
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { body: raw };
  return { body: raw.slice(m[0].length) };
}

/**
 * @param {string} body MDX body (no frontmatter)
 * @param {{ rootDir: string, docsDir: string, sourcePath: string }} ctx
 */
export function expandMdxBody(body, ctx) {
  let result = body;
  result = resolveSitePaths(result);
  result = inlineRelativeMdxImports(
    result,
    ctx.sourcePath,
    ctx.docsDir,
    ctx.rootDir,
  );
  result = expandRawLoaderCodeBlocks(result, ctx.rootDir);
  result = expandTabs(result);
  result = expandFtsoFeeds(result, ctx.rootDir);
  result = expandCustomFeeds(result, ctx.rootDir);
  result = expandFeedStability(result, ctx.rootDir);
  result = expandOperationalParameters(result, ctx.rootDir);
  result = expandSolidityReference(result, ctx.rootDir);
  result = expandReferenceComponent(
    result,
    ctx.rootDir,
    "Reference",
    "src/features/FAssets/Reference/reference-data.ts",
    "reference",
  );
  result = expandReferenceComponent(
    result,
    ctx.rootDir,
    "SmartAccountsReference",
    "src/features/SmartAccounts/Reference/reference-data.ts",
    "reference",
  );
  result = expandEmbeds(result);
  result = stripRemainingJsx(result);
  return result;
}
