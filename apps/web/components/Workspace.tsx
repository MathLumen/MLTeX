"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Editor, { DEFAULT_CONTENT } from "./Editor";
import Preview from "./Preview";
import Toolbar from "./Toolbar";
import StatusBar from "./StatusBar";
import { encodeLatexToUrl } from "@/lib/url-encoder";
import { decodeLatexFromUrl } from "@/lib/url-encoder";

const STORAGE_KEY = "mltex-source";
const VIEW_MODE_KEY = "mltex-view-mode";

type ViewMode = "split" | "editor" | "preview";

function loadInitialContent(): string {
  if (typeof window === "undefined") return DEFAULT_CONTENT;
  const fromUrl = decodeLatexFromUrl();
  if (fromUrl) return fromUrl;
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ?? DEFAULT_CONTENT;
}

export default function Workspace() {
  const [source, setSource] = useState<string>(loadInitialContent);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "split";
    return (localStorage.getItem(VIEW_MODE_KEY) as ViewMode) ?? "split";
  });
  const [renderTimeMs, setRenderTimeMs] = useState(0);
  const [splitRatio, setSplitRatio] = useState(0.5); // 0–1
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartRatio = useRef(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist source
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, source);
    }, 1000);
    return () => clearTimeout(timer);
  }, [source]);

  // Persist view mode
  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  // Keyboard shortcut Ctrl+\ to cycle view
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "\\") {
        e.preventDefault();
        setViewMode((v) => {
          if (v === "split") return "editor";
          if (v === "editor") return "preview";
          return "split";
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // --- Drag-to-resize ---
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartRatio.current = splitRatio;
  }, [splitRatio]);

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newRatio = Math.min(
        0.85,
        Math.max(0.15, (e.clientX - rect.left) / rect.width)
      );
      setSplitRatio(newRatio);
    };
    const onMouseUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  // --- Toast helper ---
  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 2500);
  };

  // --- Toolbar actions ---
  const handleInsert = (snippet: string) => {
    // Append snippet at current cursor, or just append to source
    setSource((prev) => prev + snippet);
  };

  const handleCopyLatex = async () => {
    try {
      await navigator.clipboard.writeText(source);
      showToast("LaTeX copied!");
    } catch {
      showToast("Copy failed");
    }
  };

  const handleCopyPng = async () => {
    const previewEl = document.querySelector<HTMLElement>(".preview-content");
    if (!previewEl) {
      showToast("Preview not ready");
      return;
    }
    try {
      const { default: domtoimage } = await import("dom-to-image-more");
      const blob = await domtoimage.toBlob(previewEl, {
        bgcolor: "#ffffff",
        width: previewEl.offsetWidth,
        height: previewEl.offsetHeight,
      });
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      showToast("PNG copied!");
    } catch {
      showToast("PNG copy failed");
    }
  };

  const handleShareLink = async () => {
    const url = encodeLatexToUrl(source);
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied!");
    } catch {
      showToast("Copy failed");
    }
  };

  const handleNewDocument = () => {
    if (!confirm("Clear the editor and start a new document?")) return;
    setSource("");
    localStorage.removeItem(STORAGE_KEY);
    showToast("New document");
  };

  // --- Layout ---
  const showEditor = viewMode === "split" || viewMode === "editor";
  const showPreview = viewMode === "split" || viewMode === "preview";

  return (
    <div
      className="flex flex-col"
      style={{
        height: "100dvh",
        background: "var(--bg)",
        overflow: "hidden",
        userSelect: isDragging ? "none" : undefined,
      }}
    >
      <Toolbar
        onInsert={handleInsert}
        onCopyLatex={handleCopyLatex}
        onCopyPng={handleCopyPng}
        onShareLink={handleShareLink}
        onNewDocument={handleNewDocument}
      />

      {/* Main split area */}
      <div
        ref={containerRef}
        className="flex flex-1 overflow-hidden"
        style={{ minHeight: 0 }}
      >
        {/* Editor pane */}
        {showEditor && (
          <div
            style={{
              width:
                viewMode === "split" ? `${splitRatio * 100}%` : "100%",
              minWidth: 0,
              borderRight:
                viewMode === "split"
                  ? "1px solid var(--border)"
                  : undefined,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Editor value={source} onChange={setSource} />
          </div>
        )}

        {/* Resize handle */}
        {viewMode === "split" && (
          <div
            onMouseDown={onMouseDown}
            className={`resize-handle${isDragging ? " dragging" : ""}`}
            style={{
              width: "5px",
              cursor: "col-resize",
              background: isDragging ? "var(--accent)" : "var(--border)",
              flexShrink: 0,
              position: "relative",
              transition: "background 0.15s",
              zIndex: 10,
            }}
          />
        )}

        {/* Preview pane */}
        {showPreview && (
          <div
            style={{
              flex: viewMode === "split" ? "none" : 1,
              width:
                viewMode === "split"
                  ? `${(1 - splitRatio) * 100}%`
                  : "100%",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <Preview source={source} onRenderTime={setRenderTimeMs} />
          </div>
        )}
      </div>

      <StatusBar
        charCount={source.length}
        renderTimeMs={renderTimeMs}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        toastMessage={toastMessage}
      />
    </div>
  );
}
