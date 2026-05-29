// ShopUI.jsx — shared shop components (icons, header, footer, product card, primitives)
// Exports to window: Icon, ShopHeader, ShopFooter, ProductCard, Badge, Btn, vendorById, catById

// ─── ICONS (stroke, premium) ────────────────────────────────────
const ICONS = {
  server: <g><rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><line x1="7" y1="7.5" x2="7" y2="7.5"/><line x1="7" y1="16.5" x2="7" y2="16.5"/></g>,
  storage: <g><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></g>,
  network: <g><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a14 14 0 0 1 4 9 14 14 0 0 1-4 9 14 14 0 0 1-4-9 14 14 0 0 1 4-9z"/></g>,
  gpu: <g><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="9" cy="12" r="2.5"/><circle cx="16" cy="12" r="1.2"/><line x1="2" y1="20" x2="6" y2="20"/></g>,
  parts: <g><path d="M12 2l2 4 4-1-1 4 4 2-4 2 1 4-4-1-2 4-2-4-4 1 1-4-4-2 4-2-1-4 4 1z"/><circle cx="12" cy="12" r="2.5"/></g>,
  cart: <g><circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2.5 3h2.5l2.7 13.4a2 2 0 0 0 2 1.6h9.4a2 2 0 0 0 2-1.6L23 7H6"/></g>,
  search: <g><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></g>,
  arrow: <g><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></g>,
  check: <polyline points="20 6 9 17 4 12"/>,
  compare: <g><path d="M9 3v18M15 3v18"/><path d="M3 7h6M3 12h6M3 17h6M15 7h6M15 12h6M15 17h6"/></g>,
  filter: <g><polygon points="22 3 2 3 10 12.5 10 19 14 21 14 12.5 22 3"/></g>,
  shield: <g><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></g>,
  truck: <g><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></g>,
  doc: <g><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/></g>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.4h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.87-1.87a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>,
  menu: <g><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></g>,
  close: <g><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></g>,
  minus: <line x1="5" y1="12" x2="19" y2="12"/>,
  plus: <g><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></g>,
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
  bolt: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
  trash: <g><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></g>,
  globe: <g><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></g>,
};

function Icon({ name, size = 20, stroke = 'currentColor', sw = 1.7, fill = 'none', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
         strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {ICONS[name] || null}
    </svg>
  );
}

// ─── data helpers ──────────────────────────────────────────────
function vendorById(id) { return window.SHOP_DATA.VENDORS.find(v => v.id === id); }
function catById(id) { return window.SHOP_DATA.CATEGORIES.find(c => c.id === id); }

// ─── BADGE ──────────────────────────────────────────────────────
function Badge({ children, tone = 'teal' }) {
  const tones = {
    teal:   { bg: 'rgba(42,159,158,0.15)', fg: '#5bd0ce', bd: 'rgba(42,159,158,0.3)' },
    gold:   { bg: 'rgba(214,160,40,0.15)', fg: '#e3b552', bd: 'rgba(214,160,40,0.3)' },
    green:  { bg: 'rgba(40,180,110,0.15)', fg: '#46c98a', bd: 'rgba(40,180,110,0.3)' },
    slate:  { bg: 'rgba(255,255,255,0.06)', fg: '#9fb6b5', bd: 'rgba(255,255,255,0.12)' },
  };
  const t = tones[tone] || tones.teal;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600,
      letterSpacing: '0.01em', whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

// ─── BUTTON ─────────────────────────────────────────────────────
function Btn({ children, variant = 'primary', size = 'md', onClick, full, icon, style }) {
  const [hover, setHover] = React.useState(false);
  const sizes = {
    sm: { padding: '8px 16px', fontSize: 13 },
    md: { padding: '12px 22px', fontSize: 15 },
    lg: { padding: '15px 30px', fontSize: 16 },
  };
  const variants = {
    primary: { background: hover ? '#06807e' : '#00706e', color: '#fff', border: '1px solid transparent' },
    teal:    { background: hover ? '#2a9f9e' : '#1c8786', color: '#fff', border: '1px solid transparent' },
    outline: { background: hover ? 'rgba(255,255,255,0.06)' : 'transparent', color: '#cfe3e2', border: '1px solid rgba(255,255,255,0.18)' },
    ghost:   { background: hover ? 'rgba(255,255,255,0.06)' : 'transparent', color: '#9fb6b5', border: '1px solid transparent' },
    light:   { background: hover ? '#e8f5f5' : '#fff', color: '#00504f', border: '1px solid transparent' },
  };
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...sizes[size], ...variants[variant],
        fontFamily: 'inherit', fontWeight: 600, borderRadius: 10, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: full ? '100%' : 'auto', transition: 'all 150ms', whiteSpace: 'nowrap',
        ...style,
      }}>
      {children}
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} sw={2.2} />}
    </button>
  );
}

