# Build Brief — Cashes Green Rus Online Store (for Replit / AI agent)

> Hand this file + the standalone prototype (`Магазин — прототип.html`) to Replit.
> The prototype is the **visual source of truth** — match it pixel-for-pixel.
> This brief describes what to build behind it.

---

## 0. What exists vs. what to build

**Provided (design, done):** a fully styled React prototype of the storefront — homepage (3 hero variants), catalog with filters, product page, cart, checkout, RFQ form, compare, and Delivery / Payment / Blog pages. Dark premium theme. All in `ui_kits/shop/`.

**To build:** a real, deployed store with a database, admin panel, working cart/checkout, payment, and order routing. Reuse the prototype's exact visual design.

---

## 1. Recommended stack (Replit-friendly)

- **Frontend:** Next.js (App Router) + React + TypeScript. Port the prototype's components 1:1.
- **Backend:** Next.js API routes (or a small Express service).
- **DB:** PostgreSQL (Replit has built-in Postgres) via Prisma ORM.
- **Auth (admin):** simple email+password for staff; customers don't strictly need accounts (B2B leads come via cart/RFQ).
- **Styling:** keep the inline-style / token approach OR migrate to Tailwind using the tokens in §5.
- **Hosting:** Replit Deployments.

---

## 2. Brand tokens (must match exactly)

```
Font:           Manrope (Google Fonts), weights 400/500/600/700/800. Fallback: Onest.
Canvas bg:      #07111a        Surface bg:   rgba(255,255,255,0.03)
Brand teal:     #005A59        Teal accent:  #2a9f9e   Teal light: #5bd0ce / #c3e6e5
Text:           #e2eeee (body) #fff (headings) #8aa3a2 (muted) #6c8584 (faint)
Border:         rgba(255,255,255,0.08)
Semantic:       success #1a7a50 · error #b83232 · warning #b87820 · gold #d6a028
Radius:         sm 8 · md 10 · lg 14-16 · pill 999
```
Full token reference: `/colors_and_type.css` and `/brandbook.html` at project root.

---

## 3. Data model (Prisma-ish)

```
Category   { id, name, slug, icon, sortOrder }
Vendor     { id, name, slug, logoUrl }
Product    {
  id, sku, name, slug, subtitle,
  categoryId, vendorId,
  price (nullable → "Цена по запросу"),  oldPrice (nullable),
  currency = "RUB",
  badge (nullable: "Хит" | "Hi-Care 5 лет" | "Топ AI" | "В наличии" | ...),
  inStock (bool),
  stockLocation ("moscow" | "order"),   // ← склад в Москве vs под заказ
  specs (JSON: { "Форм-фактор": "2U Rack", ... }),
  tags (string[]),
  images (string[])
}
Order      { id, number, status, customer(JSON), items(JSON), total, vatIncluded, createdAt }
Lead/RFQ   { id, company, contact, email, phone, category, message, createdAt, status }
Post       { id, title, slug, excerpt, body, categoryId, coverUrl, publishedAt, readMins }
```
Seed data: 17 products across 5 categories — see `ui_kits/shop/data.js` (copy verbatim as seed).

---

## 4. Pages & routes (all in prototype)

| Route | Page | Notes |
|---|---|---|
| `/` | Home | 3 hero variants — pick variant A as default (others optional A/B) |
| `/catalog` `/catalog/[cat]` | Catalog | filters: category, vendor, inStock, hasPrice; sort by price. Promo banners. |
| `/product/[slug]` | Product | gallery, specs table, tabs (Характеристики / Доставка / Гарантия), related |
| `/cart` → `/checkout` | Cart + Checkout | 3-step: contacts → delivery → payment. Mixed cart (priced + "по запросу"). |
| `/compare` | Compare | up to 4 products, spec-by-spec table |
| `/rfq` | Запрос КП | lead form → saves Lead, emails manager |
| `/delivery` `/payment` `/blog` | Static-ish | content pages, already designed |

---

## 5. Business logic (CRITICAL — B2B specifics)

1. **Pricing in RUB by CBR rate.** Prices stored in RUB. If you store base price in another currency, recompute daily via CBR API (`https://www.cbr-xml-daily.ru/daily_json.js`). Display "по курсу ЦБ РФ".
2. **VAT 22% included** (ОСНО). Show "НДС 22% включён".
3. **"Цена по запросу"** — products with `price = null` cannot be bought directly; their cart action is **"Запросить"** → routed as an RFQ, not a paid order.
4. **Two fulfilment paths:** `stockLocation = "moscow"` → in stock, ship immediately (самовывоз/доставка). `"order"` → import, ~57 days. Surface this on product + catalog.
5. **Payment methods:**
   - Безналичный (юр. лица): generate invoice (счёт) with VAT. Integrate **ЮKassa / Тинькофф / Сбербанк** for B2B invoicing.
   - Онлайн-касса (физ. лица): payment link via the same provider.
   - Отсрочка: flag on customer (postpaid), manager-approved.
6. **100% prepayment** default; postpaid only for trusted customers.
7. **Orders & RFQs route to a manager** (email + admin panel). Optionally push to CRM (Битрикс24 / amoCRM).

---

## 6. Company facts (use across site)

- ООО «КЭШЕС ГРИН РУС» · Москва
- **Офис и склад (один адрес):** Смирновская ул., 2, стр. 1, офис 122
- Телефон: 8 (904) 299-62-01 · Email: inquiry@cashesgreen.ru · Пн–Пт 10:00–19:00
- Оборот **более 1 млрд ₽ в год** · 15+ лет на рынке · средний срок импорта 57 дней (63% раньше)
- Вендоры: Dell, HPE, Lenovo, Huawei, Cisco, NVIDIA, XFusion, NetApp, Supermicro, IBM, Broadcom, Inspur
- Warranty: 1 год (опц. до 5); Huawei Hi-Care до 5 лет; Lenovo — склад ЗИП в РФ
- Проверка до отгрузки с логами; договор с НДС; полное документальное сопровождение

---

## 7. Admin panel (minimum)

CRUD for Products, Categories, Vendors, Posts; view/manage Orders and RFQs; edit stock & prices; toggle `stockLocation` and `badge`.

---

## 8. Build order for the agent

1. Scaffold Next.js + Prisma + Postgres; add Manrope + tokens; port shared UI (header, footer, product card, buttons, badges, icons) from `ShopUI.jsx`.
2. Seed Categories/Vendors/Products from `data.js`.
3. Build Catalog + Product (read-only) → verify against prototype.
4. Cart + Checkout + RFQ (write path) → save Orders/Leads.
5. Delivery / Payment / Blog pages.
6. Payment provider integration (ЮKassa recommended) + invoice generation.
7. Admin panel.
8. Deploy on Replit; connect domain.

Keep every screen visually identical to the prototype. When in doubt, open the prototype and copy the markup/styles.
