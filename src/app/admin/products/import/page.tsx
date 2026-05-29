import { AdminShell, AdminHeading } from "@/components/admin/AdminShell";
import { ImportClient } from "@/components/admin/ImportClient";
import { CSV_COLUMNS } from "@/lib/csv";

export const dynamic = "force-dynamic";

export default function ImportPage() {
  return (
    <AdminShell>
      <AdminHeading title="Импорт товаров из CSV" />
      <p style={{ fontSize: 14, color: "#8aa3a2", lineHeight: 1.6, marginBottom: 8, maxWidth: 720 }}>
        Поддерживается UTF-8 и Windows-1251 (автоопределение), разделители «,», «;» и табуляция.
        Upsert по <code>sku</code>, иначе по <code>slug</code>. Пустой slug генерируется из названия.
        Колонки <code>tags</code> и <code>images</code> — значения через «|», <code>specs</code> — JSON-объект.
      </p>
      <p style={{ fontSize: 13, color: "#6c8584", marginBottom: 24, maxWidth: 720 }}>
        Колонки: {(CSV_COLUMNS as readonly string[]).join(", ")}.
      </p>
      <ImportClient />
    </AdminShell>
  );
}
