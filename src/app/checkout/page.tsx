import { redirect } from "next/navigation";

// Checkout is handled inline within the cart flow (contacts → delivery → payment).
export default function CheckoutPage() {
  redirect("/cart");
}
