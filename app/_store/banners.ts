import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Banner = {
  top: string[];
  middle: string[];
  bottom: string[];
};

interface BannersState {
  top: string[];
  middle: string[];
  bottom: string[];
  setTop: (banners: string[]) => void;
  setMiddle: (banners: string[]) => void;
  setBottom: (banners: string[]) => void;
  setBanners: (banners: Banner) => void;
}

export const useBanners = create<BannersState>()((set) => ({
  top: [],
  middle: [],
  bottom: [],
  setBanners: (banners: Banner) => set(banners),
  setTop: (banners: string[]) => set({ banners }),
  setMiddle: (banners: string[]) => set({ banners }),
  setBottom: (banners: string[]) => set({ banners }),
}));
