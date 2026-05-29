// Pages.jsx — Delivery, Payment, Blog pages
// Exports to window: ShopDelivery, ShopPayment, ShopBlog

function PageHead({ eyebrow, title, lead, accent, onNav }) {
  return (
    <div style={{ marginBottom: 44 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6c8584', marginBottom: 18 }}>
        <span onClick={() => onNav('home')} style={{ cursor: 'pointer' }}>Главная</span><span>/</span><span style={{ color: '#9fb6b5' }}>{title}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
        <span style={{ width: 22, height: 2, background: accent, borderRadius: 1 }} />
        <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent }}>{eyebrow}</span>
      </div>
      <h1 style={{ fontSize: 'clamp(34px,4vw,52px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 16 }}>{title}</h1>
      {lead && <p style={{ fontSize: 18, color: '#8aa3a2', lineHeight: 1.6, maxWidth: 720 }}>{lead}</p>}
    </div>
  );
}

// ─── DELIVERY ───────────────────────────────────────────────────
function ShopDelivery({ onNav, accent }) {
  const steps = [
    { n: '01', t: 'Заявка и подбор', s: 'Оставляете заявку или заказ. Менеджер уточняет конфигурацию и проверяет наличие на складе в Москве или у вендора.' },
    { n: '02', t: 'Счёт и оплата', s: 'Выставляем счёт в рублях по курсу ЦБ РФ с НДС 22%. После оплаты запускаем поставку.' },
    { n: '03', t: 'Поставка', s: 'Со склада в Москве — сразу. Под заказ из Китая и других стран — в среднем 57 дней, в 63% случаев раньше.' },
    { n: '04', t: 'Проверка и отгрузка', s: 'Проверяем оборудование до отгрузки, высылаем логи с серверов. Отгружаем именно то, что в договоре.' },
  ];
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 32px 80px' }}>
      <PageHead eyebrow="Доставка" title="Доставка и логистика" accent={accent} onNav={onNav}
        lead="Два пути получить оборудование: сразу со склада в Москве, если товар в наличии, или под заказ — прямой импорт с заводов Китая и других стран." />

      {/* two modes */}
      <div className="shop-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 48 }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(42,159,158,0.12), rgba(0,90,89,0.06))', border: '1px solid rgba(42,159,158,0.3)', borderRadius: 18, padding: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: 'rgba(42,159,158,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Icon name="storage" size={26} stroke={accent} sw={1.6} />
          </div>
          <Badge tone="green">В наличии · отгрузка сразу</Badge>
          <h3 style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: '14px 0 10px' }}>Со склада в Москве</h3>
          <p style={{ fontSize: 15, color: '#9fb6b5', lineHeight: 1.65, marginBottom: 18 }}>
            Часть позиций всегда в наличии на нашем складе. Самовывоз из офиса на Смирновской или доставка по Москве и РФ в кратчайшие сроки — без ожидания импорта.
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13.5, color: '#cfe3e2' }}>
            <Icon name="globe" size={16} stroke={accent} sw={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
            Смирновская ул., 2, стр. 1, офис 122, Москва · Пн–Пт 10:00–19:00
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Icon name="truck" size={26} stroke={accent} sw={1.6} />
          </div>
          <Badge tone="teal">Под заказ · 57 дней</Badge>
          <h3 style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: '14px 0 10px' }}>Прямой импорт с заводов</h3>
          <p style={{ fontSize: 15, color: '#9fb6b5', lineHeight: 1.65, marginBottom: 18 }}>
            Везём напрямую из Китая и других стран. Управляем цепочкой от завода-изготовителя до вашей двери: документы, таможня, сертификация — с отчётностью на каждом этапе.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            <div><div style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>57 дней</div><div style={{ fontSize: 12.5, color: '#6c8584' }}>средний срок</div></div>
            <div><div style={{ fontSize: 26, fontWeight: 800, color: accent }}>63%</div><div style={{ fontSize: 12.5, color: '#6c8584' }}>приходит раньше</div></div>
          </div>
        </div>
      </div>

      {/* steps */}
      <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 24 }}>Как проходит поставка</h2>
      <div className="shop-grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 48 }}>
        {steps.map(s => (
          <div key={s.n} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: accent, marginBottom: 12 }}>{s.n}</div>
            <div style={{ fontSize: 16.5, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{s.t}</div>
            <div style={{ fontSize: 13.5, color: '#8aa3a2', lineHeight: 1.55 }}>{s.s}</div>
          </div>
        ))}
      </div>

      <CtaStrip onNav={onNav} accent={accent} title="Нужна срочная поставка?" sub="Проверим наличие на складе и рассчитаем сроки." />
    </div>
  );
}

