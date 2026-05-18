#!/usr/bin/env node
/**
 * Post-build script: emit a clean .md file next to every documentation HTML page.
 *
 * Why: Agent Score / afdocs and most AI agents look for the Markdown source of a
 * documentation page at the same URL with a `.md` suffix (e.g. `/network/overview.md`).
 * GitHub Pages serves static files, so we generate the markdown alongside the HTML.
 *
 * Source of truth for routes is Docusaurus' `.docusaurus/globalData.json`, which lists
 * every published doc id and its rendered path. We then map id -> source `.md/.mdx`
 * file in `docs/`, clean it (strip frontmatter, MDX import/export statements, JSX
 * components that hold no textual value), and write to `build/<path>.md`.
 *
 * Run after: docusaurus build.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { expandMdxBody } from "./mdx-markdown-expanders.mjs";
import { markdownFromBuiltHtml } from "./html-to-markdown.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const docsDir = path.join(rootDir, "docs");
const buildDir = path.join(rootDir, "build");
const globalDataPath = path.join(rootDir, ".docusaurus", "globalData.json");

const SITE_BASE = "https://dev.flare.network";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

/**
 * Collect every .md / .mdx source path under docs/, relative to docsDir.
 */
function collectSourceFiles(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(full, list);
    } else if (/\.(md|mdx)$/i.test(entry.name)) {
      list.push(path.relative(docsDir, full));
    }
  }
  return list;
}

/**
 * Extract simple key/value pairs from a YAML frontmatter block.
 * Only handles the scalars we need: id, slug, title, description, unlisted.
 */
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { frontmatter: {}, body: raw, length: 0 };
  const body = raw.slice(m[0].length);
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value === "true") value = true;
    else if (value === "false") value = false;
    fm[kv[1]] = value;
  }
  return { frontmatter: fm, body, length: m[0].length };
}

/**
 * Derive the Docusaurus doc `id` from a source-relative path the same way the
 * content-docs plugin does: strip the leading `NN-` number prefix from each
 * segment and drop the extension.
 *
 *   `network/0-overview.mdx` -> `network/overview`
 *   `fdc/guides/foundry/01-address-validity.mdx` -> `fdc/guides/foundry/address-validity`
 */
function sourceRelToDocId(rel) {
  const noExt = rel.replace(/\.(mdx?|md)$/i, "");
  return noExt
    .split("/")
    .map((seg) => seg.replace(/^\d+-/, ""))
    .join("/");
}

/**
 * Build maps:
 *   - docIdToSource: doc id -> absolute source path
 *   - docIdToFrontmatter: doc id -> parsed frontmatter
 */
