import Link from "next/link";
import { AdminShell, AdminHeading } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { quickUpdateProduct, deleteProduct } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { category: true, vendor: true },
  });

  return (
    <AdminShell>
      <AdminHeading
        title={`Товары (${products.length})`}
        action={<Link href="/admin/products/new" className="btn btn-teal btn-sm">+ Новый товар</Link>}
      />
      <div className="admin-card" style={{ padding: 0, overflowX: "auto" }}>
        <table className="admin-table" style={{ minWidth: 900 }}>
          <thead>
            <tr>
              <th>Товар</th>
              <th>Цена ₽</th>
              <th>Badge</th>
              <th>В наличии</th>
              <th>Склад</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ minWidth: 220 }}>
                  <Link href={`/admin/products/${p.id}`} style={{ fontWeight: 600, color: "#fff" }}>{p.name}</Link>
                  <div style={{ fontSize: 12, color: "#6c8584" }}>{p.vendor.name} · {p.category.name} · {p.slug}</div>
                </td>
                <td colSpan={4} style={{ padding: 0 }}>
                  <form action={quickUpdateProduct} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", flexWrap: "wrap" }}>
                    <input type="hidden" name="id" value={p.id} />
                    <input name="price" defaultValue={p.price ?? ""} placeholder="по запросу" className="input" style={{ width: 110 }} />
                    <input name="badge" defaultValue={p.badge ?? ""} placeholder="badge" className="input" style={{ width: 110 }} />
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9fb6b5" }}>
                      <input type="checkbox" name="inStock" defaultChecked={p.inStock} /> в наличии
                    </label>
                    <select name="stockLocation" defaultValue={p.stockLocation} className="input" style={{ width: 110 }}>
                      <option value="moscow">moscow</option>
                      <option value="order">order</option>
                    </select>
                    <button type="submit" className="btn btn-outline btn-sm">Сохранить</button>
                  </form>
                </td>
                <td>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="btn btn-ghost btn-sm" style={{ color: "#e88" }}>Удалить</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 13, color: "#6c8584", marginTop: 14 }}>
        Оставьте поле цены пустым для «Цена по запросу». Открыть карточку — клик по названию.
      </p>
    </AdminShell>
  );
}
