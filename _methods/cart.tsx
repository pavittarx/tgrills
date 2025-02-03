import type { CartItem, Product } from "@/_types";

export const mergeCartAndProducts = (
  items: CartItem[],
  products: Product[]
) => {
  const cartItems = items.map((item) => {
    const product = products.find((p) => p.id === item.id)!;
    return {
      ...item,
      ...product,
    };
  });

  return cartItems;
};

export const calculateOrderTotals = (
  items: CartItem[],
  products: Product[]
) => {
  const totals = items.reduce(
    (accumulator, current) => {
      const product = products.find((p) => p.id === current.id)!;

      accumulator.subtotal += parseFloat(product.price);
      accumulator.discount +=
        parseFloat(product.price) - parseFloat(product.discount);
      accumulator.total += parseFloat(product.discount || product.price);

      return accumulator;
    },
    {
      subtotal: 0,
      discount: 0,
      discountPct: 0,
      taxes: 0,
      total: 0,
    }
  );

  totals.discountPct = (totals.discount / totals.subtotal) * 100;
  totals.taxes = totals.total * 0.05;
  totals.total += totals.taxes;

  return totals;
};
