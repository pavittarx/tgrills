import { create } from "zustand";
import { persist } from "zustand/middleware";

type Cart = {
  id: string;
  quantity: number;
};

interface CartState {
  cart: Cart[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  addQuantity: (productId: string) => void;
  removeQuantity: (productId: string) => void;
  clear: () => void;
}

const addToCart = (productId: string) => {
  return (state: CartState) => {
    if (state.cart.some((item) => item.id === productId)) {
      return state;
    }

    return {
      cart: [...state.cart, { id: productId, quantity: 1 }],
    };
  };
};

const removeFromCart = (productId: string) => {
  return (state: CartState) => {
    return {
      cart: state.cart.filter((item) => item.id !== productId),
    };
  };
};

const addQuantity = (productId: string) => {
  return (state: CartState) => {
    return {
      cart: state.cart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    };
  };
};

const removeQuantity = (productId: string) => {
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
      addToCart: (productId: string) => {
        set(addToCart(productId));
      },
      removeFromCart: (productId: string) => set(removeFromCart(productId)),
      addQuantity: (productId: string) => set(addQuantity(productId)),
      removeQuantity: (productId: string) => set(removeQuantity(productId)),
      clear: () => set({ cart: [] as Cart[] }),
    }),
    { name: "cart" }
  )
);
