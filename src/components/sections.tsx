import * as React from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { BtnLink } from "./Btn";

export function SectionHead({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, gap: 16, flexWrap: "wrap" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
          <span style={{ width: 22, height: 2, background: "var(--accent)", borderRadius: 1 }} />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)" }}>{eyebrow}</span>
        </div>
        <h2 style={{ fontSize: 30, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{title}</h2>
      </div>
      {action && (
        <Link href={action.href} style={{ fontSize: 14, fontWeight: 600, color: "#9fb6b5", display: "flex", alignItems: "center", gap: 7 }} className="link-muted">
          {action.label} <Icon name="arrow" size={16} sw={2} />
        </Link>
      )}
    </div>
  );
}

export function PageHead({
  eyebrow,
  title,
  lead,
  crumbLabel,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  crumbLabel: string;
}) {
  return (
    <div style={{ marginBottom: 44 }}>
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span>/</span>
        <span style={{ color: "#9fb6b5" }}>{crumbLabel}</span>
      </nav>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
        <span style={{ width: 22, height: 2, background: "var(--accent)", borderRadius: 1 }} />
        <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)" }}>{eyebrow}</span>
      </div>
      <h1 style={{ fontSize: "clamp(34px,4vw,52px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 16 }}>{title}</h1>
      {lead && <p style={{ fontSize: 18, color: "#8aa3a2", lineHeight: 1.6, maxWidth: 720 }}>{lead}</p>}
    </div>
  );
}

export function CtaStrip({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ borderRadius: 18, border: "1px solid rgba(42,159,158,0.25)", background: "linear-gradient(120deg, #0a2a29, #07243a)", padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
      <div>
        <h3 style={{ fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>{title}</h3>
        <p style={{ fontSize: 15.5, color: "#9fc4c2" }}>{sub}</p>
      </div>
      <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
        <BtnLink href="/rfq" variant="light" icon="doc">Запросить КП</BtnLink>
        <BtnLink href="/catalog" variant="outline">В каталог</BtnLink>
      </div>
    </div>
  );
}
