import type { CatalogFilters } from "./queries";

export type RawSearchParams = Record<string, string | string[] | undefined>;

function pick(sp: RawSearchParams, key: string): string | undefined {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

// True when query params make the URL a filtered/sorted/paginated variant
// that should be noindex,follow with canonical to the clean base.
export function isFilteredCatalog(sp: RawSearchParams): boolean {
  return Boolean(
    pick(sp, "vendor") ||
      pick(sp, "inStock") ||
      pick(sp, "hasPrice") ||
      (pick(sp, "sort") && pick(sp, "sort") !== "default") ||
      pick(sp, "q") ||
      (pick(sp, "page") && pick(sp, "page") !== "1")
  );
}

export function parseFilters(sp: RawSearchParams, categorySlug?: string): CatalogFilters {
  const vendor = pick(sp, "vendor");
  const sort = pick(sp, "sort");
  return {
    categorySlug,
    vendors: vendor ? vendor.split(",").filter(Boolean) : undefined,
    inStock: pick(sp, "inStock") === "1",
    hasPrice: pick(sp, "hasPrice") === "1",
    sort: sort === "price-asc" || sort === "price-desc" ? sort : "default",
  };
}

export function getSearchQuery(sp: RawSearchParams): string | undefined {
  const q = pick(sp, "q");
  return q?.trim() || undefined;
}