// ─── HEADER ─────────────────────────────────────────────────────
function ShopHeader({ route, onNav, cartCount, compareCount, accent }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const cats = window.SHOP_DATA.CATEGORIES;

  const navItem = (id, label) => (
    <button key={id} onClick={() => { onNav(id); setMobileOpen(false); }} style={{
      background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer',
      fontSize: 14, fontWeight: 500, padding: '6px 0',
      color: route.startsWith(id) ? '#fff' : '#9fb6b5', transition: 'color 150ms',
    }}>{label}</button>
  );

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(8,18,28,0.85)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      {/* top utility bar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center' }} className="shop-hide-mobile">
        <div style={{ width: '100%', maxWidth: 1280, padding: '0 32px', height: 38, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', fontSize: 12.5, color: '#6c8584' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#7fd8d6' }}><Icon name="storage" size={13} stroke={accent} sw={2} /> Склад в Москве — товар в наличии</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="shield" size={13} stroke={accent} sw={2} /> Только оригиналы · гарантия 1 год</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="truck" size={13} stroke={accent} sw={2} /> Доставка из Китая · 57 дней</span>
          </div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', fontSize: 12.5, color: '#8aa3a2' }}>
            <button onClick={() => onNav('about')} style={topLink}>О нас</button>
            <button onClick={() => onNav('delivery')} style={topLink}>Доставка</button>
            <button onClick={() => onNav('payment')} style={topLink}>Оплата</button>
            <button onClick={() => onNav('blog')} style={topLink}>Блог</button>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="globe" size={13} stroke="#6c8584" sw={2} /> Смирновская ул., 2с1 · Москва</span>
          </div>
        </div>
      </div>
      {/* main bar */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 1280, padding: '0 32px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <img src={(window.__resources&&window.__resources.logo)||"../../assets/logo-wordmark.svg"} alt="Cashes Green Rus" onClick={() => onNav('home')}
               style={{ height: 24, filter: 'brightness(0) invert(1)', cursor: 'pointer', flexShrink: 0 }} />
          {/* search */}
          <div className="shop-hide-mobile" style={{ flex: 1, maxWidth: 420, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0 14px', height: 42 }}>
            <Icon name="search" size={17} stroke="#6c8584" />
            <input placeholder="Поиск по каталогу: сервер, СХД, GPU…" style={{
              flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff',
              fontFamily: 'inherit', fontSize: 14,
            }} />
          </div>
          {/* prominent phone */}
          <a href="tel:+79042996201" className="shop-hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(42,159,158,0.15)', border: '1px solid rgba(42,159,158,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="phone" size={18} stroke={accent} sw={2} />
            </div>
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>8 (904) 299-62-01</div>
              <div style={{ fontSize: 11.5, color: '#6c8584' }}>Пн–Пт 10:00–19:00 · перезвоним</div>
            </div>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button onClick={() => onNav('compare')} className="shop-hide-mobile" style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#9fb6b5', display: 'flex' }}>
              <Icon name="compare" size={21} />
              {compareCount > 0 && <CountDot n={compareCount} accent={accent} />}
            </button>
            <button onClick={() => onNav('cart')} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#fff', display: 'flex' }}>
              <Icon name="cart" size={21} />
              {cartCount > 0 && <CountDot n={cartCount} accent={accent} />}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="shop-show-mobile" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#fff', display: 'none' }}>
              <Icon name={mobileOpen ? 'close' : 'menu'} size={22} />
            </button>
          </div>
        </div>
      </div>
      {/* category nav */}
      <nav className="shop-hide-mobile" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 1280, padding: '0 32px', height: 46, display: 'flex', alignItems: 'center', gap: 24 }}>
          <button onClick={() => onNav('catalog')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: accent, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
            <Icon name="menu" size={15} sw={2.2} /> Каталог
          </button>
          {cats.map(c => navItem('catalog-' + c.id, c.name))}
          <button onClick={() => onNav('rfq')} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: accent, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            <Icon name="doc" size={15} stroke={accent} /> Запросить КП
          </button>
        </div>
      </nav>
      {/* mobile menu */}
      {mobileOpen && (
        <div className="shop-show-mobile" style={{ display: 'none', flexDirection: 'column', padding: '16px 24px', gap: 4, borderTop: '1px solid rgba(255,255,255,0.07)', background: '#0a141e' }}>
          <a href="tel:+79042996201" style={{ ...mobileItemStyle(accent, true), textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="phone" size={16} stroke={accent} /> 8 (904) 299-62-01</a>
          <button onClick={() => { onNav('about'); setMobileOpen(false); }} style={mobileItemStyle(accent, false)}>О нас</button>
          <button onClick={() => { onNav('catalog'); setMobileOpen(false); }} style={mobileItemStyle(accent, false)}>Весь каталог</button>
          {cats.map(c => <button key={c.id} onClick={() => { onNav('catalog-' + c.id); setMobileOpen(false); }} style={mobileItemStyle(accent, false)}>{c.name}</button>)}
          <button onClick={() => { onNav('delivery'); setMobileOpen(false); }} style={mobileItemStyle(accent, false)}>Доставка</button>
          <button onClick={() => { onNav('payment'); setMobileOpen(false); }} style={mobileItemStyle(accent, false)}>Оплата</button>
          <button onClick={() => { onNav('blog'); setMobileOpen(false); }} style={mobileItemStyle(accent, false)}>Блог</button>
          <button onClick={() => { onNav('rfq'); setMobileOpen(false); }} style={mobileItemStyle(accent, false)}>Запросить КП</button>
          <button onClick={() => { onNav('compare'); setMobileOpen(false); }} style={mobileItemStyle(accent, false)}>Сравнение ({compareCount})</button>
        </div>
      )}
    </header>
  );
}

const topLink = { background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer', fontSize: 12.5, color: '#8aa3a2', padding: 0 };

function mobileItemStyle(accent, primary) {
  return {
    textAlign: 'left', background: primary ? 'rgba(42,159,158,0.12)' : 'none',
    border: 'none', fontFamily: 'inherit', cursor: 'pointer',
    fontSize: 15, fontWeight: primary ? 600 : 500, padding: '12px 14px', borderRadius: 8,
    color: primary ? '#5bd0ce' : '#cfe3e2',
  };
}

function CountDot({ n, accent }) {
  return <span style={{
    position: 'absolute', top: 2, right: 2, minWidth: 16, height: 16, padding: '0 4px',
    background: accent, color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>{n}</span>;
}

// ─── PRODUCT CARD ───────────────────────────────────────────────
function ProductCard({ product, onOpen, onAdd, onCompare, inCompare, accent }) {
  const [hover, setHover] = React.useState(false);
  const vendor = vendorById(product.vendor);
  const cat = catById(product.cat);

  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hover ? 'rgba(42,159,158,0.4)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'all 180ms', cursor: 'pointer',
        transform: hover ? 'translateY(-3px)' : 'none',
      }}>
      {/* image area */}
      <div onClick={() => onOpen(product.id)} style={{
        height: 168, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 40%, #112a44 0%, #0a141e 75%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap', maxWidth: '70%' }}>
          {product.badge && <Badge tone={product.badge.includes('Hi-Care') || product.badge.includes('Топ') ? 'gold' : product.badge.includes('наличии') ? 'green' : 'teal'}>{product.badge}</Badge>}
        </div>
        <div style={{ position: 'absolute', top: 12, right: 12, height: 22, display: 'flex', alignItems: 'center' }}>
          <img src={vendor.logo} alt={vendor.name} style={{ height: 16, maxWidth: 64, objectFit: 'contain', filter: 'grayscale(1) brightness(2)', opacity: 0.7 }}
               onError={(e) => { e.target.replaceWith(Object.assign(document.createElement('span'), { textContent: vendor.name, style: 'color:#6c8584;font-size:12px;font-weight:700' })); }} />
        </div>
        <ServerGlyph cat={product.cat} accent={accent} />
      </div>
      {/* body */}
      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
        <div onClick={() => onOpen(product.id)} style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6c8584', marginBottom: 6 }}>{cat.name}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 6 }}>{product.name}</div>
          <div style={{ fontSize: 13, color: '#8aa3a2', lineHeight: 1.5 }}>{product.subtitle}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {product.tags.slice(0, 3).map(t => (
            <span key={t} style={{ fontSize: 11, color: '#9fb6b5', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 5, padding: '2px 7px' }}>{t}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4 }}>
          <div>
            {product.oldPrice && <div style={{ fontSize: 12, color: '#6c8584', textDecoration: 'line-through' }}>{window.formatRub(product.oldPrice)}</div>}
            <div style={{ fontSize: product.price ? 20 : 15, fontWeight: 700, color: product.price ? '#fff' : '#5bd0ce', lineHeight: 1.2 }}>{window.formatRub(product.price)}</div>
            {product.price && <div style={{ fontSize: 11, color: '#6c8584', marginTop: 2 }}>по курсу ЦБ РФ · с НДS</div>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn size="sm" variant="teal" onClick={() => onAdd(product)} full>
            {product.price ? 'В корзину' : 'Запросить'}
          </Btn>
          <button onClick={() => onCompare(product.id)} title="Сравнить" style={{
            flexShrink: 0, width: 38, height: 38, borderRadius: 9, cursor: 'pointer',
            background: inCompare ? accent : 'rgba(255,255,255,0.05)',
            border: `1px solid ${inCompare ? accent : 'rgba(255,255,255,0.12)'}`,
            color: inCompare ? '#fff' : '#9fb6b5', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="compare" size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Decorative server glyph per category
function ServerGlyph({ cat, accent }) {
  return (
    <div style={{ opacity: 0.9 }}>
      <Icon name={catById(cat).icon} size={64} stroke={accent} sw={1.1} />
    </div>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────────
function ShopFooter({ onNav, accent }) {
  const cats = window.SHOP_DATA.CATEGORIES;
  const col = (title, items) => (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#4a6362', marginBottom: 16 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it, i) => <span key={i} onClick={it.go ? () => onNav(it.go) : undefined} style={{ fontSize: 13.5, color: '#7e9897', cursor: it.go ? 'pointer' : 'default' }}>{it.label}</span>)}
      </div>
    </div>
  );
  return (
    <footer style={{ background: '#060d15', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '56px 0 28px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div className="shop-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, paddingBottom: 36, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <img src={(window.__resources&&window.__resources.logo)||"../../assets/logo-wordmark.svg"} alt="CGR" style={{ height: 22, filter: 'brightness(0) invert(1)', marginBottom: 16 }} />
            <p style={{ fontSize: 13.5, color: '#5e7776', lineHeight: 1.65, maxWidth: 300, marginBottom: 16 }}>
              Технологический дистрибьютор серверного и AI-оборудования. Прямые поставки с заводов и продажа со склада в Москве. Оборот более 1 млрд ₽ в год.
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 16, padding: '12px 14px', background: 'rgba(42,159,158,0.08)', border: '1px solid rgba(42,159,158,0.2)', borderRadius: 10, maxWidth: 300 }}>
              <Icon name="globe" size={16} stroke={accent} sw={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 12.5, color: '#9fb6b5', lineHeight: 1.5 }}><b style={{ color: '#cfe3e2' }}>Офис и склад:</b><br />Смирновская ул., 2, стр. 1, офис 122, Москва</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {window.SHOP_DATA.VENDORS.slice(0, 6).map(v => (
                <img key={v.id} src={v.logo} alt={v.name} style={{ height: 15, maxWidth: 54, objectFit: 'contain', filter: 'grayscale(1) brightness(1.8)', opacity: 0.5 }} />
              ))}
            </div>
          </div>
          {col('Каталог', cats.map(c => ({ label: c.name, go: 'catalog-' + c.id })))}
          {col('Покупателю', [{ label: 'О нас', go: 'about' }, { label: 'Доставка', go: 'delivery' }, { label: 'Оплата', go: 'payment' }, { label: 'Блог', go: 'blog' }, { label: 'Запросить КП', go: 'rfq' }])}
          {col('Контакты', [{ label: '8 (904) 299-62-01' }, { label: 'inquiry@cashesgreen.ru' }, { label: 'Смирновская ул., 2с1, оф. 122' }, { label: 'Пн–Пт: 10:00–19:00' }])}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12.5, color: '#3e5453' }}>© 2025 ООО «КЭШЕС ГРИН РУС». Расчёт в рублях по курсу ЦБ РФ, НДС 22%.</span>
          <span style={{ fontSize: 12.5, color: '#3e5453' }}>cashesgreen.ru</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Icon, ShopHeader, ShopFooter, ProductCard, Badge, Btn, vendorById, catById, ServerGlyph });
