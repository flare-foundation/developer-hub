# developer-hub-javascript

## Prerequisites

- [Node v24 LTS](https://nodejs.org/en)
- [pnpm](https://pnpm.io/) (enable with `corepack enable pnpm`)

## Install dependencies

From the repo root (this package is part of the pnpm workspace):

```bash
pnpm install
```

## Format

```bash
pnpm --filter ./examples/developer-hub-javascript run format:fix
```

## Lint

```bash
pnpm --filter ./examples/developer-hub-javascript run lint:check
```

## Test

```bash
pnpm --filter ./examples/developer-hub-javascript run test
```
