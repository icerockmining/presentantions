import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Shared OG card layout used by product/category/blog opengraph-image routes.
export function ogImage(opts: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  price?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #07111a 0%, #0a2a29 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 18, height: 18, borderRadius: 999, background: "#2a9f9e" }} />
          <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: "#ffffff" }}>
            <span>Cashes Green&nbsp;</span>
            <span style={{ color: "#5bd0ce" }}>Rus</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#2a9f9e", textTransform: "uppercase", letterSpacing: 2, marginBottom: 20 }}>
            {opts.eyebrow}
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, color: "#ffffff", lineHeight: 1.05, maxWidth: 1000 }}>
            {opts.title}
          </div>
          {opts.subtitle && (
            <div style={{ fontSize: 30, color: "#8aa3a2", marginTop: 24, maxWidth: 940 }}>{opts.subtitle}</div>
          )}
          {opts.price && (
            <div style={{ fontSize: 44, fontWeight: 800, color: "#5bd0ce", marginTop: 28 }}>{opts.price}</div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#6c8584" }}>
          <span>Серверы · СХД · Сетевое · GPU</span>
          <span>cashesgreen.ru</span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
