# Cashes Green Rus — спецификация интернет-магазина

> Консолидированная спецификация. Источник истины по дизайну — `_design/prototype-store.html`
> (распакованные исходники в `_design/prototype-src/`). Бриф заказчика — `_design/BUILD_BRIEF.md`.
> Брендбук — `_design/brandbook.html`. Дизайн портировать 1:1.

## Принятые решения (подтверждены заказчиком)

1. **Стек:** Next.js (App Router) + React + TypeScript + Prisma ORM.
2. **БД:** PostgreSQL. Локально для разработки в этом контейнере поднят Postgres:
   `DATABASE_URL="postgresql://postgres@127.0.0.1:5432/cgr_shop"`.
   Для продакшена заказчик задаст свой `DATABASE_URL`.
3. **Оплата:** в первой версии — ЗАГОТОВКА. Чекаут сохраняет заказ и формирует счёт
   (данные для счёта с НДС), реальные платежи (ЮKassa и т.п.) НЕ интегрируются —
   только аккуратная точка расширения (interface PaymentProvider + заглушка).
4. **Приоритеты заказчика (явно):**
   - самописный магазин (без готовых CMS типа Bitrix/Shopify);
   - **максимальная SEO-оптимизация** (см. раздел SEO);
   - управление товарами (админка с CRUD);
   - **импорт товаров из CSV**.

## Локальный запуск Postgres (для агента в этом контейнере)

Postgres 16 уже инициализирован и запущен под пользователем `postgres`:
```
PGBIN=/usr/lib/postgresql/16/bin
PGDATA=/tmp/pgdata   (socket: /tmp/pgrun, TCP 127.0.0.1:5432, auth=trust)
# если упал — перезапуск:
su postgres -c "$PGBIN/pg_ctl -D /tmp/pgdata -o '-p 5432 -k /tmp/pgrun' -l /tmp/pg.log start"
```
База `cgr_shop` создана. Подключение: `postgresql://postgres@127.0.0.1:5432/cgr_shop`.

## SEO — «самая крутая версия» (обязательно)

- **SSR/SSG** всех публичных страниц через App Router; динамика товаров/категорий через
  `generateStaticParams` + ISR (revalidate).
- **Метаданные** на каждой странице через `generateMetadata`: уникальные title/description,
  canonical, Open Graph, Twitter Card. Шаблон title: `%s — Cashes Green Rus`.
- **JSON-LD структурированные данные** (`<script type="application/ld+json">`):
  - `Organization` + `LocalBusiness` (адрес, телефон, часы работы) на всех страницах;
  - `Product` + `Offer` (цена/валюта RUB, availability, priceValidUntil) на странице товара;
    для товаров «по запросу» — `Offer` без цены / `AggregateOffer` либо PriceSpecification отсутствует;
  - `BreadcrumbList` на каталоге/товаре/статьях;
  - `ItemList` на страницах каталога/категорий;
  - `BlogPosting` на статьях блога;
  - `FAQPage` где уместно (доставка/оплата).
- **sitemap.xml** (динамический, `app/sitemap.ts`) — все товары, категории, статьи, статические страницы.
- **robots.txt** (`app/robots.ts`) с ссылкой на sitemap; закрыть `/admin`, `/api`.
- **Семантический HTML**: один `<h1>` на страницу, корректная иерархия заголовков, `<nav>`,
  `<article>`, breadcrumbs, alt у изображений, `lang="ru"`.
- **Производительность (Core Web Vitals)**: `next/font` (Manrope), оптимизация изображений
  (`next/image`), отсутствие layout shift, минимизация JS на публичных страницах
  (серверные компоненты по умолчанию, клиентские — только корзина/фильтры/интерактив).
- **Человекочитаемые ЧПУ-слаги**: `/catalog/[category]`, `/product/[slug]`, `/blog/[slug]`.
- Хлебные крошки на UI + в разметке. `hreflang`/`lang` ru-RU. Корректные 404 и метатеги статуса.

## Модель данных (Prisma)

