# Flare Developer Hub — MCP Cloudflare Worker

Cloudflare Worker that serves the MCP server for the Flare Developer Hub.

The worker and the docs site can be hosted separately:

- The Docusaurus build can be served from GitHub Pages or any static host.
- The Cloudflare Worker serves only the MCP endpoint.
- `DOCS_BASE_URL` must point to the public docs origin that agents should fetch.

The worker serves the MCP endpoint at `/mcp`.
The server exposes the Flare Developer Hub documentation tools used by MCP clients, including `docs_search` and `docs_fetch`.

## Deploy

Always deploy from the **repo root** using the dedicated script, which passes the correct config path explicitly. Running `wrangler deploy` directly from the repo root without `--config` will pick up any `wrangler.toml` it finds first and may deploy the wrong thing.

```bash
npm run deploy:mcp
```

This runs:

```bash
npx wrangler deploy --config cloudflare-mcp/wrangler.toml
```

## Local development

```bash
npx wrangler dev --config cloudflare-mcp/wrangler.toml
```

This runs the Worker locally and serves the MCP endpoint at `http://127.0.0.1:8787/mcp`.

## Local MCP testing

There is also a repo-root local test server at `mcp-server.mjs`.
Use it when you want to test the MCP server behavior without running the Cloudflare Worker.

From the repo root:

```bash
npm run build
node mcp-server.mjs
```

This starts a local MCP server at `http://localhost:3456`.
It uses `build/mcp/*` artifacts when available and falls back to `build/search-index.json` plus local or runtime HTML fetching when those MCP artifacts are missing or incomplete.

## Prerequisites

Run a full site build before deploying:

```bash
npm run build
npm run deploy:mcp
```

The worker uses the generated build artifacts as follows:

- It prefers valid `build/mcp/*` artifacts from `docusaurus-plugin-mcp-server`.
- If those MCP artifacts are missing or incomplete, it falls back to `build/search-index.json` for `docs_search`.
- In fallback mode, `docs_fetch` retrieves page HTML from `DOCS_BASE_URL` at runtime.
