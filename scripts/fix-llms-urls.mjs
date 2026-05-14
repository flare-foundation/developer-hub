#!/usr/bin/env node
/**
 * Post-build script: rewrite the URLs inside every generated llms*.txt so that
 * AI agents and llmstxt.org consumers land on the canonical site routes — and
 * on the Markdown version of every page.
 *
 * This script does three things:
 *
 * 1. Rewrite path segments
 *    `docusaurus-plugin-llms` builds URLs from source file paths
 *    (e.g. `network/1-getting-started`), but our pages use frontmatter `slug`
 *    (e.g. `network/getting-started`). We rewrite the URLs to match the
 *    actual Docusaurus routes from `.docusaurus/globalData.json`.
 *
 * 2. Replace HTML URLs with `.md` URLs
 *    Agent Score / afdocs require the llms.txt index to link to Markdown.
 *    For every doc route we emit a `.md` file via generate-md-routes.mjs, so
 *    we rewrite `https://dev.flare.network/foo/bar` -> `…/foo/bar.md`.
 *
 * 3. Drop entries for unlisted / non-existent routes
 *    `unlisted: true` MDX pages don't appear in the sitemap. The Agent Score
 *    `Llms Txt Coverage` check flags these as stale, so we filter them out.
 *    Anything not in globalData.json is also dropped.
 *
 * Run after: docusaurus build && node scripts/generate-md-routes.mjs.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const docsDir = path.join(rootDir, "docs");
const buildDir = path.join(rootDir, "build");
const globalDataPath = path.join(rootDir, ".docusaurus", "globalData.json");

const SITE_BASE = "https://dev.flare.network";

/** Avoid incomplete substring checks (e.g. https://dev.flare.network.evil.com). */
function isSiteOriginUrl(url) {
  return url === SITE_BASE || url.startsWith(`${SITE_BASE}/`);
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Extract slug or id from frontmatter (first --- block).
 * Docusaurus uses slug for URL; id also affects path when slug is not set.
 */
function getSlugOrIdFromFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { slug: null, unlisted: false };
  const front = match[1];
  const slugMatch = front.match(/^slug:\s*["']?([^"'\n]*)["']?\s*$/m);
  const idMatch = front.match(/^id:\s*["']?([^"'\s\n]+)["']?\s*$/m);
  const unlistedMatch = front.match(/^unlisted:\s*(true|false)\s*$/m);
  return {
    slug: slugMatch ? slugMatch[1].trim() : idMatch ? idMatch[1].trim() : null,
    unlisted: unlistedMatch ? unlistedMatch[1] === "true" : false,
  };
}

/**
 * Recursively collect all .md and .mdx paths under dir, relative to baseDir.
 */
function collectDocPaths(dir, baseDir, list = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    const rel = path.relative(baseDir, full);
    if (e.isDirectory()) {
      collectDocPaths(full, baseDir, list);
    } else if (/\.(md|mdx)$/i.test(e.name)) {
      list.push(rel);
    }
  }
  return list;
}

/**
 * Build list of [wrongPath, rightPath] for URL replacement and the set of
 * source-file paths that are `unlisted: true`. Both are derived by walking
 * the source MDX in `docs/`.
 */
function buildReplacementsAndUnlisted() {
  const replacements = [];
  const seen = new Set();
  const unlistedPaths = new Set();
  const relPaths = collectDocPaths(docsDir, docsDir);

  for (const rel of relPaths) {
    const ext = path.extname(rel);
    const pathWithoutExt = rel.slice(0, -ext.length);
    const lastSegment = path.basename(pathWithoutExt);
    const dir = path.dirname(pathWithoutExt);
    const { slug, unlisted } = getSlugOrIdFromFile(path.join(docsDir, rel));

    let rightPath;
    if (slug) {
      const slugSegment =
        slug === "/" || slug === ""
          ? ""
          : slug.includes("/")
            ? slug.split("/").pop()
            : slug;
      const same =
        lastSegment === slugSegment &&
        pathWithoutExt !== (slug === "/" ? "" : pathWithoutExt);
      if (!same) {
        rightPath =
          slug === "/" || slug === ""
            ? ""
            : slug.includes("/")
              ? slug
              : dir
                ? `${dir}/${slug}`
                : slug;
      } else {
        rightPath = pathWithoutExt;
      }
    } else {
      // No slug: strip leading "N-" from each segment
      const inferred = pathWithoutExt
        .split("/")
        .map((seg) => seg.replace(/^\d+-/, ""))
        .join("/");
      rightPath = inferred;
    }

    if (
      rightPath !== pathWithoutExt &&
      !seen.has(pathWithoutExt) &&
      rightPath !== undefined
    ) {
      seen.add(pathWithoutExt);
      replacements.push([pathWithoutExt, rightPath]);
    }

    if (unlisted) {
      unlistedPaths.add(rightPath || pathWithoutExt);
    }
  }
  return { replacements, unlistedPaths };
}

