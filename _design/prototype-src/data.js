// data.js — Cashes Green Rus shop catalog data
// Exposes window.SHOP_DATA

const V = 'https://www.cashesgreen.ru/_next/static/media/';

const CATEGORIES = [
  { id: 'servers',  name: 'Серверы',          icon: 'server',  count: 5 },
  { id: 'storage',  name: 'СХД',              icon: 'storage', count: 3 },
  { id: 'network',  name: 'Сетевое',          icon: 'network', count: 3 },
  { id: 'gpu',      name: 'GPU / AI',         icon: 'gpu',     count: 3 },
  { id: 'parts',    name: 'Комплектующие',    icon: 'parts',   count: 3 },
];

const VENDORS = [
  { id: 'dell',   name: 'Dell',     logo: V + 'dell.c7816ca8.svg' },
  { id: 'hpe',    name: 'HPE',      logo: V + 'hewlett-packard.19df1120.svg' },
  { id: 'lenovo', name: 'Lenovo',   logo: V + 'lenovo.24c8e338.svg' },
  { id: 'huawei', name: 'Huawei',   logo: V + 'huawei.f3d100cc.svg' },
  { id: 'cisco',  name: 'Cisco',    logo: V + 'cisco.6c2907d3.svg' },
  { id: 'nvidia', name: 'NVIDIA',   logo: V + 'nvidia.17932bba.svg' },
  { id: 'xfusion',name: 'XFusion',  logo: V + 'XFusion.a6294a64.svg' },
  { id: 'netapp', name: 'NetApp',   logo: V + 'netapp.920fd6a3.svg' },
  { id: 'supermicro', name: 'Supermicro', logo: V + 'supermicro.ebedfe4f.svg' },
];

