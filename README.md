# Flare Developer Hub

The decentralized origin for Flare builders ☀️.

This site is built with [Docusaurus](https://docusaurus.io/), a modern static site generator.

## 🚀 **Getting Started**

### Prerequisites

Ensure the following tools are installed:

- [Node.js v20](https://nodejs.org/en/)
- [nvm](https://github.com/nvm-sh/nvm) for managing multiple Node.js versions

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

## 🧑‍💻 **Code Examples**

Browse commonly used snippets in [developer-hub/examples/](examples/).

Supported languages:

- **Python**
- **JavaScript**
- **Rust**
- **Go**

## 🛠️ **Development Guidelines**

### Documentation Formatting

Ensure consistent formatting using [Prettier](https://prettier.io/):

```bash
npm run format
```

**Note**: Prettier support for MDXv3 is evolving ([tracking issue](https://github.com/prettier/prettier/issues/12209)). If needed, bypass Prettier by using:

```plaintext
{/* prettier-ignore */}
```

### Code Formatting

All code examples in [**examples/**](examples/) follow language-specific formatters.

## 🏗️ **Building for Production**

To create a production-ready build:

```bash
npm run build
```

The static files are generated in the `build` directory. To serve the production build locally:

```bash
npm run serve
```

**Tip**: Search only works in production builds.

## 📄 **Autogenerate Solidity Documentation**

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

## 🔄 **Automations**

A set of scripts that:

- Update contract addresses (from onchain `ContractRegistry`)
- Update feed risks (from `automations/*_risk.json`)

**Run all automations:**

1. Ensure [uv](https://docs.astral.sh/uv/) dependencies are synced:

   ```bash
   cd automations
   uv sync
   ```

2. Execute automations:

   ```bash
   npm run automations
   ```

## 🤝 **Contributing**

Contributions are welcome! Before your first PR, read the [**CONTRIBUTING.md**](CONTRIBUTING.md).
