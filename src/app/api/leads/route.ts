import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type IncomingLead = {
  company?: string;
  contact?: string;
  email?: string;
  phone?: string;
  category?: string;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Allow digits, spaces, +, -, (), then require 7–15 digits total.
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;

export async function POST(req: Request) {
  let body: IncomingLead;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  if (!body.contact || !body.email) {
    return NextResponse.json({ error: "Укажите контактное лицо и email" }, { status: 400 });
  }

  const email = body.email.trim();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Некорректный email" }, { status: 400 });
  }
  const phone = (body.phone || "").trim();
  // Phone is optional, but if provided it must look like a real phone (optional
  // leading +, digits and separators) and contain 7–15 digits — reject junk.
  const phoneDigits = phone.replace(/\D/g, "").length;
  if (phone && (!PHONE_RE.test(phone) || phoneDigits < 7 || phoneDigits > 15)) {
    return NextResponse.json({ error: "Некорректный телефон" }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: {
      company: body.company || null,
      contact: body.contact,
      email,
      phone: phone || null,
      category: body.category || null,
      message: body.message || null,
      status: "new",
    },
  });

  // Email-to-manager stub.
  console.log(`[lead] new ${lead.id} ${body.email}`);

  return NextResponse.json({ ok: true, id: lead.id });
}
