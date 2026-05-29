import { AdminShell, AdminHeading } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveCategory, deleteCategory } from "./actions";

export const dynamic = "force-dynamic";

const ICONS = ["server", "storage", "network", "gpu", "parts"];

export default async function AdminCategories() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  const cell = (name: string, defVal: string | number, w = 110) => (
    <input name={name} defaultValue={defVal} className="input" style={{ width: w }} />
  );

  return (
    <AdminShell>
      <AdminHeading title={`Категории (${categories.length})`} />
      <div className="admin-card" style={{ padding: 0, overflowX: "auto", marginBottom: 24 }}>
        <table className="admin-table" style={{ minWidth: 800 }}>
          <thead>
            <tr><th>Название</th><th>Slug</th><th>Иконка</th><th>Порядок</th><th>Товаров</th><th></th></tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td colSpan={4} style={{ padding: 0 }}>
                  <form action={saveCategory} style={{ display: "flex", gap: 8, padding: "10px 14px", alignItems: "center", flexWrap: "wrap" }}>
                    <input type="hidden" name="id" value={c.id} />
                    {cell("name", c.name, 160)}
                    {cell("slug", c.slug)}
                    <select name="icon" defaultValue={c.icon} className="input" style={{ width: 110 }}>
                      {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                    {cell("sortOrder", c.sortOrder, 70)}
                    <button type="submit" className="btn btn-outline btn-sm">Сохранить</button>
                  </form>
                </td>
                <td>{c._count.products}</td>
                <td>
                  <form action={deleteCategory}>
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" disabled={c._count.products > 0} className="btn btn-ghost btn-sm" style={{ color: c._count.products > 0 ? "#4a6362" : "#e88" }}>Удалить</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Новая категория</h2>
        <form action={saveCategory} className="field-grid" style={{ gap: 14 }}>
          <input name="name" placeholder="Название" required className="input" />
          <input name="slug" placeholder="slug" required className="input" />
          <select name="icon" className="input">{ICONS.map((i) => <option key={i} value={i}>{i}</option>)}</select>
          <input name="sortOrder" placeholder="Порядок" className="input" />
          <input name="description" placeholder="Описание" className="input" style={{ gridColumn: "1 / -1" }} />
          <button type="submit" className="btn btn-teal btn-md" style={{ gridColumn: "1 / -1", width: "fit-content" }}>Добавить</button>
        </form>
      </div>
    </AdminShell>
  );
}
