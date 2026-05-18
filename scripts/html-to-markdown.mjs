#!/usr/bin/env node
/**
 * Convert Docusaurus-built doc HTML into agent-facing markdown.
 * Uses the same `.theme-doc-markdown` region users see in the browser.
 */

import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import TurndownService from "turndown";

const CONTENT_SELECTOR = ".theme-doc-markdown";

function findHtmlPathForRoute(buildDir, route) {
  const trimmed = route.replace(/\/+$/, "");
  if (trimmed === "" || trimmed === "/") {
    const index = path.join(buildDir, "index.html");
    return fs.existsSync(index) ? index : null;
  }
  const rel = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  const flat = path.join(buildDir, `${rel}.html`);
  if (fs.existsSync(flat)) return flat;
  const nested = path.join(buildDir, rel, "index.html");
  if (fs.existsSync(nested)) return nested;
  return null;
}

function stripNonContentNodes($, root) {
  root
    .find("button, svg, .tabs__item")
    .add(root.find('[class*="copy"], [class*="Copy"]'))
    .remove();
}

function createTurndown() {
  const service = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    bulletListMarker: "-",
  });

  service.addRule("details", {
    filter: "details",
    replacement(content, node) {
      const summary =
        node.querySelector("summary")?.textContent?.trim() || "Details";
      return `\n<details>\n<summary>${summary}</summary>\n\n${content.trim()}\n\n</details>\n`;
    },
  });

  return service;
}

/**
 * @param {string} buildDir
 * @param {string} route e.g. "/ftso/feeds"
 * @returns {string | null}
 */
export function markdownFromBuiltHtml(buildDir, route) {
  const htmlPath = findHtmlPathForRoute(buildDir, route);
  if (!htmlPath) return null;

  const html = fs.readFileSync(htmlPath, "utf8");
  const $ = cheerio.load(html);
  const content = $(CONTENT_SELECTOR).first();
  if (!content.length) return null;

  stripNonContentNodes($, content);

  const turndown = createTurndown();
  let body = turndown.turndown(content.html() || "").trim();

  // Drop duplicate top-level H1; generate-md-routes adds its own title block.
  body = body.replace(/^#\s+.+\n+/, "");

  return body.trim() || null;
}
