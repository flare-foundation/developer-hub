# Contributing Guidelines

We’re excited you want to contribute to the **Flare Developer Hub**! 🎉  
Your contributions help make our documentation, tooling, and examples even better.

**Note:** Our repository is organized into several top-level directories to keep concerns separated:

> - **docs/** – The main documentation source split into subdirectories by topic (fassets, fdc, ftso, etc.).
> - **src/** – The core source code (React components, pages, and theme files).
> - **examples/** – Language-specific examples (Go, JavaScript, Python, Rust, Solidity).
> - **automations/** & **docgen/** – Auxiliary scripts and tools to automate documentation tasks.
> - **static/** – Static assets (images, fonts, openapi specs, etc.).
> - **.github/** – Issue templates, workflows, and repository management files.

## 🤝 How to Contribute

We welcome contributions in several forms:

- **Pull Requests (PRs)** for bug fixes, features, and documentation updates.
- **Bug Reports** for issues you encounter.
- **Feature Requests** and suggestions to improve the project.

### Contributing Workflow Summary

1. **Fork the Repository** and create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Commit Changes** using the Conventional Commit format:

   ```bash
   git commit -m "feat(api): add support for new endpoints"
   ```

3. **Push the Branch** to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request (PR)** on the main repository.

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format for clear and structured commit messages:

**Format:**

```
<type>(<scope>): <description>
```

**Examples:**

- `fix(api): correct response status for invalid input`
- `feat(docs): add section for new API usage`

**Types:**

| Type       | Description                               |
| ---------- | ----------------------------------------- |
| `feat`     | New feature                               |
| `fix`      | Bug fix                                   |
| `docs`     | Documentation updates                     |
| `chore`    | Maintenance tasks                         |
| `test`     | Adding or improving tests                 |
| `refactor` | Code improvements without feature changes |
| `ci`       | CI pipeline changes                       |

**Additional Notes:**

- **Scope:** Indicates the area of the project affected (e.g., `api`, `docs`, `frontend`, `examples`).
- Keep commit messages concise yet descriptive.

## 🔄 Submitting a Pull Request (PR)

**Important:** All contributions will be licensed under the project’s license.

### Best Practices

1. **Keep PRs Small and Focused:**

   - Submit **one PR per feature or bug fix**.
   - Avoid mixing unrelated changes in a single PR.

2. **Discuss Large Changes First:**

   - For significant features or major changes, [open an issue](https://github.com/flare-foundation/developer-hub/issues) to discuss the idea with maintainers **before** submitting a PR.

3. **Follow the Repository Structure:**

   - Review the organization of the repository before starting your work. If you’re adding new scripts or reorganizing documentation, consider whether they belong under `automations/`, `docgen/`, or a new subfolder in `docs/`.

4. **Adhere to the Code Style:**

   - Match the existing code style and structure in your contributions.
   - Use the configured linter and formatter to ensure consistency.

5. **Ensure Tests Pass:**

   - Run the test suite locally (for language-specific examples and source code) and address any **CI/CD pipeline failures**.
   - If you add tests or update examples, follow the testing conventions used in each example folder.

6. **Resolve Merge Conflicts Promptly:**

   - If a merge conflict occurs, resolve it as soon as possible.
   - [Learn more about resolving merge conflicts](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/resolving-a-merge-conflict-on-github).

## 🎨 Diagrams Style Guide

When contributing diagrams, follow our established visual style:

| **Element**                  | **Light Mode** | **Dark Mode** |
| ---------------------------- | -------------- | ------------- |
| **Arrow Width**              | 1px            | 1px           |
| **Arrow Color**              | `#595959`      | `#FFFFFF`     |
| **Border Width**             | 1px            | 1px           |
| **Border Color (Highlight)** | `#E7125E`      | `#EF4A82`     |
| **Border Color (Normal)**    | `#595959`      | `#FFFFFF`     |
| **Onchain Border Style**     | Solid          | Solid         |
| **Offchain Border Style**    | Dashed         | Dashed        |

**Tip:** Use the dashed style **only if** both onchain and offchain elements are displayed.

## Additional Guidelines

- **Repository Structure Documentation:** If you’re unsure where your changes should live (e.g., new tooling scripts, docs updates, examples), refer to the repo structure overview above or ask in an issue.
- **Communication:** If you have questions or need guidance, don’t hesitate to reach out via an issue or our community channels.
- **Stay Updated:** Occasionally, our guidelines might change. Ensure you’re reviewing the latest version of this document before starting your work.

By following these guidelines, you help maintain a high-quality, organized, and collaborative development environment. Thank you for contributing to the Flare Developer Hub!
