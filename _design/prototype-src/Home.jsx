// Home.jsx — Shop homepage with 3 hero variants
// Exports to window: ShopHome

function ShopHome({ onNav, onOpen, onAdd, onCompare, compareIds, accent, heroVariant }) {
  const { PRODUCTS, CATEGORIES } = window.SHOP_DATA;
  const featured = PRODUCTS.filter(p => p.badge === 'Хит' || p.badge === 'Топ AI').slice(0, 4);
  const popular = PRODUCTS.slice(0, 8);

  return (
    <div>
      {heroVariant === 'A' && <HeroA onNav={onNav} accent={accent} />}
      {heroVariant === 'B' && <HeroB onNav={onNav} accent={accent} />}
      {heroVariant === 'C' && <HeroC onNav={onNav} onOpen={onOpen} accent={accent} />}

      {/* trust strip */}
      <TrustStrip accent={accent} />

      {/* categories */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 0' }}>
        <SectionHead eyebrow="Каталог" title="Категории оборудования" accent={accent}
          action={{ label: 'Весь каталог', go: 'catalog' }} onNav={onNav} />
        <div className="shop-cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16 }}>
          {CATEGORIES.map(c => (
            <CategoryTile key={c.id} cat={c} accent={accent} onClick={() => onNav('catalog-' + c.id)} />
          ))}
        </div>
      </section>

      {/* featured products */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 0' }}>
        <SectionHead eyebrow="Рекомендуем" title="Популярные позиции" accent={accent}
          action={{ label: 'Смотреть все', go: 'catalog' }} onNav={onNav} />
        <div className="shop-prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
          {popular.slice(0, 4).map(p => (
            <ProductCard key={p.id} product={p} onOpen={onOpen} onAdd={onAdd} onCompare={onCompare} inCompare={compareIds.includes(p.id)} accent={accent} />
          ))}
        </div>
      </section>

      {/* AI banner */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 0' }}>
        <AiBanner onNav={onNav} accent={accent} />
      </section>

      {/* more products */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 0' }}>
        <SectionHead eyebrow="В наличии" title="Новые поступления" accent={accent}
          action={{ label: 'Смотреть все', go: 'catalog' }} onNav={onNav} />
        <div className="shop-prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
          {popular.slice(4, 8).map(p => (
            <ProductCard key={p.id} product={p} onOpen={onOpen} onAdd={onAdd} onCompare={onCompare} inCompare={compareIds.includes(p.id)} accent={accent} />
          ))}
        </div>
      </section>

      {/* RFQ CTA */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px 80px' }}>
        <RfqCta onNav={onNav} accent={accent} />
      </section>
    </div>
  );
}

// ─── SHARED bits ────────────────────────────────────────────────
function SectionHead({ eyebrow, title, action, onNav, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
          <span style={{ width: 22, height: 2, background: accent, borderRadius: 1 }} />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent }}>{eyebrow}</span>
        </div>
        <h2 style={{ fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{title}</h2>
      </div>
      {action && (
        <button onClick={() => onNav(action.go)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: '#9fb6b5', display: 'flex', alignItems: 'center', gap: 7 }}>
          {action.label} <Icon name="arrow" size={16} sw={2} />
        </button>
      )}
    </div>
  );
}

function CategoryTile({ cat, accent, onClick }) {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: h ? 'rgba(42,159,158,0.1)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${h ? 'rgba(42,159,158,0.4)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 14, padding: '24px 18px', cursor: 'pointer', fontFamily: 'inherit',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, transition: 'all 160ms',
      transform: h ? 'translateY(-2px)' : 'none',
    }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: h ? accent : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 160ms' }}>
        <Icon name={cat.icon} size={28} stroke={h ? '#fff' : accent} sw={1.5} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{cat.name}</div>
        <div style={{ fontSize: 12, color: '#6c8584' }}>{cat.count} позиций</div>
      </div>
    </button>
  );
}

function TrustStrip({ accent }) {
  const items = [
    { icon: 'storage', t: 'Склад в Москве', s: 'Товары в наличии — отгрузка сразу' },
    { icon: 'truck', t: 'Импорт из Китая', s: 'Под заказ в среднем 57 дней' },
    { icon: 'doc', t: 'Официально', s: 'Договор с НДС, расчёт по ЦБ РФ' },
    { icon: 'check', t: 'Проверка до отгрузки', s: 'Логи с серверов заказчику' },
  ];
  return (
    <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
      <div className="shop-trust-grid" style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(42,159,158,0.12)', border: '1px solid rgba(42,159,158,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={it.icon} size={20} stroke={accent} sw={1.8} />
            </div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: '#fff' }}>{it.t}</div>
              <div style={{ fontSize: 12.5, color: '#6c8584', marginTop: 2 }}>{it.s}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── HERO VARIANT A — Large statement hero ──────────────────────
function HeroA({ onNav, accent }) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ position: 'absolute', right: -120, top: '50%', transform: 'translateY(-50%)', width: 640, height: 640, border: `80px solid ${accent}`, opacity: 0.12, borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 80, top: '50%', transform: 'translateY(-50%)', width: 360, height: 360, border: `54px solid ${accent}`, opacity: 0.08, borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 32px 104px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(42,159,158,0.12)', border: '1px solid rgba(42,159,158,0.3)', borderRadius: 999, padding: '7px 16px', marginBottom: 26 }}>
          <span style={{ width: 7, height: 7, background: accent, borderRadius: 999 }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#7fd8d6' }}>Технологический дистрибьютор · 15+ лет на рынке</span>
        </div>
        <h1 style={{ fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.03em', color: '#fff', maxWidth: 880, marginBottom: 24 }}>
          Серверное оборудование<br /><span style={{ color: '#8fe0de' }}>напрямую с заводов</span>
        </h1>
        <p style={{ fontSize: 19, color: '#8aa3a2', lineHeight: 1.6, maxWidth: 560, marginBottom: 40 }}>
          Серверы, СХД, сетевое оборудование и GPU-системы от мировых вендоров. Только оригиналы, официальная гарантия 1 год, прозрачные цены в рублях.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 56 }}>
          <Btn variant="teal" size="lg" icon="arrow" onClick={() => onNav('catalog')}>Перейти в каталог</Btn>
          <Btn variant="outline" size="lg" onClick={() => onNav('rfq')}>Запросить КП</Btn>
        </div>
        <div style={{ display: 'flex', gap: 44, flexWrap: 'wrap' }}>
          {[['500+','поставок'],['1 млрд+ ₽','оборот в год'],['7','вендоров'],['Склад','в Москве']].map(([n, l], i) => (
            <div key={i}>
              <div style={{ fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{n}</div>
              <div style={{ fontSize: 13.5, color: '#6c8584', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HERO VARIANT B — Split with category quick-grid ────────────
function HeroB({ onNav, accent }) {
  const { CATEGORIES } = window.SHOP_DATA;
  return (
    <section style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="shop-herob" style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18 }}>
            <span style={{ width: 24, height: 2, background: accent, borderRadius: 1 }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent }}>IT-инфраструктура под ключ</span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#fff', marginBottom: 22 }}>
            Всё для вашего<br />дата-центра
          </h1>
          <p style={{ fontSize: 18, color: '#8aa3a2', lineHeight: 1.6, maxWidth: 460, marginBottom: 32 }}>
            Подбираем, поставляем и сопровождаем оборудование корпоративного класса. Turnkey-решения для дистрибьюторов и системных интеграторов.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Btn variant="teal" size="lg" icon="arrow" onClick={() => onNav('catalog')}>В каталог</Btn>
            <Btn variant="outline" size="lg" onClick={() => onNav('rfq')}>Консультация</Btn>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {CATEGORIES.map((c, i) => (
            <button key={c.id} onClick={() => onNav('catalog-' + c.id)} style={{
              background: i === 0 ? 'rgba(42,159,158,0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${i === 0 ? 'rgba(42,159,158,0.35)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 14, padding: '22px 18px', cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left',
              gridColumn: i === 4 ? '1 / -1' : 'auto',
            }}>
              <Icon name={c.icon} size={26} stroke={accent} sw={1.5} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{c.name}</div>
                <div style={{ fontSize: 12, color: '#6c8584', marginTop: 2 }}>{c.count} позиций →</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HERO VARIANT C — Showcase with featured product ────────────
function HeroC({ onNav, onOpen, accent }) {
  const hero = window.SHOP_DATA.PRODUCTS.find(p => p.id === 'nvidia-dgx');
  return (
    <section style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'radial-gradient(ellipse at 70% 30%, rgba(17,42,68,0.6) 0%, transparent 60%)' }}>
      <div className="shop-heroc" style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        <div>
          <Badge tone="gold">Флагман AI · NVIDIA</Badge>
          <h1 style={{ fontSize: 'clamp(34px, 4.2vw, 56px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#fff', margin: '20px 0 18px' }}>
            GPU-инфраструктура<br />для искусственного<br />интеллекта
          </h1>
          <p style={{ fontSize: 17.5, color: '#8aa3a2', lineHeight: 1.6, maxWidth: 480, marginBottom: 28 }}>
            Суперкомпьютеры на базе NVIDIA H100. Проверяем каждую систему до отгрузки и высылаем логи — вы получаете именно то, что заказали.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Btn variant="teal" size="lg" icon="arrow" onClick={() => onNav('catalog-gpu')}>GPU-серверы</Btn>
            <Btn variant="outline" size="lg" onClick={() => onOpen('nvidia-dgx')}>Подробнее</Btn>
          </div>
        </div>
        <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'radial-gradient(ellipse at 50% 40%, #143352 0%, #0a141e 80%)', minHeight: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div style={{ position: 'absolute', top: 20, left: 20 }}><Badge tone="gold">Топ AI</Badge></div>
          <div style={{ position: 'absolute', top: 20, right: 20 }}>
            <img src={window.vendorById('nvidia').logo} alt="NVIDIA" style={{ height: 20, filter: 'grayscale(1) brightness(2)', opacity: 0.8 }} />
          </div>
          <Icon name="gpu" size={120} stroke={accent} sw={0.9} />
          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{hero.name}</div>
            <div style={{ fontSize: 13.5, color: '#8aa3a2', marginTop: 6 }}>8× H100 · 640 ГБ HBM3 · 32 PFLOPS</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#5bd0ce', marginTop: 12 }}>Цена по запросу</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AiBanner({ onNav, accent }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 22, border: '1px solid rgba(42,159,158,0.25)', background: 'linear-gradient(120deg, #0a2a29 0%, #07243a 100%)', padding: '48px 52px' }}>
      <div style={{ position: 'absolute', right: -60, top: '50%', transform: 'translateY(-50%)', opacity: 0.1 }}>
        <Icon name="bolt" size={280} stroke={accent} sw={0.6} />
      </div>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>
        <Badge tone="teal">Проектные запчасти &amp; ЗИП</Badge>
        <h3 style={{ fontSize: 34, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '16px 0 12px', lineHeight: 1.1 }}>
          Редкие комплектующие для устаревшего фонда
        </h3>
        <p style={{ fontSize: 16.5, color: '#9fc4c2', lineHeight: 1.6, marginBottom: 26 }}>
          Поможем найти запчасти EOL/EOS-оборудования Dell, HPE, Cisco, Lenovo и Huawei. Пополняем ЗИП-склады дистрибьюторов и интеграторов.
        </p>
        <Btn variant="light" size="md" icon="arrow" onClick={() => onNav('rfq')}>Оставить заявку на подбор</Btn>
      </div>
    </div>
  );
}

function RfqCta({ onNav, accent }) {
  return (
    <div style={{ borderRadius: 22, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', padding: '52px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 280 }}>
        <h3 style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 10 }}>Не нашли нужную конфигурацию?</h3>
        <p style={{ fontSize: 16.5, color: '#8aa3a2', lineHeight: 1.6, maxWidth: 560 }}>
          Соберём индивидуальное решение под вашу задачу и подготовим коммерческое предложение. Личный менеджер для каждого клиента.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 14, flexShrink: 0 }}>
        <Btn variant="teal" size="lg" icon="doc" onClick={() => onNav('rfq')}>Запросить КП</Btn>
      </div>
    </div>
  );
}

Object.assign(window, { ShopHome });
