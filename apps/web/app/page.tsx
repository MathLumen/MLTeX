"use client";

import dynamic from "next/dynamic";

// Dynamically import the workspace to avoid SSR issues with CodeMirror/KaTeX
const Workspace = dynamic(() => import("@/components/Workspace"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0D0D0D",
        color: "#00FFE0",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: "0.85rem",
        letterSpacing: "0.05em",
      }}
    >
      <span>MLTeX initializing...</span>
    </div>
  ),
});

export default function Home() {
  return <Workspace />;
}
