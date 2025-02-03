import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/_types";

interface ProductState {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export const useProducts = create<ProductState>()(
  persist(
    (set) => ({
      products: [],
      setProducts: (products: Product[]) => set({ products }),
    }),
    {
      name: "products-store",
    }
  )
);
