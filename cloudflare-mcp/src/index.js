import { createCloudflareHandler } from "docusaurus-plugin-mcp-server/adapters";
import docs from "../../build/mcp/docs.json";
import searchIndexData from "../../build/mcp/search-index.json";

let cachedHandler = null;
let cachedBaseUrl = null;

export default {
  async fetch(request, env) {
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

    return cachedHandler(request);
  },
};