// ─── PAYMENT ────────────────────────────────────────────────────
function ShopPayment({ onNav, accent }) {
  const methods = [
    { icon: 'doc', t: 'Безналичный расчёт', s: 'Для юридических лиц. Счёт с НДС 22%, оплата по курсу ЦБ РФ на день платежа. Полный пакет документов.', tag: 'Юр. лица' },
    { icon: 'cart', t: 'Онлайн-касса', s: 'Для физических лиц — отправляем ссылку на оплату картой через онлайн-кассу. Быстро и удобно.', tag: 'Физ. лица' },
    { icon: 'bolt', t: 'Отсрочка платежа', s: 'Постоянным клиентам доступна оплата заказа позже — по индивидуальной договорённости.', tag: 'Постоянным' },
  ];
  const terms = [
    ['Валюта расчёта', 'Рубли РФ по курсу ЦБ РФ на день платежа'],
    ['Налоговый режим', 'ОСНО · НДС 22% включён в стоимость'],
    ['Предоплата', '100% по умолчанию. Постоянным клиентам — отсрочка'],
    ['Документы', 'Договор, счёт, УПД, оригиналы с завода, таможня, сертификация'],
  ];
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 32px 80px' }}>
      <PageHead eyebrow="Оплата" title="Условия оплаты" accent={accent} onNav={onNav}
        lead="Прозрачно и официально. Расчёт в рублях по курсу ЦБ РФ, строгое соблюдение налогового режима ОСНО — НДС 22% входит в стоимость товара." />

      <div className="shop-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginBottom: 48 }}>
        {methods.map(m => (
          <div key={m.t} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(42,159,158,0.12)', border: '1px solid rgba(42,159,158,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={m.icon} size={22} stroke={accent} sw={1.7} />
              </div>
              <Badge tone="slate">{m.tag}</Badge>
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{m.t}</h3>
            <p style={{ fontSize: 14, color: '#8aa3a2', lineHeight: 1.6 }}>{m.s}</p>
          </div>
        ))}
      </div>

      <div className="shop-grid2" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24, alignItems: 'start' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: 16, fontWeight: 700, color: '#fff' }}>Условия в деталях</div>
          {terms.map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', gap: 20, padding: '16px 24px', borderTop: i ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ fontSize: 14, color: '#8aa3a2', width: 180, flexShrink: 0 }}>{k}</div>
              <div style={{ fontSize: 14, color: '#e2eeee', fontWeight: 500, lineHeight: 1.5 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(42,159,158,0.12), rgba(0,90,89,0.05))', border: '1px solid rgba(42,159,158,0.25)', borderRadius: 16, padding: 28 }}>
          <Icon name="shield" size={28} stroke={accent} sw={1.6} />
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '16px 0 10px' }}>Юридическая чистота</h3>
          <p style={{ fontSize: 14.5, color: '#9fb6b5', lineHeight: 1.65, marginBottom: 20 }}>
            Официальный договор с НДС, полное документальное сопровождение сделки. Вы точно знаете, где находится ваше оборудование на каждом этапе.
          </p>
          <Btn variant="light" icon="doc" onClick={() => onNav('rfq')}>Запросить счёт</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── BLOG ───────────────────────────────────────────────────────
