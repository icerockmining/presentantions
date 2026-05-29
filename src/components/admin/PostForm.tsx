import * as React from "react";
import Link from "next/link";
import { savePost } from "@/app/admin/posts/actions";

type Option = { id: string; name: string };
type PostData = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  categoryId?: string | null;
  tag?: string | null;
  readMins?: number;
  publishedAt?: Date;
};

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: full ? "1 / -1" : "auto" }}>
      <label style={{ fontSize: 13, color: "#9fb6b5", fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  );
}

export function PostForm({ post, categories }: { post?: PostData; categories: Option[] }) {
  const date = post?.publishedAt ? post.publishedAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
  return (
    <form action={savePost} style={{ maxWidth: 760 }}>
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      <div className="field-grid" style={{ gap: 16 }}>
        <Field label="Заголовок *" full><input name="title" required defaultValue={post?.title || ""} className="input" /></Field>
        <Field label="Slug *"><input name="slug" required defaultValue={post?.slug || ""} className="input" /></Field>
        <Field label="Тег"><input name="tag" defaultValue={post?.tag || ""} className="input" /></Field>
        <Field label="Категория">
          <select name="categoryId" defaultValue={post?.categoryId || ""} className="input">
            <option value="">—</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Время чтения (мин)"><input name="readMins" defaultValue={post?.readMins ?? 5} className="input" /></Field>
        <Field label="Дата публикации"><input name="publishedAt" type="date" defaultValue={date} className="input" /></Field>
        <Field label="Краткое описание *" full><input name="excerpt" required defaultValue={post?.excerpt || ""} className="input" /></Field>
        <Field label="Текст (абзацы через пустую строку) *" full>
          <textarea name="body" required defaultValue={post?.body || ""} className="input" style={{ minHeight: 240 }} />
        </Field>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button type="submit" className="btn btn-teal btn-md">Сохранить</button>
        <Link href="/admin/posts" className="btn btn-outline btn-md">Отмена</Link>
      </div>
    </form>
  );
}
