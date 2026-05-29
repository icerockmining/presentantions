import Link from "next/link";
import { AdminShell, AdminHeading } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await requireAdmin();
  const [products, categories, vendors, posts, orders, leads] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.vendor.count(),
    prisma.post.count(),
    prisma.order.count(),
    prisma.lead.count(),
  ]);

  const stats = [
    { label: "Товары", value: products, href: "/admin/products" },
    { label: "Категории", value: categories, href: "/admin/categories" },
    { label: "Вендоры", value: vendors, href: "/admin/vendors" },
    { label: "Статьи", value: posts, href: "/admin/posts" },
    { label: "Заказы", value: orders, href: "/admin/orders" },
    { label: "Заявки (КП)", value: leads, href: "/admin/leads" },
  ];

  return (
    <AdminShell>
      <AdminHeading title="Обзор" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="admin-card" style={{ display: "block" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>{s.value}</div>
            <div style={{ fontSize: 13.5, color: "#8aa3a2", marginTop: 4 }}>{s.label}</div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
