import iconv from "iconv-lite";
import Papa from "papaparse";
import { prisma } from "./prisma";

export type Encoding = "auto" | "utf-8" | "win1251";

export const CSV_COLUMNS = [
  "sku",
  "name",
  "slug",
  "subtitle",
  "category",
  "vendor",
  "price",
  "oldPrice",
  "badge",
  "inStock",
  "stockLocation",
  "form",
  "cpu",
  "tags",
  "images",
  "specs",
] as const;

export type RowAction = "created" | "updated" | "skipped" | "error";

export type RowReport = {
  line: number;
  key: string;
  action: RowAction;
  message: string;
};

// ─── Encoding ──────────────────────────────────────────────────
export function decodeBuffer(buf: Buffer, encoding: Encoding): string {
  if (encoding === "win1251") return iconv.decode(buf, "win1251");
  if (encoding === "utf-8") return stripBom(buf.toString("utf-8"));

  // auto: BOM → utf-8; else heuristic for cyrillic in cp1251.
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    return stripBom(buf.toString("utf-8"));
  }
  const asUtf8 = buf.toString("utf-8");
  // U+FFFD replacement char count signals broken utf-8 decode.
  const replacements = (asUtf8.match(/�/g) || []).length;
  if (replacements > 0) return iconv.decode(buf, "win1251");
  return asUtf8;
}

function stripBom(s: string): string {
  return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

// ─── Delimiter detection ───────────────────────────────────────
export function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r?\n/, 1)[0] || "";
  const counts: Record<string, number> = {
    ";": (firstLine.match(/;/g) || []).length,
    ",": (firstLine.match(/,/g) || []).length,
    "\t": (firstLine.match(/\t/g) || []).length,
  };
  let best = ",";
  let bestN = -1;
  for (const [d, n] of Object.entries(counts)) {
    if (n > bestN) {
      best = d;
      bestN = n;
    }
  }
  return best;
}

// ─── CSV injection sanitization ────────────────────────────────
const INJECTION_RE = /^[=+\-@\t\r]/;
export function sanitizeCell(value: string): string {
  if (value && INJECTION_RE.test(value)) return `'${value}`;
  return value;
}

// ─── Transliteration for slug generation ───────────────────────
const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i",
  й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
  у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "",
  э: "e", ю: "yu", я: "ya",
};

export function slugify(input: string): string {
  const lower = input.toLowerCase().trim();
  let out = "";
  for (const ch of lower) {
    if (TRANSLIT[ch] !== undefined) out += TRANSLIT[ch];
    else if (/[a-z0-9]/.test(ch)) out += ch;
    else out += "-";
  }
  return out.replace(/-+/g, "-").replace(/^-|-$/g, "") || "item";
}

// ─── Value parsers ─────────────────────────────────────────────
const TRUE_VALUES = new Set(["true", "1", "да", "yes", "y", "истина"]);

export function parseBool(v: string): boolean {
  return TRUE_VALUES.has(v.trim().toLowerCase());
}

export function parseIntOrNull(v: string): { ok: true; value: number | null } | { ok: false } {
  const t = v.trim();
  if (!t) return { ok: true, value: null };
  // Allow space / non-breaking space ONLY as a thousands separator between digit
  // groups (e.g. "1 234 567"). Any other internal whitespace (e.g. "1 2 3") is
  // invalid and surfaces as a row error — never silently glued into one number.
  const THOUSANDS = /^-?\d{1,3}(?:[  ]\d{3})*$/;
  if (THOUSANDS.test(t)) {
    return { ok: true, value: parseInt(t.replace(/[  ]/g, ""), 10) };
  }
  if (/^-?\d+$/.test(t)) return { ok: true, value: parseInt(t, 10) };
  return { ok: false };
}