function indexSources() {
  const docIdToSource = new Map();
  const docIdToFrontmatter = new Map();
  for (const rel of collectSourceFiles(docsDir)) {
    const abs = path.join(docsDir, rel);
    const raw = fs.readFileSync(abs, "utf8");
    const { frontmatter } = parseFrontmatter(raw);
    // Explicit frontmatter id wins, otherwise derive from path.
    const id =
      typeof frontmatter.id === "string" && frontmatter.id.length > 0
        ? frontmatter.id.includes("/")
          ? frontmatter.id
          : `${path
              .dirname(rel)
              .split("/")
              .map((s) => s.replace(/^\d+-/, ""))
              .filter(Boolean)
              .join("/")}/${frontmatter.id}`.replace(/^\//, "")
        : sourceRelToDocId(rel);
    docIdToSource.set(id, abs);
    docIdToFrontmatter.set(id, frontmatter);
  }
  return { docIdToSource, docIdToFrontmatter };
}

/**
 * Turn MDX source into agent-facing markdown: expand data-driven React
 * components, inline partials, and strip remaining JSX.
 */
function cleanMdxBody(body, sourceRelPath) {
  return expandMdxBody(body, {
    rootDir,
    docsDir,
    sourcePath: sourceRelPath,
  });
}

/**
 * Build a clean Markdown document for a single doc.
 * Returns null when the source is missing.
 */
function buildMarkdownForDoc(docId, route, sourcePath, frontmatter) {
  if (!sourcePath || !fs.existsSync(sourcePath)) return null;

  const htmlBody = markdownFromBuiltHtml(buildDir, route);
  let cleaned;
  if (htmlBody) {
    cleaned = htmlBody;
  } else {
    const raw = fs.readFileSync(sourcePath, "utf8");
    const { body } = parseFrontmatter(raw);
    const sourceRelPath = path.relative(docsDir, sourcePath);
    cleaned = cleanMdxBody(body, sourceRelPath);
  }

  const title =
    (typeof frontmatter.title === "string" && frontmatter.title.trim()) ||
    docId.split("/").pop();
  const description =
    typeof frontmatter.description === "string"
      ? frontmatter.description.trim()
      : "";

  const headerLines = [`# ${title}`, ""];
  if (description) {
    headerLines.push(`> ${description}`, "");
  }
  headerLines.push(
    "> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.",
    "",
    `Source: ${SITE_BASE}${route}`,
    "",
    "",
  );

  // Avoid duplicating the title if the body already starts with the same H1.
  const bodyStartsWithSameH1 = new RegExp(
    `^#\\s+${title.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\s*$`,
    "m",
  ).test(cleaned.split("\n").slice(0, 3).join("\n"));

  return (
    headerLines.join("\n") +
    (bodyStartsWithSameH1 ? cleaned.replace(/^#\s+.+\n+/, "") : cleaned) +
    "\n"
  );
}

function titleCaseSegment(segment) {
  return segment
    .split("-")
    .map((part) =>
      part.length === 0
        ? part
        : part[0].toUpperCase() + part.slice(1).toLowerCase(),
    )
    .join(" ");
}

/**
 * Resolve the on-disk output paths for a Docusaurus route. We always write the
 * `.md` next to the matching `.html` so the file is reachable both as
 * `/foo/bar.md` and (when applicable) `/foo/bar/index.md`.
 */
function outputPathsForRoute(route) {
  // Normalize: route is something like "/", "/network/overview", "/fxrp/firelight/".
  const trimmed = route.replace(/\/+$/, "");
  const targets = [];

  if (trimmed === "" || trimmed === "/") {
    // Home page: write build/index.md
    targets.push(path.join(buildDir, "index.md"));
    return targets;
  }

  const rel = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  // Primary path: build/<rel>.md  (matches /<rel>.md URL)
  targets.push(path.join(buildDir, `${rel}.md`));

  // If Docusaurus rendered this as a directory (build/<rel>/index.html),
  // also drop an index.md inside so /<rel>/ and /<rel>/index.md work too.
  const indexHtml = path.join(buildDir, rel, "index.html");
  if (fs.existsSync(indexHtml)) {
    targets.push(path.join(buildDir, rel, "index.md"));
  }
  return targets;
}

function writeFileEnsuringDir(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, "utf8");
}

function main() {
  if (!fs.existsSync(buildDir)) {
    console.warn("[generate-md-routes] build/ not found, skipping.");
    return;
  }
  if (!fs.existsSync(globalDataPath)) {
    console.warn(
      "[generate-md-routes] .docusaurus/globalData.json not found, skipping.",
    );
    return;
  }

  const globalData = readJson(globalDataPath);
  const versions =
    globalData?.["docusaurus-plugin-content-docs"]?.default?.versions ?? [];
  const docs = versions.flatMap((v) => v.docs ?? []);
  if (docs.length === 0) {
    console.warn("[generate-md-routes] No docs found in globalData.json.");
    return;
  }

  const { docIdToSource, docIdToFrontmatter } = indexSources();

  // Build a quick title index by route for stub generation below.
  const titleByRoute = new Map();
  for (const doc of docs) {
    const fm = docIdToFrontmatter.get(doc.id) ?? {};
    const title =
      (typeof fm.title === "string" && fm.title.trim()) ||
      doc.id.split("/").pop();
    titleByRoute.set(doc.path, title);
  }

  let written = 0;
  let stubs = 0;
  let skipped = 0;

  for (const doc of docs) {
    const docId = doc.id;
    const route = doc.path;
    const sourcePath = docIdToSource.get(docId);
    const frontmatter = docIdToFrontmatter.get(docId) ?? {};

    let md = sourcePath
      ? buildMarkdownForDoc(docId, route, sourcePath, frontmatter)
      : null;

    if (!md) {
      // Generated-index / category landing pages don't have a source MDX.
      // Emit a stub markdown that lists every child route. This keeps the
      // route reachable as Markdown and gives crawlers a meaningful page.
      md = buildCategoryStub(route, docs, titleByRoute);
      if (md) stubs++;
      else {
        skipped++;
        continue;
      }
    }

    for (const outPath of outputPathsForRoute(route)) {
      writeFileEnsuringDir(outPath, md);
      written++;
    }
  }

  console.log(
    `[generate-md-routes] Wrote ${written} markdown files (${stubs} category stubs), skipped ${skipped}.`,
  );
}

/**
 * Build a stub markdown page that lists every doc that lives below `route`.
 * Used for generated-index / category landing pages that lack a source file.
 */
function buildCategoryStub(route, docs, titleByRoute) {
  if (!route || route === "/") return null;
  const base = route.endsWith("/") ? route.slice(0, -1) : route;
  const prefix = `${base}/`;
  const children = docs
    .filter((d) => d.path !== route && d.path.startsWith(prefix))
    .filter((d) => {
      // direct children only (one extra segment beyond the prefix)
      const rest = d.path.slice(prefix.length).replace(/\/$/, "");
      return rest.length > 0 && !rest.includes("/");
    });

  if (children.length === 0) return null;

  const title =
    titleByRoute.get(route) ?? titleCaseSegment(base.split("/").pop() ?? "");
  const lines = [
    `# ${title}`,
    "",
    `> Index of ${children.length} page${children.length === 1 ? "" : "s"} under \`${base}\`.`,
    "",
    "> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.",
    "",
    `Source: ${SITE_BASE}${route}`,
    "",
  ];
  for (const child of children) {
    const childTitle =
      titleByRoute.get(child.path) ?? child.id.split("/").pop();
    const childUrl = `${SITE_BASE}${child.path}`.replace(/\/$/, "");
    lines.push(`- [${childTitle}](${childUrl}.md)`);
  }
  lines.push("");
  return lines.join("\n");
}

main();
