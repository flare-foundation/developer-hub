import { createCloudflareHandler } from "docusaurus-plugin-mcp-server/adapters";
import docs from "../../build/mcp/docs.json";
import searchIndexData from "../../build/mcp/search-index.json";

let cachedHandler = null;
let cachedBaseUrl = null;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (!url.pathname.startsWith("/mcp")) {
      return new Response("Not found", { status: 404 });
    }

    const baseUrl = env?.DOCS_BASE_URL ?? "https://dev.flare.network/";

    if (!cachedHandler || cachedBaseUrl !== baseUrl) {
      cachedBaseUrl = baseUrl;

      cachedHandler = createCloudflareHandler({
        docs,
        searchIndexData,
        name: env?.MCP_SERVER_NAME ?? "flare-devhub",
        version: env?.MCP_SERVER_VERSION ?? "1.0.0",
        baseUrl,
      });
    }

    const newUrl = request.url.replace("/mcp", "") || "/";
    let newRequest = request;

    if (request.method === "POST") {
      try {
        const body = await request.json();

        const normalizeUrl = (url) => {
          let normalized = url;
          try {
            normalized = new URL(url).href;
          } catch {
            // Already a relative path; leave as-is.
          }
          return normalized.replace(/\/+$/, "");
        };

        // Top-level url field (e.g. some direct requests)
        if (body?.url && typeof body.url === "string") {
          body.url = normalizeUrl(body.url);
        }

        // Nested url inside tools/call → docs_fetch arguments
        if (
          body?.method === "tools/call" &&
          body?.params?.arguments?.url &&
          typeof body.params.arguments.url === "string"
        ) {
          body.params.arguments.url = normalizeUrl(body.params.arguments.url);
        }

        newRequest = new Request(newUrl, {
          method: "POST",
          headers: request.headers,
          body: JSON.stringify(body),
        });
      } catch {
        // Non-JSON payloads should continue to pass through unchanged.
        newRequest = new Request(newUrl, request);
      }
    } else {
      newRequest = new Request(newUrl, request);
    }

    return cachedHandler(newRequest);
  },
};
