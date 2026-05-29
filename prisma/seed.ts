// Cashes Green Rus — database seed
// Categories, vendors, products (verbatim from _design/prototype-src/data.js),
// blog posts (from Pages.jsx ShopBlog, with added body content) and one admin user.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: "servers", name: "Серверы", icon: "server", sortOrder: 1, description: "Стоечные и блейд-серверы Dell, HPE, Lenovo, Huawei — напрямую с заводов." },
  { slug: "storage", name: "СХД", icon: "storage", sortOrder: 2, description: "Системы хранения данных NetApp, Dell, HPE — All-Flash и гибридные решения." },
  { slug: "network", name: "Сетевое", icon: "network", sortOrder: 3, description: "Коммутаторы и сетевое оборудование Cisco, Huawei для дата-центров." },
  { slug: "gpu", name: "GPU / AI", icon: "gpu", sortOrder: 4, description: "GPU-серверы и AI-суперкомпьютеры на базе NVIDIA H100." },
  { slug: "parts", name: "Комплектующие", icon: "parts", sortOrder: 5, description: "Память, накопители и редкие запчасти для поддержания ЗИП-складов." },
];

const VENDORS = [
  { slug: "dell", name: "Dell" },
  { slug: "hpe", name: "HPE" },
  { slug: "lenovo", name: "Lenovo" },
  { slug: "huawei", name: "Huawei" },
  { slug: "cisco", name: "Cisco" },
  { slug: "nvidia", name: "NVIDIA" },
  { slug: "xfusion", name: "XFusion" },
  { slug: "netapp", name: "NetApp" },
  { slug: "supermicro", name: "Supermicro" },
];

type RawProduct = {
  id: string;
  cat: string;
  vendor: string;
  name: string;
  subtitle: string;
  price: number | null;
  oldPrice: number | null;
  badge: string | null;
  form: string;
  cpu: string | null;
  inStock: boolean;
  specs: Record<string, string>;
  tags: string[];
};

