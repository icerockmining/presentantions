import { AdminShell, AdminHeading } from "@/components/admin/AdminShell";
import { PostForm } from "@/components/admin/PostForm";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewPost() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <AdminShell>
      <AdminHeading title="Новая статья" />
      <PostForm categories={categories} />
    </AdminShell>
  );
}
