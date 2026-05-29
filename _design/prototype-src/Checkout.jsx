// Checkout.jsx — cart + checkout flow + RFQ form
// Exports to window: ShopCart, ShopRfq

function ShopCart({ cart, onQty, onRemove, onNav, accent }) {
  const [step, setStep] = React.useState('cart'); // cart | checkout | done
  const priced = cart.filter(i => i.product.price != null);
  const rfqItems = cart.filter(i => i.product.price == null);
  const total = priced.reduce((s, i) => s + i.product.price * i.qty, 0);

  if (cart.length === 0 && step !== 'done') {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
        <Icon name="cart" size={48} stroke="#3e5453" />
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginTop: 20 }}>Корзина пуста</h1>
        <p style={{ fontSize: 15, color: '#8aa3a2', marginTop: 10, marginBottom: 28 }}>Добавьте оборудование из каталога или запросите КП на нужную конфигурацию.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Btn variant="teal" icon="arrow" onClick={() => onNav('catalog')}>В каталог</Btn>
          <Btn variant="outline" onClick={() => onNav('rfq')}>Запросить КП</Btn>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ width: 76, height: 76, borderRadius: 999, background: 'rgba(40,180,110,0.15)', border: '1px solid rgba(40,180,110,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Icon name="check" size={34} stroke="#46c98a" sw={2.5} />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Заявка оформлена!</h1>
        <p style={{ fontSize: 16, color: '#8aa3a2', lineHeight: 1.6, marginBottom: 28 }}>
          Личный менеджер свяжется с вами в ближайшее рабочее время по телефону или на почту <strong style={{ color: '#cfe3e2' }}>inquiry@cashesgreen.ru</strong>, подтвердит наличие и выставит счёт в рублях по курсу ЦБ РФ.
        </p>
        <Btn variant="teal" icon="arrow" onClick={() => onNav('home')}>На главную</Btn>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 32px 80px' }}>
      <h1 style={{ fontSize: 34, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>{step === 'cart' ? 'Корзина' : 'Оформление заказа'}</h1>
      <p style={{ fontSize: 14, color: '#6c8584', marginBottom: 28 }}>{cart.length} {plural(cart.length)} в заявке</p>

      <div className="shop-cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
        <div>
          {step === 'cart' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cart.map(i => (
                <CartRow key={i.product.id} item={i} onQty={onQty} onRemove={onRemove} accent={accent} />
              ))}
            </div>
          )}
          {step === 'checkout' && <CheckoutForm accent={accent} hasPriced={priced.length > 0} />}
        </div>

        {/* summary */}
        <aside style={{ position: 'sticky', top: 200, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 18 }}>Итого</h3>
          {priced.length > 0 && (
            <Row label={`Товары (${priced.length})`} value={window.formatRub(total)} />
          )}
          {rfqItems.length > 0 && (
            <Row label={`По запросу (${rfqItems.length})`} value="по КП" muted />
          )}
          <Row label="НДС 22%" value="включён" muted />
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <span style={{ fontSize: 15, color: '#cfe3e2', fontWeight: 600 }}>К оплате</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{total > 0 ? window.formatRub(total) : 'по КП'}</span>
          </div>
          <p style={{ fontSize: 11.5, color: '#6c8584', marginBottom: 20, lineHeight: 1.5 }}>
            Расчёт в рублях по курсу ЦБ РФ на день платежа. Точная сумма — в счёте от менеджера.
          </p>
          {step === 'cart'
            ? <Btn variant="teal" full size="lg" icon="arrow" onClick={() => setStep('checkout')}>Оформить заявку</Btn>
            : <Btn variant="teal" full size="lg" icon="check" onClick={() => setStep('done')}>Отправить заявку</Btn>}
          {step === 'checkout' && <button onClick={() => setStep('cart')} style={{ background: 'none', border: 'none', color: '#8aa3a2', fontFamily: 'inherit', fontSize: 13.5, cursor: 'pointer', marginTop: 14, width: '100%' }}>← Вернуться в корзину</button>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, fontSize: 12, color: '#6c8584' }}>
            <Icon name="shield" size={15} stroke={accent} /> Официальный договор с НДС
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, muted }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: 13.5, color: '#8aa3a2' }}>{label}</span>
      <span style={{ fontSize: 13.5, color: muted ? '#6c8584' : '#e2eeee', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function CartRow({ item, onQty, onRemove, accent }) {
  const { product: p, qty } = item;
  return (
    <div style={{ display: 'flex', gap: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16 }}>
      <div style={{ width: 84, height: 84, borderRadius: 11, background: 'radial-gradient(ellipse at 50% 40%, #112a44, #0a141e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={catById(p.cat).icon} size={38} stroke={accent} sw={1.2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: '#6c8584', marginBottom: 3 }}>{vendorById(p.vendor).name} · {catById(p.cat).name}</div>
        <div style={{ fontSize: 15.5, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{p.name}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: p.price ? '#fff' : '#5bd0ce' }}>{window.formatRub(p.price)}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <button onClick={() => onRemove(p.id)} style={{ background: 'none', border: 'none', color: '#6c8584', cursor: 'pointer', padding: 4 }}><Icon name="trash" size={18} /></button>
        {p.price ? (
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, overflow: 'hidden' }}>
            <button onClick={() => onQty(p.id, Math.max(1, qty - 1))} style={{ ...qtyBtn, width: 34, height: 36 }}><Icon name="minus" size={14} /></button>
            <span style={{ width: 36, textAlign: 'center', color: '#fff', fontSize: 14, fontWeight: 600 }}>{qty}</span>
            <button onClick={() => onQty(p.id, qty + 1)} style={{ ...qtyBtn, width: 34, height: 36 }}><Icon name="plus" size={14} /></button>
          </div>
        ) : <Badge tone="teal">по запросу</Badge>}
      </div>
    </div>
  );
}

function CheckoutForm({ accent, hasPriced }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <FormSection title="Контактные данные" accent={accent}>
        <FieldGrid>
          <Field label="Компания" placeholder="ООО «Пример»" />
          <Field label="ИНН" placeholder="7700000000" />
          <Field label="Контактное лицо" placeholder="Иван Иванов" />
          <Field label="Телефон" placeholder="+7 (___) ___-__-__" />
          <Field label="Email" placeholder="info@company.ru" full />
        </FieldGrid>
      </FormSection>
      <FormSection title="Доставка" accent={accent}>
        <FieldGrid>
          <Field label="Город" placeholder="Москва" />
          <Field label="Способ" select options={['Самовывоз (Москва)', 'Транспортная компания', 'Доставка до двери']} />
          <Field label="Адрес" placeholder="Улица, дом, офис" full />
        </FieldGrid>
      </FormSection>
      <FormSection title="Оплата" accent={accent}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PayOption label="Безналичный расчёт (для юр. лиц)" sub="Счёт с НДС 22%, оплата по курсу ЦБ РФ. 100% предоплата." checked accent={accent} />
          <PayOption label="Онлайн-касса (для физ. лиц)" sub="Ссылка на оплату картой через онлайн-кассу." accent={accent} />
          <PayOption label="Отсрочка платежа" sub="Доступна постоянным клиентам по договорённости." accent={accent} />
        </div>
      </FormSection>
    </div>
  );
}

function FormSection({ title, children, accent }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ width: 18, height: 2, background: accent, borderRadius: 1 }} />{title}
      </h3>
      {children}
    </div>
  );
}

