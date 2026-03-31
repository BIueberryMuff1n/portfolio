import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Anthony Carl — AI Orchestrator & Systems Architect";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#070709",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 88px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Purple glow top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 640,
            height: 640,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 65%)",
          }}
        />
        {/* Cyan glow bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: 240,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 65%)",
          }}
        />

        {/* Available badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 9999,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.04)",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#10b981",
            }}
          />
          <span
            style={{
              fontSize: 13,
              color: "#94a3b8",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            Available · AI Orchestrator
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: "#f1f5f9",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          Anthony Carl
        </div>

        {/* Subtitle — gradient via SVG trick */}
        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: "#8b5cf6",
            marginBottom: 48,
            letterSpacing: "-0.01em",
          }}
        >
          AI Orchestrator & Systems Architect
        </div>

        {/* Proof bar */}
        <div
          style={{
            display: "flex",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
            overflow: "hidden",
          }}
        >
          {[
            { value: "21 tools", label: "orchestrated" },
            { value: "$300K+/mo", label: "saved" },
            { value: "4 agents", label: "Creative Matrix" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px 40px",
                borderRight:
                  i < 2 ? "1px solid rgba(255,255,255,0.07)" : undefined,
              }}
            >
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#f1f5f9",
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontFamily: "monospace",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
