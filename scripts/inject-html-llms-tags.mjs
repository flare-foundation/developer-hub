#!/usr/bin/env node
/**
 * Post-build script: inject per-page markdown alternate links into every
 * documentation HTML page in `build/`.
 *
 * Why: Agent Score / afdocs and AI agents look in each page's <head> for either
 *   - <link rel="llms-txt" href="/llms.txt">                (site-wide index)
 *   - <link rel="alternate" type="text/markdown" href=".../page.md">
 *
 * The site-wide tag is already added via docusaurus.config.ts `headTags`. This
 * script adds the second, page-specific alternate that points at the matching
 * `.md` file emitted by scripts/generate-md-routes.mjs.
 *
 * Run after: docusaurus build && node scripts/generate-md-routes.mjs.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const buildDir = path.join(rootDir, "build");
const SITE_BASE = "https://dev.flare.network";

/**
 * Walk every file in `dir` recursively and return absolute paths to .html files.
 */
function walkHtml(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtml(full, list);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      list.push(full);
    }
  }
  return list;
}

/**
 * Resolve the URL path for a given HTML file relative to buildDir.
 *   build/network/overview.html        -> /network/overview
 *   build/fxrp/firelight/index.html    -> /fxrp/firelight
 *   build/index.html                   -> /
 */
function htmlToRoute(htmlPath) {
  const rel = path.relative(buildDir, htmlPath).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) {
    return "/" + rel.slice(0, -"/index.html".length);
  }
  return "/" + rel.replace(/\.html$/i, "");
}

/**
 * Find the matching .md file for an HTML page, if generate-md-routes.mjs wrote
 * one. Returns the absolute path or null.
 */
function matchingMdForHtml(htmlPath) {
  const rel = path.relative(buildDir, htmlPath);
  const candidates = [];
  if (rel === "index.html") {
    candidates.push(path.join(buildDir, "index.md"));
  } else if (
    rel.endsWith(path.sep + "index.html") ||
    rel.endsWith("/index.html")
  ) {
    const dir = rel.slice(0, -"/index.html".length);
    candidates.push(path.join(buildDir, `${dir}.md`));
    candidates.push(path.join(buildDir, dir, "index.md"));
  } else {
    candidates.push(path.join(buildDir, rel.replace(/\.html$/i, ".md")));
  }
  return candidates.find((p) => fs.existsSync(p)) ?? null;
}

/**
 * Skip pages that are not documentation routes — these don't need an
 * alternate markdown link because they have no source markdown.
 */
function isSkippablePage(route) {
  return (
    route === "/404" ||
    route.startsWith("/tags") ||
    route === "/search" ||
    route === "/mcp"
  );
}

/**
 * Inject one or more <link> tags right before </head>. Idempotent: tags that
 * already appear (by their `rel` value) are skipped.
 */
function injectIntoHead(html, tagsToAdd) {
  const idx = html.toLowerCase().indexOf("</head>");
  if (idx === -1) return html;

  const head = html.slice(0, idx);
  const tail = html.slice(idx);

  const toInject = tagsToAdd.filter((tag) => {
    // Heuristic: dedupe on the full tag string and on the `rel` value
    // (handles both quoted and unquoted attribute styles).
    if (head.includes(tag)) return false;
    const relMatch = tag.match(/rel=["']?([^"'\s>]+)["']?/i);
    if (!relMatch) return true;
    const rel = relMatch[1];
    // Don't re-inject the llms-txt directive if it's already present.
    if (rel === "llms-txt" && /rel=["']?llms-txt["']?/i.test(head)) {
      return false;
    }
    // Don't re-inject the markdown alternate if it's already present.
    if (
      rel === "alternate" &&
      /<link[^>]+rel=["']?alternate["']?[^>]+type=["']?text\/markdown["']?/i.test(
        head,
      )
    ) {
      return false;
    }
    return true;
  });

  if (toInject.length === 0) return html;
  return head + toInject.join("") + tail;
}

function injectAgentDirective(html) {
  if (html.includes("agent-docs-directive")) return html;
  const bodyMatch = html.match(/<body[^>]*>/i);
  if (!bodyMatch || bodyMatch.index === undefined) return html;

  const directive =
    '<div id="agent-docs-directive" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden">' +
    'Agent documentation index: <a href="/llms.txt">llms.txt</a>. ' +
    "Markdown versions of documentation pages are available by appending <code>.md</code> to the page URL." +
    "</div>";

  const insertAt = bodyMatch.index + bodyMatch[0].length;
  return html.slice(0, insertAt) + directive + html.slice(insertAt);
}

function main() {
  if (!fs.existsSync(buildDir)) {
    console.warn("[inject-html-llms-tags] build/ not found, skipping.");
    return;
  }

  // Site-wide llms.txt directive (advertised on every HTML page, including
  // non-doc routes like 404 and tags). Docusaurus' built-in `headTags` config
  // does not reliably survive the SWC HTML minifier, so we inject here.
  const llmsTxtTag = `<link rel="llms-txt" type="text/markdown" href="/llms.txt">`;

  const htmlFiles = walkHtml(buildDir);
  let injectedAlt = 0;
  let injectedLlms = 0;
  let missingMd = 0;

  for (const htmlPath of htmlFiles) {
    const route = htmlToRoute(htmlPath);

    const tags = [llmsTxtTag];
    let altInjected = false;

    if (!isSkippablePage(route)) {
      const mdPath = matchingMdForHtml(htmlPath);
      if (mdPath) {
        const mdRelFromBuild = path
          .relative(buildDir, mdPath)
          .split(path.sep)
          .join("/");
        const mdUrl = `${SITE_BASE}/${mdRelFromBuild}`;
        tags.push(
          `<link rel="alternate" type="text/markdown" ` +
            `href="${mdUrl}" title="Markdown version of this page">`,
        );
        altInjected = true;
      } else {
        missingMd++;
      }
    }

    const html = fs.readFileSync(htmlPath, "utf8");
    const next = injectAgentDirective(injectIntoHead(html, tags));
    if (next !== html) {
      fs.writeFileSync(htmlPath, next, "utf8");
      injectedLlms++;
      if (altInjected) injectedAlt++;
    }
  }

  console.log(
    `[inject-html-llms-tags] Injected llms-txt directive into ${injectedLlms} HTML pages, ` +
      `markdown alternate into ${injectedAlt} doc pages ` +
      `(${missingMd} doc pages had no matching .md).`,
  );
}

main();
