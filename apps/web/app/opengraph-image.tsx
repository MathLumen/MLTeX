import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MLTeX — Fast LaTeX in your browser";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PILLS = ["KaTeX", "CodeMirror 6", "Next.js 15", "Client-only"];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "64px 72px",
          background: "#0D0D0D",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow top-right */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,255,224,0.10) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Large decorative "ML" watermark */}
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 60,
            fontSize: 260,
            fontWeight: 800,
            color: "rgba(0,255,224,0.04)",
            fontFamily: "monospace",
            lineHeight: 1,
            letterSpacing: "-0.05em",
            display: "flex",
          }}
        >
          ML
        </div>

        {/* MathLumen badge */}
        <div style={{ display: "flex", marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 16px",
              borderRadius: 6,
              border: "1px solid rgba(0,255,224,0.3)",
              background: "rgba(0,255,224,0.07)",
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: "#00FFE0",
                fontFamily: "monospace",
                letterSpacing: "0.1em",
              }}
            >
              MathLumen
            </span>
          </div>
        </div>

        {/* Title: MLTeX */}
        <div style={{ display: "flex", marginBottom: 20 }}>
          <span
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: "#F0F0F0",
              fontFamily: "monospace",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            ML
          </span>
          <span
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: "#00FFE0",
              fontFamily: "monospace",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            TeX
          </span>
        </div>

        {/* Tagline */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 48, gap: 4 }}>
          <span style={{ fontSize: 26, color: "#777", fontFamily: "monospace" }}>
            Fast, privacy-first LaTeX editor in your browser.
          </span>
          <span style={{ fontSize: 26, color: "#555", fontFamily: "monospace" }}>
            No servers. No sign-up. Just math.
          </span>
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 10 }}>
          {PILLS.map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: 6,
                border: "1px solid #2a2a2a",
                background: "#161616",
                fontSize: 15,
                color: "#666",
                fontFamily: "monospace",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 44,
            right: 72,
            display: "flex",
          }}
        >
          <span
            style={{
              fontSize: 17,
              color: "rgba(0,255,224,0.35)",
              fontFamily: "monospace",
            }}
          >
            mathlumen.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
