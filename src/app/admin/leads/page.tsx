import { AdminShell, AdminHeading } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLeads() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell>
      <AdminHeading title={`Заявки на КП (${leads.length})`} />
      {leads.length === 0 ? (
        <p style={{ color: "#6c8584" }}>Заявок пока нет.</p>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="admin-table" style={{ minWidth: 800 }}>
            <thead><tr><th>Дата</th><th>Контакт</th><th>Компания</th><th>Категория</th><th>Сообщение</th></tr></thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td style={{ whiteSpace: "nowrap" }}>{new Intl.DateTimeFormat("ru-RU", { dateStyle: "short", timeStyle: "short" }).format(l.createdAt)}</td>
                  <td>
                    <div style={{ color: "#fff" }}>{l.contact}</div>
                    <div style={{ fontSize: 12.5, color: "#6c8584" }}>{l.email}{l.phone ? ` · ${l.phone}` : ""}</div>
                  </td>
                  <td>{l.company || "—"}</td>
                  <td>{l.category || "—"}</td>
                  <td style={{ maxWidth: 320, fontSize: 13 }}>{l.message || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
