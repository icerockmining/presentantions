import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/catalog/CatalogView";
import { JsonLd, breadcrumbLd, itemListLd } from "@/lib/jsonld";
import {
  getCategories,
  getCategoryCounts,
  getVendors,
  getCatalogProducts,
  getCategoryBySlug,
} from "@/lib/queries";
import { isFilteredCatalog, parseFilters, type RawSearchParams } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

export const revalidate = 1800;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const cats = await getCategories();
    return cats.map((c) => ({ category: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<RawSearchParams>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) return {};
  const sp = await searchParams;
  const filtered = isFilteredCatalog(sp);
  const canonical = `${SITE_URL}/catalog/${cat.slug}`;
  const title = cat.seoTitle || `${cat.name} — каталог`;
  const description = cat.seoDescription || cat.description || `Купить ${cat.name.toLowerCase()} в Cashes Green Rus.`;
  return {
    title,
    description,
    alternates: { canonical },
    robots: filtered ? { index: false, follow: true } : undefined,
    openGraph: { url: canonical, title: `${cat.name} — Cashes Green Rus`, description },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) notFound();

  const sp = await searchParams;
  const filters = parseFilters(sp, cat.slug);

  const [categories, counts, vendors, products] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
    getVendors(),
    getCatalogProducts(filters),
  ]);

  const totalCount = counts[cat.id] ?? 0;
  const catList = categories.map((c) => ({ slug: c.slug, name: c.name, count: counts[c.id] ?? 0 }));
  const vendorList = vendors.map((v) => ({ slug: v.slug, name: v.name }));

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Главная", url: "/" },
          { name: "Каталог", url: "/catalog" },
          { name: cat.name, url: `/catalog/${cat.slug}` },
        ])}
      />
      <JsonLd data={itemListLd(products.map((p) => ({ slug: p.slug, name: p.name })))} />
      <CatalogView
        title={cat.name}
        crumbLabel={cat.name}
        activeCategorySlug={cat.slug}
        categories={catList}
        vendors={vendorList}
        totalCount={totalCount}
        products={products}
        showServersBanner={cat.slug === "servers"}
      />
    </>
  );
}
