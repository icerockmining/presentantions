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

  const lead = await prisma.lead.create({
    data: {
      company: body.company || null,
      contact: body.contact,
      email: body.email,
      phone: body.phone || null,
      category: body.category || null,
      message: body.message || null,
      status: "new",
    },
  });

  // Email-to-manager stub.
  console.log(`[lead] new ${lead.id} ${body.email}`);

  return NextResponse.json({ ok: true, id: lead.id });
}
