import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Badge } from "@/components/Badge";
import { BtnLink } from "@/components/Btn";
import { ProductCard } from "@/components/ProductCard";
import { CatalogFilters, SortSelect } from "./CatalogFilters";
import { pluralPositions } from "@/lib/site";
import type { ProductWithRel } from "@/lib/queries";

type Cat = { slug: string; name: string; count: number };
type Vendor = { slug: string; name: string };

export function CatalogView({
  title,
  crumbLabel,
  activeCategorySlug,
  categories,
  vendors,
  totalCount,
  products,
  showServersBanner,
}: {
  title: string;
  crumbLabel: string;
  activeCategorySlug?: string;
  categories: Cat[];
  vendors: Vendor[];
  totalCount: number;
  products: ProductWithRel[];
  showServersBanner: boolean;
}) {
  return (
    <div className="container" style={{ padding: "36px 32px 80px" }}>
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span>/</span>
        {activeCategorySlug && (
          <>
            <Link href="/catalog">Каталог</Link>
            <span>/</span>
          </>
        )}
        <span style={{ color: "#9fb6b5" }}>{crumbLabel}</span>
      </nav>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 34, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{title}</h1>
          <p style={{ fontSize: 14, color: "#6c8584", marginTop: 6 }}>
            Найдено: {products.length} {pluralPositions(products.length)}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <SortSelect />
        </div>
      </div>

      <div className="catalog-layout">
        <aside style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 22 }}>
          <CatalogFilters categories={categories} vendors={vendors} activeCategory={activeCategorySlug} totalCount={totalCount} />
          <div style={{ marginTop: 24, borderRadius: 14, border: "1px solid rgba(42,159,158,0.25)", background: "rgba(42,159,158,0.08)", padding: 20 }}>
            <Icon name="doc" size={24} stroke="var(--accent)" sw={1.6} />
            <div style={{ fontSize: 15.5, fontWeight: 700, color: "#fff", margin: "12px 0 6px", lineHeight: 1.25 }}>Не нашли нужное?</div>
            <p style={{ fontSize: 12.5, color: "#9fb6b5", lineHeight: 1.55, marginBottom: 14 }}>Подберём конфигурацию и подготовим КП в рублях.</p>
            <BtnLink href="/rfq" variant="teal" size="sm" full>Запросить КП</BtnLink>
          </div>
        </aside>

        <div>
          {showServersBanner && (
            <div style={{ position: "relative", overflow: "hidden", borderRadius: 18, border: "1px solid rgba(42,159,158,0.28)", background: "linear-gradient(120deg, #0a2a29 0%, #07243a 70%)", padding: "30px 34px", marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <div style={{ position: "absolute", right: -40, top: "50%", transform: "translateY(-50%)", opacity: 0.1 }}>
                <Icon name="storage" size={200} stroke="var(--accent)" sw={0.6} />
              </div>
              <div style={{ position: "relative", zIndex: 1, maxWidth: 600 }}>
                <Badge tone="green">Склад в Москве · в наличии</Badge>
                <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: "12px 0 8px", lineHeight: 1.15 }}>Часть позиций — со склада, отгрузка сразу</h2>
                <p style={{ fontSize: 15, color: "#9fc4c2", lineHeight: 1.55 }}>Серверы, СХД и комплектующие в наличии в Москве. Остальное — прямой импорт с заводов за 57 дней.</p>
              </div>
              <div style={{ position: "relative", zIndex: 1, flexShrink: 0 }}>
                <BtnLink href="/delivery" variant="light" icon="arrow">Условия доставки</BtnLink>
              </div>
            </div>
          )}

          {products.length === 0 ? (
            <div style={{ padding: "80px 0", textAlign: "center", color: "#6c8584" }}>
              <Icon name="search" size={40} stroke="#3e5453" />
              <p style={{ marginTop: 16, fontSize: 15 }}>
                Ничего не найдено. Измените фильтры или <Link href="/rfq" style={{ color: "var(--accent)" }}>запросите КП</Link>.
              </p>
            </div>
          ) : (
            <div className="grid-prod-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
