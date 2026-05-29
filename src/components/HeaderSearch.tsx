"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

export function HeaderSearch() {
  const router = useRouter();
  const [q, setQ] = React.useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/catalog?q=${encodeURIComponent(term)}` : "/catalog");
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      className="hide-mobile"
      style={{
        flex: 1,
        maxWidth: 420,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        padding: "0 14px",
        height: 42,
      }}
    >
      <Icon name="search" size={17} stroke="#6c8584" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Поиск по каталогу: сервер, СХД, GPU…"
        aria-label="Поиск по каталогу"
        style={{
          flex: 1,
          background: "none",
          border: "none",
          outline: "none",
          color: "#fff",
          fontSize: 14,
        }}
      />
    </form>
  );
}
