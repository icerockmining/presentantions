"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { useCart } from "./CartProvider";

function CountDot({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span
      style={{
        position: "absolute",
        top: 2,
        right: 2,
        minWidth: 16,
        height: 16,
        padding: "0 4px",
        background: "var(--accent)",
        color: "#fff",
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {n}
    </span>
  );
}

export function CartBadge() {
  const { cartCount, hydrated } = useCart();
  return (
    <Link
      href="/cart"
      aria-label="Корзина"
      style={{ position: "relative", padding: 8, color: "#fff", display: "flex" }}
    >
      <Icon name="cart" size={21} />
      {hydrated && <CountDot n={cartCount} />}
    </Link>
  );
}

export function CompareBadge() {
  const { compare, hydrated } = useCart();
  return (
    <Link
      href="/compare"
      aria-label="Сравнение"
      className="hide-mobile"
      style={{ position: "relative", padding: 8, color: "#9fb6b5", display: "flex" }}
    >
      <Icon name="compare" size={21} />
      {hydrated && <CountDot n={compare.length} />}
    </Link>
  );
}
