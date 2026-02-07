# Contributing Guidelines

Thank you for contributing to **Flare Developer Hub**.
Contributions improve the documentation, tooling, and examples for the entire Flare developer community.

We welcome:

- [Issues](https://github.com/flare-foundation/developer-hub/issues): Report bugs, propose enhancements, or ask questions.
- [Pull Requests](https://github.com/flare-foundation/developer-hub/pulls): Fixes, improvements, and new content.

## Prerequisites

- [Node.js v22](https://nodejs.org/en/) and npm
- Recommended: [nvm](https://github.com/nvm-sh/nvm) to switch Node versions
- Optional (if editing `examples/`):
  - Python examples: [uv](https://docs.astral.sh/uv/)
  - Rust examples: [Cargo](https://doc.rust-lang.org/cargo/)
  - Go examples: [go](https://go.dev/doc/install)

## Development workflow

1.  **Fork and branch:** Create a branch that describes the change:

    ```bash
    git checkout -b feat/your-feature-name
    ```

    Suggested prefixes:
    - `docs/…` for documentation-only work
    - `feat/…` for new functionality
    - `fix/…` for bug fixes
    - `chore/…` for maintenance (deps, refactors, tooling)

2.  **Make changes:** Edit or add:
    - Documentation: `docs/`
    - Source code: `src/`
    - Examples: `examples/`
    - Automation scripts: `automations/`
    - Solidity doc generation: `docgen/`

    When editing docs, prefer small, reviewable diffs and reuse existing patterns (MDX components, admonitions, callouts, etc.).

3.  **Follow project style:**
    - Match existing TypeScript/React and MDX style conventions.
    - Run the checks in [Pre-PR checks](#pre-pr-checks).
    - For diagrams, follow the [Diagram Style Guide](#diagrams-style-guide) below.

4.  **Commit using Conventional Commits:** We require [Conventional Commits](https://www.conventionalcommits.org/) format for a clear history and automation-friendly changelogs.

    Format: `<type>(<scope>): <description>`

    Common types:

    | Type       | Description                               |
    | :--------- | :---------------------------------------- |
    | `feat`     | New feature                               |
    | `fix`      | Bug fix                                   |
    | `docs`     | Documentation updates                     |
    | `chore`    | Maintenance tasks (build, deps)           |
    | `test`     | Adding or improving tests                 |
    | `refactor` | Code improvements without feature changes |
    | `style`    | Formatting changes (whitespace, etc.)     |
    | `ci`       | CI pipeline changes                       |

    Examples:

    ```bash
    git commit -m "fix(ftso): correct feed ID example in getting started guide"
    git commit -m "feat(ui): add copy button to code blocks"
    git commit -m "docs(fassets): clarify liquidation process diagram"
    ```

5.  **Push and open a PR:**

    ```bash
    git push origin feat/your-feature-name
    ```

    Then open a PR against `main` in [flare-foundation/developer-hub](https://github.com/flare-foundation/developer-hub)

## <a id="pull-request-guidelines"></a> Pull request guidelines

- [ ] **Keep PRs focused:** one logical change per PR.
- [ ] **Discuss large changes first:** especially for docs structure and shared components.
- [ ] **Ensure CI passes:** address any GitHub Actions failures before requesting review.
- [ ] **Update docs:** if behavior, configuration, or user-facing flows change.
- [ ] **License:** by submitting a PR, you agree your contribution is provided under this repo’s [license](LICENSE).

## <a id="pre-pr-checks"></a> Pre-PR checks

Run these locally before submitting a PR.

1. **Build (includes internal link validation)**

   ```bash
   npm run build
   ```

2. **Format, lint, and type-check**

   ```bash
   npm run format
   npm run lint
   npm run typecheck
   ```

3. **External link checking (optional but recommended)**

   If you have [lychee](https://github.com/lycheeverse/lychee) installed:

   ```bash
   lychee --config lychee.toml .
   ```

4. **Examples (only if modified)**

   Each example project is self-contained; follow the instructions in the relevant `examples/developer-hub-*/README.md`.

   Rust example (illustrative):

   ```bash
   cd examples/developer-hub-rust/
   cargo fmt -- --check
   cargo clippy --bins -- -D warnings
   cargo build --bins --locked
   chmod +x test.sh && ./test.sh
   ```

5. **Automations (only if related files changed)**

   Run this if your change depends on refreshed generated datasets (for example, feeds or contract reference data):

   ```bash
   npm run automations
   ```

6. **Solidity docs regeneration (only if `docgen/` or Solidity refs changed)**

   The Solidity docs pipeline currently uses Node 18:

   ```bash
   nvm use 18
   cd docgen
   chmod +x generate-solidity-docs.sh
   ./generate-solidity-docs.sh
   cd ..
   nvm use 22
   ```

## <a id="diagrams-style-guide"></a> Diagrams style guide

Use these defaults to keep diagrams consistent across light and dark mode.

| Element                  | Light Mode | Dark Mode | Notes                                            |
| :----------------------- | :--------- | :-------- | :----------------------------------------------- |
| Arrow Width              | `1px`      | `1px`     |                                                  |
| Arrow Color              | `#595959`  | `#ffffff` |                                                  |
| Border Width             | `1px`      | `1px`     |                                                  |
| Border Color (Highlight) | `#e62058`  | `#e62058` | Use for emphasis                                 |
| Border Color (Normal)    | `#595959`  | `#ffffff` | Default border                                   |
| Onchain Border Style     | `Solid`    | `Solid`   |                                                  |
| Offchain Border Style    | `Dashed`   | `Dashed`  | Use only if mixing onchain and offchain elements |

See the [homepage architecture diagram](https://dev.flare.network/#understand-the-architecture) for an example.

### Diagram location

- Store all static assets under `static/img/`.
- **Documentation assets** that belong to a specific docs area (for example `network`, `ftso`, `fdc`) must live under `static/img/docs/<area>/`.
- **Shared site assets** (used across the UI such as menu icons, logos, and general UI graphics) must live under `static/img/ui/`.
- **Social icons** must live under `static/img/social-icons/`.

Directory layout:

```plaintext
static/img
├── docs
│   ├── fassets
│   ├── fdc
│   ├── ftso
│   ├── network
│   ├── run-node
│   ├── smart-accounts
│   └── support
├── social-icons
└── ui
```

### Diagram naming convention

- Use kebab-case for new files and folders.
- Theme variants must use dot suffixes:
  - Light: `*.light.svg`
  - Dark: `*.dark.svg`

Example:

```plaintext
ftso-architecture.light.svg
ftso-architecture.dark.svg
```

## Need Help?

If you get stuck or want feedback on an approach, open a [GitHub Issue](https://github.com/flare-foundation/developer-hub/issues).
