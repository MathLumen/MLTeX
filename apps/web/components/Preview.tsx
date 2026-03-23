"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { renderLatexTimed } from "@/lib/katex-renderer";
import { useDebounce } from "@/hooks/useDebounce";

interface PreviewProps {
  source: string;
  onRenderTime: (ms: number) => void;
}

export default function Preview({ source, onRenderTime }: PreviewProps) {
  const debouncedSource = useDebounce(source, 250);
  // Keep a stable ref so the effect doesn't re-run when the callback identity changes
  const onRenderTimeRef = useRef(onRenderTime);
  onRenderTimeRef.current = onRenderTime;

  const { html, renderTimeMs } = renderLatexTimed(debouncedSource);

  // Notify parent after render (not during) to avoid setState-during-render
  useEffect(() => {
    onRenderTimeRef.current(renderTimeMs);
  }, [debouncedSource, renderTimeMs]);

  return (
    <div
      className="h-full overflow-auto"
      style={{ background: "var(--bg-secondary)", padding: "24px 32px" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={debouncedSource.slice(0, 80)}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="preview-content"
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            fontSize: "15px",
            lineHeight: "1.8",
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </AnimatePresence>
    </div>
  );
}
