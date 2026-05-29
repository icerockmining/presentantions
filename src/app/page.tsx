import * as React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Badge } from "@/components/Badge";
import { BtnLink } from "@/components/Btn";
import { ProductCard } from "@/components/ProductCard";
import { SectionHead } from "@/components/sections";
import { getCategories, getCategoryCounts, getFeaturedProducts } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
  openGraph: { url: SITE_URL },
};

const TRUST = [
  { icon: "storage", t: "Склад в Москве", s: "Товары в наличии — отгрузка сразу" },
  { icon: "truck", t: "Импорт из Китая", s: "Под заказ в среднем 57 дней" },
  { icon: "doc", t: "Официально", s: "Договор с НДС, расчёт по ЦБ РФ" },
  { icon: "check", t: "Проверка до отгрузки", s: "Логи с серверов заказчику" },
];

export default async function HomePage() {
  const [categories, counts, products] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
    getFeaturedProducts(),
  ]);

  return (
    <div>
      {/* HERO A */}
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ position: "absolute", right: -120, top: "50%", transform: "translateY(-50%)", width: 640, height: 640, border: "80px solid var(--accent)", opacity: 0.12, borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 80, top: "50%", transform: "translateY(-50%)", width: 360, height: 360, border: "54px solid var(--accent)", opacity: 0.08, borderRadius: "50%", pointerEvents: "none" }} />
        <div className="container" style={{ padding: "100px 32px 104px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(42,159,158,0.12)", border: "1px solid rgba(42,159,158,0.3)", borderRadius: 999, padding: "7px 16px", marginBottom: 26 }}>
            <span style={{ width: 7, height: 7, background: "var(--accent)", borderRadius: 999 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#7fd8d6" }}>Технологический дистрибьютор · 15+ лет на рынке</span>
          </div>
          <h1 style={{ fontSize: "clamp(40px, 5.5vw, 72px)", fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.03em", color: "#fff", maxWidth: 880, marginBottom: 24 }}>
            Серверное оборудование
            <br />
            <span style={{ color: "#8fe0de" }}>напрямую с заводов</span>
          </h1>
          <p style={{ fontSize: 19, color: "#8aa3a2", lineHeight: 1.6, maxWidth: 560, marginBottom: 40 }}>
            Серверы, СХД, сетевое оборудование и GPU-системы от мировых вендоров. Только оригиналы, официальная гарантия 1 год, прозрачные цены в рублях.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 56 }}>
            <BtnLink href="/catalog" variant="teal" size="lg" icon="arrow">Перейти в каталог</BtnLink>
            <BtnLink href="/rfq" variant="outline" size="lg">Запросить КП</BtnLink>
          </div>
          <div style={{ display: "flex", gap: 44, flexWrap: "wrap" }}>
            {[["500+", "поставок"], ["1 млрд+ ₽", "оборот в год"], ["7", "вендоров"], ["Склад", "в Москве"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>{n}</div>
                <div style={{ fontSize: 13.5, color: "#6c8584", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
        <div className="container grid-4" style={{ padding: "28px 32px" }}>
          {TRUST.map((it) => (
            <div key={it.t} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(42,159,158,0.12)", border: "1px solid rgba(42,159,158,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={it.icon} size={20} stroke="var(--accent)" sw={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: "#fff" }}>{it.t}</div>
                <div style={{ fontSize: 12.5, color: "#6c8584", marginTop: 2 }}>{it.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <SectionHead eyebrow="Каталог" title="Категории оборудования" action={{ label: "Весь каталог", href: "/catalog" }} />
        <div className="grid-cats">
          {categories.map((c) => (
            <Link key={c.id} href={`/catalog/${c.slug}`} className="cat-tile" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 14, padding: "24px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div className="cat-tile-icon" style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 160ms" }}>
                <Icon name={c.icon} size={28} stroke="var(--accent)" sw={1.5} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "#6c8584" }}>{counts[c.id] ?? 0} позиций</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR */}
      <section className="section">
        <SectionHead eyebrow="Рекомендуем" title="Популярные позиции" action={{ label: "Смотреть все", href: "/catalog" }} />
        <div className="grid-prod">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* AI banner */}
      <section className="section">
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 22, border: "1px solid rgba(42,159,158,0.25)", background: "linear-gradient(120deg, #0a2a29 0%, #07243a 100%)", padding: "48px 52px" }}>
          <div style={{ position: "absolute", right: -60, top: "50%", transform: "translateY(-50%)", opacity: 0.1 }}>
            <Icon name="bolt" size={280} stroke="var(--accent)" sw={0.6} />
          </div>
          <div style={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
            <Badge tone="teal">Проектные запчасти &amp; ЗИП</Badge>
            <h2 style={{ fontSize: 34, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", margin: "16px 0 12px", lineHeight: 1.1 }}>
              Редкие комплектующие для устаревшего фонда
            </h2>
            <p style={{ fontSize: 16.5, color: "#9fc4c2", lineHeight: 1.6, marginBottom: 26 }}>
              Поможем найти запчасти EOL/EOS-оборудования Dell, HPE, Cisco, Lenovo и Huawei. Пополняем ЗИП-склады дистрибьюторов и интеграторов.
            </p>
            <BtnLink href="/rfq" variant="light" icon="arrow">Оставить заявку на подбор</BtnLink>
          </div>
        </div>
      </section>

      {/* MORE */}
      <section className="section">
        <SectionHead eyebrow="В наличии" title="Новые поступления" action={{ label: "Смотреть все", href: "/catalog" }} />
        <div className="grid-prod">
          {products.slice(4, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* RFQ CTA */}
      <section className="section" style={{ paddingBottom: 80 }}>
        <div style={{ borderRadius: 22, border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", padding: 52, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 10 }}>Не нашли нужную конфигурацию?</h2>
            <p style={{ fontSize: 16.5, color: "#8aa3a2", lineHeight: 1.6, maxWidth: 560 }}>
              Соберём индивидуальное решение под вашу задачу и подготовим коммерческое предложение. Личный менеджер для каждого клиента.
            </p>
          </div>
          <BtnLink href="/rfq" variant="teal" size="lg" icon="doc">Запросить КП</BtnLink>
        </div>
      </section>
    </div>
  );
}
