"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { useCart } from "./CartProvider";
import { formatRub } from "@/lib/site";

type CompareProduct = {
  slug: string;
  name: string;
  price: number | null;
  inStock: boolean;
  vendorName: string;
  categoryName: string;
  categoryIcon: string;
  specs: Record<string, string>;
};

export function CompareClient() {
  const { compare, removeCompare, addToCart, hydrated } = useCart();
  const [products, setProducts] = React.useState<CompareProduct[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!hydrated) return;
    if (compare.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/compare?slugs=${encodeURIComponent(compare.join(","))}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [compare, hydrated]);

  if (!hydrated || loading) {
    return <div className="container" style={{ padding: "80px 32px", color: "#6c8584" }}>Загрузка…</div>;
  }

  if (products.length === 0) {
    return (
      <div className="container" style={{ padding: "80px 32px", textAlign: "center" }}>
        <Icon name="compare" size={48} stroke="#3e5453" />
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginTop: 20 }}>Список сравнения пуст</h1>
        <p style={{ fontSize: 15, color: "#8aa3a2", marginTop: 10, marginBottom: 28 }}>Добавьте товары из каталога, чтобы сравнить характеристики.</p>
        <Link href="/catalog" className="btn btn-teal btn-md">Перейти в каталог <Icon name="arrow" size={17} sw={2.2} /></Link>
      </div>
    );
  }

  const specKeys: string[] = [];
  products.forEach((p) => Object.keys(p.specs || {}).forEach((k) => { if (!specKeys.includes(k)) specKeys.push(k); }));

  const stickyTd: React.CSSProperties = { position: "sticky", left: 0, background: "#0a141e", borderRight: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="container" style={{ padding: "36px 32px 80px" }}>
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span>/</span>
        <span style={{ color: "#9fb6b5" }}>Сравнение</span>
      </nav>
      <h1 style={{ fontSize: 34, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 28 }}>Сравнение товаров</h1>

      <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
          <thead>
            <tr>
              <th style={{ ...stickyTd, width: 180, padding: 18, textAlign: "left", verticalAlign: "bottom" }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#6c8584" }}>Характеристика</span>
              </th>
              {products.map((p) => (
                <th key={p.slug} style={{ padding: 18, textAlign: "left", borderLeft: "1px solid rgba(255,255,255,0.06)", minWidth: 220, verticalAlign: "top" }}>
                  <div style={{ position: "relative" }}>
                    <button onClick={() => removeCompare(p.slug)} aria-label="Убрать" style={{ position: "absolute", top: -4, right: -4, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 7, width: 26, height: 26, cursor: "pointer", color: "#9fb6b5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="close" size={14} />
                    </button>
                    <div style={{ width: 64, height: 64, borderRadius: 12, background: "radial-gradient(ellipse at 50% 40%, #112a44, #0a141e)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                      <Icon name={p.categoryIcon} size={30} stroke="var(--accent)" sw={1.3} />
                    </div>
                    <Link href={`/product/${p.slug}`} style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 6, display: "block", paddingRight: 24 }}>{p.name}</Link>
                    <div style={{ fontSize: 17, fontWeight: 700, color: p.price != null ? "#fff" : "#5bd0ce", marginBottom: 12 }}>{formatRub(p.price)}</div>
                    <button
                      onClick={() => {
                        if (p.price == null) {
                          window.location.href = `/rfq?product=${encodeURIComponent(p.slug)}`;
                        } else {
                          addToCart({ slug: p.slug, name: p.name, price: p.price, vendorName: p.vendorName, categoryName: p.categoryName, categoryIcon: p.categoryIcon }, 1);
                        }
                      }}
                      className="btn btn-teal btn-sm btn-full"
                    >
                      {p.price != null ? "В корзину" : "Запросить"}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label="Производитель" stickyTd={stickyTd} products={products} render={(p) => p.vendorName} />
            <Row label="Категория" stickyTd={stickyTd} products={products} render={(p) => p.categoryName} />
            <Row label="Наличие" stickyTd={stickyTd} products={products} render={(p) => (p.inStock ? "✓ В наличии" : "Под заказ")} highlight={(p) => p.inStock} />
            {specKeys.map((k) => (
              <Row key={k} label={k} stickyTd={stickyTd} products={products} render={(p) => p.specs?.[k] || "—"} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({
  label,
  products,
  render,
  highlight,
  stickyTd,
}: {
  label: string;
  products: CompareProduct[];
  render: (p: CompareProduct) => string;
  highlight?: (p: CompareProduct) => boolean;
  stickyTd: React.CSSProperties;
}) {
  return (
    <tr style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <td style={{ ...stickyTd, padding: "14px 18px", fontSize: 13.5, color: "#8aa3a2", fontWeight: 500 }}>{label}</td>
      {products.map((p) => (
        <td key={p.slug} style={{ padding: "14px 18px", fontSize: 14, color: highlight && highlight(p) ? "#5bd0ce" : "#e2eeee", borderLeft: "1px solid rgba(255,255,255,0.06)", lineHeight: 1.45 }}>
          {render(p)}
        </td>
      ))}
    </tr>
  );
}
