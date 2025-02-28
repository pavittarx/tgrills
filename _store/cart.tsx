import { create } from "zustand";
import { persist } from "zustand/middleware";

type Cart = {
  id: number;
  quantity: number;
};

interface CartState {
  cart: Cart[];
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  addQuantity: (productId: number) => void;
  removeQuantity: (productId: number) => void;
  clear: () => void;
}

const addToCart = (productId: number) => {
  return (state: CartState) => {
    if (state.cart.some((item) => item.id === productId)) {
      return state;
    }

    return {
      cart: [...state.cart, { id: productId, quantity: 1 }],
    };
  };
};

const removeFromCart = (productId: number) => {
  return (state: CartState) => {
    return {
      cart: state.cart.filter((item) => item.id !== productId),
    };
  };
};

const addQuantity = (productId: number) => {
  return (state: CartState) => {
    return {
      cart: state.cart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    };
  };
};

const removeQuantity = (productId: number) => {
  return (state: CartState) => {
    return {
      cart: state.cart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      ),
    };
  };
};

// Store Slice
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      cart: [] as Cart[],
      addToCart: (productId: number) => {
        set(addToCart(productId));
      },
      removeFromCart: (productId: number) => set(removeFromCart(productId)),
      addQuantity: (productId: number) => set(addQuantity(productId)),
      removeQuantity: (productId: number) => set(removeQuantity(productId)),
      clear: () => set({ cart: [] as Cart[] }),
    }),
    { name: "cart" }
  )
);
