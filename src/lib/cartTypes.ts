// Shared, serializable shapes used by client cart/compare and order API.

export type CartProductSnapshot = {
  slug: string;
  name: string;
  price: number | null;
  vendorName: string;
  categoryName: string;
  categoryIcon: string;
};

export type CartLine = {
  product: CartProductSnapshot;
  qty: number;
};
