"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Badge } from "@/components/Badge";
import { useCart } from "./CartProvider";
import { formatRub, pluralPositions } from "@/lib/site";
import type { Invoice } from "@/lib/payment";

type Step = "cart" | "checkout" | "done";

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

const qtyBtn: React.CSSProperties = {
  width: 34,
  height: 36,
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#cfe3e2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export function CartClient() {
  const { cart, setQty, removeFromCart, clearCart, hydrated } = useCart();
  const [step, setStep] = React.useState<Step>("cart");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ orderNumber: string; invoice: Invoice } | null>(null);

  const [form, setForm] = React.useState({
    company: "",
    inn: "",
    contact: "",
    phone: "",
    email: "",
    city: "",
    deliveryMethod: "Самовывоз (Москва)",
    address: "",
    paymentMethod: "Безналичный расчёт (для юр. лиц)",
  });

  const priced = cart.filter((i) => i.product.price != null);
  const rfqItems = cart.filter((i) => i.product.price == null);
  const total = priced.reduce((s, i) => s + (i.product.price || 0) * i.qty, 0);

  async function submit() {
    setError(null);
    if (!form.contact.trim() || !form.email.trim()) {
      setError("Укажите контактное лицо и email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((l) => ({ slug: l.product.slug, qty: l.qty })),
          customer: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не удалось оформить заявку.");
        return;
      }
      setResult({ orderNumber: data.orderNumber, invoice: data.invoice });
      clearCart();
      setStep("done");
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  // Avoid hydration mismatch: render nothing meaningful until hydrated.
  if (!hydrated) {
    return <div className="container" style={{ padding: "80px 32px", color: "#6c8584" }}>Загрузка…</div>;
  }

  if (step === "done" && result) {
    return (
      <div className="container" style={{ maxWidth: 680, padding: "80px 32px", textAlign: "center" }}>
        <div style={{ width: 76, height: 76, borderRadius: 999, background: "rgba(40,180,110,0.15)", border: "1px solid rgba(40,180,110,0.35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Icon name="check" size={34} stroke="#46c98a" sw={2.5} />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Заявка оформлена!</h1>
        <p style={{ fontSize: 15, color: "#8aa3a2", lineHeight: 1.6, marginBottom: 8 }}>
          Номер заявки: <strong style={{ color: "#cfe3e2" }}>{result.orderNumber}</strong>
        </p>
        <p style={{ fontSize: 16, color: "#8aa3a2", lineHeight: 1.6, marginBottom: 24 }}>
          Личный менеджер свяжется с вами в ближайшее рабочее время, подтвердит наличие и выставит счёт в рублях по курсу ЦБ РФ.
        </p>
        {result.invoice.totalWithVat > 0 && (
          <div style={{ textAlign: "left", maxWidth: 460, margin: "0 auto 28px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 14, padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#6c8584", marginBottom: 14 }}>Счёт-заготовка</div>
            <SumRow label="Сумма без НДС" value={formatRub(result.invoice.netAmount)} />
            <SumRow label={`НДС ${result.invoice.vatRate}%`} value={formatRub(result.invoice.vatAmount)} />
            <div style={{ height: 1, background: "var(--border)", margin: "12px 0" }} />
            <SumRow label="Итого с НДС" value={formatRub(result.invoice.totalWithVat)} bold />
            <p style={{ fontSize: 11.5, color: "#6c8584", marginTop: 12, lineHeight: 1.5 }}>{result.invoice.note}</p>
          </div>
        )}
        <Link href="/" className="btn btn-teal btn-md">На главную <Icon name="arrow" size={17} sw={2.2} /></Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: "80px 32px", textAlign: "center" }}>
        <Icon name="cart" size={48} stroke="#3e5453" />
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginTop: 20 }}>Корзина пуста</h1>
        <p style={{ fontSize: 15, color: "#8aa3a2", marginTop: 10, marginBottom: 28 }}>Добавьте оборудование из каталога или запросите КП на нужную конфигурацию.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/catalog" className="btn btn-teal btn-md">В каталог <Icon name="arrow" size={17} sw={2.2} /></Link>
          <Link href="/rfq" className="btn btn-outline btn-md">Запросить КП</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "36px 32px 80px" }}>
      <h1 style={{ fontSize: 34, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 8 }}>
        {step === "cart" ? "Корзина" : "Оформление заявки"}
      </h1>
      <p style={{ fontSize: 14, color: "#6c8584", marginBottom: 28 }}>{cart.length} {pluralPositions(cart.length)} в заявке</p>

      <div className="cart-layout">
        <div>
          {step === "cart" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cart.map((i) => (
                <div key={i.product.slug} style={{ display: "flex", gap: 16, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 14, padding: 16 }}>
                  <div style={{ width: 84, height: 84, borderRadius: 11, background: "radial-gradient(ellipse at 50% 40%, #112a44, #0a141e)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={i.product.categoryIcon} size={38} stroke="var(--accent)" sw={1.2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: "#6c8584", marginBottom: 3 }}>{i.product.vendorName} · {i.product.categoryName}</div>
                    <Link href={`/product/${i.product.slug}`} style={{ fontSize: 15.5, fontWeight: 600, color: "#fff", marginBottom: 4, display: "block" }}>{i.product.name}</Link>
                    <div style={{ fontSize: 16, fontWeight: 700, color: i.product.price != null ? "#fff" : "#5bd0ce" }}>{formatRub(i.product.price)}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <button onClick={() => removeFromCart(i.product.slug)} aria-label="Удалить" style={{ background: "none", border: "none", color: "#6c8584", cursor: "pointer", padding: 4 }}>
                      <Icon name="trash" size={18} />
                    </button>
                    {i.product.price != null ? (
                      <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9, overflow: "hidden" }}>
                        <button onClick={() => setQty(i.product.slug, i.qty - 1)} style={qtyBtn} aria-label="Меньше"><Icon name="minus" size={14} /></button>
                        <span style={{ width: 36, textAlign: "center", color: "#fff", fontSize: 14, fontWeight: 600 }}>{i.qty}</span>
                        <button onClick={() => setQty(i.product.slug, i.qty + 1)} style={qtyBtn} aria-label="Больше"><Icon name="plus" size={14} /></button>
                      </div>
                    ) : (
                      <Badge tone="teal">по запросу</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <CheckoutForm form={form} setForm={setForm} />
          )}
        </div>

        <aside style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 18 }}>Итого</h2>
          {priced.length > 0 && <SumRow label={`Товары (${priced.length})`} value={formatRub(total)} />}
          {rfqItems.length > 0 && <SumRow label={`По запросу (${rfqItems.length})`} value="по КП" muted />}
          <SumRow label="НДС 22%" value="включён" muted />
          <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ fontSize: 15, color: "#cfe3e2", fontWeight: 600 }}>К оплате</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>{total > 0 ? formatRub(total) : "по КП"}</span>
          </div>
          <p style={{ fontSize: 11.5, color: "#6c8584", marginBottom: 20, lineHeight: 1.5 }}>
            Расчёт в рублях по курсу ЦБ РФ на день платежа. Точная сумма — в счёте от менеджера.
          </p>
          {error && <p style={{ fontSize: 13, color: "#e88", marginBottom: 12 }}>{error}</p>}
          {step === "cart" ? (
            <button onClick={() => setStep("checkout")} className="btn btn-teal btn-lg btn-full">Оформить заявку <Icon name="arrow" size={17} sw={2.2} /></button>
          ) : (
            <button onClick={submit} disabled={submitting} className="btn btn-teal btn-lg btn-full">
              {submitting ? "Отправка…" : "Отправить заявку"} <Icon name="check" size={17} sw={2.2} />
            </button>
          )}
          {step === "checkout" && (
            <button onClick={() => setStep("cart")} style={{ background: "none", border: "none", color: "#8aa3a2", fontSize: 13.5, cursor: "pointer", marginTop: 14, width: "100%" }}>
              ← Вернуться в корзину
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, fontSize: 12, color: "#6c8584" }}>
            <Icon name="shield" size={15} stroke="var(--accent)" /> Официальный договор с НДС
          </div>
        </aside>
      </div>
    </div>
  );
}