const PRODUCTS: RawProduct[] = [
  // ─── SERVERS ───
  {
    id: "dell-r760", cat: "servers", vendor: "dell",
    name: "Dell PowerEdge R760",
    subtitle: "Стоечный сервер 2U · 2× Intel Xeon Scalable 4-го поколения",
    price: 1290000, oldPrice: 1450000, badge: "Хит",
    form: "rack", cpu: "Xeon", inStock: true,
    specs: { "Форм-фактор": "2U Rack", "Процессоры": "до 2× Xeon 4th Gen", "Память": "до 8 ТБ DDR5", "Накопители": "до 24× 2.5\" NVMe", "Гарантия": "1 год + опц. до 5" },
    tags: ["DDR5", "NVMe", "Full Original"],
  },
  {
    id: "hpe-dl380", cat: "servers", vendor: "hpe",
    name: "HPE ProLiant DL380 Gen11",
    subtitle: "Универсальный стоечный сервер 2U для любых нагрузок",
    price: 1180000, oldPrice: null, badge: null,
    form: "rack", cpu: "Xeon", inStock: true,
    specs: { "Форм-фактор": "2U Rack", "Процессоры": "до 2× Xeon 4th Gen", "Память": "до 8 ТБ DDR5", "Накопители": "до 30× SFF", "Гарантия": "1 год" },
    tags: ["DDR5", "Гибкая конфигурация"],
  },
  {
    id: "lenovo-sr650", cat: "servers", vendor: "lenovo",
    name: "Lenovo ThinkSystem SR650 V3",
    subtitle: "Производительный 2U сервер с расширенной поддержкой",
    price: 1095000, oldPrice: 1190000, badge: "Сервис ТП",
    form: "rack", cpu: "Xeon", inStock: true,
    specs: { "Форм-фактор": "2U Rack", "Процессоры": "до 2× Xeon 4th Gen", "Память": "до 8 ТБ DDR5", "Накопители": "до 40× EDSFF", "Гарантия": "1 год + склад ЗИП в РФ" },
    tags: ["DDR5", "Lenovo ТП", "Склад ЗИП"],
  },
  {
    id: "huawei-2288", cat: "servers", vendor: "huawei",
    name: "Huawei FusionServer 2288H V7",
    subtitle: "Сбалансированный стоечный сервер 2U · Hi-Care до 5 лет",
    price: null, oldPrice: null, badge: "Hi-Care 5 лет",
    form: "rack", cpu: "Xeon", inStock: true,
    specs: { "Форм-фактор": "2U Rack", "Процессоры": "до 2× Xeon Scalable", "Память": "до 4 ТБ", "Накопители": "до 31× дисков", "Гарантия": "Hi-Care до 5 лет" },
    tags: ["Hi-Care", "Проектная поставка"],
  },
  {
    id: "dell-mx750", cat: "servers", vendor: "dell",
    name: "Dell PowerEdge MX750c",
    subtitle: "Блейд-сервер для модульной платформы PowerEdge MX",
    price: 1640000, oldPrice: null, badge: null,
    form: "blade", cpu: "Xeon", inStock: false,
    specs: { "Форм-фактор": "Blade", "Процессоры": "до 2× Xeon 4th Gen", "Память": "до 8 ТБ DDR5", "Накопители": "6× SFF NVMe/SAS", "Гарантия": "1 год" },
    tags: ["Blade", "Модульный"],
  },

  // ─── STORAGE ───
  {
    id: "netapp-aff", cat: "storage", vendor: "netapp",
    name: "NetApp AFF A400",
    subtitle: "All-Flash СХД корпоративного класса с гибридным облаком",
    price: 3450000, oldPrice: null, badge: "All-Flash",
    form: "storage", cpu: null, inStock: true,
    specs: { "Тип": "All-Flash NVMe", "Ёмкость": "до 14 ПБ", "Протоколы": "NFS, SMB, iSCSI, FC", "Контроллеры": "2× active-active", "Гарантия": "1 год" },
    tags: ["NVMe", "All-Flash", "SDS"],
  },
  {
    id: "dell-powerstore", cat: "storage", vendor: "dell",
    name: "Dell PowerStore 1200T",
    subtitle: "Универсальная СХД с дедупликацией и сжатием данных",
    price: 2980000, oldPrice: 3200000, badge: null,
    form: "storage", cpu: null, inStock: true,
    specs: { "Тип": "Unified Block & File", "Ёмкость": "до 4 ПБ эфф.", "Протоколы": "NVMe/TCP, iSCSI, FC, NFS", "Контроллеры": "2× active-active", "Гарантия": "1 год" },
    tags: ["Дедупликация", "Unified"],
  },
  {
    id: "hpe-alletra", cat: "storage", vendor: "hpe",
    name: "HPE Alletra 6010",
    subtitle: "Облачная СХД с гарантией доступности 100%",
    price: null, oldPrice: null, badge: "По запросу",
    form: "storage", cpu: null, inStock: true,
    specs: { "Тип": "All-NVMe", "Ёмкость": "до 5.5 ПБ", "Протоколы": "iSCSI, FC", "Управление": "HPE GreenLake", "Гарантия": "1 год" },
    tags: ["Cloud-managed", "All-NVMe"],
  },

  // ─── NETWORK ───
  {
    id: "cisco-n9k", cat: "network", vendor: "cisco",
    name: "Cisco Nexus 9336C-FX2",
    subtitle: "Дата-центр коммутатор 36× 100G QSFP28",
    price: 1850000, oldPrice: null, badge: null,
    form: "network", cpu: null, inStock: true,
    specs: { "Порты": "36× 100G QSFP28", "Пропускная способность": "7.2 Тбит/с", "Режим": "NX-OS / ACI", "Высота": "1U", "Гарантия": "1 год" },
    tags: ["100G", "ACI", "Spine/Leaf"],
  },
  {
    id: "cisco-cat9300", cat: "network", vendor: "cisco",
    name: "Cisco Catalyst 9300-48P",
    subtitle: "Стекируемый коммутатор доступа 48× PoE+",
    price: 740000, oldPrice: 820000, badge: "Хит",
    form: "network", cpu: null, inStock: true,
    specs: { "Порты": "48× 1G PoE+", "Аплинки": "4× 10G / 8× 10G", "Стекирование": "до 480 Гбит/с", "Высота": "1U", "Гарантия": "1 год" },
    tags: ["PoE+", "Catalyst", "Стек"],
  },
  {
    id: "huawei-ce6865", cat: "network", vendor: "huawei",
    name: "Huawei CloudEngine 6865",
    subtitle: "Высокоплотный 25G/100G коммутатор для ЦОД",
    price: null, oldPrice: null, badge: "По запросу",
    form: "network", cpu: null, inStock: true,
    specs: { "Порты": "48× 25G + 8× 100G", "Пропускная способность": "4 Тбит/с", "Режим": "SDN-ready", "Высота": "1U", "Гарантия": "Hi-Care опц." },
    tags: ["25G", "100G", "SDN"],
  },

  // ─── GPU / AI ───
  {
    id: "nvidia-dgx", cat: "gpu", vendor: "nvidia",
    name: "NVIDIA DGX H100",
    subtitle: "AI-суперкомпьютер · 8× H100 Tensor Core GPU",
    price: null, oldPrice: null, badge: "Топ AI",
    form: "gpu", cpu: null, inStock: true,
    specs: { "GPU": "8× NVIDIA H100 80 ГБ", "Производительность": "32 PFLOPS FP8", "Память GPU": "640 ГБ HBM3", "Сеть": "8× 400G InfiniBand", "Гарантия": "1 год" },
    tags: ["H100", "AI/ML", "Проверка с логами"],
  },
  {
    id: "supermicro-gpu", cat: "gpu", vendor: "supermicro",
    name: "Supermicro SYS-821GE-TNHR",
    subtitle: "GPU-сервер 8U под 8× NVIDIA HGX H100",
    price: null, oldPrice: null, badge: "По запросу",
    form: "gpu", cpu: "Xeon", inStock: true,
    specs: { "GPU": "до 8× HGX H100", "Процессоры": "2× Xeon Scalable", "Память": "до 8 ТБ DDR5", "Форм-фактор": "8U", "Гарантия": "1 год" },
    tags: ["HGX", "Rendering", "HPC"],
  },
  {
    id: "dell-xe9680", cat: "gpu", vendor: "dell",
    name: "Dell PowerEdge XE9680",
    subtitle: "Флагманский GPU-сервер для генеративного ИИ",
    price: null, oldPrice: null, badge: "Топ AI",
    form: "gpu", cpu: "Xeon", inStock: false,
    specs: { "GPU": "8× H100 / MI300X", "Процессоры": "2× Xeon 4th Gen", "Память": "до 4 ТБ DDR5", "Форм-фактор": "6U", "Гарантия": "1 год" },
    tags: ["LLM", "Generative AI"],
  },

  // ─── PARTS ───
  {
    id: "part-ddr5", cat: "parts", vendor: "dell",
    name: "Модуль памяти DDR5 64 ГБ RDIMM",
    subtitle: "Серверная память 4800 МТ/с · оригинал с завода",
    price: 38500, oldPrice: null, badge: "В наличии",
    form: "part", cpu: null, inStock: true,
    specs: { "Тип": "DDR5 RDIMM ECC", "Частота": "4800 МТ/с", "Объём": "64 ГБ", "Совместимость": "PowerEdge 16G", "Гарантия": "1 год" },
    tags: ["DDR5", "ЗИП", "Оригинал"],
  },
  {
    id: "part-ssd", cat: "parts", vendor: "dell",
    name: "NVMe SSD 7.68 ТБ U.2",
    subtitle: "Корпоративный твердотельный накопитель Mixed Use",
    price: 142000, oldPrice: 158000, badge: null,
    form: "part", cpu: null, inStock: true,
    specs: { "Интерфейс": "PCIe 4.0 NVMe U.2", "Объём": "7.68 ТБ", "Ресурс": "3 DWPD", "Тип": "Mixed Use", "Гарантия": "1 год" },
    tags: ["NVMe", "ЗИП"],
  },
  {
    id: "part-legacy", cat: "parts", vendor: "hpe",
    name: "Запчасти для устаревшего фонда",
    subtitle: "Поиск редких комплектующих EOL/EOS оборудования",
    price: null, oldPrice: null, badge: "Проектная поставка",
    form: "part", cpu: null, inStock: true,
    specs: { "Назначение": "Поддержание ЗИП-складов", "Вендоры": "Dell, HPE, Cisco, Lenovo, Huawei", "Состояние": "Новые / восстановленные", "Каналы": "СНГ, Азия", "Гарантия": "По договору" },
    tags: ["EOL/EOS", "Редкие детали", "ЗИП"],
  },
];

