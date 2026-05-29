import { AdminShell, AdminHeading } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewProduct() {
  const [categories, vendors] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.vendor.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <AdminShell>
      <AdminHeading title="Новый товар" />
      <ProductForm categories={categories} vendors={vendors} />
    </AdminShell>
  );
}