export function parsePipeList(v: string): string[] {
  return v
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ─── Import ────────────────────────────────────────────────────
export type ParsedCsv = {
  delimiter: string;
  headers: string[];
  rows: Record<string, string>[];
};

export function parseCsv(text: string, delimiter?: string): ParsedCsv {
  const delim = delimiter || detectDelimiter(text);
  const result = Papa.parse<Record<string, string>>(text, {
    delimiter: delim,
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  const headers = result.meta.fields || [];
  return { delimiter: delim, headers, rows: result.data };
}

export async function importRows(rows: Record<string, string>[]): Promise<RowReport[]> {
  // Resolve categories/vendors once by slug AND name (case-insensitive).
  const [categories, vendors] = await Promise.all([
    prisma.category.findMany(),
    prisma.vendor.findMany(),
  ]);
  const catIndex = new Map<string, string>();
  for (const c of categories) {
    catIndex.set(c.slug.toLowerCase(), c.id);
    catIndex.set(c.name.toLowerCase(), c.id);
  }
  const vendorIndex = new Map<string, string>();
  for (const v of vendors) {
    vendorIndex.set(v.slug.toLowerCase(), v.id);
    vendorIndex.set(v.name.toLowerCase(), v.id);
  }

  // Preload all existing product slugs so generated slugs never collide with the DB
  // (avoids P2002 on create). We grow this set as we generate/insert.
  const existingSlugs = new Set<string>(
    (await prisma.product.findMany({ select: { slug: true } })).map((p) => p.slug.toLowerCase())
  );

  const reports: RowReport[] = [];
  // Effective key (sku, else final slug) already seen in THIS file. Dedup policy:
  // last row wins (it overwrites via upsert); the duplicate row is reported with a
  // note so the operator knows an earlier row in the same file was overwritten.
  const seenKeys = new Set<string>();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const line = i + 2; // header is line 1
    const get = (k: string) => (row[k] ?? "").toString().trim();

    const name = get("name");
    const sku = get("sku");
    let slug = get("slug");
    const key = sku || slug || name || `строка ${line}`;

    try {
      if (!name) {
        reports.push({ line, key, action: "error", message: "Пустое поле name" });
        continue;
      }

      const catKey = get("category").toLowerCase();
      const vendorKey = get("vendor").toLowerCase();
      const categoryId = catIndex.get(catKey);
      const vendorId = vendorIndex.get(vendorKey);
      if (!categoryId) {
        reports.push({ line, key, action: "error", message: `Категория не найдена: «${get("category")}»` });
        continue;
      }
      if (!vendorId) {
        reports.push({ line, key, action: "error", message: `Вендор не найден: «${get("vendor")}»` });
        continue;
      }

      const priceParsed = parseIntOrNull(get("price"));
      if (!priceParsed.ok) {
        reports.push({ line, key, action: "error", message: "price должно быть целым числом" });
        continue;
      }
      const oldPriceParsed = parseIntOrNull(get("oldPrice"));
      if (!oldPriceParsed.ok) {
        reports.push({ line, key, action: "error", message: "oldPrice должно быть целым числом" });
        continue;
      }

      const stockLocationRaw = get("stockLocation").toLowerCase();
      // Empty cell is allowed: on CREATE it defaults to "order", on UPDATE the
      // existing value is preserved (handled below — we don't overwrite it).
      const stockLocationProvided = stockLocationRaw !== "";
      if (stockLocationProvided && stockLocationRaw !== "moscow" && stockLocationRaw !== "order") {
        reports.push({ line, key, action: "error", message: "stockLocation ∈ {moscow, order}" });
        continue;
      }

      let specs: object = {};
      const specsRaw = get("specs");
      if (specsRaw) {
        try {
          const parsed = JSON.parse(specsRaw);
          if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error("not object");
          specs = parsed;
        } catch {
          reports.push({ line, key, action: "error", message: "specs должен быть JSON-объектом" });
          continue;
        }
      }

      // Resolve the target row first (upsert by sku if given, else by slug).
      const existing = sku
        ? await prisma.product.findUnique({ where: { sku } })
        : slug
          ? await prisma.product.findUnique({ where: { slug } })
          : null;

      // Generate slug from name if empty (create path only). Resolve collisions
      // against BOTH this file's slugs and existing DB slugs, so create never hits P2002.
      if (!slug) {
        if (existing) {
          slug = existing.slug;
        } else {
          const base = slugify(name);
          let candidate = base;
          let n = 2;
          while (existingSlugs.has(candidate.toLowerCase())) candidate = `${base}-${n++}`;
          slug = candidate;
        }
      }

      // Effective dedup key within this file.
      const effKey = (sku || slug).toLowerCase();
      const duplicateInFile = seenKeys.has(effKey);
      seenKeys.add(effKey);

      const data = {
        sku: sku || null,
        name,
        subtitle: get("subtitle") || null,
        categoryId,
        vendorId,
        price: priceParsed.value,
        oldPrice: oldPriceParsed.value,
        badge: get("badge") || null,
        inStock: parseBool(get("inStock")),
        form: get("form") || null,
        cpu: get("cpu") || null,
        specs,
        tags: parsePipeList(get("tags")),
        images: parsePipeList(get("images")),
      };

      if (existing) {
        // On update keep existing stockLocation when the cell is empty (item 14).
        const updateData = stockLocationProvided
          ? { ...data, stockLocation: stockLocationRaw }
          : data;
        await prisma.product.update({ where: { id: existing.id }, data: { ...updateData, slug: existing.slug } });
        existingSlugs.add(existing.slug.toLowerCase());
        reports.push({
          line,
          key,
          action: "updated",
          message: duplicateInFile ? "Обновлён (перезапись дубля из этого файла)" : "Обновлён",
        });
      } else {
        await prisma.product.create({
          data: { ...data, slug, stockLocation: stockLocationProvided ? stockLocationRaw : "order" },
        });
        existingSlugs.add(slug.toLowerCase());
        reports.push({
          line,
          key,
          action: "created",
          message: duplicateInFile ? "Создан (перезапись дубля из этого файла)" : "Создан",
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Неизвестная ошибка";
      reports.push({ line, key, action: "error", message: msg });
    }
  }

  return reports;
}

// ─── Report / template generation (sanitized) ──────────────────
export function buildReportCsv(reports: RowReport[]): string {
  const header = ["line", "key", "action", "message"];
  const lines = [header.join(",")];
  for (const r of reports) {
    const cells = [String(r.line), r.key, r.action, r.message].map((c) => csvCell(c));
    lines.push(cells.join(","));
  }
  return lines.join("\r\n");
}

export function buildTemplateCsv(): string {
  const header = (CSV_COLUMNS as readonly string[]).join(",");
  const example = [
    "SRV-001",
    "Dell PowerEdge R760",
    "dell-r760-example",
    "Стоечный сервер 2U",
    "servers",
    "dell",
    "1290000",
    "1450000",
    "Хит",
    "да",
    "moscow",
    "rack",
    "Xeon",
    "DDR5|NVMe|Original",
    "https://example.com/1.jpg|https://example.com/2.jpg",
    '{""Форм-фактор"":""2U Rack"",""Память"":""до 8 ТБ DDR5""}',
  ].map((c) => csvCell(c));
  return [header, example.join(",")].join("\r\n");
}

function csvCell(value: string): string {
  const sanitized = sanitizeCell(value);
  if (/[",\r\n;]/.test(sanitized)) {
    return `"${sanitized.replace(/"/g, '""')}"`;
  }
  return sanitized;
}
