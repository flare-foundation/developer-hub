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

Note that `flare-smart-contracts-v2` uses `node 18` and `developer-hub` uses `node 20` (latest LTS). You can use `nvm` to switch between them.

```bash
nvm use 18
```

Execute the shell script to pull the smart contracts repo, generate the docs, and copy them to `developer-hub/docs/technical-reference/contracts`.

```bash
cd docgen
chmod +x generate-solidity-docs.sh
./generate-solidity-docs.sh
```

Once complete, you can switch node version back to the `developer-hub` project

```bash
nvm use 20
```

## Format

Formats all documents with Prettier.

Prettier support for MDXv3 is currently a WIP (see [this issue](https://github.com/prettier/prettier/issues/12209)), so add in `{/* prettier-ignore */}` wherever necessary.

```bash
npm run format
```

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

Note: Search will only function with a production build.

## How to contribute

1. Clone and Branch from main

    ```bash
    git clone https://github.com/flare-foundation/developer-hub.git
    git checkout -b <feature-branch-name>
    ```

2. Make your changes

3. Format and Build locally

    ```bash
    npm run format
    npm run build
    ```

4. Make sure your branch is up to date with main

    ```bash
    git pull origin main –-rebase –-autostash
    ```

5. Push your changes

    ```bash
    git push origin <feature-branch-name>
    ```

6. Open a Pull Request on GitHub
