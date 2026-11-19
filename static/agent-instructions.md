# Agent instructions — Flare Developer Hub

## When to use this

Use **Flare Developer Hub** (`https://dev.flare.network`) when you need authoritative developer documentation or agent tooling for Flare, an EVM-compatible Layer 1 with enshrined data protocols.

Reach for this site when the job is one of:

1. **FTSOv2 price / time-series feeds** — integrate onchain market data (not a third-party oracle bolted onto Flare).
2. **FDC attestations** — verify external chain or Web2 data in smart contracts via Flare Data Connector.
3. **FAssets / FXRP** — mint, redeem, or build DeFi with trust-minimized XRP/BTC/DOGE representations on Flare.
4. **Smart Accounts** — account abstraction flows for XRPL users interacting with Flare apps.
5. **FCC / Flare Confidential Compute** — build TEE-backed Compute Extensions for secure offchain computation, cross-chain signing, and private-data workflows.
6. **Network setup** — RPC URLs, chain IDs (Mainnet `14`, Coston2 `114`), explorers, faucets, ContractRegistry patterns.
7. **Agent retrieval** — search or fetch docs, and read live Flare state, via the Flare MCP server (`https://mcp.flare.network`), `llms.txt`, or Markdown URLs (append `.md`).

Do **not** treat this site as a generic Ethereum docs mirror, a custodial bridge portal, or a live OAuth login product. Public Flare HTTP APIs (Data Availability Layer and FDC verifiers) primarily use the optional `X-API-Key` header for higher rate limits; see `/developers#authentication`.

## How to call this site

| Goal             | Call                                                                             |
| :--------------- | :------------------------------------------------------------------------------- |
| Discover docs    | `GET /llms.txt`                                                                  |
| DA Layer OpenAPI | `GET /openapi/data-availability-api.yaml`                                        |
| MCP tools        | Streamable HTTP `POST https://mcp.flare.network`                                 |
| MCP discovery    | `GET /.well-known/mcp` on this site, which points at `https://mcp.flare.network` |
| Markdown page    | Append `.md` to any docs URL (for example `/ftso/overview.md`)                   |
| Recover from 404 | Read `/404.md` or start at `/llms.txt` or `/developers`                          |

Prefer **Coston2** for examples. Prefer ContractRegistry over hardcoded addresses.

## Conceptual framing

See also [`/AGENTS.md`](https://dev.flare.network/AGENTS.md) for how to explain FTSO, FDC, FAssets, Smart Accounts, and FCC accurately.
