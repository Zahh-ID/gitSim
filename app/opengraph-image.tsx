import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "Git Simulator — Belajar Git Itu Seru!";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FFF9F0",
          display: "flex",
          flexDirection: "column",
          border: "5px solid #1E1B2E",
          borderRadius: 16,
          position: "relative",
          overflow: "hidden",
          padding: "60px 80px",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 12,
            background: "#FF6B35",
          }}
        />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: 16 }}>
          <div style={{ fontSize: 82, fontWeight: 900, color: "#1E1B2E", lineHeight: 1.1 }}>
            Git Simulator
          </div>
          <div style={{ fontSize: 42, fontWeight: 700, color: "#FF6B35" }}>
            Belajar Git Itu Seru!
          </div>
          <div style={{ fontSize: 28, color: "#1E1B2E", opacity: 0.65, marginTop: 8 }}>
            Media pembelajaran interaktif Version Control Git
          </div>
          <div style={{ fontSize: 28, color: "#1E1B2E", opacity: 0.65 }}>
            untuk siswa SMA/SMK — Bahasa Indonesia
          </div>

          {/* Tag chips */}
          <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
            {[
              { label: "9 Modul", bg: "#FFD93D", color: "#1E1B2E" },
              { label: "Animasi SVG", bg: "#FF6B9D", color: "#1E1B2E" },
              { label: "Kuis Interaktif", bg: "#3B82F6", color: "#fff" },
              { label: "Bahasa Indonesia", bg: "#22C55E", color: "#fff" },
            ].map((t) => (
              <div
                key={t.label}
                style={{
                  background: t.bg,
                  color: t.color,
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: "2.5px solid #1E1B2E",
                  fontWeight: 700,
                  fontSize: 20,
                }}
              >
                {t.label}
              </div>
            ))}
          </div>
        </div>

        {/* URL bottom */}
        <div
          style={{
            fontSize: 22,
            color: "#1E1B2E",
            opacity: 0.4,
            textAlign: "center",
          }}
        >
          gitsim.syzzhd.web.id
        </div>
      </div>
    ),
    { ...size }
  );
}
