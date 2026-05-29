import { requireAdmin } from "@/lib/auth";
import { buildTemplateCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return new Response("Доступ запрещён", { status: 401 });
  }
  const csv = "﻿" + buildTemplateCsv(); // BOM for Excel UTF-8
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="products-template.csv"',
    },
  });
}
