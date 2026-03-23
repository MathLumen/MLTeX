"use client";

import { useState, useRef } from "react";

interface ToolbarProps {
  onInsert: (snippet: string) => void;
  onCopyLatex: () => void;
  onCopyPng: () => void;
  onShareLink: () => void;
  onNewDocument: () => void;
}

interface SnippetButton {
  label: string;
  title: string;
  snippet: string;
}

const SNIPPETS: SnippetButton[] = [
  { label: "a/b", title: "Fraction", snippet: "\\frac{a}{b}" },
  { label: "√x", title: "Square root", snippet: "\\sqrt{x}" },
  { label: "∫", title: "Integral", snippet: "\\int_{a}^{b} f(x) \\, dx" },
  { label: "∑", title: "Sum", snippet: "\\sum_{i=0}^{n} x_i" },
  { label: "lim", title: "Limit", snippet: "\\lim_{x \\to \\infty}" },
  { label: "∂", title: "Partial derivative", snippet: "\\frac{\\partial f}{\\partial x}" },
  {
    label: "[]",
    title: "Matrix (2×2)",
    snippet:
      "\\begin{pmatrix}\na & b \\\\\nc & d\n\\end{pmatrix}",
  },
  {
    label: "≡",
    title: "Aligned equations",
    snippet:
      "\\begin{aligned}\nf(x) &= x^2 \\\\\ng(x) &= x^3\n\\end{aligned}",
  },
];

const GREEK_LETTERS = [
  { label: "α", snippet: "\\alpha" },
  { label: "β", snippet: "\\beta" },
  { label: "γ", snippet: "\\gamma" },
  { label: "δ", snippet: "\\delta" },
  { label: "ε", snippet: "\\epsilon" },
  { label: "θ", snippet: "\\theta" },
  { label: "λ", snippet: "\\lambda" },
  { label: "μ", snippet: "\\mu" },
  { label: "π", snippet: "\\pi" },
  { label: "σ", snippet: "\\sigma" },
  { label: "φ", snippet: "\\varphi" },
  { label: "ω", snippet: "\\omega" },
  { label: "Γ", snippet: "\\Gamma" },
  { label: "Δ", snippet: "\\Delta" },
  { label: "Σ", snippet: "\\Sigma" },
  { label: "Ω", snippet: "\\Omega" },
];

function Tooltip({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="relative group inline-flex">
      {children}
      <span
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
        style={{
          background: "#222",
          color: "#f0f0f0",
          border: "1px solid #333",
          fontFamily: "IBM Plex Mono, monospace",
        }}
      >
        {title}
      </span>
    </div>
  );
}

function ToolbarBtn({
  onClick,
  title,
  children,
  variant = "default",
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  variant?: "default" | "accent" | "danger";
}) {
  const base = "h-8 px-3 rounded text-xs font-medium transition-all duration-150 cursor-pointer border select-none flex items-center gap-1.5 font-mono";
  const variants = {
    default:
      "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] bg-transparent",
    accent:
      "border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] bg-transparent",
    danger:
      "border-[var(--border)] text-[var(--text-secondary)] hover:text-red-400 hover:border-red-400 bg-transparent",
  };

  return (
    <Tooltip title={title}>
      <button className={`${base} ${variants[variant]}`} onClick={onClick}>
        {children}
      </button>
    </Tooltip>
  );
}

export default function Toolbar({
  onInsert,
  onCopyLatex,
  onCopyPng,
  onShareLink,
  onNewDocument,
}: ToolbarProps) {
  const [greekOpen, setGreekOpen] = useState(false);
  const greekRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex items-center gap-1 px-3 overflow-x-auto"
      style={{
        height: "42px",
        background: "var(--bg-tertiary)",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
        scrollbarWidth: "none",
      }}
    >
      {/* Brand */}
      <span
        className="mr-3 text-sm font-bold select-none shrink-0"
        style={{ color: "var(--accent)", letterSpacing: "0.05em" }}
      >
        MLTeX
      </span>

      {/* Divider */}
      <div className="w-px h-5 shrink-0" style={{ background: "var(--border)" }} />

      {/* Snippet buttons */}
      <div className="flex items-center gap-1">
        {SNIPPETS.map((s) => (
          <ToolbarBtn key={s.label} onClick={() => onInsert(s.snippet)} title={s.title}>
            {s.label}
          </ToolbarBtn>
        ))}

        {/* Greek letters dropdown */}
        <div className="relative" ref={greekRef}>
          <ToolbarBtn
            onClick={() => setGreekOpen((v) => !v)}
            title="Greek letters"
          >
            Ω ▾
          </ToolbarBtn>
          {greekOpen && (
            <div
              className="absolute top-full left-0 mt-1 z-50 rounded p-2 grid gap-1"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                minWidth: "160px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
              onMouseLeave={() => setGreekOpen(false)}
            >
              {GREEK_LETTERS.map((g) => (
                <button
                  key={g.snippet}
                  className="h-8 w-8 rounded text-sm flex items-center justify-center cursor-pointer transition-all"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    fontFamily: "serif",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                  }}
                  onClick={() => {
                    onInsert(g.snippet);
                    setGreekOpen(false);
                  }}
                  title={g.snippet}
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-5 mx-1 shrink-0" style={{ background: "var(--border)" }} />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <ToolbarBtn onClick={onCopyLatex} title="Copy LaTeX source" variant="default">
          Copy LaTeX
        </ToolbarBtn>
        <ToolbarBtn onClick={onCopyPng} title="Copy preview as PNG" variant="default">
          Copy PNG
        </ToolbarBtn>
        <ToolbarBtn onClick={onShareLink} title="Copy shareable link" variant="accent">
          Share
        </ToolbarBtn>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* New doc */}
      <ToolbarBtn onClick={onNewDocument} title="New document (clears editor)" variant="danger">
        New
      </ToolbarBtn>
    </div>
  );
}