function SumRow({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
      <span style={{ fontSize: 13.5, color: "#8aa3a2" }}>{label}</span>
      <span style={{ fontSize: bold ? 16 : 13.5, color: muted ? "#6c8584" : "#e2eeee", fontWeight: bold ? 700 : 500 }}>{value}</span>
    </div>
  );
}

type FormState = {
  company: string; inn: string; contact: string; phone: string; email: string;
  city: string; deliveryMethod: string; address: string; paymentMethod: string;
};

function CheckoutForm({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const section = (title: string, children: React.ReactNode) => (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 18, display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ width: 18, height: 2, background: "var(--accent)", borderRadius: 1 }} />{title}
      </h2>
      {children}
    </div>
  );

  const field = (label: string, k: keyof FormState, placeholder: string, full?: boolean) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: full ? "1 / -1" : "auto" }}>
      <label style={{ fontSize: 13, color: "#9fb6b5", fontWeight: 500 }}>{label}</label>
      <input value={form[k]} onChange={set(k)} placeholder={placeholder} style={inputStyle} />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {section("Контактные данные", (
        <div className="field-grid">
          {field("Компания", "company", "ООО «Пример»")}
          {field("ИНН", "inn", "7700000000")}
          {field("Контактное лицо *", "contact", "Иван Иванов")}
          {field("Телефон", "phone", "+7 (___) ___-__-__")}
          {field("Email *", "email", "info@company.ru", true)}
        </div>
      ))}
      {section("Доставка", (
        <div className="field-grid">
          {field("Город", "city", "Москва")}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, color: "#9fb6b5", fontWeight: 500 }}>Способ</label>
            <select value={form.deliveryMethod} onChange={set("deliveryMethod")} style={inputStyle}>
              {["Самовывоз (Москва)", "Транспортная компания", "Доставка до двери"].map((o) => (
                <option key={o} value={o} style={{ background: "#0a141e" }}>{o}</option>
              ))}
            </select>
          </div>
          {field("Адрес", "address", "Улица, дом, офис", true)}
        </div>
      ))}
      {section("Оплата", (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { v: "Безналичный расчёт (для юр. лиц)", s: "Счёт с НДС 22%, оплата по курсу ЦБ РФ. 100% предоплата." },
            { v: "Онлайн-касса (для физ. лиц)", s: "Ссылка на оплату картой через онлайн-кассу." },
            { v: "Отсрочка платежа", s: "Доступна постоянным клиентам по договорённости." },
          ].map((opt) => {
            const on = form.paymentMethod === opt.v;
            return (
              <button key={opt.v} type="button" onClick={() => setForm((f) => ({ ...f, paymentMethod: opt.v }))}
                style={{ display: "flex", gap: 13, alignItems: "flex-start", textAlign: "left", background: on ? "rgba(42,159,158,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${on ? "rgba(42,159,158,0.35)" : "var(--border)"}`, borderRadius: 11, padding: "14px 16px", cursor: "pointer", width: "100%" }}>
                <span style={{ width: 18, height: 18, borderRadius: 999, border: `2px solid ${on ? "var(--accent)" : "rgba(255,255,255,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  {on && <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--accent)" }} />}
                </span>
                <span>
                  <span style={{ display: "block", fontSize: 14.5, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{opt.v}</span>
                  <span style={{ display: "block", fontSize: 12.5, color: "#7e9897", lineHeight: 1.5 }}>{opt.s}</span>
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
