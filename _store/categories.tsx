import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CategoriesState {
  categories: string[];
  setCategories: (categories: string[]) => void;
}

export const useCategories = create<CategoriesState>()(
  persist(
    (set) => ({
      categories: [],
      setCategories: (categories: string[]) => set({ categories }),
    }),
    {
      name: "categories",
    }
  )
);