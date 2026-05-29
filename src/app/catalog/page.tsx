import * as React from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { JsonLd, breadcrumbLd, itemListLd } from "@/lib/jsonld";
import { getCategories, getCategoryCounts, getVendors, getCatalogProducts } from "@/lib/queries";
import { isFilteredCatalog, parseFilters, getSearchQuery, type RawSearchParams } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

export const revalidate = 1800;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const filtered = isFilteredCatalog(sp);
  const canonical = `${SITE_URL}/catalog`;
  return {
    title: "Каталог серверного оборудования",
    description:
      "Серверы, СХД, сетевое оборудование, GPU-системы и комплектующие. Только оригиналы, гарантия 1 год, расчёт в рублях с НДС 22%.",
    alternates: { canonical },
    robots: filtered ? { index: false, follow: true } : undefined,
    openGraph: { url: canonical, title: "Каталог серверного оборудования — Cashes Green Rus" },
  };
}

function applySearch<T extends { name: string; subtitle: string | null; tags: string[] }>(
  products: T[],
  q?: string
): T[] {
  if (!q) return products;
  const needle = q.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(needle) ||
      (p.subtitle || "").toLowerCase().includes(needle) ||
      p.tags.some((t) => t.toLowerCase().includes(needle))
  );
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const q = getSearchQuery(sp);

  const [categories, counts, vendors, allProducts] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
    getVendors(),
    getCatalogProducts(filters),
  ]);

  const products = applySearch(allProducts, q);
  const totalCount = await getCatalogProducts({}).then((p) => p.length);

  const catList = categories.map((c) => ({ slug: c.slug, name: c.name, count: counts[c.id] ?? 0 }));
  const vendorList = vendors.map((v) => ({ slug: v.slug, name: v.name }));

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Главная", url: "/" },
          { name: "Каталог", url: "/catalog" },
        ])}
      />
      <JsonLd data={itemListLd(products.map((p) => ({ slug: p.slug, name: p.name })))} />
      <CatalogView
        title={q ? `Поиск: «${q}»` : "Весь каталог"}
        crumbLabel={q ? `Поиск: ${q}` : "Весь каталог"}
        categories={catList}
        vendors={vendorList}
        totalCount={totalCount}
        products={products}
        showServersBanner={!q}
      />
    </>
  );
}