/**
 * Load the set of canonical "publishable" routes. We prefer `sitemap.xml`
 * because Docusaurus already strips `unlisted: true` pages and other
 * non-public routes from it — which matches what AI crawlers can reach.
 *
 * Falls back to `globalData.json` if the sitemap is missing.
 *
 * Routes are normalized by stripping any trailing slash so they compare
 * directly to URLs found in llms*.txt.
 */
function loadCanonicalRoutes() {
  const routes = new Set();
  const sitemapPath = path.join(buildDir, "sitemap.xml");
  if (fs.existsSync(sitemapPath)) {
    const xml = fs.readFileSync(sitemapPath, "utf8");
    const locRe = /<loc>([^<]+)<\/loc>/g;
    for (const m of xml.matchAll(locRe)) {
      const url = m[1];
      if (!isSiteOriginUrl(url)) continue;
      const route = url.slice(SITE_BASE.length).replace(/\/$/, "");
      routes.add(route);
    }
    return routes;
  }
  if (fs.existsSync(globalDataPath)) {
    const data = JSON.parse(fs.readFileSync(globalDataPath, "utf8"));
    const versions =
      data?.["docusaurus-plugin-content-docs"]?.default?.versions ?? [];
    for (const v of versions) {
      for (const d of v.docs ?? []) {
        const p = (d.path ?? "").replace(/\/$/, "");
        if (p) routes.add(p);
      }
    }
  }
  return routes;
}

/**
 * Rewrite path-based URLs (step 1 + 2 above) inside an llms*.txt file.
 * Returns the new content (or original when unchanged).
 */
function rewritePaths(content, replacements) {
  const base = `${SITE_BASE}/`;
  let next = content;
  for (const [wrongPath, rightPath] of replacements) {
    const rightUrl = base + rightPath;
    for (const prefix of ["", "docs/"]) {
      const wrongUrl = base + prefix + wrongPath;
      const re = new RegExp(escapeRe(wrongUrl) + "(?!/)", "g");
      next = next.replace(re, rightUrl);
    }
  }
  return next;
}

/**
 * Walk every link in the file and:
 *   - drop bullets whose target URL is not in canonicalRoutes (or is in
 *     unlistedPaths)
 *   - append `.md` to the URL when the target is a documentation route
 */
function pruneAndMarkdownify(content, canonicalRoutes) {
  const linkRe = /\[([^\]]+)\]\((https:\/\/dev\.flare\.network\/[^)]+)\)/g;

  // Process line-by-line so we can drop entire bullet lines whose URL is stale.
  const lines = content.split(/\r?\n/);
  const out = [];

  for (const line of lines) {
    const links = [...line.matchAll(linkRe)];

    // Bullet/list lines: `- [Title](url): summary` — drop entirely when the
    // first link is stale.
    if (/^\s*[-*]\s+\[/.test(line) && links.length > 0) {
      const url = links[0][2];
      if (!isSiteOriginUrl(url)) {
        continue;
      }
      const route = url.slice(SITE_BASE.length).replace(/\.md$/i, "");
      if (!canonicalRoutes.has(route)) {
        // Dropped — stale or unlisted.
        continue;
      }
    }

    // Otherwise: keep the line, but rewrite same-origin doc links to .md.
    const rewritten = line.replace(linkRe, (full, title, url) => {
      if (!isSiteOriginUrl(url)) {
        return full;
      }
      const route = url.slice(SITE_BASE.length);
      // Skip non-doc paths (assets, anchors-only, already-.md, off-site)
      if (
        /\.(md|txt|json|xml|pdf|html?|svg|png|jpe?g|gif|webp|ico|css|js)$/i.test(
          url,
        ) ||
        url.includes("#")
      ) {
        return full;
      }
      // Only rewrite when the route is a known doc route.
      const cleanRoute = route.replace(/\/$/, "");
      if (!canonicalRoutes.has(cleanRoute)) {
        return full;
      }
      return `[${title}](${SITE_BASE}${cleanRoute}.md)`;
    });

    out.push(rewritten);
  }

  // Collapse 3+ consecutive blank lines that may appear after pruning.
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}

