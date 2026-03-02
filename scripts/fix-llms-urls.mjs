#!/usr/bin/env node
/**
 * Post-build script: fix LLM-generated URLs to use Docusaurus slugs.
 * The docusaurus-plugin-llms builds URLs from file paths (e.g. network/1-getting-started),
 * but our docs use frontmatter `slug` (e.g. getting-started). This script rewrites
 * the generated llms*.txt files so URLs match the actual site routes.
 *
 * Run after: npm run build (or add "postbuild" / call from build script).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const docsDir = path.join(rootDir, "docs");
const buildDir = path.join(rootDir, "build");

const SITE_BASE = "https://dev.flare.network";

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
  if (!match) return null;
  const front = match[1];
  const slugMatch = front.match(/^slug:\s*["']?([^"'\n]*)["']?\s*$/m);
  if (slugMatch) return slugMatch[1].trim();
  const idMatch = front.match(/^id:\s*["']?([^"'\s\n]+)["']?\s*$/m);
  return idMatch ? idMatch[1].trim() : null;
}

/**
 * Recursively collect all .md and .mdx paths under dir, relative to baseDir.
 */
function collectDocPaths(dir, baseDir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
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
 * Build list of [wrongPath, rightPath] for URL replacement.
 * wrongPath = path from file (e.g. network/1-getting-started)
 * rightPath = path using slug (e.g. network/getting-started)
 * When frontmatter has no slug/id, infers clean path by stripping leading "N-" from segments (e.g. 3-governance -> governance).
 */
function buildReplacements() {
  const replacements = [];
  const seen = new Set();
  const relPaths = collectDocPaths(docsDir, docsDir);
  for (const rel of relPaths) {
    const ext = path.extname(rel);
    const pathWithoutExt = rel.slice(0, -ext.length);
    const lastSegment = path.basename(pathWithoutExt);
    const dir = path.dirname(pathWithoutExt);
    const slug = getSlugOrIdFromFile(path.join(docsDir, rel));

    let rightPath;
    if (slug) {
      const slugSegment =
        slug === "/" || slug === ""
          ? ""
          : slug.includes("/")
            ? slug.split("/").pop()
            : slug;
      if (
        lastSegment === slugSegment &&
        pathWithoutExt !== (slug === "/" ? "" : pathWithoutExt)
      ) {
        continue;
      }
      rightPath =
        slug === "/" || slug === ""
          ? ""
          : slug.includes("/")
            ? slug
            : dir
              ? `${dir}/${slug}`
              : slug;
    } else {
      const inferredSegment = lastSegment.replace(/^\d+-/, "");
      if (inferredSegment === lastSegment || !inferredSegment) continue;
      rightPath = dir ? `${dir}/${inferredSegment}` : inferredSegment;
    }

    if (pathWithoutExt !== rightPath && !seen.has(pathWithoutExt)) {
      seen.add(pathWithoutExt);
      replacements.push([pathWithoutExt, rightPath]);
    }
  }
  return replacements;
}

function fixFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;
  const rightUrlBase = `${SITE_BASE}/`;
  for (const [wrongPath, rightPath] of replacements) {
    const rightUrl = rightUrlBase + rightPath;
    for (const prefix of ["", "docs/"]) {
      const wrongUrl = rightUrlBase + prefix + wrongPath;
      const re = new RegExp(escapeRe(wrongUrl) + "(?!/)", "g");
      const next = content.replace(re, rightUrl);
      if (next !== content) {
        content = next;
        changed = true;
      }
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("[fix-llms-urls] Updated:", path.relative(rootDir, filePath));
  }
}

function main() {
  if (!fs.existsSync(buildDir)) {
    console.warn("[fix-llms-urls] build/ not found, skipping.");
    return;
  }
  const replacements = buildReplacements();
  if (replacements.length === 0) {
    console.log("[fix-llms-urls] No slug-based path corrections needed.");
    return;
  }
  const txtFiles = fs
    .readdirSync(buildDir, { withFileTypes: true })
    .filter(
      (e) => e.isFile() && e.name.endsWith(".txt") && e.name.startsWith("llms"),
    );
  for (const e of txtFiles) {
    fixFile(path.join(buildDir, e.name), replacements);
  }
}

main();
