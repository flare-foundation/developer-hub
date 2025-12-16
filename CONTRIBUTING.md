# Contributing Guidelines

Thank you for contributing to **Flare Developer Hub**.
Contributions improve the documentation, tooling, and examples for the entire Flare developer community.

We welcome:

- [Issues](https://github.com/flare-foundation/developer-hub/issues): Report bugs, propose enhancements, or ask questions.
- [Pull Requests](https://github.com/flare-foundation/developer-hub/pulls): Fixes, improvements, and new content.

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

### Site checks

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

## <a id="diagrams-style-guide"></a> Diagrams style guide

Use these defaults to keep diagrams consistent in light/dark mode.

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

## Need Help?

If you get stuck or want feedback on an approach, open a [GitHub Issue](https://github.com/flare-foundation/developer-hub/issues).