/**
 * Append any sitemap routes that aren't already linked in the file. These are
 * usually category/generated-index landing pages that `docusaurus-plugin-llms`
 * doesn't pick up because they have no MDX source.
 */
function appendMissingRoutes(content, canonicalRoutes, titleByRoute) {
  const present = new Set();
  const linkRe = /\(https:\/\/dev\.flare\.network([^)]+?)(\.md)?\)/g;
  for (const m of content.matchAll(linkRe)) {
    present.add(m[1].replace(/\/$/, ""));
  }

  const missing = [];
  for (const route of canonicalRoutes) {
    if (!route) continue;
    if (route === "/search" || route === "/404") continue;
    if (!present.has(route)) missing.push(route);
  }
  if (missing.length === 0) return content;

  const titleCase = (seg) =>
    seg
      .split("-")
      .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
      .join(" ");

  const lines = ["", "## Additional Pages", ""];
  for (const route of missing.sort()) {
    // Use category-style breadcrumb-ish titles so "guides" pages stay
    // distinguishable: e.g. "FDC / Guides / Foundry".
    let title = titleByRoute.get(route);
    if (!title) {
      const segs = route.split("/").filter(Boolean).map(titleCase);
      title = segs.join(" / ");
    } else {
      title = titleCase(title);
    }
    lines.push(`- [${title}](${SITE_BASE}${route}.md)`);
  }
  lines.push("");

  // Insert before the trailing newline(s).
  return content.replace(/\s*$/, "\n" + lines.join("\n"));
}

/**
 * Title lookup for known routes, from `.docusaurus/globalData.json`. Falls
 * back to a title-cased path segment when the route isn't a content-docs page.
 */
function loadTitleByRoute() {
  const titles = new Map();
  if (!fs.existsSync(globalDataPath)) return titles;
  const data = JSON.parse(fs.readFileSync(globalDataPath, "utf8"));
  const versions =
    data?.["docusaurus-plugin-content-docs"]?.default?.versions ?? [];
  for (const v of versions) {
    for (const d of v.docs ?? []) {
      const p = (d.path ?? "").replace(/\/$/, "");
      if (p && d.id) {
        titles.set(p, d.id.split("/").pop());
      }
    }
  }
  return titles;
}

function processLlmsTxt(
  filePath,
  replacements,
  canonicalRoutes,
  titleByRoute,
  isIndex,
) {
  const original = fs.readFileSync(filePath, "utf8");
  let content = rewritePaths(original, replacements);
  content = pruneAndMarkdownify(content, canonicalRoutes);
  if (isIndex) {
    content = appendMissingRoutes(content, canonicalRoutes, titleByRoute);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("[fix-llms-urls] Updated:", path.relative(rootDir, filePath));
  }
}

function main() {
  if (!fs.existsSync(buildDir)) {
    console.warn("[fix-llms-urls] build/ not found, skipping.");
    return;
  }
  const { replacements } = buildReplacementsAndUnlisted();
  const canonicalRoutes = loadCanonicalRoutes();
  // Always allow the home route (`/` -> `https://dev.flare.network` with no
  // trailing slash). Add it explicitly so links to root pass.
  canonicalRoutes.add("");

  const txtFiles = fs
    .readdirSync(buildDir, { withFileTypes: true })
    .filter(
      (e) => e.isFile() && e.name.endsWith(".txt") && e.name.startsWith("llms"),
    );

  if (replacements.length === 0 && canonicalRoutes.size === 0) {
    console.log("[fix-llms-urls] Nothing to do.");
    return;
  }

  const titleByRoute = loadTitleByRoute();

  for (const e of txtFiles) {
    // Only the main `llms.txt` index gets the "Additional Pages" backfill —
    // section-specific files like `llms-fdc.txt` should stay focused.
    const isIndex = e.name === "llms.txt";
    processLlmsTxt(
      path.join(buildDir, e.name),
      replacements,
      canonicalRoutes,
      titleByRoute,
      isIndex,
    );
  }
}

main();