function FieldGrid({ children }) {
  return <div className="shop-field-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{children}</div>;
}

function Field({ label, placeholder, full, select, options, textarea }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: full ? '1 / -1' : 'auto' }}>
      <label style={{ fontSize: 13, color: '#9fb6b5', fontWeight: 500 }}>{label}</label>
      {select ? (
        <select style={inputStyle}>{options.map(o => <option key={o} style={{ background: '#0a141e' }}>{o}</option>)}</select>
      ) : textarea ? (
        <textarea placeholder={placeholder} style={{ ...inputStyle, minHeight: 92, resize: 'vertical' }} />
      ) : (
        <input placeholder={placeholder} style={inputStyle} />
      )}
    </div>
  );
}

const inputStyle = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9,
  padding: '11px 13px', color: '#fff', fontFamily: 'inherit', fontSize: 14, outline: 'none', width: '100%',
};

function PayOption({ label, sub, checked, accent }) {
  const [on, setOn] = React.useState(!!checked);
  return (
    <button onClick={() => setOn(!on)} style={{ display: 'flex', gap: 13, alignItems: 'flex-start', textAlign: 'left', background: on ? 'rgba(42,159,158,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${on ? 'rgba(42,159,158,0.35)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 11, padding: '14px 16px', cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>
      <span style={{ width: 18, height: 18, borderRadius: 999, border: `2px solid ${on ? accent : 'rgba(255,255,255,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
        {on && <span style={{ width: 8, height: 8, borderRadius: 999, background: accent }} />}
      </span>
      <span>
        <span style={{ display: 'block', fontSize: 14.5, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{label}</span>
        <span style={{ display: 'block', fontSize: 12.5, color: '#7e9897', lineHeight: 1.5 }}>{sub}</span>
      </span>
    </button>
  );
}

// ─── RFQ PAGE ───────────────────────────────────────────────────
function ShopRfq({ onNav, accent }) {
  const [sent, setSent] = React.useState(false);
  if (sent) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ width: 76, height: 76, borderRadius: 999, background: 'rgba(40,180,110,0.15)', border: '1px solid rgba(40,180,110,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Icon name="check" size={34} stroke="#46c98a" sw={2.5} />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Запрос отправлен!</h1>
        <p style={{ fontSize: 16, color: '#8aa3a2', lineHeight: 1.6, marginBottom: 28 }}>Эксперты подберут оборудование под вашу задачу и подготовят коммерческое предложение в рублях. Ответим на <strong style={{ color: '#cfe3e2' }}>inquiry@cashesgreen.ru</strong>.</p>
        <Btn variant="teal" icon="arrow" onClick={() => onNav('home')}>На главную</Btn>
      </div>
    );
  }
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 32px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6c8584', marginBottom: 18 }}>
        <span onClick={() => onNav('home')} style={{ cursor: 'pointer' }}>Главная</span><span>/</span><span style={{ color: '#9fb6b5' }}>Запрос КП</span>
      </div>
      <div className="shop-rfq" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
            <span style={{ width: 22, height: 2, background: accent, borderRadius: 1 }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent }}>Под заказ</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 18 }}>Запросить коммерческое предложение</h1>
          <p style={{ fontSize: 16.5, color: '#8aa3a2', lineHeight: 1.65, marginBottom: 32 }}>
            Опишите задачу или укажите нужное оборудование — соберём индивидуальную конфигурацию, проверим наличие у вендоров и подготовим КП в рублях по курсу ЦБ РФ.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: 'bolt', t: 'Ответ в течение рабочего дня', s: 'Личный менеджер для каждого клиента' },
              { icon: 'shield', t: 'Только оригиналы', s: 'Прямые выходы на заводы, гарантия 1 год' },
              { icon: 'doc', t: 'Прозрачные условия', s: 'Договор с НДС, отчётность на каждом этапе' },
            ].map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 13, alignItems: 'center' }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(42,159,158,0.12)', border: '1px solid rgba(42,159,158,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={it.icon} size={20} stroke={accent} sw={1.7} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{it.t}</div>
                  <div style={{ fontSize: 13, color: '#6c8584', marginTop: 2 }}>{it.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 32 }}>
          <FieldGrid>
            <Field label="Компания" placeholder="ООО «Пример»" />
            <Field label="Контактное лицо" placeholder="Иван Иванов" />
            <Field label="Email" placeholder="info@company.ru" />
            <Field label="Телефон" placeholder="+7 (___) ___-__-__" />
            <Field label="Категория" select options={['Серверы', 'СХД', 'Сетевое оборудование', 'GPU / AI', 'Комплектующие / ЗИП', 'Комплексный проект']} full />
            <Field label="Описание задачи" placeholder="Опишите конфигурацию, объёмы, сроки и особые требования…" textarea full />
          </FieldGrid>
          <div style={{ marginTop: 18 }}>
            <Btn variant="teal" size="lg" full icon="arrow" onClick={() => setSent(true)}>Отправить запрос</Btn>
          </div>
          <p style={{ fontSize: 11.5, color: '#6c8584', textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных</p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ShopCart, ShopRfq });