function ShopBlog({ onNav, accent }) {
  const posts = [
    { tag: 'Гайд', cat: 'servers', t: 'Как выбрать стоечный сервер в 2026', s: 'Разбираем форм-факторы, поколения Xeon и EPYC, объём памяти и накопителей под вашу нагрузку.', date: '12 мая', read: '7 мин' },
    { tag: 'AI', cat: 'gpu', t: 'GPU для обучения LLM: H100 против альтернатив', s: 'Сравниваем конфигурации NVIDIA HGX, требования к питанию и охлаждению для AI-кластеров.', date: '6 мая', read: '9 мин' },
    { tag: 'Логистика', cat: 'parts', t: 'Параллельный импорт: что важно знать', s: 'Сроки, документы, гарантия и проверка оригинальности при поставках из Китая.', date: '28 апр', read: '5 мин' },
    { tag: 'СХД', cat: 'storage', t: 'All-Flash или гибрид: что выбрать бизнесу', s: 'Когда оправдан переход на All-Flash и как считать TCO системы хранения.', date: '21 апр', read: '6 мин' },
    { tag: 'Сеть', cat: 'network', t: 'Spine-Leaf для дата-центра: с чего начать', s: 'Базовая архитектура современной сети ЦОД на коммутаторах 100G.', date: '14 апр', read: '8 мин' },
    { tag: 'Сервис', cat: 'servers', t: 'ЗИП-склад: зачем держать запас комплектующих', s: 'Как поддерживать работоспособность устаревшего фонда серверов и не простаивать.', date: '5 апр', read: '4 мин' },
  ];
  const feat = posts[0];
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 32px 80px' }}>
      <PageHead eyebrow="Блог" title="Блог и экспертиза" accent={accent} onNav={onNav}
        lead="Разборы, гайды и новости рынка серверного оборудования от инженеров Cashes Green Rus." />

      {/* featured */}
      <div onClick={() => {}} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 0, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden', marginBottom: 32, cursor: 'pointer' }} className="shop-blog-feat">
        <div style={{ padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}><Badge tone="gold">Рекомендуем</Badge><Badge tone="slate">{feat.tag}</Badge></div>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 14 }}>{feat.t}</h2>
          <p style={{ fontSize: 16, color: '#8aa3a2', lineHeight: 1.6, marginBottom: 22 }}>{feat.s}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13, color: '#6c8584' }}>
            <span>{feat.date}</span><span>·</span><span>{feat.read} чтения</span>
            <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7, color: accent, fontWeight: 600 }}>Читать <Icon name="arrow" size={15} sw={2} /></span>
          </div>
        </div>
        <div style={{ background: 'radial-gradient(ellipse at 60% 40%, #143352 0%, #0a141e 80%)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 280, position: 'relative' }}>
          <Icon name={catById(feat.cat).icon} size={110} stroke={accent} sw={0.8} />
        </div>
      </div>

      {/* grid */}
      <div className="shop-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
        {posts.slice(1).map((p, i) => <BlogCard key={i} post={p} accent={accent} />)}
      </div>

      <div style={{ marginTop: 48 }}><CtaStrip onNav={onNav} accent={accent} title="Подобрать оборудование под задачу?" sub="Эксперты помогут с конфигурацией и подготовят КП." /></div>
    </div>
  );
}

function BlogCard({ post, accent }) {
  const [h, setH] = React.useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: h ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${h ? 'rgba(42,159,158,0.4)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 160ms',
      transform: h ? 'translateY(-3px)' : 'none',
    }}>
      <div style={{ height: 150, background: 'radial-gradient(ellipse at 50% 40%, #112a44, #0a141e)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 14, left: 14 }}><Badge tone="teal">{post.tag}</Badge></div>
        <Icon name={catById(post.cat).icon} size={56} stroke={accent} sw={1} />
      </div>
      <div style={{ padding: 22 }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 9 }}>{post.t}</h3>
        <p style={{ fontSize: 13.5, color: '#8aa3a2', lineHeight: 1.55, marginBottom: 16 }}>{post.s}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: '#6c8584' }}>
          <span>{post.date}</span><span>·</span><span>{post.read}</span>
        </div>
      </div>
    </div>
  );
}

