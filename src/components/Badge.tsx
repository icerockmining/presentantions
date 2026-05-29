import * as React from "react";

export type BadgeTone = "teal" | "gold" | "green" | "slate";

const TONES: Record<BadgeTone, { bg: string; fg: string; bd: string }> = {
  teal: { bg: "rgba(42,159,158,0.15)", fg: "#5bd0ce", bd: "rgba(42,159,158,0.3)" },
  gold: { bg: "rgba(214,160,40,0.15)", fg: "#e3b552", bd: "rgba(214,160,40,0.3)" },
  green: { bg: "rgba(40,180,110,0.15)", fg: "#46c98a", bd: "rgba(40,180,110,0.3)" },
  slate: { bg: "rgba(255,255,255,0.06)", fg: "#9fb6b5", bd: "rgba(255,255,255,0.12)" },
};

export function Badge({ children, tone = "teal" }: { children: React.ReactNode; tone?: BadgeTone }) {
  const t = TONES[tone] || TONES.teal;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

// Map a product badge string to a tone (ported from prototype heuristic).
export function badgeTone(badge: string): BadgeTone {
  if (badge.includes("Hi-Care") || badge.includes("Топ")) return "gold";
  if (badge.includes("наличии")) return "green";
  return "teal";
}
