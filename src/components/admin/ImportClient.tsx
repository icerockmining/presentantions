"use client";

import * as React from "react";

type RowReport = { line: number; key: string; action: string; message: string };
type Result = {
  delimiter: string;
  summary: { created: number; updated: number; skipped: number; error: number };
  reports: RowReport[];
};

const ACTION_COLOR: Record<string, string> = {
  created: "#46c98a",
  updated: "#5bd0ce",
  skipped: "#b87820",
  error: "#e88",
};

// CSV-injection-safe cell for the downloadable report.
function cell(v: string): string {
  let s = v;
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\r\n;]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function ImportClient() {
  const [file, setFile] = React.useState<File | null>(null);
  const [encoding, setEncoding] = React.useState("auto");
  const [delimiter, setDelimiter] = React.useState("auto");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<Result | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!file) {
      setError("Выберите CSV-файл.");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("encoding", encoding);
      fd.set("delimiter", delimiter);
      const res = await fetch("/api/admin/import", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка импорта.");
        return;
      }
      setResult(data);
    } catch {
      setError("Ошибка сети.");
    } finally {
      setBusy(false);
    }
  }

  function downloadReport() {
    if (!result) return;
    const header = "line,key,action,message";
    const lines = result.reports.map((r) => [String(r.line), r.key, r.action, r.message].map(cell).join(","));
    const csv = "﻿" + [header, ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "import-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <form onSubmit={submit} className="admin-card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 560 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, color: "#9fb6b5" }}>CSV-файл</label>
            <input type="file" accept=".csv,text/csv" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ color: "#cfe3e2" }} />
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, color: "#9fb6b5" }}>Кодировка</label>
              <select value={encoding} onChange={(e) => setEncoding(e.target.value)} className="input" style={{ width: 180 }}>
                <option value="auto">Авто</option>
                <option value="utf-8">UTF-8</option>
                <option value="win1251">Windows-1251</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, color: "#9fb6b5" }}>Разделитель</label>
              <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="input" style={{ width: 180 }}>
                <option value="auto">Авто</option>
                <option value=",">Запятая (,)</option>
                <option value=";">Точка с запятой (;)</option>
                <option value="tab">Табуляция</option>
              </select>
            </div>
          </div>
          {error && <p style={{ fontSize: 13, color: "#e88" }}>{error}</p>}
          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" disabled={busy} className="btn btn-teal btn-md">{busy ? "Импорт…" : "Импортировать"}</button>
            <a href="/api/admin/import/template" className="btn btn-outline btn-md">Скачать шаблон</a>
          </div>
        </div>
      </form>

      {result && (
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 18, fontSize: 14 }}>
              <span style={{ color: "#46c98a" }}>Создано: {result.summary.created}</span>
              <span style={{ color: "#5bd0ce" }}>Обновлено: {result.summary.updated}</span>
              <span style={{ color: "#b87820" }}>Пропущено: {result.summary.skipped}</span>
              <span style={{ color: "#e88" }}>Ошибок: {result.summary.error}</span>
              <span style={{ color: "#6c8584" }}>Разделитель: {result.delimiter === "\t" ? "tab" : result.delimiter}</span>
            </div>
            <button onClick={downloadReport} className="btn btn-outline btn-sm">Скачать отчёт CSV</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table" style={{ minWidth: 600 }}>
              <thead><tr><th>Строка</th><th>Ключ</th><th>Действие</th><th>Сообщение</th></tr></thead>
              <tbody>
                {result.reports.map((r, i) => (
                  <tr key={i}>
                    <td>{r.line}</td>
                    <td>{r.key}</td>
                    <td style={{ color: ACTION_COLOR[r.action] || "#cfe3e2", fontWeight: 600 }}>{r.action}</td>
                    <td>{r.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
