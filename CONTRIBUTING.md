# Contributing Guidelines

We're excited you want to contribute and help improve the Flare Developer Hub. Your contributions make our documentation, tooling, and examples better for everyone.

## How You Can Contribute

We welcome contributions via:

- **[GitHub Issues](https://github.com/flare-foundation/developer-hub/issues):** Report bugs, suggest features, or ask questions.
- **Pull Requests (PRs):** Submit fixes, improvements, or new content (documentation, examples, site features).

## Development Workflow

1.  **Make Changes:** Edit or add documentation (`docs/`), source code (`src/`), examples (`examples/`), or automation scripts (`automations/`, `docgen/`) after forking and creating a new branch:

    ```bash
    git checkout -b feature/your-feature-name
    ```

2.  **Follow Style Guides:**

    - **Code/Docs:** Run `npm run format` to apply Prettier formatting. Match existing code style.
    - **Diagrams:** Adhere to the [Diagram Style Guide](#diagrams-style-guide) below for consistency.

3.  **Commit Your Changes:** We **require** the [Conventional Commits](https://www.conventionalcommits.org/) format for clear history and automated changelogs.

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

    **Example:**

    ```bash
    git commit -m "fix(ftso): correct feed ID example in getting started guide"
    git commit -m "feat(src): add copy button to code blocks"
    git commit -m "docs(fassets): clarify liquidation process diagram"
    ```

4.  **Push to Your Fork:**

    ```bash
    git push origin feature/your-feature-name
    ```

5.  **Open a Pull Request (PR):** Submit a PR against the `main` branch of the `flare-foundation/developer-hub` repository.

## Pull Request Guidelines

- ✅ **Keep PRs Small & Focused:** One logical change per PR.
- ✅ **Discuss Large Changes First:** Open an issue to discuss significant changes _before_ starting work.
- ✅ **Provide Context:** Clearly describe the problem and solution in your PR description. Link relevant issues.
- ✅ **Ensure Tests & CI Pass:** Fix any failures reported by GitHub Actions. Run tests locally if applicable (especially for `examples/`).
- ✅ **Update Documentation:** If your change affects functionality or usage, update relevant documentation.
- ✅ **Confirm Licensing:** By submitting a PR, you agree to license your contribution under the project's license.

## Diagrams Style Guide

For consistency, follow these styles when creating or updating diagrams:

| Element                  | Light Mode | Dark Mode | Notes                                              |
| :----------------------- | :--------- | :-------- | :------------------------------------------------- |
| Arrow Width              | `1px`      | `1px`     |                                                    |
| Arrow Color              | `#595959`  | `#ffffff` |                                                    |
| Border Width             | `1px`      | `1px`     |                                                    |
| Border Color (Highlight) | `#e62058`  | `#e62058` | Use for emphasis                                   |
| Border Color (Normal)    | `#595959`  | `#ffffff` | Default border                                     |
| Onchain Border Style     | `Solid`    | `Solid`   |                                                    |
| Offchain Border Style    | `Dashed`   | `Dashed`  | \_Use only if mixing onchain and offchain elements |

See the architecture diagram on the homepage as an [example](https://dev.flare.network/#understand-the-architecture).

## Need Help?

If you get stuck or have questions, feel free to ask in a [GitHub Issue](https://github.com/flare-foundation/developer-hub/issues).

**Thank you for contributing\!**
