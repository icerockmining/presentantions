"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Icon } from "@/components/Icon";

type Cat = { slug: string; name: string; count: number };
type Vendor = { slug: string; name: string };

export function CatalogFilters({
  categories,
  vendors,
  activeCategory,
  totalCount,
}: {
  categories: Cat[];
  vendors: Vendor[];
  activeCategory?: string;
  totalCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedVendors = (searchParams.get("vendor") || "").split(",").filter(Boolean);
  const inStock = searchParams.get("inStock") === "1";
  const hasPrice = searchParams.get("hasPrice") === "1";

  function pushParams(next: URLSearchParams, path?: string) {
    // Reset page on filter change.
    next.delete("page");
    const qs = next.toString();
    const base = path ?? pathname;
    router.push(qs ? `${base}?${qs}` : base);
  }

  function goCategory(slug: string | null) {
    // Category is part of the path; preserve vendor/stock/price/sort filters.
    const next = new URLSearchParams(searchParams.toString());
    const path = slug ? `/catalog/${slug}` : "/catalog";
    pushParams(next, path);
  }

  function toggleVendor(slug: string) {
    const set = new Set(selectedVendors);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    const next = new URLSearchParams(searchParams.toString());
    if (set.size) next.set("vendor", Array.from(set).join(","));
    else next.delete("vendor");
    pushParams(next);
  }

  function toggleFlag(key: "inStock" | "hasPrice", on: boolean) {
    const next = new URLSearchParams(searchParams.toString());
    if (on) next.set(key, "1");
    else next.delete(key);
    pushParams(next);
  }

  function reset() {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("vendor");
    next.delete("inStock");
    next.delete("hasPrice");
    pushParams(next);
  }

  const hasActive = selectedVendors.length > 0 || inStock || hasPrice;

  const radio = (label: string, active: boolean, onClick: () => void, count?: number) => (
    <button
      type="button"
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", padding: "6px 0", width: "100%" }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ width: 16, height: 16, borderRadius: 999, border: `2px solid ${active ? "var(--accent)" : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {active && <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--accent)" }} />}
        </span>
        <span style={{ fontSize: 14, color: active ? "#fff" : "#9fb6b5" }}>{label}</span>
      </span>
      {count != null && <span style={{ fontSize: 12, color: "#4a6362" }}>{count}</span>}
    </button>
  );

  const check = (label: string, active: boolean, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer", padding: "6px 0", width: "100%" }}
    >
      <span style={{ width: 16, height: 16, borderRadius: 5, border: `2px solid ${active ? "var(--accent)" : "rgba(255,255,255,0.2)"}`, background: active ? "var(--accent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {active && <Icon name="check" size={11} stroke="#fff" sw={3} />}
      </span>
      <span style={{ fontSize: 14, color: active ? "#fff" : "#9fb6b5" }}>{label}</span>
    </button>
  );

  const group = (title: string, children: React.ReactNode) => (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#6c8584", marginBottom: 14 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{children}</div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {group(
        "Категория",
        <>
          {radio("Все категории", !activeCategory, () => goCategory(null), totalCount)}
          {categories.map((c) => radio(c.name, activeCategory === c.slug, () => goCategory(c.slug), c.count))}
        </>
      )}
      {group("Производитель", vendors.map((v) => <React.Fragment key={v.slug}>{check(v.name, selectedVendors.includes(v.slug), () => toggleVendor(v.slug))}</React.Fragment>))}
      {group(
        "Наличие",
        <>
          {check("В наличии", inStock, () => toggleFlag("inStock", !inStock))}
          {check("С указанной ценой", hasPrice, () => toggleFlag("hasPrice", !hasPrice))}
        </>
      )}
      {hasActive && (
        <button type="button" onClick={reset} style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
          Сбросить фильтры
        </button>
      )}
    </div>
  );
}

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "default";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(searchParams.toString());
    if (e.target.value === "default") next.delete("sort");
    else next.set("sort", e.target.value);
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <select
      value={sort}
      onChange={onChange}
      aria-label="Сортировка"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9, padding: "9px 14px", color: "#cfe3e2", fontSize: 14, cursor: "pointer", outline: "none" }}
    >
      <option value="default" style={{ background: "#0a141e" }}>По умолчанию</option>
      <option value="price-asc" style={{ background: "#0a141e" }}>Сначала дешевле</option>
      <option value="price-desc" style={{ background: "#0a141e" }}>Сначала дороже</option>
    </select>
  );
}
