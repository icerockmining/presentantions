import { AdminShell, AdminHeading } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { formatRub } from "@/lib/site";
import { OrderStatusSelect, ORDER_STATUSES } from "./StatusControls";

export const dynamic = "force-dynamic";

type StoredItem = { name: string; qty: number; price: number | null; rfq: boolean };
type Customer = { company?: string; contact?: string; email?: string; phone?: string };

export default async function AdminOrders() {
  await requireAdmin();
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell>
      <AdminHeading title={`Заказы (${orders.length})`} />
      {orders.length === 0 ? (
        <p style={{ color: "#6c8584" }}>Заказов пока нет.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {orders.map((o) => {
            const c = (o.customer as Customer) || {};
            const items = (o.items as StoredItem[]) || [];
            return (
              <div key={o.id} className="admin-card">
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{o.number}</div>
                    <div style={{ fontSize: 12.5, color: "#6c8584", marginBottom: 8 }}>{new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(o.createdAt)}</div>
                    <OrderStatusSelect id={o.id} status={ORDER_STATUSES.includes(o.status) ? o.status : "new"} />
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{o.total > 0 ? formatRub(o.total) : "по КП"}</div>
                    <div style={{ fontSize: 12, color: "#6c8584" }}>НДС 22% включён</div>
                  </div>
                </div>
                <div style={{ fontSize: 13.5, color: "#9fb6b5", marginBottom: 10 }}>
                  {[c.company, c.contact, c.email, c.phone].filter(Boolean).join(" · ")}
                </div>
                <ul style={{ fontSize: 13.5, color: "#cfe3e2", paddingLeft: 18 }}>
                  {items.map((it, i) => (
                    <li key={i}>{it.name} × {it.qty} — {it.rfq ? "по запросу" : formatRub(it.price)}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
