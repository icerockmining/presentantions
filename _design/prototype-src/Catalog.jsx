// Catalog.jsx — catalog with filters + compare page
// Exports to window: ShopCatalog, ShopCompare

function ShopCatalog({ initialCat, onOpen, onAdd, onCompare, compareIds, onNav, accent }) {
  const { PRODUCTS, CATEGORIES, VENDORS } = window.SHOP_DATA;
  const [cat, setCat] = React.useState(initialCat || 'all');
  const [vendors, setVendors] = React.useState([]);
  const [inStockOnly, setInStockOnly] = React.useState(false);
  const [hasPriceOnly, setHasPriceOnly] = React.useState(false);
  const [sort, setSort] = React.useState('default');
  const [mobileFilters, setMobileFilters] = React.useState(false);

  React.useEffect(() => { setCat(initialCat || 'all'); }, [initialCat]);

  let list = PRODUCTS.filter(p => {
    if (cat !== 'all' && p.cat !== cat) return false;
    if (vendors.length && !vendors.includes(p.vendor)) return false;
    if (inStockOnly && !p.inStock) return false;
    if (hasPriceOnly && p.price == null) return false;
    return true;
  });
  if (sort === 'price-asc') list = [...list].sort((a, b) => (a.price || 9e15) - (b.price || 9e15));
  if (sort === 'price-desc') list = [...list].sort((a, b) => (b.price || -1) - (a.price || -1));

  const toggleVendor = (id) => setVendors(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id]);
  const catName = cat === 'all' ? 'Весь каталог' : catById(cat).name;
  const availVendors = VENDORS.filter(v => PRODUCTS.some(p => p.vendor === v.id && (cat === 'all' || p.cat === cat)));

  const FilterPanel = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <FilterGroup title="Категория">
        <FilterRadio label="Все категории" checked={cat === 'all'} onClick={() => setCat('all')} count={PRODUCTS.length} accent={accent} />
        {CATEGORIES.map(c => (
          <FilterRadio key={c.id} label={c.name} checked={cat === c.id} onClick={() => setCat(c.id)} count={c.count} accent={accent} />
        ))}
      </FilterGroup>
      <FilterGroup title="Производитель">
        {availVendors.map(v => (
          <FilterCheck key={v.id} label={v.name} checked={vendors.includes(v.id)} onClick={() => toggleVendor(v.id)} accent={accent} />
        ))}
      </FilterGroup>
      <FilterGroup title="Наличие">
        <FilterCheck label="В наличии" checked={inStockOnly} onClick={() => setInStockOnly(!inStockOnly)} accent={accent} />
        <FilterCheck label="С указанной ценой" checked={hasPriceOnly} onClick={() => setHasPriceOnly(!hasPriceOnly)} accent={accent} />
      </FilterGroup>
      {(vendors.length > 0 || inStockOnly || hasPriceOnly) && (
        <button onClick={() => { setVendors([]); setInStockOnly(false); setHasPriceOnly(false); }} style={{ background: 'none', border: 'none', color: accent, fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>Сбросить фильтры</button>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 32px 80px' }}>
      {/* breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6c8584', marginBottom: 18 }}>
        <span onClick={() => onNav('home')} style={{ cursor: 'pointer' }}>Главная</span>
        <span>/</span>
        <span style={{ color: '#9fb6b5' }}>{catName}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 34, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{catName}</h1>
          <p style={{ fontSize: 14, color: '#6c8584', marginTop: 6 }}>Найдено: {list.length} {plural(list.length)}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => setMobileFilters(true)} className="shop-show-mobile" style={{ display: 'none', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, padding: '9px 14px', color: '#cfe3e2', fontFamily: 'inherit', fontSize: 14, cursor: 'pointer' }}>
            <Icon name="filter" size={16} /> Фильтры
          </button>
          <SortSelect sort={sort} setSort={setSort} accent={accent} />
        </div>
      </div>

      <div className="shop-catalog-layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32, alignItems: 'start' }}>
        {/* sidebar */}
        <aside className="shop-hide-mobile" style={{ position: 'sticky', top: 200, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22 }}>
          <FilterPanel />
          <PromoMini accent={accent} onNav={onNav} />
        </aside>
        {/* grid */}
        <div>
          {(cat === 'all' || cat === 'servers') && <CatalogBanner accent={accent} onNav={onNav} />}
          {list.length === 0 ? (
            <div style={{ padding: '80px 0', textAlign: 'center', color: '#6c8584' }}>
              <Icon name="search" size={40} stroke="#3e5453" />
              <p style={{ marginTop: 16, fontSize: 15 }}>Ничего не найдено. Измените фильтры или <span onClick={() => onNav('rfq')} style={{ color: accent, cursor: 'pointer' }}>запросите КП</span>.</p>
            </div>
          ) : (
            <div className="shop-catalog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
              {list.map((p, i) => (
                <React.Fragment key={p.id}>
                  <ProductCard product={p} onOpen={onOpen} onAdd={onAdd} onCompare={onCompare} inCompare={compareIds.includes(p.id)} accent={accent} />
                  {i === 2 && list.length > 4 && <AccentGpuCard accent={accent} onNav={onNav} />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      {mobileFilters && (
        <div className="shop-show-mobile" style={{ display: 'none', position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)' }} onClick={() => setMobileFilters(false)}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '85%', maxWidth: 340, background: '#0a141e', borderLeft: '1px solid rgba(255,255,255,0.1)', padding: 24, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Фильтры</span>
              <button onClick={() => setMobileFilters(false)} style={{ background: 'none', border: 'none', color: '#9fb6b5', cursor: 'pointer' }}><Icon name="close" size={22} /></button>
            </div>
            <FilterPanel />
            <div style={{ marginTop: 28 }}><Btn variant="teal" full onClick={() => setMobileFilters(false)}>Показать {list.length}</Btn></div>
          </div>
        </div>
      )}
    </div>
  );
}

function plural(n) {
  const m = n % 10, h = n % 100;
  if (m === 1 && h !== 11) return 'позиция';
  if (m >= 2 && m <= 4 && (h < 10 || h >= 20)) return 'позиции';
  return 'позиций';
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6c8584', marginBottom: 14 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</div>
    </div>
  );
}

function FilterRadio({ label, checked, onClick, count, accent }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '6px 0', width: '100%' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ width: 16, height: 16, borderRadius: 999, border: `2px solid ${checked ? accent : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {checked && <span style={{ width: 7, height: 7, borderRadius: 999, background: accent }} />}
        </span>
        <span style={{ fontSize: 14, color: checked ? '#fff' : '#9fb6b5' }}>{label}</span>
      </span>
      {count != null && <span style={{ fontSize: 12, color: '#4a6362' }}>{count}</span>}
    </button>
  );
}

function FilterCheck({ label, checked, onClick, accent }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '6px 0', width: '100%' }}>
      <span style={{ width: 16, height: 16, borderRadius: 5, border: `2px solid ${checked ? accent : 'rgba(255,255,255,0.2)'}`, background: checked ? accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {checked && <Icon name="check" size={11} stroke="#fff" sw={3} />}
      </span>
      <span style={{ fontSize: 14, color: checked ? '#fff' : '#9fb6b5' }}>{label}</span>
    </button>
  );
}

function SortSelect({ sort, setSort, accent }) {
  return (
    <select value={sort} onChange={e => setSort(e.target.value)} style={{
      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9,
      padding: '9px 14px', color: '#cfe3e2', fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', outline: 'none',
    }}>
      <option value="default" style={{ background: '#0a141e' }}>По умолчанию</option>
      <option value="price-asc" style={{ background: '#0a141e' }}>Сначала дешевле</option>
      <option value="price-desc" style={{ background: '#0a141e' }}>Сначала дороже</option>
    </select>
  );
}

// ─── PROMO: wide catalog banner ─────────────────────────────────
function CatalogBanner({ accent, onNav }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 18, border: '1px solid rgba(42,159,158,0.28)', background: 'linear-gradient(120deg, #0a2a29 0%, #07243a 70%)', padding: '30px 34px', marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%)', opacity: 0.1 }}><Icon name="storage" size={200} stroke={accent} sw={0.6} /></div>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
        <Badge tone="green">Склад в Москве · в наличии</Badge>
        <h3 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: '12px 0 8px', lineHeight: 1.15 }}>Часть позиций — со склада, отгрузка сразу</h3>
        <p style={{ fontSize: 15, color: '#9fc4c2', lineHeight: 1.55 }}>Серверы, СХД и комплектующие в наличии в Москве. Остальное — прямой импорт с заводов за 57 дней.</p>
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 12, flexShrink: 0 }}>
        <Btn variant="light" icon="arrow" onClick={() => onNav('delivery')}>Условия доставки</Btn>
      </div>
    </div>
  );
}

// ─── PROMO: inline accent card inside grid ──────────────────────
function AccentGpuCard({ accent, onNav }) {
  return (
    <div style={{ gridColumn: 'span 1', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(214,160,40,0.3)', background: 'linear-gradient(150deg, #1c1605 0%, #0a141e 70%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 24, position: 'relative' }}>
      <div style={{ position: 'absolute', right: -30, bottom: -20, opacity: 0.12 }}><Icon name="gpu" size={150} stroke="#e3b552" sw={0.7} /></div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Badge tone="gold">GPU &amp; AI</Badge>
        <h3 style={{ fontSize: 21, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', margin: '14px 0 8px', lineHeight: 1.2 }}>Суперкомпьютеры на NVIDIA H100</h3>
        <p style={{ fontSize: 13.5, color: '#c9b890', lineHeight: 1.55 }}>Соберём AI-кластер под вашу задачу. Проверка с логами до отгрузки.</p>
      </div>
      <div style={{ position: 'relative', zIndex: 1, marginTop: 18 }}>
        <Btn variant="light" size="sm" icon="arrow" onClick={() => onNav('catalog-gpu')}>Смотреть GPU</Btn>
      </div>
    </div>
  );
}

// ─── PROMO: sidebar mini banner ─────────────────────────────────
function PromoMini({ accent, onNav }) {
  return (
    <div style={{ marginTop: 24, borderRadius: 14, border: '1px solid rgba(42,159,158,0.25)', background: 'rgba(42,159,158,0.08)', padding: 20 }}>
      <Icon name="doc" size={24} stroke={accent} sw={1.6} />
      <div style={{ fontSize: 15.5, fontWeight: 700, color: '#fff', margin: '12px 0 6px', lineHeight: 1.25 }}>Не нашли нужное?</div>
      <p style={{ fontSize: 12.5, color: '#9fb6b5', lineHeight: 1.55, marginBottom: 14 }}>Подберём конфигурацию и подготовим КП в рублях.</p>
      <Btn variant="teal" size="sm" full onClick={() => onNav('rfq')}>Запросить КП</Btn>
    </div>
  );
}

// ─── COMPARE PAGE ───────────────────────────────────────────────
function ShopCompare({ compareIds, onRemoveCompare, onAdd, onNav, onOpen, accent }) {
  const { PRODUCTS } = window.SHOP_DATA;
  const items = compareIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
        <Icon name="compare" size={48} stroke="#3e5453" />
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginTop: 20 }}>Список сравнения пуст</h1>
        <p style={{ fontSize: 15, color: '#8aa3a2', marginTop: 10, marginBottom: 28 }}>Добавьте товары из каталога, чтобы сравнить характеристики.</p>
        <Btn variant="teal" icon="arrow" onClick={() => onNav('catalog')}>Перейти в каталог</Btn>
      </div>
    );
  }

  // collect all spec keys
  const specKeys = [];
  items.forEach(p => Object.keys(p.specs).forEach(k => { if (!specKeys.includes(k)) specKeys.push(k); }));

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 32px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6c8584', marginBottom: 18 }}>
        <span onClick={() => onNav('home')} style={{ cursor: 'pointer' }}>Главная</span><span>/</span><span style={{ color: '#9fb6b5' }}>Сравнение</span>
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 28 }}>Сравнение товаров</h1>

      <div style={{ overflowX: 'auto', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr>
              <th style={{ width: 180, padding: 18, textAlign: 'left', verticalAlign: 'bottom', position: 'sticky', left: 0, background: '#0a141e', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6c8584' }}>Характеристика</span>
              </th>
              {items.map(p => (
                <th key={p.id} style={{ padding: 18, textAlign: 'left', borderLeft: '1px solid rgba(255,255,255,0.06)', minWidth: 220, verticalAlign: 'top' }}>
                  <div style={{ position: 'relative' }}>
                    <button onClick={() => onRemoveCompare(p.id)} style={{ position: 'absolute', top: -4, right: -4, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, width: 26, height: 26, cursor: 'pointer', color: '#9fb6b5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={14} /></button>
                    <div style={{ width: 64, height: 64, borderRadius: 12, background: 'radial-gradient(ellipse at 50% 40%, #112a44, #0a141e)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                      <Icon name={catById(p.cat).icon} size={30} stroke={accent} sw={1.3} />
                    </div>
                    <div onClick={() => onOpen(p.id)} style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 6, cursor: 'pointer', paddingRight: 24 }}>{p.name}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: p.price ? '#fff' : '#5bd0ce', marginBottom: 12 }}>{window.formatRub(p.price)}</div>
                    <Btn size="sm" variant="teal" onClick={() => onAdd(p)} full>{p.price ? 'В корзину' : 'Запросить'}</Btn>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <CompareRow label="Производитель" items={items} render={p => vendorById(p.vendor).name} />
            <CompareRow label="Категория" items={items} render={p => catById(p.cat).name} />
            <CompareRow label="Наличие" items={items} render={p => p.inStock ? '✓ В наличии' : 'Под заказ'} highlight={p => p.inStock} accent={accent} />
            {specKeys.map(k => (
              <CompareRow key={k} label={k} items={items} render={p => p.specs[k] || '—'} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompareRow({ label, items, render, highlight, accent }) {
  return (
    <tr style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <td style={{ padding: '14px 18px', fontSize: 13.5, color: '#8aa3a2', fontWeight: 500, position: 'sticky', left: 0, background: '#0a141e', borderRight: '1px solid rgba(255,255,255,0.06)' }}>{label}</td>
      {items.map(p => (
        <td key={p.id} style={{ padding: '14px 18px', fontSize: 14, color: highlight && highlight(p) ? (accent || '#5bd0ce') : '#e2eeee', borderLeft: '1px solid rgba(255,255,255,0.06)', lineHeight: 1.45 }}>{render(p)}</td>
      ))}
    </tr>
  );
}

Object.assign(window, { ShopCatalog, ShopCompare });
