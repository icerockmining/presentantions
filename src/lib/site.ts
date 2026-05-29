// Site-wide constants and helpers.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const VAT_RATE = 22; // НДС 22% (ОСНО), включён в стоимость

export const COMPANY = {
  legalName: "ООО «КЭШЕС ГРИН РУС»",
  brand: "Cashes Green Rus",
  phone: "8 (904) 299-62-01",
  phoneHref: "+79042996201",
  email: "inquiry@cashesgreen.ru",
  address: "Смирновская ул., 2, стр. 1, офис 122",
  city: "Москва",
  postalCode: "115172",
  hours: "Пн–Пт 10:00–19:00",
  domain: "cashesgreen.ru",
};

export function abs(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function formatRub(n: number | null | undefined): string {
  if (n == null) return "Цена по запросу";
  return new Intl.NumberFormat("ru-RU").format(n) + " ₽";
}

// Russian pluralization for "позиция/позиции/позиций"
export function pluralPositions(n: number): string {
  const m = n % 10;
  const h = n % 100;
  if (m === 1 && h !== 11) return "позиция";
  if (m >= 2 && m <= 4 && (h < 10 || h >= 20)) return "позиции";
  return "позиций";
}

export function pluralItems(n: number): string {
  const m = n % 10;
  const h = n % 100;
  if (m === 1 && h !== 11) return "товар";
  if (m >= 2 && m <= 4 && (h < 10 || h >= 20)) return "товара";
  return "товаров";
}
