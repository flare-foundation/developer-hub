# Flare Developer Hub

This repository contains the source code and content for the [Flare Developer Hub](https://dev.flare.network) – the decentralized origin for Flare builders ☀️

This site is built with [Docusaurus](https://docusaurus.io/), a modern static site generator.

> **Note:**
> This README is for contributors to Developer Hub.  
> If you just want to read the docs, visit [dev.flare.network](https://dev.flare.network).

## 🚀 Getting Started

### Prerequisites

- [Node.js v20](https://nodejs.org/en/) with [nvm](https://github.com/nvm-sh/nvm).
- For language-specific [examples](examples/)
  - [uv](https://docs.astral.sh/uv/) for Python
  - [Cargo](https://doc.rust-lang.org/cargo/) for Rust
  - [go](https://go.dev/doc/install) for Go

### Installation

Clone, install dependencies and start the local development server:

```bash
git clone https://github.com/flare-foundation/developer-hub.git
cd developer-hub
npm install
npm run start
```

This launches the local development server with hot-reloading.
The site will open in your browser automatically.

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

### 🏗️ **Building for Production**

Search and some features only work in production.
You can test locally with:

```bash
npm run build && npm run serve
```

### ▶️ Running Code Examples

The [`examples/`](examples/) directory contains code snippets demonstrating how to interact with Flare protocols.
Each language subdirectory (`examples/developer-hub-*`) has its own `README.md` with setup instructions.

**Supported languages:**

- Python
- JavaScript/TypeScript
- Rust
- Go

### ✨ Formatting & Linting

Run [Prettier](https://prettier.io/) for docs and site code:

```bash
npm run format
```

Language-specific examples use their native formatters:

- Go → `gofmt` for Go
- Rust →`cargo fmt` for Rust
- Python → `ruff` for Python

> **Note:**
> Prettier support for MDXv3 is evolving ([tracking issue](https://github.com/prettier/prettier/issues/12209)).
> To skip formatting for a section:
>
> ```plaintext
> {/* prettier-ignore */}
> ```

### 📄 Generating Solidity documentation

To generate Solidity documentation:

1. **Switch to Node.js v18:**

   ```bash
   nvm use 18
   ```

2. **Run the Documentation Generator:**

   ```bash
   cd docgen && chmod +x generate-solidity-docs.sh
   ./generate-solidity-docs.sh
   ```

   This pulls the latest smart contracts and generates docs.

3. **Switch Back to Node.js v20:**

   ```bash
   nvm use 20
   ```

### 🔄 Running Automations

1. **Update addresses and feeds:**

   Fetches latest contract addresses from `ContractRegistry` and feed data for use in tables and components.

   ```bash
   npm run automations
   ```

2. **Update language dependencies:**

   Updates dependencies in all `examples/*` subdirectories.
   Use with caution, run all test suites after updating.

   ```bash
   npm run update-deps
   ```

## 🤝 Contributing

We welcome contributions of all sizes - from typo fixes to major feature additions.

1. Read the [CONTRIBUTING.md](CONTRIBUTING.md) guidelines.
2. Fork and create a feature branch:
   ```bash
   git checkout -b feature/my-change
   ```
3. Commit and push your changes, and open a PR.
