# Flare Developer Hub

The decentralized origin for Flare builders ☀️.

This website is built using [Docusaurus](https://docusaurus.io/), a modern static site generator.

## Code Examples

[developer-hub/examples](examples/) contains commonly used code snippets for Python, Javascript, Rust and Go.

## Getting Started

Ensure you have the following tools installed:

- [Node.js v20](https://nodejs.org/en/)
- [nvm](https://github.com/nvm-sh/nvm) for managing multiple Node.js versions

Once you have Node.js v20 installed, you can set up the project dependencies:

```bash
npm install
```

To start the local development server:

```bash
npm run start
```

This command will launch a development server and automatically open your default browser. Most changes you make in the project will be reflected live, without the need to restart the server.

## Formatting

### Docs formatting

To ensure consistency across the project, you should format all docs using [Prettier](https://prettier.io/):

```bash
npm run format
```

**Important**: Prettier support for MDXv3 is still a work in progress (see [this issue](https://github.com/prettier/prettier/issues/12209)). If necessary, you can manually exclude sections from Prettier by adding `{/* prettier-ignore */}` in your code.

### Code formatting

All [developer-hub/examples](examples/) code snippets use language-specific formatting tools.

## Building the Project

To create a production build of the Flare Developer Hub:

```bash
npm run build
```

This will generate static content and place it in the `build` directory.

**Note**: The search functionality will only work with a production build, so make sure to test it using a production environment.

## Autogenerate Solidity Documentation

To generate the Solidity contract documentation from the `flare-smart-contracts-v2` repository:

1. **Switch Node.js Version**:  
   The `flare-smart-contracts-v2` project requires Node.js v18, while the `developer-hub` requires Node.js v20. Use `nvm` to switch between versions:

   ```bash
   nvm use 18
   ```

2. **Run the Documentation Generation Script**:  
   Navigate to the `docgen` folder, make the script executable, and run it:

   ```bash
   cd docgen
   chmod +x generate-solidity-docs.sh
   ./generate-solidity-docs.sh
   ```

   This will pull the latest smart contracts and generate the documentation.

3. **Switch Back to Node.js v20**:  
   After generating the Solidity documentation, switch back to Node.js v20 for `developer-hub`:

   ```bash
   nvm use 20
   ```

## Run Automations

To ensure [uv](https://docs.astral.sh/uv/) dependencies are synced, from within `automations/` run:

```bash
uv sync
```

To update contract addresses and FTSOv2 feed data, in the project root run:

```bash
npm run automations
```

## Contributing

Contributions to Flare Developer Hub are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before making your first PR.
