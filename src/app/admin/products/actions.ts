"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}
function optStr(fd: FormData, key: string): string | null {
  const v = str(fd, key);
  return v ? v : null;
}
function optInt(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  if (!v) return null;
  const n = parseInt(v.replace(/\s/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}
function list(fd: FormData, key: string): string[] {
  return str(fd, key)
    .split(/[|,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function saveProduct(fd: FormData) {
  await requireAdmin();
  const id = optStr(fd, "id");

  let specs: object = {};
  const specsRaw = str(fd, "specs");
  if (specsRaw) {
    try {
      specs = JSON.parse(specsRaw);
    } catch {
      redirect(`/admin/products/${id || "new"}?error=specs`);
    }
  }

  const data = {
    sku: optStr(fd, "sku"),
    name: str(fd, "name"),
    slug: str(fd, "slug"),
    subtitle: optStr(fd, "subtitle"),
    categoryId: str(fd, "categoryId"),
    vendorId: str(fd, "vendorId"),
    price: optInt(fd, "price"),
    oldPrice: optInt(fd, "oldPrice"),
    badge: optStr(fd, "badge"),
    inStock: fd.get("inStock") === "on",
    stockLocation: str(fd, "stockLocation") || "order",
    form: optStr(fd, "form"),
    cpu: optStr(fd, "cpu"),
    specs,
    tags: list(fd, "tags"),
    images: list(fd, "images"),
    seoTitle: optStr(fd, "seoTitle"),
    seoDescription: optStr(fd, "seoDescription"),
  };

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({ data });
  }
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  redirect("/admin/products");
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
}

// Quick inline edit of price / stock / badge from the list view.
export async function quickUpdateProduct(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await prisma.product.update({
    where: { id },
    data: {
      price: optInt(fd, "price"),
      badge: optStr(fd, "badge"),
      inStock: fd.get("inStock") === "on",
      stockLocation: str(fd, "stockLocation") || "order",
    },
  });
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
}
