import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Badge } from "@/components/Badge";
import { PageHead, CtaStrip } from "@/components/sections";
import { JsonLd, breadcrumbLd } from "@/lib/jsonld";
import { SITE_URL, COMPANY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Доставка и логистика",
  description:
    "Два пути получить оборудование: со склада в Москве сразу или под заказ — прямой импорт с заводов за 57 дней. Полная отчётность на каждом этапе.",
  alternates: { canonical: `${SITE_URL}/delivery` },
  openGraph: { url: `${SITE_URL}/delivery` },
};

const STEPS = [
  { n: "01", t: "Заявка и подбор", s: "Оставляете заявку или заказ. Менеджер уточняет конфигурацию и проверяет наличие на складе в Москве или у вендора." },
  { n: "02", t: "Счёт и оплата", s: "Выставляем счёт в рублях по курсу ЦБ РФ с НДС 22%. После оплаты запускаем поставку." },
  { n: "03", t: "Поставка", s: "Со склада в Москве — сразу. Под заказ из Китая и других стран — в среднем 57 дней, в 63% случаев раньше." },
  { n: "04", t: "Проверка и отгрузка", s: "Проверяем оборудование до отгрузки, высылаем логи с серверов. Отгружаем именно то, что в договоре." },
];

const FAQ = [
  { q: "Сколько идёт поставка под заказ?", a: "В среднем 57 дней. В 63% случаев оборудование приходит раньше срока." },
  { q: "Что есть в наличии?", a: "Часть позиций всегда на складе в Москве — отгрузка сразу, без ожидания импорта." },
  { q: "Как проходит проверка?", a: "Проверяем оборудование до отгрузки и высылаем логи с серверов заказчику." },
];

export default function DeliveryPage() {
  return (
    <div className="container" style={{ padding: "36px 32px 80px" }}>
      <JsonLd data={breadcrumbLd([{ name: "Главная", url: "/" }, { name: "Доставка", url: "/delivery" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <PageHead
        eyebrow="Доставка"
        title="Доставка и логистика"
        crumbLabel="Доставка"
        lead="Два пути получить оборудование: сразу со склада в Москве, если товар в наличии, или под заказ — прямой импорт с заводов Китая и других стран."
      />

      <div className="grid-2" style={{ marginBottom: 48 }}>
        <div style={{ background: "linear-gradient(135deg, rgba(42,159,158,0.12), rgba(0,90,89,0.06))", border: "1px solid rgba(42,159,158,0.3)", borderRadius: 18, padding: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: "rgba(42,159,158,0.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
            <Icon name="storage" size={26} stroke="var(--accent)" sw={1.6} />
          </div>
          <Badge tone="green">В наличии · отгрузка сразу</Badge>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "14px 0 10px" }}>Со склада в Москве</h2>
          <p style={{ fontSize: 15, color: "#9fb6b5", lineHeight: 1.65, marginBottom: 18 }}>
            Часть позиций всегда в наличии на нашем складе. Самовывоз из офиса на Смирновской или доставка по Москве и РФ в кратчайшие сроки — без ожидания импорта.
          </p>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13.5, color: "#cfe3e2" }}>
            <Icon name="globe" size={16} stroke="var(--accent)" sw={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
            {COMPANY.address}, {COMPANY.city} · {COMPANY.hours}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 18, padding: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
            <Icon name="truck" size={26} stroke="var(--accent)" sw={1.6} />
          </div>
          <Badge tone="teal">Под заказ · 57 дней</Badge>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "14px 0 10px" }}>Прямой импорт с заводов</h2>
          <p style={{ fontSize: 15, color: "#9fb6b5", lineHeight: 1.65, marginBottom: 18 }}>
            Везём напрямую из Китая и других стран. Управляем цепочкой от завода-изготовителя до вашей двери: документы, таможня, сертификация — с отчётностью на каждом этапе.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            <div><div style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>57 дней</div><div style={{ fontSize: 12.5, color: "#6c8584" }}>средний срок</div></div>
            <div><div style={{ fontSize: 26, fontWeight: 800, color: "var(--accent)" }}>63%</div><div style={{ fontSize: 12.5, color: "#6c8584" }}>приходит раньше</div></div>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 24 }}>Как проходит поставка</h2>
      <div className="grid-4" style={{ marginBottom: 48 }}>
        {STEPS.map((s) => (
          <div key={s.n} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: "var(--accent)", marginBottom: 12 }}>{s.n}</div>
            <div style={{ fontSize: 16.5, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{s.t}</div>
            <div style={{ fontSize: 13.5, color: "#8aa3a2", lineHeight: 1.55 }}>{s.s}</div>
          </div>
        ))}
      </div>

      <CtaStrip title="Нужна срочная поставка?" sub="Проверим наличие на складе и рассчитаем сроки." />
    </div>
  );
}
