// Payment is a STUB in v1. We define an extension point (PaymentProvider) and a
// no-op stub. Real providers (ЮKassa, online till, etc.) plug in later.

import { VAT_RATE } from "./site";

export type InvoiceLine = {
  name: string;
  qty: number;
  unitPrice: number;
  total: number;
};

export type Invoice = {
  orderNumber: string;
  issuedAt: string;
  currency: "RUB";
  vatRate: number;
  vatIncluded: boolean;
  totalWithVat: number;
  vatAmount: number;
  netAmount: number;
  lines: InvoiceLine[];
  note: string;
};

export interface PaymentProvider {
  readonly name: string;
  // Prepare a payment for an order. Stub returns a manual-invoice instruction.
  createPayment(input: { orderNumber: string; amount: number }): Promise<{
    status: "manual_invoice" | "pending" | "paid";
    instructions: string;
  }>;
}

export const stubPaymentProvider: PaymentProvider = {
  name: "stub-manual-invoice",
  async createPayment({ orderNumber }) {
    return {
      status: "manual_invoice",
      instructions: `Менеджер выставит счёт по заказу ${orderNumber} в рублях по курсу ЦБ РФ с НДС ${VAT_RATE}%. Оплата по реквизитам из счёта.`,
    };
  },
};

// VAT 22% is INCLUDED in the gross total. Extract net + vat from the gross.
export function buildInvoice(orderNumber: string, lines: InvoiceLine[]): Invoice {
  const totalWithVat = lines.reduce((s, l) => s + l.total, 0);
  const netAmount = Math.round(totalWithVat / (1 + VAT_RATE / 100));
  const vatAmount = totalWithVat - netAmount;
  return {
    orderNumber,
    issuedAt: new Date().toISOString(),
    currency: "RUB",
    vatRate: VAT_RATE,
    vatIncluded: true,
    totalWithVat,
    vatAmount,
    netAmount,
    lines,
    note: `Расчёт в рублях по курсу ЦБ РФ на день платежа. НДС ${VAT_RATE}% включён в стоимость. 100% предоплата.`,
  };
}

export function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CGR-${y}-${rand}`;
}
