import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Badge, badgeTone } from "@/components/Badge";
import { ProductCard } from "@/components/ProductCard";
import { PdpActions } from "@/components/cart/ProductActions";
import { JsonLd, breadcrumbLd, productLd } from "@/lib/jsonld";
import { getProductBySlug, getRelatedProducts, getAllProductSlugs } from "@/lib/queries";
import { formatRub, SITE_URL, stockLabel } from "@/lib/site";

export const revalidate = 1800;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await getAllProductSlugs();
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  const canonical = `${SITE_URL}/product/${p.slug}`;
  const title = p.seoTitle || p.name;
  const description = p.seoDescription || p.subtitle || p.name;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { url: canonical, title: `${p.name} — Cashes Green Rus`, description, type: "website" },
  };
}

const TAB_INFO = [
  { id: "specs", label: "Характеристики" },
  { id: "delivery", label: "Доставка и оплата" },
  { id: "warranty", label: "Гарантия" },
];

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();

  const related = await getRelatedProducts(p.categoryId, p.id, 4);
  const specs = (p.specs as Record<string, string>) || {};
  const specEntries = Object.entries(specs);

  return (
    <div className="container" style={{ padding: "36px 32px 80px" }}>
      <JsonLd
        data={breadcrumbLd([
          { name: "Главная", url: "/" },
          { name: "Каталог", url: "/catalog" },
          { name: p.category.name, url: `/catalog/${p.category.slug}` },
          { name: p.name, url: `/product/${p.slug}` },
        ])}
      />
      <JsonLd data={productLd(p)} />

      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span>/</span>
        <Link href="/catalog">Каталог</Link>
        <span>/</span>
        <Link href={`/catalog/${p.category.slug}`}>{p.category.name}</Link>
        <span>/</span>
        <span style={{ color: "#9fb6b5" }}>{p.name}</span>
      </nav>

      <div className="pdp-layout" style={{ marginBottom: 64 }}>
        {/* gallery */}
        <div>
          <div style={{ position: "relative", borderRadius: 20, border: "1px solid var(--border)", background: "radial-gradient(ellipse at 50% 35%, #143352 0%, #0a141e 78%)", height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", top: 18, left: 18, display: "flex", gap: 8 }}>
              {p.badge && <Badge tone={badgeTone(p.badge)}>{p.badge}</Badge>}
              {stockLabel(p.stockLocation).inStock
                ? <Badge tone="green">В наличии</Badge>
                : <Badge tone="slate">Под заказ</Badge>}
            </div>
            <div style={{ position: "absolute", top: 18, right: 18, fontSize: 14, fontWeight: 700, color: "#6c8584" }}>{p.vendor.name}</div>
            <Icon name={p.category.icon} size={150} stroke="var(--accent)" sw={0.8} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ flex: 1, height: 78, borderRadius: 12, border: `1px solid ${i === 0 ? "rgba(42,159,158,0.5)" : "var(--border)"}`, background: "radial-gradient(ellipse at 50% 40%, #112a44, #0a141e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={p.category.icon} size={32} stroke={i === 0 ? "var(--accent)" : "#4a6362"} sw={1.2} />
              </div>
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#6c8584", marginBottom: 10 }}>
            {p.category.name} · {p.vendor.name}
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 12 }}>{p.name}</h1>
          {p.subtitle && <p style={{ fontSize: 16, color: "#8aa3a2", lineHeight: 1.6, marginBottom: 22 }}>{p.subtitle}</p>}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}>
            {p.tags.map((t) => (
              <span key={t} style={{ fontSize: 12.5, color: "#9fb6b5", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px 10px" }}>{t}</span>
            ))}
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
            {p.oldPrice != null && <div style={{ fontSize: 14, color: "#6c8584", textDecoration: "line-through", marginBottom: 2 }}>{formatRub(p.oldPrice)}</div>}
            <div style={{ fontSize: 34, fontWeight: 700, color: p.price != null ? "#fff" : "#5bd0ce", letterSpacing: "-0.02em", lineHeight: 1.1 }}>{formatRub(p.price)}</div>
            {p.price != null ? (
              <div style={{ fontSize: 13, color: "#6c8584", marginTop: 6 }}>Расчёт в рублях по курсу ЦБ РФ на день платежа · НДС 22% включён</div>
            ) : (
              <div style={{ fontSize: 13, color: "#8aa3a2", marginTop: 6 }}>Стоимость рассчитывается индивидуально под вашу конфигурацию</div>
            )}
            <div style={{ fontSize: 13, color: stockLabel(p.stockLocation).inStock ? "#5bd0ce" : "#9fb6b5", marginTop: 6, fontWeight: 600 }}>
              {stockLabel(p.stockLocation).text}
            </div>

            <PdpActions
              product={{
                slug: p.slug,
                name: p.name,
                price: p.price,
                vendorName: p.vendor.name,
                categoryName: p.category.name,
                categoryIcon: p.category.icon,
              }}
            />
          </div>

          <div className="grid-2" style={{ gap: 12 }}>
            {[
              { icon: "shield", t: "Гарантия 1 год", s: p.vendor.name === "Huawei" ? "Hi-Care до 5 лет" : "Опц. до 5 лет" },
              { icon: "truck", t: "Доставка в РФ", s: "В среднем 57 дней" },
              { icon: "check", t: "Проверка до отгрузки", s: "Логи с серверов" },
              { icon: "doc", t: "Официально", s: "Договор с НДС" },
            ].map((a) => (
              <div key={a.t} style={{ display: "flex", gap: 11, alignItems: "center", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 11, padding: "12px 14px" }}>
                <Icon name={a.icon} size={19} stroke="var(--accent)" sw={1.7} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{a.t}</div>
                  <div style={{ fontSize: 11.5, color: "#6c8584" }}>{a.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* tabs (CSS-only via radio inputs) */}
      <div style={{ marginBottom: 64 }}>
        <div className="pdp-tabs">
          {TAB_INFO.map((t, i) => (
            <React.Fragment key={t.id}>
              <input className="tab-input" type="radio" name="pdp-tab" id={`tab-${t.id}`} defaultChecked={i === 0} />
              <label htmlFor={`tab-${t.id}`} className="pdp-tab-label">{t.label}</label>
            </React.Fragment>
          ))}
          <div className="pdp-tab-panels" style={{ maxWidth: 760 }}>
            <div className="pdp-panel" data-tab="specs">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {specEntries.map(([k, v], i) => (
                    <tr key={k} style={{ background: i % 2 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                      <td style={{ padding: "13px 16px", fontSize: 14, color: "#8aa3a2", width: 240 }}>{k}</td>
                      <td style={{ padding: "13px 16px", fontSize: 14, color: "#fff", fontWeight: 500 }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pdp-panel" data-tab="delivery" style={{ fontSize: 15, color: "#9fb6b5", lineHeight: 1.7 }}>
              <p style={{ marginBottom: 14 }}>Расчёт в рублях по курсу ЦБ РФ на день платежа. Строго соблюдаем налоговый режим (ОСНО) — НДС 22% включён в стоимость.</p>
              <p style={{ marginBottom: 14 }}>Средний срок доставки в РФ — 57 дней, в 63% случаев оборудование приходит раньше срока. Управляем цепочкой от завода-изготовителя до вашей двери с отчётностью на каждом этапе.</p>
              <p>Оплата: 100% предоплата. Постоянным клиентам — отсрочка по договорённости. Физическим лицам — ссылка на оплату через онлайн-кассу.</p>
            </div>
            <div className="pdp-panel" data-tab="warranty" style={{ fontSize: 15, color: "#9fb6b5", lineHeight: 1.7 }}>
              <p style={{ marginBottom: 14 }}>Официальная гарантия 1 год от нашей компании на всё поставляемое оборудование. Опционально — расширение до 5 лет.</p>
              <p style={{ marginBottom: 14 }}>На продукцию Huawei доступна гарантия Hi-Care до 5 лет. По Lenovo — расширенная техподдержка с собственным складом запчастей в России.</p>
              <p>Проверяем весь товар до отгрузки и высылаем логи с серверов, чтобы заказчик убедился: отгружается именно то, что прописано в договоре. Любые несоответствия устраняем за свой счёт.</p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 24 }}>Похожие товары</h2>
          <div className="grid-prod">
            {related.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
