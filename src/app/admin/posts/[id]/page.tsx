import { notFound } from "next/navigation";
import { AdminShell, AdminHeading } from "@/components/admin/AdminShell";
import { PostForm } from "@/components/admin/PostForm";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!post) notFound();
  return (
    <AdminShell>
      <AdminHeading title={`Статья: ${post.title}`} />
      <PostForm post={post} categories={categories} />
    </AdminShell>
  );
}
