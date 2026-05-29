import type { Metadata } from "next";
import { CompareClient } from "@/components/cart/CompareClient";

export const metadata: Metadata = {
  title: "Сравнение товаров",
  description: "Сравнение характеристик серверного оборудования.",
  robots: { index: false, follow: false },
};

export default function ComparePage() {
  return <CompareClient />;
}
