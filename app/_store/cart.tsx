import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from ".";

type Cart = Product & { quantity: number };

interface CartState {
  cart: Cart[];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  addQuantity: (product: Product) => void;
  removeQuantity: (product: Product) => void;
}

const addToCart = (product: Product) => {
  return (state: CartState) => {
    return {
      cart: [...state.cart, { ...product, quantity: 1 }],
    };
  };
};

const removeFromCart = (product: Product) => {
  return (state: CartState) => {
    return {
      cart: state.cart.filter((item) => item.name !== product.name),
    };
  };
};

const addQuantity = (product: Product) => {
  return (state: CartState) => {
    return {
      cart: state.cart.map((item) =>
        item.name === product.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    };
  };
};

const removeQuantity = (product: Product) => {
  return (state: CartState) => {
    return {
      cart: state.cart.map((item) =>
        item.name === product.name
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    };
  };
}


// Store Slice
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      cart: [] as Cart[],
      addToCart: (product: Product) => {
        set(addToCart(product));
      },
      removeFromCart: (product: Product) => set(removeFromCart(product)),
      addQuantity: (product: Product) => set(addQuantity(product)),
      removeQuantity: (product: Product) => set(removeQuantity(product)),
    }),
    { name: "cart" }
  )
);
