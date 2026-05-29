import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Returns product details for the given slugs (used by the client compare page).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slugs = (searchParams.get("slugs") || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
  if (slugs.length === 0) return NextResponse.json({ products: [] });

  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    include: { category: true, vendor: true },
  });

  // Preserve incoming order.
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const ordered = slugs.map((s) => bySlug.get(s)).filter(Boolean);

  return NextResponse.json({
    products: ordered.map((p) => ({
      slug: p!.slug,
      name: p!.name,
      price: p!.price,
      inStock: p!.inStock,
      stockLocation: p!.stockLocation,
      vendorName: p!.vendor.name,
      categoryName: p!.category.name,
      categoryIcon: p!.category.icon,
      specs: p!.specs,
    })),
  });
}
