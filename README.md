<div align="center">
  <img src="apps/web/app/icon.svg" width="88" height="88" alt="MLTeX logo" />
  <h1>MLTeX</h1>
  <p>
    Developed by <a href="https://mathlumen.com"><strong>MathLumen</strong></a>
  </p>

![Next.js](https://img.shields.io/badge/Next.js_15-black?logo=next.js&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_v4-38BDF8?logo=tailwindcss&logoColor=white)
![KaTeX](https://img.shields.io/badge/KaTeX-008080?logo=latex&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?logo=typescript&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?logo=turborepo&logoColor=white)

</div>

**MLTeX** is a fast, privacy-first, client-side LaTeX editor with live KaTeX preview. No servers, no sign-up — your math stays in your browser.

---

## Screenshot

> *(screenshot placeholder — add `public/screenshot.png` after first run)*

---

## Features

- **Split-pane editor** — CodeMirror 6 on the left, live KaTeX preview on the right
- **Real-time rendering** — debounced (250ms) with graceful error display
- **LaTeX syntax highlighting** — powered by CodeMirror's legacy stex mode
- **Rich toolbar** — fractions, roots, integrals, sums, matrices, align environments, Greek letters dropdown
- **Export**
  - Copy LaTeX source to clipboard
  - Copy preview as PNG (via `dom-to-image-more`)
  - Share via URL (base64-encoded query param)
- **Auto-save** — persists to `localStorage` on every change
- **Dark / light mode** — toggle via `next-themes`, persisted in `localStorage`
- **Keyboard shortcut** — `Ctrl+\` cycles split / editor-only / preview-only views
- **Framer Motion** — subtle fade+scale animation on preview re-render
- **Status bar** — character count, render time (ms), KaTeX attribution
- **Fully client-side** — zero backend, zero API calls

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 + TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Editor | CodeMirror 6 |
| Math | KaTeX |
| Animations | Framer Motion |
| Theme | next-themes |
| Monorepo | Turborepo + pnpm workspaces |

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9

```bash
npm install -g pnpm
```

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
pnpm build
```

Turborepo caches build outputs — incremental builds are fast.

---

## Project Structure

```
mltex/
├── apps/
│   └── web/                  # Next.js 15 app
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── globals.css   # Tailwind v4 + custom design tokens
│       ├── components/
│       │   ├── Workspace.tsx # Main split-pane orchestrator
│       │   ├── Editor.tsx    # CodeMirror 6 editor
│       │   ├── Preview.tsx   # KaTeX live preview
│       │   ├── Toolbar.tsx   # Snippet buttons + export actions
│       │   ├── ThemeToggle.tsx
│       │   └── StatusBar.tsx
│       ├── lib/
│       │   ├── katex-renderer.ts  # Robust $...$ / $$...$$ parser
│       │   └── url-encoder.ts     # Base64 URL share encoding
│       └── hooks/
│           └── useDebounce.ts
├── packages/
│   └── ui/                   # Shared UI components (stub)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Deploy

### Vercel (one-click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set the **Root Directory** to `apps/web` when prompted, or configure `vercel.json`:

```json
{
  "buildCommand": "cd ../.. && pnpm build --filter=@mltex/web",
  "outputDirectory": "apps/web/.next"
}
```

---

## License

MIT

---

*Part of [MathLumen](https://mathlumen.com) — making mathematics accessible.*
