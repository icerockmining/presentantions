"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { useCart } from "./CartProvider";
import type { CartProductSnapshot } from "@/lib/cartTypes";

// Compact add-to-cart + compare row used on product cards.
export function CardActions({ product }: { product: CartProductSnapshot }) {
  const { addToCart, toggleCompare, compare, hydrated } = useCart();
  const router = useRouter();
  const inCompare = hydrated && compare.includes(product.slug);

  function handleAdd() {
    if (product.price == null) {
      router.push(`/rfq?product=${encodeURIComponent(product.slug)}`);
    } else {
      addToCart(product, 1);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button type="button" onClick={handleAdd} className="btn btn-teal btn-sm btn-full">
        {product.price == null ? "Запросить" : "В корзину"}
      </button>
      <button
        type="button"
        onClick={() => toggleCompare(product.slug)}
        title="Сравнить"
        aria-label="Добавить к сравнению"
        style={{
          flexShrink: 0,
          width: 38,
          height: 38,
          borderRadius: 9,
          cursor: "pointer",
          background: inCompare ? "var(--accent)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${inCompare ? "var(--accent)" : "rgba(255,255,255,0.12)"}`,
          color: inCompare ? "#fff" : "#9fb6b5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="compare" size={17} />
      </button>
    </div>
  );
}

// Full add-to-cart block used on the product detail page.
export function PdpActions({ product }: { product: CartProductSnapshot }) {
  const { addToCart, toggleCompare, compare, hydrated } = useCart();
  const router = useRouter();
  const [qty, setQty] = React.useState(1);
  const inCompare = hydrated && compare.includes(product.slug);
  const priced = product.price != null;

  function handleAdd() {
    if (!priced) {
      router.push(`/rfq?product=${encodeURIComponent(product.slug)}`);
    } else {
      addToCart(product, qty);
      router.push("/cart");
    }
  }

  const qtyBtn: React.CSSProperties = {
    width: 40,
    height: 44,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#cfe3e2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginTop: 20, alignItems: "center", flexWrap: "wrap" }}>
        {priced && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtn} aria-label="Меньше">
              <Icon name="minus" size={16} />
            </button>
            <span style={{ width: 44, textAlign: "center", color: "#fff", fontSize: 16, fontWeight: 600 }}>{qty}</span>
            <button type="button" onClick={() => setQty((q) => q + 1)} style={qtyBtn} aria-label="Больше">
              <Icon name="plus" size={16} />
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={handleAdd}
          className="btn btn-teal btn-lg"
          style={{ flex: 1, minWidth: 180 }}
        >
          {priced ? "Добавить в корзину" : "Запросить КП"}
          <Icon name={priced ? "cart" : "doc"} size={17} sw={2.2} />
        </button>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button
          type="button"
          onClick={() => toggleCompare(product.slug)}
          className="btn btn-outline btn-md"
          style={{ flex: 1 }}
        >
          <Icon name="compare" size={16} /> {inCompare ? "В сравнении" : "Сравнить"}
        </button>
        <button type="button" onClick={() => router.push("/rfq")} className="btn btn-ghost btn-md" style={{ flex: 1 }}>
          Задать вопрос
        </button>
      </div>
    </div>
  );
}
