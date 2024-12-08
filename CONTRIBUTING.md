# Contributing Guidelines  

We’re excited you want to contribute to the **Flare Developer Hub**! 🎉  

Please follow these guidelines to ensure a smooth and productive collaboration.

## 🤝  **How to Contribute**  

We welcome:  
- **Pull Requests (PRs)** for bug fixes, features, and documentation updates  
- **Bug Reports** for issues found  
- **Feature Requests** and suggestions

## 📝 **Commit Message Guidelines**  

Use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format for clear, structured commit messages:  

**Format:**  

```  
<type>(<scope>): <description>  
```  

**Examples:**  
- `fix(api): correct response status for invalid input`  
- `feat(docs): add section for new API usage`  

**Types:**  
- `feat`: New feature  
- `fix`: Bug fix  
- `docs`: Documentation updates  
- `chore`: Maintenance tasks  
- `test`: Adding or improving tests  
- `refactor`: Code improvements without feature changes  

## 🔄 **Submitting a Pull Request (PR)**  

**Important: All contributions will be licensed under the project’s license.**  

### **Best Practices**  

1. **Keep PRs Small and Focused**:  
   - Submit **one PR per feature or bug fix.**  
   - Avoid combining unrelated changes.  

2. **Discuss Large Changes First**:  
   - For significant features or major changes, [open an issue](https://github.com/flare-foundation/developer-hub/issues) to discuss it with maintainers **before** submitting a PR.  

3. **Follow the Code Style**:  
   - Match the existing code style and structure.  
   - Use the configured linter and formatter when applicable.  

4. **Ensure Tests Pass**:  
   - Run the test suite and address any **CI/CD pipeline failures.**  

5. **Handle Merge Conflicts Early**:  
   - If a merge conflict occurs, [resolve it](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/resolving-a-merge-conflict-on-github) promptly.  


## 🎨 **Diagrams Style Guide**  

When contributing diagrams, follow the established visual style:  

| **Element**             | **Light Mode** | **Dark Mode** |
|------------------------|----------------|---------------|
| **Border Width**        | 1px            | 1px           |
| **Border Color**        | `#E7125E`      | `#EF4A82`     |
| **Arrow Width**         | 1px            | 1px           |
| **Arrow Color**         | `#595959`      | `#FFFFFF`     |
| **Onchain Border Style** | Solid          | Solid         |
| **Offchain Border Style** | Dashed         | Dashed        |

**Tip:** Use the dashed style **only if** both onchain and offchain elements are displayed.

## 💡 **Contributing Workflow Summary**  

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

By following these guidelines, you’ll help maintain a high-quality, collaborative development environment. Thank you for contributing!