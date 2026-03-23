# Contributing to MLTeX

Thanks for your interest in contributing. MLTeX is part of the [MathLumen](https://mathlumen.com) project.

## Before You Start

- Check [open issues](../../issues) to avoid duplicating work.
- For significant changes, open an issue first to discuss the approach.
- All contributions must keep MLTeX **fully client-side** — no backends, no API calls, no telemetry.

## Development Setup

**Requirements:** Node.js >= 20, pnpm >= 9

```bash
git clone https://github.com/mathlumen/mltex.git
cd mltex
pnpm install
pnpm dev          # → http://localhost:3000
```

The repo is a [Turborepo](https://turbo.build) monorepo:

```
apps/web/     ← Next.js 15 app (the editor)
packages/ui/  ← shared UI components
```

## Useful Commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build (all workspaces) |
| `pnpm type-check` | TypeScript strict check |
| `pnpm lint` | ESLint across all packages |

Run these from the **repo root**.

## Code Guidelines

- **TypeScript strict** — no `any`, no `// @ts-ignore`.
- **No new dependencies** without discussion. Keep the bundle lean.
- **Tailwind v4** — all styling via `@theme` tokens in `globals.css`. No inline styles for themeable values; use `var(--token)`.
- **Components are single-responsibility** — if a component exceeds ~150 lines, consider splitting.
- **Client-only code** must be guarded: check `typeof window !== "undefined"` or use `"use client"` + `dynamic(..., { ssr: false })`.
- No `console.log` left in submitted code.

## Pull Request Process

1. Fork the repo and create a branch: `git checkout -b feat/your-feature`.
2. Make your changes. Run `pnpm type-check` and `pnpm build` — both must pass.
3. Write a clear PR description: **what** changed and **why**.
4. Link any related issue with `Closes #<number>`.
5. A maintainer will review within a few days.

## Commit Style

Use [Conventional Commits](https://www.conventionalcommits.org):

```
feat: add vim keybinding toggle
fix: prevent setState during Preview render
docs: add contributing guide
chore: bump katex to 0.17
```

## Reporting Bugs

Use the [Bug Report](.github/ISSUE_TEMPLATE/bug_report.yml) template. Include:
- Browser + OS
- Steps to reproduce
- The LaTeX that triggered the issue (if applicable)

## Suggesting Features

Use the [Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml) template.
Proposals that add a backend dependency will not be accepted.

## License

By contributing, you agree your changes will be licensed under the [MIT License](LICENSE).
