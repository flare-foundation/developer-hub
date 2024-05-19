# Flare Developer Hub

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Prerequisites

- [Node v20](https://nodejs.org/en/)

## Installation

```bash
npm install
```

## Local development

```bash
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Autogenerate Solidity docs

In the root directory of `developer-hub`

```bash
git clone --depth 1 https://github.com/flare-foundation/flare-smart-contracts-v2
cd flare-smart-contracts-v2
```

If there is a difference in node versions between the two projects, you can use `nvm` to switch between them.  `flare-smart-contracts-v2` uses `node 18` and `developer-hub` uses `node 20`.

```bash
nvm use 18
````

Compile the contracts

```bash
yarn
yarn add solidity-docgen
```

Add to `flare-smart-contracts-v2/hardhat.config.ts`

```typescript
import 'solidity-docgen';

export default {
  ...
  docgen: {
    pages: "files",
    templates: "../handlebar_templates"
  },
};
```

Generate the docs

```bash
yarn hardhat docgen
```

Copy the relevant generated `.md` files from `flare-smart-contracts-v2/docs` to `developer-hub/docs/technical-reference/`.

Once complete, you can switch node version back to the `developer-hub` project

```bash
nvm use 20
```

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Format

```bash
npm run format
```
