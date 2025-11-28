# commit-beautifier

An interactive CLI tool that helps developers write structured, validated **Conventional Commit** messages with minimal effort.

## Overview

`commit-beautifier` simplifies the process of creating well-formatted commit messages that follow the Conventional Commits specification. It provides an interactive prompt-based interface with built-in validation, scope management, and automatic ticket ID detection from branch names.

## Features

✨ **Interactive Prompts** — Guided step-by-step commit creation with smart defaults  
✅ **Validation** — Enforces Conventional Commits format with configurable rules  
🎯 **Commit Types** — Supports 11 standard commit types (feat, fix, refactor, chore, docs, test, style, perf, build, ci, hotfix)  
🏷️ **Scope Support** — Optional scopes for better code organization  
🎫 **Auto-Detect Tickets** — Automatically extracts ticket IDs from branch names (e.g., ABC-123)  
📝 **Flexible Input** — Works with flags for automation or full interactive mode  
🔒 **Safe Commits** — Uses temporary files for secure message handling  
⚡ **Non-Interactive Mode** — Supports fully automated workflows with `--yes` flag

## Installation

Ensure you have **Node.js 18+** installed.

```bash
# Clone or download the repository
git clone <your-repo-ssh-url>
cd commit-beautifier

# Install dependencies
npm install

# Optionally link the CLI globally (or use npm install -g)
npm link
```

## Usage

### Basic Interactive Mode

```bash
commit-beautifier --dry-run
```

**dry-run** allows you to not commit the things directly just like a test or sample referenced

This launches an interactive prompt where you select:
1. **Type** — Choose from predefined commit types
2. **Summary** — Write a short description (max 72 chars)
3. **Body** — Add optional detailed description
4. **Ticket** — Add optional ticket ID (or auto-detected from branch)

### Non-Interactive Mode (with flags)

```bash
commit-beautifier \
  --type feat \
  --summary "Add user authentication" \
  --ticket ABC-123 \
  --body "Implements JWT-based authentication with refresh tokens" \
  --apply
```

### Dry Run (preview only)

```bash
commit-beautifier --type fix --summary "Fix memory leak" --yes --dry-run
```

Shows the formatted message without committing.

### Apply Commit

```bash
git add .
commit-beautifier --apply
```

Creates the commit with staged changes. If `--yes` is used, skips the confirmation prompt.

## Options

| Option | Description | Example |
|--------|-------------|---------|
| `--type <type>` | Commit type (feat, fix, refactor, etc.) | `--type feat` |
| `--summary <summary>` | Short description (1-72 chars) | `--summary "Add login page"` |
| `--body <body>` | Longer description (optional) | `--body "Detailed explanation"` |
| `--ticket <ticket>` | Ticket/Issue ID | `--ticket ABC-123` |
| `--apply` | Execute the commit (requires staged changes) | `--apply` |
| `--yes` | Skip confirmation prompts (auto-confirm) | `--yes` |

## Commit Types

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | A new feature | `feat: Add dark mode toggle` |
| `fix` | A bug fix | `fix: Resolve null pointer exception` |
| `refactor` | Code refactoring (no feature/fix) | `refactor: Extract utility functions` |
| `chore` | Build process or tooling | `chore: Update dependencies` |
| `docs` | Documentation changes | `docs: Update API reference` |
| `test` | Adding or updating tests | `test: Add integration tests` |
| `style` | Code formatting (no logic change) | `style: Format code with Prettier` |
| `perf` | Performance improvements | `perf: Optimize database queries` |
| `build` | Build system changes | `build: Add webpack config` |
| `ci` | CI/CD pipeline changes | `ci: Add GitHub Actions workflow` |
| `hotfix` | Quick critical production fix | `hotfix: Patch security vulnerability` |

## Examples

### Example 1: Feature with scope and ticket

```bash
commit-beautifier
# Select: feat
# Summary: Add OAuth2 integration
# Body: Implemented OAuth2 provider support for Google and GitHub
# Ticket: AUTH-42
# Apply: Yes
```

**Output:**
```
feat: Add OAuth2 integration

Implemented OAuth2 provider support for Google and GitHub

Refs: AUTH-42
```

### Example 2: Bug fix with auto-detected ticket

On branch `PROJ-789-fix-login-bug`:

```bash
commit-beautifier
# Select: fix
# Summary: Fix login redirect issue
# Auto-detects ticket: PROJ-789
# Apply: Yes
```

**Output:**
```
fix: Fix login redirect issue

Refs: PROJ-789
```

### Example 3: Fully automated

```bash
commit-beautifier \
  --type docs \
  --summary "Update installation guide" \
  --yes \
  --apply
```

## Configuration

Currently, `commit-beautifier` uses hardcoded values:
- **Allowed types** — Defined in `lib/validator.js`
- **Max summary length** — 72 characters (Conventional Commits standard)
- **Line wrap width** — 72 characters for body text

Future versions may support `.commit-beautifierrc` config files.

## Architecture

```
bin/
  └── commit-beautifier.js     # CLI entry point
lib/
  ├── prompts.js               # Interactive prompts (inquirer)
  ├── validator.js             # Message validation & formatting
  └── git.js                   # Git operations (execa)
```

## Development

### Run locally

```bash
npm start
```

### Dependencies

- **commander** — CLI argument parsing
- **inquirer** — Interactive prompts
- **execa** — Shell command execution
- **chalk** — Colored terminal output

## Requirements

- **Node.js** >= 18
- **Git** (obviously!)
- Staged changes to commit (when using `--apply`)