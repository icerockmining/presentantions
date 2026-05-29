"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";

type Cat = { slug: string; name: string };

export function MobileMenu({ categories }: { categories: Cat[] }) {
  const [open, setOpen] = React.useState(false);

  const item = (href: string, label: string, primary = false) => (
    <Link
      key={href + label}
      href={href}
      onClick={() => setOpen(false)}
      style={{
        textAlign: "left",
        background: primary ? "rgba(42,159,158,0.12)" : "none",
        fontSize: 15,
        fontWeight: primary ? 600 : 500,
        padding: "12px 14px",
        borderRadius: 8,
        color: primary ? "#5bd0ce" : "#cfe3e2",
        display: "block",
      }}
    >
      {label}
    </Link>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Меню"
        className="show-mobile"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#fff" }}
      >
        <Icon name={open ? "close" : "menu"} size={22} />
      </button>
      {open && (
        <div
          className="show-mobile"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "100%",
            flexDirection: "column",
            padding: "16px 18px",
            gap: 4,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            background: "#0a141e",
            zIndex: 60,
          }}
        >
          <a
            href="tel:+79042996201"
            onClick={() => setOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(42,159,158,0.12)",
              fontSize: 15,
              fontWeight: 600,
              padding: "12px 14px",
              borderRadius: 8,
              color: "#5bd0ce",
            }}
          >
            <Icon name="phone" size={16} stroke="#5bd0ce" /> 8 (904) 299-62-01
          </a>
          {item("/catalog", "Весь каталог")}
          {categories.map((c) => item(`/catalog/${c.slug}`, c.name))}
          {item("/delivery", "Доставка")}
          {item("/payment", "Оплата")}
          {item("/blog", "Блог")}
          {item("/rfq", "Запросить КП")}
          {item("/compare", "Сравнение")}
          {item("/cart", "Корзина")}
        </div>
      )}
    </>
  );
}
