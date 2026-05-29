import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getPostBySlug } from "@/lib/queries";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Статья — Cashes Green Rus";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return ogImage({
    eyebrow: post?.tag || "Блог",
    title: post?.title || "Блог Cashes Green Rus",
    subtitle: post?.excerpt || undefined,
  });
}