const POSTS = [
  {
    slug: "kak-vybrat-stoechnyj-server-2026",
    tag: "Гайд", cat: "servers", readMins: 7, publishedAt: "2026-05-12",
    title: "Как выбрать стоечный сервер в 2026",
    excerpt: "Разбираем форм-факторы, поколения Xeon и EPYC, объём памяти и накопителей под вашу нагрузку.",
    body: [
      "Выбор стоечного сервера начинается с задачи: виртуализация, базы данных, файловое хранилище или вычислительная нагрузка. От этого зависят требования к процессору, памяти и подсистеме хранения.",
      "Форм-фактор 2U остаётся золотым стандартом: он вмещает два процессора, большой объём оперативной памяти и достаточное количество накопителей. Для плотных вычислений подойдут 1U-платформы, для модульных решений — блейд-шасси.",
      "Современные платформы строятся на Intel Xeon Scalable 4-го поколения и AMD EPYC. Xeon выигрывает в задачах с ускорителями и встроенными акселераторами, EPYC — в плотности ядер и пропускной способности памяти.",
      "Память DDR5 поднимает пропускную способность по сравнению с DDR4. Закладывайте запас по объёму: для виртуализации ориентируйтесь на 16–32 ГБ на ядро. Накопители NVMe дают минимальные задержки, SAS/SATA — больший объём по меньшей цене.",
      "Не забывайте про гарантию и сервис. Мы поставляем только оригинальное оборудование, проверяем каждую систему до отгрузки и высылаем логи, а также предлагаем расширение гарантии и склад ЗИП в России.",
    ].join("\n\n"),
  },
  {
    slug: "gpu-dlya-obucheniya-llm-h100",
    tag: "AI", cat: "gpu", readMins: 9, publishedAt: "2026-05-06",
    title: "GPU для обучения LLM: H100 против альтернатив",
    excerpt: "Сравниваем конфигурации NVIDIA HGX, требования к питанию и охлаждению для AI-кластеров.",
    body: [
      "Обучение больших языковых моделей требует огромной вычислительной мощности и быстрой межсоединительной сети. NVIDIA H100 на архитектуре Hopper остаётся эталоном для таких задач.",
      "Платформа HGX H100 объединяет 8 ускорителей через NVLink и NVSwitch, обеспечивая высокую пропускную способность между GPU. Это критично для распределённого обучения, где данные постоянно синхронизируются между картами.",
      "При планировании кластера учитывайте питание и охлаждение: одна система с 8× H100 потребляет до 10 кВт. Нужны соответствующие PDU, резервирование и, как правило, жидкостное или усиленное воздушное охлаждение.",
      "Сеть InfiniBand 400G связывает узлы в единый кластер. Без неё масштабирование на десятки и сотни GPU теряет смысл из-за задержек.",
      "Мы поставляем готовые AI-системы NVIDIA DGX и платформы Supermicro и Dell под HGX H100, собираем кластеры под задачу заказчика и проверяем каждую систему с логами до отгрузки.",
    ].join("\n\n"),
  },
  {
    slug: "parallelnyj-import-chto-vazhno-znat",
    tag: "Логистика", cat: "parts", readMins: 5, publishedAt: "2026-04-28",
    title: "Параллельный импорт: что важно знать",
    excerpt: "Сроки, документы, гарантия и проверка оригинальности при поставках из Китая.",
    body: [
      "Параллельный импорт позволяет легально ввозить оригинальное оборудование без участия официального дистрибьютора вендора. Главное — прозрачность цепочки и полный пакет документов.",
      "Средний срок поставки под заказ — около 57 дней. В 63% случаев оборудование приходит раньше: мы управляем логистикой от завода до двери заказчика и держим под контролем таможню и сертификацию.",
      "Документальное сопровождение включает договор с НДС, счёт, УПД, таможенные декларации и сертификаты соответствия. Это позволяет участвовать в тендерах и госзакупках.",
      "Проверка оригинальности — обязательный этап. Мы тестируем оборудование до отгрузки и высылаем логи, чтобы заказчик убедился: поставляется именно то, что прописано в договоре.",
    ].join("\n\n"),
  },
  {
    slug: "all-flash-ili-gibrid-chto-vybrat",
    tag: "СХД", cat: "storage", readMins: 6, publishedAt: "2026-04-21",
    title: "All-Flash или гибрид: что выбрать бизнесу",
    excerpt: "Когда оправдан переход на All-Flash и как считать TCO системы хранения.",
    body: [
      "All-Flash СХД дают предсказуемо низкие задержки и высокую производительность для баз данных, виртуализации и аналитики. Гибридные системы сочетают флеш-кэш и ёмкие HDD для холодных данных.",
      "Переход на All-Flash оправдан, когда задержки напрямую влияют на бизнес: транзакционные системы, VDI, нагруженные базы. Технологии дедупликации и сжатия снижают эффективную стоимость гигабайта.",
      "Считая TCO, учитывайте не только цену за терабайт, но и энергопотребление, место в стойке, обслуживание и срок службы. All-Flash экономит на электричестве и охлаждении за счёт отсутствия движущихся частей.",
      "Мы поставляем NetApp AFF, Dell PowerStore и HPE Alletra — от All-Flash NVMe до гибридных конфигураций — и помогаем подобрать систему под профиль нагрузки.",
    ].join("\n\n"),
  },
  {
    slug: "spine-leaf-dlya-data-centra",
    tag: "Сеть", cat: "network", readMins: 8, publishedAt: "2026-04-14",
    title: "Spine-Leaf для дата-центра: с чего начать",
    excerpt: "Базовая архитектура современной сети ЦОД на коммутаторах 100G.",
    body: [
      "Архитектура Spine-Leaf пришла на смену классической трёхуровневой топологии. Она обеспечивает предсказуемые задержки и горизонтальное масштабирование east-west трафика между серверами.",
      "В основе — два слоя коммутаторов: leaf подключают серверы, spine связывают все leaf между собой. Каждый leaf соединён с каждым spine, что даёт равномерную нагрузку и отказоустойчивость.",
      "Для современных ЦОД базовая скорость аплинков — 100G на коммутаторах вроде Cisco Nexus 9336C-FX2 или Huawei CloudEngine. Доступ к серверам — 25G с возможностью роста.",
      "Начните с расчёта oversubscription и числа серверов на стойку. Затем подбирайте leaf по плотности портов и spine по совокупной пропускной способности. Мы поможем спроектировать фабрику под задачу.",
    ].join("\n\n"),
  },
  {
    slug: "zip-sklad-zachem-derzhat-zapas",
    tag: "Сервис", cat: "servers", readMins: 4, publishedAt: "2026-04-05",
    title: "ЗИП-склад: зачем держать запас комплектующих",
    excerpt: "Как поддерживать работоспособность устаревшего фонда серверов и не простаивать.",
    body: [
      "ЗИП (запасные части, инструменты и принадлежности) — это страховка от простоя. Когда оборудование снято с производства, оригинальные комплектующие найти всё труднее.",
      "Особенно остро вопрос стоит для EOL/EOS-оборудования: вендор прекращает поддержку, а парк продолжает работать. Запас модулей памяти, накопителей и блоков питания позволяет быстро восстановить работу.",
      "Мы помогаем формировать и пополнять ЗИП-склады дистрибьюторов и интеграторов: ищем редкие детали Dell, HPE, Cisco, Lenovo и Huawei, поставляем новые и восстановленные компоненты.",
      "Грамотно собранный ЗИП-склад снижает риски и стоимость обслуживания инфраструктуры на годы вперёд.",
    ].join("\n\n"),
  },
];

