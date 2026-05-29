import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Badge } from "@/components/Badge";
import { BtnLink } from "@/components/Btn";
import { PageHead } from "@/components/sections";
import { JsonLd, breadcrumbLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Условия оплаты",
  description:
    "Расчёт в рублях по курсу ЦБ РФ, ОСНО — НДС 22% включён. Безналичный расчёт для юр. лиц, онлайн-касса для физ. лиц, отсрочка постоянным клиентам.",
  alternates: { canonical: `${SITE_URL}/payment` },
  openGraph: { url: `${SITE_URL}/payment` },
};

const METHODS = [
  { icon: "doc", t: "Безналичный расчёт", s: "Для юридических лиц. Счёт с НДС 22%, оплата по курсу ЦБ РФ на день платежа. Полный пакет документов.", tag: "Юр. лица" },
  { icon: "cart", t: "Онлайн-касса", s: "Для физических лиц — отправляем ссылку на оплату картой через онлайн-кассу. Быстро и удобно.", tag: "Физ. лица" },
  { icon: "bolt", t: "Отсрочка платежа", s: "Постоянным клиентам доступна оплата заказа позже — по индивидуальной договорённости.", tag: "Постоянным" },
];

const TERMS: [string, string][] = [
  ["Валюта расчёта", "Рубли РФ по курсу ЦБ РФ на день платежа"],
  ["Налоговый режим", "ОСНО · НДС 22% включён в стоимость"],
  ["Предоплата", "100% по умолчанию. Постоянным клиентам — отсрочка"],
  ["Документы", "Договор, счёт, УПД, оригиналы с завода, таможня, сертификация"],
];

const FAQ = [
  { q: "Какой НДС?", a: "Работаем на ОСНО, НДС 22% включён в стоимость товара." },
  { q: "В какой валюте расчёт?", a: "В рублях по курсу ЦБ РФ на день платежа." },
  { q: "Какая предоплата?", a: "100% по умолчанию. Постоянным клиентам доступна отсрочка по договорённости." },
];

export default function PaymentPage() {
  return (
    <div className="container" style={{ padding: "36px 32px 80px" }}>
      <JsonLd data={breadcrumbLd([{ name: "Главная", url: "/" }, { name: "Оплата", url: "/payment" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <PageHead
        eyebrow="Оплата"
        title="Условия оплаты"
        crumbLabel="Оплата"
        lead="Прозрачно и официально. Расчёт в рублях по курсу ЦБ РФ, строгое соблюдение налогового режима ОСНО — НДС 22% входит в стоимость товара."
      />

      <div className="grid-3" style={{ marginBottom: 48 }}>
        {METHODS.map((m) => (
          <div key={m.t} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 16, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(42,159,158,0.12)", border: "1px solid rgba(42,159,158,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={m.icon} size={22} stroke="var(--accent)" sw={1.7} />
              </div>
              <Badge tone="slate">{m.tag}</Badge>
            </div>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{m.t}</h2>
            <p style={{ fontSize: 14, color: "#8aa3a2", lineHeight: 1.6 }}>{m.s}</p>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "1.3fr 1fr", alignItems: "start" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontSize: 16, fontWeight: 700, color: "#fff" }}>Условия в деталях</div>
          {TERMS.map(([k, v], i) => (
            <div key={k} style={{ display: "flex", gap: 20, padding: "16px 24px", borderTop: i ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ fontSize: 14, color: "#8aa3a2", width: 180, flexShrink: 0 }}>{k}</div>
              <div style={{ fontSize: 14, color: "#e2eeee", fontWeight: 500, lineHeight: 1.5 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "linear-gradient(135deg, rgba(42,159,158,0.12), rgba(0,90,89,0.05))", border: "1px solid rgba(42,159,158,0.25)", borderRadius: 16, padding: 28 }}>
          <Icon name="shield" size={28} stroke="var(--accent)" sw={1.6} />
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "16px 0 10px" }}>Юридическая чистота</h2>
          <p style={{ fontSize: 14.5, color: "#9fb6b5", lineHeight: 1.65, marginBottom: 20 }}>
            Официальный договор с НДС, полное документальное сопровождение сделки. Вы точно знаете, где находится ваше оборудование на каждом этапе.
          </p>
          <BtnLink href="/rfq" variant="light" icon="doc">Запросить счёт</BtnLink>
        </div>
      </div>
    </div>
  );
}
