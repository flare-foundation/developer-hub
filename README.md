# Flare Developer Hub

This repository contains the source code and content for the [Flare Developer Hub](https://dev.flare.network) – the decentralized origin for Flare builders ☀️

This site is built with [Docusaurus](https://docusaurus.io/), a modern static site generator.

## 🚀 Getting Started

Follow these steps to set up a local development environment for previewing changes or contributing.

### Prerequisites

- [Node.js v20](https://nodejs.org/en/) with [nvm](https://github.com/nvm-sh/nvm).
- [uv](https://docs.astral.sh/uv/), [Cargo](https://doc.rust-lang.org/cargo/) and [go](https://go.dev/doc/install) for language specific development.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/flare-foundation/developer-hub.git
   cd developer-hub
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the local development server:

   ```bash
   npm run start
   ```

   This launches the development server and automatically opens your default browser. Live reloading ensures changes appear instantly.

## 📂 Repo Structure

```plaintext
flare-foundation/developer-hub/
├── .github/         # GitHub Actions workflows, issue templates, etc.
├── automations/     # Scripts & data for automating content updates (feeds, tables).
├── docgen/          # Tools for auto-generating Solidity documentation.
├── docs/            # The core documentation content in Markdown (.mdx).
├── examples/        # Code examples in various languages (Python, JS, Rust, Go, Solidity).
├── src/             # Docusaurus site source: custom components, pages, CSS, theme overrides.
├── static/          # Static assets (images, PDFs, OpenAPI specs) served directly.
├── CONTRIBUTING.md  # Guidelines for contributors.
├── docusaurus.config.ts # Main Docusaurus site configuration.
└── sidebars.ts      # Defines the structure of the documentation sidebar.
```

## 🧑‍💻 Development Workflow

Common tasks when developing or contributing content.

### ▶️ Running Code Examples

The [`examples/`](examples/) directory contains code snippets demonstrating how to interact with Flare protocols.
Each language subdirectory often has its own `README.md` with setup instructions.

**Supported languages:**

- Python
- JavaScript/TypeScript
- Rust
- Go

### ✨ Formatting Code & Documentation

Ensure consistent formatting using [Prettier](https://prettier.io/):

```bash
npm run format
```

**Note**: Prettier support for MDXv3 is evolving ([tracking issue](https://github.com/prettier/prettier/issues/12209)). If needed, bypass Prettier by using:

```plaintext
{/* prettier-ignore */}
```

Code examples within the `examples/` directory follow language-specific formatting standards:

- `gofmt` for Go
- `cargo fmt` for Rust
- `ruff` for Python

### 📄 Generating Solidity documentation

To generate Solidity documentation:

1. **Switch to Node.js v18:**

   ```bash
   nvm use 18
   ```

2. **Run the Documentation Generator:**

   ```bash
   cd docgen
   chmod +x generate-solidity-docs.sh
   ./generate-solidity-docs.sh
   ```

   This pulls the latest smart contracts and generates docs.

3. **Switch Back to Node.js v20:**

   ```bash
   nvm use 20
   ```

### 🔄 Running Automations

1. **Update addresses and feeds:**

   This script updates JSON files used by custom components (e.g., feed tables, contract address lists) by fetching data from the `ContractRegistry` on-chain and referencing risk data defined in `automations/*_risk.json`.

   ```bash
   npm run automations
   ```

2. **Update language dependencies:**

   This script runs package manager updates within the various language subdirectories under `examples/` to refresh their dependencies.

   ```bash
   npm run update-deps
   ```

## 🏗️ **Building for Production**

To create a production-ready build:

```bash
npm run build
```

The static files are generated in the `build` directory. To serve the production build locally:

```bash
npm run serve
```

**Note**: Search only works in production builds.

## 🤝 Contributing

Contributions are highly welcome! Whether it's fixing a typo, improving documentation clarity, adding new examples, or enhancing the site itself, your help is appreciated.
Before your first PR, read the [CONTRIBUTING.md](CONTRIBUTING.md).
