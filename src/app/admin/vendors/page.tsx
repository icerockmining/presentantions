import { AdminShell, AdminHeading } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { saveVendor, deleteVendor } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminVendors() {
  const vendors = await prisma.vendor.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <AdminShell>
      <AdminHeading title={`Вендоры (${vendors.length})`} />
      <div className="admin-card" style={{ padding: 0, overflowX: "auto", marginBottom: 24 }}>
        <table className="admin-table" style={{ minWidth: 700 }}>
          <thead>
            <tr><th>Название</th><th>Slug</th><th>Логотип (URL)</th><th>Товаров</th><th></th></tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id}>
                <td colSpan={3} style={{ padding: 0 }}>
                  <form action={saveVendor} style={{ display: "flex", gap: 8, padding: "10px 14px", alignItems: "center", flexWrap: "wrap" }}>
                    <input type="hidden" name="id" value={v.id} />
                    <input name="name" defaultValue={v.name} className="input" style={{ width: 160 }} />
                    <input name="slug" defaultValue={v.slug} className="input" style={{ width: 120 }} />
                    <input name="logoUrl" defaultValue={v.logoUrl || ""} className="input" style={{ width: 200 }} />
                    <button type="submit" className="btn btn-outline btn-sm">Сохранить</button>
                  </form>
                </td>
                <td>{v._count.products}</td>
                <td>
                  <form action={deleteVendor}>
                    <input type="hidden" name="id" value={v.id} />
                    <button type="submit" disabled={v._count.products > 0} className="btn btn-ghost btn-sm" style={{ color: v._count.products > 0 ? "#4a6362" : "#e88" }}>Удалить</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Новый вендор</h2>
        <form action={saveVendor} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input name="name" placeholder="Название" required className="input" style={{ width: 200 }} />
          <input name="slug" placeholder="slug" required className="input" style={{ width: 160 }} />
          <input name="logoUrl" placeholder="/vendors/x.svg" className="input" style={{ width: 200 }} />
          <button type="submit" className="btn btn-teal btn-md">Добавить</button>
        </form>
      </div>
    </AdminShell>
  );
}
