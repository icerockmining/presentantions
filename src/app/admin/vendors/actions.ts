"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function s(fd: FormData, k: string) {
  return String(fd.get(k) ?? "").trim();
}

export async function saveVendor(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  const data = { name: s(fd, "name"), slug: s(fd, "slug"), logoUrl: s(fd, "logoUrl") || null };
  if (id) await prisma.vendor.update({ where: { id }, data });
  else await prisma.vendor.create({ data });
  revalidatePath("/admin/vendors");
}

export async function deleteVendor(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  const count = await prisma.product.count({ where: { vendorId: id } });
  if (count > 0) return;
  await prisma.vendor.delete({ where: { id } });
  revalidatePath("/admin/vendors");
}
