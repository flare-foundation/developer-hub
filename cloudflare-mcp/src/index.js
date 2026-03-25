import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { McpDocsServer } from "docusaurus-plugin-mcp-server";
import { z } from "zod";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { select } from "hast-util-select";
import { toString } from "hast-util-to-string";
import lunr from "lunr";
import mcpDocs from "../../build/mcp/docs.json" with { type: "json" };
import mcpSearchIndexData from "../../build/mcp/search-index.json" with { type: "json" };
import mcpManifest from "../../build/mcp/manifest.json" with { type: "json" };
import siteSearchIndexData from "../../build/search-index.json" with { type: "json" };

const CONTENT_SELECTORS = ["article", "main", ".main-wrapper", '[role="main"]'];

let cachedServerKey = null;
let cachedServerMode = null;
let cachedHandler = null;

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

function getDocsBaseUrl(env) {
  const value = env?.DOCS_BASE_URL ?? "https://dev.flare.network/";
  return new URL(value).toString();
}

function joinUrl(baseUrl, route, hash = "") {
  const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const pathname = route.startsWith("/") ? route : `/${route}`;
  return `${base}${pathname}${hash}`;
}

function normalizeSearchText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
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

function buildSiteSearchIndex() {
  return siteSearchIndexData.map((batch) => ({
    documents: batch.documents,
    index: lunr.Index.load(batch.index),
  }));
}

function searchSiteIndex(searchIndex, docsBaseUrl, query, limit = 5) {
  const seen = new Map();

  for (const batch of searchIndex) {
    const hits = batch.index.search(query);

    for (const hit of hits) {
      const doc = batch.documents.find(
        (candidate) => String(candidate.i) === String(hit.ref),
      );
      if (!doc || typeof doc.u !== "string") continue;

      const hash = typeof doc.h === "string" ? doc.h : "";
      const url = joinUrl(docsBaseUrl, doc.u, hash);
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
  const manifestDocCount = mcpManifest?.docCount;
  const docsCount = Object.keys(mcpDocs ?? {}).length;

  return (
    typeof manifestDocCount === "number" &&
    manifestDocCount > 10 &&
    docsCount > 10
  );
}

function normalizeToolUrl(value, docsBaseUrl) {
  if (typeof value !== "string") return value;

  try {
    const parsed = new URL(value);
    const docsBase = new URL(docsBaseUrl);
    const isDocsBase =
      parsed.origin === docsBase.origin &&
      parsed.pathname === docsBase.pathname;

    if (!isDocsBase && parsed.pathname.length > 1) {
      parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    }

    return parsed.toString();
  } catch {
    return value;
  }
}

function createFallbackServer(env) {
  const docsBaseUrl = getDocsBaseUrl(env);
  const searchIndex = buildSiteSearchIndex();
  const name = env?.MCP_SERVER_NAME ?? "flare-devhub";
  const version = env?.MCP_SERVER_VERSION ?? "1.0.0";

  const mcpServer = new McpServer(
    { name, version },
    { capabilities: { tools: {} } },
  );

  mcpServer.registerTool(
    "docs_fetch",
    {
      description:
        "Fetch a documentation page by URL and return its main content as text.",
      inputSchema: z.object({
        url: z.string().url(),
      }),
    },
    async ({ url }) => {
      try {
        const res = await fetch(url, {
          headers: { Accept: "text/html,application/xhtml+xml" },
        });

        if (!res.ok) {
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

        const html = await res.text();
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
      const results = searchSiteIndex(searchIndex, docsBaseUrl, query, limit);
      return {
        content: [{ type: "text", text: formatSearchResults(results) }],
      };
    },
  );

  return {
    mode: "fallback",
    async handleWebRequest(request) {
      const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });

      await mcpServer.connect(transport);
      try {
        return await transport.handleRequest(request);
      } finally {
        await transport.close();
      }
    },
  };
}

function createHandler(env) {
  const docsBaseUrl = getDocsBaseUrl(env);
  const name = env?.MCP_SERVER_NAME ?? "flare-devhub";
  const version = env?.MCP_SERVER_VERSION ?? "1.0.0";
  const mode = hasUsableMcpArtifacts() ? "plugin-artifacts" : "fallback";
  const serverKey = `${name}@${version}|${docsBaseUrl}|${mode}`;

  if (cachedHandler && cachedServerKey === serverKey) {
    return { handler: cachedHandler, mode: cachedServerMode };
  }

  cachedServerKey = serverKey;
  cachedServerMode = mode;

  if (mode === "plugin-artifacts") {
    const server = new McpDocsServer({
      docs: mcpDocs,
      searchIndexData: mcpSearchIndexData,
      name,
      version,
      baseUrl: docsBaseUrl,
    });

    cachedHandler = {
      async handleWebRequest(request) {
        return await server.handleWebRequest(request);
      },
    };
  } else {
    cachedHandler = createFallbackServer(env);
  }

  return { handler: cachedHandler, mode: cachedServerMode };
}

function rewriteMcpRequest(request, docsBaseUrl) {
  const url = new URL(request.url);
  const stripped = new URL(request.url);
  stripped.pathname = url.pathname.replace(/^\/mcp/, "") || "/";

  if (request.method !== "POST") {
    return new Request(stripped.toString(), request);
  }

  return request
    .clone()
    .json()
    .then((body) => {
      if (body?.url && typeof body.url === "string") {
        body.url = normalizeToolUrl(body.url, docsBaseUrl);
      }

      if (
        body?.method === "tools/call" &&
        body?.params?.arguments?.url &&
        typeof body.params.arguments.url === "string"
      ) {
        body.params.arguments.url = normalizeToolUrl(
          body.params.arguments.url,
          docsBaseUrl,
        );
      }

      return new Request(stripped.toString(), {
        method: "POST",
        headers: request.headers,
        body: JSON.stringify(body),
      });
    })
    .catch(() => new Request(stripped.toString(), request));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/mcp")) {
      return new Response("Not found", { status: 404 });
    }

    const docsBaseUrl = getDocsBaseUrl(env);
    const newRequest = await rewriteMcpRequest(request, docsBaseUrl);
    const { handler } = createHandler(env);

    return await handler.handleWebRequest(newRequest);
  },
};
