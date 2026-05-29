import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "./Icon";
import { HeaderSearch } from "./HeaderSearch";
import { MobileMenu } from "./MobileMenu";
import { CartBadge, CompareBadge } from "./cart/HeaderBadges";
import { getCategories } from "@/lib/queries";
import { COMPANY } from "@/lib/site";

export async function Header() {
  const categories = await getCategories();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(8,18,28,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* top utility bar */}
      <div className="hide-mobile" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "center" }}>
        <div className="container" style={{ height: 38, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center", fontSize: 12.5, color: "#6c8584" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#7fd8d6" }}>
              <Icon name="storage" size={13} stroke="var(--accent)" sw={2} /> Склад в Москве — товар в наличии
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="shield" size={13} stroke="var(--accent)" sw={2} /> Только оригиналы · гарантия 1 год
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="truck" size={13} stroke="var(--accent)" sw={2} /> Доставка из Китая · 57 дней
            </span>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "center", fontSize: 12.5, color: "#8aa3a2" }}>
            <Link href="/delivery" className="link-muted">Доставка</Link>
            <Link href="/payment" className="link-muted">Оплата</Link>
            <Link href="/blog" className="link-muted">Блог</Link>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="globe" size={13} stroke="#6c8584" sw={2} /> {COMPANY.address.replace("офис 122", "").trim()} · {COMPANY.city}
            </span>
          </div>
        </div>
      </div>

      {/* main bar */}
      <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
        <div className="container" style={{ height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <Link href="/" aria-label="Cashes Green Rus — на главную" style={{ flexShrink: 0, display: "flex" }}>
            <Image src="/logo-wordmark.svg" alt="Cashes Green Rus" width={190} height={26} priority />
          </Link>
          <HeaderSearch />
          <a href={`tel:${COMPANY.phoneHref}`} className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 11, flexShrink: 0 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(42,159,158,0.15)", border: "1px solid rgba(42,159,158,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="phone" size={18} stroke="var(--accent)" sw={2} />
            </div>
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>{COMPANY.phone}</div>
              <div style={{ fontSize: 11.5, color: "#6c8584" }}>{COMPANY.hours} · перезвоним</div>
            </div>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <CompareBadge />
            <a
              href={`tel:${COMPANY.phoneHref}`}
              aria-label="Позвонить"
              className="show-mobile"
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(42,159,158,0.18)",
                border: "1px solid rgba(42,159,158,0.4)",
                color: "var(--accent)",
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <Icon name="phone" size={19} stroke="var(--accent)" sw={2} />
            </a>
            <CartBadge />
            <MobileMenu categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
          </div>
        </div>
      </div>

      {/* category nav */}
      <nav className="hide-mobile" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "center" }} aria-label="Каталог">
        <div className="container" style={{ height: 46, display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/catalog" style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--accent)", color: "#fff", borderRadius: 8, padding: "7px 14px", fontSize: 13.5, fontWeight: 600 }}>
            <Icon name="menu" size={15} sw={2.2} /> Каталог
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/catalog/${c.slug}`} className="link-muted" style={{ fontSize: 14, fontWeight: 500 }}>
              {c.name}
            </Link>
          ))}
          <Link href="/rfq" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>
            <Icon name="doc" size={15} stroke="var(--accent)" /> Запросить КП
          </Link>
        </div>
      </nav>
    </header>
  );
}