```
Category { id, name, slug, icon, sortOrder, description?, seoTitle?, seoDescription? }
Vendor   { id, name, slug, logoUrl? }
Product  {
  id, sku?, name, slug (uniq), subtitle?,
  categoryId -> Category, vendorId -> Vendor,
  price Int? (null => «Цена по запросу»), oldPrice Int?, currency="RUB",
  badge?, inStock Bool, stockLocation ("moscow"|"order"),
  form?, cpu?, specs Json, tags String[], images String[],
  seoTitle?, seoDescription?, createdAt, updatedAt
}
Order  { id, number (uniq), status, customer Json, items Json, total Int, vatIncluded Bool, createdAt }
Lead   { id, company?, contact, email, phone, category?, message?, status, createdAt }  // RFQ / запрос КП
Post   { id, title, slug (uniq), excerpt, body, categoryId?, coverUrl?, tag?, readMins, publishedAt }
AdminUser { id, email (uniq), passwordHash, createdAt }   // staff auth
```

Seed: 5 категорий, 9 вендоров, 17 товаров — взять ВЕРБАТИМ из `_design/prototype-src/data.js`.
Блог: 6 статей — из `Pages.jsx` (ShopBlog). Контент страниц Доставка/Оплата — из `Pages.jsx`.

## Маршруты

| Route | Страница | Тип |
|---|---|---|
| `/` | Главная (hero вариант A) | SSG/ISR |
| `/catalog`, `/catalog/[category]` | Каталог: фильтры (категория, вендор, inStock, есть цена), сортировка по цене | SSR/ISR |
| `/product/[slug]` | Товар: галерея, таблица характеристик, табы (Характеристики/Доставка/Гарантия), похожие | SSG/ISR + JSON-LD Product |
| `/cart` | Корзина | client |
| `/checkout` | Чекаут 3 шага: контакты → доставка → оплата (счёт-заготовка); смешанная корзина | client + API |
| `/compare` | Сравнение до 4 товаров | client |
| `/rfq` | Запрос КП → сохраняет Lead, письмо менеджеру (заглушка email) | client + API |
| `/delivery`, `/payment` | Контентные страницы | SSG |
| `/blog`, `/blog/[slug]` | Блог | SSG/ISR + JSON-LD |
| `/admin/*` | Админка: CRUD Products/Categories/Vendors/Posts; Orders/Leads; **импорт CSV**; правка цен/наличия/badge/stockLocation | auth, noindex |

## Бизнес-логика (B2B, критично)

1. Цены в рублях. Подпись «по курсу ЦБ РФ». (Пересчёт по ЦБ — точка расширения, не обязательна в v1.)
2. **НДС 22% включён** (ОСНО) — показывать «НДС 22% включён».
3. `price = null` → «Цена по запросу», действие в корзине — **«Запросить»** → создаёт Lead (RFQ), а не оплачиваемый заказ.
4. Два пути поставки: `stockLocation="moscow"` (в наличии, сразу) / `"order"` (импорт ~57 дней) — показывать на товаре и в каталоге.
5. Оплата (заготовка): безналичный (счёт с НДС для юр.лиц), онлайн-касса (физ.лица), отсрочка (флаг). Реальные провайдеры — позже.
6. 100% предоплата по умолчанию.
7. Заказы и RFQ уходят менеджеру (email-заглушка + видны в админке).

## CSV-импорт товаров (обязательно, важно)

- Страница в админке `/admin/products/import`: загрузка `.csv`, выбор разделителя,
  предпросмотр, маппинг колонок, валидация, режим «создать/обновить по sku|slug».
- Поддержать колонки: `sku,name,slug,subtitle,category,vendor,price,oldPrice,badge,inStock,stockLocation,form,cpu,tags,images,specs(JSON)`.
- Отчёт об импорте: создано/обновлено/ошибки построчно. Скачиваемый шаблон CSV.
- Бэкенд: серверный парсер CSV (например `papaparse`/`csv-parse`), транзакционная вставка через Prisma.

## Фирменные токены (точно соблюдать)

```
Шрифт: Manrope (Google Fonts) 400/500/600/700/800; fallback Onest/system.
Canvas bg #07111a · Surface rgba(255,255,255,0.03)
Brand teal #005A59 · accent #2a9f9e · light #5bd0ce / #c3e6e5
Текст #e2eeee (body) #fff (заголовки) #8aa3a2 (muted) #6c8584 (faint)
Border rgba(255,255,255,0.08)
Семантика: success #1a7a50 · error #b83232 · warning #b87820 · gold #d6a028
Радиусы: sm 8 · md 10 · lg 14–16 · pill 999
Акцент по умолчанию (accent prop в прототипе) = #2a9f9e.
```
Подвал/контакты: ООО «КЭШЕС ГРИН РУС», Смирновская ул., 2с1, оф. 122, Москва.
Тел. 8 (904) 299-62-01 · inquiry@cashesgreen.ru · Пн–Пт 10:00–19:00.

