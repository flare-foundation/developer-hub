# Flare Developer Hub

Source code for the [Flare Developer Hub](https://dev.flare.network), Flare's documentation site built with [Docusaurus](https://docusaurus.io/).

If you only want to read the docs, use https://dev.flare.network.

## Quick start

Prerequisites:

- [Node.js v22](https://nodejs.org/en/) and npm
- Optional: [nvm](https://github.com/nvm-sh/nvm) for Node version management

Install and run:

```bash
git clone https://github.com/flare-foundation/developer-hub.git
cd developer-hub
npm ci
npm run start
```

For production-like behavior:

```bash
npm run build
npm run serve
```

## Common scripts

- `npm run start`: local dev server with hot reload
- `npm run build`: production build into `build/`
- `npm run serve`: serve the production build locally
- `npm run format`: format docs and site code
- `npm run lint`: run eslint
- `npm run typecheck`: run TypeScript checks
- `npm run automations`: refresh generated data used by docs/components
- `npm run update-deps`: update dependencies across example projects

## Repository layout

- `docs/`: documentation content (`.md`/`.mdx`)
- `src/`: Docusaurus theme overrides, components, and styles
- `static/`: static assets
- `examples/`: language-specific example projects
- `automations/`: scripts and generated datasets
- `docgen/`: Solidity docs generation tooling

## Contributing

Contributor workflow, pre-PR checks, PR guidelines, diagram standards, and commit conventions are documented in [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).
