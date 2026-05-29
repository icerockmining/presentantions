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
  if (items.length === 0) {
    return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
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

  for (const line of items) {
    const p = bySlug.get(line.slug);
    if (!p) continue;
    const qty = Math.max(1, Math.floor(line.qty || 1));
    if (p.price != null) {
      pricedLines.push({ name: p.name, qty, unitPrice: p.price, total: p.price * qty });
      storedItems.push({ slug: p.slug, name: p.name, qty, price: p.price, rfq: false });
    } else {
      storedItems.push({ slug: p.slug, name: p.name, qty, price: null, rfq: true });
    }
  }

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

  const invoice = buildInvoice(number, pricedLines);
  const payment = await stubPaymentProvider.createPayment({ orderNumber: number, amount: total });

  // Email-to-manager is a stub: log server-side.
  console.log(`[order] new ${number} total=${total} contact=${customer.email}`);

  return NextResponse.json({
    ok: true,
    orderNumber: order.number,
    invoice,
    payment,
  });
}
