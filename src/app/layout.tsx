import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { JsonLd, organizationLd, localBusinessLd, websiteLd } from "@/lib/jsonld";
import { SITE_URL, COMPANY } from "@/lib/site";

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cashes Green Rus — серверное и AI-оборудование напрямую с заводов",
    template: "%s — Cashes Green Rus",
  },
  description:
    "Серверы, СХД, сетевое оборудование и GPU-системы от мировых вендоров. Только оригиналы, гарантия 1 год, расчёт в рублях по курсу ЦБ РФ с НДС 22%.",
  applicationName: COMPANY.brand,
  authors: [{ name: COMPANY.legalName }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: COMPANY.brand,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body>
        <JsonLd data={organizationLd()} />
        <JsonLd data={localBusinessLd()} />
        <JsonLd data={websiteLd()} />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