## Порядок сборки

1. Scaffold Next.js + TS + Prisma + Postgres; токены + Manrope (next/font); общий UI
   (header, footer, product card, кнопки, бейджи, иконки) из `ShopUI.jsx`.
2. Prisma schema + миграция + seed из `data.js` (+ блог/контент).
3. Каталог + Товар (read) → сверить с прототипом + JSON-LD/метаданные/sitemap/robots.
4. Корзина + Чекаут + RFQ (write) → сохраняет Orders/Leads + счёт-заготовка.
5. Доставка / Оплата / Блог.
6. Админка: auth + CRUD + Orders/Leads + **CSV-импорт**.
7. SEO-полировка (метаданные, structured data, sitemap, CWV), README, .env.example.

## Усиленные решения (v2, после адверсариальной критики плана) — ОБЯЗАТЕЛЬНО

### Архитектура server/client
- Публичные страницы (`/`, `/catalog`, `/catalog/[category]`, `/product/[slug]`, `/blog`, `/blog/[slug]`, `/delivery`, `/payment`) — **серверные компоненты**, данные из Prisma. Никакого порта монолитного `App()` из прототипа.
- Прототип написан как client-SPA (всё состояние в `useState`, hover через `useState`). При порте: **hover-эффекты и адаптив — через CSS (globals.css / CSS-модуль с `:hover` и `@media`), НЕ через useState**, чтобы `ProductCard`, `Btn`, header/footer оставались серверными. Это критично для RSC-выгоды на каталоге.
- `ShopHeader`/`ShopFooter` — серверные; интерактив вынести в узкие client-острова: `MobileMenuToggle`, `CartBadge`, `CompareBadge`, `HeaderSearch`.
- Корзина и сравнение — `CartProvider`/`CompareProvider` (React Context, client, в `layout`), персист в `localStorage`. Бейджи количества на сервере рендерятся как 0/пусто и заполняются в `useEffect` (или `useSyncExternalStore` с серверным снапшотом) — **избегать hydration mismatch**.
- Навигация — настоящими `<Link href>` (для SEO), а не `onClick`. Ссылки строить как `/product/${slug}`, `/catalog/${categorySlug}`.
- Выкинуть мусор прототипа: `useTweaks`/`TweaksPanel`, `window.__resources`, `window.SHOP_DATA`, Babel-standalone. `accent` = CSS-токен `#2a9f9e` (не prop-drilling).

### Маппинг данных при сидировании
- `data.js`: `Product.id` (`dell-r760`) → `slug`; `cat` (строка) → `Category` по `slug`; `vendor` (строка) → `Vendor` по `slug`. Категории/вендоры создать первыми, товары ссылать по FK.
- Логотипы вендоров: в прототипе абсолютные URL чужого прод-сайта. Не зависеть от них — положить плейсхолдеры/SVG локально в `/public/vendors/` (можно простые текстовые/однотонные), либо для `next/image` настроить `remotePatterns`. Предпочесть локальные ассеты.

### Каталог: фильтры и SEO
- Фильтры (`category`, `vendor`, `inStock`, `hasPrice`, `sort`) — через **URL `searchParams`**, серверная фильтрация Prisma. Client-остров только для UI-контролов, которые пушат в URL (`useRouter`).
- **Канонизация:** индексируемы только «чистые» URL `/catalog` и `/catalog/[category]`. Любые фильтры/сортировка/пагинация в query → `<meta name="robots" content="noindex,follow">` + `<link rel="canonical">` на базовый URL категории. Пагинация (`?page=N`) — self-canonical, без rel=prev/next.

