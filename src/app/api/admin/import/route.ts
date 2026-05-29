import { NextResponse } from "next/server";
import { getAdminId } from "@/lib/auth";
import { decodeBuffer, parseCsv, importRows, type Encoding } from "@/lib/csv";

export const dynamic = "force-dynamic";

const MAX_CSV_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(req: Request) {
  // API route: respond with 401 rather than redirect (no page navigation here).
  if (!(await getAdminId())) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const encoding = (String(form.get("encoding") || "auto") as Encoding);
  const delimiterChoice = String(form.get("delimiter") || "auto");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не загружен" }, { status: 400 });
  }

  // Reject oversized files before reading them into memory.
  if (file.size > MAX_CSV_BYTES) {
    return NextResponse.json(
      { error: `Файл слишком большой (${(file.size / 1024 / 1024).toFixed(1)} МБ). Максимум — 8 МБ.` },
      { status: 413 }
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const text = decodeBuffer(buf, encoding);
  const delimiter =
    delimiterChoice === "auto" ? undefined : delimiterChoice === "tab" ? "\t" : delimiterChoice;

  const parsed = parseCsv(text, delimiter);

  const missing = ["name", "category", "vendor"].filter((c) => !parsed.headers.includes(c));
  if (missing.length) {
    return NextResponse.json(
      { error: `Отсутствуют обязательные колонки: ${missing.join(", ")}. Найдены: ${parsed.headers.join(", ") || "(нет)"}` },
      { status: 400 }
    );
  }

  const reports = await importRows(parsed.rows);
  const summary = {
    created: reports.filter((r) => r.action === "created").length,
    updated: reports.filter((r) => r.action === "updated").length,
    skipped: reports.filter((r) => r.action === "skipped").length,
    error: reports.filter((r) => r.action === "error").length,
  };

  return NextResponse.json({ ok: true, delimiter: parsed.delimiter, summary, reports });
}
