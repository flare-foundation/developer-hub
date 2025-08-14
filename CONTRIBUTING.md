# Contributing Guidelines

Thank you for helping improve **Flare Developer Hub**!
Your contributions make our documentation, tooling, and examples better for everyone.

We welcome:

- **[GitHub Issues](https://github.com/flare-foundation/developer-hub/issues):** Report bugs, suggest features, or ask questions.
- **[Pull Requests](https://github.com/flare-foundation/developer-hub/pulls):** Submit fixes, improvements, or new content (documentation, examples, site features).

## 🛠 Development Workflow

1.  **Fork and branch:** Fork the repo on GitHub and create a branch for your work:

    ```bash
    git checkout -b feature/your-feature-name
    ```

2.  **Make changes:** Edit or add:
    - Documentation (`docs/`)
    - Source code (`src/`)
    - Examples (`examples/`)
    - automation and docgen scripts (`automations/`, `docgen/`)

3.  **Follow Style Guides:**
    - **Code/Docs:** Run [Pre-PR checks](#pre-pr-checks). Match existing code style.
    - **Diagrams:** Adhere to the [Diagram Style Guide](#diagrams-style-guide) for consistency.

4.  **Commit Your Changes:** We require [Conventional Commits](https://www.conventionalcommits.org/) format for clear history and automated changelogs.

    **Format:** `<type>(<scope>): <description>`

    **Common Types:**

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

    **Examples:**

    ```bash
    git commit -m "fix(ftso): correct feed ID example in getting started guide"
    git commit -m "feat(src): add copy button to code blocks"
    git commit -m "docs(fassets): clarify liquidation process diagram"
    ```

5.  **Push and open a PR:**

    ```bash
    git push origin feature/your-feature-name
    ```

    Then open a PR against `main` in [flare-foundation/developer-hub](https://github.com/flare-foundation/developer-hub)

## 📋 Pull Request Guidelines

- ✅ **Small & Focused:** One logical change per PR.
- ✅ **Discuss Large Changes First:** Open an issue before starting.
- ✅ **Provide Context:** Describe the problem, solution, and link related issues.
- ✅ **Pass CI:** Fix any GitHub Actions failures before requesting review.
- ✅ **Update Docs:** If behavior or usage changes.
- ✅ **Confirm Licensing:** All PRs are submitted under this repo’s [license](LICENSE).

## <a id="pre-pr-checks"></a>🔍 Pre-PR Checks

Run these before submitting a PR:

1. **Build & check internal links:**

   ```bash
   npm run build
   ```

2. **Format, lint, and type-check:**

   ```bash
   npm run format && npm run lint && npm run typecheck
   ```

3. **Check external links** (requires [lychee](https://github.com/lycheeverse/lychee)):

   ```bash
   lychee --config lychee.toml .
   ```

4. **If you modified examples**, run their formatters and tests, see `examples/developer-hub-*/README.md` for more instructions.
   Example for Rust:

   ```bash
   cd examples/developer-hub-rust/
   cargo fmt -- --check # Format
   cargo clippy --bins -- -D warnings # Lint
   cargo build --bins --locked # Build
   chmod +x test.sh && ./test.sh # Test
   ```

## <a id="diagrams-style-guide"></a>🖼 Diagrams Style Guide

Follow these styles for consistency:

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

## 💬 Need Help?

If you get stuck or have questions, feel free to ask in a [GitHub Issue](https://github.com/flare-foundation/developer-hub/issues).

**Thank you for contributing\!**
