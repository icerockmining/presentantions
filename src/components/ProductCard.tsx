import * as React from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { Badge, badgeTone } from "./Badge";
import { CardActions } from "./cart/ProductActions";
import { formatRub } from "@/lib/site";
import type { ProductWithRel } from "@/lib/queries";

export function ProductCard({ product }: { product: ProductWithRel }) {
  const href = `/product/${product.slug}`;
  const tags = (product.tags || []).slice(0, 3);

  return (
    <article className="product-card">
      <Link
        href={href}
        style={{
          height: 168,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at 50% 40%, #112a44 0%, #0a141e 75%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, flexWrap: "wrap", maxWidth: "70%" }}>
          {product.badge && <Badge tone={badgeTone(product.badge)}>{product.badge}</Badge>}
        </div>
        <div style={{ position: "absolute", top: 12, right: 12, fontSize: 12, fontWeight: 700, color: "#6c8584" }}>
          {product.vendor.name}
        </div>
        <div style={{ opacity: 0.9 }}>
          <Icon name={product.category.icon} size={64} stroke="var(--accent)" sw={1.1} />
        </div>
      </Link>

      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1, gap: 10 }}>
        <Link href={href} style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#6c8584", marginBottom: 6 }}>
            {product.category.name}
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 6 }}>{product.name}</h3>
          <p style={{ fontSize: 13, color: "#8aa3a2", lineHeight: 1.5 }}>{product.subtitle}</p>
        </Link>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 11,
                color: "#9fb6b5",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 5,
                padding: "2px 7px",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div style={{ marginTop: 4 }}>
          {product.oldPrice != null && (
            <div style={{ fontSize: 12, color: "#6c8584", textDecoration: "line-through" }}>{formatRub(product.oldPrice)}</div>
          )}
          <div style={{ fontSize: product.price != null ? 20 : 15, fontWeight: 700, color: product.price != null ? "#fff" : "#5bd0ce", lineHeight: 1.2 }}>
            {formatRub(product.price)}
          </div>
          {product.price != null && (
            <div style={{ fontSize: 11, color: "#6c8584", marginTop: 2 }}>по курсу ЦБ РФ · с НДС</div>
          )}
        </div>

        <CardActions
          product={{
            slug: product.slug,
            name: product.name,
            price: product.price,
            vendorName: product.vendor.name,
            categoryName: product.category.name,
            categoryIcon: product.category.icon,
          }}
        />
      </div>
    </article>
  );
}
