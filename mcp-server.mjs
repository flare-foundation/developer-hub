import http from "http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import lunr from "lunr";
import { McpDocsServer } from "docusaurus-plugin-mcp-server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { select } from "hast-util-select";
import { toString } from "hast-util-to-string";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SERVER_NAME = "flare-devhub";
const SERVER_VERSION = "1.0.0";
const DOCS_BASE_URL = "https://dev.flare.network";

const BUILD_DIR = path.join(__dirname, "build");
const MCP_DOCS_PATH = path.join(BUILD_DIR, "mcp/docs.json");
const MCP_INDEX_PATH = path.join(BUILD_DIR, "mcp/search-index.json");
const MCP_MANIFEST_PATH = path.join(BUILD_DIR, "mcp/manifest.json");
const SITE_SEARCH_INDEX_PATH = path.join(BUILD_DIR, "search-index.json");

const CONTENT_SELECTORS = ["article", "main", ".main-wrapper", '[role="main"]'];

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : undefined);
      } catch {
        reject(new Error("Invalid JSON in request body"));
      }
    });

    req.on("error", reject);
  });
}

function extractPageTextAsMarkdown(html) {
  const tree = unified().use(rehypeParse).parse(html);

  const h1 = select("h1", tree);
  const titleEl = h1 ?? select("title", tree);
  const title = titleEl ? toString(titleEl).trim() : "Untitled";

  let contentEl = null;
  for (const selector of CONTENT_SELECTORS) {
    const el = select(selector, tree);
    if (!el) continue;

    const text = toString(el).trim();
    if (text.length > 50) {
      contentEl = el;
      break;
    }
  }

  if (!contentEl) contentEl = select("body", tree);

  const text = contentEl ? toString(contentEl).replace(/\s+/g, " ").trim() : "";
  return text ? `# ${title}\n\n${text}` : `# ${title}`;
}

function normalizeSearchText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function joinUrl(baseUrl, route, hash = "") {
  const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const pathname = route.startsWith("/") ? route : `/${route}`;
  return `${base}${pathname}${hash}`;
}

