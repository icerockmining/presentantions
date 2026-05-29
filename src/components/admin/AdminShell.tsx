import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminId, logout } from "@/lib/auth";

async function logoutAction() {
  "use server";
  await logout();
  redirect("/admin/login");
}

const NAV = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/products/import", label: "Импорт CSV" },
  { href: "/admin/categories", label: "Категории" },
  { href: "/admin/vendors", label: "Вендоры" },
  { href: "/admin/posts", label: "Блог" },
  { href: "/admin/orders", label: "Заказы" },
  { href: "/admin/leads", label: "Заявки (КП)" },
];

// Wraps every protected admin page: verifies auth and renders the sidebar shell.
export async function AdminShell({ children }: { children: React.ReactNode }) {
  const adminId = await getAdminId();
  if (!adminId) redirect("/admin/login");

  return (
    <div className="container admin-grid" style={{ padding: "32px 32px 80px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 32, alignItems: "start" }}>
      <aside style={{ position: "sticky", top: 24, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 14, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#6c8584", padding: "8px 10px 12px" }}>Админка</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} style={{ fontSize: 14, color: "#cfe3e2", padding: "9px 10px", borderRadius: 8 }} className="link-muted">
              {n.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <button type="submit" className="btn btn-ghost btn-sm btn-full">Выйти</button>
        </form>
      </aside>
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}

export function AdminHeading({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{title}</h1>
      {action}
    </div>
  );
}
