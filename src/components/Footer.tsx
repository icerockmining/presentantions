import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "./Icon";
import { getCategories, getVendors } from "@/lib/queries";
import { COMPANY } from "@/lib/site";

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#4a6362", marginBottom: 16 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}

export async function Footer() {
  const [categories, vendors] = await Promise.all([getCategories(), getVendors()]);

  return (
    <footer style={{ background: "#060d15", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "56px 0 28px", marginTop: 80 }}>
      <div className="container">
        <div className="grid-footer" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, paddingBottom: 36, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <Image src="/logo-wordmark.svg" alt="Cashes Green Rus" width={170} height={23} style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 13.5, color: "#5e7776", lineHeight: 1.65, maxWidth: 300, marginBottom: 16 }}>
              Технологический дистрибьютор серверного и AI-оборудования. Прямые поставки с заводов и продажа со склада в Москве. Оборот более 1 млрд ₽ в год.
            </p>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 16, padding: "12px 14px", background: "rgba(42,159,158,0.08)", border: "1px solid rgba(42,159,158,0.2)", borderRadius: 10, maxWidth: 300 }}>
              <Icon name="globe" size={16} stroke="var(--accent)" sw={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 12.5, color: "#9fb6b5", lineHeight: 1.5 }}>
                <b style={{ color: "#cfe3e2" }}>Офис и склад:</b>
                <br />
                {COMPANY.address}, {COMPANY.city}
              </span>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              {vendors.slice(0, 6).map((v) => (
                <span key={v.id} style={{ fontSize: 12, fontWeight: 700, color: "#3e5453" }}>{v.name}</span>
              ))}
            </div>
          </div>
          <Col title="Каталог">
            {categories.map((c) => (
              <Link key={c.id} href={`/catalog/${c.slug}`} className="link-muted" style={{ fontSize: 13.5, color: "#7e9897" }}>
                {c.name}
              </Link>
            ))}
          </Col>
          <Col title="Покупателю">
            <Link href="/delivery" className="link-muted" style={{ fontSize: 13.5, color: "#7e9897" }}>Доставка</Link>
            <Link href="/payment" className="link-muted" style={{ fontSize: 13.5, color: "#7e9897" }}>Оплата</Link>
            <Link href="/blog" className="link-muted" style={{ fontSize: 13.5, color: "#7e9897" }}>Блог</Link>
            <Link href="/rfq" className="link-muted" style={{ fontSize: 13.5, color: "#7e9897" }}>Запросить КП</Link>
          </Col>
          <Col title="Контакты">
            <a href={`tel:${COMPANY.phoneHref}`} className="link-muted" style={{ fontSize: 13.5, color: "#7e9897" }}>{COMPANY.phone}</a>
            <a href={`mailto:${COMPANY.email}`} className="link-muted" style={{ fontSize: 13.5, color: "#7e9897" }}>{COMPANY.email}</a>
            <span style={{ fontSize: 13.5, color: "#7e9897" }}>Смирновская ул., 2с1, оф. 122</span>
            <span style={{ fontSize: 13.5, color: "#7e9897" }}>{COMPANY.hours}</span>
          </Col>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22, flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 12.5, color: "#3e5453" }}>© 2025 {COMPANY.legalName}. Расчёт в рублях по курсу ЦБ РФ, НДС 22%.</span>
          <span style={{ fontSize: 12.5, color: "#3e5453" }}>{COMPANY.domain}</span>
        </div>
      </div>
    </footer>
  );
}
