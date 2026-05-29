"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function s(fd: FormData, k: string) {
  return String(fd.get(k) ?? "").trim();
}

export async function saveCategory(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  const data = {
    name: s(fd, "name"),
    slug: s(fd, "slug"),
    icon: s(fd, "icon") || "server",
    sortOrder: parseInt(s(fd, "sortOrder") || "0", 10) || 0,
    description: s(fd, "description") || null,
    seoTitle: s(fd, "seoTitle") || null,
    seoDescription: s(fd, "seoDescription") || null,
  };
  if (id) await prisma.category.update({ where: { id }, data });
  else await prisma.category.create({ data });
  revalidatePath("/admin/categories");
  revalidatePath("/catalog");
}

export async function deleteCategory(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return; // refuse to delete a category that still has products
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}
