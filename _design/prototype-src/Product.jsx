// Product.jsx — product detail page
// Exports to window: ShopProduct

function ShopProduct({ productId, onAdd, onCompare, compareIds, onNav, onOpen, accent }) {
  const { PRODUCTS } = window.SHOP_DATA;
  const p = PRODUCTS.find(x => x.id === productId);
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState('specs');
  if (!p) return null;

  const vendor = vendorById(p.vendor);
  const cat = catById(p.cat);
  const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  const inCompare = compareIds.includes(p.id);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 32px 80px' }}>
      {/* breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6c8584', marginBottom: 24, flexWrap: 'wrap' }}>
        <span onClick={() => onNav('home')} style={{ cursor: 'pointer' }}>Главная</span><span>/</span>
        <span onClick={() => onNav('catalog')} style={{ cursor: 'pointer' }}>Каталог</span><span>/</span>
        <span onClick={() => onNav('catalog-' + p.cat)} style={{ cursor: 'pointer' }}>{cat.name}</span><span>/</span>
        <span style={{ color: '#9fb6b5' }}>{p.name}</span>
      </div>

      <div className="shop-pdp" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, marginBottom: 64 }}>
        {/* gallery */}
        <div>
          <div style={{ position: 'relative', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', background: 'radial-gradient(ellipse at 50% 35%, #143352 0%, #0a141e 78%)', height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: 18, left: 18, display: 'flex', gap: 8 }}>
              {p.badge && <Badge tone={p.badge.includes('Hi-Care') || p.badge.includes('Топ') ? 'gold' : 'teal'}>{p.badge}</Badge>}
              {p.inStock ? <Badge tone="green">В наличии</Badge> : <Badge tone="slate">Под заказ</Badge>}
            </div>
            <div style={{ position: 'absolute', top: 18, right: 18, height: 26 }}>
              <img src={vendor.logo} alt={vendor.name} style={{ height: 22, filter: 'grayscale(1) brightness(2)', opacity: 0.8 }} />
            </div>
            <Icon name={cat.icon} size={150} stroke={accent} sw={0.8} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ flex: 1, height: 78, borderRadius: 12, border: `1px solid ${i === 0 ? 'rgba(42,159,158,0.5)' : 'rgba(255,255,255,0.08)'}`, background: 'radial-gradient(ellipse at 50% 40%, #112a44, #0a141e)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Icon name={cat.icon} size={32} stroke={i === 0 ? accent : '#4a6362'} sw={1.2} />
              </div>
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6c8584', marginBottom: 10 }}>{cat.name} · {vendor.name}</div>
          <h1 style={{ fontSize: 34, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 12 }}>{p.name}</h1>
          <p style={{ fontSize: 16, color: '#8aa3a2', lineHeight: 1.6, marginBottom: 22 }}>{p.subtitle}</p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 26 }}>
            {p.tags.map(t => <span key={t} style={{ fontSize: 12.5, color: '#9fb6b5', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 10px' }}>{t}</span>)}
          </div>

          {/* price box */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
            {p.oldPrice && <div style={{ fontSize: 14, color: '#6c8584', textDecoration: 'line-through', marginBottom: 2 }}>{window.formatRub(p.oldPrice)}</div>}
            <div style={{ fontSize: 34, fontWeight: 700, color: p.price ? '#fff' : '#5bd0ce', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{window.formatRub(p.price)}</div>
            {p.price
              ? <div style={{ fontSize: 13, color: '#6c8584', marginTop: 6 }}>Расчёт в рублях по курсу ЦБ РФ на день платежа · НДС 22% включён</div>
              : <div style={{ fontSize: 13, color: '#8aa3a2', marginTop: 6 }}>Стоимость рассчитывается индивидуально под вашу конфигурацию</div>}

            <div style={{ display: 'flex', gap: 12, marginTop: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              {p.price && (
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, overflow: 'hidden' }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={qtyBtn}><Icon name="minus" size={16} /></button>
                  <span style={{ width: 44, textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 600 }}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} style={qtyBtn}><Icon name="plus" size={16} /></button>
                </div>
              )}
              <Btn variant="teal" size="lg" icon={p.price ? 'cart' : 'doc'} onClick={() => onAdd(p, qty)} style={{ flex: 1, minWidth: 180 }}>
                {p.price ? 'Добавить в корзину' : 'Запросить КП'}
              </Btn>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <Btn variant="outline" size="md" onClick={() => onCompare(p.id)} style={{ flex: 1 }}>
                <Icon name="compare" size={16} /> {inCompare ? 'В сравнении' : 'Сравнить'}
              </Btn>
              <Btn variant="ghost" size="md" onClick={() => onNav('rfq')} style={{ flex: 1 }}>Задать вопрос</Btn>
            </div>
          </div>

          {/* assurances */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: 'shield', t: 'Гарантия 1 год', s: vendor.name === 'Huawei' ? 'Hi-Care до 5 лет' : 'Опц. до 5 лет' },
              { icon: 'truck', t: 'Доставка в РФ', s: 'В среднем 57 дней' },
              { icon: 'check', t: 'Проверка до отгрузки', s: 'Логи с серверов' },
              { icon: 'doc', t: 'Официально', s: 'Договор с НДС' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'center', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 11, padding: '12px 14px' }}>
                <Icon name={a.icon} size={19} stroke={accent} sw={1.7} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{a.t}</div>
                  <div style={{ fontSize: 11.5, color: '#6c8584' }}>{a.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* tabs */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 28, marginBottom: 28 }}>
        {[['specs', 'Характеристики'], ['delivery', 'Доставка и оплата'], ['warranty', 'Гарантия']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            background: 'none', border: 'none', borderBottom: `2px solid ${tab === id ? accent : 'transparent'}`,
            color: tab === id ? '#fff' : '#8aa3a2', fontFamily: 'inherit', fontSize: 15, fontWeight: 600,
            padding: '0 0 14px', cursor: 'pointer', marginBottom: -1,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 760, marginBottom: 64 }}>
        {tab === 'specs' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {Object.entries(p.specs).map(([k, v], i) => (
                <tr key={k} style={{ background: i % 2 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '13px 16px', fontSize: 14, color: '#8aa3a2', width: 240 }}>{k}</td>
                  <td style={{ padding: '13px 16px', fontSize: 14, color: '#fff', fontWeight: 500 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'delivery' && (
          <div style={{ fontSize: 15, color: '#9fb6b5', lineHeight: 1.7 }}>
            <p style={{ marginBottom: 14 }}>Расчёт в рублях по курсу ЦБ РФ на день платежа. Строго соблюдаем налоговый режим (ОСНО) — НДС 22% включён в стоимость.</p>
            <p style={{ marginBottom: 14 }}>Средний срок доставки в РФ — 57 дней, в 63% случаев оборудование приходит раньше срока. Управляем цепочкой от завода-изготовителя до вашей двери с отчётностью на каждом этапе.</p>
            <p>Оплата: 100% предоплата. Постоянным клиентам — отсрочка по договорённости. Физическим лицам — ссылка на оплату через онлайн-кассу.</p>
          </div>
        )}
        {tab === 'warranty' && (
          <div style={{ fontSize: 15, color: '#9fb6b5', lineHeight: 1.7 }}>
            <p style={{ marginBottom: 14 }}>Официальная гарантия 1 год от нашей компании на всё поставляемое оборудование. Опционально — расширение до 5 лет.</p>
            <p style={{ marginBottom: 14 }}>На продукцию Huawei доступна гарантия Hi-Care до 5 лет. По Lenovo — расширенная техподдержка с собственным складом запчастей в России.</p>
            <p>Проверяем весь товар до отгрузки и высылаем логи с серверов, чтобы заказчик убедился: отгружается именно то, что прописано в договоре. Любые несоответствия устраняем за свой счёт.</p>
          </div>
        )}
      </div>

      {/* related */}
      {related.length > 0 && (
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 24 }}>Похожие товары</h2>
          <div className="shop-prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
            {related.map(rp => (
              <ProductCard key={rp.id} product={rp} onOpen={onOpen} onAdd={onAdd} onCompare={onCompare} inCompare={compareIds.includes(rp.id)} accent={accent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const qtyBtn = {
  width: 40, height: 44, background: 'none', border: 'none', cursor: 'pointer',
  color: '#cfe3e2', display: 'flex', alignItems: 'center', justifyContent: 'center',
};

Object.assign(window, { ShopProduct });
