import { Suspense } from "react";
import type { Metadata } from "next";
import { RfqClient } from "@/components/RfqClient";
import { JsonLd, breadcrumbLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Запросить коммерческое предложение",
  description:
    "Опишите задачу — соберём индивидуальную конфигурацию серверного оборудования и подготовим КП в рублях по курсу ЦБ РФ.",
  alternates: { canonical: `${SITE_URL}/rfq` },
  openGraph: { url: `${SITE_URL}/rfq` },
};

export default function RfqPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Главная", url: "/" },
          { name: "Запрос КП", url: "/rfq" },
        ])}
      />
      <Suspense fallback={<div className="container" style={{ padding: "80px 32px", color: "#6c8584" }}>Загрузка…</div>}>
        <RfqClient />
      </Suspense>
    </>
  );
}