function CtaStrip({ onNav, accent, title, sub }) {
  return (
    <div style={{ borderRadius: 18, border: '1px solid rgba(42,159,158,0.25)', background: 'linear-gradient(120deg, #0a2a29, #07243a)', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
      <div>
        <h3 style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 6 }}>{title}</h3>
        <p style={{ fontSize: 15.5, color: '#9fc4c2' }}>{sub}</p>
      </div>
      <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
        <Btn variant="light" icon="doc" onClick={() => onNav('rfq')}>Запросить КП</Btn>
        <Btn variant="outline" onClick={() => onNav('catalog')}>В каталог</Btn>
      </div>
    </div>
  );
}

// ─── ABOUT ──────────────────────────────────────────────────────
function ShopAbout({ onNav, accent }) {
  const team = [
    { i: 'АС', n: 'Александр Синякин', r: 'Директор', c: '#005A59' },
    { i: 'КИ', n: 'Константин Ивлев', r: 'Главный закупщик', c: '#004342' },
    { i: 'БА', n: 'Баглан Албаев', r: 'Закупщик', c: '#007a78' },
    { i: 'КХ', n: 'Кристина Хрипунова', r: 'Аккаунт менеджер', c: '#2a9f9e' },
    { i: 'МЯ', n: 'Милена Яровая', r: 'Финансовый контролер', c: '#3e5a59' },
    { i: 'СН', n: 'Сергей Нам', r: 'Логист', c: '#5a7d7c' },
    { i: 'ПК', n: 'Павел Костенко', r: 'Логист', c: '#82a3a2' },
  ];
  const docs = [
    'Договор поставки с НДС (ОСНО)', 'Счёт, счёт-фактура и УПД',
    'Таможенные декларации (ГТД)', 'Сертификаты соответствия',
    'Гарантийные обязательства', 'Полный пакет для тендеров и госзакупок',
  ];
  const imports = [
    { icon: 'server', t: 'Серверы', s: 'Стоечные и блейд-серверы Dell, HPE, Lenovo, Huawei' },
    { icon: 'storage', t: 'СХД', s: 'Системы хранения NetApp, Dell, HPE — All-Flash и гибрид' },
    { icon: 'network', t: 'Сетевое', s: 'Коммутаторы и маршрутизаторы Cisco, Huawei' },
    { icon: 'gpu', t: 'GPU / AI', s: 'NVIDIA H100, суперкомпьютеры и AI-кластеры' },
    { icon: 'parts', t: 'Комплектующие', s: 'Память, накопители, редкие запчасти для ЗИП' },
  ];
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 32px 80px' }}>
      <PageHead eyebrow="О компании" title="О нас" accent={accent} onNav={onNav}
        lead="Кэшес Грин Рус — прямой импортёр серверного и AI-оборудования в Россию. Работаем чисто и прозрачно: каждому клиенту предоставляем полный пакет документов." />

      {/* stats band */}
      <div className="shop-grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 48 }}>
        {[['15+','лет на рынке'],['1 млрд+ ₽','оборот в год'],['Склад','в Москве'],['7','вендоров-партнёров']].map(([n,l],i)=>(
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '24px 22px' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{n}</div>
            <div style={{ fontSize: 13.5, color: '#6c8584', marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* direct importer + documents — the key block */}
      <div className="shop-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 48 }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(42,159,158,0.12), rgba(0,90,89,0.05))', border: '1px solid rgba(42,159,158,0.3)', borderRadius: 18, padding: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: 'rgba(42,159,158,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Icon name="globe" size={26} stroke={accent} sw={1.6} />
          </div>
          <h3 style={{ fontSize: 23, fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: '-0.01em' }}>Прямой импортёр в Россию</h3>
          <p style={{ fontSize: 15.5, color: '#9fc4c2', lineHeight: 1.65 }}>
            Везём оборудование напрямую с заводов Китая и других стран. Управляем всей цепочкой — от производителя до вашей двери, с полной прозрачностью на каждом этапе. Без посредников и серых схем.
          </p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Icon name="doc" size={26} stroke={accent} sw={1.6} />
          </div>
          <h3 style={{ fontSize: 23, fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '-0.01em' }}>Полный пакет документов</h3>
          <p style={{ fontSize: 14.5, color: '#9fb6b5', lineHeight: 1.6, marginBottom: 16 }}>
            Предоставляем каждому клиенту все необходимые документы — это упрощает жизнь и помогает участвовать в тендерах и закупках госслужб и крупных частных заказчиков.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {docs.map(d => (
              <div key={d} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: '#cfe3e2' }}>
                <Icon name="check" size={14} stroke={accent} sw={2.4} style={{ flexShrink: 0, marginTop: 2 }} /> {d}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* tenders highlight */}
      <div style={{ borderRadius: 18, border: '1px solid rgba(214,160,40,0.3)', background: 'linear-gradient(120deg, #1c1605, #0a141e 70%)', padding: '28px 34px', marginBottom: 56, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <Icon name="shield" size={30} stroke="#e3b552" sw={1.6} />
        <div style={{ flex: 1, minWidth: 280 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Готовы к тендерам и госзакупкам</h3>
          <p style={{ fontSize: 14.5, color: '#c9b890', lineHeight: 1.55 }}>Юридическая чистота сделки и полный документооборот позволяют нашим партнёрам уверенно участвовать в закупках любого уровня.</p>
        </div>
        <Btn variant="light" icon="doc" onClick={() => onNav('rfq')}>Запросить КП</Btn>
      </div>

      {/* what we import */}
      <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>Что мы возим</h2>
      <p style={{ fontSize: 15.5, color: '#8aa3a2', marginBottom: 24, maxWidth: 640 }}>Полный спектр корпоративного IT-оборудования от мировых производителей.</p>
      <div className="shop-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16, marginBottom: 56 }}>
        {imports.map(it => (
          <button key={it.t} onClick={() => onNav('catalog-' + (it.icon === 'gpu' ? 'gpu' : it.icon === 'parts' ? 'parts' : it.icon === 'storage' ? 'storage' : it.icon === 'network' ? 'network' : 'servers'))}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '24px 18px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Icon name={it.icon} size={28} stroke={accent} sw={1.5} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 5 }}>{it.t}</div>
              <div style={{ fontSize: 12.5, color: '#8aa3a2', lineHeight: 1.5 }}>{it.s}</div>
            </div>
          </button>
        ))}
      </div>

      {/* team */}
      <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>Наша команда</h2>
      <p style={{ fontSize: 15.5, color: '#8aa3a2', marginBottom: 24, maxWidth: 640 }}>Эксперты в закупках, логистике и клиентском сервисе — каждый отвечает за свой этап поставки.</p>
      <div className="shop-team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 14, marginBottom: 56 }}>
        {team.map(m => (
          <div key={m.i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', textAlign: 'center' }}>
            <div style={{ height: 96, background: `linear-gradient(160deg, ${m.c}, #0a141e)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'rgba(255,255,255,0.92)' }}>{m.i}</div>
            <div style={{ padding: '12px 8px 16px' }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff', lineHeight: 1.25, marginBottom: 4 }}>{m.n}</div>
              <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: accent }}>{m.r}</div>
            </div>
          </div>
        ))}
      </div>

      <CtaStrip onNav={onNav} accent={accent} title="Хотите работать с прямым импортёром?" sub="Подберём оборудование и оформим всё прозрачно — с полным пакетом документов." />
    </div>
  );
}

Object.assign(window, { ShopDelivery, ShopPayment, ShopBlog, ShopAbout });
