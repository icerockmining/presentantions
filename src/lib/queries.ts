import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type ProductWithRel = Prisma.ProductGetPayload<{
  include: { category: true; vendor: true };
}>;

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getCategoryCounts() {
  const grouped = await prisma.product.groupBy({
    by: ["categoryId"],
    _count: { _all: true },
  });
  const map: Record<string, number> = {};
  for (const g of grouped) map[g.categoryId] = g._count._all;
  return map;
}

export async function getVendors() {
  return prisma.vendor.findMany({ orderBy: { name: "asc" } });
}

export type CatalogFilters = {
  categorySlug?: string;
  vendors?: string[];
  inStock?: boolean;
  hasPrice?: boolean;
  sort?: "default" | "price-asc" | "price-desc";
};

export async function getCatalogProducts(filters: CatalogFilters): Promise<ProductWithRel[]> {
  const where: Prisma.ProductWhereInput = {};
  if (filters.categorySlug) where.category = { slug: filters.categorySlug };
  if (filters.vendors && filters.vendors.length) where.vendor = { slug: { in: filters.vendors } };
  if (filters.inStock) where.inStock = true;
  if (filters.hasPrice) where.price = { not: null };

  let orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] = {
    name: "asc",
  };
  if (filters.sort === "price-asc") orderBy = [{ price: { sort: "asc", nulls: "last" } }];
  if (filters.sort === "price-desc") orderBy = [{ price: { sort: "desc", nulls: "last" } }];

  return prisma.product.findMany({
    where,
    orderBy,
    include: { category: true, vendor: true },
  });
}

export async function getProductBySlug(slug: string): Promise<ProductWithRel | null> {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true, vendor: true },
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, take = 4) {
  return prisma.product.findMany({
    where: { categoryId, NOT: { id: excludeId } },
    take,
    include: { category: true, vendor: true },
  });
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "asc" },
    take: 8,
    include: { category: true, vendor: true },
  });
}

export async function getAllProductSlugs() {
  return prisma.product.findMany({ select: { slug: true, updatedAt: true } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getPosts() {
  return prisma.post.findMany({ orderBy: { publishedAt: "desc" }, include: { category: true } });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({ where: { slug }, include: { category: true } });
}