async function main() {
  console.log("Seeding database...");

  // Categories
  const catBySlug: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, icon: c.icon, sortOrder: c.sortOrder, description: c.description },
      create: c,
    });
    catBySlug[c.slug] = row.id;
  }
  console.log(`  Categories: ${CATEGORIES.length}`);

  // Vendors
  const vendorBySlug: Record<string, string> = {};
  for (const v of VENDORS) {
    const row = await prisma.vendor.upsert({
      where: { slug: v.slug },
      update: { name: v.name, logoUrl: `/vendors/${v.slug}.svg` },
      create: { ...v, logoUrl: `/vendors/${v.slug}.svg` },
    });
    vendorBySlug[v.slug] = row.id;
  }
  console.log(`  Vendors: ${VENDORS.length}`);

  // Products
  for (const p of PRODUCTS) {
    const categoryId = catBySlug[p.cat];
    const vendorId = vendorBySlug[p.vendor];
    if (!categoryId) throw new Error(`Unknown category ${p.cat} for ${p.id}`);
    if (!vendorId) throw new Error(`Unknown vendor ${p.vendor} for ${p.id}`);

    const data = {
      name: p.name,
      subtitle: p.subtitle,
      categoryId,
      vendorId,
      price: p.price,
      oldPrice: p.oldPrice,
      badge: p.badge,
      inStock: p.inStock,
      stockLocation: p.inStock ? "moscow" : "order",
      form: p.form,
      cpu: p.cpu,
      specs: p.specs,
      tags: p.tags,
      images: [],
      seoTitle: `${p.name} — купить в Cashes Green Rus`,
      seoDescription: p.subtitle,
    };

    await prisma.product.upsert({
      where: { slug: p.id },
      update: data,
      create: { slug: p.id, ...data },
    });
  }
  console.log(`  Products: ${PRODUCTS.length}`);

  // Posts
  for (const post of POSTS) {
    const categoryId = catBySlug[post.cat] ?? null;
    const data = {
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      categoryId,
      tag: post.tag,
      readMins: post.readMins,
      publishedAt: new Date(post.publishedAt),
    };
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: data,
      create: { slug: post.slug, ...data },
    });
  }
  console.log(`  Posts: ${POSTS.length}`);

  // Admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@cashesgreen.ru";
  const adminPassword = process.env.ADMIN_PASSWORD || "cgr-admin-2026";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  });
  console.log(`  Admin: ${adminEmail}`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
