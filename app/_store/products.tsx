import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Product = {
  id: string;
  name: string;
  image: string;
  description: string;
  discount: string;
  price: string;
  categories: string[];
};

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