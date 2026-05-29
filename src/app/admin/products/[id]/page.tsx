import { notFound } from "next/navigation";
import { AdminShell, AdminHeading } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EditProduct({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const [product, categories, vendors] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.vendor.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <AdminShell>
      <AdminHeading title={`Товар: ${product.name}`} />
      <ProductForm product={product} categories={categories} vendors={vendors} error={error} />
    </AdminShell>
  );
}
