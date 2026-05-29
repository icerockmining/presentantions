"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function s(fd: FormData, k: string) {
  return String(fd.get(k) ?? "").trim();
}

export async function savePost(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  const publishedAt = s(fd, "publishedAt");
  const data = {
    title: s(fd, "title"),
    slug: s(fd, "slug"),
    excerpt: s(fd, "excerpt"),
    body: s(fd, "body"),
    categoryId: s(fd, "categoryId") || null,
    tag: s(fd, "tag") || null,
    readMins: parseInt(s(fd, "readMins") || "5", 10) || 5,
    publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
  };
  if (id) await prisma.post.update({ where: { id }, data });
  else await prisma.post.create({ data });
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  redirect("/admin/posts");
}

export async function deletePost(fd: FormData) {
  await requireAdmin();
  await prisma.post.delete({ where: { id: s(fd, "id") } });
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}
