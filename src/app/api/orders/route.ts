import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildInvoice, generateOrderNumber, stubPaymentProvider, type InvoiceLine } from "@/lib/payment";

type IncomingLine = { slug: string; qty: number };
type IncomingCustomer = {
  company?: string;
  inn?: string;
  contact?: string;
  phone?: string;
  email?: string;
  city?: string;
  deliveryMethod?: string;
  address?: string;
  paymentMethod?: string;
};

const MAX_QTY = 9999;
const MAX_ITEMS = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { items?: IncomingLine[]; customer?: IncomingCustomer };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  const customer = body.customer || {};

  if (!customer.contact || !customer.email) {
    return NextResponse.json({ error: "Укажите контактное лицо и email" }, { status: 400 });
  }
  if (!EMAIL_RE.test(customer.email.trim())) {
    return NextResponse.json({ error: "Некорректный email" }, { status: 400 });
  }
  if (items.length === 0) {
    return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
  }
  if (items.length > MAX_ITEMS) {
    return NextResponse.json({ error: `Слишком много позиций (максимум ${MAX_ITEMS})` }, { status: 400 });
  }

  // Re-price from DB — never trust client-supplied prices.
  const slugs = items.map((i) => i.slug);
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    include: { vendor: true },
  });
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const pricedLines: InvoiceLine[] = [];
  const storedItems: Array<{ slug: string; name: string; qty: number; price: number | null; rfq: boolean }> = [];
  // RFQ (price=null) positions get recorded as a Lead so a manager sees the КП request.
  const rfqItems: Array<{ slug: string; name: string; qty: number }> = [];
  // Positions requested by the client but no longer in the DB (deleted/unpublished).
  const unavailable: string[] = [];

  for (const line of items) {
    const p = bySlug.get(line.slug);
    if (!p) {
      unavailable.push(line.slug);
      continue;
    }
    const qty = Math.min(MAX_QTY, Math.max(1, Math.floor(line.qty || 1)));
    if (p.price != null) {
      pricedLines.push({ name: p.name, qty, unitPrice: p.price, total: p.price * qty });
      storedItems.push({ slug: p.slug, name: p.name, qty, price: p.price, rfq: false });
    } else {
      rfqItems.push({ slug: p.slug, name: p.name, qty });
      storedItems.push({ slug: p.slug, name: p.name, qty, price: null, rfq: true });
    }
  }

  // Nothing matched the DB at all → don't create an empty Order.
  if (pricedLines.length === 0 && rfqItems.length === 0) {
    return NextResponse.json(
      { error: "Запрошенные товары недоступны", unavailable },
      { status: 409 }
    );
  }

  // Helper: build a Lead from RFQ positions (used both for pure-RFQ and mixed carts).
  async function createRfqLead(): Promise<string> {
    const list = rfqItems.map((it) => `• ${it.name} × ${it.qty} (${it.slug})`).join("\n");
    const lead = await prisma.lead.create({
      data: {
        company: customer.company || null,
        contact: customer.contact!,
        email: customer.email!,
        phone: customer.phone || null,
        category: null,
        message: `Запрос КП на товары «Цена по запросу»:\n${list}`,
        status: "new",
      },
    });
    console.log(`[lead] rfq ${lead.id} ${customer.email} items=${rfqItems.length}`);
    return lead.id;
  }

  // Pure RFQ cart (only price=null positions) → create a Lead, NOT a zero-total Order.
  if (pricedLines.length === 0) {
    const leadId = await createRfqLead();
    return NextResponse.json({
      ok: true,
      rfq: true,
      leadId,
      unavailable: unavailable.length ? unavailable : undefined,
    });
  }

  // There is at least one priced position → create the Order.
  const number = generateOrderNumber();
  const total = pricedLines.reduce((s, l) => s + l.total, 0);

  const order = await prisma.order.create({
    data: {
      number,
      status: "new",
      customer: customer as object,
      items: storedItems as object,
      total,
      vatIncluded: true,
    },
  });

  // Mixed cart: also record the RFQ positions as a Lead so they aren't lost.
  let leadId: string | undefined;
  if (rfqItems.length > 0) {
    leadId = await createRfqLead();
  }

  const invoice = buildInvoice(number, pricedLines);
  const payment = await stubPaymentProvider.createPayment({ orderNumber: number, amount: total });

  // Email-to-manager is a stub: log server-side.
  console.log(`[order] new ${number} total=${total} contact=${customer.email}`);

  return NextResponse.json({
    ok: true,
    orderNumber: order.number,
    invoice,
    payment,
    leadId,
    unavailable: unavailable.length ? unavailable : undefined,
  });
}
