"use client";

import * as React from "react";
import { setOrderStatus, setLeadStatus } from "./actions";

export const ORDER_STATUSES = ["new", "invoiced", "paid", "shipped", "cancelled"];
export const LEAD_STATUSES = ["new", "processing", "closed"];

const ORDER_LABELS: Record<string, string> = {
  new: "Новый",
  invoiced: "Счёт выставлен",
  paid: "Оплачен",
  shipped: "Отгружен",
  cancelled: "Отменён",
};

const LEAD_LABELS: Record<string, string> = {
  new: "Новая",
  processing: "В работе",
  closed: "Закрыта",
};

const selectStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 8,
  color: "#e2eeee",
  fontSize: 13,
  padding: "6px 10px",
  cursor: "pointer",
};

function StatusSelect({
  id,
  status,
  options,
  labels,
  action,
}: {
  id: string;
  status: string;
  options: string[];
  labels: Record<string, string>;
  action: (fd: FormData) => void;
}) {
  const formRef = React.useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef} action={action} style={{ display: "inline-block" }}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        onChange={() => formRef.current?.requestSubmit()}
        style={selectStyle}
      >
        {options.map((s) => (
          <option key={s} value={s} style={{ background: "#0a141e" }}>
            {labels[s] || s}
          </option>
        ))}
      </select>
    </form>
  );
}

export function OrderStatusSelect({ id, status }: { id: string; status: string }) {
  return <StatusSelect id={id} status={status} options={ORDER_STATUSES} labels={ORDER_LABELS} action={setOrderStatus} />;
}

export function LeadStatusSelect({ id, status }: { id: string; status: string }) {
  return <StatusSelect id={id} status={status} options={LEAD_STATUSES} labels={LEAD_LABELS} action={setLeadStatus} />;
}
