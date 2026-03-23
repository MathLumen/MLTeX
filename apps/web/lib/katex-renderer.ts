import katex from "katex";

interface RenderSegment {
  type: "text" | "inline" | "block";
  content: string;
}

/**
 * Splits LaTeX source into text / inline ($...$) / block ($$...$$) segments.
 */
function parseSegments(source: string): RenderSegment[] {
  const segments: RenderSegment[] = [];
  let remaining = source;

  while (remaining.length > 0) {
    // Look for block math first ($$...$$)
    const blockStart = remaining.indexOf("$$");
    // Look for inline math ($...$) — but not $$
    const inlineStart = (() => {
      let idx = 0;
      while (idx < remaining.length) {
        const pos = remaining.indexOf("$", idx);
        if (pos === -1) return -1;
        // Make sure it's not $$ (block)
        if (remaining[pos + 1] !== "$") return pos;
        // Skip past $$
        idx = pos + 2;
      }
      return -1;
    })();

    const hasBlock = blockStart !== -1;
    const hasInline = inlineStart !== -1;

    if (!hasBlock && !hasInline) {
      // No more math — rest is plain text
      segments.push({ type: "text", content: remaining });
      break;
    }

    // Determine which comes first
    const blockFirst =
      hasBlock && (!hasInline || blockStart <= inlineStart);

    if (blockFirst) {
      // Push text before $$
      if (blockStart > 0) {
        segments.push({ type: "text", content: remaining.slice(0, blockStart) });
      }
      const contentStart = blockStart + 2;
      const blockEnd = remaining.indexOf("$$", contentStart);
      if (blockEnd === -1) {
        // Unclosed — treat as text
        segments.push({ type: "text", content: remaining.slice(blockStart) });
        break;
      }
      segments.push({
        type: "block",
        content: remaining.slice(contentStart, blockEnd),
      });
      remaining = remaining.slice(blockEnd + 2);
    } else {
      // Inline math
      if (inlineStart > 0) {
        segments.push({ type: "text", content: remaining.slice(0, inlineStart) });
      }
      const contentStart = inlineStart + 1;
      // Find closing $ (not $$)
      let closeIdx = contentStart;
      let found = false;
      while (closeIdx < remaining.length) {
        const pos = remaining.indexOf("$", closeIdx);
        if (pos === -1) break;
        if (remaining[pos + 1] !== "$") {
          closeIdx = pos;
          found = true;
          break;
        }
        closeIdx = pos + 2;
      }
      if (!found) {
        segments.push({ type: "text", content: remaining.slice(inlineStart) });
        break;
      }
      segments.push({
        type: "inline",
        content: remaining.slice(contentStart, closeIdx),
      });
      remaining = remaining.slice(closeIdx + 1);
    }
  }

  return segments;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Renders a LaTeX source string into sanitized HTML with KaTeX.
 * Inline $...$ and block $$...$$ are both handled.
 * Parse errors are wrapped in a styled error span instead of throwing.
 */
export function renderLatex(source: string): string {
  const segments = parseSegments(source);
  const parts: string[] = [];

  for (const segment of segments) {
    if (segment.type === "text") {
      // Convert newlines to <br> for paragraph-like display
      const lines = segment.content.split("\n");
      const htmlLines = lines.map((line) => {
        const trimmed = line.trim();
        // Comment lines (% ...) are greyed out
        if (trimmed.startsWith("%")) {
          return `<span class="latex-comment">${escapeHtml(line)}</span>`;
        }
        return escapeHtml(line);
      });
      parts.push(htmlLines.join("<br>"));
    } else {
      const displayMode = segment.type === "block";
      try {
        const rendered = katex.renderToString(segment.content.trim(), {
          displayMode,
          throwOnError: true,
          strict: false,
          trust: false,
          macros: {
            "\\R": "\\mathbb{R}",
            "\\N": "\\mathbb{N}",
            "\\Z": "\\mathbb{Z}",
            "\\C": "\\mathbb{C}",
          },
        });
        parts.push(rendered);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "KaTeX render error";
        parts.push(
          `<span class="katex-error">Error: ${escapeHtml(message)}</span>`
        );
      }
    }
  }

  return parts.join("");
}

export interface RenderResult {
  html: string;
  renderTimeMs: number;
}

export function renderLatexTimed(source: string): RenderResult {
  const start = performance.now();
  const html = renderLatex(source);
  const renderTimeMs = Math.round((performance.now() - start) * 10) / 10;
  return { html, renderTimeMs };
}
