import type { Metadata } from "next";
import { CartClient } from "@/components/cart/CartClient";

export const metadata: Metadata = {
  title: "Корзина",
  description: "Ваша корзина в Cashes Green Rus.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartClient />;
}
