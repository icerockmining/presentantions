import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getCategoryBySlug } from "@/lib/queries";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Каталог — Cashes Green Rus";

export default async function Image({ params }: { params: { category: string } }) {
  const cat = await getCategoryBySlug(params.category);
  return ogImage({
    eyebrow: "Каталог",
    title: cat?.name || "Каталог оборудования",
    subtitle: cat?.description || "Серверное и AI-оборудование напрямую с заводов",
  });
}
