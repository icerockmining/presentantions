import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/catalog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/delivery`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/payment`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/rfq`, changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const [categories, products, posts] = await Promise.all([
      prisma.category.findMany({ select: { slug: true } }),
      prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.post.findMany({ select: { slug: true, publishedAt: true } }),
    ]);

    const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${SITE_URL}/catalog/${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.publishedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [...staticEntries, ...categoryEntries, ...productEntries, ...postEntries];
  } catch {
    return staticEntries;
  }
}
