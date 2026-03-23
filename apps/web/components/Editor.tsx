"use client";

import { useEffect, useRef } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from "@codemirror/view";
import { EditorState, Extension } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { bracketMatching, indentOnInput } from "@codemirror/language";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { StreamLanguage } from "@codemirror/language";
import { stex } from "@codemirror/legacy-modes/mode/stex";
import { useTheme } from "next-themes";

const DEFAULT_CONTENT = `% Welcome to MLTeX — Fast LaTeX in your browser

% Inline math
The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

% Display math
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}
$$

% Matrix
$$
A = \\begin{pmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{pmatrix}
$$

% Aligned equations
$$
\\begin{aligned}
\\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\varepsilon_0} \\\\
\\nabla \\times \\mathbf{B} &= \\mu_0 \\mathbf{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}
\\end{aligned}
$$`;

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

function buildTheme(isDark: boolean): Extension {
  return EditorView.theme(
    {
      "&": {
        backgroundColor: "transparent",
        height: "100%",
        color: isDark ? "#f0f0f0" : "#1a1a1a",
      },
      ".cm-content": {
        caretColor: isDark ? "#00FFE0" : "#00a896",
        padding: "16px 0",
        fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
        fontSize: "14px",
        lineHeight: "1.7",
      },
      ".cm-line": {
        padding: "0 16px",
      },
      // Keyword / command highlight
      ".cm-keyword, .tok-keyword": {
        color: isDark ? "#00FFE0" : "#007a70",
      },
      ".cm-comment, .tok-comment": {
        color: isDark ? "#555" : "#999",
        fontStyle: "italic",
      },
      ".cm-string, .tok-string": {
        color: isDark ? "#9ecbff" : "#032f62",
      },
      ".cm-bracket, .tok-bracket": {
        color: isDark ? "#e8c07d" : "#a86000",
      },
      ".cm-atom, .tok-atom": {
        color: isDark ? "#79b8ff" : "#005cc5",
      },
      ".cm-matchingBracket": {
        backgroundColor: isDark ? "rgba(0,255,224,0.12)" : "rgba(0,168,150,0.12)",
        outline: `1px solid ${isDark ? "#00FFE0" : "#00a896"}`,
        borderRadius: "2px",
      },
    },
    { dark: isDark }
  );
}

export default function Editor({ value, onChange }: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  // Initialize editor
  useEffect(() => {
    if (!containerRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        drawSelection(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        StreamLanguage.define(stex),
        buildTheme(isDark),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
        ]),
        EditorView.lineWrapping,
        updateListener,
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;
    return () => view.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync value changes from outside (e.g. toolbar inserts, new document)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  // Rebuild theme on toggle
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: [],
    });
    // Re-create to apply new theme cleanly
    const container = containerRef.current;
    if (!container) return;
    const current = view.state.doc.toString();
    view.destroy();

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: current,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        drawSelection(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        StreamLanguage.define(stex),
        buildTheme(isDark),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
        ]),
        EditorView.lineWrapping,
        updateListener,
      ],
    });

    const newView = new EditorView({ state, parent: container });
    viewRef.current = newView;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="editor-grid-bg h-full overflow-auto"
      style={{ background: "var(--bg)" }}
    />
  );
}

export { DEFAULT_CONTENT };
