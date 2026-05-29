import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Badge } from "@/components/Badge";
import { CtaStrip } from "@/components/sections";
import { JsonLd, breadcrumbLd, blogPostingLd } from "@/lib/jsonld";
import { getPostBySlug, getPosts } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: { url: canonical, title: post.title, description: post.excerpt, type: "article", publishedTime: post.publishedAt.toISOString() },
  };
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.body.split("\n\n");

  return (
    <div className="container" style={{ padding: "36px 32px 80px" }}>
      <JsonLd
        data={breadcrumbLd([
          { name: "Главная", url: "/" },
          { name: "Блог", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ])}
      />
      <JsonLd data={blogPostingLd(post)} />

      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span>/</span>
        <Link href="/blog">Блог</Link>
        <span>/</span>
        <span style={{ color: "#9fb6b5" }}>{post.title}</span>
      </nav>

      <article style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {post.tag && <Badge tone="teal">{post.tag}</Badge>}
        </div>
        <h1 style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 16 }}>{post.title}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13.5, color: "#6c8584", marginBottom: 28 }}>
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span>{post.readMins} мин чтения</span>
        </div>
        <div style={{ borderRadius: 18, border: "1px solid var(--border)", background: "radial-gradient(ellipse at 60% 40%, #143352 0%, #0a141e 80%)", height: 280, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
          <Icon name={post.category?.icon || "doc"} size={96} stroke="var(--accent)" sw={0.8} />
        </div>
        <div style={{ fontSize: 17, lineHeight: 1.75 }}>
          {paragraphs.map((p, i) => (
            <p key={i} style={{ marginBottom: 18, color: "#bcd0cf" }}>{p}</p>
          ))}
        </div>
      </article>

      <div style={{ marginTop: 56 }}>
        <CtaStrip title="Подобрать оборудование под задачу?" sub="Эксперты помогут с конфигурацией и подготовят КП." />
      </div>
    </div>
  );
}
