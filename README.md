# Flare Developer Hub

Source code and content for the [Flare Developer Hub](https://dev.flare.network) - Flare’s documentation site for builders ☀️.

Built with [Docusaurus](https://docusaurus.io/), a modern static site generator.

> **Note:**
> This repository is intended for contributors and maintainers.
> If you just want to read the docs, visit [dev.flare.network](https://dev.flare.network).

## Getting started

### Prerequisites

- [Node.js v22](https://nodejs.org/en/) and npm
  - Recommended: [nvm](https://github.com/nvm-sh/nvm) to manage Node versions
- (Optional) For language-specific code in [examples](examples/):
  - Python: [uv](https://docs.astral.sh/uv/)
  - Rust: [Cargo](https://doc.rust-lang.org/cargo/)
  - Go: [go](https://go.dev/doc/install)

### Install and run locally

```bash
git clone https://github.com/flare-foundation/developer-hub.git
cd developer-hub
npm ci
npm run start
```

This starts a local development server with hot reloading and opens the site in your browser.

## Repo structure

```plaintext
flare-foundation/developer-hub/
├── .github/             # GitHub Actions workflows, issue templates, etc.
├── automations/         # Scripts + generated data (feeds, addresses, tables).
├── docgen/              # Tooling for auto-generating Solidity documentation.
├── docs/                # Core documentation content (MD/MDX).
├── examples/            # Multi-language examples (Python/Rust/Go/Solidity).
├── src/                 # Docusaurus custom components, pages, styles, overrides.
├── static/              # Static assets (images, PDFs, OpenAPI specs).
├── CONTRIBUTING.md      # Contribution guidelines.
├── docusaurus.config.ts # Docusaurus site configuration.
└── sidebars.ts          # Sidebar structure.
```

## Development workflow

### Build and serve

Some features (for example, search and production-only behavior) only work correctly against a production build.

```bash
npm run build && npm run serve
```

- `build` outputs the static site to `build/`
- `serve` serves the built output locally

### Format

Run [Prettier](https://prettier.io/) for docs and site code:

```bash
npm run format
```

Language-specific examples use their native tooling:

- Go → `gofmt`
- Rust → `cargo fmt`
- Python → `ruff format` (and/or `ruff check` depending on the example)

> **Note:**
> Prettier support for MDXv3 is evolving ([tracking issue](https://github.com/prettier/prettier/issues/12209)).
> To skip formatting for a section:
>
> ```plaintext
> {/* prettier-ignore */}
> ```

### Run examples

The [`examples/`](examples/) directory contains language-specific projects.
Each subdirectory includes its own `README.md` with setup and run instructions.

**Supported languages:**

- Python
- JavaScript/TypeScript
- Rust
- Go

### Run automations

Automations update generated content used by tables/components (for example, contract addresses and feed metadata).
This will update `ftso_feeds.json` and `solidity_reference.json` in `src/features/DataTables/*`.

```bash
npm run automations
```

To update dependencies across the language example projects:

```bash
npm run update-deps
```

> **Caution:**
> After running update-deps, run the relevant example test/build steps to ensure nothing regressed.

### Generate Solidity documentation

The Solidity doc generator currently requires Node 18.

```bash
nvm use 18
cd docgen
chmod +x generate-solidity-docs.sh
./generate-solidity-docs.sh

# Return to the main site toolchain
cd ..
nvm use 22
```

This pulls the latest smart contracts and regenerates the Solidity reference docs.

## Contributing

We welcome contributions of all sizes - from typo fixes to major improvements.

1. Read [CONTRIBUTING.md](CONTRIBUTING.md).
2. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Make your changes and run the [Pre-PR checks](CONTRIBUTING.md#pre-pr-checks).
4. Push and open a PR following the [pull request guidelines](CONTRIBUTING.md#pull-request-guidelines).
