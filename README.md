# Cashes Green Rus — интернет-магазин

Самописный B2B-магазин серверного и AI-оборудования. Next.js (App Router) + TypeScript +
Prisma + PostgreSQL. Тёмная премиум-тема, максимальная SEO-оптимизация, админка с CRUD и
импортом товаров из CSV. Спецификация и дизайн-прототип — в `_design/`.

## Стек

- **Next.js 15** (App Router, серверные компоненты для публичных страниц)
- **TypeScript**, **React 19**
- **Prisma 6** ORM + **PostgreSQL**
- **next/font** (Manrope, cyrillic+latin), **next/og** (динамические OG-картинки)
- Корзина/сравнение — клиентский React Context + `localStorage`
- CSV-импорт — `papaparse` + `iconv-lite` (UTF-8 / Windows-1251)
- Авторизация админки — bcrypt + подписанная HMAC-кука

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Создать .env (см. .env.example)
cp .env.example .env
# отредактируйте DATABASE_URL, ADMIN_PASSWORD, AUTH_SECRET при необходимости

# 3. Применить миграции и сгенерировать клиент
npm run db:migrate        # prisma migrate dev
# (или для пустой БД без истории миграций: npm run db:push)

# 4. Залить данные (5 категорий, 9 вендоров, 17 товаров, 6 статей, 1 админ)
npm run seed

# 5. Запустить дев-сервер
npm run dev               # http://localhost:3000

# Production
npm run build && npm run start
```

## Переменные окружения

| Переменная | Назначение |
|---|---|
| `DATABASE_URL` | Строка подключения к PostgreSQL |
| `ADMIN_EMAIL` | Email админа, создаётся сидом |
| `ADMIN_PASSWORD` | Пароль админа, создаётся сидом (хэшируется bcrypt) |
| `AUTH_SECRET` | Секрет для подписи сессионной куки админки (длинная случайная строка) |
| `NEXT_PUBLIC_SITE_URL` | Базовый URL сайта (canonical, sitemap, OG) |

## Дефолтный администратор

Создаётся скриптом `npm run seed` из `ADMIN_EMAIL` / `ADMIN_PASSWORD`:

- **Email:** `admin@cashesgreen.ru`
- **Пароль:** значение `ADMIN_PASSWORD` из `.env` (по умолчанию в репозитории — `cgr-admin-2026`)

Вход — `/admin/login`. Смените пароль перед продакшеном.

## Подключение своего PostgreSQL

1. Создайте базу: `createdb my_shop` (или в облачном провайдере).
2. Пропишите `DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/my_shop"` в `.env`.
3. Примените схему: `npm run db:migrate` (или `npm run db:push`).
4. Залейте данные: `npm run seed`.

### Локальный Postgres в этом контейнере (для разработки)

Postgres 16 поднят под пользователем `postgres`. Если упал — перезапустить:

```bash
su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/pgdata -o '-p 5432 -k /tmp/pgrun' -l /tmp/pg.log start"
```

## Маршруты

| Маршрут | Назначение |
|---|---|
| `/` | Главная (hero, категории, популярное, CTA) |
| `/catalog`, `/catalog/[category]` | Каталог с фильтрами (через URL searchParams), серверная фильтрация |
| `/product/[slug]` | Карточка товара (галерея, табы, JSON-LD Product+Offer) |
| `/cart`, `/checkout` | Корзина и оформление (Order + счёт-заготовка с НДС 22%) |
| `/compare` | Сравнение до 4 товаров |
| `/rfq` | Запрос КП → создаёт Lead |
| `/delivery`, `/payment` | Контентные страницы (+ FAQPage JSON-LD) |
| `/blog`, `/blog/[slug]` | Блог (BlogPosting JSON-LD) |
| `/admin/*` | Админка (auth, noindex): CRUD, заказы, заявки, CSV-импорт |
| `/sitemap.xml`, `/robots.txt` | SEO-инфраструктура |

## Бизнес-логика (B2B)

- Цены в рублях, подпись «по курсу ЦБ РФ».
- **НДС 22% включён** (ОСНО). Счёт-заготовка раскладывает сумму на нетто + НДС.
- `price = null` → «Цена по запросу»; действие «Запросить» создаёт Lead (RFQ), а не заказ.
- Два пути поставки: `stockLocation = "moscow"` (в наличии) / `"order"` (импорт ~57 дней).
- Оплата — **заготовка**: `PaymentProvider` (интерфейс) + stub. Реальные платежи не интегрированы.

## CSV-импорт товаров

Страница `/admin/products/import`:

- **Кодировка:** Авто / UTF-8 / Windows-1251 (через `iconv-lite`, автодетект по BOM и эвристике).
- **Разделитель:** автодетект `,` / `;` / таб.
- **Колонки:** `sku,name,slug,subtitle,category,vendor,price,oldPrice,badge,inStock,stockLocation,form,cpu,tags,images,specs`.
  - `tags`, `images` — значения через `|`; `specs` — JSON-объект.
  - `category` / `vendor` — по slug или имени (если не найдено — ошибка строки).
  - `inStock` ∈ {true, 1, да, yes}; `stockLocation` ∈ {moscow, order}.
- **Upsert** по `sku`, иначе по `slug`. Пустой `slug` генерируется транслитерацией из `name`.
- Построчный отчёт (created/updated/skipped/error), скачиваемый CSV-отчёт, скачиваемый шаблон.
- CSV-injection: ячейки, начинающиеся с `= + - @`, экранируются префиксом `'`.

## SEO

- Серверный рендеринг публичных страниц, `generateMetadata` (title/description/canonical/OG/Twitter).
- JSON-LD: Organization, LocalBusiness, WebSite+SearchAction, Product+Offer, BreadcrumbList,
  ItemList, BlogPosting, FAQPage. Для `price=null` Offer без цены.
- Фильтрованные/сортированные URL каталога → `noindex,follow` + canonical на чистый URL.
- `app/sitemap.ts` (с `lastModified`), `app/robots.ts`, динамические `opengraph-image`, `not-found`.
- `<html lang="ru">`, один `<h1>` на страницу, семантический HTML.

## Скрипты

| Команда | Действие |
|---|---|
| `npm run dev` | Дев-сервер |
| `npm run build` | Продакшен-сборка (включает `prisma generate`) |
| `npm run start` | Запуск собранного приложения |
| `npm run lint` | ESLint |
| `npm run seed` | Заполнение БД |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:push` | `prisma db push` |
