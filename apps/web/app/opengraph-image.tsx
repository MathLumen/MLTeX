import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MLTeX — Fast LaTeX in your browser";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
        {/* Grid dot background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, #1e1e1e 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Glow accent top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,255,224,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Math decoration */}
        <div
          style={{
            position: "absolute",
            top: 48,
            right: 72,
            fontSize: 200,
            color: "rgba(0,255,224,0.06)",
            fontFamily: "Georgia, serif",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          ∫
        </div>

        {/* MathLumen badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 32,
            padding: "6px 14px",
            borderRadius: 6,
            border: "1px solid rgba(0,255,224,0.25)",
            background: "rgba(0,255,224,0.06)",
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: "#00FFE0",
              fontFamily: "monospace",
              letterSpacing: "0.08em",
            }}
          >
            MathLumen
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#F0F0F0",
            fontFamily: "monospace",
            lineHeight: 1,
            marginBottom: 24,
            letterSpacing: "-0.02em",
          }}
        >
          ML
          <span style={{ color: "#00FFE0" }}>TeX</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#888888",
            fontFamily: "monospace",
            marginBottom: 48,
            lineHeight: 1.4,
          }}
        >
          Fast, privacy-first LaTeX editor in your browser.
          <br />
          No servers. No sign-up. Just math.
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 12 }}>
          {["KaTeX", "CodeMirror 6", "Next.js 15", "Client-only"].map(
            (label) => (
              <div
                key={label}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "1px solid #2a2a2a",
                  background: "#161616",
                  fontSize: 16,
                  color: "#888",
                  fontFamily: "monospace",
                }}
              >
                {label}
              </div>
            )
          )}
        </div>

        {/* URL watermark */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 72,
            fontSize: 18,
            color: "rgba(0,255,224,0.4)",
            fontFamily: "monospace",
          }}
        >
          mathlumen.com
        </div>
      </div>
    ),
    { ...size }
  );
}
