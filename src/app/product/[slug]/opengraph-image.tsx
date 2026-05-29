import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getProductBySlug } from "@/lib/queries";
import { formatRub } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Товар — Cashes Green Rus";

export default async function Image({ params }: { params: { slug: string } }) {
  const p = await getProductBySlug(params.slug);
  if (!p) {
    return ogImage({ eyebrow: "Каталог", title: "Cashes Green Rus" });
  }
  return ogImage({
    eyebrow: `${p.category.name} · ${p.vendor.name}`,
    title: p.name,
    subtitle: p.subtitle || undefined,
    price: p.price != null ? formatRub(p.price) : "Цена по запросу",
  });
}
