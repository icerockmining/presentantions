import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Badge } from "@/components/Badge";
import { PageHead, CtaStrip } from "@/components/sections";
import { JsonLd, breadcrumbLd } from "@/lib/jsonld";
import { getPosts } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Блог и экспертиза",
  description: "Разборы, гайды и новости рынка серверного оборудования от инженеров Cashes Green Rus.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: { url: `${SITE_URL}/blog` },
};

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(d);
}

export default async function BlogPage() {
  const posts = await getPosts();
  const [feat, ...rest] = posts;

  return (
    <div className="container" style={{ padding: "36px 32px 80px" }}>
      <JsonLd data={breadcrumbLd([{ name: "Главная", url: "/" }, { name: "Блог", url: "/blog" }])} />
      <PageHead
        eyebrow="Блог"
        title="Блог и экспертиза"
        crumbLabel="Блог"
        lead="Разборы, гайды и новости рынка серверного оборудования от инженеров Cashes Green Rus."
      />

      {feat && (
        <Link href={`/blog/${feat.slug}`} className="card-hover" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden", marginBottom: 32 }}>
          <div style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <Badge tone="gold">Рекомендуем</Badge>
              {feat.tag && <Badge tone="slate">{feat.tag}</Badge>}
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 14 }}>{feat.title}</h2>
            <p style={{ fontSize: 16, color: "#8aa3a2", lineHeight: 1.6, marginBottom: 22 }}>{feat.excerpt}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13, color: "#6c8584" }}>
              <span>{formatDate(feat.publishedAt)}</span>
              <span>·</span>
              <span>{feat.readMins} мин чтения</span>
              <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 7, color: "var(--accent)", fontWeight: 600 }}>
                Читать <Icon name="arrow" size={15} sw={2} />
              </span>
            </div>
          </div>
          <div style={{ background: "radial-gradient(ellipse at 60% 40%, #143352 0%, #0a141e 80%)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 280 }}>
            <Icon name={feat.category?.icon || "doc"} size={110} stroke="var(--accent)" sw={0.8} />
          </div>
        </Link>
      )}

      <div className="grid-3">
        {rest.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="card-hover" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", display: "block" }}>
            <div style={{ height: 150, background: "radial-gradient(ellipse at 50% 40%, #112a44, #0a141e)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {p.tag && <div style={{ position: "absolute", top: 14, left: 14 }}><Badge tone="teal">{p.tag}</Badge></div>}
              <Icon name={p.category?.icon || "doc"} size={56} stroke="var(--accent)" sw={1} />
            </div>
            <div style={{ padding: 22 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 9 }}>{p.title}</h3>
              <p style={{ fontSize: 13.5, color: "#8aa3a2", lineHeight: 1.55, marginBottom: 16 }}>{p.excerpt}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#6c8584" }}>
                <span>{formatDate(p.publishedAt)}</span>
                <span>·</span>
                <span>{p.readMins} мин</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 48 }}>
        <CtaStrip title="Подобрать оборудование под задачу?" sub="Эксперты помогут с конфигурацией и подготовят КП." />
      </div>
    </div>
  );
}