// price in RUB. Some items "по запросу" (price: null)
const PRODUCTS = [
  // ─── SERVERS ───
  {
    id: 'dell-r760', cat: 'servers', vendor: 'dell',
    name: 'Dell PowerEdge R760',
    subtitle: 'Стоечный сервер 2U · 2× Intel Xeon Scalable 4-го поколения',
    price: 1290000, oldPrice: 1450000, badge: 'Хит',
    form: 'rack', cpu: 'Xeon', inStock: true,
    specs: { 'Форм-фактор': '2U Rack', 'Процессоры': 'до 2× Xeon 4th Gen', 'Память': 'до 8 ТБ DDR5', 'Накопители': 'до 24× 2.5" NVMe', 'Гарантия': '1 год + опц. до 5' },
    tags: ['DDR5', 'NVMe', 'Full Original'],
  },
  {
    id: 'hpe-dl380', cat: 'servers', vendor: 'hpe',
    name: 'HPE ProLiant DL380 Gen11',
    subtitle: 'Универсальный стоечный сервер 2U для любых нагрузок',
    price: 1180000, oldPrice: null, badge: null,
    form: 'rack', cpu: 'Xeon', inStock: true,
    specs: { 'Форм-фактор': '2U Rack', 'Процессоры': 'до 2× Xeon 4th Gen', 'Память': 'до 8 ТБ DDR5', 'Накопители': 'до 30× SFF', 'Гарантия': '1 год' },
    tags: ['DDR5', 'Гибкая конфигурация'],
  },
  {
    id: 'lenovo-sr650', cat: 'servers', vendor: 'lenovo',
    name: 'Lenovo ThinkSystem SR650 V3',
    subtitle: 'Производительный 2U сервер с расширенной поддержкой',
    price: 1095000, oldPrice: 1190000, badge: 'Сервис ТП',
    form: 'rack', cpu: 'Xeon', inStock: true,
    specs: { 'Форм-фактор': '2U Rack', 'Процессоры': 'до 2× Xeon 4th Gen', 'Память': 'до 8 ТБ DDR5', 'Накопители': 'до 40× EDSFF', 'Гарантия': '1 год + склад ЗИП в РФ' },
    tags: ['DDR5', 'Lenovo ТП', 'Склад ЗИП'],
  },
  {
    id: 'huawei-2288', cat: 'servers', vendor: 'huawei',
    name: 'Huawei FusionServer 2288H V7',
    subtitle: 'Сбалансированный стоечный сервер 2U · Hi-Care до 5 лет',
    price: null, oldPrice: null, badge: 'Hi-Care 5 лет',
    form: 'rack', cpu: 'Xeon', inStock: true,
    specs: { 'Форм-фактор': '2U Rack', 'Процессоры': 'до 2× Xeon Scalable', 'Память': 'до 4 ТБ', 'Накопители': 'до 31× дисков', 'Гарантия': 'Hi-Care до 5 лет' },
    tags: ['Hi-Care', 'Проектная поставка'],
  },
  {
    id: 'dell-mx750', cat: 'servers', vendor: 'dell',
    name: 'Dell PowerEdge MX750c',
    subtitle: 'Блейд-сервер для модульной платформы PowerEdge MX',
    price: 1640000, oldPrice: null, badge: null,
    form: 'blade', cpu: 'Xeon', inStock: false,
    specs: { 'Форм-фактор': 'Blade', 'Процессоры': 'до 2× Xeon 4th Gen', 'Память': 'до 8 ТБ DDR5', 'Накопители': '6× SFF NVMe/SAS', 'Гарантия': '1 год' },
    tags: ['Blade', 'Модульный'],
  },

  // ─── STORAGE ───
  {
    id: 'netapp-aff', cat: 'storage', vendor: 'netapp',
    name: 'NetApp AFF A400',
    subtitle: 'All-Flash СХД корпоративного класса с гибридным облаком',
    price: 3450000, oldPrice: null, badge: 'All-Flash',
    form: 'storage', cpu: null, inStock: true,
    specs: { 'Тип': 'All-Flash NVMe', 'Ёмкость': 'до 14 ПБ', 'Протоколы': 'NFS, SMB, iSCSI, FC', 'Контроллеры': '2× active-active', 'Гарантия': '1 год' },
    tags: ['NVMe', 'All-Flash', 'SDS'],
  },
  {
    id: 'dell-powerstore', cat: 'storage', vendor: 'dell',
    name: 'Dell PowerStore 1200T',
    subtitle: 'Универсальная СХД с дедупликацией и сжатием данных',
    price: 2980000, oldPrice: 3200000, badge: null,
    form: 'storage', cpu: null, inStock: true,
    specs: { 'Тип': 'Unified Block & File', 'Ёмкость': 'до 4 ПБ эфф.', 'Протоколы': 'NVMe/TCP, iSCSI, FC, NFS', 'Контроллеры': '2× active-active', 'Гарантия': '1 год' },
    tags: ['Дедупликация', 'Unified'],
  },
  {
    id: 'hpe-alletra', cat: 'storage', vendor: 'hpe',
    name: 'HPE Alletra 6010',
    subtitle: 'Облачная СХД с гарантией доступности 100%',
    price: null, oldPrice: null, badge: 'По запросу',
    form: 'storage', cpu: null, inStock: true,
    specs: { 'Тип': 'All-NVMe', 'Ёмкость': 'до 5.5 ПБ', 'Протоколы': 'iSCSI, FC', 'Управление': 'HPE GreenLake', 'Гарантия': '1 год' },
    tags: ['Cloud-managed', 'All-NVMe'],
  },

  // ─── NETWORK ───
  {
    id: 'cisco-n9k', cat: 'network', vendor: 'cisco',
    name: 'Cisco Nexus 9336C-FX2',
    subtitle: 'Дата-центр коммутатор 36× 100G QSFP28',
    price: 1850000, oldPrice: null, badge: null,
    form: 'network', cpu: null, inStock: true,
    specs: { 'Порты': '36× 100G QSFP28', 'Пропускная способность': '7.2 Тбит/с', 'Режим': 'NX-OS / ACI', 'Высота': '1U', 'Гарантия': '1 год' },
    tags: ['100G', 'ACI', 'Spine/Leaf'],
  },
  {
    id: 'cisco-cat9300', cat: 'network', vendor: 'cisco',
    name: 'Cisco Catalyst 9300-48P',
    subtitle: 'Стекируемый коммутатор доступа 48× PoE+',
    price: 740000, oldPrice: 820000, badge: 'Хит',
    form: 'network', cpu: null, inStock: true,
    specs: { 'Порты': '48× 1G PoE+', 'Аплинки': '4× 10G / 8× 10G', 'Стекирование': 'до 480 Гбит/с', 'Высота': '1U', 'Гарантия': '1 год' },
    tags: ['PoE+', 'Catalyst', 'Стек'],
  },
  {
    id: 'huawei-ce6865', cat: 'network', vendor: 'huawei',
    name: 'Huawei CloudEngine 6865',
    subtitle: 'Высокоплотный 25G/100G коммутатор для ЦОД',
    price: null, oldPrice: null, badge: 'По запросу',
    form: 'network', cpu: null, inStock: true,
    specs: { 'Порты': '48× 25G + 8× 100G', 'Пропускная способность': '4 Тбит/с', 'Режим': 'SDN-ready', 'Высота': '1U', 'Гарантия': 'Hi-Care опц.' },
    tags: ['25G', '100G', 'SDN'],
  },

  // ─── GPU / AI ───
  {
    id: 'nvidia-dgx', cat: 'gpu', vendor: 'nvidia',
    name: 'NVIDIA DGX H100',
    subtitle: 'AI-суперкомпьютер · 8× H100 Tensor Core GPU',
    price: null, oldPrice: null, badge: 'Топ AI',
    form: 'gpu', cpu: null, inStock: true,
    specs: { 'GPU': '8× NVIDIA H100 80 ГБ', 'Производительность': '32 PFLOPS FP8', 'Память GPU': '640 ГБ HBM3', 'Сеть': '8× 400G InfiniBand', 'Гарантия': '1 год' },
    tags: ['H100', 'AI/ML', 'Проверка с логами'],
  },
  {
    id: 'supermicro-gpu', cat: 'gpu', vendor: 'supermicro',
    name: 'Supermicro SYS-821GE-TNHR',
    subtitle: 'GPU-сервер 8U под 8× NVIDIA HGX H100',
    price: null, oldPrice: null, badge: 'По запросу',
    form: 'gpu', cpu: 'Xeon', inStock: true,
    specs: { 'GPU': 'до 8× HGX H100', 'Процессоры': '2× Xeon Scalable', 'Память': 'до 8 ТБ DDR5', 'Форм-фактор': '8U', 'Гарантия': '1 год' },
    tags: ['HGX', 'Rendering', 'HPC'],
  },
  {
    id: 'dell-xe9680', cat: 'gpu', vendor: 'dell',
    name: 'Dell PowerEdge XE9680',
    subtitle: 'Флагманский GPU-сервер для генеративного ИИ',
    price: null, oldPrice: null, badge: 'Топ AI',
    form: 'gpu', cpu: 'Xeon', inStock: false,
    specs: { 'GPU': '8× H100 / MI300X', 'Процессоры': '2× Xeon 4th Gen', 'Память': 'до 4 ТБ DDR5', 'Форм-фактор': '6U', 'Гарантия': '1 год' },
    tags: ['LLM', 'Generative AI'],
  },

  // ─── PARTS ───
  {
    id: 'part-ddr5', cat: 'parts', vendor: 'dell',
    name: 'Модуль памяти DDR5 64 ГБ RDIMM',
    subtitle: 'Серверная память 4800 МТ/с · оригинал с завода',
    price: 38500, oldPrice: null, badge: 'В наличии',
    form: 'part', cpu: null, inStock: true,
    specs: { 'Тип': 'DDR5 RDIMM ECC', 'Частота': '4800 МТ/с', 'Объём': '64 ГБ', 'Совместимость': 'PowerEdge 16G', 'Гарантия': '1 год' },
    tags: ['DDR5', 'ЗИП', 'Оригинал'],
  },
  {
    id: 'part-ssd', cat: 'parts', vendor: 'dell',
    name: 'NVMe SSD 7.68 ТБ U.2',
    subtitle: 'Корпоративный твердотельный накопитель Mixed Use',
    price: 142000, oldPrice: 158000, badge: null,
    form: 'part', cpu: null, inStock: true,
    specs: { 'Интерфейс': 'PCIe 4.0 NVMe U.2', 'Объём': '7.68 ТБ', 'Ресурс': '3 DWPD', 'Тип': 'Mixed Use', 'Гарантия': '1 год' },
    tags: ['NVMe', 'ЗИП'],
  },
  {
    id: 'part-legacy', cat: 'parts', vendor: 'hpe',
    name: 'Запчасти для устаревшего фонда',
    subtitle: 'Поиск редких комплектующих EOL/EOS оборудования',
    price: null, oldPrice: null, badge: 'Проектная поставка',
    form: 'part', cpu: null, inStock: true,
    specs: { 'Назначение': 'Поддержание ЗИП-складов', 'Вендоры': 'Dell, HPE, Cisco, Lenovo, Huawei', 'Состояние': 'Новые / восстановленные', 'Каналы': 'СНГ, Азия', 'Гарантия': 'По договору' },
    tags: ['EOL/EOS', 'Редкие детали', 'ЗИП'],
  },
];

// __resources override (for standalone bundle; falls back to absolute URLs live)
if (typeof window !== 'undefined' && window.__resources) {
  VENDORS.forEach(v => { const r = window.__resources['v_' + v.id]; if (r) v.logo = r; });
}
window.SHOP_DATA = { CATEGORIES, VENDORS, PRODUCTS };

// Helper: format RUB
window.formatRub = function(n) {
  if (n == null) return 'Цена по запросу';
  return new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
};
