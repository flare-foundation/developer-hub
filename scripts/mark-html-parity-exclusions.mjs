#!/usr/bin/env node
/**
 * Tag interactive / duplicated HTML regions so Agent Score markdown-content-parity
 * compares prose only. Canonical code and tables live in the emitted .md routes.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.join(__dirname, "..", "build");

function walkHtmlFiles(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtmlFiles(full, list);
    else if (entry.name.endsWith(".html")) list.push(full);
  }
  return list;
}

function markExclusions(html) {
  const $ = cheerio.load(html);
  const root = $(".theme-doc-markdown").first();
  if (!root.length) return null;

  root
    .find("pre, .theme-tabs-container, .codeBlockContainer_Ckt0")
    .each((_, el) => {
      $(el).attr("data-markdown-ignore", "");
    });

  return $.html();
}

function main() {
  if (!fs.existsSync(buildDir)) {
    console.warn("[mark-html-parity-exclusions] build/ not found, skipping.");
    return;
  }

  let updated = 0;
  for (const file of walkHtmlFiles(buildDir)) {
    const raw = fs.readFileSync(file, "utf8");
    const next = markExclusions(raw);
    if (!next || next === raw) continue;
    fs.writeFileSync(file, next, "utf8");
    updated++;
  }

  console.log(
    `[mark-html-parity-exclusions] Tagged code/tabs in ${updated} HTML files.`,
  );
}

main();
