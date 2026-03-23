"use client";

import ThemeToggle from "./ThemeToggle";

interface StatusBarProps {
  charCount: number;
  renderTimeMs: number;
  viewMode: "split" | "editor" | "preview";
  onViewModeChange: (mode: "split" | "editor" | "preview") => void;
  toastMessage: string | null;
}

export default function StatusBar({
  charCount,
  renderTimeMs,
  viewMode,
  onViewModeChange,
  toastMessage,
}: StatusBarProps) {
  const modes: Array<{ key: "split" | "editor" | "preview"; label: string }> = [
    { key: "split", label: "Split" },
    { key: "editor", label: "Editor" },
    { key: "preview", label: "Preview" },
  ];

  return (
    <div
      className="flex items-center px-3 gap-3 text-xs select-none shrink-0"
      style={{
        height: "28px",
        background: "var(--bg-tertiary)",
        borderTop: "1px solid var(--border)",
        fontFamily: "IBM Plex Mono, monospace",
        color: "var(--text-secondary)",
      }}
    >
      {/* View mode switcher */}
      <div className="flex items-center gap-0.5">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => onViewModeChange(m.key)}
            className="px-2 h-5 rounded text-xs cursor-pointer transition-all"
            style={{
              background: viewMode === m.key ? "var(--accent)" : "transparent",
              color: viewMode === m.key ? "var(--bg)" : "var(--text-secondary)",
              border: "none",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "10px",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="w-px h-3" style={{ background: "var(--border)" }} />

      <span>{charCount.toLocaleString()} chars</span>

      <div className="w-px h-3" style={{ background: "var(--border)" }} />

      <span>{renderTimeMs}ms</span>

      <div className="w-px h-3" style={{ background: "var(--border)" }} />

      <span style={{ color: "var(--accent)", opacity: 0.7 }}>
        Rendered with KaTeX
      </span>

      {/* Toast */}
      {toastMessage && (
        <>
          <div className="w-px h-3" style={{ background: "var(--border)" }} />
          <span
            className="animate-pulse"
            style={{ color: "var(--accent)" }}
          >
            {toastMessage}
          </span>
        </>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Keyboard shortcut hint */}
      <span style={{ opacity: 0.4 }}>Ctrl+\ to cycle view</span>

      <div className="w-px h-3" style={{ background: "var(--border)" }} />

      <ThemeToggle />
    </div>
  );
}