### SEO — расширения (обязательно)
- JSON-LD `Product`/`Offer`: `priceCurrency="RUB"`, `availability` (маппинг: `stockLocation=moscow`→`https://schema.org/InStock`; `order`→`https://schema.org/BackOrder`/`PreOrder`), `itemCondition=NewCondition`, `priceValidUntil`, `brand` (из Vendor), `sku`, `image` (абсолютные URL). Для `price=null` — **НЕ выдавать `Offer.price`** (невалидно для Google); опустить offers или дать только availability.
- `Organization`/`LocalBusiness` с `logo`, `address`, `telephone`, `openingHours`, `sameAs` (если есть соцсети — иначе опустить). `WebSite` + `SearchAction` (sitelinks searchbox).
- Динамические OG-картинки через `next/og` `ImageResponse`: `opengraph-image.tsx` для товара (название+цена+бренд), категории, статьи.
- `app/sitemap.ts`: `lastModified` из `updatedAt`/`publishedAt`, `changeFrequency`, `priority`; включать только канонические индексируемые URL (товары, категории, статьи, статические); исключить admin/cart/checkout/compare/rfq и фильтрованные URL.
- `app/robots.ts`: ссылка на sitemap; `Disallow: /admin`, `/api`, `/cart`, `/checkout`, `/compare`.
- `not-found.tsx` + `notFound()` для несуществующих slug → HTTP 404. Удалённые товары → 404.
- Язык: только `<html lang="ru">` + `og:locale=ru_RU`. **Никакого hreflang** (моноязычный сайт).
- `generateStaticParams`: оборачивать запрос к БД в try/catch (вернуть `[]` если БД недоступна) + `export const dynamicParams = true` + `revalidate`, чтобы `next build` не падал без БД. В этом контейнере БД доступна.
- НДС: ставка **22%** (как в брифе и фактах компании). НЕ копировать опечатку «с НДS» из прототипа — писать «с НДС».

### CSV-импорт — расширения (обязательно)
- **Кодировка:** селектор Авто/UTF-8/Windows-1251. Автодетект (BOM + эвристика). Перекодировка `win1251`→`utf8` через `iconv-lite` на сервере ДО парсинга. Тест: файл в Windows-1251 с кириллицей — имена не искажены.
- **Разделитель:** автодетект `,`/`;`/`\t` (русский Excel по умолчанию `;`). Кавычки по RFC 4180 (`""`).
- **Колонки-массивы/JSON:** `specs` = JSON-объект (при ошибке — построчная ошибка, импорт не падает); `tags`/`images` = разделитель внутри ячейки `|` (прописать в шаблоне).
- **Стратегия:** распарсить+валидировать все строки, импортировать построчно (НЕ одна глобальная транзакция, иначе нет построчного отчёта); `upsert` по `sku` (если задан) иначе по `slug`; пустой `slug` → генерация транслитерацией из `name` + разрешение коллизий; дубль внутри файла — последняя строка побеждает (или ошибка — на усмотрение, задокументировать).
- **Валидация:** `price`/`oldPrice` — целые рубли (`Int`); `inStock` ∈ {true,1,да,yes}; `stockLocation` ∈ {moscow,order}; `category`/`vendor` по slug/name (если нет — ошибка строки, не создавать молча).
- **CSV injection:** при генерации шаблона/экспорта/отчёта санитизировать ячейки, начинающиеся с `= + - @ \t \r` (префикс `'`).
- **Отчёт:** построчно (номер строки, ключ, действие created/updated/skipped/error, текст ошибки), скачиваемый CSV (с санитизацией). Скачиваемый шаблон CSV.

### Приёмочные SEO-проверки (добавить в DoD)
- Smoke-скрипт: `fetch` SSR-страницы товара → грепом проверить наличие `<title>`, `rel="canonical"`, `og:`, ровно одного `<h1>`, блока `application/ld+json`; `JSON.parse` JSON-LD + проверка required-полей.
- `/sitemap.xml` и `/robots.txt` → 200 + корректный content-type; sitemap содержит 17 товаров, не содержит admin/cart.
- Фильтрованный URL каталога → `noindex`; чистый → индексируемый.
- Несуществующий slug → HTTP 404.

## Definition of Done

- `npm run build` проходит без ошибок; `npm run lint` чисто.
- Все маршруты открываются, дизайн совпадает с прототипом.
- Seed заполняет 17 товаров; каталог/товар/блог рендерятся серверно с метаданными и JSON-LD.
- sitemap.xml и robots.txt отдаются; `/admin` под noindex и auth.
- CSV-импорт создаёт/обновляет товары и показывает отчёт.
- README с инструкцией запуска и `.env.example`.
