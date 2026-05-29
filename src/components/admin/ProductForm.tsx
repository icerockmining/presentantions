import * as React from "react";
import Link from "next/link";
import { saveProduct } from "@/app/admin/products/actions";

type Option = { id: string; name: string };
type ProductData = {
  id?: string;
  sku?: string | null;
  name?: string;
  slug?: string;
  subtitle?: string | null;
  categoryId?: string;
  vendorId?: string;
  price?: number | null;
  oldPrice?: number | null;
  badge?: string | null;
  inStock?: boolean;
  stockLocation?: string;
  form?: string | null;
  cpu?: string | null;
  specs?: unknown;
  tags?: string[];
  images?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
};

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: full ? "1 / -1" : "auto" }}>
      <label style={{ fontSize: 13, color: "#9fb6b5", fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  );
}

export function ProductForm({
  product,
  categories,
  vendors,
  error,
}: {
  product?: ProductData;
  categories: Option[];
  vendors: Option[];
  error?: string;
}) {
  const specsValue = product?.specs ? JSON.stringify(product.specs, null, 2) : "{}";

  return (
    <form action={saveProduct} style={{ maxWidth: 760 }}>
      {product?.id && <input type="hidden" name="id" value={product.id} />}
      {error === "specs" && <p style={{ color: "#e88", fontSize: 13, marginBottom: 14 }}>Некорректный JSON в характеристиках.</p>}
      <div className="field-grid" style={{ gap: 16 }}>
        <Field label="Название *"><input name="name" required defaultValue={product?.name || ""} className="input" /></Field>
        <Field label="Slug *"><input name="slug" required defaultValue={product?.slug || ""} className="input" /></Field>
        <Field label="SKU"><input name="sku" defaultValue={product?.sku || ""} className="input" /></Field>
        <Field label="Подзаголовок" full><input name="subtitle" defaultValue={product?.subtitle || ""} className="input" /></Field>
        <Field label="Категория *">
          <select name="categoryId" required defaultValue={product?.categoryId || ""} className="input">
            <option value="" disabled>—</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Вендор *">
          <select name="vendorId" required defaultValue={product?.vendorId || ""} className="input">
            <option value="" disabled>—</option>
            {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </Field>
        <Field label="Цена ₽ (пусто = по запросу)"><input name="price" defaultValue={product?.price ?? ""} className="input" /></Field>
        <Field label="Старая цена ₽"><input name="oldPrice" defaultValue={product?.oldPrice ?? ""} className="input" /></Field>
        <Field label="Badge"><input name="badge" defaultValue={product?.badge || ""} className="input" /></Field>
        <Field label="Склад">
          <select name="stockLocation" defaultValue={product?.stockLocation || "order"} className="input">
            <option value="moscow">moscow (в наличии)</option>
            <option value="order">order (под заказ)</option>
          </select>
        </Field>
        <Field label="Форм-фактор"><input name="form" defaultValue={product?.form || ""} className="input" /></Field>
        <Field label="CPU"><input name="cpu" defaultValue={product?.cpu || ""} className="input" /></Field>
        <Field label="Теги (через | )" full><input name="tags" defaultValue={(product?.tags || []).join(" | ")} className="input" /></Field>
        <Field label="Изображения (URL через | )" full><input name="images" defaultValue={(product?.images || []).join(" | ")} className="input" /></Field>
        <Field label="Характеристики (JSON)" full>
          <textarea name="specs" defaultValue={specsValue} className="input" style={{ minHeight: 160, fontFamily: "monospace", fontSize: 13 }} />
        </Field>
        <Field label="SEO Title" full><input name="seoTitle" defaultValue={product?.seoTitle || ""} className="input" /></Field>
        <Field label="SEO Description" full><input name="seoDescription" defaultValue={product?.seoDescription || ""} className="input" /></Field>
        <Field label="">
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#cfe3e2" }}>
            <input type="checkbox" name="inStock" defaultChecked={product?.inStock ?? true} /> В наличии
          </label>
        </Field>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button type="submit" className="btn btn-teal btn-md">Сохранить</button>
        <Link href="/admin/products" className="btn btn-outline btn-md">Отмена</Link>
      </div>
    </form>
  );
}
