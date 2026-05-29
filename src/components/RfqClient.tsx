"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/Icon";

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 9,
  padding: "11px 13px",
  color: "#fff",
  fontSize: 14,
  outline: "none",
  width: "100%",
};

const CATS = ["Серверы", "СХД", "Сетевое оборудование", "GPU / AI", "Комплектующие / ЗИП", "Комплексный проект"];

export function RfqClient() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  const [form, setForm] = React.useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    category: CATS[0],
    message: productSlug ? `Интересует товар: ${productSlug}` : "",
  });
  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit() {
    setError(null);
    if (!form.contact.trim() || !form.email.trim()) {
      setError("Укажите контактное лицо и email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не удалось отправить запрос.");
        return;
      }
      setSent(true);
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="container" style={{ maxWidth: 680, padding: "80px 32px", textAlign: "center" }}>
        <div style={{ width: 76, height: 76, borderRadius: 999, background: "rgba(40,180,110,0.15)", border: "1px solid rgba(40,180,110,0.35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Icon name="check" size={34} stroke="#46c98a" sw={2.5} />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Запрос отправлен!</h1>
        <p style={{ fontSize: 16, color: "#8aa3a2", lineHeight: 1.6, marginBottom: 28 }}>
          Эксперты подберут оборудование под вашу задачу и подготовят коммерческое предложение в рублях. Ответим на{" "}
          <strong style={{ color: "#cfe3e2" }}>inquiry@cashesgreen.ru</strong>.
        </p>
        <Link href="/" className="btn btn-teal btn-md">На главную <Icon name="arrow" size={17} sw={2.2} /></Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "36px 32px 80px" }}>
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span>/</span>
        <span style={{ color: "#9fb6b5" }}>Запрос КП</span>
      </nav>
      <div className="split-2">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
            <span style={{ width: 22, height: 2, background: "var(--accent)", borderRadius: 1 }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)" }}>Под заказ</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 18 }}>Запросить коммерческое предложение</h1>
          <p style={{ fontSize: 16.5, color: "#8aa3a2", lineHeight: 1.65, marginBottom: 32 }}>
            Опишите задачу или укажите нужное оборудование — соберём индивидуальную конфигурацию, проверим наличие у вендоров и подготовим КП в рублях по курсу ЦБ РФ.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: "bolt", t: "Ответ в течение рабочего дня", s: "Личный менеджер для каждого клиента" },
              { icon: "shield", t: "Только оригиналы", s: "Прямые выходы на заводы, гарантия 1 год" },
              { icon: "doc", t: "Прозрачные условия", s: "Договор с НДС, отчётность на каждом этапе" },
            ].map((it) => (
              <div key={it.t} style={{ display: "flex", gap: 13, alignItems: "center" }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(42,159,158,0.12)", border: "1px solid rgba(42,159,158,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={it.icon} size={20} stroke="var(--accent)" sw={1.7} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{it.t}</div>
                  <div style={{ fontSize: 13, color: "#6c8584", marginTop: 2 }}>{it.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 18, padding: 32 }}>
          <div className="field-grid">
            <Field label="Компания" value={form.company} onChange={set("company")} placeholder="ООО «Пример»" />
            <Field label="Контактное лицо *" value={form.contact} onChange={set("contact")} placeholder="Иван Иванов" />
            <Field label="Email *" value={form.email} onChange={set("email")} placeholder="info@company.ru" />
            <Field label="Телефон" value={form.phone} onChange={set("phone")} placeholder="+7 (___) ___-__-__" />
            <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 13, color: "#9fb6b5", fontWeight: 500 }}>Категория</label>
              <select value={form.category} onChange={set("category")} style={inputStyle}>
                {CATS.map((c) => <option key={c} value={c} style={{ background: "#0a141e" }}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 13, color: "#9fb6b5", fontWeight: 500 }}>Описание задачи</label>
              <textarea value={form.message} onChange={set("message")} placeholder="Опишите конфигурацию, объёмы, сроки и особые требования…" style={{ ...inputStyle, minHeight: 92, resize: "vertical" }} />
            </div>
          </div>
          {error && <p style={{ fontSize: 13, color: "#e88", marginTop: 12 }}>{error}</p>}
          <div style={{ marginTop: 18 }}>
            <button onClick={submit} disabled={submitting} className="btn btn-teal btn-lg btn-full">
              {submitting ? "Отправка…" : "Отправить запрос"} <Icon name="arrow" size={17} sw={2.2} />
            </button>
          </div>
          <p style={{ fontSize: 11.5, color: "#6c8584", textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных</p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, color: "#9fb6b5", fontWeight: 500 }}>{label}</label>
      <input value={value} onChange={onChange} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}