function toHeadingText(hash) {
  if (!hash || hash === "#") return null;
  return hash.replace(/^#/, "").replace(/-/g, " ").trim();
}

function makeTitle(doc) {
  if (typeof doc.s === "string" && doc.s.trim()) return doc.s;
  if (typeof doc.t === "string" && doc.t.trim()) return doc.t;
  return "Untitled";
}

function makeSnippet(doc) {
  if (
    typeof doc.t === "string" &&
    typeof doc.s === "string" &&
    doc.s !== doc.t
  ) {
    return doc.t;
  }
  if (typeof doc.t === "string" && doc.t.trim()) return doc.t;
  if (Array.isArray(doc.b) && doc.b.length > 0) return doc.b.join(" / ");
  return "Relevant documentation match.";
}

function rankSearchResult(doc, query, score) {
  let nextScore = score;
  const normalizedQuery = normalizeSearchText(query);
  const normalizedTitle = normalizeSearchText(makeTitle(doc));
  const hasHash = typeof doc.h === "string" && doc.h.length > 0;

  if (doc.u === "/") nextScore -= 3;
  if (hasHash) nextScore -= 0.5;
  if (doc.u !== "/") nextScore += 0.5;
  if (doc.u.toLowerCase().includes(query.toLowerCase())) nextScore += 2;
  if (normalizedTitle === normalizedQuery) nextScore += 4;

  return nextScore;
}

function formatSearchResults(results) {
  if (results.length === 0) {
    return "No matching documents found.";
  }

  const lines = [`Found ${results.length} result(s):`, ""];

  results.forEach((result, index) => {
    lines.push(`${index + 1}. **${result.title}**`);
    lines.push(`   URL: ${result.url}`);
    if (result.matchingHeadings.length > 0) {
      lines.push(`   Matching sections: ${result.matchingHeadings.join(", ")}`);
    }
    lines.push(`   ${result.snippet}`);
    lines.push("");
  });

  lines.push("Use docs_fetch with the URL to retrieve the full page content.");
  return lines.join("\n");
}

function loadSiteSearchIndex() {
  if (!fs.existsSync(SITE_SEARCH_INDEX_PATH)) return null;

  const raw = fs.readFileSync(SITE_SEARCH_INDEX_PATH, "utf8");
  const data = JSON.parse(raw);

  return data.map((batch) => ({
    documents: batch.documents,
    index: lunr.Index.load(batch.index),
  }));
}

function resolveLocalHtmlPath(url) {
  let parsedUrl;

  try {
    parsedUrl = new URL(url);
  } catch {
    return null;
  }

  if (parsedUrl.origin !== new URL(DOCS_BASE_URL).origin) return null;

  const pathname = decodeURIComponent(parsedUrl.pathname);
  const candidates = [];

  if (pathname === "/") {
    candidates.push(path.join(BUILD_DIR, "index.html"));
  } else {
    const relativePath = pathname.replace(/^\/+/, "");
    if (relativePath.endsWith(".html")) {
      candidates.push(path.join(BUILD_DIR, relativePath));
    } else {
      candidates.push(path.join(BUILD_DIR, `${relativePath}.html`));
      candidates.push(path.join(BUILD_DIR, relativePath, "index.html"));
    }
  }

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

function searchSiteIndex(searchIndex, query, limit = 5) {
  const seen = new Map();

  for (const batch of searchIndex) {
    const hits = batch.index.search(query);

    for (const hit of hits) {
      const doc = batch.documents.find(
        (candidate) => String(candidate.i) === String(hit.ref),
      );
      if (!doc || typeof doc.u !== "string") continue;

      const hash = typeof doc.h === "string" ? doc.h : "";
      const url = joinUrl(DOCS_BASE_URL, doc.u, hash);
      const heading = toHeadingText(hash);

      const next = {
        title: makeTitle(doc),
        url,
        snippet: makeSnippet(doc),
        matchingHeadings: heading ? [heading] : [],
        score: rankSearchResult(doc, query, hit.score),
      };

      const existing = seen.get(url);
      if (!existing || next.score > existing.score) {
        seen.set(url, next);
      }
    }
  }

  return Array.from(seen.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function hasUsableMcpArtifacts() {
  if (
    !fs.existsSync(MCP_DOCS_PATH) ||
    !fs.existsSync(MCP_INDEX_PATH) ||
    !fs.existsSync(MCP_MANIFEST_PATH)
  ) {
    return false;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(MCP_MANIFEST_PATH, "utf8"));
    return typeof manifest.docCount === "number" && manifest.docCount > 10;
  } catch {
    return false;
  }
}

function createFallbackServer() {
  const searchIndex = loadSiteSearchIndex();
  const mcpServer = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } },
  );

  mcpServer.registerTool(
    "docs_fetch",
    {
      description:
        "Fetch a documentation page by URL and return its main content as text.",
      inputSchema: z.object({ url: z.string().url() }),
    },
    async ({ url }) => {
      try {
        const localHtmlPath = resolveLocalHtmlPath(url);
        const html = localHtmlPath
          ? fs.readFileSync(localHtmlPath, "utf8")
          : await (async () => {
              const res = await fetch(url, {
                headers: { Accept: "text/html,application/xhtml+xml" },
              });

              if (!res.ok) return null;
              return await res.text();
            })();

        if (!html) {
          return {
            content: [
              {
                type: "text",
                text: "Page not found. Please check the URL and try again.",
              },
            ],
            isError: true,
          };
        }

        const text = extractPageTextAsMarkdown(html);
        return { content: [{ type: "text", text }] };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching page: ${String(error)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  mcpServer.registerTool(
    "docs_search",
    {
      description:
        "Search documentation and return matching pages with URLs and snippets.",
      inputSchema: z.object({
        query: z.string().min(1),
        limit: z.number().int().min(1).max(20).optional().default(5),
      }),
    },
    async ({ query, limit }) => {
      if (!searchIndex) {
        return {
          content: [
            {
              type: "text",
              text: "docs_search is unavailable locally because no search index was found. Run `npm run build` first.",
            },
          ],
          isError: true,
        };
      }

      const results = searchSiteIndex(searchIndex, query, limit);
      return {
        content: [{ type: "text", text: formatSearchResults(results) }],
      };
    },
  );

  return {
    mode: "fallback",
    async handleHttpRequest(req, res, parsedBody) {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });

      await mcpServer.connect(transport);
      try {
        await transport.handleRequest(req, res, parsedBody);
      } finally {
        await transport.close();
      }
    },
  };
}

function createServer() {
  if (hasUsableMcpArtifacts()) {
    return {
      mode: "plugin-artifacts",
      server: new McpDocsServer({
        docsPath: MCP_DOCS_PATH,
        indexPath: MCP_INDEX_PATH,
        name: SERVER_NAME,
        version: SERVER_VERSION,
        baseUrl: DOCS_BASE_URL,
      }),
    };
  }

  return {
    mode: "fallback",
    server: createFallbackServer(),
  };
}

const { mode, server } = createServer();

http
  .createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Accept",
      });
      res.end();
      return;
    }

    if (req.method !== "POST") {
      res.writeHead(405);
      res.end();
      return;
    }

    const parsedBody = await parseRequestBody(req);
    await server.handleHttpRequest(req, res, parsedBody);
  })
  .listen(3456, () => {
    console.log(`MCP server at http://localhost:3456 (${mode})`);

    if (mode === "plugin-artifacts") {
      console.log(
        "Using build/mcp artifacts from docusaurus-plugin-mcp-server.",
      );
      return;
    }

    console.warn(
      "build/mcp artifacts were missing or incomplete. Falling back to build/search-index.json for docs_search and local build/runtime fetching for docs_fetch.",
    );
  });
