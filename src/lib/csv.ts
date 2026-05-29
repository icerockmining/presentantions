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
  const cleaned = t.replace(/[\s ]/g, "");
  if (!/^-?\d+$/.test(cleaned)) return { ok: false };
  return { ok: true, value: parseInt(cleaned, 10) };
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

  const reports: RowReport[] = [];
  const usedSlugs = new Set<string>();

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
      const stockLocation = stockLocationRaw || "order";
      if (stockLocation !== "moscow" && stockLocation !== "order") {
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

      // Generate slug from name if empty; resolve collisions within the file.
      if (!slug) {
        const base = slugify(name);
        let candidate = base;
        let n = 2;
        while (usedSlugs.has(candidate)) candidate = `${base}-${n++}`;
        slug = candidate;
      }
      usedSlugs.add(slug);

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
        stockLocation,
        form: get("form") || null,
        cpu: get("cpu") || null,
        specs,
        tags: parsePipeList(get("tags")),
        images: parsePipeList(get("images")),
      };

      // Upsert by sku (if given) else by slug.
      const existing = sku
        ? await prisma.product.findUnique({ where: { sku } })
        : await prisma.product.findUnique({ where: { slug } });

      if (existing) {
        await prisma.product.update({ where: { id: existing.id }, data: { ...data, slug: existing.slug } });
        reports.push({ line, key, action: "updated", message: "Обновлён" });
      } else {
        await prisma.product.create({ data: { ...data, slug } });
        reports.push({ line, key, action: "created", message: "Создан" });
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
